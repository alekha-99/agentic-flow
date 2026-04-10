# Common Coding Style Rules

## Immutability (CRITICAL)

ALWAYS create new objects, NEVER mutate existing ones:
- Use spread operator for object updates: `{ ...obj, key: newValue }`
- Use `.map()`, `.filter()`, `.reduce()` — never `.push()`, `.splice()`, `.sort()` on existing arrays
- Use `readonly` on all TypeScript interface properties
- Use `as const` for literal types

## File Organization

- 200-400 lines typical, 800 max
- One component per file
- Co-locate tests: `Component.tsx` → `__tests__/Component.test.tsx`
- Co-locate types: export from the component file or a nearby `types.ts`
- Organize by feature/domain, not by type

## Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useDebounce.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types/Interfaces**: PascalCase (`UserProfile`, not `IUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Booleans**: `is`, `has`, `should` prefix (`isLoading`, `hasError`)

## Error Handling

- Handle errors explicitly at every level
- Provide user-friendly messages in UI
- Log detailed context server-side
- Never silently swallow errors
- Use Result/Either pattern for expected failures

## Functions

- Max 50 lines per function
- Max 3 parameters (use object for more)
- Single responsibility
- Pure functions where possible
- No side effects in render
