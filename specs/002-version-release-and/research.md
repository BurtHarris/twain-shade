# Phase 0: Research for Version Release and Icon

## Key Research Questions
- How to configure VS Code extension debugging (F5) with Svelte 5 and Vite?
- How to automate pre-release version stamping in feature branches?
- What is the best practice for triggering extension reloads after a version bump?
- How to ensure SVG icon validation and integration in the extension package?

## Findings
- VS Code extension debugging with Svelte 5 and Vite requires proper configuration of `launch.json` and Vite build scripts. The extension host must be started with the correct entry point, and the webview should be built and served by Vite.
- Pre-release version stamping can be automated using scripts that detect the current branch and append a suffix to the version in `package.json` or `extension manifest` before build/launch.
- Extension reloads are reliably triggered by bumping the version in `package.json` and reloading the extension in VS Code.
- SVG icon validation should be enforced in the build pipeline, and the icon should be referenced in the extension manifest for display in the marketplace and UI.

## References
- VS Code Extension Authoring Docs: https://code.visualstudio.com/api
- Svelte 5 Docs: https://svelte.dev/docs
- Vite Docs: https://vitejs.dev/guide/
- Example: https://github.com/sveltejs/template-vscode

## Next Steps
- Integrate findings into data model, contracts, and quickstart documentation in Phase 1.
