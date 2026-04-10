---
mode: agent
description: "One-shot development: from request to production code with full tests"
tools:
  - read_file
  - create_file
  - replace_string_in_file
  - grep_search
  - file_search
  - semantic_search
  - run_in_terminal
  - manage_todo_list
  - runSubagent
---

# One-Shot Development Pipeline

Execute the complete development pipeline from analysis to production-ready code.

## Instructions

You are the orchestrator. Given the user's request:

1. **Classify** — Determine type: story | figma | bug | mcp | feature
2. **Analyze** — Extract requirements, acceptance criteria, constraints
3. **Plan** — Create task breakdown, identify components, dependencies
4. **Implement** — Build React/Next.js components, hooks, API routes, pages
5. **Unit Test** — Jest + RTL tests, 80%+ coverage
6. **Integration Test** — API/data flow tests with MSW
7. **E2E Test** — Playwright tests for critical user flows
8. **Review** — Code quality, security (OWASP), accessibility (WCAG)
9. **Summary** — Report all changes, test results, coverage

## Quality Gates

All must pass before completion:
- [ ] TypeScript: zero errors (`npx tsc --noEmit`)
- [ ] Lint: zero warnings (`npm run lint`)
- [ ] Tests: all pass, 80%+ coverage
- [ ] Security: no secrets, inputs validated
- [ ] Accessibility: WCAG 2.1 AA

Implement $input
