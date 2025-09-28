# Feature Specification: [FEATURE NAME]

# Feature Specification: Version Release and Icon

**Feature Branch**: `002-version-release-and`  
**Created**: September 26, 2025  
**Status**: Draft  
**Input**: User description: "version release and icon"

## Clarifications

### Session 2025-09-26

- Q: What is the benefit of updating the patch level on build? → A: Helps debugging
- Q: What versioning rule applies when working in a feature branch? → A: Version numbers should have a pre-release suffix

* Q: What icon formats should be supported for the extension? → A: svg

- Q: What should happen if a user tries to release a version that already exists or conflicts with an existing version? → A: Block the release and show an error

* Q: What icon formats should be supported for the extension? → A: svg

### Session 2025-09-27

- Q: How is a version release initiated? → A: From the VS Code extension UI (webview) — user clicks a Release button inside VS Code
- Q: Should publishing be automated (CI) or manual? → A: Manual for now, not ready to publish

## Execution Flow (main)

```
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

A user wants to release a new version of the extension and ensure it has a distinct icon for identification. The user initiates the release by clicking a "Release" button in the extension's webview (Theme Editor).

### Acceptance Scenarios

1. **Given** the extension is ready for release, **When** the user clicks the "Release" button in the extension's webview, **Then** the system should update the version and prepare release assets.
2. **Given** the extension lacks a custom icon, **When** the user provides or selects an icon, **Then** the system should display the icon in the extension interface and package.

### Edge Cases

- What happens if the provided icon is not SVG? The system should reject the icon and prompt the user to provide an SVG file.
- How does the system handle version conflicts or duplicate releases? The system should block the release and show an error message to the user.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-010**: When building or launching from a feature branch, the system MUST automatically apply a pre-release suffix to the extension version.
- **FR-009**: System SHOULD bump the extension version when preparing for debugging to ensure VS Code reloads the extension correctly.
- **FR-008**: System SHOULD update the patch level on each build to aid debugging and traceability.
- **FR-007**: When working in a feature branch, the system MUST enforce version numbers to include a pre-release suffix (e.g., 1.2.3-beta).
- **FR-001**: System MUST allow users to initiate a version release for the extension via the VS Code extension UI (webview). A prominent "Release" button in the webview MUST begin the release workflow.
- **FR-002**: System MUST update the extension's version metadata upon release.
- **FR-003**: System MUST allow users to provide or select a custom icon for the extension.
- **FR-004**: System MUST display the selected icon in the extension interface and package.
- **FR-005**: System MUST validate that an icon is provided and that it uses a supported image format (e.g., svg, png, ico) before accepting it.
- **FR-006**: System MUST prevent duplicate or conflicting version releases by blocking the release and showing an error message.
- **FR-011**: System MUST NOT automatically publish releases to the Marketplace or other registries. After the release workflow prepares artifacts, publishing is a manual, explicit step performed by the user (or an operator) outside the automated release action.

### Key Entities

- **Extension Version**: Represents the release version of the extension, including metadata such as version number, release date, and changelog.
- **Extension Icon**: Represents the visual identifier for the extension, including file format, size, and usage locations.

---

## Release workflow (artifact preparation and manual publish)

This subsection describes the steps the system performs when a user initiates a release from the extension webview, and the manual actions required to publish the prepared artifacts.

1. Prepare artifacts (automated):
   - The webview Release button triggers the release workflow which:
     - Generates or updates `package.json` version metadata with the new version string (including pre-release suffix when on feature branches).
     - Builds webview assets and collects extension packaging files into a `dist/` release directory.
   - Validates the selected icon is a supported image format (e.g., svg, png, ico) and copies it into the release assets.
     - Produces a release manifest file (e.g., `dist/release-manifest.json`) containing version, changelog pointer, and artifact paths.

2. Validate artifacts (automated checks):
   - Run local validation: schema checks on manifest, icon SVG validation, checksum verification of artifacts.
   - If validation fails: surface errors in the webview and do NOT mark the release as prepared.

3. Manual publish (explicit operator action):
   - After artifacts are prepared and validated, the webview must present a clear "Artifacts prepared" state with a link/button to open the `dist/` folder in the OS file explorer.
   - The user/operator is responsible for manually publishing the prepared artifacts (for example: using `vsce publish`, Marketplace UI, or other registry workflows). The system MUST NOT automatically publish to the Marketplace or any registry.
   - Provide a short publish checklist in the webview and in `dist/README.md`:
     - Confirm version is correct and unique
     - Confirm changelog and release notes included
     - Verify icon renders correctly in preview
     - Run final smoke test locally (reload VS Code with extension)

4. Post-publish (manual confirmation):
   - Once the operator completes publication, they MUST confirm the publish in the webview which records the publish metadata (date, who published, registry URL) to the release manifest.

Acceptance criteria for the workflow:

- Artifacts are generated to `dist/` and pass validation before any publish step is allowed.
- The webview shows explicit prepared/validated state and does not automatically trigger publish.
- Manual publish steps are documented and discoverable in the webview and `dist/README.md`.

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

---

- [ ] No implementation details (languages, frameworks, APIs)
