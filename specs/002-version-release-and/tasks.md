````markdown
# Tasks for Feature: Version Release and Icon

Feature: Version Release and Icon
Plan source: E:\twain-shade\specs\002-version-release-and\plan.md
Spec source: E:\twain-shade\specs\002-version-release-and\spec.md

Guidelines:
- Follow TDD: write failing tests first, then implement.
- Use ESM modules and Vitest for tests.
- CLI must support `--dry-run` default and `--apply`/`--force`/`--token` overrides.
- Backups go under `.version-stamp/backups/` and are excluded from VSIX via `.vscodeignore`.

---

T001 - Setup: project deps & linting [P]
- Purpose: Ensure repository has required dev dependencies and lint rules for the implementation work.
- Files/commands:
  - `package.json` (add dependency `semver` if not present)
  - `scripts/` directory exists
  - Run: `npm ci` (developer: `npm install`)
- Acceptance:
  - `node_modules/semver` is present
  - `package.json` has `type: "module"`

T002 - Create CLI skeleton `scripts/version-stamp.js`
- Purpose: provide the entrypoint for stamping (ESM).
- Files/commands:
  - Create `scripts/version-stamp.js` (ESM)
  - Expose CLI flags: `--dry-run` (default), `--apply`, `--force`, `--token`, `--json`
  - Export programmatic API: `stamp(options)` that returns the stamp manifest object
- Acceptance:
  - Running `node ./scripts/version-stamp.js --dry-run` exits 0 and prints a JSON preview (no `package.json` mutation)

T003 - Implement branch sanitizer utility `scripts/lib/sanitize-branch.js`
- Purpose: convert git branch names to semver-safe prerelease identifiers.
- Files/commands:
  - Create `scripts/lib/sanitize-branch.js` with exported `sanitizeBranch(name)` function
  - Rules: lowercase, replace non-alphanum with '-', collapse runs, trim '-', max length 32
- Acceptance:
  - Unit tests (Vitest) exist and cover edge cases (long names, unicode, slashes)

T004 - Implement semver bump logic `scripts/lib/version-utils.js`
- Purpose: handle parsing package.json.version and computing stampedVersion
- Files/commands:
  - Create `scripts/lib/version-utils.js` with `computeStampedVersion(baseVersion, prereleaseId, token)`
  - Use `semver.parse` and `semver.inc` from the `semver` package
- Acceptance:
  - Unit tests verify expected outputs (e.g., `1.2.3` -> `1.2.4-feature-x.a1b2c3d`)

T005 - Implement git token retrieval `scripts/lib/git-token.js`
- Purpose: provide default uniqueness token (git short SHA) and fallback to timestamp
- Files/commands:
  - Create `scripts/lib/git-token.js` with `getGitShortSha()` that returns 7-char sha or null
  - Fallback function `timestampToken()` returns ISO-like short token
- Acceptance:
  - In a git repo, `getGitShortSha()` returns 7-char sha
  - Unit tests stub git calls and validate fallback behavior

T006 - Implement atomic write + backup helper `scripts/lib/fs-atomic.js`
- Purpose: safely write `package.json` with temp file + rename and create timestamped backup under `.version-stamp/backups/` on apply
- Files/commands:
  - Create `scripts/lib/fs-atomic.js` with `writeJsonAtomic(targetPath, data, {backupDir, dryRun})`
  - Ensure Windows-safe rename (use fs.rename or fs.copyFile+unlink if needed)
- Acceptance:
  - Unit tests validate that in apply mode a backup file is created under `.version-stamp/backups/` with timestamp in filename

T007 - Wire CLI: integrate utilities into `scripts/version-stamp.js`
- Purpose: implement CLI behavior using utilities from T002-T006
- Files/commands:
  - `scripts/version-stamp.js` uses `sanitizeBranch`, `getGitShortSha`, `computeStampedVersion`, `writeJsonAtomic`
  - CLI flow: read package.json -> compute stampedVersion -> if `--dry-run` output manifest JSON and exit 0 -> if `--apply` perform atomic write and write `dist/version-stamp.json`
  - Respect `--force` to overwrite when duplicate stamped version exists
- Acceptance:
  - `node ./scripts/version-stamp.js --dry-run` prints manifest and exits 0
  - `node ./scripts/version-stamp.js --apply` creates `.version-stamp/backups/package.json.*` and updates `package.json` version

T008 - Add quickstart integration tests / acceptance harness [P]
- Purpose: validate the main developer flows (dry-run, apply, revert) end-to-end
- Files/commands:
  - Create `tests/integration/version-stamp.integration.test.js` (Vitest)
  - Use a temporary git repo fixture (create temp dir, init git, create package.json with baseVersion)
  - Test scenarios: dry-run does not mutate package.json; apply does mutate and creates backup; revert restores backup
- Acceptance:
  - Integration tests run locally and on CI (if runner supports git in temp dir)

T009 - Add unit tests for sanitizer, semver, git token, and fs-atomic [P]
- Purpose: TDD coverage for core logic
- Files/commands:
  - Create `tests/unit/sanitize.test.js`, `tests/unit/version-utils.test.js`, `tests/unit/git-token.test.js`, `tests/unit/fs-atomic.test.js`
  - Use Vitest; test edge cases and Windows path behavior where feasible
- Acceptance:
  - Tests validate expected behavior and run with `npx vitest` (or `npm test` if configured)

T010 - Add contract test placeholders from `contracts/` [P]
- Purpose: create failing contract test scaffolding so TDD workflow shows failing contract tests
- Files/commands:
  - For each file in `contracts/` create a corresponding `tests/contract/` test that asserts the CLI/programmatic API shape (e.g., `stamp()` returns manifest fields)
  - Tests should be marked as pending/expect fail initially
- Acceptance:
  - `tests/contract/*` exist and fail until implementation completes

T011 - Add `.vscodeignore` and `.gitignore` entries for backups and manifest
- Purpose: prevent backups and temp artifacts from being packaged or committed accidentally
- Files/commands:
  - Append to `.vscodeignore`: `.version-stamp/`, `package.json.bak*`, `dist/version-stamp.json`
  - Append to `.gitignore`: `.version-stamp/`, `package.json.bak*`, `dist/version-stamp.json`
- Acceptance:
  - Entries added and VSIX packaging excludes backup files

T012 - Docs & quickstart updates
- Purpose: make the developer workflow discoverable
- Files/commands:
  - Update `specs/002-version-release-and/quickstart.md` with CLI examples and `launch.json` wiring
  - Add `scripts` entries in `package.json` (e.g., `stamp:dry`, `stamp:apply`, `stamp:revert`)
- Acceptance:
  - `quickstart.md` contains examples and `package.json` scripts are present

T013 - Polish: lint, types, and CI notes [P]
- Purpose: tidy up code, add types if desired (.ts conversion optional), and document CI deterministic stamping usage
- Files/commands:
  - Run eslint/formatters over `scripts/`
  - Add notes to `specs/002-version-release-and/research.md` about CI usage and example GitHub Actions snippet
- Acceptance:
  - Lint passes and research.md includes CI snippet

---

Parallel groups (examples):
- Group A [P]: T001, T009, T010 (setup + unit tests + contract placeholders) can run in parallel
- Group B [P]: T002, T003, T004, T005, T006 (implement libs) can run in parallel per-file

Execution notes:
- Follow TDD: create failing tests before implementation tasks.
- For integration tests that require git, ensure `fetch-depth: 0` or run in a full git clone when executing in CI.

---

Generated by plan: E:\twain-shade\specs\002-version-release-and\plan.md
````# Tasks for Version Stamping Feature

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
