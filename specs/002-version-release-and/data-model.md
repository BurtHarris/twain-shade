# Data Model: Version Release and Icon

## Entities

### Extension Version

- version: string (e.g., 1.2.3-feature)
- branch: string
- preRelease: boolean
- patchLevel: number
- lastBuild: datetime

### Extension Icon

- iconPath: string
- format: string (SVG only)
- size: number (bytes)
- validated: boolean

## Relationships

- Each extension version references one icon.
- Icon must be validated as SVG before packaging.

## Constraints

- Only SVG format is accepted for icons.
- Version must include pre-release suffix when built from a feature branch.
- Patch level should increment on each build for debugging.

## Canonical stamp metadata schema

When the stamping script runs (apply or dry-run) it should emit a small JSON manifest which is useful for auditing and tests. Example schema (recommended):

```json
{
	"baseVersion": "1.2.3",
	"stampedVersion": "1.2.4-feature-x.a1b2c3d",
	"branch": "feature/x",
	"sanitizedBranch": "feature-x",
	"origin": "launch",                 // 'launch' | 'build' | 'ci'
	"counter": 1,                         // optional; present only if counter strategy used
	"commitShortSha": "a1b2c3d",
	"timestamp": "2025-09-28T15:30:00Z",
	"packageJsonBackup": "package.json.bak.20250928T153000Z"
}
```

Notes:
- `baseVersion` is the parsed semver core (no prerelease).  
- `stampedVersion` is the final semver string written to `package.json.version`.  
- `sanitizedBranch` uses the sanitizer rules (lowercase, non-alphanum -> '-', collapse runs, trim, max length ~32).  
- `counter` is optional and only used if the counter token strategy is selected; prefer `commitShortSha` by default for reproducibility.  
- `packageJsonBackup` points to the created backup file (if apply mode).  
