# Quickstart: Version Release and Icon Feature

## Prerequisites
- Node.js and npm installed
- VS Code with Extension Development tools
- Svelte 5 and Vite dependencies installed

## Steps
1. Clone the repository and checkout the feature branch.
2. Run `npm install` to install dependencies.
3. Ensure your icon is in SVG format and placed in the designated directory.
4. Build the extension using Vite: `npm run build`.
5. Bump the version in `package.json` (pre-release suffix is added automatically in feature branches).
6. Start debugging with F5 in VS Code. Ensure the extension reloads after version bump.
7. Validate the icon is displayed in the extension UI and package.

## Troubleshooting
- If F5 debugging does not work:
	- Ensure the extension version was bumped (run `npm run build` before F5).
	- Check that the extension reloads after a version change.
	- Verify that `dist/extension/extension.js` is up to date and matches your source code.
	- Confirm that source maps are generated for easier debugging.
	- Make sure your `launch.json` points to the correct outFiles and uses the right entry point.
	- For Vite build errors, check your config and Svelte 5 integration.
	- If breakpoints do not hit, try cleaning `dist/` and rebuilding.
	- For persistent issues, restart VS Code and try again.
