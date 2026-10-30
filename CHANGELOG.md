# Changelog — Sentient-UI

All notable changes to **Sentient-UI** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-31

### Added
- **Interactive Swarm Topology Canvas**:
  - HTML5 Canvas 2D engine with real-time particle physics, force-directed graph positioning, and smooth node dragging.
  - Dynamic topology morphing between **Mesh**, **Hierarchical**, **Star**, and **Ring** modes.
  - Active packet pulse animations along communication edges.
  - Live agent status indicators (`idle`, `busy`, `thinking`, `error`).
- **Goal-Oriented Action Planning (GOAP) Engine**:
  - $A^*$ heuristic solver for autonomous pathfinding across multi-stage agent workflows.
  - 8-attribute world state bitmask matrix evaluation.
  - Dynamic real-time replanning when preconditions or environment variables change.
  - Visual step-by-step execution timeline with dependency tracking.
- **Agent Fleet Commander & Byzantine Quorum**:
  - Fleet management console with pre-configured archetypes (`QueenCoordinator`, `Atlas-Architect`, `Titan-Coder`, `Aegis-Security`, `Krypton-Reviewer`, `Vanguard-Tester`).
  - Dynamic agent spawning modal with role, memory size, and capability assignment.
  - Multi-agent consensus ballot engine supporting **Byzantine ($3f+1$)**, **Raft**, **Paxos**, and **Gossip** voting protocols with live quorum bars.
- **314+ MCP Tool Explorer & Gateway**:
  - Searchable catalog categorized by domain: `swarm_*`, `agent_*`, `memory_*`, `intelligence_*`, `task_*`, and `hooks_*`.
  - Interactive parameter inspector with JSON payload validator and execution simulator.
- **Semantic Vector Memory Explorer**:
  - High-dimensional cosine distance similarity query interface.
  - Visual 4-stage cognitive memory loop ($\text{RETRIEVE} \rightarrow \text{JUDGE} \rightarrow \text{DISTILL} \rightarrow \text{CONSOLIDATE}$).
  - Live category filters for architectural decisions (ADR), reflection logs, and shared facts.
- **3-Tier Model Router Telemetry**:
  - Real-time routing distribution monitor across Tier 1 (Deterministic / AST), Tier 2 (Reflex Triage), and Tier 3 (Frontier Reasoning).
  - Dynamic token burn metrics, average latency tracking, and estimated cost graphs.
- **Streaming Cybernetic Terminal**:
  - Dark-mode developer console with real-time event streaming and auto-scroll.
  - CLI command bar supporting `/topology`, `/spawn`, `/mission`, `/vote`, and `/memory`.
- **Express + WebSocket Telemetry Bridge**:
  - Server implementation on port 3001 broadcasting real-time agent telemetry, status updates, and MCP requests.
