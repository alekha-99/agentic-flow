# Agent Orchestration Rules

## Agent Roster

| Agent | Purpose | Model |
|---|---|---|
| orchestrator | Request routing, pipeline management | sonnet |
| advisor | Strategic guidance for escalations | opus (advisor-only) |
| jira-analyzer | Jira story parsing | haiku |
| figma-analyzer | Design spec extraction | sonnet |
| planner | Implementation planning | sonnet |
| react-nextjs-developer | React/Next.js implementation | sonnet |
| api-developer | API integration layer | sonnet |
| mcp-developer | MCP server development | sonnet |
| unit-tester | Jest + RTL tests | sonnet |
| integration-tester | API/data flow tests | sonnet |
| playwright-tester | E2E tests | sonnet |
| tdd-guide | TDD enforcement | sonnet |
| code-reviewer | Quality review | sonnet (escalates to advisor) |
| security-reviewer | Security audit | sonnet (escalates to advisor) |
| build-resolver | Build error fixes | sonnet |
| typescript-reviewer | TS code review | sonnet |
| doc-updater | Documentation | haiku |
| refactor-cleaner | Dead code removal | sonnet |

## Dispatch Rules

1. Every request starts with the **orchestrator**
2. The orchestrator classifies and dispatches to the correct pipeline
3. Each phase completes before the next begins
4. Executors run on Sonnet/Haiku by default and escalate to **advisor** only when needed
5. Parallel execution for independent sub-agents when possible

## Pipeline Patterns

- **Full Dev**: Analyze → Plan → Build → Unit Test → Integration Test → E2E → Review
- **Bug Fix**: Plan → TDD → Fix → Test → Review
- **Figma**: Analyze → Plan → Build → Test → E2E → Review
- **MCP**: Plan → Build → Test → Integration Test → Review
