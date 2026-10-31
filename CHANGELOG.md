# Changelog: Sentient-UI

All notable changes to Sentient-UI are documented here.
Format follows Keep a Changelog and Semantic Versioning.

---

## [1.0.0] - 2026-10-31

### Added
- Interactive 2D canvas with physics-based node positioning and edge pulse animations for mesh, hierarchical, star, and ring layouts.
- Goal-Oriented Action Planning (GOAP) solver using A* search with world state precondition and effect checking, step execution, and replanning on error.
- Fleet management view with default roles (coordinator, architect, coder, reviewer, security, and tester) and dynamic agent creation.
- Quorum voting engine implementing Byzantine (3f+1), Raft, Paxos, and Gossip consensus protocols.
- Model Context Protocol (MCP) tool explorer covering 314+ tools across swarm, agent, memory, intelligence, task, and hook namespaces.
- Vector memory search using cosine similarity and a visual display for the cognitive loop (retrieve, judge, distill, consolidate).
- Three-tier model routing telemetry showing request distribution, latency averages, and token burn across codemods, fast triage, and reasoning tiers.
- Event terminal with live log output and CLI command handling (`/topology`, `/spawn`, `/mission`, `/vote`, `/memory`, `/clear`).
- Express server with WebSocket support for streaming live agent state and handling tool calls.
