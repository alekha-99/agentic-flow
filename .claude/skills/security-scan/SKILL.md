---
name: security-scan
description: Security audit against OWASP Top 10, dependency scanning, and secret detection
triggers:
  - /security
  - security scan
  - security audit
  - owasp
applies_to: ["**/*"]
---

# Security Scan Skill

## Quick Scan Commands

```bash
# Dependency vulnerabilities
npm audit

# Secret detection in codebase
grep -rn "sk-\|ghp_\|AKIA\|password\s*=\|token\s*=" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.env" .

# TypeScript strict checks
npx tsc --noEmit --strict
```

## OWASP Top 10 Checklist

### A01: Broken Access Control
- [ ] Auth middleware on all protected routes
- [ ] Role-based access checks in API routes
- [ ] CORS configured (not `*` in production)
- [ ] Directory traversal prevention

### A02: Cryptographic Failures
- [ ] HTTPS enforced
- [ ] Passwords hashed with bcrypt/argon2 (not MD5/SHA1)
- [ ] Tokens use secure random generation
- [ ] Sensitive data not in URL parameters

### A03: Injection
- [ ] SQL queries use parameterized statements
- [ ] HTML output is escaped/sanitized (React does this by default)
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] No `eval()` or `Function()` with user input

### A04: Insecure Design
- [ ] Rate limiting on auth endpoints
- [ ] Input validation with schemas (Zod)
- [ ] File upload restrictions (size, type)
- [ ] CAPTCHA on public forms

### A05: Security Misconfiguration
- [ ] Error messages don't leak stack traces
- [ ] Default credentials removed
- [ ] Security headers set (CSP, HSTS, X-Frame-Options)
- [ ] `.env` files not in version control

### A06: Vulnerable Components
- [ ] `npm audit` shows zero critical/high
- [ ] Dependencies are current (within 1 major version)
- [ ] No known CVEs in dependency tree

### A07: Auth Failures
- [ ] Session tokens rotate on login
- [ ] Failed login rate limiting
- [ ] Passwords meet complexity requirements
- [ ] Session timeout configured

### A08: Data Integrity
- [ ] Dependency lockfile checked in
- [ ] CI verifies lockfile integrity
- [ ] No unsigned/unverified packages

### A09: Logging Failures
- [ ] Security events logged (login, failed login, permission denied)
- [ ] No PII in logs
- [ ] Log injection prevention (sanitize user input before logging)

### A10: SSRF
- [ ] User-provided URLs validated against allowlist
- [ ] Internal service URLs not exposed
- [ ] DNS rebinding protection

## Auto-Fix Patterns

| Finding | Fix |
|---|---|
| Hardcoded secret | Move to `.env`, add to `.gitignore` |
| Missing auth check | Add middleware/guard |
| SQL injection risk | Use parameterized query |
| XSS via innerHTML | Use DOMPurify or remove |
| Missing rate limit | Add rate limiter middleware |
| Outdated dependency | `npm update <package>` |
