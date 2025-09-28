# Palette Contract

## Overview

Defines the contract for palette creation, editing, and application in VS Code.

## Entities

- Palette (core colors, derived colors, version)
- State (active/inactive)
- PaletteEditor (UI/editor)

## Operations

### Create Palette

- Input: primaryColor, secondaryColor, tertiaryColor
- Output: Palette object with derived colors
- Constraints: Valid CSS color strings, accessibility validation

### Edit Palette

- Input: Palette id, updated core colors
- Output: Updated Palette object
- Constraints: Version incremented, accessibility re-validated

### Preview Palette

- Input: Palette id, windowId
- Output: Live update of VS Code window trim/status bar
- Constraints: Non-persistent until commit

### Commit Palette

- Input: Palette id
- Output: Palette saved to disk, version updated
- Constraints: Semantic versioning, rollback supported

### Cancel Edit

- Input: Palette id
- Output: Restore previous colors, discard changes

## Validation

- All palettes must pass accessibility checks
- Derived colors must be visually distinct for active/inactive states
- Versioning must follow semantic versioning

## Error Handling

- Invalid color input: return error, do not apply
- Accessibility failure: warn user, prevent commit
- Version conflict: support rollback or merge

## Notes

- Contract tests should cover all operations and error cases
- Designed for extensibility to other environments
