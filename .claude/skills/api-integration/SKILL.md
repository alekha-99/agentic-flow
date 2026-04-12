---
name: api-integration
description: Complete API integration patterns — service layer, typed hooks, auth interceptors, error handling, pagination, MSW mocking
triggers:
  - "api integration"
  - "service layer"
  - "data fetching"
  - "API client"
  - "TanStack Query"
  - "SWR"
  - "fetch endpoint"
  - "MSW"
  - "mock handler"
applies_to:
  - "src/services/**"
  - "src/hooks/api/**"
  - "src/lib/api-client*"
  - "src/types/api/**"
  - "src/mocks/**"
---

# API Integration Skill

## Architecture Overview

```
Component
  └── useXxx() hook            ← data-fetching hook (TanStack Query / SWR)
        └── xxxService.fn()    ← service function
              └── apiClient    ← Axios instance with interceptors
                    └── REST / GraphQL / tRPC API
```

**3 layers, strict separation.** Components never touch `apiClient`. Hooks never bypass the service layer.

---

## Layer 1 — API Client (`src/lib/api-client.ts`)

Single Axios instance shared across all services:
- Base URL from environment variable (never hardcoded)
- `Content-Type: application/json` default
- 10s timeout
- Request interceptor: inject auth token
- Response interceptor: 401 → refresh token → retry once → redirect to login
- Error interceptor: convert Axios errors to typed `ApiError`

**Environment config:**
```
NEXT_PUBLIC_API_URL=https://api.yourapp.com   # Next.js
VITE_API_URL=https://api.yourapp.com          # Vite/CRA
```

---

## Layer 2 — Types (`src/types/api/[domain].ts`)

One file per API domain. Export:
- Entity interface (readonly properties)
- List params interface
- Create payload interface
- Update payload interface (all optional)
- `ApiResponse<T>` wrapper matching backend envelope
- `ApiError` shape

Rules:
- All properties `readonly`
- Use string unions not enums: `'admin' | 'user'` not `Role.Admin`
- Date fields as `string` (ISO 8601), convert at display time

---

## Layer 3 — Services (`src/services/[domain]Service.ts`)

One `const` object per domain with typed async functions:
```
list(params)      → ApiResponse<readonly T[]>
getById(id)       → T
create(payload)   → T
update(id, data)  → T
remove(id)        → void
```

Rules:
- Destructure `{ data }` from Axios response immediately
- Return the inner `data.data` for single items
- Return full `data` (with `meta`) for lists
- Never catch inside service — let hooks handle errors

---

## Layer 4 — Hooks (`src/hooks/api/use[Domain].ts`)

TanStack Query pattern:

**Query key factory** (prevents typos, enables targeted invalidation):
```typescript
export const domainKeys = {
  all: ['domain'] as const,
  lists: () => [...domainKeys.all, 'list'] as const,
  list: (params) => [...domainKeys.lists(), params] as const,
  details: () => [...domainKeys.all, 'detail'] as const,
  detail: (id) => [...domainKeys.details(), id] as const,
} as const;
```

**Read hooks** (`useQuery`):
- `staleTime: 5 * 60 * 1000` for most data
- `enabled: Boolean(id)` for detail queries
- `placeholderData: (prev) => prev` to avoid layout shift on refetch

**Write hooks** (`useMutation`):
- `onSuccess`: invalidate related list queries
- `onMutate` + `onError`: optimistic update + rollback for updates
- `onSettled`: final invalidation for both detail and list

---

## Error Handling Pattern

```
API Error → toApiError() → ApiError class
                              ↓
                        getErrorMessage()   ← user-facing string (generic)
                              ↓
                        toast / error boundary / inline error state
```

Never show:
- Stack traces
- Internal error codes
- Database error messages
- File paths

Always show:
- "Please log in to continue." (401)
- "You don't have permission." (403)
- "Not found." (404)
- "Please check your input." (422)
- "Something went wrong." (500+)

---

## Auth Patterns

### Bearer Token (SPA)
- Store token in memory (not `localStorage`, not `sessionStorage`)
- Use a Zustand store or module-level variable
- Inject via request interceptor
- Refresh via response interceptor on 401

### Cookie-based (Next.js App Router)
- `httpOnly` cookie set by server — no JS access
- Next.js middleware validates on every request
- No interceptor needed for injection — browser sends automatically
- Use `next-auth` or custom session handler

### Token refresh
```typescript
let refreshPromise: Promise<void> | null = null;

apiClient.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401 && !error.config._retry) {
    error.config._retry = true;
    refreshPromise ??= refreshToken().finally(() => { refreshPromise = null; });
    await refreshPromise;
    return apiClient(error.config);
  }
  return Promise.reject(toApiError(error));
});
```
Single shared promise prevents race conditions during concurrent 401s.

---

## Pagination Patterns

### Traditional (offset)
```typescript
useQuery({
  queryKey: domainKeys.list({ page, limit }),
  queryFn: () => service.list({ page, limit }),
  placeholderData: (prev) => prev,
})
```

### Infinite scroll (cursor)
```typescript
useInfiniteQuery({
  queryKey: [...domainKeys.lists(), 'infinite'],
  queryFn: ({ pageParam = 1 }) => service.list({ page: pageParam, limit }),
  getNextPageParam: (lastPage, pages) => {
    const fetched = pages.length * limit;
    return fetched < (lastPage.meta?.total ?? 0) ? pages.length + 1 : undefined;
  },
  initialPageParam: 1,
})
```

---

## MSW Setup

**Browser** (`src/mocks/browser.ts`):
```typescript
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
export const worker = setupWorker(...handlers);
```

**Node / Tests** (`src/mocks/server.ts`):
```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
export const server = setupServer(...handlers);
```

**Global test setup** (`jest.setup.ts`):
```typescript
import { server } from './src/mocks/server';
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Handler pattern** (one file per domain):
```typescript
import { http, HttpResponse } from 'msw';

export const domainHandlers = [
  http.get('/api/resource', () => HttpResponse.json({ data: [...] })),
  http.get('/api/resource/:id', ({ params }) => HttpResponse.json({ data: { id: params.id } })),
  http.post('/api/resource', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ data: { id: 'new', ...body } }, { status: 201 });
  }),
];
```

---

## GraphQL Pattern (when applicable)

```typescript
// src/lib/graphql-client.ts
import { GraphQLClient } from 'graphql-request';

export const gqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? '',
  {
    headers: () => ({
      Authorization: `Bearer ${getToken()}`,
    }),
  }
);

// src/services/userService.ts (GraphQL)
import { gql } from 'graphql-request';
import { gqlClient } from '@/lib/graphql-client';

const GET_USERS = gql`query GetUsers { users { id email name } }`;

export const userService = {
  list: () => gqlClient.request<{ users: User[] }>(GET_USERS),
} as const;
```

---

## File Upload

```typescript
export const uploadService = {
  upload: async (file: File, onProgress?: (pct: number) => void): Promise<{ url: string }> => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await apiClient.post<ApiResponse<{ url: string }>>('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (e.total) onProgress?.(Math.round((e.loaded / e.total) * 100));
      },
    });
    return data.data;
  },
} as const;
```

---

## Checklist — Before Every API Feature

- [ ] Types defined in `src/types/api/[domain].ts` (readonly, no any)
- [ ] Service function in `src/services/[domain]Service.ts`
- [ ] Hook in `src/hooks/api/use[Domain].ts` with key factory
- [ ] MSW handler in `src/mocks/handlers/[domain].ts`
- [ ] Handler exported from `src/mocks/handlers/index.ts`
- [ ] Unit test for service function
- [ ] Integration test for hook (using MSW)
- [ ] Loading state handled in component
- [ ] Error state handled in component with user-friendly message
- [ ] Auth token never in URL params or logs
- [ ] Base URL from env variable
