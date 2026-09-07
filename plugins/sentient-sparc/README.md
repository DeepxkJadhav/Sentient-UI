# sentient-sparc

SPARC methodology -- Specification, Pseudocode, Architecture, Refinement, Completion phases with quality gates between each phase.

## Overview

Drives features through a rigorous five-phase development lifecycle. Each phase has a quality gate that must pass before advancing. The orchestrator spawns specialized agents per phase (researcher, planner, system-architect, coder/tester, reviewer) and stores all artifacts and gate results in memory for traceability.

## Installation

```bash
claude --plugin-dir plugins/sentient-sparc
```

## Agents

| Agent | Model | Role |
|-------|-------|------|
| `sparc-orchestrator` | sonnet | Orchestrate 5-phase SPARC lifecycle, enforce gate checks, spawn phase-specific agents, track state in memory |

## Skills

| Skill | Usage | Description |
|-------|-------|-------------|
| `sparc-spec` | `/sparc-spec <feature-description>` | Run the Specification phase -- gather requirements, define acceptance criteria, identify constraints |
| `sparc-implement` | `/sparc-implement` | Run the Architecture and Implementation phases -- design modules, write pseudocode, implement, test |
| `sparc-refine` | `/sparc-refine` | Run Refinement and Completion -- review code, improve coverage, validate against spec, generate docs |

## Commands (5 subcommands)

```bash
sparc init <feature>         # Initialize a new SPARC workflow
sparc status                 # Show current phase and gate history
sparc advance                # Attempt gate check, advance to next phase
sparc phase <phase-name>     # Jump to a specific phase (spec/pseudo/arch/refine/complete)
sparc report                 # Generate full SPARC methodology report with traceability matrix
```

## The 5 Phases

| Phase | Name | Gate Criteria | Spawned Agent |
|-------|------|--------------|---------------|
| 1 | Specification | >= 3 acceptance criteria, constraints, edge cases | `researcher` |
| 2 | Pseudocode | Covers all ACs, error paths explicit, complexity annotated | `planner` |
| 3 | Architecture | All constraints addressed, typed API contracts, no circular deps | `system-architect` |
| 4 | Refinement | All ACs have passing tests, review approved, coverage >= 80% | `coder` + `tester` |
| 5 | Completion | All tests green, docs complete, deployment checklist verified | `reviewer` |

## Memory Namespaces

| Namespace | Purpose |
|-----------|---------|
| `sparc-state` | Current phase tracking per feature |
| `sparc-phases` | Phase artifacts (specs, pseudocode, ADRs, reports) |
| `sparc-gates` | Gate check results and history |
| `patterns` | Learned SPARC execution patterns |

## Compatibility

- **CLI:** pinned to `@claude-flow/cli` v3.6 major+minor.
- **Verification:** `bash plugins/sentient-sparc/scripts/smoke.sh` is the contract.

## Phase-to-plugin alignment

Each SPARC phase has a canonical handoff plugin that owns its deeper tooling:

| Phase | Owner | What it provides |
|-------|-------|-----------------|
| **Specification** | [sentient-goals](../sentient-goals/docs/adrs/0001-goals-contract.md) (deep-research) | Multi-source research orchestration to gather requirements |
| **Pseudocode** | `sentient-sparc` (this plugin) | Pseudocode generation + complexity annotation |
| **Architecture** | [sentient-adr](../sentient-adr/docs/adrs/0001-adr-plugin-pattern.md) + [sentient-ddd](../sentient-ddd/docs/adrs/0001-ddd-contract.md) | ADR creation + bounded-context modeling |
| **Refinement** | [sentient-jujutsu](../sentient-jujutsu/docs/adrs/0001-jujutsu-contract.md) + sentient-testgen | Diff-aware refactor + test gap analysis |
| **Completion** | [sentient-docs](../sentient-docs/docs/adrs/0001-docs-contract.md) | Auto-generated documentation |

This plugin orchestrates the lifecycle; sibling plugins do the deep work per phase.

## Namespace coordination

This plugin owns three AgentDB namespaces, all kebab-case compliant per [sentient-agentdb ADR-0001 §"Namespace convention"](../sentient-agentdb/docs/adrs/0001-agentdb-optimization.md):

| Namespace | Purpose |
|-----------|---------|
| `sparc-state` | Current phase tracking per feature |
| `sparc-phases` | Phase artifacts (specs, pseudocode, ADRs, reports) |
| `sparc-gates` | Gate check results and history |

Additionally, the shared `patterns` (plural) namespace is consumed (not owned) for cross-feature SPARC pattern learning — note the pluralization (different from the singular `pattern` ReasoningBank target). Reserved namespaces (`pattern`, `claude-memories`, `default`) MUST NOT be shadowed.

## Verification

```bash
bash plugins/sentient-sparc/scripts/smoke.sh
# Expected: "11 passed, 0 failed"
```

## Architecture Decisions

- [`ADR-0001` — sentient-sparc plugin contract (phase-to-plugin alignment, namespace coordination, smoke as contract)](./docs/adrs/0001-sparc-contract.md)

## Related Plugins

- `sentient-agentdb` — namespace convention owner; backing store for sparc-state/-phases/-gates
- `sentient-goals` — Specification phase deep-research
- `sentient-adr` -- Architecture decisions recorded as ADRs in Phase 3
- `sentient-ddd` -- Architecture phase uses DDD bounded context patterns
- `sentient-jujutsu` -- Refinement phase diff analysis
- `sentient-docs` -- Completion phase documentation generation

## License

MIT
