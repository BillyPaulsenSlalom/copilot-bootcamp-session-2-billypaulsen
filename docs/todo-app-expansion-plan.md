# TODO App Expansion Implementation Plan

This plan aligns with the project standards in:
- .github/copilot-instructions.md
- docs/functional-requirements.md
- docs/ui-guidelines.md
- docs/coding-guidelines.md
- docs/testing-guidelines.md

## 1. Align Data Model and API with TODO Requirements

### Goals
- Move from item-based data to task-based data.
- Support all required task lifecycle operations.

### Backend changes
- Replace current item shape (`name`, `created_at`) with:
  - `id`
  - `title`
  - `dueDate` (nullable)
  - `completed` (boolean)
  - `createdAt`
  - `updatedAt`
- Update backend schema and routes in `packages/backend/src/app.js` to support:
  - `GET /api/tasks`: list tasks
  - `POST /api/tasks`: create task with title and optional due date
  - `PATCH /api/tasks/:id`: update title, due date, and completion status
  - `DELETE /api/tasks/:id`: delete task
- Keep route handlers thin by extracting reusable validation and mapping helpers into small modules under `packages/backend/src`.
- Return consistent error responses for easier frontend handling, for example:
  - `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] } }`

### Acceptance criteria
- API supports create, read, edit, complete toggle, and delete flows.
- Payload validation is enforced for title and due date.
- Response shape is consistent across success and error paths.

## 2. Rebuild Frontend with Material Components and Required Workflows

### Goals
- Satisfy all functional requirements with accessible interactions.
- Replace basic HTML controls with Material components for primary patterns.

### Frontend changes
- Refactor `packages/frontend/src/App.js` to use Material UI patterns:
  - App shell: AppBar, Container, Paper
  - Task input: labeled TextField(s) with helper/error states
  - Actions: Button variants based on priority
  - Task display: List/ListItem or Card hierarchy
  - Status controls: Checkbox/Chip with visible text labels
  - Confirmation: Dialog for destructive actions
  - Feedback: Snackbar/Alert for async success and error states
- Implement required workflows:
  - Create task
  - View task list
  - Mark task complete
  - Delete task
  - Add due date
  - Edit title and due date
- Keep keyboard support first-class:
  - Logical tab order
  - Enter/Space behavior for controls
  - Escape closes dialogs/overlays
  - Visible focus indicators on all focusable elements

### Acceptance criteria
- All core workflows are keyboard accessible.
- Material components are used consistently.
- No functional regression in CRUD operations.

## 3. Apply Visual and Accessibility Standards

### Goals
- Match the calming blue design language and readability standards.
- Ensure WCAG-aware visual accessibility.

### Styling changes
- Update `packages/frontend/src/App.css` and `packages/frontend/src/index.css` to adopt design tokens aligned to UI guidelines:
  - Primary: `#2F6FA8`
  - Primary dark: `#1E4F7A`
  - Primary light: `#EAF3FB`
  - Accent: `#5AA3D6`
  - Background: `#F7FAFD`
  - Surface: `#FFFFFF`
  - Text primary: `#1F2A37`
  - Text secondary: `#4B5B6B`
  - Divider: `#D6E2EE`
  - Error: `#B3261E`
  - Success: `#2E7D32`
- Use an 8px spacing rhythm and responsive breakpoints for mobile and desktop.
- Ensure state communication does not rely on color alone (text/icon cues included).

### Acceptance criteria
- Contrast and focus visibility satisfy WCAG 2.1 AA targets.
- Layout remains usable on common viewport sizes.
- Empty, loading, success, and error states are clear and actionable.

## 4. Improve Frontend Structure for Maintainability and DRY

### Goals
- Reduce complexity and keep code easy to evolve.

### Component/module plan
- Split logic into focused units:
  - `TaskForm`
  - `TaskList`
  - `TaskItem`
  - `DeleteTaskDialog`
  - `TaskSnackbar`
- Add a small API client module (for example `tasksApi`) to centralize:
  - endpoint URLs
  - request/response parsing
  - error normalization
- Keep state minimal and derived where possible.

### Acceptance criteria
- Main app file no longer contains all UI and data logic.
- Shared logic is reused without premature abstraction.
- Naming and module boundaries are explicit and consistent.

## 5. Update Backend Automated Tests

### Goals
- Ensure API behavior is validated for expected, edge, and failure paths.

### Test updates
- Replace item-based tests in `packages/backend/__tests__/app.test.js` with task-based coverage:
  - create with valid title
  - create with optional due date
  - reject invalid title and invalid due date
  - edit title and due date
  - toggle complete/incomplete
  - delete existing task
  - return 404 for missing task
- Use setup/teardown hooks and isolate test state.

### Acceptance criteria
- Tests are deterministic and independent.
- Failure-path assertions are explicit.
- No shared mutable state leaks between tests.

## 6. Update Frontend Automated Tests

### Goals
- Align UI tests to the updated TODO workflows and UI content.

### Test updates
- Rewrite `packages/frontend/src/__tests__/App.test.js` to remove outdated assertions and cover:
  - initial load and task rendering
  - empty state rendering
  - add task flow
  - complete/uncomplete flow
  - edit title/due date flow
  - delete flow with confirmation dialog
  - API failure handling with visible error feedback
  - keyboard flow checks (Enter submit, Escape close)
- Use MSW handlers to keep tests isolated and deterministic.

### Acceptance criteria
- Tests validate observable user behavior, not implementation details.
- Async flows are stable across repeated runs.
- Naming clearly reflects behavior under test.

## 7. Add Integration and E2E Coverage

### Goals
- Validate system behavior beyond isolated unit tests.

### Integration tests
- Add backend integration tests in `packages/backend/__tests__/integration/` for `/api/tasks` lifecycle behavior with real HTTP requests.

### E2E tests
- Add Playwright specs under `tests/e2e/` with Page Object Model.
- Keep 5-8 high-value, independent tests focused on critical journeys:
  - create, edit, complete, and delete task
  - due date validation and display
  - keyboard-only core flow
  - error and recovery behavior

### Acceptance criteria
- Integration tests catch endpoint contract regressions.
- E2E suite verifies core user journeys end-to-end.

## 8. Delivery Sequence and Definition of Done

### Suggested implementation sequence
1. Backend task model + route updates + backend tests
2. Frontend Material migration + required workflows
3. Frontend unit tests
4. Backend integration tests
5. E2E tests and accessibility pass

### Definition of done
- Functional requirements in `docs/functional-requirements.md` are satisfied.
- UI and accessibility requirements in `docs/ui-guidelines.md` are satisfied.
- Code quality follows `docs/coding-guidelines.md`.
- Testing expectations from `docs/testing-guidelines.md` are met.
- Root-level validation passes:
  - `npm test`
  - `npm run test:all`

## 9. Milestone Checklist

Use this checklist to track delivery status during implementation.

### Milestone tracking
- [x] Phase 1 complete: Backend task data model, schema migration, and `/api/tasks` endpoints implemented.
- [x] Phase 2 complete: Frontend migrated to Material component patterns for core workflows.
- [x] Phase 3 complete: UI styling aligns to calming blue palette, 8px spacing rhythm, and responsive behavior.
- [x] Phase 4 complete: Frontend refactored into focused components and shared API client utilities.
- [x] Phase 5 complete: Backend unit tests updated for task lifecycle and validation coverage.
- [x] Phase 6 complete: Frontend unit tests updated for create/edit/complete/delete and keyboard flows.
- [x] Phase 7 complete: Backend integration tests added under `packages/backend/__tests__/integration/`.
- [x] Phase 8 complete: Playwright E2E suite added for critical user journeys using Page Object Model.

### Quality sign-off checklist
- [x] Functional requirements validated against `docs/functional-requirements.md`.
- [x] UI/accessibility checks validated against `docs/ui-guidelines.md` (keyboard-only flow, focus visibility, contrast).
- [x] Coding standards validated against `docs/coding-guidelines.md` (clarity, modularity, DRY without over-abstraction).
- [x] Testing standards validated against `docs/testing-guidelines.md` (isolation, deterministic behavior, edge/failure coverage).
- [x] Root checks pass from repository root: `npm test` and `npm run test:all`.
