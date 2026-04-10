# TypeScript Coding Style Rules

## Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true
  }
}
```

## Type Safety

- NO `any` — use `unknown` and narrow with type guards
- NO type assertions (`as`) — use type narrowing
- `readonly` on ALL interface properties
- `as const` for literal types
- Discriminated unions for variant types
- Exhaustive switch with `never` for default case

## React-Specific TypeScript

```typescript
// Props interface — always readonly
interface ButtonProps {
  readonly variant: 'primary' | 'secondary';
  readonly children: React.ReactNode;
  readonly onClick?: () => void;
}

// Component — named export, FC type
export const Button: FC<ButtonProps> = ({ variant, children, onClick }) => {
  // ...
};

// Hook return type — explicit
export function useCounter(initial: number): {
  readonly count: number;
  readonly increment: () => void;
  readonly decrement: () => void;
} {
  // ...
}
```

## Imports

```typescript
// 1. Framework imports
import { type FC, useState } from 'react';

// 2. Library imports
import { z } from 'zod';

// 3. Internal imports (path aliases)
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { type User } from '@/types/user';

// 4. Relative imports (same feature)
import { UserAvatar } from './UserAvatar';
```

## Do NOT

- Use `enum` — use `as const` object or union type
- Use `namespace`
- Use `/// <reference>`
- Use `@ts-ignore` or `@ts-expect-error` (unless temporary with TODO)
- Use `!` non-null assertion
