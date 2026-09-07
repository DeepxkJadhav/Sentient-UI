/**
 * Sentient Gemini App - HTTP Server & API Gateway
 * Author: Deepxk Jadhav
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GeminiAgentEngine } from "./gemini-agent-engine.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const engine = new GeminiAgentEngine();

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // 1. Health check
  if (req.method === "GET" && url.pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "healthy",
      platform: "Sentient",
      provider: "Google Gemini",
      model: engine.primaryModel,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // 2. Project Graph
  if (req.method === "GET" && url.pathname === "/api/graph") {
    const graphPath = path.resolve(__dirname, "../../sentient-project-graph.json");
    if (fs.existsSync(graphPath)) {
      res.writeHead(200, { "Content-Type": "application/json" });
      fs.createReadStream(graphPath).pipe(res);
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Graph data not found" }));
    }
    return;
  }

  // 3. Execute Swarm Objective
  if (req.method === "POST" && url.pathname === "/api/swarm/execute") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const { objective } = JSON.parse(body || "{}");
        if (!objective) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Objective is required" }));
          return;
        }

        console.log(`[HTTP API] Received Swarm Request: "${objective}"`);
        const result = await engine.runSwarm(objective);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        console.error("[HTTP API Error]:", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 4. Static frontend files
  let filePath = path.join(__dirname, "public", url.pathname === "/" ? "index.html" : url.pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const contentTypes = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json"
    };
    res.writeHead(200, { "Content-Type": contentTypes[ext] || "text/plain" });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log("===============================================================");
  console.log(`🚀 Sentient Web Dashboard running on http://localhost:${PORT}`);
  console.log(`✨ Connected to Gemini: ${engine.primaryModel}`);
  console.log("===============================================================");
});
