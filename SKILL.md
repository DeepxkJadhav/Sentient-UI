---
name: sentient-ui
description: Sentient-UI is a web dashboard and control plane for running coordinated teams of coding agents. Use this skill when managing agent topologies, solving action plans with GOAP, running consensus votes, inspecting MCP tools, or monitoring model routing.
---

# Sentient-UI

Sentient-UI provides an interface for running coordinated agent swarms.

## Capabilities

- Swarm topologies: Switch between mesh, hierarchical, star, and ring layouts.
- GOAP A* planner: Decompose goals into step sequences and replan on errors.
- Consensus protocols: Run voting rounds using Byzantine fault tolerance (3f+1), Raft, Paxos, or Gossip.
- MCP tool inspector: Search and test 314+ Model Context Protocol tools.
- Memory loop: Inspect memory records across retrieve, judge, distill, and consolidate phases.
- Model router: Track token usage and request routing across deterministic, reflex, and reasoning tiers.

## Getting started

```bash
# Install dependencies
npm install

# Start the frontend
npm run dev

# Start the backend server
npm run server
```
