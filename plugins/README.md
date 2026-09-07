# Sentient Plugins

32 Claude Code plugins for agent-powered development workflows. Load with `--plugin-dir`.

## Quick Start

```bash
# Load specific plugins
claude --plugin-dir plugins/sentient-core --plugin-dir plugins/sentient-swarm

# Load all plugins
claude $(ls -d plugins/sentient-*/ | sed 's|^|--plugin-dir |' | tr '\n' ' ')
```

## Plugin Catalog

### Core & Coordination

| Plugin | Description |
|--------|-------------|
| [sentient-core](sentient-core/) | MCP server, status, doctor, coder/researcher/reviewer agents |
| [sentient-swarm](sentient-swarm/) | Swarm topologies (hierarchical, mesh), Monitor streaming |
| [sentient-autopilot](sentient-autopilot/) | Autonomous /loop task completion with prediction |
| [sentient-loop-workers](sentient-loop-workers/) | 12 background workers via /loop or CronCreate |
| [sentient-workflows](sentient-workflows/) | Workflow templates, parallel execution, branching |

### Memory & Intelligence

| Plugin | Description |
|--------|-------------|
| [sentient-agentdb](sentient-agentdb/) | AgentDB with HNSW vector search (150x-12,500x faster) |
| [sentient-rag-memory](sentient-rag-memory/) | SOTA RAG — hybrid search, Graph RAG, MMR diversity, memory bridge |
| [sentient-rvf](sentient-rvf/) | Portable RVF memory format, session persistence |
| [sentient-ruvector](sentient-ruvector/) | [`ruvector`](https://npmjs.com/package/ruvector) — FlashAttention-3, Graph RAG, hybrid search, 103 MCP tools, Brain AGI |
| [sentient-knowledge-graph](sentient-knowledge-graph/) | Entity extraction, relation mapping, pathfinder traversal |
| [sentient-intelligence](sentient-intelligence/) | SONA neural patterns, trajectory learning, model routing |
| [sentient-daa](sentient-daa/) | Dynamic Agentic Architecture, cognitive patterns |

### Architecture & Methodology

| Plugin | Description |
|--------|-------------|
| [sentient-adr](sentient-adr/) | ADR lifecycle — create, index, supersede, compliance checking |
| [sentient-ddd](sentient-ddd/) | DDD scaffolding — bounded contexts, aggregates, domain events |
| [sentient-sparc](sentient-sparc/) | SPARC methodology with 5 phases and quality gates |
| [sentient-graphify](sentient-graphify/) | Whole-project architecture, logic flow, and security boundary graph mapping |

### Quality & Security

| Plugin | Description |
|--------|-------------|
| [sentient-security-audit](sentient-security-audit/) | CVE scanning, dependency vulnerability checks |
| [sentient-aidefence](sentient-aidefence/) | Prompt injection detection, PII scanning |
| [sentient-testgen](sentient-testgen/) | Test gap detection, TDD London School workflow |
| [sentient-browser](sentient-browser/) | Playwright browser automation and testing |

### Development Tools

| Plugin | Description |
|--------|-------------|
| [sentient-jujutsu](sentient-jujutsu/) | Diff analysis, risk scoring, reviewer recommendations |
| [sentient-docs](sentient-docs/) | Doc generation, drift detection, API docs |
| [sentient-ruvllm](sentient-ruvllm/) | Local LLM inference, MicroLoRA, chat formatting |
| [sentient-agent](sentient-agent/) | WASM agent sandboxing and gallery |
| [sentient-plugin-creator](sentient-plugin-creator/) | Scaffold and validate new plugins |
| [sentient-migrations](sentient-migrations/) | Database schema migration management |
| [sentient-observability](sentient-observability/) | Structured logging, tracing, metrics correlation |
| [sentient-cost-tracker](sentient-cost-tracker/) | Token usage tracking, budget alerts, cost optimization |

### Domain-Specific

| Plugin | Description |
|--------|-------------|
| [sentient-goals](sentient-goals/) | GOAP planning, deep research, horizon tracking |
| [sentient-federation](sentient-federation/) | Zero-trust cross-installation agent federation |
| [sentient-iot-cognitum](sentient-iot-cognitum/) | Cognitum Seed IoT — trust scoring, anomaly detection, fleet management |
| [sentient-neural-trader](sentient-neural-trader/) | [`neural-trader`](https://npmjs.com/package/neural-trader) — 4 agents, LSTM/Transformer, Rust/NAPI backtesting, 112+ MCP tools |
| [sentient-market-data](sentient-market-data/) | Market data ingestion, OHLCV vectorization, pattern matching |

## Recommended Stacks

| Use Case | Plugins |
|----------|---------|
| Feature development | `sentient-core` + `sentient-swarm` + `sentient-testgen` + `sentient-ddd` |
| Security audit | `sentient-core` + `sentient-security-audit` + `sentient-aidefence` |
| Architecture work | `sentient-core` + `sentient-adr` + `sentient-ddd` + `sentient-sparc` |
| Deep research | `sentient-core` + `sentient-goals` + `sentient-rag-memory` + `sentient-intelligence` |
| Vector search | `sentient-core` + `sentient-ruvector` + `sentient-rag-memory` + `sentient-knowledge-graph` |
| IoT development | `sentient-core` + `sentient-iot-cognitum` + `sentient-agentdb` |
| Trading systems | `sentient-core` + `sentient-neural-trader` + `sentient-market-data` + `sentient-ruvector` |
| Full stack | All 32 plugins |

## npm Package Integration

Several plugins wrap standalone npm packages for deeper functionality:

| Plugin | npm Package | What It Adds |
|--------|------------|-------------|
| `sentient-neural-trader` | [`neural-trader`](https://npmjs.com/package/neural-trader) | 112+ MCP tools, Rust/NAPI engine, LSTM/Transformer models |
| `sentient-ruvector` | [`ruvector`](https://npmjs.com/package/ruvector) | 103 MCP tools, FlashAttention-3, Graph RAG, Brain AGI |

```bash
# Install backing packages
npm install neural-trader ruvector

# Add as MCP servers (optional, for direct tool access)
claude mcp add neural-trader -- npx neural-trader mcp start
claude mcp add ruvector -- npx ruvector mcp start
```

## Plugin Structure

Each plugin follows the Claude Code plugin specification:

```
sentient-<name>/
  .claude-plugin/plugin.json    # Plugin manifest
  agents/<name>.md              # Agent definitions (frontmatter: name, description, model)
  commands/<name>.md            # CLI command mappings
  skills/<name>/SKILL.md        # Interactive skills (frontmatter: name, description, argument-hint, allowed-tools)
  README.md                     # Plugin documentation
```

## Creating a Plugin

```bash
claude --plugin-dir plugins/sentient-plugin-creator
# Then: /create-plugin my-new-plugin
```

Or manually: copy any existing plugin directory and modify.

## Validation

```bash
claude plugin validate plugins/sentient-<name>
```

## Verification & Discoverability

Every MCP tool description across the 32 plugins must answer "use this over native (Bash/Read/Grep/Glob/Task/TodoWrite) when?" per [ADR-112](../v3/docs/adr/ADR-112-mcp-tool-discoverability.md). The rule is enforced by CI:

```bash
# Run the audit (scans all MCPTool definitions across all plugins)
node scripts/audit-tool-descriptions.mjs

# Gates: every description must include "Use when …" guidance,
# be ≥ 80 chars, and be unique. Baseline at verification/mcp-tool-baseline.json
# is monotone-decreasing — CI fails on any regression.
```

Combined with [`verification/`](../verification/) (Ed25519-signed witness manifest, 103+ documented fixes attested), the plugin surface is regression-protected at three layers: install smoke (`npm i`), behavioral smoke (paired-tool round-trips), and presence attestation (every load-bearing line of every documented fix). See [`verification/README.md`](../verification/README.md) for the full stack.

## License

MIT
