---
mode: agent
description: "Fix bug using TDD: failing test → fix → regression test"
tools:
  - read_file
  - create_file
  - replace_string_in_file
  - grep_search
  - file_search
  - run_in_terminal
  - manage_todo_list
---

# Bug Fix Pipeline (TDD)

Fix a bug using strict test-driven development.

## Instructions

1. **Reproduce** — Understand the bug from the description, error, or stack trace
2. **Write Failing Test** — Create a test that reproduces the bug (MUST fail)
3. **Run Test** — Verify it fails with the expected error
4. **Fix** — Write the minimal code to make the test pass
5. **Run Test** — Verify it passes
6. **Regression Tests** — Add tests for related edge cases
7. **Full Suite** — Run all tests, ensure zero regressions
8. **Review** — Check for similar issues elsewhere in codebase

Fix bug: $input
