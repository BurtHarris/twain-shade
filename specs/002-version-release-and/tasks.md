# Tasks for Version Stamping Feature

This file lists concrete implementation tasks to complete the stamping feature.

1. Add dependency: `npm install --save-dev semver`
2. Update `scripts/version-stamp.js` to use `semver` for parsing and bumping versions.
3. Implement persisted counter store (default `dist/version-stamp.json`) and ensure atomic writes.
4. Add unit tests (Vitest) covering:
   - branch sanitization
   - semver parsing and bumping for prerelease rules
   - counter persistence and increment
5. Add an acceptance test simulating Launch stamping that verifies `package.json` is updated and stamp store updated.
6. Research Vite/Vitest hot-reload behavior and record decision for stamping trigger (Launch vs Build). Create `ISSUE_CI_VERSION_STAMP.md` if not present.
7. Document backup policy for `package.json` (timestamped .bak) and atomic write approach in `docs/versioning.md`.
8. Optional: add a packaging-only manifest mode (no `package.json` mutation) behind a config flag.

Tasks can be claimed and executed independently; acceptances are the tests described in the spec.
