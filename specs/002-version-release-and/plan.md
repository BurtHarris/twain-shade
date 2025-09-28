# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

This feature adds a local version-stamping step for developer workflows (Launch and Build) that applies a branch-derived prerelease identifier and a short uniqueness token to `package.json` and emits a tooling manifest `dist/version-stamp.json`.

Primary requirement: automatically stamp local builds on feature branches so debug and local packaging produce unique, traceable versions without publishing to registries.

Technical approach: implement a small Node.js CLI under `scripts/version-stamp.js` that uses the `semver` package for version arithmetic, sanitizes branch names into prerelease identifiers, reads the Git commit short SHA as the default token, performs an atomic update of `package.json` with timestamped backups under `.version-stamp/backups/`, and emits `dist/version-stamp.json`. The CLI will default to `--dry-run` and support `--apply`, `--force`, and `--token` flags for overrides.

## Technical Context

**Language/Version**: Node.js (ESM) — repository enforces ESM-only via constitution
**Primary Dependencies**: `semver` (already added to dependencies), Node.js standard fs modules, optional `execa`/`simple-git` for git interactions (implementation may use `child_process` to call `git rev-parse --short HEAD`)
**Storage**: Local file writes only (package.json, `.version-stamp/backups/`, `dist/version-stamp.json`)
**Testing**: Vitest (existing test setup in repository) for unit and integration tests; VS Code extension integration tests for runtime validation of stamped version where applicable
**Target Platform**: Developer machines (Windows, macOS, Linux) — take care with atomic write semantics on Windows
**Module System**: ESM-only per constitution (implement CLI as `.js` ESM file; ensure `package.json` contains "type": "module")
**Project Type**: Single VS Code extension project (source under `src/`, webview under `src/extension/webview`)
**Performance Goals**: Minimal — stamping is a fast local file operation; prioritise correctness and atomicity over speed
**Constraints**: Follow constitution: CLI interface, TDD, ESM-only. Avoid adding heavy dependencies; prefer small, audited packages.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Checked against `.specify/memory/constitution.md` (version 2.4.0). Relevant gates:

- Library-First: stamping logic will be implemented as a small library (exported functions) with a thin CLI wrapper to satisfy the Library-First and CLI Interface principles.
- CLI Interface: CLI will accept JSON and human-readable output; implement `--json` and `--dry-run` output modes.
- Test Discipline: Unit tests (Vitest) will be added for sanitizer, semantic version bump logic, git token retrieval, and file backup behavior.
- Module System: Implementation will be ESM-only; use `.js` ESM modules and keep file formats consistent.

Result: PASS — The proposed design adheres to constitutional constraints. No violations detected.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

Current status: `research.md` exists and contains SemVer recommendations, VS Code/vsce packaging notes, CI guidance, and rationale for choosing Git short SHA as the default uniqueness token. Phase 0 is marked complete for this feature.

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/\*, failing tests, quickstart.md, agent-specific file

Current status: Phase 1 artifacts exist. `data-model.md`, `quickstart.md`, and `contracts/` are present. `data-model.md` defines the canonical stamping manifest schema. `quickstart.md` documents developer workflow. Contracts directory contains CLI contract and programmatic API outline.

Next Phase 1 actions (to be executed now as part of /plan):
 - Ensure `data-model.md` aligns with `spec.md` clarifications (sanitized branch, commitShortSha, timestamp, packageJsonBackup)
 - Generate failing contract test placeholders under `contracts/tests/` (one per contract) so test scaffolding exists and will fail until implementation is completed
 - Agent context update already executed to register this plan's tech choices with dev agents

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P]
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:

- TDD order: Tests before implementation
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete
- [x] Phase 1: Design complete (artifacts present)
- [ ] Phase 2: Task planning described (to be generated by /tasks)
- [ ] Phase 3: Tasks generated
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---

_Based on Constitution v2.1.1 - See `/memory/constitution.md`_
