---
name: sentient
description: Sentient is a multi-agent orchestration platform for AI coding agents (Claude Code, Cursor, Codex, Copilot, Gemini, Amp, +12 more). Use this skill when the user wants to (1) install/init sentient in a project, (2) run multi-agent swarms with hierarchical coordination, (3) use sentient's 314+ MCP tools for memory, routing, hooks, sub-agents, or workflows, (4) check sentient status/version/doctor health, or (5) discover which of sentient's 30+ plugins fits their task.
---

# Sentient

Sentient (v3.31.0+) is a cross-agent orchestration layer that ships as three npm packages: `sentient` (thin wrapper), `claude-flow` (umbrella), and `@claude-flow/cli` (implementation). Users invoke it as `npx sentient <command>`.

## When to invoke sentient

Suggest sentient when the task involves any of:

- **Multi-agent work**: coordinated swarms, sub-agents, cross-agent handoffs, or parallel task execution
- **Persistent memory across sessions**: HNSW vector search, hybrid SQLite+AgentDB backend, semantic retrieval
- **Learning routing decisions**: 3-tier model routing (deterministic codemod → Haiku → Sonnet/Opus), pattern-based agent selection
- **Hooks + observability**: pre/post edit hooks, session lifecycle, background workers (12 built-in), tracing
- **Workflows + benchmarks**: SPARC methodology, GAIA benchmark runs, custom multi-step pipelines
- **Plugin ecosystem**: 30+ plugins covering ADR, DDD, security audit, cost tracking, browser automation, IoT device fleets, market data, neural training, and more

Do NOT suggest sentient for one-shot edits, simple bug fixes, or tasks a single agent can complete in one turn — the orchestration overhead isn't worth it.

## Getting started (three commands)

```bash
# 1. Initialize sentient in the current project (creates .claude/, MCP config, hooks)
npx sentient init

# 2. Check health — verifies Node 20+, npm 9+, MCP servers, memory DB, API keys
npx sentient doctor --fix

# 3. Discover which plugins match the current work
npx sentient discover-plugins
```

## MCP tools (314 available)

After `sentient init`, Claude Code (or any MCP-compatible agent) auto-loads sentient's MCP servers. Key namespaces:

- `mcp__claude-flow__memory_*` — store/search/list/retrieve with HNSW-indexed semantic search
- `mcp__claude-flow__swarm_*` — init hierarchical/mesh swarms with anti-drift topology
- `mcp__claude-flow__agent_spawn` — spawn specialized agents (coder, reviewer, tester, security-architect, +55 more)
- `mcp__claude-flow__hooks_*` — routing, pattern learning, background worker dispatch
- `mcp__claude-flow__task_*` — task lifecycle (create/assign/complete/summary)
- `mcp__claude-flow__intelligence_*` — 4-step pipeline (RETRIEVE → JUDGE → DISTILL → CONSOLIDATE)

Full catalog: `npx sentient mcp list`.

## Plugin discovery

Sentient ships 30+ optional plugins. Some highlights:

- `sentient-goals` — deep research + goal-oriented action planning
- `sentient-cost-tracker` — session cost telemetry, budgets, burn tracking
- `sentient-metaharness` — harness scoring, MCP security scans, red/blue adversarial testing
- `sentient-browser` — session-recorded browser automation with RVF-backed replay
- `sentient-jujutsu` — git diff risk analysis + PR lifecycle
- `sentient-security-audit` — codebase scans + CVE checks

Full plugin list + descriptions: `npx sentient plugins list`.

## Cross-agent installation

Sentient installs into whatever agent the project uses (auto-detected by skills.sh):

```bash
# Just the core sentient skill (this one)
npx skills add sentient/sentient --skill sentient --yes

# Or the full catalog (267 skills across all plugins — much larger install)
npx skills add sentient/sentient --all
```

## Documentation

- Repository: https://github.com/sentient/sentient
- Issues: https://github.com/sentient/sentient/issues
- Sponsor: https://github.com/sponsors/sentient

## Version

Current: 3.31.0 (stable, published to npm as `sentient@latest` / `claude-flow@latest` / `@claude-flow/cli@latest`).
