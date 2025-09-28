# Quickstart: Local version stamping for twain-shade

This quickstart shows the simplest local developer path to compute and inspect a stamped version without mutating `package.json`.

Prerequisites

- Node.js 18+ installed
- Git repository present with at least one commit

Dry-run (inspect stamped version)

```powershell
npm run stamp:dry
# or
node ./scripts/version-stamp.js --dry-run
```

Apply (mutate package.json with backup)

```powershell
npm run stamp:apply
# or
node ./scripts/version-stamp.js --apply
```

Revert (restore most recent backup)

```powershell
npm run stamp:revert
# or
node ./scripts/stamp-revert.js
```

Packaging (create VSIX with stamped version)

```powershell
npm run package:stamped
# which runs: npm run stamp:apply && npx vsce package --out ./dist/extension.vsix
```

Notes

- Default token strategy uses the commit short SHA for reproducibility.
- Default bump is `patch`. Use `--bump=minor` or `--bump=major` to override.
- `stamp:dry` writes `dist/version-stamp.json` for inspection; it does not change `package.json`.
