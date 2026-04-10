---
name: continuous-learning
description: Extract patterns from sessions and save as reusable skills and memory
triggers:
  - learn patterns
  - extract patterns
  - save learnings
applies_to: ["**/*"]
---

# Continuous Learning Skill

## Pattern Extraction

At the end of each session (or on demand), analyze the work done and extract reusable patterns.

### What to Extract

1. **Coding patterns** — Recurring code structures, component patterns, hook patterns
2. **Debug patterns** — How specific errors were diagnosed and fixed
3. **Architecture decisions** — Why certain designs were chosen
4. **Tool usage** — Effective sequences of tool calls
5. **Project conventions** — File naming, folder structure, coding style

### Extraction Process

```
1. Review all files created/modified in this session
2. Identify recurring patterns (used 2+ times)
3. Classify pattern type (coding, debug, architecture, convention)
4. Write pattern to memory with:
   - Name: short descriptive name
   - Context: when to use this pattern
   - Pattern: the actual code/approach
   - Rationale: why this works
5. Save to /memories/repo/ for project-specific patterns
6. Save to /memories/ for general patterns
```

### Memory Organization

```
/memories/
├── coding-patterns.md      # Reusable code patterns
├── debug-strategies.md     # Error diagnosis approaches
├── project-conventions.md  # This project's specific conventions
└── session/
    └── current-task.md     # What we're working on now
```

### Pattern Template

```markdown
## [Pattern Name]

**Context**: When to use this pattern
**Confidence**: High | Medium | Low (based on usage count)

### Pattern
[Code or approach description]

### Rationale
[Why this works, what problem it solves]

### Example
[Concrete example from the codebase]
```

## Session Lifecycle

### On Session Start
- Load relevant memory files
- Check for incomplete tasks from last session
- Review project conventions

### On Session End
- Extract new patterns from work done
- Update existing patterns if refined
- Save session summary
- Note incomplete work for next session

## Rules

1. Only save patterns used 2+ times or explicitly important
2. Keep patterns concise — code examples, not essays
3. Update confidence scores as patterns prove reliable
4. Delete patterns that prove wrong or outdated
5. Separate project-specific from general patterns
