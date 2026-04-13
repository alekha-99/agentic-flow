---
name: advisor-strategy
description: Executor-first model routing with Opus as an on-demand advisor
triggers:
  - advisor strategy
  - opus advisor
  - escalate to opus
  - executor advisor pattern
applies_to: ["**/*"]
---

# Advisor Strategy Skill

Use Sonnet/Haiku as executors for end-to-end work. Escalate to Opus only for hard decisions.

## Core Pattern

1. Executor runs task, calls tools, and iterates.
2. On complex or blocked decision points, executor consults advisor.
3. Advisor returns guidance only (plan, correction, or stop signal).
4. Executor resumes and completes the task.

## Escalation Triggers

Escalate when one or more are true:
- High architectural ambiguity across multiple subsystems
- Security severity is CRITICAL, or remediation is ambiguous
- Repeated failure on the same issue after 2 attempts
- Performance constraints require non-trivial tradeoffs
- Conflicting requirements with no obvious safe solution

## Escalation Packet

Provide advisor with:
- Current objective and blocker
- Relevant files/snippets only
- Attempts already made and outcomes
- Hard constraints and acceptance criteria

## Advisor Response Template

- Decision: proceed | adjust | stop
- Risks: top 1-3 risks with severity
- Recommendation: concrete next steps for executor
- Validation: checks required before completion

## Cost Controls

- Cap advisor uses per task (for example, max 3)
- Keep advisor prompts focused and compact
- Prefer executor-only flow for straightforward tasks
