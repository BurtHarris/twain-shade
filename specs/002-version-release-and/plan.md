# Implementation Plan (reset)

This plan file was reset on 2025-09-28 to prepare for a fresh planning pass.

Next steps:

- Re-run the /plan workflow to repopulate research, data-model, and design artifacts.
- Keep Phase 0 & Phase 1 outputs focused and minimal: research.md and data-model.md should only contain facts required for design choices.
- Do NOT carry forward implementation details from prior iterations; prefer references to decisions in the spec.

Placeholders (to be created by the workflow):


 research.md — Phase 0 findings (TODO: redo research; current file contains useful notes but must be refreshed)
 data-model.md — entities and contracts (see `data-model.md`)
 contracts/ — API/manifest contracts produced during Phase 1

 Removed placeholder files:

 `quickstart.md` — removed (will be recreated by plan workflow when needed)
 `tasks.md` — removed (use issue tracker or the plan's tasks artifact)

When you're ready I can re-run the plan step and generate Phase 0 outputs.


## Notes moved from spec.md (2025-09-28)

The following notes were moved from `specs/002-version-release-and/spec.md` to keep design decisions centralized in the plan for implementation work.

- Automatic stamping: stamping MUST run automatically on local `npm run build` and on debug launches that trigger packaging.
- Authoritative source: the repository root `package.json` `version` field is the authoritative runtime version.
- Branch-derived prerelease: feature-branch stamps MUST include a prerelease identifier derived from a sanitized branch name (lowercase, letters/digits/.- only).
- Per-run uniqueness for Launch: Launch (debug) stamping MUST append a per-run unique suffix. The implementation MUST persist per-branch counters or an equivalent persisted store so each launch produces a unique increment. The storage location/format is configurable (implementation detail).
- Build uniqueness rules: Packaging/build runs intended for artifacts MUST use a reproducible identifier (commit-short-SHA) rather than the per-run counter.
- Merge-to-master for higher-level versioning: major/minor/patch bumps, changelog generation, and official release automation occur when a branch is merged into `master`.
- Persistence and metadata: stamp metadata (baseVersion, stampedVersion, branch, sanitizedBranch, counter or identifier used, commitShortSha, timestamp, origin) MUST be recorded in a persisted store; the store location and format are configurable.
- package.json mutation and backup: stamping MUTATES `package.json`'s `version` field in-place locally for developer convenience. The stamping tool MUST create a safe backup (timestamped `.bak` or similar) and use atomic writes to avoid partial writes.
- Tests and acceptance tests: unit tests and an acceptance test for Launch stamping MUST be added (Vitest). The acceptance test should simulate a Launch stamp, assert the stamped version format, and verify the persisted metadata.
- CI policy: CI stamping is optional; if enabled it MUST use the reproducible commit-sha behavior, not the per-run counter.
- Error handling: If stamping fails (git errors, file I/O), the tool MUST fail fast with a clear message and avoid leaving `package.json` partially written.


## Clarifications moved from spec.md (2025-09-28)

### Session 2025-09-26

- Q: What is the benefit of updating the patch level on build? → A: Helps debugging
- Q: What versioning rule applies when working in a feature branch? → A: Version numbers should have a pre-release suffix

- Q: What should happen if a user tries to release a version that already exists or conflicts with an existing version? → A: Block the release and show an error

### Session 2025-09-27


### Session 2025-09-28

- Q: Which per-run uniqueness strategy should we use for feature-branch prerelease versions? → A: Persist a small numeric counter in `dist/version-stamp.json` and increment per stamp (Option A).
- Q: Which packaging approach should we use for stamping (package.json mutation vs packaging-only manifest)? → A: Keep current behavior: mutate `package.json` in-place when stamping (Option A).
- Note: There are two distinct stamping scenarios: a) "launch" (developer starts a debug/launch session in VS Code) and b) "build" (developer runs `npm run build` or packaging/prepare step). Debugging launches are the more frequent event and should prioritize per-run uniqueness to force the extension host to reload. Build/packaging runs also require stamping but may tolerate a different suffix strategy if desired (see FR-013).
- Q: Which source should the extension runtime use as authoritative for the stamped version? → A: Use `package.json`'s `version` field as authoritative (Option A).

- **FR-013**: To support repeated debugging sessions and VS Code extension reload quirks, the spec distinguishes two stamping behaviors:
	- Launch (debug): Each debug/launch invocation on a feature branch MUST produce a unique version string by incrementing a per-run counter stored in `dist/version-stamp.json` and appending it after the branch-derived prerelease identifier. Example: `1.2.4-feature-theme-editor.1`, then `1.2.4-feature-theme-editor.2` for subsequent debug starts.
	- Build (packaging): When producing build/package artifacts, the stamping step MUST also produce a unique version but MAY use a commit-derived suffix (short SHA) or the current counter value; implementers should prefer the commit-derived suffix for reproducible builds unless the team requires monotonically increasing package versions.

- To guarantee uniqueness across debug runs, the stamping implementation MUST persist a small numeric counter (for example inside `dist/version-stamp.json`) and increment it on each launch-stamp for the same branch/base version; the counter value is appended after the branch-derived prerelease identifier.
- For build/packaging stamps, the implementation MAY use the commit short SHA instead of incrementing the counter to improve reproducibility of artifacts.
- The stamping implementation WILL update `package.json` in-place when run locally (this is the agreed project behavior). If the team later decides to avoid mutating the working tree, they should create a follow-up to change the stamping implementation to produce a packaging-only manifest instead.

## Tooling & docs moved from spec.md (2025-09-28)

The detailed tooling notes that were previously in `spec.md` are moved here so the spec remains user-focused. Implementers and reviewers should consult this plan note for reference.

- Scripts added (implementation notes):
	- `version-stamp` (`node ./scripts/version-stamp.js`) — apply prerelease suffixes on feature branches and write `dist/version-stamp.json`.
	- `test` -> `vitest run` and `test:ci` for CI-friendly run.
	- `release:prepare` -> `standard-version` to generate changelog and bump versions (manual publish still required).
	- `prepare` -> `husky install` to ensure commit hooks are installed.

- Dev dependencies added (implementation notes): `vitest`, `@vitest/ui`, `standard-version`, `husky`, `@commitlint/*`, `@testing-library/svelte`, `@testing-library/jest-dom`, plus a couple of build helpers. Jest-related packages were removed and tests now run under Vitest.

- Files added/updated (implementation notes):
	- `scripts/version-stamp.js` — lightweight stamp script.
	- `docs/versioning.md` — how and why to run the stamp and release prepare steps.
	- `tests/TESTING_GUIDE.md`, `Svelte_Vitest_Testing_Investigation.md` and related docs updated to prefer Vitest and document the `@testing-library/jest-dom` matcher setup.
	- `CHANGELOG.md` updated with an Unreleased note describing the migration to Vitest.

Notes (moved verbatim):
 - These changes make stamping automatic: build scripts and CI should run the `version-stamp` step as part of artifact creation. Publishing remains manual; stamping alone does not publish artifacts.
 - The stamp script may still mutate `package.json` in-place on feature branches; teams may prefer an implementation that writes a temporary package manifest for packaging to avoid dirtying the working tree in CI.
 - A follow-up issue `ISSUE_CI_VERSION_STAMP.md` should now be used to track enabling stamping in CI and any required credentials or job configuration.
