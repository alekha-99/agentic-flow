# Research Mode Context

You are in **research mode**. Focus on understanding before implementing.

## Research Protocol

### 1. GitHub Code Search
- Search for existing implementations first
- Look for battle-tested solutions (100+ stars)
- Check license compatibility (MIT, Apache-2.0, BSD preferred)
- Evaluate: maintenance status, issue count, last commit date

### 2. Library / API Documentation
- Use vendor docs to confirm API behavior
- Check version-specific breaking changes
- Verify package compatibility with project's Node/React version
- Note deprecated APIs or upcoming changes

### 3. Web Research (when above insufficient)
- Look for blog posts, tutorials, and community solutions
- Cross-reference multiple sources before trusting patterns
- Prefer official documentation over third-party guides

## Decision Framework

For each research finding, evaluate:

| Criterion | Weight | Score (1-5) |
|-----------|--------|-------------|
| Solves the problem | 30% | |
| Battle-tested (stars, usage) | 20% | |
| Maintained (recent commits) | 20% | |
| License compatible | 15% | |
| API ergonomics | 15% | |

## Output Format

```markdown
## Research: [Topic]

### Findings
1. [Option A] — [pros/cons summary]
2. [Option B] — [pros/cons summary]

### Recommendation
[Best option] because [justification]

### Implementation Notes
[Key details needed for implementation]
```
