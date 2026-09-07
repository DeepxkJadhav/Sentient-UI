---
name: "Project Graphify"
description: "Map, visualize, and analyze whole-project architecture, logic execution paths, module dependencies, and security boundaries. Use when you need to understand project topology, trace execution flows, identify architectural bottlenecks, audit security perimeters, or analyze change impacts across modules."
---

# Project Graphify

Whole-project architectural, logical, and security surface graph mapping for Sentient.

## What This Skill Does

Project Graphify parses the entire codebase into a unified, computable graph representation:
1. **Architecture & Topology Mapping**: Discovers packages, bounded contexts, plugins, crates, and module relationships.
2. **Logic & Execution Flow**: Traces data flow from CLI entry points (`bin/sentient.js`, `bin/cli.js`), through command parsers, MCP dispatchers, swarm coordinators, and agents down to vector memory.
3. **Security Perimeter Auditing**: Identifies input validation boundaries (Zod/Ajv), process execution sinks (`child_process`), filesystem writes, and network/stdio entrypoints.
4. **Change Impact & Blast Radius**: Answers "What breaks if I change module X?" by calculating transitive dependent closures and critical centrality nodes.
5. **Interactive Graph Exports**: Generates production-ready Mermaid diagrams and structured graph JSON datasets (`sentient-project-graph.json`).

---

## When to Use

- **System Design & Refactoring**: When restructuring modules, breaking monolithic components, or designing new plugin extensions.
- **Onboarding & Code Exploration**: When exploring unfamiliar subsystems or tracing how data flows between CLI and agents.
- **Security Audits**: When checking whether untrusted input reaches execution sinks without passing through validation gates.
- **Pre-PR / Pre-Merge Impact Analysis**: When evaluating the blast radius of modifying shared types or core utilities.

---

## Quick Start

### 1. Run Whole Project Graph Mapping
```bash
node plugins/sentient-graphify/scripts/graphify.mjs
```
This scans `package.json`, workspaces, `plugins/`, `v3/`, `src/`, and `bin/`, producing:
- `docs/architecture/sentient-architecture-graph.md` (interactive Mermaid visualizations)
- `sentient-project-graph.json` (computable graph with nodes, edges, clusters, and security annotations)

### 2. Slash Command
```bash
/graphify map          # Generate architecture overview graph
/graphify logic        # Trace runtime execution pathways
/graphify security     # Audit input boundaries & execution sinks
/graphify impact <file> # Calculate blast radius of changes to a file
```

---

## Core Capabilities

### 1. Architecture Topology
- **Layer 0: CLI & Entrypoints**: `bin/sentient.js`, `bin/cli.js`, `v3/@claude-flow/cli`.
- **Layer 1: Coordination & Swarm Engine**: `SwarmCoordinator`, consensus protocols (Raft, Byzantine), agent dispatchers.
- **Layer 2: Specialized Agent Swarms**: 60+ agent roles (coder, reviewer, tester, security-architect, etc.).
- **Layer 3: Memory & Intelligence**: AgentDB vector memory, HNSW indexing, SONA neural pattern learning.
- **Layer 4: Plugin Ecosystem**: 36+ modular plugins in `plugins/sentient-*`.
- **Layer 5: Native & WASM Acceleration**: Rust crates (`v3/crates/`), WASM kernels, vector attention.

### 2. Security Perimeter Analysis
- **Trust Boundaries**: MCP stdio transport, HTTP transports, IPC federation channels.
- **Validation Gates**: JSON schema validators, Zod schemas, path sanitizers.
- **Privileged Sinks**: Shell command runners, file system mutators, secret managers.
- **Attack Surface Score**: Computes ratio of validated vs unvalidated entrypoints across subsystems.

### 3. Change Impact Analysis
Given target node $N$:
$$\text{BlastRadius}(N) = \{ M \in \text{Modules} \mid \exists \text{ path } M \to^* N \}$$
Ranked by degree centrality and depth.
