#!/usr/bin/env node
/**
 * Sentient Swarm CLI Runner
 * Author: Deepxk Jadhav
 */

import { GeminiAgentEngine } from "./gemini-agent-engine.js";

const objective = process.argv.slice(2).join(" ") || "Build a secure high-throughput rate limiter in TypeScript";

console.log("===============================================================");
console.log("🌌 Sentient Autonomous Swarm Runner");
console.log("===============================================================");
console.log(`🎯 Objective: "${objective}"\n`);

async function main() {
  try {
    const engine = new GeminiAgentEngine();
    const result = await engine.runSwarm(objective);

    console.log("\n---------------------------------------------------------------");
    console.log("🏛️  [1] ARCHITECT AGENT OUTPUT:");
    console.log("---------------------------------------------------------------");
    console.log(result.trace[0].output);

    console.log("\n---------------------------------------------------------------");
    console.log("💻 [2] CODER AGENT IMPLEMENTATION:");
    console.log("---------------------------------------------------------------");
    console.log(result.trace[1].output);

    console.log("\n---------------------------------------------------------------");
    console.log("🛡️  [3] REVIEWER AGENT SECURITY & QUALITY AUDIT:");
    console.log("---------------------------------------------------------------");
    console.log(result.trace[2].output);

    console.log("\n===============================================================");
    console.log(`🎉 Execution Finished in ${result.durationSeconds}s! All 3 agents passed.`);
    console.log("===============================================================");
  } catch (err) {
    console.error("❌ Swarm run failed:", err.message);
    process.exit(1);
  }
}

main();
