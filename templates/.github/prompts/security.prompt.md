---
mode: agent
description: "Security scan: OWASP Top 10, secret detection, dependency audit"
tools:
  - read_file
  - grep_search
  - file_search
  - run_in_terminal
---

# Security Scan Pipeline

Run a comprehensive security audit.

## Instructions

1. **Secret Detection** — Scan for API keys, tokens, passwords, connection strings
2. **OWASP Top 10** — Check all 10 categories (A01-A10)
3. **Dependency Audit** — Run `npm audit`, check for known CVEs
4. **Configuration** — Review next.config, .env handling, CORS, CSP headers
5. **Auth Boundaries** — Verify middleware and API route auth checks
6. **Report** — Organized by severity (CRITICAL → HIGH → MEDIUM → LOW)

Scan: $input
