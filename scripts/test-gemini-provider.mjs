#!/usr/bin/env node
/**
 * Sentient Gemini Provider Test & Benchmark
 * Author: Deepxk Jadhav
 */

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ Error: Neither GOOGLE_API_KEY nor GEMINI_API_KEY is set in environment.");
  console.error("Run with: node --env-file=.env scripts/test-gemini-provider.mjs");
  process.exit(1);
}

console.log("==================================================");
console.log("🚀 Testing Sentient Google Gemini Provider");
console.log("==================================================");
console.log(`🔑 Key detected: ${apiKey.slice(0, 6)}...${apiKey.slice(-4)}`);

async function run() {
  try {
    // 1. Test connectivity
    console.log("\n📡 Step 1: Checking Gemini API Connectivity...");
    const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!modelsRes.ok) {
      throw new Error(`Models endpoint returned HTTP ${modelsRes.status}: ${await modelsRes.text()}`);
    }
    const modelsData = await modelsRes.json();
    console.log(`✅ Authentication SUCCESS! ${modelsData.models.length} models accessible.`);

    // 2. Filter available generation models
    const genModels = modelsData.models
      .filter(m => m.supportedGenerationMethods?.includes("generateContent"))
      .map(m => m.name.replace("models/", ""));
    console.log("\n📋 Step 2: Available Generative Models (sample):");
    console.log(genModels.slice(0, 8).map(m => `  • ${m}`).join("\n"));

    // 3. Test content generation
    const modelToUse = genModels.includes("gemini-3-flash-preview") 
      ? "gemini-3-flash-preview" 
      : genModels[0];

    console.log(`\n🧠 Step 3: Testing inference with model '${modelToUse}'...`);
    const prompt = "In 2 sentences, explain how Sentient's multi-agent swarm architecture provides resilient coding automation.";
    
    const genRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!genRes.ok) {
      throw new Error(`Inference returned HTTP ${genRes.status}: ${await genRes.text()}`);
    }

    const genData = await genRes.json();
    const answer = genData.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("\n✨ Inference Response:");
    console.log(answer.trim());
    console.log("\n🎉 Google Gemini provider is fully operational for Sentient!");
  } catch (err) {
    console.error("❌ Test failed:", err.message);
    process.exit(1);
  }
}

run();
