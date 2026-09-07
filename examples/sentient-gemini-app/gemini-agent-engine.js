/**
 * Sentient Gemini Agent Engine
 * Multi-Agent Swarm Coordinator powered by Google Gemini
 * Author: Deepxk Jadhav
 */

export class GeminiAgentEngine {
  constructor(apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) {
    if (!apiKey) {
      throw new Error("Missing Google Gemini API Key. Set GOOGLE_API_KEY or GEMINI_API_KEY.");
    }
    this.apiKey = apiKey;
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
    this.primaryModel = "gemini-3-flash-preview";
    this.fallbackModel = "gemini-flash-latest";
  }

  async callGemini(prompt, systemInstruction = "") {
    const modelsToTry = [this.primaryModel, this.fallbackModel, "gemini-2.5-pro"];
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const body = {
          contents: [{ parts: [{ text: prompt }] }]
        };
        if (systemInstruction) {
          body.systemInstruction = { parts: [{ text: systemInstruction }] };
        }

        const res = await fetch(`${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return { text, model };
        } else {
          lastError = new Error(`HTTP ${res.status}: ${await res.text()}`);
        }
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error("Failed to invoke Gemini models.");
  }

  /**
   * Run a 3-agent Sentient Swarm: Architect -> Coder -> Reviewer
   */
  async runSwarm(objective) {
    const startTime = Date.now();
    const trace = [];

    // 1. Architect Agent
    console.log(`[SwarmCoordinator] 🏛️  Dispatching Architect Agent for: "${objective}"...`);
    const archPrompt = `Objective: "${objective}"
Analyze this goal for an AI engineering system. Provide:
1. Core Architectural Requirements
2. System Components & Interfaces
3. Recommended Design Pattern (e.g. Domain-Driven Design, Reactive Pipeline, Microkernel)
Keep response concise and structured.`;
    
    const archRes = await this.callGemini(archPrompt, "You are Sentient Architect Agent. Design clean, modular software systems.");
    trace.push({
      role: "Architect Agent",
      status: "completed",
      model: archRes.model,
      output: archRes.text
    });

    // 2. Coder Agent
    console.log(`[SwarmCoordinator] 💻 Dispatching Coder Agent to implement architecture...`);
    const coderPrompt = `Objective: "${objective}"
Architect's Plan:
${archRes.text}

Write complete, functional, production-ready code (TypeScript or JavaScript) implementing this architecture. Include types, error handling, and comments. Output ONLY the code and brief explanation.`;

    const coderRes = await this.callGemini(coderPrompt, "You are Sentient Coder Agent. You write robust, elegant, production-ready code.");
    trace.push({
      role: "Coder Agent",
      status: "completed",
      model: coderRes.model,
      output: coderRes.text
    });

    // 3. Reviewer Agent
    console.log(`[SwarmCoordinator] 🛡️  Dispatching Reviewer Agent for security and quality audit...`);
    const reviewerPrompt = `Objective: "${objective}"
Code to review:
${coderRes.text}

Perform a rigorous security and quality review:
1. Security Assessment (Check for injection, unhandled exceptions, resource leaks)
2. Quality Score (out of 100)
3. Verdict: PASS or REVISE
4. Summary & Verification recommendation`;

    const reviewerRes = await this.callGemini(reviewerPrompt, "You are Sentient Reviewer Agent. You audit code for OWASP security, truth score, and production resilience.");
    trace.push({
      role: "Reviewer Agent",
      status: "completed",
      model: reviewerRes.model,
      output: reviewerRes.text
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[SwarmCoordinator] ✅ Swarm execution completed in ${duration}s.`);

    return {
      objective,
      durationSeconds: duration,
      agentsExecuted: 3,
      trace,
      timestamp: new Date().toISOString()
    };
  }
}
