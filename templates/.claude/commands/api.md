---
name: api
description: Generate complete API integration for an endpoint or domain — types, service, hook, MSW mock, and tests in one shot
---

# /api Command

Generate the full API integration layer for one endpoint or domain.

## Usage

```
/api <description>
```

**Examples:**
```
/api GET /users — list users with pagination and search
/api POST /auth/login — login with email + password, returns JWT
/api PATCH /orders/:id — update order status with optimistic UI
/api GET /products/:id — fetch product detail with variants
/api DELETE /comments/:id — delete a comment with confirmation
```

## What Gets Generated

For every `/api` request, the api-developer agent produces ALL of these:

### 1. TypeScript Types (`src/types/api/[domain].ts`)
- Entity interface with `readonly` properties
- Request payload interface
- Response envelope matching the backend contract
- List params interface (page, limit, search, filters)
- Error type

### 2. API Service (`src/services/[domain]Service.ts`)
- Typed async function(s) using the shared `apiClient`
- Proper destructuring of response envelope
- No `any`, no inline fetch, no direct `axios` import

### 3. TanStack Query Hook (`src/hooks/api/use[Domain].ts`)
- Query key factory (prevents typos, enables targeted invalidation)
- `useQuery` with staleTime, placeholderData, and enabled guard
- `useMutation` with `onSuccess` invalidation, `onMutate` optimistic update, `onError` rollback
- All loading/error states exposed

### 4. MSW Mock Handler (`src/mocks/handlers/[domain].ts`)
- Realistic mock data matching the TypeScript types
- All HTTP methods covered (GET, POST, PATCH, DELETE)
- Error scenarios (404, 422, 500) as named exports for use in tests
- Handler exported from `src/mocks/handlers/index.ts`

### 5. Unit Tests (`src/services/__tests__/[domain]Service.test.ts`)
- Tests each service function with MSW
- Covers success path, 404, 422, 500 error paths
- No real network calls — MSW intercepts all

### 6. Integration Tests (`src/__tests__/integration/[domain].integration.test.tsx`)
- Tests the full hook → service → (MSW) → response → state cycle
- Loading state, success state, error state
- Cache invalidation after mutations
- Optimistic update and rollback

## Pipeline

```
api-developer
  → (types + service + hooks + mocks)
  → unit-tester (service tests)
  → integration-tester (hook tests)
  → typescript-reviewer (type safety check)
```

## Rules Enforced

- Auth tokens never in URL params or console logs
- API base URL from environment variable (not hardcoded)
- `onUnhandledRequest: 'error'` in MSW test setup — catches missing mocks immediately
- All mutations invalidate related queries
- User-facing error messages are generic (no stack traces, no internal codes)
- Loading AND error states handled — partial states cause UI bugs

## Output Summary

After generation, a summary is shown:

```
✅ API Integration Generated

Types:     src/types/api/users.ts
Service:   src/services/userService.ts
Hooks:     src/hooks/api/useUsers.ts
Mocks:     src/mocks/handlers/users.ts
Tests:     src/services/__tests__/userService.test.ts
           src/__tests__/integration/users.integration.test.tsx

Coverage:  service (100%), hook (87%)
```
