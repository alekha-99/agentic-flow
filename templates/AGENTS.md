# Agentic Flow — Agent Roster

> Cross-tool agent definitions. Read by Claude Code, Cursor, Codex, and other AI harnesses.

## Orchestration Model

```
                    ┌─────────────────┐
                    │   ORCHESTRATOR   │
                    │  (Main Agent)    │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐        ┌────▼────┐        ┌────▼────┐
    │ ANALYZE │        │  BUILD  │        │  VERIFY │
    │  Phase  │        │  Phase  │        │  Phase  │
    └────┬────┘        └────┬────┘        └────┬────┘
         │                   │                   │
    ┌────▼────┐        ┌────▼────┐        ┌────▼────┐
    │  jira   │        │  react  │        │  unit   │
    │analyzer │        │  dev    │        │ tester  │
    ├─────────┤        ├─────────┤        ├─────────┤
    │  figma  │        │   mcp   │        │  integ  │
    │analyzer │        │   dev   │        │ tester  │
    ├─────────┤        ├─────────┤        ├─────────┤
    │ planner │        │  build  │        │playwrite│
    │         │        │resolver │        │ tester  │
    └─────────┘        └─────────┘        ├─────────┤
                                          │  code   │
                                          │reviewer │
                                          ├─────────┤
                                          │security │
                                          │reviewer │
                                          └─────────┘
```

## Agent Definitions

### orchestrator

**Role**: Main coordinator and request router
**Tools**: All tools — delegates to sub-agents
**Model**: sonnet (default), opus for complex architecture
**When to use**: Every request starts here. The orchestrator classifies the request type and dispatches the correct pipeline.

### jira-analyzer

**Role**: Parse Jira stories and extract implementation requirements
**Tools**: Read, Grep, Glob, WebFetch
**Model**: haiku
**When to use**: When the user provides a Jira story, ticket URL, or acceptance criteria.

### figma-analyzer

**Role**: Analyze Figma designs and extract component specifications
**Tools**: Read, Grep, Glob, WebFetch, MCP (Figma)
**Model**: sonnet
**When to use**: When the user provides Figma URLs, design screenshots, or component specs.

### planner

**Role**: Create structured implementation plans with task breakdowns
**Tools**: Read, Grep, Glob, Bash, TodoWrite
**Model**: sonnet
**When to use**: Before any implementation. Creates phased plan with dependencies, risks, and estimates.

### react-nextjs-developer

**Role**: Implement React 18+ and Next.js 14+ components and pages (standalone Vite/CRA or Next.js App Router)
**Tools**: Read, Write, Edit, Grep, Glob, Bash
**Model**: sonnet
**When to use**: When building UI components, pages, layouts, or client-side logic. Handles both standalone React (Vite/CRA) and Next.js (App Router, Server Components, data fetching). Detects project type from config files. Consumes hooks produced by `api-developer` — never calls APIs directly.

### api-developer

**Role**: Build the complete API integration layer — TypeScript types, service functions, TanStack Query hooks, auth interceptors, error handling, and MSW mock handlers
**Tools**: Read, Write, Edit, Grep, Glob, Bash
**Model**: sonnet
**When to use**: Whenever a feature requires data from an API. Runs before `react-nextjs-developer` in every pipeline that involves data fetching. Also used standalone via `/api` command to integrate a single endpoint.

### mcp-developer

**Role**: Build MCP server tools, handlers, and integrations
**Tools**: Read, Write, Edit, Grep, Glob, Bash
**Model**: sonnet
**When to use**: When developing MCP server endpoints, tools, or protocol integrations.

### unit-tester

**Role**: Write Jest + React Testing Library unit tests
**Tools**: Read, Write, Edit, Grep, Glob, Bash
**Model**: sonnet
**When to use**: After implementation. Writes component tests, hook tests, utility tests. Targets 80%+ coverage.

### integration-tester

**Role**: Write integration tests for API routes, data flows, and service interactions
**Tools**: Read, Write, Edit, Grep, Glob, Bash
**Model**: sonnet
**When to use**: After unit tests. Tests API endpoints, database operations, service integrations.

### playwright-tester

**Role**: Write Playwright E2E tests using MCP server
**Tools**: Read, Write, Edit, Grep, Glob, Bash, MCP (Playwright)
**Model**: sonnet
**When to use**: After integration tests. Tests critical user flows, navigation, forms, authentication.

### tdd-guide

**Role**: Enforce test-driven development workflow
**Tools**: Read, Write, Edit, Grep, Glob, Bash
**Model**: sonnet
**When to use**: Bug fixes or when TDD approach is explicitly requested. RED → GREEN → REFACTOR.

### code-reviewer

**Role**: Review code for quality, security, accessibility, and maintainability
**Tools**: Read, Grep, Glob, Bash
**Model**: opus
**When to use**: After all implementation and tests are complete. Final quality gate.

### security-reviewer

**Role**: OWASP Top 10 audit, dependency scanning, secret detection
**Tools**: Read, Grep, Glob, Bash
**Model**: opus
**When to use**: Before any commit. Checks for vulnerabilities, exposed secrets, injection risks.

### build-resolver

**Role**: Diagnose and fix build, lint, and type errors
**Tools**: Read, Write, Edit, Grep, Glob, Bash
**Model**: sonnet
**When to use**: When build fails. Analyzes error output and applies targeted fixes.

### typescript-reviewer

**Role**: TypeScript-specific code review and type safety audit
**Tools**: Read, Grep, Glob, Bash
**Model**: sonnet
**When to use**: Review TypeScript code for type safety, strict mode compliance, and best practices.

### doc-updater

**Role**: Update documentation, README, changelogs, and API docs
**Tools**: Read, Write, Edit, Grep, Glob
**Model**: haiku
**When to use**: After feature completion. Updates relevant documentation.

### refactor-cleaner

**Role**: Remove dead code, unused imports, and simplify complexity
**Tools**: Read, Write, Edit, Grep, Glob, Bash
**Model**: sonnet
**When to use**: During maintenance. Identifies and removes unused code safely.

## Pipeline Definitions

### Full Development Pipeline (`/dev`)

```
orchestrator
  → jira-analyzer OR figma-analyzer (based on input)
  → planner
  → api-developer (types + service + hooks + MSW mocks)
  → react-nextjs-developer (parallel: components + pages)
  → unit-tester
  → integration-tester
  → playwright-tester
  → code-reviewer
  → security-reviewer
  → doc-updater
```

### API-Only Pipeline (`/api`)

```
orchestrator
  → api-developer (types + service + hooks + MSW mocks)
  → unit-tester (service tests)
  → integration-tester (hook tests)
  → typescript-reviewer
```

### Bug Fix Pipeline

```
orchestrator
  → planner (root cause analysis)
  → tdd-guide (failing test first)
  → api-developer (if API-related — fix service/hook/mock)
  → react-nextjs-developer (minimal fix)
  → unit-tester (verify fix + regression tests)
  → integration-tester
  → code-reviewer
```

### Figma Implementation Pipeline

```
orchestrator
  → figma-analyzer (extract specs)
  → planner (component breakdown)
  → api-developer (service layer if data-driven)
  → react-nextjs-developer (implement components)
  → unit-tester (component tests)
  → playwright-tester (visual flow tests)
  → code-reviewer
```

### MCP Server Pipeline

```
orchestrator
  → planner (tool design + protocol spec)
  → mcp-developer (implement server + tools)
  → unit-tester (tool handler tests)
  → integration-tester (protocol tests)
  → code-reviewer
  → security-reviewer
```
