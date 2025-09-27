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
