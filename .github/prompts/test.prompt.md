---
mode: agent
description: "Write comprehensive tests: unit + integration + E2E"
tools:
  - read_file
  - create_file
  - replace_string_in_file
  - grep_search
  - file_search
  - run_in_terminal
  - manage_todo_list
---

# Test Generation Pipeline

Generate comprehensive tests for existing code.

## Instructions

1. **Analyze** — Read the source code and understand behavior
2. **Unit Tests** — Jest + RTL for components, hooks, utilities
   - Happy path, edge cases, error scenarios
   - Query priority: getByRole > getByLabel > getByText
3. **Integration Tests** — MSW for API mocking, test data flows
   - API request/response validation
   - Error propagation
   - Auth boundary testing
4. **E2E Tests** — Playwright Page Object Model
   - Critical user flows
   - Cross-browser (Chromium, Firefox, Mobile)
5. **Coverage** — Verify 80%+ on all metrics

Generate tests for: $input
