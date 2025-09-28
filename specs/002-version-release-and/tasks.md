# Tasks: Version Release and Icon Feature

## Phase 2: Implementation Tasks

### 1. Versioning & Pre-release Suffix

- Automate detection of feature branch and apply pre-release suffix to extension version.
- Ensure version bump triggers extension reload for debugging.

### 2. F5 Debugging Integration

- Configure VS Code `launch.json` for reliable F5 debugging.
- Integrate Vite build process with extension host and webview.
- Document troubleshooting steps for debugging issues.

### 3. SVG Icon Validation & Integration

- Enforce SVG-only icon validation in build pipeline.
- Reference icon in extension manifest and UI.
- Document icon requirements in quickstart.

### 4. Patch Level Management

- Automate patch level increment on each build for traceability.

### 5. Documentation & Contracts

- Update quickstart.md with step-by-step instructions.
- Document data model and contract requirements.
- Ensure all artifacts are up to date and consistent.

## Acceptance Criteria

- All requirements from the specification are implemented and testable.
- Debugging works reliably with F5 in VS Code.
- Pre-release versioning is automatic in feature branches.
- Only SVG icons are accepted and displayed correctly.
- Patch level updates are visible and aid debugging.
