---
name: graphify
description: Map, visualize, and analyze whole-project architecture, logic execution paths, and security boundaries
---

Project Graphify commands:

**`graphify map`** -- Generate an architectural topology map of Sentient:
1. Scans root `package.json`, workspaces, `plugins/`, `v3/`, `src/`, and `bin/`.
2. Categorizes subsystems into CLI, Swarm Coordination, Specialized Agents, Vector Memory, Plugins, and Rust/WASM crates.
3. Outputs an updated Mermaid architecture diagram to `docs/architecture/sentient-architecture-graph.md`.

**`graphify logic`** -- Trace logical execution and data pathways:
1. Traces execution from entry points (`bin/sentient.js`, `bin/cli.js`).
2. Follows command registration, argument parsing, routing to `SwarmCoordinator`.
3. Displays execution steps and flags circular dependencies.

**`graphify security`** -- Audit input boundaries and privileged execution sinks:
1. Scans for input validation schemas (Zod/Ajv).
2. Identifies sink points (`child_process.spawn`, `exec`, filesystem mutations, network transports).
3. Produces a security perimeter rating and identifies unguarded paths.

**`graphify impact <file>`** -- Calculate change impact and blast radius:
1. Identifies all incoming dependencies to `<file>`.
2. Computes transitive dependency closure.
3. Reports affected tests, agents, and modules that require verification after editing `<file>`.

**`graphify export`** -- Export computable graph data:
1. Generates `sentient-project-graph.json` containing complete nodes, edges, and cluster metadata.
