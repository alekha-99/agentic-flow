# /security — Security Scan

Run a security audit against OWASP Top 10 with dependency scanning and secret detection.

## Usage

```
/security [file or directory to scan]
/security  # Scan entire project
```

## Scans

1. OWASP Top 10 checklist (A01-A10)
2. Secret detection (API keys, tokens, passwords)
3. Dependency audit (`npm audit`)
4. Configuration review (next.config, .env, CORS)
5. Auth boundary verification
