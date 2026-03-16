# Testing Guidelines

## Testing Scope and Framework

1. Use Jest as the standard test runner for this project.
2. Write unit tests for individual functions and React components in isolation.
3. Prefer focused unit tests over broad integration behavior unless explicitly required.

## Test File Naming

1. Unit test files must use one of these naming conventions:
   - `*.test.js`
   - `*.test.ts`
2. Name each unit test file to match the unit under test.
3. Keep test files close to the source they validate whenever practical.

## Feature Development Requirements

1. All new features must include appropriate automated tests.
2. Test coverage should include expected behavior, edge cases, and failure paths for the feature.
3. Pull requests that add functionality without tests are considered incomplete unless a clear exception is documented.

## Isolation and Independence

1. Every test must be isolated and independent.
2. Each test must create and manage its own data and state.
3. No test may rely on execution order or outcomes from other tests.
4. Shared mutable state between tests is not allowed.

## Setup and Teardown Requirements

1. Setup and teardown hooks are required where test state or mocks are used.
2. Use Jest lifecycle hooks (`beforeEach`, `afterEach`, and when necessary `beforeAll`/`afterAll`) to initialize and clean up state.
3. Reset and restore mocks between tests to avoid cross-test leakage.
4. Tests must pass reliably across repeated runs.

## Maintainability and Best Practices

1. Keep tests readable, deterministic, and easy to update.
2. Use clear test names that describe the behavior being validated.
3. Minimize duplication by extracting reusable test helpers when it improves clarity.
4. Avoid over-mocking; mock only external dependencies needed to keep unit tests isolated.
5. Ensure assertions are specific and verify observable behavior.
