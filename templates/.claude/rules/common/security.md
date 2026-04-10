# Security Rules

## Mandatory Checks (Before Every Commit)

- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All user inputs validated with Zod schemas
- [ ] SQL queries use parameterized statements
- [ ] HTML output properly escaped (no raw `dangerouslySetInnerHTML`)
- [ ] CSRF protection enabled
- [ ] Auth/authz verified on all protected routes
- [ ] Rate limiting on public endpoints
- [ ] Error messages don't expose internal details

## Secret Management

- NEVER hardcode secrets in source code
- ALWAYS use environment variables
- Add `.env` to `.gitignore`
- Validate required env vars at startup
- Use `NEXT_PUBLIC_` prefix ONLY for public values

## Security Headers

```typescript
// next.config.js
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];
```

## Response Protocol

If a security issue is found:
1. STOP current work
2. Fix CRITICAL issues immediately
3. Rotate any exposed secrets
4. Review entire codebase for similar issues
5. Add tests to prevent regression
