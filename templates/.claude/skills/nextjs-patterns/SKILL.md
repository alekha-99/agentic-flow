---
name: nextjs-patterns
description: Next.js 14+ App Router patterns — routing, data fetching, metadata, middleware
triggers:
  - nextjs patterns
  - next.js
  - app router
applies_to: ["**/app/**/*.tsx", "**/app/**/*.ts", "next.config.*"]
---

# Next.js Patterns Skill

## App Router Structure

```
app/
├── layout.tsx          # Root layout (shared UI, providers)
├── page.tsx            # Home page
├── loading.tsx         # Root loading UI
├── error.tsx           # Root error UI
├── not-found.tsx       # 404 page
├── globals.css         # Global styles
├── [feature]/
│   ├── page.tsx        # Feature page
│   ├── layout.tsx      # Feature layout
│   ├── loading.tsx     # Feature loading
│   ├── error.tsx       # Feature error
│   └── [id]/
│       └── page.tsx    # Dynamic route
└── api/
    └── [resource]/
        └── route.ts    # API route handler
```

## Data Fetching

```typescript
// Server Component with data fetching
export default async function ProductsPage() {
  const products = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  }).then(res => res.json());

  return <ProductGrid products={products} />;
}
```

## API Routes

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '20')));

  // Fetch data...
  return NextResponse.json({ users: [], total: 0, page, limit });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = createUserSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: result.error.flatten() },
      { status: 422 }
    );
  }

  // Create user...
  return NextResponse.json({ id: '1', ...result.data }, { status: 201 });
}
```

## Metadata

```typescript
// app/products/page.tsx
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our product catalog',
  openGraph: { title: 'Products', description: 'Browse our product catalog' },
};
```

## Middleware

```typescript
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth check
  const token = request.cookies.get('session')?.value;
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

## Key Rules

1. `loading.tsx` and `error.tsx` for every route group
2. Validate all API inputs with Zod
3. Use ISR (`revalidate`) for data that changes periodically
4. Server Actions for form submissions
5. Middleware for auth, redirects, headers
6. `generateStaticParams` for known dynamic routes
