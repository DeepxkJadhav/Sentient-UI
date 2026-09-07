---
id: ADR-0001
title: sentient-sparc plugin contract — pinning, namespace coordination, ADR/DDD/Docs phase cross-references, smoke as contract
status: Accepted
date: 2026-05-04
updated: 2026-05-09
authors:
  - reviewer (Claude Code)
tags: [plugin, sparc, methodology, namespace, smoke-test]
---

## Context

`sentient-sparc` (v0.1.0) — SPARC methodology orchestrator (Specification, Pseudocode, Architecture, Refinement, Completion). 1 agent (`sparc-orchestrator`), 3 skills (`sparc-spec`, `sparc-implement`, `sparc-refine`), 1 command (`/sentient-sparc`).

The 5 SPARC phases each have a natural sibling-plugin alignment:

| Phase | Sibling plugin | Purpose |
|-------|----------------|---------|
| **Specification** | `sentient-goals` (deep-research) | Multi-source research orchestration to gather requirements |
| **Pseudocode** | `sentient-sparc` itself | Owned by this plugin |
| **Architecture** | [`sentient-adr`](../../sentient-adr/docs/adrs/0001-adr-plugin-pattern.md) + [`sentient-ddd`](../../sentient-ddd/docs/adrs/0001-ddd-contract.md) | Architecture decisions and bounded contexts |
| **Refinement** | [`sentient-jujutsu`](../../sentient-jujutsu/docs/adrs/0001-jujutsu-contract.md) + [`sentient-testgen`](../../sentient-testgen/) | Diff-aware refactor + test gap analysis |
| **Completion** | [`sentient-docs`](../../sentient-docs/docs/adrs/0001-docs-contract.md) | Auto-generated documentation |

ADR-0001 makes these phase-to-plugin alignments contractually documented so SPARC consumers know which sibling plugin owns each phase's deeper tooling.

## Decision

1. Add this ADR (Proposed).
2. README augment: Compatibility (pin v3.6); Phase-to-plugin alignment table; Namespace coordination (claims `sparc-state`); Verification + Architecture Decisions sections.
3. Bump `0.1.0 → 0.2.0`. Keywords add `mcp`, `phase-gates`, `quality-gates`.
4. `scripts/smoke.sh` — 11 structural checks: version + keywords; all 3 skills + agent + command with valid frontmatter; 5 SPARC phase names documented (Specification/Pseudocode/Architecture/Refinement/Completion); v3.6 pin; namespace coordination; phase-to-plugin alignment table present (cross-references to adr/ddd/jujutsu/testgen/docs); ADR Proposed; no wildcard tools.

## Consequences

**Positive:** SPARC's role as the orchestrator across the methodology family is now contractually documented. Each phase has an explicit canonical handoff plugin.

**Negative:** none material.

## Verification

```bash
bash plugins/sentient-sparc/scripts/smoke.sh
# Expected: "11 passed, 0 failed"
```

## Related

- `plugins/sentient-adr/docs/adrs/0001-adr-plugin-pattern.md` — Architecture phase
- `plugins/sentient-ddd/docs/adrs/0001-ddd-contract.md` — Architecture phase (bounded contexts)
- `plugins/sentient-jujutsu/docs/adrs/0001-jujutsu-contract.md` — Refinement phase (diff analysis)
- `plugins/sentient-docs/docs/adrs/0001-docs-contract.md` — Completion phase (documentation)
- `plugins/sentient-goals/docs/adrs/0001-goals-contract.md` — Specification phase (deep-research)
- `plugins/sentient-agentdb/docs/adrs/0001-agentdb-optimization.md` — namespace convention

## Implementation status

Plugin version v0.2.0 shipped and listed in marketplace.json. Source exists at `plugins/sentient-sparc/`. Contract elements implemented: all 5 SPARC phases cross-linked to sibling plugins (goals, ddd, adr, testgen, docs); namespace `sparc-state` claimed; 3 skills (`sparc-spec`, `sparc-implement`, `sparc-refine`) shipped; smoke-as-contract gate defined in `scripts/smoke.sh` (11 checks).
