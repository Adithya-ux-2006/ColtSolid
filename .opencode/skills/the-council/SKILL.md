---
name: the-council
description: |
  Use when the user asks for a review, approval, second opinion, or quality
  gate on any code or design change. Also use for "the council", "full
  review", "review panel", "code review", "design review", or "security
  review". Orchestrates three specialized agents.
---

# The Council — Multi-Agent Review Panel

Workflow for reviewing any change (PR, feature, component, or refactor):

## Step 1: Identify scope

Ask the user what they want reviewed. If they didn't specify, assume all
three. Identify the files involved.

## Step 2: Dispatch to reviewers (parallel)

Run all three subagents concurrently. Pass them the list of files and the
change description.

### Design Reviewer (`council-design-reviewer`)

Use this agent when UI/visual components are involved. It checks:
- Design token compliance (colors, spacing, typography from Tailwind config)
- Responsive behavior
- Accessibility (contrast, focus states, semantic HTML)
- Consistency with existing components in `src/components/`

Prompt template:
```
Review these files for UI/UX quality:
{file_list}

Context: {description}

Enforce the ClotSolid design system. Check color tokens, spacing scale,
typography, responsiveness, and accessibility. Compare against existing
components for consistency. Return specific line-level feedback.
```

### Code Reviewer (`council-code-reviewer`)

Use this agent for ALL changes. It checks:
- Correctness and logic errors
- Performance issues
- Adherence to project patterns
- No dead code, no console.logs, no placeholder comments
- Proper error handling

Prompt template:
```
Review these files for code quality:
{file_list}

Context: {description}

Check for: logic errors, performance issues, security concerns, dead code,
console.logs, placeholder comments, and adherence to existing patterns in
the codebase. Return specific line-level feedback with fix suggestions.
```

### Security Reviewer (`council-security-reviewer`)

Use this agent when the change involves user input, API calls, authentication,
or data storage. It checks:
- XSS / injection vulnerabilities
- Auth bypass or privilege escalation
- Data exposure (PII in logs, excessive response data)
- CSRF, SSRF
- Dependency risks

Prompt template:
```
Review these files for security vulnerabilities:
{file_list}

Context: {description}

Check for: XSS, injection, auth bypass, data exposure, CSRF, SSRF, and
any unsafe patterns. Return specific line-level findings with severity
ratings (Critical / High / Medium / Low).
```

## Step 3: Synthesize results

Collect all three reviews. Present to the user as:

```
## Council Review Results

### Design Review (pass/fail)
- {summary}
- {key findings}

### Code Review (pass/fail)
- {summary}
- {key findings}

### Security Review (pass/fail)
- {summary}
- {key findings}

### Overall: Pass / Conditional Pass / Fail
```

If any review returns "Fail", explain what must be fixed before approval.
If "Conditional Pass", list optional improvements.
