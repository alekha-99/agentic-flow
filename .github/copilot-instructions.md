# Agentic Flow — GitHub Copilot Instructions

## Project Overview

This is a React/Next.js development project using an agentic orchestration system. The main orchestrator agent routes requests through specialized sub-agents for end-to-end development with full test coverage.

## Tech Stack

- **UI Library**: React 18+
- **Framework**: Next.js 14+ (App Router) or standalone (Vite, CRA)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Testing**: Jest, React Testing Library, Playwright
- **State**: Zustand, TanStack Query, React Context
- **Forms**: React Hook Form + Zod
- **MCP**: Playwright MCP for E2E testing

## Coding Standards

### TypeScript
- Strict mode enabled — no `any`, no implicit returns
- `readonly` on all interface properties
- Named exports only (no default exports)
- Use `unknown` instead of `any`, narrow with type guards
- Use discriminated unions for variant types

### React
- Composition over props drilling
- Max 150 lines per component
- Error boundaries at feature boundaries
- Suspense boundaries for async operations
- Custom hooks for shared logic

### Next.js (when applicable)
- Server Components by default
- `'use client'` only when needing hooks, event handlers, or browser APIs
- App Router for file-based routing

### Standalone React (Vite/CRA)
- All components are client components
- React Router for routing
- Vite or Webpack for bundling

### File Organization
- Organize by feature/domain, not by type
- 200-400 lines per file, 800 max
- Co-locate tests with source code
- Path aliases: `@/components`, `@/hooks`, `@/lib`, `@/types`

### Naming
- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (`useDebounce.ts`)
- Types: PascalCase, no `I` prefix (`UserProfile`, not `IUserProfile`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- Booleans: `is`/`has`/`should` prefix

### Testing (Mandatory)
- Unit tests: Jest + RTL, 80%+ coverage
- Integration tests: MSW for API mocking
- E2E tests: Playwright with Page Object Model
- TDD for bug fixes: failing test → fix → regression test
- Query priority: `getByRole` > `getByLabel` > `getByText` > `getByTestId`

### Security
- No hardcoded secrets — use environment variables
- Validate all inputs with Zod
- Parameterized queries for database access
- CSRF protection on forms
- Auth checks on all protected routes

### Git
- Conventional commits: `feat:`, `fix:`, `test:`, `refactor:`
- Branch naming: `<type>/<ticket>-<description>`

## One-Shot Development

When asked to implement something, follow this pipeline:
1. Analyze the request type (story, design, bug, feature, MCP)
2. Plan the architecture and task breakdown
3. Implement components, hooks, API routes
4. Write unit tests (80%+ coverage)
5. Write integration tests
6. Write E2E tests for critical flows
7. Review for quality, security, accessibility

## Advisor Strategy

- Executors (Sonnet/Haiku) handle end-to-end implementation by default.
- Escalate to Opus only when complexity, risk, or ambiguity is high.
- After advisory guidance is returned, resume execution with the original executor.
