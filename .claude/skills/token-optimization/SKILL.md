---
name: token-optimization
description: Context window management and cost optimization for AI coding agents
triggers:
  - token optimization
  - reduce cost
  - context management
applies_to: ["**/*"]
---

# Token Optimization Skill

## Model Routing

| Task | Model | Rationale |
|---|---|---|
| Code generation | Sonnet | Best coding model, cost-effective |
| Simple lookups, docs | Haiku | 3x cheaper, sufficient for simple tasks |
| Architecture decisions | Opus | Deep reasoning needed |
| Sub-agent workers | Haiku | Frequent invocation, lower cost |
| Code review | Opus | Needs deep understanding |
| Security review | Opus | Critical decisions |
| Test generation | Sonnet | Needs coding + understanding |
| Documentation | Haiku | Straightforward writing |

## Recommended Settings

```json
{
  "model": "sonnet",
  "env": {
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku"
  }
}
```

## Context Window Management

### When to Compact
- After research/exploration, before implementation
- After completing a milestone, before next
- After debugging, before continuing feature work
- After a failed approach, before trying new one

### When NOT to Compact
- Mid-implementation (you'll lose file paths, variable names)
- While debugging a specific issue
- During a code review

### MCP Budget
- Keep under 10 MCPs enabled per project
- Keep under 80 tools active total
- Disable unused MCPs in project config

## Cost Reduction Strategies

1. **Use `/clear` between unrelated tasks** — free, instant context reset
2. **Use `/compact` at logical breakpoints** — reduces token usage
3. **Use Haiku for sub-agents** — 3x cheaper for simple tasks
4. **Limit thinking tokens** — 10k is enough for most coding tasks
5. **Avoid Agent Teams for sequential work** — sub-agents are cheaper
6. **Read specific line ranges** — don't read entire files when you need 10 lines
