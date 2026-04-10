---
name: tdd-workflow
description: Test-driven development methodology — RED → GREEN → REFACTOR
triggers:
  - /tdd
  - test driven
  - tdd
  - write tests first
applies_to: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"]
---

# TDD Workflow Skill

## Cycle

```
┌─────────┐     ┌─────────┐     ┌──────────┐
│   RED   │────▶│  GREEN  │────▶│ REFACTOR │
│         │     │         │     │          │
│ Write   │     │ Minimal │     │ Clean up │
│ failing │     │ code to │     │ while    │
│ test    │     │ pass    │     │ keeping  │
│         │     │         │     │ green    │
└─────────┘     └─────────┘     └──────┬───┘
     ▲                                  │
     └──────────────────────────────────┘
```

## Step-by-Step

### 1. RED: Write Failing Test
```bash
# Write the test
# Run it — it MUST fail
npm test -- --testPathPattern="MyComponent"
# Expected: FAIL
```

### 2. GREEN: Minimal Implementation
```bash
# Write the minimum code to make the test pass
npm test -- --testPathPattern="MyComponent"
# Expected: PASS
```

### 3. REFACTOR: Improve
```bash
# Clean up code, extract utilities, improve naming
npm test -- --testPathPattern="MyComponent"
# Expected: PASS (all tests still green)
```

### 4. REPEAT
Pick the next requirement and start from RED again.

## Test Priority Order

1. Happy path (main success scenario)
2. Edge cases (empty, null, boundary values)
3. Error cases (invalid input, network failures)
4. Accessibility (keyboard, screen reader)
5. Performance (large data sets, rapid updates)

## Bug Fix TDD (Mandatory)

For every bug fix:
1. Write a test that **reproduces the bug** — must FAIL
2. Fix the bug — test must now PASS
3. Add regression tests — ensure it can't come back
4. Run full suite — no regressions

## Coverage Check

```bash
npm test -- --coverage
# Target: 80%+ on all metrics
```

## Rules

1. Never write code before writing the test
2. Never skip the refactor step
3. One test at a time — not batches
4. Run tests after every change
5. Test names are executable requirements
