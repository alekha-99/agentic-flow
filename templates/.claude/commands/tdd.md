# /tdd — Test-Driven Development

Enforce the RED → GREEN → REFACTOR cycle.

## Usage

```
/tdd [what to implement or fix]
```

## Process

1. **RED**: Write a failing test that describes the requirement
2. **GREEN**: Write the minimum code to make it pass
3. **REFACTOR**: Clean up while keeping tests green
4. **REPEAT**: Next requirement

For bug fixes, TDD is mandatory:
1. Write a test that reproduces the bug (must FAIL)
2. Fix the bug (test must PASS)
3. Add regression tests
