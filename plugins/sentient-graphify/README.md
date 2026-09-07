# sentient-graphify

Whole-project architecture, logic flow, and security boundary graph mapping for Sentient.

## Overview

`sentient-graphify` provides automated graph intelligence for the Sentient codebase. It analyzes and models the entire repository as a multi-layered topological graph:
- **Architectural Topology**: Maps bounded contexts, packages, plugins, crates, and external systems.
- **Logic & Execution Flows**: Traces execution paths from entrypoints (`sentient.js`, `cli.js`) to commands, swarms, agents, and storage.
- **Security Surface**: Maps input validation boundaries, execution sinks, network endpoints, and access barriers.
- **Change Impact**: Calculates blast radius and dependency ripple effects before refactoring or merges.

## Installation

```bash
claude --plugin-dir plugins/sentient-graphify
```

## Agents

| Agent | Model | Role |
|-------|-------|------|
| `graph-architect` | sonnet | Whole-project topological reasoning, circular dependency analysis, and security surface auditing |

## Commands

```bash
graphify map            # Generate whole-project architecture graph
graphify logic          # Trace runtime execution pathways and data flow
graphify security       # Audit input validation gates and execution sinks
graphify impact <file>  # Calculate change blast radius for a target file
graphify export         # Export JSON graph dataset and Mermaid diagrams
```

## Skills

| Skill | Usage | Description |
|-------|-------|-------------|
| `graph-mapper` | `/graphify map` | Automated codebase dependency and topological graph extraction |

## Output Artifacts

Running the graphify engine creates:
- `docs/architecture/sentient-architecture-graph.md`: Visual architecture and data flow diagrams in Mermaid format.
- `sentient-project-graph.json`: Computable graph dataset with nodes, edges, degree centralities, and security annotations.
