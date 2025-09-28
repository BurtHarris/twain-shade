# Data Model: Color Palette State Indicator for VS Code

## Entities

### Palette

- **id**: string (unique identifier)
- **name**: string
- **primaryColor**: string (core)
- **secondaryColor**: string (core)
- **tertiaryColor**: string (core)
- **activeTitleBar**: { foreground: string, background: string }
- **inactiveTitleBar**: { foreground: string, background: string }
- **activeStatusBar**: { foreground: string, background: string }
- **inactiveStatusBar**: { foreground: string, background: string }
- **derivedColors**: object (generated colors for other app parts)
- **createdAt**: datetime
- **updatedAt**: datetime
- **version**: string (semantic version)

### State

- **windowId**: string
- **isActive**: boolean
- **currentPaletteId**: string

## Editor (UI Component)

- **PaletteEditor**: Manages selection, preview, and editing of palettes for the current window
- **selectedPaletteId**: string
- **previewPaletteId**: string
- **isEditing**: boolean

## Relationships

- A `Palette` can be assigned to multiple windows (via `State`)
- `PaletteEditor` manages selection and preview for the current window (UI only, not persisted)

## Constraints

- Palette `id` must be unique
- Palette `version` must follow semantic versioning
- Color values must be valid CSS color strings
- Accessibility validation required for all palettes
- Derived colors are generated from primary, secondary, and tertiary core colors

## State Transitions

- Palette selection: `selectedPaletteId` changes, triggers preview
- Palette commit: `selectedPaletteId` is saved, `version` may increment
- Palette cancel: `previewPaletteId` reverts to previous value

## Scale Assumptions

- Support for dozens of palettes per user
- Real-time updates for active/inactive state changes

## Notes

- Designed for modularity and extensibility
- Versioning supports debugging and rollback
- PaletteEditor is a UI/editor concept, not a persistent entity
- Palettes may be specified with just core colors; tool generates a range of derived colors for app parts
