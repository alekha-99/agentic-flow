# /review — Code Quality Review

Run a comprehensive code review on recent changes.

## Usage

```
/review [file or directory to review]
/review  # Review all uncommitted changes
```

## Checks

1. **Code Quality**: TypeScript strict, immutability, small functions, naming
2. **React Patterns**: Server/client boundaries, hooks rules, composition
3. **Security**: OWASP Top 10, secrets, input validation
4. **Accessibility**: WCAG 2.1 AA, ARIA, keyboard nav
5. **Testing**: Coverage, edge cases, error scenarios
6. **Performance**: Re-renders, bundle size, queries

## Advisor Escalation Gate

Escalate to `advisor` if:
- Findings require architecture-level tradeoff decisions
- A HIGH/CRITICAL issue has no clear low-risk fix
- Remediation affects multiple subsystems with conflicting constraints
- Repeated fixes fail to resolve the same high-severity issue
