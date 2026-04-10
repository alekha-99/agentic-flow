# Git Workflow Rules

## Commit Message Format

```
<type>: <description>

<optional body>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`, `style`

Examples:
- `feat: add user profile page with avatar upload`
- `fix: correct pagination offset calculation`
- `test: add integration tests for user API`
- `refactor: extract form validation into custom hook`

## Branch Naming

```
<type>/<ticket-id>-<short-description>
```

Examples:
- `feat/PROJ-123-user-profile`
- `fix/PROJ-456-pagination-offset`
- `test/PROJ-789-e2e-auth-flow`

## PR Workflow

1. Analyze full commit history on the branch
2. Use `git diff main...HEAD` to see all changes
3. Write comprehensive PR description
4. Include test results and coverage
5. Push with `-u` flag for new branches

## Pre-Commit Checklist

- [ ] All tests pass
- [ ] Build succeeds
- [ ] No lint warnings
- [ ] No hardcoded secrets
- [ ] Security review complete
- [ ] Documentation updated
