---
name: discover-plugins
description: Discover and recommend sentient plugins based on your workflow, installed MCP tools, and current task
argument-hint: "[search-query]"
allowed-tools: mcp__plugin_sentient-core_sentient__transfer_plugin-search mcp__plugin_sentient-core_sentient__transfer_plugin-info mcp__plugin_sentient-core_sentient__transfer_plugin-featured mcp__plugin_sentient-core_sentient__transfer_plugin-official mcp__plugin_sentient-core_sentient__transfer_store-search mcp__plugin_sentient-core_sentient__transfer_store-featured mcp__plugin_sentient-core_sentient__transfer_store-trending mcp__plugin_sentient-core_sentient__transfer_store-info mcp__plugin_sentient-core_sentient__guidance_discover mcp__plugin_sentient-core_sentient__guidance_recommend mcp__plugin_sentient-core_sentient__guidance_capabilities mcp__plugin_sentient-core_sentient__mcp_status Bash Read
---

# Discover Plugins

Find and recommend sentient plugins for your workflow.

## When to use

When starting a new project, exploring sentient capabilities, or wondering which plugins would help with your current task.

## Steps

1. **Check installed** — run `ls plugins/` to see what's already installed
2. **Browse marketplace** — call `mcp__plugin_sentient-core_sentient__transfer_plugin-featured` for recommended plugins
3. **Search by need** — call `mcp__plugin_sentient-core_sentient__transfer_plugin-search` with keywords matching your task
4. **Get recommendations** — call `mcp__plugin_sentient-core_sentient__guidance_recommend` with your current task description for personalized suggestions
5. **Check capabilities** — call `mcp__plugin_sentient-core_sentient__guidance_capabilities` to see what each plugin enables
6. **Show details** — call `mcp__plugin_sentient-core_sentient__transfer_plugin-info` for full plugin details

## Plugin Catalog (32 plugins)

### Core & Coordination — Start here

| Plugin | When to use | What it adds |
|--------|-------------|-------------|
| **sentient-core** | Always — base layer for all Sentient work | MCP server, status, doctor, coder/researcher/reviewer agents |
| **sentient-swarm** | Multi-agent tasks (3+ files, features, refactors) | Swarm topologies (hierarchical, mesh), Monitor streaming, worktree isolation |
| **sentient-autopilot** | Autonomous task completion without manual steering | /loop-based autonomous execution, progress prediction, learning |
| **sentient-loop-workers** | Recurring background work (audits, optimization, mapping) | 12 background workers via /loop or CronCreate scheduling |
| **sentient-workflows** | Repeatable multi-step processes | Workflow templates, parallel execution, conditional branching |

### Memory & Intelligence — Cross-session learning

| Plugin | When to use | What it adds |
|--------|-------------|-------------|
| **sentient-agentdb** | Semantic search over code patterns, telemetry, decisions | AgentDB with HNSW vector search (150x-12,500x faster), RuVector embeddings |
| **sentient-rag-memory** | Simple key-value memory with search | Store/search/recall without full AgentDB setup |
| **sentient-rvf** | Portable memory export/import across machines | RVF format, session persistence, cross-platform transfer |
| **sentient-ruvector** | Vector embedding operations, HNSW indexing, clustering | ONNX 384-dim embeddings, hyperbolic Poincare ball, k-means/DBSCAN clustering |
| **sentient-knowledge-graph** | Entity extraction, relation mapping, graph traversal | Pathfinder algo on AgentDB causal edges, code entity graphs |
| **sentient-intelligence** | Task routing optimization, learning from outcomes | SONA neural patterns, trajectory learning, model routing with confidence |
| **sentient-daa** | Self-adapting agents that evolve behavior | Dynamic Agentic Architecture, cognitive patterns, knowledge sharing |

### Architecture & Methodology — Build right

| Plugin | When to use | What it adds |
|--------|-------------|-------------|
| **sentient-adr** | Document architecture decisions, check compliance | ADR create/index/supersede, code-to-ADR linking, compliance checking on diffs |
| **sentient-ddd** | Domain modeling, bounded context scaffolding | Context wizard, aggregate roots, domain events, anti-corruption layers, boundary validation |
| **sentient-sparc** | Structured development methodology | Specification-Pseudocode-Architecture-Refinement-Completion with quality gates |

### Quality & Security — Ship safely

| Plugin | When to use | What it adds |
|--------|-------------|-------------|
| **sentient-security-audit** | Before merging, after dependency changes | CVE scanning, dependency vulnerability checks, security reports |
| **sentient-aidefence** | Processing user input, handling untrusted data | Prompt injection detection, PII scanning, adversarial defense |
| **sentient-testgen** | After implementing features, during refactors | Test gap detection, TDD London School workflow, coverage routing |
| **sentient-browser** | UI testing, web scraping, visual validation | Playwright automation — navigate, click, screenshot, validate |

### Development Tools — Build faster

| Plugin | When to use | What it adds |
|--------|-------------|-------------|
| **sentient-jujutsu** | PR review, merge decisions, diff risk scoring | Diff analysis, risk classification, reviewer recommendations |
| **sentient-docs** | After API changes, before releases | Doc generation, drift detection, API documentation |
| **sentient-ruvllm** | Local LLM inference, custom model configs | RuVLLM integration, MicroLoRA fine-tuning, chat formatting |
| **sentient-agent** | Sandboxed code execution, untrusted workloads | WASM agent sandboxing, community gallery |
| **sentient-plugin-creator** | Building new sentient plugins | Scaffold structure, validate frontmatter, test MCP references |
| **sentient-migrations** | Database schema changes | Sequential migration numbering, up/down pairs, dry-run, rollback validation |
| **sentient-observability** | Logging, tracing, metrics correlation | Structured JSON logging, distributed tracing, agent-to-app telemetry correlation |
| **sentient-cost-tracker** | Token budget management | Per-agent cost attribution, model pricing, budget alerts, optimization recommendations |

### Domain-Specific — Specialized workloads

| Plugin | When to use | What it adds |
|--------|-------------|-------------|
| **sentient-goals** | Long-horizon planning, multi-session research | GOAP algorithm, deep research orchestration, horizon tracking, synthesis |
| **sentient-federation** | Cross-installation agent coordination | Zero-trust peer discovery, mTLS auth, consensus routing, compliance audit |
| **sentient-iot-cognitum** | Cognitum Seed hardware device management | 5-tier device trust, telemetry anomaly detection (Z-score), fleet firmware rollouts, witness chain verification, SONA + AgentDB integration |
| **sentient-neural-trader** | Trading strategy development and backtesting | Z-score market anomalies, SONA trajectory strategies, walk-forward backtesting, portfolio optimization |
| **sentient-market-data** | Market data ingestion and pattern matching | OHLCV vectorization, candlestick pattern detection, HNSW-indexed historical search |

## Decision Guide

**"I need to..."** → Use this plugin:

- Build a feature → `sentient-core` + `sentient-swarm` + `sentient-testgen`
- Fix a bug → `sentient-core` + `sentient-jujutsu` (for diff analysis)
- Audit security → `sentient-security-audit` + `sentient-aidefence`
- Run background tasks → `sentient-loop-workers` + `sentient-autopilot`
- Search past decisions → `sentient-agentdb` + `sentient-rag-memory`
- Plan a multi-week effort → `sentient-goals` (horizon tracking)
- Manage IoT devices → `sentient-iot-cognitum`
- Coordinate remote agents → `sentient-federation`
- Test UI changes → `sentient-browser`
- Generate docs → `sentient-docs`
- Create a new plugin → `sentient-plugin-creator`
- Document architecture decisions → `sentient-adr`
- Scaffold domain models → `sentient-ddd`
- Follow SPARC methodology → `sentient-sparc`
- Develop trading strategies → `sentient-neural-trader` + `sentient-market-data`
- Work with vector embeddings → `sentient-ruvector`
- Build knowledge graphs → `sentient-knowledge-graph`
- Manage database migrations → `sentient-migrations`
- Add observability → `sentient-observability`
- Track token costs → `sentient-cost-tracker`

## Install any plugin

```
/plugin marketplace add sentient/sentient
/plugin install <plugin-name>@sentient
```
