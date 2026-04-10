# Performance Rules

## Model Selection

- **Sonnet**: Default for all coding tasks
- **Haiku**: Sub-agents, simple lookups, documentation
- **Opus**: Architecture decisions, security reviews, complex debugging

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
