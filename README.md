# Agentic Flow

> A performance-optimized AI development harness that transforms design specs, Jira stories, bug reports, and feature requests into production-ready code with full test coverage — in a single pass.

Inspired by [everything-claude-code](https://github.com/affaan-m/everything-claude-code). Built for **Claude Code**, **GitHub Copilot**, **Cursor**, and **Codex**.

---

## Installation

### Install into an existing project

```bash
# Full install (Claude Code + GitHub Copilot)
npx agentic-flow ./my-project

# Claude Code configs only
npx agentic-flow --claude ./my-project

# GitHub Copilot configs only
npx agentic-flow --copilot ./my-project

# Minimal: just CLAUDE.md + AGENTS.md + orchestrator
npx agentic-flow --minimal ./my-project

# Preview what would be installed (no writes)
npx agentic-flow --dry-run ./my-project

# Update existing configs
npx agentic-flow --overwrite ./my-project
```

### Install profiles

| Profile | Files | What's included |
|---|---|---|
| `--full` (default) | 70 | Everything: agents, skills, hooks, commands, rules, GitHub Copilot configs |
| `--claude` | 57 | Claude Code only: `.claude/` directory + root configs |
| `--copilot` | 15 | GitHub Copilot only: `.github/` directory + root configs |
| `--minimal` | 4 | Just `CLAUDE.md`, `AGENTS.md`, orchestrator agent, and settings |

### Use as a GitHub template

1. Click **Use this template** on the [GitHub repo](https://github.com/your-username/agentic-flow)
2. Clone your new repo
3. Start building — all agent configs are ready

### Clone directly

```bash
git clone https://github.com/your-username/agentic-flow ./my-project
cd my-project
rm -rf .git && git init  # Start fresh git history
```

---

## Quick Start

### Using with Claude Code
```bash
# Full development pipeline
/dev "Build a user profile page with avatar upload"

# Plan before building
/plan "Redesign the checkout flow"

# Test-driven development
/tdd "Fix: cart total doesn't update on quantity change"

# End-to-end tests only
/e2e "Test the login flow"

# Security scan
/security

# Code review
/review
```

### Using with GitHub Copilot
Open any `.prompt.md` file from `.github/prompts/` and invoke with `@workspace`:
- `one-shot-dev.prompt.md` — Full pipeline
- `bug-fix.prompt.md` — Bug fix with TDD
- `figma-to-code.prompt.md` — Design → code
- `test.prompt.md` — Generate tests
- `review.prompt.md` — Code review
- `security.prompt.md` — Security audit
- `mcp-dev.prompt.md` — MCP server development

---

## Architecture

```
User Request → Orchestrator → Analyze → Plan → Build → Test → Review → Done
```

The **orchestrator** classifies each request and routes it through the correct pipeline:

| Request Type | Pipeline |
|---|---|
| Jira Story | jira-analyzer → planner → react-developer → unit-tester → integration-tester → playwright-tester → code-reviewer |
| Figma Design | figma-analyzer → planner → react-developer → unit-tester → integration-tester → playwright-tester → code-reviewer |
| Bug Fix | planner → tdd-guide → react-developer → unit-tester → integration-tester → code-reviewer |
| Feature | planner → react-developer → unit-tester → integration-tester → playwright-tester → code-reviewer |
| MCP Server | planner → mcp-developer → unit-tester → integration-tester → code-reviewer |
| Refactor | planner → code-reviewer → react-developer → unit-tester → code-reviewer |

---

## Project Structure

```
Agentic-flow/
├── CLAUDE.md                       # Master harness config
├── AGENTS.md                       # Cross-tool agent roster
├── .mcp.json                       # MCP server configurations
├── README.md                       # This file
│
├── .claude/
│   ├── settings.json               # Model, env, permissions
│   ├── agents/                     # 16 specialized sub-agents
│   │   ├── orchestrator.md         #   Main coordinator
│   │   ├── jira-analyzer.md        #   Jira story parser
│   │   ├── figma-analyzer.md       #   Design spec extractor
│   │   ├── planner.md              #   Implementation planner
│   │   ├── react-developer.md      #   React/Next.js developer
│   │   ├── unit-tester.md          #   Jest + RTL unit tests
│   │   ├── integration-tester.md   #   MSW integration tests
│   │   ├── playwright-tester.md    #   Playwright E2E tests
│   │   ├── tdd-guide.md            #   TDD enforcement
│   │   ├── code-reviewer.md        #   Quality/security review
│   │   ├── security-reviewer.md    #   OWASP security audit
│   │   ├── build-resolver.md       #   Build error fixer
│   │   ├── mcp-developer.md        #   MCP server builder
│   │   ├── doc-updater.md          #   Documentation updater
│   │   ├── refactor-cleaner.md     #   Dead code cleanup
│   │   └── typescript-reviewer.md  #   TS type safety review
│   │
│   ├── skills/                     # 11 reusable skills
│   │   ├── one-shot-dev/           #   End-to-end pipeline
│   │   ├── figma-to-react/         #   Design → React conversion
│   │   ├── react-patterns/         #   React 18+ patterns
│   │   ├── nextjs-patterns/        #   Next.js App Router patterns
│   │   ├── tdd-workflow/           #   TDD methodology
│   │   ├── e2e-testing/            #   Playwright E2E patterns
│   │   ├── integration-testing/    #   Integration test patterns
│   │   ├── security-scan/          #   OWASP security scanning
│   │   ├── token-optimization/     #   Cost & context management
│   │   ├── continuous-learning/    #   Pattern extraction
│   │   └── mcp-server-patterns/    #   MCP server development
│   │
│   ├── commands/                   # 10 slash commands
│   │   ├── dev.md                  #   /dev — Full pipeline
│   │   ├── plan.md                 #   /plan — Planning only
│   │   ├── tdd.md                  #   /tdd — Test-driven fix
│   │   ├── e2e.md                  #   /e2e — E2E tests
│   │   ├── test.md                 #   /test — All tests
│   │   ├── review.md               #   /review — Code review
│   │   ├── security.md             #   /security — Security scan
│   │   ├── build-fix.md            #   /build-fix — Fix build
│   │   ├── figma.md                #   /figma — Design → code
│   │   └── mcp-dev.md              #   /mcp-dev — MCP server
│   │
│   ├── hooks/                      # Automated triggers
│   │   ├── hooks.json              #   Hook definitions
│   │   ├── memory-persistence/     #   Session memory scripts
│   │   │   ├── session-start.js    #     Load memory on start
│   │   │   └── session-end.js      #     Save patterns on end
│   │   ├── security-scan/          #   Pre-commit security scan
│   │   │   └── scan.js             #     Secret & vuln detection
│   │   └── strategic-compact/      #   Context management
│   │       └── compact-check.js    #     Suggest /compact
│   │
│   ├── rules/                      # Coding standards
│   │   ├── common/                 #   Language-agnostic rules
│   │   │   ├── coding-style.md
│   │   │   ├── git-workflow.md
│   │   │   ├── testing.md
│   │   │   ├── security.md
│   │   │   ├── performance.md
│   │   │   └── agents.md
│   │   └── typescript/             #   TypeScript-specific rules
│   │       ├── coding-style.md
│   │       ├── testing.md
│   │       └── react-patterns.md
│   │
│   └── contexts/                   # Mode-specific contexts
│       ├── dev.md                  #   Development mode
│       ├── review.md               #   Review mode
│       └── research.md             #   Research mode
│
└── .github/
    ├── copilot-instructions.md     # GitHub Copilot master config
    ├── agents/                     # Copilot agent definitions
    │   ├── orchestrator.md
    │   ├── react-developer.md
    │   ├── tester.md
    │   └── reviewer.md
    └── prompts/                    # Copilot prompt templates
        ├── one-shot-dev.prompt.md
        ├── figma-to-code.prompt.md
        ├── bug-fix.prompt.md
        ├── test.prompt.md
        ├── review.prompt.md
        ├── security.prompt.md
        └── mcp-dev.prompt.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| UI | React 18+, Tailwind CSS |
| State | Zustand, TanStack Query, React Context |
| Forms | React Hook Form + Zod |
| Unit Tests | Jest, React Testing Library |
| Integration | MSW (Mock Service Worker) |
| E2E Tests | Playwright (via MCP server) |
| CI/CD | GitHub Actions |

---

## Agents

16 specialized agents organized into three phases:

### Analyze Phase
- **orchestrator** — Request classification and pipeline routing
- **jira-analyzer** — Jira story parsing, AC extraction
- **figma-analyzer** — Figma design decomposition, token extraction
- **planner** — Implementation planning with risk assessment

### Build Phase
- **react-developer** — React 18+ / Next.js 14+ component implementation
- **mcp-developer** — MCP server tool development
- **build-resolver** — Build error diagnosis and fixing
- **refactor-cleaner** — Dead code removal and cleanup
- **doc-updater** — Documentation and changelog updates

### Verify Phase
- **unit-tester** — Jest + RTL, 80%+ coverage
- **integration-tester** — MSW-based API and data flow tests
- **playwright-tester** — E2E tests with Page Object Model
- **tdd-guide** — RED → GREEN → REFACTOR enforcement
- **code-reviewer** — Quality, security, accessibility review
- **security-reviewer** — OWASP Top 10 audit, secret scanning
- **typescript-reviewer** — TypeScript strict mode compliance

---

## Skills

| Skill | Description |
|---|---|
| `one-shot-dev` | Full end-to-end pipeline: analyze → plan → build → test → review |
| `figma-to-react` | Convert Figma designs to React components with Tailwind |
| `react-patterns` | React 18+ Server/Client components, hooks, error boundaries |
| `nextjs-patterns` | App Router routing, data fetching, middleware, API routes |
| `tdd-workflow` | Test-driven development: RED → GREEN → REFACTOR cycle |
| `e2e-testing` | Playwright E2E with Page Object Model pattern |
| `integration-testing` | MSW handlers, API route tests, data flow tests |
| `security-scan` | OWASP Top 10 checklist, secret detection, dependency audit |
| `token-optimization` | Model routing, context management, cost reduction |
| `continuous-learning` | Pattern extraction, memory persistence, session lifecycle |
| `mcp-server-patterns` | MCP server architecture, tool design, testing |

---

## Hooks

| Hook | Trigger | Action |
|---|---|---|
| Console.log check | Pre-edit (TS/JS files) | Warns about console.log statements |
| Pre-push reminder | Pre-git-push | Reminds to verify tests and review |
| Security scan | Pre-git-commit | Scans for secrets and vulnerabilities |
| Type check reminder | Post-edit (.ts/.tsx) | Reminds to run type checker |
| Test reminder | Post-write (test files) | Reminds to run test suite |
| Session start | Session start | Loads memory, checks incomplete tasks |
| Session end | Session end | Extracts patterns, saves session summary |
| Compact suggestion | Ongoing | Suggests /compact at logical breakpoints |

---

## Commands

| Command | Description |
|---|---|
| `/dev` | Full development pipeline: plan → implement → test → review |
| `/plan` | Create implementation plan without coding |
| `/tdd` | Test-driven bug fix: failing test → fix → verify |
| `/e2e` | Generate Playwright E2E tests for a flow |
| `/test` | Generate unit + integration tests for existing code |
| `/review` | Run code review (quality, security, a11y) |
| `/security` | Run OWASP security audit |
| `/build-fix` | Diagnose and fix build/lint/type errors |
| `/figma` | Convert Figma design to React components |
| `/mcp-dev` | Develop an MCP server tool |

---

## Token Optimization

| Strategy | Impact |
|---|---|
| Sonnet for main coding | Best quality/cost ratio |
| Haiku for sub-agents | 3x cheaper for simple tasks |
| Opus for architecture | Deep reasoning when needed |
| 10K thinking tokens | Sufficient for most tasks |
| 50% autocompact | Manages context window automatically |
| Strategic /compact | At logical breakpoints only |
| /clear between tasks | Free context reset |

---

## Security

Automated security scanning runs on every commit:
- **Secret detection**: API keys, tokens, passwords, private keys, DB URLs
- **Vulnerability patterns**: eval(), dangerouslySetInnerHTML, SQL injection, weak hashing
- **OWASP Top 10**: Injection, broken auth, XSS, CSRF, misconfig, and more
- **CRITICAL findings block commits** — must be fixed before proceeding

---

## MCP Servers

Configured in `.mcp.json`:

| Server | Purpose |
|---|---|
| `playwright` | E2E test execution and browser automation |
| `github` | Repository operations, PRs, issues |
| `sequential-thinking` | Complex multi-step reasoning |
| `memory` | Persistent memory across sessions |
| `filesystem` | Safe file system operations |

---

## Publishing

### Publish to npm

```bash
# Build templates from source configs
npm run build

# Login to npm (first time)
npm login

# Publish (runs build automatically via prepublishOnly)
npm publish
```

After publishing, anyone can install with:
```bash
npx agentic-flow ./my-project
```

### Set up as a GitHub template repo

1. Push to GitHub: `git remote add origin <url> && git push -u origin main`
2. Go to **Settings → General → Template repository** → check the box
3. Others can now click **Use this template** to create a new repo with all configs

---

## Quality Gates

Every pipeline must pass these gates before completion:

- [ ] TypeScript strict mode — no errors
- [ ] Unit tests — 80%+ coverage
- [ ] Integration tests — all API flows covered
- [ ] E2E tests — critical user paths verified
- [ ] Security scan — no CRITICAL or HIGH findings
- [ ] Code review — no blocking issues
- [ ] Accessibility — WCAG 2.1 AA compliance
- [ ] Documentation — updated for new features

---

## License

MIT
