---
name: mcp-server-patterns
description: Build MCP servers with proper tool design, validation, and testing
triggers:
  - /mcp-dev
  - mcp server
  - mcp tool
  - build mcp
applies_to: ["**/mcp-server/**/*.ts", "**/mcp/**/*.ts"]
---

# MCP Server Patterns Skill

## Server Architecture

```
mcp-server/
├── src/
│   ├── index.ts          # Server entry point
│   ├── tools/            # Tool implementations
│   │   ├── index.ts      # Tool registry
│   │   └── [tool].ts     # Individual tools
│   ├── resources/        # Resource providers
│   ├── schemas/          # Zod validation schemas
│   └── utils/            # Shared utilities
├── __tests__/            # Tests
├── package.json
└── tsconfig.json
```

## Tool Design Checklist

- [ ] Clear, descriptive name (verb-noun: `search_users`, `create_ticket`)
- [ ] Detailed description (this is how the AI selects your tool)
- [ ] Strict JSON Schema for inputs (all required fields listed)
- [ ] Input validation with helpful error messages
- [ ] Structured output (JSON when possible)
- [ ] Idempotent operations where possible
- [ ] Proper error handling with actionable messages
- [ ] Rate limiting for expensive operations
- [ ] No secrets in responses

## Tool Template

```typescript
import { z } from 'zod';

const toolInputSchema = z.object({
  query: z.string().min(1).max(200).describe('Search query'),
  limit: z.number().int().min(1).max(100).default(10).describe('Max results'),
});

type ToolInput = z.infer<typeof toolInputSchema>;

export async function searchTool(rawInput: unknown) {
  // Validate
  const result = toolInputSchema.safeParse(rawInput);
  if (!result.success) {
    return {
      content: [{ type: 'text' as const, text: `Invalid input: ${result.error.message}` }],
      isError: true,
    };
  }

  const input = result.data;

  try {
    // Execute
    const results = await performSearch(input.query, input.limit);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(results, null, 2) }],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [{ type: 'text' as const, text: `Search failed: ${message}` }],
      isError: true,
    };
  }
}
```

## Testing

```typescript
describe('searchTool', () => {
  it('returns results for valid query', async () => {
    const result = await searchTool({ query: 'test', limit: 5 });
    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toBeDefined();
  });

  it('returns error for empty query', async () => {
    const result = await searchTool({ query: '', limit: 5 });
    expect(result.isError).toBe(true);
  });

  it('returns error for invalid limit', async () => {
    const result = await searchTool({ query: 'test', limit: -1 });
    expect(result.isError).toBe(true);
  });
});
```

## Rules

1. Validate ALL inputs — never trust tool arguments
2. Return helpful errors — guide the AI to correct usage
3. Keep tools focused — one tool = one responsibility
4. Log tool calls — for debugging and audit purposes
5. Handle timeouts — external calls need timeout limits
