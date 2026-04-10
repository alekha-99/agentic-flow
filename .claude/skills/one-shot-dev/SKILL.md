---
name: one-shot-dev
description: End-to-end development pipeline — from request to production-ready code with full tests in a single pass
triggers:
  - /dev
  - one-shot development
  - full pipeline
  - end to end
applies_to: ["**/*.tsx", "**/*.ts", "**/*.jsx", "**/*.js"]
---

# One-Shot Development Skill

Execute the complete development pipeline with a single command. From analysis to production-ready code with full test coverage.

## Pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ ANALYZE  │───▶│   PLAN   │───▶│  BUILD   │───▶│  TEST    │
│          │    │          │    │          │    │          │
│ • Jira   │    │ • Tasks  │    │ • React  │    │ • Unit   │
│ • Figma  │    │ • Arch   │    │ • Next   │    │ • Integ  │
│ • Bug    │    │ • Deps   │    │ • API    │    │ • E2E    │
└──────────┘    └──────────┘    └──────────┘    └────┬─────┘
                                                      │
                                                ┌─────▼─────┐
                                                │  REVIEW   │
                                                │           │
                                                │ • Code    │
                                                │ • Security│
                                                │ • A11y    │
                                                └───────────┘
```

## Invocation

```
/dev Implement user profile page with avatar upload from Figma design
/dev Fix: pagination returns wrong offset on page 2
/dev PROJ-456: Add shopping cart with Stripe checkout
/dev Build MCP server for Jira ticket fetching
```

## Execution Steps

### Phase 1: Analyze (orchestrator + jira-analyzer / figma-analyzer)
1. Classify request type (story, figma, bug, mcp, feature)
2. Extract requirements, acceptance criteria, constraints
3. Identify affected files and dependencies

### Phase 2: Plan (planner)
1. Design component architecture
2. Create file/folder structure
3. Break down into ordered tasks with dependencies
4. Identify reusable existing code

### Phase 3: Build (react-developer / mcp-developer)
1. Create types and interfaces
2. Implement components (atoms → molecules → organisms)
3. Implement hooks and utilities
4. Implement API routes
5. Implement pages and layouts

### Phase 4: Test (unit-tester → integration-tester → playwright-tester)
1. Write unit tests (Jest + RTL) — 80%+ coverage
2. Write integration tests (MSW + API testing)
3. Write E2E tests (Playwright) for critical flows
4. Verify all tests pass

### Phase 5: Review (code-reviewer + security-reviewer)
1. Code quality audit
2. Security scan (OWASP Top 10)
3. Accessibility check (WCAG 2.1 AA)
4. Fix any CRITICAL or HIGH issues
5. Update documentation

### Phase 6: Summary
Report:
- Files created/modified
- Test results and coverage
- Security findings
- Outstanding items (if any)

## Quality Gates

All must pass before marking complete:
- [ ] `npx tsc --noEmit` — Zero errors
- [ ] `npm run lint` — Zero warnings
- [ ] `npm test` — All pass, 80%+ coverage
- [ ] `npm run build` — Success
- [ ] No hardcoded secrets
- [ ] WCAG 2.1 AA compliance
