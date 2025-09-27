# Theme Color Integration Documentation

## Overview
This extension provides a runtime theme color selector and API for accessibility and customization in Visual Studio Code webviews. It is designed to help users, especially those with vision limitations, adjust VS Code's chromatic windows and UI elements for improved visibility and contrast.

## Key Components
- **ThemeColorSelector.svelte**: Svelte component that lists all available VS Code theme color CSS variables at runtime, allows selection and preview, and provides a debug button (visible only in developer mode).
- **window.getVscodeThemeColors**: JS API exposed in the webview to enumerate all theme color variables.
- **window.debugLogThemeColors**: JS API to log all theme colors to the console for debugging (button shown only if `window.DEV_MODE` is set).

## Usage
1. **ThemeColorSelector.svelte**
   - Place in your webview UI to allow users to select and preview theme colors.
   - The debug button is only visible in advanced developer contexts (`window.DEV_MODE = true`).
2. **API Access**
   - Call `window.getVscodeThemeColors()` to get a dictionary of all theme color variables and their values.
   - Call `window.debugLogThemeColors()` to log all theme colors to the browser console.
3. **Accessibility Goal**
   - The primary goal is to enable users to adjust VS Code's color scheme for better accessibility and personal enhancement.

## Reference
- Official VS Code Theme Color Documentation: https://code.visualstudio.com/api/references/theme-color#dropdown-control

## Future Enhancements
- Display the current base color theme name in the webview.
- All naming, components, commands, and documentation have been refactored from "Palette" to "Theme" for consistency with VS Code terminology and user expectations. The extension now uses "Theme" throughout the codebase and UI.
- Add more accessibility features and customization options as needed.
