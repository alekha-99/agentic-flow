# Development Mode Context

You are in **development mode**. Focus on:

## Priorities

1. **Write working code** — Functional, tested, accessible
2. **Follow the pipeline** — Analyze → Plan → Build → Test → Review
3. **Test everything** — 80%+ coverage, unit + integration + E2E
4. **Security by default** — OWASP checks, no secrets, input validation

## Quality Standards

- TypeScript strict mode (no `any`, `readonly` props)
- Tailwind CSS (no inline styles)
- Server Components by default
- Immutable state updates
- Convention commits

## Testing Strategy

- Components: Jest + RTL (behavior, not implementation)
- API Routes: Request/response tests
- Data Flows: MSW integration tests
- User Flows: Playwright E2E

## When Stuck

1. Read the error message carefully
2. Check existing tests for patterns
3. Search the codebase for similar implementations
4. Consult the skill library for the relevant domain
