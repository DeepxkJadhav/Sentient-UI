# Sentient-UI ⚡
### Autonomous Multi-Agent Swarm Orchestrator & Neural Cockpit

<div align="center">

[![Try the UI](https://img.shields.io/badge/Interface-Sentient--UI-6366f1?style=for-the-badge&logoColor=white)](https://github.com/DeepxkJadhav/Sentient-UI)
[![Author](https://img.shields.io/badge/Author-Deepxk_Jadhav-06b6d4?style=for-the-badge)](https://github.com/DeepxkJadhav)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Star on GitHub](https://img.shields.io/github/stars/DeepxkJadhav/Sentient-UI?style=for-the-badge&logo=github&color=gold)](https://github.com/DeepxkJadhav/Sentient-UI)

**Sentient-UI** is a next-generation neural mission control plane and multi-agent swarm orchestrator designed for autonomous coding agents, visual topology coordination, and distributed intelligence.

</div>

---

## 🌟 Core Architecture & Capabilities

### 1. 🌌 Interactive Swarm Topology Canvas
- **Dynamic Physics & Morphing**: Switch between **Hierarchical**, **Mesh**, **Star (Centralized)**, and **Ring** topologies in real time.
- **Node Telemetry**: Live rendering of agent status (`idle`, `busy`, `thinking`, `error`), CPU load, memory utilization, and latency.
- **Visual Edge Pulses**: Animated communication packets flowing along active inter-agent channels.
- **Direct Queen Delegation**: Inspect any agent node on the canvas to view its registered capabilities and inject direct task instructions.

### 2. 🧭 Goal-Oriented Action Planning (GOAP) A* Engine
- **Autonomous Mission Decomposition**: Converts natural-language objectives into an optimal $A^*$ shortest-path action sequence.
- **World State Bitmask Matrix**: Real-time evaluation of preconditions and post-condition effects (`goalDefined`, `architectureValidated`, `codeGenerated`, `testsPassing`, `securityAudited`, `memoryIndexed`, `consensusReached`, `deployed`).
- **Adaptive Dynamic Replanning**: Automatically recalculates path vectors from the current world state when environment obstacles occur.

### 3. 👑 Agent Fleet Commander & Byzantine Quorum
- **Specialized Roles**: Pre-configured agents including `QueenCoordinator`, `Atlas-Architect`, `Titan-Coder`, `Aegis-Security`, `Krypton-Reviewer`, and `Vanguard-Tester`.
- **Dynamic Spawning**: Provision custom neural workers with isolated working memory and distinct skill sets.
- **Distributed Consensus Engine**: Launch Byzantine ($3f+1$), Raft, Gossip, or Paxos voting ballots with live quorum progress meters.

### 4. 🔌 314+ MCP Tool Explorer & Gateway
- **Namespace Directory**: `swarm_*`, `agent_*`, `memory_*`, `intelligence_*`, `task_*`, and `hooks_*`.
- **Interactive JSON Playground**: Test tool executions with schema validation and real-time execution timing.

### 5. 🧠 Semantic Memory & Intelligence Pipeline
- **Vector Search**: High-dimensional cosine distance queries across semantic facts, ADRs, and reflexions.
- **4-Stage Cognitive Loop**: Visual execution of the intelligence cycle:
  $$\text{RETRIEVE} \longrightarrow \text{JUDGE} \longrightarrow \text{DISTILL} \longrightarrow \text{CONSOLIDATE}$$

### 6. ⚡ 3-Tier Model Router & Token Telemetry
- **Tier 1 (Deterministic)**: AST / Codemods ($0.00 / 0 tokens, 1ms).
- **Tier 2 (Reflex)**: Lightweight triage models (Flash / Haiku, 145ms).
- **Tier 3 (Frontier Reasoning)**: Multi-turn deep thinking swarms (Sonnet / Opus / Pro, 890ms).
- **Telemetry**: Real-time token burn rates, session cost tracking, and request distribution.

### 7. 💻 Live Swarm Event Bus & Streaming Terminal
- Real-time logging of all inter-agent messages, tool dispatches, and consensus ballots.
- Interactive CLI command bar supporting `/topology`, `/spawn`, `/mission`, `/vote`, and `/memory`.

---

## 📂 Project Architecture

```
sentient-ui/
├── package.json                       # Monorepo workspaces & scripts
├── server/
│   └── index.ts                       # Express + WebSocket telemetry & MCP bridge
├── src/                               # Sentient-UI React 19 / Canvas frontend
│   ├── components/                    # Canvas graph, GOAP tree, Fleet, MCP playground, RuVector
│   ├── context/                       # Swarm state, event stream, and consensus bus
│   ├── lib/                           # GOAP A* solver & state transitions
│   └── data/                          # Tool definitions & agent presets
├── plugins/                           # 48 Sentient plugins (sentient-swarm, sentient-core, etc.)
├── .agents/skills/                    # 135 specialized agent skill playbooks
├── apps/                              # Sentient sample applications
├── backend/                           # Backend services
├── sentient/                          # Sentient core workspace
└── v3/                                # Sentient v3 platform packages
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Frontend Dev Server
```bash
npm run dev
# Accessible at: http://localhost:3000
```

### 3. Start the Backend & WebSocket Stream
```bash
npm run server
# Accessible at: http://localhost:3001 (WebSocket stream at ws://localhost:3001/ws)
```

### 4. Build for Production
```bash
npm run build
```

---

## 📜 License
MIT License — Copyright (c) Deepxk Jadhav.
