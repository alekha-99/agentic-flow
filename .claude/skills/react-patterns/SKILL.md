---
name: react-patterns
description: React 18+ best practices — hooks, composition, performance (works with Vite, CRA, and Next.js)
triggers:
  - react patterns
  - react best practices
  - react component
applies_to: ["**/*.tsx", "**/*.jsx"]
---

# React Patterns Skill

These patterns apply to **all React projects** — standalone (Vite, CRA) and Next.js alike.

> For Next.js-specific patterns (Server Components, App Router, API routes), see the **nextjs-patterns** skill.

## Components

All React components are client components by default. In Next.js projects, add `'use client'` when the component uses hooks, event handlers, or browser APIs.

```typescript
'use client';
// components/users/UserSearch.tsx
import { useState, useTransition } from 'react';

interface UserSearchProps {
  readonly onSearch: (query: string) => void;
}

export const UserSearch: FC<UserSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    startTransition(() => onSearch(value));
  };

  return (
    <input
      type="search"
      value={query}
      onChange={handleChange}
      placeholder="Search users..."
      aria-label="Search users"
      className="rounded-md border px-4 py-2"
    />
  );
};
```

## Custom Hooks

```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

## Error Boundaries

```typescript
// components/ErrorBoundary.tsx
'use client';
import { Component, type ReactNode } from 'react';

interface Props { readonly children: ReactNode; readonly fallback: ReactNode; }
interface State { readonly hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
```

## Key Rules

1. Composition over props drilling — use children and render props
2. Custom hooks for shared logic — keep components thin
3. Immutable state updates — never mutate state or props
4. Proper cleanup — return cleanup functions from useEffect
5. Named exports only — never use default exports for components
6. **Next.js only**: Server Components by default — `'use client'` only when required
7. **Standalone React**: All components are client components — no `'use client'` directive needed
