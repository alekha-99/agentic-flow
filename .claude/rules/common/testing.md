# Testing Rules

## Minimum Coverage: 80%

All metrics must meet 80%: statements, branches, functions, lines.

## Test Types (ALL Required)

1. **Unit Tests** — Component rendering, hooks, utilities, pure functions
2. **Integration Tests** — API routes, data flows, service interactions
3. **E2E Tests** — Critical user flows with Playwright

## TDD Workflow (Mandatory for Bug Fixes)

1. Write test first (RED) — it MUST fail
2. Implement minimal code (GREEN)
3. Refactor (IMPROVE)
4. Verify coverage

## Testing Priorities

1. Happy path
2. Error scenarios
3. Edge cases (empty, null, boundary)
4. Loading states
5. Accessibility

## Testing Anti-Patterns (Do NOT)

- Test implementation details
- Use snapshot tests for logic
- Mock everything (mock at boundaries only)
- Skip error scenarios
- Use `any` in test code
- Use index as key in test data
