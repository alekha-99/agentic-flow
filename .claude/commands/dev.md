# /dev — One-Shot Development Pipeline

Execute the complete development pipeline from analysis to production-ready code with tests.

## Usage

```
/dev [description of what to build or fix]
```

## Examples

```
/dev Implement user profile page from Figma design with avatar upload
/dev Fix: pagination returns wrong results on page 2
/dev PROJ-456: Add shopping cart with Stripe checkout
/dev Build MCP server for fetching Jira tickets
```

## Pipeline

The orchestrator agent will:

1. **Classify** your request (story, figma, bug, MCP, feature)
2. **Analyze** requirements and extract acceptance criteria
3. **Plan** architecture, components, and task breakdown
4. **Implement** React/Next.js components, hooks, API routes
5. **Unit Test** with Jest + React Testing Library (80%+ coverage)
6. **Integration Test** API routes and data flows
7. **E2E Test** critical user flows with Playwright
8. **Review** code quality, security, and accessibility
9. **Document** changes in relevant files

## Quality Gates

All must pass:
- TypeScript compiles with zero errors
- ESLint passes with zero warnings
- All tests pass with 80%+ coverage
- No hardcoded secrets
- WCAG 2.1 AA accessibility

## Advisor Escalation Gate

Escalate to `advisor` before continuing when any condition is met:
- Architecture spans multiple services or cross-cutting concerns
- Security risk is HIGH/CRITICAL or remediation is ambiguous
- Same blocker persists after 2 failed attempts
- Performance target requires non-trivial algorithm tradeoffs
- Requirements are ambiguous with multiple valid implementations

After guidance is returned, resume execution with executor agents.
