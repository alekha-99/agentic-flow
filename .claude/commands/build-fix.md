# /build-fix — Fix Build Errors

Diagnose and fix TypeScript, ESLint, and Next.js build errors.

## Usage

```
/build-fix         # Fix all current build errors
/build-fix [file]  # Fix errors in a specific file
```

## Process

1. Collect error output from `tsc`, `eslint`, `next build`
2. Categorize errors by type and root cause
3. Fix root causes first (type errors → imports → lint → config)
4. Verify after each fix
5. Ensure tests still pass

## Advisor Escalation Gate

Escalate to `advisor` when:
- The same root cause persists after 2 fix cycles
- Errors indicate architecture-level mismatch (framework, build graph, config)
- Fix options involve risky tradeoffs across modules
- Build failures include security-critical implications
