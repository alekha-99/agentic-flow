---
mode: agent
description: "Code review: quality, security, accessibility, and testing audit"
tools:
  - read_file
  - grep_search
  - file_search
  - run_in_terminal
---

# Code Review Pipeline

Comprehensive code review covering quality, security, and accessibility.

## Instructions

Review the code and report findings organized by severity:

### 1. Code Quality
- TypeScript strict compliance (no `any`, readonly props)
- Immutable patterns (no mutation)
- Small functions (<50 lines), small files (<400 lines)
- Clear naming, no deep nesting

### 2. React/Next.js Patterns
- Server Components by default
- Proper hooks usage
- Error boundaries, Suspense boundaries
- loading.tsx and error.tsx present

### 3. Security (OWASP Top 10)
- No hardcoded secrets
- Input validation with Zod
- XSS prevention, CSRF protection
- Auth checks on protected routes

### 4. Accessibility (WCAG 2.1 AA)
- Semantic HTML, ARIA attributes
- Keyboard navigation, focus management
- Color contrast, screen reader support

### 5. Testing
- 80%+ coverage
- Edge cases and error scenarios covered

Review: $input
