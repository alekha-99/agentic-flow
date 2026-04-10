# TypeScript Testing Rules

## Framework: Jest + React Testing Library

```typescript
// Setup in jest.config.ts
{
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
}
```

## Query Priority

1. `getByRole` — ARIA roles (button, heading, textbox)
2. `getByLabelText` — Form labels
3. `getByPlaceholderText` — Placeholder text
4. `getByText` — Visible text
5. `getByDisplayValue` — Input current value
6. `getByTestId` — Last resort only

## Test File Location

- Component: `src/components/Feature/__tests__/Component.test.tsx`
- Hook: `src/hooks/__tests__/useHook.test.ts`
- Utility: `src/lib/__tests__/util.test.ts`
- API Route: `src/app/api/resource/__tests__/route.test.ts`
- Integration: `src/__tests__/integration/feature.integration.test.tsx`
- E2E: `e2e/tests/flow.spec.ts`

## Test Structure

```typescript
describe('ComponentName', () => {
  // Setup
  const defaultProps = { ... } as const;

  // Group by behavior
  describe('rendering', () => {
    it('renders with required props', () => { ... });
    it('handles optional props', () => { ... });
  });

  describe('interactions', () => {
    it('calls onClick when button is clicked', async () => { ... });
  });

  describe('accessibility', () => {
    it('supports keyboard navigation', async () => { ... });
  });

  describe('edge cases', () => {
    it('handles empty data', () => { ... });
  });
});
```
