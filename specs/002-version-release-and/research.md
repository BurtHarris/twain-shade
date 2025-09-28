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

### Semver tooling

- Recommendation: Use the widely-adopted `semver` npm package (https://www.npmjs.com/package/semver) to parse, compare, and increment semantic versions rather than rolling custom parsing logic.
- Benefits:
	- Correct handling of pre-release identifiers and build metadata per semver rules.
	- Reliable bumping of patch/minor/major and safe manipulation of prerelease fields.
	- Small, well-tested API (parse, inc, valid, compare) which simplifies unit tests.
- Usage notes for stamping:
	- Use `semver.parse(packageJson.version)` to obtain a Version object.
	- Use `semver.inc(version, 'patch')` to bump patch, and `semver.inc(version, 'prerelease', identifier)` to increment prerelease counters when appropriate.
	- For reproducible build artifacts prefer `commitShortSha` as a prerelease identifier instead of per-run counters, but use `semver` to format the result.

### Edge cases to test with semver

- Parsing invalid version strings (fail fast).
- Ensuring prerelease increments don't accidentally drop build metadata.
- Comparing prerelease versions for uniqueness checks.

## References

- VS Code Extension Authoring Docs: https://code.visualstudio.com/api
- Svelte 5 Docs: https://svelte.dev/docs
- Vite Docs: https://vitejs.dev/guide/
- Example: https://github.com/sveltejs/template-vscode

## VS Code / vsce integration recommendations

- Run stamping before `vsce package` if you want the VSIX to contain the stamped `package.json.version`.
- Keep stamping out of the normal `vite build` to preserve repeatable builds; provide an explicit `package:stamped` script that runs stamping then packages.
- Default stamping in local dev to `--dry-run`; only apply changes when running packaging or when a developer explicitly requests `--apply`.
- Add `.vscodeignore` entries to exclude backups and manifests (e.g., `package.json.bak*`, `dist/version-stamp.json`). Add the same to `.gitignore` to avoid accidental commits.
- Ensure atomic writes and backups for `package.json` (write temp + rename, store `package.json.bak.<ISO timestamp>`).

## Debugging notes

- Practical debugging may require temporary changes: allow a `--keep-backup` flag and a `stamp:revert` helper to restore the last backup to keep developer workflow smooth.
- For extension F5 debugging, prefer `--dry-run` by default and enable `--apply` only via a `.vscode/settings.json` opt-in (`twain-shade.stampOnLaunch`).
- If VS Code reload requires a version bump to force reloads of the extension host, document the developer flow to stamp, reload, and revert/commit the change.

## CI integration recommendations

### Goals

- CI stamping must be deterministic and auditable. Prefer stamping in CI jobs that have access to git history/tags and explicit release triggers (e.g., `push` to `release` branch or manual workflow dispatch).
- CI should avoid ad-hoc local-style stamping (no `--apply` dry-run toggles) unless running in a controlled release job.

### Options

- semantic-release: best for fully automated CI releases. It analyzes commits and decides version bumps, creates tags, changelogs, and can publish packages. Use when you want CI to manage version and publish automatically. Works well if you adopt Conventional Commits.
- release-it: flexible CLI that can be used in CI as a deterministic step. It can be given an explicit version (computed earlier by a job) and then handles tagging and optional publishing. Good when you want more control and explicit steps.

### Recommended CI flow (GitHub Actions example)

1. Build and test job (run on PRs): run tests, lint; no stamping.
2. Release job (run on tag push, release branch, or manual dispatch):
	 - Checkout with full git history.
	 - Compute stamped version deterministically (e.g., from semver rules or tags) and optionally run `node ./scripts/version-stamp.js --apply --token=commit` to write `package.json`.
	 - Run `npm ci && npm run build`.
	 - Run `vsce package` to produce VSIX using the stamped `package.json`.
	 - Publish artifact and optionally use `release-it` or `semantic-release` to tag/publish.

Example job snippet:

```yaml
name: Release
on:
	workflow_dispatch:
	push:
		tags:
			- 'v*'

jobs:
	release:
		runs-on: ubuntu-latest
		steps:
			- uses: actions/checkout@v4
				with:
					fetch-depth: 0
			- name: Setup Node
				uses: actions/setup-node@v4
				with:
					node-version: '18'
			- name: Install deps
				run: npm ci
			- name: Compute and apply stamp
				run: |
					node ./scripts/version-stamp.js --apply --token=commit
			- name: Build
				run: npm run build
			- name: Package VSIX
				run: npx vsce package -o ./dist/${{ github.repository }}-${{ steps.get_version.outputs.version }}.vsix
			- name: Upload artifact
				uses: actions/upload-artifact@v4
				with:
					name: vsix
					path: ./dist/*.vsix
```

Notes:

- Ensure full git history is available in the checkout (fetch-depth: 0) so commit SHAs are stable.
- Prefer `npm ci` in CI for deterministic installs.
- Keep release jobs explicit and gated (tag push, protected branch, manual dispatch).

### Determinism and reproducibility

- Prefer deriving the stamped version from existing tags/commit history rather than ad-hoc counters to keep artifacts reproducible.
- Emit `dist/version-stamp.json` as part of the workflow and upload it alongside the VSIX for auditability.

### Security

- Keep publishing credentials in CI secrets. Do not embed secrets in manifests. If using `release-it` or `vsce publish`, configure tokens only in CI env and never write them into `package.json`.

## vsce docs & references

The `vsce` CLI is the official tool for packaging and publishing VS Code extensions. It reads `package.json` for metadata (including `version` and `publisher`) and creates a VSIX file suitable for distribution or upload to the marketplace. Good, succinct command reference and examples are available (see CommandMasters summary below) and are useful when scripting packaging/publish steps.

- Key notes from the CommandMasters `vsce` guide:
	- `vsce package` creates a VSIX from the current working tree and `package.json`.
	- `vsce publish` will publish the extension to the marketplace (requires a PAT token configured via environment variable).
	- Use `--out` to control the VSIX filename/location for CI artifact collection.
	- Use `.vscodeignore` to exclude backups and temporary files from the VSIX.

Reference:

https://commandmasters.com/commands/vsce-common/#:~:text=The%20%E2%80%98vsce%E2%80%99%20command%20is%20a%20powerful%20tool%20for,listing%2C%20publishing%2C%20and%20managing%20the%20versioning%20of%20extensions.

### Essentials (copy-paste)

Install / run:

```powershell
# use npx to avoid global install
npx vsce package --out ./dist/extension.vsix
# publish (CI): set VSCE_PAT in environment instead of passing on CLI
npx vsce publish --pat $Env:VSCE_PAT
```

Required `package.json` metadata for `vsce`:

- `name` (identifier), `displayName`, `publisher`, `version`, and `engines.vscode` (version range).
- `publisher` must match the publisher in the Marketplace or the publisher you will publish under.

Packaging notes:

- `vsce package` reads the repository tree and `package.json` to create a VSIX; run stamping before packaging to ensure the VSIX reflects the desired `version`.
- Use `.vscodeignore` to exclude backups, temporary files, and test artifacts from the VSIX. Example entries: `package.json.bak*`, `dist/version-stamp.json`, `*.tmp`.
- Control what gets included via `files` in `package.json` or via `.vscodeignore` — avoid packaging unnecessary `node_modules` unless explicitly required.

Publishing & CI:

- Configure a Marketplace Personal Access Token (PAT) in CI as a secret (commonly named `VSCE_PAT`) and do not store it in repo files.
- Use `fetch-depth: 0` when checking out in CI so commit SHAs are deterministic for stamping.
- Prefer `npx vsce package --out` in CI and upload the produced VSIX as a build artifact for audits.

Security reminder: never commit PATs or tokens; use CI secrets and environment variables instead.

## VS Code debugging terminology & dev-host integration

This project frequently uses the VS Code "Extension Development Host" (the special VS Code instance launched when you press F5) to test the extension and its webview. Below are concise definitions and recommended wiring for stamping and debug workflows.

- Extension Development Host (dev host): a separate VS Code window launched by the debugger to run and test the extension. Triggered via F5 in the extension workspace.
- F5 / Debug Launch: the common way to run the dev host. Controlled by `.vscode/launch.json` and its `preLaunchTask` / `postDebugTask` hooks.
- preLaunchTask: a task (from `.vscode/tasks.json`) that runs before the debug session starts; useful to run stamping in dry-run or apply mode depending on settings.
- postDebugTask: a task that runs after the debug session ends (useful for cleanup or reverting debug-only stamps).
- devhost reload vs version bump: reloading the extension host can be triggered by user action, but changing `package.json.version` is a reliable way to force the host to pick up a new extension package; document and automate this flow for debugging reload cycles.
- webview live-reload: when the extension uses a Vite dev server for webviews, hot-reload of the UI is often handled by Vite; stamping is mainly relevant to extension host reloads where the manifest version matters.

Recommended `launch.json` wiring (sample):

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"name": "Run Extension (dev host)",
			"type": "pwa-node",
			"request": "launch",
			"program": "${workspaceFolder}/out/extension/extension.js",
			"preLaunchTask": "stamp:maybe",
			"cwd": "${workspaceFolder}",
			"outFiles": ["${workspaceFolder}/out/**/*.js"]
		}
	]
}
```

`stamp:maybe` is an npm script (see research suggestions) that reads a developer preference (`.vscode/settings.json` or env var) and runs `version-stamp` in dry-run or apply mode accordingly. Use `postDebugTask` to run a `stamp:revert` if you want automatic cleanup after debugging.

Extensions and add-ins that help debugging

- Svelte / language plugins: `svelte-vscode` and the Svelte Language Server help with Svelte code intelligence but do not affect stamping.
- Extension test runner: use `vscode-test` or test runners integrated with `vitest` for automated extension tests; ensure stamping is either mocked or run in a temp repo during tests.
- Debugger add-ins (e.g., Chrome/Edge debuggers) are useful for webview debugging but unrelated to stamping; keep stamping focused on the extension manifest side.

Practical tip: default stamping to `--dry-run` when launching for debugging. If a developer needs the extension host to reload with a bumped version, provide a documented `--apply` path and a `stamp:revert` helper to restore state after the session.


## Next Steps

- Integrate findings into data model, contracts, and quickstart documentation in Phase 1.
