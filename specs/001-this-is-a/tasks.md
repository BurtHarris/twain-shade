# Tasks: Color Palette State Indicator for VS Code

**Input**: Design documents from `E:\twain-shade\specs\001-this-is-a\`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/

## Phase 3.1: Setup
- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize TypeScript project with VS Code extension dependencies
- [ ] T003 [P] Configure linting and formatting tools (e.g., ESLint, Prettier)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
- [ ] T004 [P] Contract test for palette creation in tests/contract/test_palette_create.ts
- [ ] T005 [P] Contract test for palette editing in tests/contract/test_palette_edit.ts
- [ ] T006 [P] Contract test for palette preview/commit/cancel in tests/contract/test_palette_commit.ts
- [ ] T007 [P] Integration test for live preview in tests/integration/test_live_preview.ts
- [ ] T008 [P] Integration test for accessibility validation in tests/integration/test_accessibility.ts
- [ ] T009 [P] Integration test for versioning and rollback in tests/integration/test_versioning.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T010 [P] Implement Palette model in src/models/palette.ts
- [ ] T011 [P] Implement State model in src/models/state.ts
- [ ] T012 [P] Implement PaletteEditor UI in src/extension/paletteEditor.tsx
- [ ] T013 Implement palette service for color generation and persistence in src/services/paletteService.ts
- [ ] T014 Implement extension entry point and command registration in src/extension/extension.ts

## Phase 3.4: Integration
- [ ] T015 Integrate palette service with VS Code settings and storage
- [ ] T016 Integrate accessibility validation and error handling
- [ ] T017 Integrate versioning and rollback logic
- [ ] T018 Integrate live preview updates with VS Code window trim/status bar

## Phase 3.5: Polish
- [ ] T019 [P] Unit tests for palette service in tests/unit/test_paletteService.ts
- [ ] T020 [P] Unit tests for color generation logic in tests/unit/test_colorGeneration.ts
- [ ] T021 [P] Update documentation and quickstart in docs/quickstart.md
- [ ] T022 Performance tests for UI responsiveness (<100ms) in tests/unit/test_performance.ts
- [ ] T023 Manual testing and accessibility review

## Dependencies
- Tests (T004-T009) before implementation (T010-T018)
- T010 blocks T013, T015
- T012 blocks T014, T018
- Implementation before polish (T019-T023)

## Parallel Example
```
# Launch T004-T009 together:
Task: "Contract test for palette creation in tests/contract/test_palette_create.ts"
Task: "Contract test for palette editing in tests/contract/test_palette_edit.ts"
Task: "Contract test for palette preview/commit/cancel in tests/contract/test_palette_commit.ts"
Task: "Integration test for live preview in tests/integration/test_live_preview.ts"
Task: "Integration test for accessibility validation in tests/integration/test_accessibility.ts"
Task: "Integration test for versioning and rollback in tests/integration/test_versioning.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts
