# Coding Guidelines

This project values code that is simple, consistent, and easy to change. Our default approach is to write JavaScript/TypeScript in a way that favors readability over cleverness, clear behavior over hidden magic, and maintainability over short-term speed.

## Core Principles

Start with the problem, then choose the simplest implementation that satisfies requirements. Keep functions focused, names explicit, and side effects predictable.

Use DRY (Don't Repeat Yourself) thoughtfully:

- Avoid duplicated business rules, validation logic, and data transformations.
- Extract shared logic only after repetition becomes clear.
- Prefer small reusable utilities and UI components over copy/paste.
- Do not over-abstract too early; duplication is sometimes acceptable until a stable pattern appears.

Keep code modular and cohesive:

- Place related logic together and keep module boundaries intentional.
- Keep API/server concerns separate from UI concerns.
- Use single-purpose helpers instead of large multi-responsibility files.

## JavaScript and TypeScript Practices

Use modern language features that improve clarity and safety.

- Prefer `const` by default, then `let` when reassignment is required. Avoid `var`.
- Use descriptive names (`taskDueDate`, `isCompleted`) instead of vague names (`data`, `tmp`).
- Keep functions small and focused on one behavior.
- Return early to reduce nesting and improve readability.
- Use array methods (`map`, `filter`, `find`, `some`) when they are clearer than manual loops.
- Favor immutability for state updates and shared data structures.

For TypeScript-specific work:

- Enable and respect strict typing where available.
- Prefer explicit domain types/interfaces over `any`.
- Model optional values honestly and handle `null`/`undefined` deliberately.
- Narrow types with guards before use instead of forcing casts.

## Error Handling and Async Behavior

Treat failure paths as first-class behavior.

- Validate inputs at boundaries (API handlers, form submit handlers, utility entry points).
- Use `try`/`catch` around async flows that can fail, and return actionable error messages.
- Avoid swallowing errors silently; either handle, transform, or log with useful context.
- Keep asynchronous control flow straightforward; avoid deeply nested promise chains.

## Frontend Quality Expectations

Frontend code should align with the UI and accessibility requirements in this repository.

- Use Material components consistently for primary interactions.
- Preserve keyboard accessibility for all core workflows.
- Keep component state minimal and derived where possible.
- Split large components into smaller presentational and behavioral pieces when complexity grows.
- Use semantic HTML first, then ARIA only where needed.

## Backend Quality Expectations

Backend code should be predictable, secure, and testable.

- Keep route handlers thin; move reusable business logic into service/helper modules.
- Validate request payloads and query parameters.
- Return consistent response shapes and status codes.
- Centralize shared middleware patterns (error handling, request parsing, logging) when practical.

## Testing and Definition of Done

Code is not complete until it is tested.

- Add or update automated tests for every new feature and bug fix.
- Cover expected behavior, edge cases, and failure paths.
- Keep tests isolated, deterministic, and readable.
- Use setup/teardown hooks to prevent state leakage between tests.

Before considering a change complete:

- Confirm behavior matches functional requirements.
- Verify code remains DRY without unnecessary abstraction.
- Ensure naming and structure are easy for the next contributor to understand.
- Run the relevant tests and fix regressions before merging.

## Consistency Over Preference

When multiple valid approaches exist, choose the option that is most consistent with the existing codebase. Team consistency improves long-term velocity more than individual style preferences.