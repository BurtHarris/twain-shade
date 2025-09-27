# Quickstart: Color Palette State Indicator for VS Code

## Prerequisites
- VS Code (latest stable)
- Node.js and npm installed
- PowerShell (pwsh) as primary shell for examples

## Installation
1. Clone the repository:
   ```pwsh
   git clone <repo-url>
   cd <repo-dir>
   ```
2. Install dependencies:
   ```pwsh
   npm install
   ```
3. Build the extension:
   ```pwsh
   npm run build
   ```
4. Launch VS Code in extension development mode:
   ```pwsh
   code .
   # Press F5 to start debugging the extension
   ```

## Usage
1. Open the Palette Editor from the VS Code command palette (`Ctrl+Shift+P` → "Open Palette Editor").
2. Select or create a new palette by specifying primary, secondary, and tertiary colors.
3. Preview changes live in the VS Code window trim and status bar.
4. Press OK to save the palette, or Cancel to discard changes and restore previous colors.
5. Access saved palettes and switch between them as needed.

## Tips
- Use accessible color combinations for active/inactive states.
- Versioning is automatic; check the palette version in the editor.
- For advanced color customization, edit derived colors directly.

## Troubleshooting
- If colors do not update, ensure the extension is enabled and VS Code is in development mode.
- For accessibility warnings, adjust color choices for better contrast.
- Check the changelog for recent updates and version history.

## References
- VS Code Extension API documentation
- WCAG accessibility guidelines
- Project README for more details
