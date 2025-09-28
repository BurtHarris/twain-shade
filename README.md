# twain-shade

This repository contains a Svelte VS Code extension project and includes a small, safe version-stamping utility used during feature launches and CI builds.

## Version stamping

The project includes `scripts/version-stamp.js` — a small CLI and programmatic API for creating reproducible, auditable version stamps for feature branches and CI builds.

Key goals
- Produce a stamped version and persist an audit manifest for each application of the stamp.
- Safe defaults: dry-run by default; explicit `--apply` required to mutate `package.json`.
- Atomic writes and timestamped backups when mutating files.
- Support deterministic CI identifiers via `--ci-token` (preferred) with a backward-compatible alias `--token`.
- Optional per-branch numeric counters (opt-in) for local launches; counters are updated under a lock to avoid races.

Where stamps are stored
- Canonical store: `.version-stamp/store.json` (created/updated when `--apply` is used).
- Per-apply artifact for consumers/CI: `dist/version-stamp.json` (mirrors the store/stamps array for easy consumption).
- Backups: `.version-stamp/backups/` contains timestamped backups of mutated files like `package.json`.

Basic usage

- Dry-run (default): preview a stamp without writing anything

```bash
node scripts/version-stamp.js --dry-run
```

- Apply a stamp (mutates `package.json`, writes store and `dist/version-stamp.json`)

```bash
node scripts/version-stamp.js --apply
```

Identifier and token behavior
- Preferred deterministic token flag for CI: `--ci-token=MY_TOKEN`
- For backward compatibility `--token=MY_TOKEN` is still accepted, but `--ci-token` is preferred.
- Precedence: `--ci-token` (explicit) > `--use-counter` (when enabled and allowed) > git short SHA (default).
- `--dirty` appends `.dirty` to the identifier if the worktree contains uncommitted changes.
- Counters: pass `--use-counter` to enable numeric per-branch counters (incremented under a store lock). Counters are disabled in CI/build contexts unless `--force` is used.

Examples

- CI (recommended): pass a deterministic token from your pipeline

```bash
node scripts/version-stamp.js --apply --ci-token=CI_BUILD_2025_09_28
```

- Local developer (use git short SHA):

```bash
node scripts/version-stamp.js --apply
# results in something like 0.1.1-feature-branch+67d0666
```

- Local counter-based launch (opt-in):

```bash
node scripts/version-stamp.js --apply --use-counter
# results in something like 0.1.1-feature-branch+counter.1
```

- Append dirty marker (when you have uncommitted changes):

```bash
node scripts/version-stamp.js --apply --dirty
# results in something like 0.1.1-feature-branch+67d0666.dirty
```

GitHub Actions snippet (example)

```yaml
# .github/workflows/stamp.yml
name: Stamp
on:
  workflow_dispatch:
  push:
    branches: [ main ]

jobs:
  stamp:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Stamp with CI token
        run: |
          node scripts/version-stamp.js --apply --ci-token=${{ github.run_id }}
```

Security & audit notes
- Do not pass secrets or sensitive data as tokens. Tokens become part of the stamped metadata and may be written to git-backed manifests and build artifacts.
- The canonical store `.version-stamp/store.json` is authoritative for past stamped actions and should be treated as an audit log.

Compatibility / migration
- `--token` remains an alias for `--ci-token` to avoid breaking older scripts. Prefer moving to `--ci-token` for clarity.
- The script is safe by default (dry-run) — CI pipelines should use `--apply` to persist stamps.

Testing
- Tests covering token overrides, dirty behavior, and counter increments live under `tests/integration/` and are exercised by the repo's Vitest configuration.

Feedback & next steps
- If you'd like, I can add a deprecation warning when `--token` is used, or stricter validation on token allowed characters (recommended for CI hygiene). Tell me which you'd prefer and I'll implement it.
