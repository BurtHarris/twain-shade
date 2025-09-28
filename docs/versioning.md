# Versioning and Release Guide

This document describes the lightweight version-stamping tool and recommended release workflow for contributors. The goal is to teach reproducible versioning without automatic publishing.

## Goals

- Ensure builds from feature branches are uniquely identifiable.
- Keep publishing manual and deliberate.
- Provide a simple script (`npm run version-stamp`) to stamp builds with a prerelease version and a `dist/version-stamp.json` file.
- Offer `standard-version` for changelog automation when preparing a release.

## Quick start

1. Install dev dependencies:

```pwsh
npm install
```

2. During local development on a feature branch run:

```pwsh
npm run version-stamp
```

This will:

- If on a feature branch (branch name contains `feature` or a `-`): bump patch and append a prerelease suffix derived from the branch name and the current short git SHA, and update `package.json` in-place.
- Always write `dist/version-stamp.json` containing metadata: version, timestamp, branch, gitShort.

3. Build your extension:

```pwsh
npm run build
```

4. Prepare a release (manual):

```pwsh
npm run release:prepare
```

This runs `standard-version` which will:

- Bump the version according to Conventional Commits in the changelog.
- Update `CHANGELOG.md` and `package.json` (use with care on protected branches).

Note: `standard-version` only prepares release artifacts and updates changelog; it does not publish to any registry.

## Teaching notes

- We intentionally do not auto-publish to the Marketplace. Publishing requires human review.
- `version-stamp` is intentionally simple and safe — it only mutates `package.json` when on a non-main branch and writes a `dist` stamp for reproducibility.
- For CI usage: consider running `npm run version-stamp` in a pre-build step and storing `dist/version-stamp.json` as a build artifact. This is optional and disabled by default.

## Suggested workflow for feature branches

1. Create a descriptive branch name (e.g., `feature/theme-editor-preview`).
2. Run `npm run version-stamp` locally before building or debugging.
3. Build and test locally. The patched version will help with extension reloads and debugging.
4. When ready to publish from `master`, use `npm run release:prepare` to produce a clean changelog and bump the released version. Publishing remains manual.

## Caveats and future work

- The script edits `package.json` in-place; if you'd like to avoid mutating the working tree, we can change it to write a temporary copy used only for packaging.
- We will add CI examples (GitHub Actions) in a follow-up to keep this doc concise.

