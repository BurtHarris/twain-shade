<!--
Sync Impact Report
Version change: 2.3.0 → 2.4.0
Modified principles: Additional Constraints (Module System)
Added sections: Module System (ESM-only policy)
Removed sections: None
Templates requiring updates: ✅ plan-template.md, ✅ spec-template.md, ✅ tasks-template.md
Follow-up TODOs: None
-->

# Twain Shade Constitution

## Core Principles

### I. Library-First

Every feature starts as a standalone library. Libraries MUST be self-contained, independently testable, and documented. Each library MUST have a clear purpose—no organizational-only libraries.

### II. CLI Interface

Every library MUST expose functionality via CLI. Text in/out protocol: stdin/args → stdout, errors → stderr. Support both JSON and human-readable formats.

### III. Test Discipline

Unit tests MUST be written for all logic that can run in Node. For VS Code extension development, tests MUST use the VS Code Extension Dev Kit. TDD is mandatory: write tests first, ensure they fail, then implement. Red-Green-Refactor cycle strictly enforced.

### IV. Integration Discipline

Integration tests MUST cover new library contracts, contract changes, inter-service communication, and shared schemas. For extension features, integration tests MUST run in VS Code using the extension dev kit.

### V. Simplicity & Versioning

Favor simple solutions. Use semantic versioning (MAJOR.MINOR.PATCH). Breaking changes require justification and documentation.

## Additional Constraints

Technology stack MUST be minimal and justified. Dependencies MUST be documented. Performance standards and security requirements MUST be specified in feature specs.

Module System (ESM-only): The repository MUST use ECMAScript Modules (ESM) exclusively. All source and script files that use module imports/exports MUST be plain `.js` files with ESM semantics (package.json MUST contain `"type": "module"`). The use of `.cjs` or `.mjs` files is PROHIBITED in this project except for intentionally vendored code with clear justification. Build and CI scripts MUST include checks to detect mixed module-format files and fail early. Rationale: Enforcing a single module system avoids loader ambiguity, simplifies tooling, and prevents subtle cross-platform path/loader bugs.

## Development Workflow

Code review is limited to automated checks for single-developer phases. All tests MUST pass before merging. Quality gates: TDD, automated review, and documentation.

## Governance

This constitution supersedes all other practices. Amendments require documentation, approval, and a migration plan. All PRs/reviews MUST verify compliance. Complexity MUST be justified. Use runtime guidance files for development reference.

**Version**: 2.4.0 | **Ratified**: 2025-09-26 | **Last Amended**: 2025-09-27
