# Performance Rules

## Model Selection

- **Sonnet (executor)**: Default for implementation, testing, and most reviews
- **Haiku (executor)**: Lightweight analyzers, documentation, simple lookups
- **Opus (advisor)**: Consult only for complex architectural/security decisions

Advisor strategy:
- Executors run end-to-end
- Escalate to Opus only on hard decision points
- Resume execution with the original executor after advice

## Context Management

- Compact at logical breakpoints (after research, after milestones)
- Keep under 10 MCPs active
- Keep under 80 tools active
- Use `/clear` between unrelated tasks
- Read specific line ranges, not entire files

## Token Budget

```json
{
  "MAX_THINKING_TOKENS": "10000",
  "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
  "CLAUDE_CODE_SUBAGENT_MODEL": "haiku"
}
```

## Build Performance

- Use Turbopack for development builds
- Lazy load heavy components with `dynamic()`
- Optimize images with `next/image`
- Code-split by route (automatic with App Router)
