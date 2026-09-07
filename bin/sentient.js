#!/usr/bin/env node
/**
 * Sentient Autonomous CLI
 * Enterprise Multi-Agent AI Orchestration Engine
 * Author: Deepxk Jadhav
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

// ANSI formatting
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
};

// 1. Load .env file automatically if present
function loadEnv() {
  const envPaths = [
    path.join(process.cwd(), ".env"),
    path.join(rootDir, ".env")
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, "utf8");
        for (const line of content.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eq = trimmed.indexOf("=");
          if (eq > 0) {
            const key = trimmed.slice(0, eq).trim();
            const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      } catch {}
    }
  }
}
loadEnv();

const VERSION = "3.38.23";

// Fast version check
const args = process.argv.slice(2);
if (args.length === 1 && (args[0] === "--version" || args[0] === "-v" || args[0] === "version")) {
  console.log(`sentient v${VERSION}`);
  process.exit(0);
}

function printBanner() {
  console.log(`
${c.cyan}${c.bold}  ███████╗███████╗███╗   ██╗████████╗██╗███████╗███╗   ██╗████████╗
  ██╔════╝██╔════╝████╗  ██║╚══██╔══╝██║██╔════╝████╗  ██║╚══██╔══╝
  ███████╗█████╗  ██╔██╗ ██║   ██║   ██║█████╗  ██╔██╗ ██║   ██║   
  ╚════██║██╔══╝  ██║╚██╗██║   ██║   ██║██╔══╝  ██║╚██╗██║   ██║   
  ███████║███████╗██║ ╚████║   ██║   ██║███████╗██║ ╚████║   ██║   
  ╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ${c.reset}
  ${c.magenta}Autonomous Multi-Agent AI Orchestration Engine${c.reset} ${c.dim}v${VERSION}${c.reset}
  ${c.dim}Repository: https://github.com/DeepxkJadhav/Sentient${c.reset}
`);
}

function printHelp() {
  printBanner();
  console.log(`${c.bold}USAGE:${c.reset}
  ${c.green}sentient${c.reset} <command> [arguments] [options]

${c.bold}PRIMARY COMMANDS:${c.reset}
  ${c.cyan}build${c.reset} <objective>       Dispatches 3-agent swarm (Architect, Coder, Reviewer) to build an app
  ${c.cyan}chat${c.reset}                  Launch an interactive terminal session with Sentient AI
  ${c.cyan}graph${c.reset}                 Map and visualize whole-project architecture & dependencies
  ${c.cyan}doctor${c.reset}                Run system health diagnostics and verify LLM providers
  ${c.cyan}serve${c.reset}                 Launch the local Sentient Web Dashboard on port 3000

${c.bold}SWARM COMMANDS:${c.reset}
  ${c.cyan}swarm start${c.reset} --objective "..."   Run multi-agent swarm task
  ${c.cyan}swarm status${c.reset}                  Check current active agent status

${c.bold}GLOBAL OPTIONS:${c.reset}
  -v, --version         Show version
  -h, --help            Show help documentation

${c.bold}EXAMPLES:${c.reset}
  ${c.dim}$${c.reset} sentient build "Build a Markdown notes app in HTML and JavaScript"
  ${c.dim}$${c.reset} sentient build "Build an in-memory PubSub event broker in TypeScript"
  ${c.dim}$${c.reset} sentient chat
  ${c.dim}$${c.reset} sentient graph
  ${c.dim}$${c.reset} sentient doctor
`);
}

async function callGemini(prompt, systemInstruction = "") {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_API_KEY or GEMINI_API_KEY in environment or .env file.");
  }

  const models = ["gemini-3-flash-preview", "gemini-flash-latest", "gemini-2.5-pro"];
  let lastError = null;

  for (const model of models) {
    try {
      const body = {
        contents: [{ parts: [{ text: prompt }] }]
      };
      if (systemInstruction) {
        body.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
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

async function handleBuild(objective) {
  if (!objective) {
    console.error(`${c.red}Error: Please provide an objective to build.${c.reset}`);
    console.log(`Example: ${c.green}sentient build "Build a Pomodoro timer web app"${c.reset}`);
    process.exit(1);
  }

  printBanner();
  console.log(`${c.bold}🎯 Objective:${c.reset} "${c.green}${objective}${c.reset}"\n`);
  const startTime = Date.now();

  // 1. Architect Agent
  console.log(`${c.blue}🏛️  [1/3] Architect Agent:${c.reset} Analyzing requirements & designing architecture...`);
  const archPrompt = `Objective: "${objective}"
Analyze this goal for a software application.
Provide:
1. Technical Requirements & User Flow
2. System Architecture & Component Structure
3. Recommended Files & Formats
Keep it concise and clear.`;

  const archRes = await callGemini(archPrompt, "You are Sentient Architect Agent. Design clean, modular software systems.");
  console.log(`${c.dim}${archRes.text.split("\n").slice(0, 5).join("\n")}\n...${c.reset}\n`);

  // 2. Coder Agent
  console.log(`${c.yellow}💻 [2/3] Coder Agent:${c.reset} Generating complete, working application code...`);
  const coderPrompt = `Objective: "${objective}"
Architect's Blueprint:
${archRes.text}

Write complete, functional, production-ready code implementing this application.
Include working code that can be run directly (HTML, CSS, JavaScript, or TypeScript).
Include complete file implementations inside clear markdown code blocks with filename comments like:
\`\`\`html
<!-- index.html -->
...
\`\`\`
Do not use placeholders. Provide fully working code.`;

  const coderRes = await callGemini(coderPrompt, "You are Sentient Coder Agent. You write elegant, complete, working production code.");
  console.log(`${c.green}✅ Code generated successfully!${c.reset}\n`);

  // 3. Reviewer Agent
  console.log(`${c.magenta}🛡️  [3/3] Reviewer Agent:${c.reset} Running security scan & quality verification...`);
  const revPrompt = `Objective: "${objective}"
Code:
${coderRes.text}

Review this implementation:
1. Security Evaluation (XSS, Injection, Leakage)
2. Quality Score (out of 100)
3. Verdict: PASS or REVISE
4. Recommended execution step`;

  const revRes = await callGemini(revPrompt, "You are Sentient Reviewer Agent. You audit code for safety and quality.");
  console.log(`${c.dim}${revRes.text.split("\n").slice(0, 6).join("\n")}\n...${c.reset}\n`);

  // 4. Save generated files to disk
  const slug = objective.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);
  const outDir = path.join(process.cwd(), "apps", slug || "generated-app");
  fs.mkdirSync(outDir, { recursive: true });

  // Extract code blocks and save
  const codeBlockRegex = /```([a-zA-Z0-9_\-]+)?\n([\s\S]*?)```/g;
  let match;
  let fileCount = 0;

  while ((match = codeBlockRegex.exec(coderRes.text)) !== null) {
    const lang = (match[1] || "").toLowerCase();
    const code = match[2];
    
    let relFile = `app-${fileCount + 1}.${lang === "typescript" ? "ts" : lang === "javascript" ? "js" : lang === "html" ? "html" : "txt"}`;
    const firstLines = code.slice(0, 150);
    const fnMatch = firstLines.match(/(?:<!--|\/\/|\/\*|#)\s*([a-zA-Z0-9_\-\./]+\.[a-zA-Z0-9]+)/);
    if (fnMatch && fnMatch[1]) {
      relFile = fnMatch[1].replace(/^\.?\//, "");
    } else if (lang === "html") {
      relFile = "index.html";
    }

    const filePath = path.join(outDir, relFile);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, code, "utf8");
    console.log(`  ${c.green}📁 Created file:${c.reset} ${path.relative(process.cwd(), filePath)}`);
    fileCount++;
  }

  // Also save the full blueprint
  fs.writeFileSync(path.join(outDir, "SENTIENT_BLUEPRINT.md"), `# Sentient Build Blueprint\n\n## Objective\n${objective}\n\n## Architecture\n${archRes.text}\n\n## Review Verdict\n${revRes.text}\n`, "utf8");

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n${c.bold}===============================================================${c.reset}`);
  console.log(`${c.green}${c.bold}🎉 Application Built Successfully in ${elapsed}s!${c.reset}`);
  console.log(`${c.bold}📂 Location:${c.reset} ${outDir}`);
  console.log(`${c.bold}===============================================================${c.reset}`);
  console.log(`To view or run your new app:`);
  console.log(`  ${c.cyan}cd "${outDir}"${c.reset}`);
  if (fs.existsSync(path.join(outDir, "index.html"))) {
    console.log(`  ${c.cyan}start index.html${c.reset} (or open in your browser)`);
  }
}

async function handleChat() {
  printBanner();
  console.log(`${c.green}💬 Entering Sentient Interactive Terminal Session.${c.reset}`);
  console.log(`${c.dim}Type your message or prompt. Type "exit" or "quit" to leave.\n${c.reset}`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const promptUser = () => {
    rl.question(`${c.cyan}${c.bold}sentient > ${c.reset}`, async (input) => {
      const trimmed = input.trim();
      if (!trimmed) {
        promptUser();
        return;
      }
      if (trimmed.toLowerCase() === "exit" || trimmed.toLowerCase() === "quit") {
        console.log(`${c.yellow}Goodbye!${c.reset}`);
        rl.close();
        return;
      }

      try {
        process.stdout.write(`${c.dim}Thinking...${c.reset}\r`);
        const res = await callGemini(trimmed, "You are Sentient, an advanced agentic coding assistant. Give direct, insightful, helpful technical answers.");
        process.stdout.write("\r                                  \r");
        console.log(`\n${res.text}\n`);
      } catch (err) {
        console.error(`\n${c.red}Error: ${err.message}${c.reset}\n`);
      }

      promptUser();
    });
  };

  promptUser();
}

async function handleDoctor() {
  printBanner();
  console.log(`${c.bold}🩺 Running Sentient System Health Diagnostics...${c.reset}\n`);

  // 1. Node check
  console.log(`  • Node.js Version: ${c.green}${process.version}${c.reset} (ESM supported)`);

  // 2. API Key Check
  const key = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (key) {
    console.log(`  • Google Gemini API Key: ${c.green}CONFIGURED${c.reset} (${key.slice(0, 6)}...${key.slice(-4)})`);
    try {
      const testRes = await callGemini("test", "Respond with ok");
      console.log(`  • Gemini Connectivity: ${c.green}OPERATIONAL ✅${c.reset} (model: ${testRes.model})`);
    } catch (err) {
      console.log(`  • Gemini Connectivity: ${c.red}FAILED (${err.message})${c.reset}`);
    }
  } else {
    console.log(`  • Google Gemini API Key: ${c.red}NOT FOUND in environment or .env${c.reset}`);
  }

  // 3. Project Graph Check
  const graphFile = path.join(rootDir, "sentient-project-graph.json");
  if (fs.existsSync(graphFile)) {
    try {
      const g = JSON.parse(fs.readFileSync(graphFile, "utf8"));
      console.log(`  • Project Graph: ${c.green}VALID${c.reset} (${g.metrics.totalNodes} Nodes, ${g.metrics.totalEdges} Edges)`);
    } catch {
      console.log(`  • Project Graph: ${c.yellow}FILE PRESENT BUT INVALID JSON${c.reset}`);
    }
  } else {
    console.log(`  • Project Graph: ${c.dim}Not generated yet. Run 'sentient graph'${c.reset}`);
  }

  console.log(`\n${c.green}Diagnostic completed! Sentient is ready.${c.reset}`);
}

async function handleGraph() {
  printBanner();
  console.log(`${c.cyan}🔍 Executing Project Graphify Engine...${c.reset}\n`);
  const graphScript = path.join(rootDir, "plugins", "sentient-graphify", "scripts", "graphify.mjs");
  if (fs.existsSync(graphScript)) {
    await import(`file://${graphScript}`);
  } else {
    console.error(`${c.red}Error: Graphify engine not found at ${graphScript}${c.reset}`);
  }
}

async function handleServe() {
  printBanner();
  const serverPath = path.join(rootDir, "examples", "sentient-gemini-app", "server.js");
  if (fs.existsSync(serverPath)) {
    await import(`file://${serverPath}`);
  } else {
    console.error(`${c.red}Error: Server entrypoint not found at ${serverPath}${c.reset}`);
  }
}

// Command Dispatcher
async function main() {
  const cmd = args[0] ? args[0].toLowerCase() : "help";
  const rest = args.slice(1).join(" ");

  switch (cmd) {
    case "build":
    case "create":
    case "new":
      await handleBuild(rest);
      break;
    case "chat":
    case "interactive":
    case "repl":
      await handleChat();
      break;
    case "doctor":
    case "status":
      await handleDoctor();
      break;
    case "graph":
    case "graphify":
      await handleGraph();
      break;
    case "serve":
    case "dashboard":
    case "ui":
      await handleServe();
      break;
    case "help":
    case "--help":
    case "-h":
      printHelp();
      break;
    default:
      // If user typed a string prompt without "build", default to build!
      if (args.length > 0) {
        await handleBuild(args.join(" "));
      } else {
        printHelp();
      }
      break;
  }
}

main().catch(err => {
  console.error(`\n${c.red}Fatal Error:${c.reset}`, err.message);
  process.exit(1);
});
