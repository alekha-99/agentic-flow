---
name: figma-to-react
description: Convert Figma designs to production-ready React components with Tailwind CSS
triggers:
  - /figma
  - figma design
  - implement design
  - convert figma
applies_to: ["**/*.tsx", "**/*.css"]
---

# Figma to React Skill

Transform Figma designs into pixel-perfect, accessible React components.

## Process

### 1. Design Analysis
- Decompose into Atomic Design hierarchy (atoms → molecules → organisms)
- Extract design tokens (colors, typography, spacing, shadows)
- Map to Tailwind CSS utility classes
- Identify responsive breakpoints and behavior

### 2. Component Generation

For each component in the design:

```typescript
// 1. Define the interface with all visual states
interface ButtonProps {
  readonly variant: 'primary' | 'secondary' | 'ghost';
  readonly size: 'sm' | 'md' | 'lg';
  readonly isLoading?: boolean;
  readonly isDisabled?: boolean;
  readonly children: React.ReactNode;
  readonly onClick?: () => void;
}

// 2. Implement with Tailwind + accessibility
export const Button: FC<ButtonProps> = ({
  variant,
  size,
  isLoading = false,
  isDisabled = false,
  children,
  onClick,
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    ghost: 'text-gray-600 hover:bg-gray-100',
  } as const;

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  } as const;

  return (
    <button
      type="button"
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      aria-busy={isLoading}
    >
      {isLoading ? <Spinner className="mr-2" /> : null}
      {children}
    </button>
  );
};
```

### 3. Tailwind Token Mapping

| Figma Property | Tailwind Utility |
|---|---|
| Fill color | `bg-{color}` |
| Text color | `text-{color}` |
| Font size | `text-{size}` |
| Font weight | `font-{weight}` |
| Border radius | `rounded-{size}` |
| Padding | `p-{size}`, `px-{size}`, `py-{size}` |
| Gap | `gap-{size}` |
| Shadow | `shadow-{size}` |
| Opacity | `opacity-{value}` |

### 4. Responsive Implementation

```
Mobile first → sm: (640px) → md: (768px) → lg: (1024px) → xl: (1280px)
```

### 5. State Coverage

Every interactive component must have:
- Default state
- Hover state (`hover:`)
- Focus state (`focus-visible:`)
- Active state (`active:`)
- Disabled state (`disabled:`)
- Loading state (skeleton or spinner)
- Error state (error message or visual indicator)

## Output Checklist

- [ ] All design components implemented
- [ ] Tailwind utilities match design tokens exactly
- [ ] All interactive states covered
- [ ] Responsive at mobile, tablet, desktop
- [ ] Accessibility: ARIA, keyboard nav, screen reader
- [ ] Unit tests for each component
