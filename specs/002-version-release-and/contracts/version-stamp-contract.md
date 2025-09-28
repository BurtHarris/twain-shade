# Contracts: Version Stamp API

This contract documents the small CLI/script API used by the stamping implementation and other automation.

## CLI

- `node ./scripts/version-stamp.js [--apply|--dry-run] [--token=commit|counter|timestamp] [--bump=patch|minor|major] [--branch=<name>] [--counter-file=<path>]`

### Behavior

- `--dry-run` prints the computed `stampedVersion` and writes `dist/version-stamp.json` but does not mutate `package.json`.
- `--apply` writes a backup `package.json.bak.<ISO>` and atomically replaces `package.json` with the stamped version, then writes `dist/version-stamp.json`.
- `--token=commit` (default) uses git short SHA as uniqueness token; `--token=counter` uses a persisted counter file.

## Programmatic API (optional)

Exported functions (for reuse by release tooling):

- `computeStamp({ baseVersion, branch, token, bump }): { stampedVersion, metadata }`
- `applyStamp({ pkgPath, stampedVersion }): { success, backupPath }`
- `readMetadata(path): metadata`

## Manifest

See `data-model.md` for canonical `dist/version-stamp.json` schema.
