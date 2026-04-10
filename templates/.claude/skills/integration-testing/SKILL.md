---
name: integration-testing
description: Integration test patterns for API routes, data flows, and service boundaries
triggers:
  - integration test
  - api test
  - service test
applies_to: ["**/*.integration.test.ts", "**/*.integration.test.tsx"]
---

# Integration Testing Skill

## Scope

Integration tests verify that different parts of the system work together correctly at their boundaries.

## MSW Setup (Mock Service Worker)

```typescript
// test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    return HttpResponse.json({
      users: [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }],
      total: 50,
      page,
    });
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: '3', ...body }, { status: 201 });
  }),

  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, name: 'Alice', email: 'alice@example.com' });
  }),
];

// test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
export const server = setupServer(...handlers);
```

## Test Patterns

### API Route Test
```typescript
describe('POST /api/users', () => {
  it('creates user with valid data', async () => {
    const response = await POST(new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', email: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    }));
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('id');
  });

  it('rejects invalid email', async () => {
    const response = await POST(new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', email: 'invalid' }),
      headers: { 'Content-Type': 'application/json' },
    }));
    expect(response.status).toBe(422);
  });
});
```

### Component + Data Flow Test
```typescript
describe('UserList integration', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('fetches and renders users', async () => {
    render(<UserList />);
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    server.use(http.get('/api/users', () => HttpResponse.json(null, { status: 500 })));
    render(<UserList />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

## Coverage Areas

1. API request → response validation
2. Component → API data flow
3. Form → validation → submission → response
4. Auth → token → protected endpoint
5. Error propagation across boundaries

## Rules

1. Mock at the network boundary (MSW), not at function level
2. Test real request/response shapes
3. Every API endpoint needs an error scenario test
4. Clean up server handlers between tests
5. Test authentication/authorization boundaries
