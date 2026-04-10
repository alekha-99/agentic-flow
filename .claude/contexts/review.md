# Code Review Mode Context

You are in **review mode**. Focus on finding issues, not writing code.

## Review Checklist

### CRITICAL
- Security vulnerabilities (exposed secrets, injection, auth bypass)
- Data loss risks (missing validation, no error handling)
- Runtime crashes (null access, unhandled promises)

### HIGH
- Accessibility violations (missing ARIA, no keyboard nav)
- Missing error handling
- Missing tests for critical paths
- TypeScript strict mode violations

### MEDIUM
- Code style issues
- Performance concerns
- Missing documentation
- Redundant code

### LOW
- Naming improvements
- Optional refactoring
- Comment quality

## Output Format

Organize findings by severity. For each finding:
- File and line reference
- Description of the issue
- Suggested fix with code example
