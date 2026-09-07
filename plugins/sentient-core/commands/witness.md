---
name: witness
description: Manage and verify a cryptographically-signed fix manifest with temporal history (ADR-103)
argument-hint: "init|regen|verify|history|regressions [--manifest <path>] [--history <path>]"
---

$ARGUMENTS

Run the appropriate witness sub-command. Defaults assume `verification.md.json` and `verification-history.jsonl` at the project root.

```bash
# Bootstrap (one-time per project)
node plugins/sentient-core/scripts/witness/init.mjs

# Regen + append history (each release)
node plugins/sentient-core/scripts/witness/regen.mjs \
  --manifest verification.md.json \
  --history  verification-history.jsonl \
  --fixes    witness-fixes.json

# Verify against live tree
node plugins/sentient-core/scripts/witness/verify.mjs --manifest verification.md.json

# Verify without dependencies or generated dist/ artifacts
node plugins/sentient-core/scripts/witness/verify.mjs \
  --manifest verification.md.json --source-only

# Temporal queries
node plugins/sentient-core/scripts/witness/history.mjs --history verification-history.jsonl summary
node plugins/sentient-core/scripts/witness/history.mjs --history verification-history.jsonl regressions
node plugins/sentient-core/scripts/witness/history.mjs --history verification-history.jsonl timeline --id <fix-id>
```

See `plugins/sentient-core/skills/witness/SKILL.md` for the full workflow + anti-patterns.
