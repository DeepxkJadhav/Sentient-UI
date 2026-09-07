---
name: "graph-mapper"
description: "Extract whole-project architecture, logic flow, and security boundary graph representation"
---

# Graph Mapper Skill

## Instructions

When the user requests an architectural overview, module dependency check, logic tracing, or security surface audit:

1. **Execute the Graphify Engine**:
   ```bash
   node plugins/sentient-graphify/scripts/graphify.mjs
   ```
2. **Read the Generated Graph Artifacts**:
   - `docs/architecture/sentient-architecture-graph.md` for visual diagrams.
   - `sentient-project-graph.json` for structured graph queries.
3. **Analyze and Report**:
   - Highlight high-centrality hubs and potential single-points-of-failure.
   - Trace specific execution paths requested by the user.
   - Flag any security sinks that lack upstream validation gates.
