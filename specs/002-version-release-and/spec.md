# Feature Specification: [FEATURE NAME]

# Feature Specification: Version Release and Icon

**Feature Branch**: `002-version-release-and`  
**Created**: September 26, 2025  
**Status**: Draft  
**Input**: User description: "version release and icon"





1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## User Scenarios & Testing _(mandatory)_

### Primary User Story

A user wants the extension to stamp builds with a distinct version when working on feature branches. The focus is on preparing artifacts locally (stamped version) without initiating any publish/push to registries.  In this project, some quirks of vscode development must be addressed.

### Acceptance Scenarios

1. **Given** a developer builds from a feature branch, **When** the build runs, **Then** the system MUST run the version-stamp step automatically, update the version locally (pre-release suffix) and write `dist/version-stamp.json` without requiring a manual command.
2. **Given** a developer starts a debug/launch session (the more frequent scenario), **When** the launch runs, **Then** the system MUST stamp the version automatically, increment the per-launch counter, update `package.json` in-place, write `dist/version-stamp.json`, and produce a unique version that forces the VS Code extension host to reload the extension.

### Acceptance Tests

- Automated acceptance tests MUST exist for the Launch (debug) scenario and validate at minimum:
   - stamping occurs automatically on launch,
   - `dist/version-stamp.json` is written and the per-run counter increments,
   - the stamped version is authoritative in `package.json` and the extension runtime reads the version from `package.json` at startup (tests should fail if these disagree).
- Automated acceptance tests for Build/packaging are REQUIRED only if full VSIX packaging is implemented; otherwise build tests may be limited to verifying `dist/version-stamp.json` and the presence of the release manifest. VSIX support is optional for this feature.

### Edge Cases
- How does the system handle version conflicts in local artifacts? The system should detect existing `dist` artifacts with identical versions and warn the developer before overwriting; publishing to registries remains manual and is out of scope for this feature.

## Clarifications

### Session 2025-09-28

- Q: Which artifact/file is authoritative at runtime for the extension version? → A: `package.json` (runtime reads from package.json)

- Q: Is CI stamping part of this feature? → A: No. CI stamping is out-of-scope for this feature; see `ISSUE_CI_VERSION_STAMP.md` for the follow-up work.

- Q: Should stamping be triggered on Launch, Build, or both? → A: Deferred. Decision requires short research into Vite/Vitest hot-reload and package/version behavior; see `ISSUE_CI_VERSION_STAMP.md` for tracking.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-007**: When working in a feature branch, the system MUST enforce that version numbers include a pre-release suffix (e.g., `1.2.3-beta`).
- **FR-008**: The system SHOULD update the patch level on each build to aid debugging and traceability.
- **FR-009**: The system SHOULD bump the extension version when preparing for debugging to ensure VS Code reloads the extension correctly.
- **FR-010**: When building or launching from a feature branch, the system MUST automatically apply a pre-release suffix to the extension version.
- **FR-011**: On feature branches the version MUST include a prerelease identifier derived from the branch name (sanitized to be semver-compatible). Example: branch `feature/theme-editor` on base version `1.2.3` -> `1.2.4-feature-theme-editor.<shortsha>`.
 - **FR-012**: DECISION PENDING — The trigger for the version-stamping step (Build vs Launch) requires a short research task to determine the correct default behavior given Vite/Vitest hot-reload and extension-reload quirks. Until that decision is made, implementations SHOULD avoid hard-wiring automatic `package.json` mutations into CI or irreversible build steps. Acceptance tests MUST cover the Launch scenario. CI integration is deferred and tracked in `ISSUE_CI_VERSION_STAMP.md`.
 - **FR-013**: To support repeated debugging sessions and VS Code extension reload quirks, each debug/build invocation on a feature branch MUST produce a unique version string by including a small per-run increment or counter after the branch-derived prerelease identifier (e.g., `1.2.4-feature-theme-editor.1`, then `.2` for subsequent debug starts). A timestamp-based suffix (e.g., `1.2.4-feature-name.20250928T153000`) is an acceptable alternative when a persistent counter is impractical.

- **FR-002**: System MUST update the extension's version metadata when stamping/building locally.
- **FR-006**: System SHOULD warn developers when local `dist/` artifacts with the same version exist and require explicit confirmation before overwriting.

- **FR-011 (safety)**: System MUST NOT automatically publish to registries as part of this feature; publishing remains manual and out-of-scope.

Clarification: At runtime the extension reads its authoritative version from `package.json`. Therefore stamping operations MUST update `package.json` in-place (with a safe backup/atomic write policy). Other artifacts such as `dist/version-stamp.json` or `dist/release-manifest.json` are tooling artifacts and must not be treated as the runtime authoritative source.

### Key Entities

- **Extension Version**: Represents the release version of the extension, including metadata such as version number, release date, and changelog.

---

## Artifact preparation (local packaging)

This subsection describes the local packaging steps the system should perform during a developer-initiated packaging flow (not a webview-initiated release). Publishing to registries is explicitly out of scope for this feature.

1. Prepare artifacts (automated):
   - The project's build scripts will invoke the version-stamp step automatically as part of the local build (for example, `npm run build` should run stamping as a prebuild step). CI integration is deferred.
      - The stamping step updates `package.json` version metadata with the new version string (including pre-release suffix when on feature branches) and writes `dist/version-stamp.json`.
      - The standard build then produces webview assets and collects extension packaging files into a `dist/` directory.
   - Produces a local manifest file (e.g., `dist/release-manifest.json`) containing version, changelog pointer, and artifact paths. Implementation of the manifest file is recommended but optional for an initial iteration. Full VSIX packaging is optional for this feature; if implemented, build tests should verify the VSIX contains the stamped version and release manifest.

2. Validate artifacts (automated checks):
   - Run local validation: schema checks on manifest, icon SVG validation, checksum verification of artifacts.
   - If validation fails: surface errors to the developer and do NOT overwrite `dist/` artifacts.

3. Documentation and checklist (developer action):
   - Provide a short publish checklist in `dist/README.md` and `docs/versioning.md` recommending manual publication via `vsce` or other tools.



Acceptance criteria for artifact preparation:

- `dist/version-stamp.json` is written when stamping is run.
- The system warns before overwriting existing `dist/` artifacts with the same version.
- Automated acceptance tests for the Launch scenario exist and pass.
- If VSIX support is implemented, packaged artifacts (VSIX) MUST include the stamped version and the release manifest; VSIX support is optional for this feature.

---

## Review & Acceptance Checklist

_GATE: Automated checks run during main() execution_

### Content Quality

- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

### Requirement Completeness

- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

---

## Execution Status

_Updated by main() during processing_

- [ ] User description parsed
- [ ] Key concepts extracted
- [ ] Ambiguities marked
- [ ] User scenarios defined
- [ ] Requirements generated
- [ ] Entities identified
- [ ] Review checklist passed

Note: Functional Requirements require additional review and adjustment. The current FR list includes contradictions and rewording is needed to align launch vs build behaviors, authoritative version source, and per-run increment rules. Stop here until FRs are revised.

---

- [ ] No implementation details (languages, frameworks, APIs)

## Tooling & docs changes on this branch

Tooling summary (high level):

- The feature requires a developer-facing version-stamping step that runs as part of common developer workflows (launch/build) to produce stamped local artifacts and update the runtime `package.json` with a backed-up atomic write.
- Implementation details (script names, exact dev-dependencies, and CI wiring) are intentionally kept out of this spec and moved to the implementation plan (`plan.md`) so the spec remains focused on outcomes. See `plan.md` for the moved details and follow-up issues.
