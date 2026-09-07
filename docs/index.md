---
layout: default
title: Sentient Marketplace
description: Claude Code native agents, swarms, workers, and MCP tools for continuous software engineering
---

# Sentient Marketplace

**Installable agentic workflows for Claude Code -- not just commands.**

Sentient provides native Claude Code plugins for multi-agent orchestration, /loop workers, security auditing, memory-powered RAG, and test generation.

## Quick Install

```bash
# Add the marketplace
/plugin marketplace add sentient/sentient

# Install plugins
/plugin install sentient-core@sentient
/plugin install sentient-swarm@sentient
/plugin install sentient-loop-workers@sentient
```

## Plugins

| Plugin | Description | Install |
|--------|-------------|---------|
| **sentient-core** | MCP server, base commands, project config | `/plugin install sentient-core@sentient` |
| **sentient-swarm** | Teams, agents, Monitor streams, worktree isolation | `/plugin install sentient-swarm@sentient` |
| **sentient-loop-workers** | /loop workers, CronCreate, cache-aware scheduling | `/plugin install sentient-loop-workers@sentient` |
| **sentient-security-audit** | Security review, dependency checks, policy gates | `/plugin install sentient-security-audit@sentient` |
| **sentient-rag-memory** | RuVector memory, HNSW search, AgentDB | `/plugin install sentient-rag-memory@sentient` |
| **sentient-testgen** | Test gap detection, coverage analysis, TDD workflow | `/plugin install sentient-testgen@sentient` |
| **sentient-docs** | Doc generation, drift detection, API docs | `/plugin install sentient-docs@sentient` |
| **sentient-autopilot** | Autonomous /loop completion, learning, prediction | `/plugin install sentient-autopilot@sentient` |
| **sentient-intelligence** | Self-learning SONA patterns, trajectory learning, routing | `/plugin install sentient-intelligence@sentient` |
| **sentient-agentdb** | AgentDB controllers, HNSW vector search, RuVector | `/plugin install sentient-agentdb@sentient` |
| **sentient-aidefence** | AI safety scanning, PII detection, prompt defense | `/plugin install sentient-aidefence@sentient` |
| **sentient-browser** | Playwright browser automation, testing, scraping | `/plugin install sentient-browser@sentient` |
| **sentient-jujutsu** | Git diff analysis, risk scoring, reviewer recs | `/plugin install sentient-jujutsu@sentient` |
| **sentient-agent** | Sandboxed WASM agents and gallery sharing | `/plugin install sentient-agent@sentient` |
| **sentient-workflows** | Workflow templates, orchestration, lifecycle | `/plugin install sentient-workflows@sentient` |
| **sentient-daa** | Dynamic Agentic Architecture, cognitive patterns | `/plugin install sentient-daa@sentient` |
| **sentient-ruvllm** | Local LLM inference, MicroLoRA, chat formatting | `/plugin install sentient-ruvllm@sentient` |
| **sentient-rvf** | RVF portable memory, session persistence | `/plugin install sentient-rvf@sentient` |
| **sentient-plugin-creator** | Scaffold, validate, publish new plugins | `/plugin install sentient-plugin-creator@sentient` |

## How It Works

Sentient plugins extend Claude Code with:
- **Skills** -- Teach Claude Code new workflows (swarm init, /loop workers, security scans)
- **Commands** -- Slash commands for common operations (/status, /audit, /memory)
- **Agents** -- Specialized agent definitions (coder, reviewer, architect, security-auditor)
- **MCP Server** -- 314 tools for coordination, memory, neural learning, and more

## Claude Code Native Integration

Sentient plugins use Claude Code's native capabilities when available:

| Feature | Plugin | Claude Code Native |
|---------|--------|--------------------|
| Periodic workers | sentient-loop-workers | `/loop` + `ScheduleWakeup` |
| Live monitoring | sentient-swarm | `Monitor` tool |
| Background jobs | sentient-loop-workers | `CronCreate` |
| Agent isolation | sentient-swarm | `isolation: "worktree"` |
| Multi-agent comms | sentient-swarm | `TeamCreate` + `SendMessage` |
| Cross-session | sentient-core | `PushNotification` + `RemoteTrigger` |
| Autonomous loops | sentient-autopilot | `/loop` + `ScheduleWakeup` + autopilot MCP |

## Trust & Security

- All plugins are open source -- review before installing
- MCP servers run locally, no data leaves your machine
- Plugins declare required permissions in their manifest
- Pin versions for production use: `/plugin install sentient-core@0.1.0@sentient`
- Security scanning available via sentient-security-audit
- Cryptographically-signed [witness manifest](../verification.md) attests every documented fix; see [Validation System](validation/) for the three-layer regression-protection stack

## Links

- [GitHub Repository](https://github.com/sentient/sentient)
- [npm Packages](https://www.npmjs.com/package/@claude-flow/cli)
- [ADR-091: Native Integration](https://github.com/sentient/sentient/blob/main/v3/docs/adr/ADR-091-loop-monitor-native-integration.md)
- [Issues & Support](https://github.com/sentient/sentient/issues)
