#!/usr/bin/env node
/**
 * Sentient Graphify Engine
 * 
 * Maps whole-project architecture, logic execution paths, and security boundaries.
 * Author: Deepxk Jadhav
 */

import fs from 'fs';
import path from 'path';

const rootDir = path.resolve('c:/Sentient');

console.log('🔍 Running Sentient Graphify Engine on:', rootDir);

// Collect workspace subsystems
const nodes = [];
const edges = [];
const securitySurface = {
  validationGates: [],
  executionSinks: [],
  networkTransports: [],
  trustBoundaries: []
};

function addNode(id, label, category, description, meta = {}) {
  nodes.push({ id, label, category, description, ...meta });
}

function addEdge(from, to, type, description = '') {
  edges.push({ from, to, type, description });
}

// 1. Core Entrypoints
addNode('bin_sentient', 'bin/sentient.js', 'entrypoint', 'Primary CLI wrapper and binary bootstrap');
addNode('bin_cli', 'bin/cli.js', 'entrypoint', 'Universal cross-platform entrypoint');
addNode('cli_core', 'v3/@claude-flow/cli', 'core_cli', 'Modernized V3 Command Line Interface, command registry, MCP auto-detection');

addEdge('bin_sentient', 'cli_core', 'executes', 'Proxies invocation to CLI core');
addEdge('bin_cli', 'cli_core', 'executes', 'Proxies invocation to CLI core');

// 2. Swarm & Coordination Engine
addNode('swarm_coord', 'SwarmCoordinator', 'coordination', 'Hierarchical and mesh multi-agent consensus orchestrator');
addNode('agent_lifecycle', 'AgentLifecycle', 'coordination', 'Agent spawning, status tracking, health monitoring');
addNode('task_engine', 'WorkflowEngine', 'execution', 'Task assignment, dependency resolution, event-driven runner');

addEdge('cli_core', 'swarm_coord', 'dispatches', 'Routes CLI/MCP swarm commands');
addEdge('swarm_coord', 'agent_lifecycle', 'manages', 'Spawns and monitors worker agents');
addEdge('swarm_coord', 'task_engine', 'orchestrates', 'Distributes task DAGs to active workers');

// 3. Memory & Intelligence Subsystems
addNode('agentdb', 'AgentDB Backend', 'memory', 'HNSW vector database, 150x-12,500x fast search, persistent memory');
addNode('hybrid_mem', 'Hybrid Memory', 'memory', 'Multi-tier storage balancing hot cache and disk persistence');
addNode('sona_neural', 'SONA Neural Learning', 'intelligence', 'Self-optimizing trajectory patterns, reinforcement feedback');

addEdge('task_engine', 'agentdb', 'queries_and_stores', 'Stores pattern solutions and task context');
addEdge('swarm_coord', 'sona_neural', 'trains', 'Updates neural weights from successful tasks');
addEdge('agentdb', 'hybrid_mem', 'persists', 'Underlying database persistence');

// 4. Native & WASM Acceleration Layer
addNode('crate_agntcy', 'sentient-agntcy', 'native_crate', 'Rust crate for high-performance agentic networking');
addNode('crate_peer', 'sentient-federation-peer', 'native_crate', 'QUIC-based multi-machine peer federation binary');
addNode('crate_watermark', 'sentient-watermark', 'native_crate', 'SynthID-Text style LLM provenance and Bayesian verification');

addEdge('cli_core', 'crate_peer', 'spawns_federation', 'Multi-machine cluster coordination');
addEdge('task_engine', 'crate_watermark', 'verifies', 'Generative text provenance tracking');

// 5. Scan Plugins Directory
const pluginsDir = path.join(rootDir, 'plugins');
if (fs.existsSync(pluginsDir)) {
  const pluginEntries = fs.readdirSync(pluginsDir, { withFileTypes: true });
  for (const entry of pluginEntries) {
    if (entry.isDirectory() && entry.name.startsWith('sentient-')) {
      const pluginId = `plugin_${entry.name.replace(/-/g, '_')}`;
      const pluginPath = path.join(pluginsDir, entry.name);
      
      let desc = 'Sentient extensible plugin';
      const pkgFile = path.join(pluginPath, '.claude-plugin', 'plugin.json');
      if (fs.existsSync(pkgFile)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
          if (pkg.description) desc = pkg.description;
        } catch {}
      }
      
      addNode(pluginId, entry.name, 'plugin', desc, { dir: `plugins/${entry.name}` });
      addEdge('cli_core', pluginId, 'loads_plugin', 'Extends CLI commands and agents');
      
      if (entry.name.includes('memory') || entry.name.includes('db')) {
        addEdge(pluginId, 'agentdb', 'interfaces_with', 'Vector storage backend');
      }
      if (entry.name.includes('security') || entry.name.includes('defence')) {
        securitySurface.validationGates.push({ plugin: entry.name, role: desc });
      }
    }
  }
}

// 6. Security Surface Mapping
securitySurface.validationGates.push(
  { target: 'CLI Argument Parser', validator: 'CommandParser (flags/positionals sanitation)' },
  { target: 'MCP Tool Invocations', validator: 'JSON Schema & Zod Validators' },
  { target: 'Plugin Registry', validator: 'Ed25519 signature / manifest verification' }
);

securitySurface.executionSinks.push(
  { target: 'child_process / shell dispatch', component: 'v3/@claude-flow/cli/src/update/executor.ts', risk: 'Privileged execution' },
  { target: 'Filesystem state persistence', component: '.claude/ & data/ stores', risk: 'Unbounded disk write' },
  { target: 'Daemon background process', component: 'v3/@claude-flow/cli/src/services/daemon-autostart.ts', risk: 'Long-running detached process' }
);

securitySurface.networkTransports.push(
  { transport: 'MCP stdio', channel: 'Standard IO JSON-RPC 2.0', boundary: 'Local Process Isolation' },
  { transport: 'QUIC / WebSockets', channel: 'Peer Federation & Agentic IPC', boundary: 'Encrypted Machine-to-Machine' }
);

// 7. Generate Graph Output Files
const graphData = {
  project: 'Sentient',
  repository: 'https://github.com/DeepxkJadhav/Sentient',
  author: 'Deepxk Jadhav',
  generatedAt: new Date().toISOString(),
  metrics: {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    subsystems: {
      entrypoints: nodes.filter(n => n.category === 'entrypoint').length,
      core: nodes.filter(n => n.category.includes('core') || n.category === 'coordination').length,
      memory: nodes.filter(n => n.category === 'memory' || n.category === 'intelligence').length,
      plugins: nodes.filter(n => n.category === 'plugin').length,
      nativeCrates: nodes.filter(n => n.category === 'native_crate').length
    }
  },
  nodes,
  edges,
  securitySurface
};

const jsonPath = path.join(rootDir, 'sentient-project-graph.json');
fs.writeFileSync(jsonPath, JSON.stringify(graphData, null, 2), 'utf8');
console.log(`✅ Saved structured graph: ${jsonPath}`);

// 8. Generate Mermaid Architecture & Logic Documentation
const mermaidArch = `\`\`\`mermaid
graph TD
    classDef entrypoint fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#ffffff
    classDef core fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#ffffff
    classDef memory fill:#10b981,stroke:#047857,stroke-width:2px,color:#ffffff
    classDef native fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#ffffff
    classDef plugin fill:#06b6d4,stroke:#0e7490,stroke-width:2px,color:#ffffff

    subgraph Entrypoints["🚀 Entrypoints"]
        bin_sentient["bin/sentient.js"]:::entrypoint
        bin_cli["bin/cli.js"]:::entrypoint
    end

    subgraph CoreLayer["⚙️ Core & Swarm Layer"]
        cli_core["Sentient CLI Core (@claude-flow/cli)"]:::core
        swarm_coord["SwarmCoordinator (Raft/BFT Consensus)"]:::core
        agent_lifecycle["AgentLifecycle (60+ Agents)"]:::core
        task_engine["Workflow Engine (Task DAGs)"]:::core
    end

    subgraph MemoryLayer["🧠 Memory & Intelligence Layer"]
        agentdb["AgentDB (HNSW Vector Store)"]:::memory
        hybrid_mem["Hybrid Persistence (Hot Cache / Disk)"]:::memory
        sona_neural["SONA Neural Learning Engine"]:::memory
    end

    subgraph NativeLayer["⚡ Native Acceleration (Rust / WASM)"]
        crate_peer["sentient-federation-peer (QUIC IPC)"]:::native
        crate_agntcy["sentient-agntcy"]:::native
        crate_watermark["sentient-watermark (SynthID-Text)"]:::native
    end

    subgraph Plugins["🔌 Plugin Ecosystem (36+ Plugins)"]
        plugin_graphify["sentient-graphify (Topological Mapper)"]:::plugin
        plugin_core["sentient-core"]:::plugin
        plugin_security["sentient-security-audit"]:::plugin
        plugin_rag["sentient-rag-memory"]:::plugin
        plugin_agent["sentient-agent"]:::plugin
        plugin_more["... 31 Additional Modular Plugins"]:::plugin
    end

    bin_sentient --> cli_core
    bin_cli --> cli_core
    cli_core --> swarm_coord
    swarm_coord --> agent_lifecycle
    swarm_coord --> task_engine
    task_engine --> agentdb
    swarm_coord --> sona_neural
    agentdb --> hybrid_mem

    cli_core --> crate_peer
    task_engine --> crate_watermark

    cli_core --> plugin_graphify
    cli_core --> plugin_core
    cli_core --> plugin_security
    cli_core --> plugin_rag
    cli_core --> plugin_agent
    cli_core --> plugin_more
\`\`\``;

const mermaidLogic = `\`\`\`mermaid
sequenceDiagram
    autonumber
    actor User
    participant CLI as Sentient CLI (bin/sentient.js)
    participant Parser as Command & Flag Parser
    participant Swarm as SwarmCoordinator
    participant Worker as Specialized Agent (Coder/Reviewer)
    participant Memory as AgentDB Vector Memory

    User->>CLI: sentient swarm start --objective "Build Feature"
    CLI->>Parser: Parse flags & validate command
    Parser->>Swarm: Initialize Swarm Topology (Hierarchical/Mesh)
    Swarm->>Memory: Search prior pattern memories (similarity > 0.7)
    Memory-->>Swarm: Return matching learned trajectories
    Swarm->>Worker: Dispatch task with context & safety constraints
    Worker->>Worker: Execute code modifications & unit verification
    Worker->>Swarm: Return task completion receipt
    Swarm->>Memory: Store successful pattern (namespace: patterns)
    Swarm-->>CLI: Return execution result
    CLI-->>User: Display summary and metrics
\`\`\``;

const mermaidSecurity = `\`\`\`mermaid
flowchart LR
    classDef untrusted fill:#ef4444,stroke:#b91c1c,stroke-width:2px,color:#ffffff
    classDef gate fill:#10b981,stroke:#047857,stroke-width:2px,color:#ffffff
    classDef sink fill:#f97316,stroke:#ea580c,stroke-width:2px,color:#ffffff

    subgraph Inputs["External / Untrusted Surface"]
        STDIN["STDIN / MCP stdio"]:::untrusted
        ARGS["CLI Positional Flags"]:::untrusted
        IPC["Remote Federation Packets"]:::untrusted
    end

    subgraph Gates["🛡️ Security Validation Gates"]
        SchemaVal["JSON Schema / Zod Validator"]:::gate
        CmdFilter["Command & Path Sanitizer"]:::gate
        TrustPolicy["Ed25519 Signature / Policy Enforcer"]:::gate
    end

    subgraph Sinks["⚠️ Privileged Execution Sinks"]
        ProcessExec["child_process (Process Spawn)"]:::sink
        DiskWrite["Filesystem State Write"]:::sink
        NetworkEmit["Remote Peer Emit"]:::sink
    end

    STDIN --> SchemaVal
    ARGS --> CmdFilter
    IPC --> TrustPolicy

    SchemaVal --> ProcessExec
    CmdFilter --> DiskWrite
    TrustPolicy --> NetworkEmit
\`\`\``;

const mdContent = `# Sentient: Whole-Project Architecture & Topology Graph

> **Repository**: [DeepxkJadhav/Sentient](https://github.com/DeepxkJadhav/Sentient)  
> **Author**: Deepxk Jadhav  
> **Generated By**: \`sentient-graphify\` engine  
> **Metrics**: ${nodes.length} Nodes · ${edges.length} Directed Relationships · 36+ Extensible Plugins

---

## 1. High-Level Architecture Topology

The Sentient platform is organized as a layered reactive multi-agent system:

${mermaidArch}

---

## 2. Runtime Logic & Execution Flow

How a command travels through the verification and execution pipeline:

${mermaidLogic}

---

## 3. Security Boundary & Attack Surface

Sentient isolates untrusted external input with strict validation gates before allowing access to privileged system sinks:

${mermaidSecurity}

---

## 4. Subsystem Catalog Summary

| Subsystem | Node Count | Description |
|-----------|------------|-------------|
| **Entrypoints** | ${nodes.filter(n => n.category === 'entrypoint').length} | Zero-dependency CLI entry wrappers |
| **Core & Swarm** | ${nodes.filter(n => n.category.includes('core') || n.category === 'coordination').length} | Swarm coordinator, consensus engines, task DAG runner |
| **Memory & AI** | ${nodes.filter(n => n.category === 'memory' || n.category === 'intelligence').length} | AgentDB HNSW vector index, SONA neural learning |
| **Plugins** | ${nodes.filter(n => n.category === 'plugin').length} | Modular feature packages for Claude Code & Codex |
| **Native Accelerators** | ${nodes.filter(n => n.category === 'native_crate').length} | Rust crates for QUIC federation and SynthID watermarking |

---

*Generated automatically with \`node plugins/sentient-graphify/scripts/graphify.mjs\`*.
`;

const mdPath = path.join(rootDir, 'docs', 'architecture', 'sentient-architecture-graph.md');
fs.writeFileSync(mdPath, mdContent, 'utf8');
console.log(`✅ Saved visual architecture map: ${mdPath}`);
console.log('🎉 Sentient Graphify complete!');
