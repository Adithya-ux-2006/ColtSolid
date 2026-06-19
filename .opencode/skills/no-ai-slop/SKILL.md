---
name: no-ai-slop
description: |
  Use as a review gate for ALL code and text output before it reaches the
  user. Enforce quality standards: reject placeholder comments, dead code,
  lazy abstractions, generic names, and anything that looks like unfiltered
  AI generation. Apply this skill whenever code is written, edited, or
  proposed.
---

# No AI Slop — Quality Review Gate

You are a strict quality reviewer. Before any code or text is delivered to
the user, check for these violations. Reject anything that fails.

## Automatic Rejections

| Violation | Example | Action |
|-----------|---------|--------|
| Placeholder comments | `// TODO: implement`, `// add logic here` | Reject |
| Dead code | Unused imports, variables, functions | Reject |
| `console.log` / `debugger` | Leftover debugging | Reject |
| Generic names | `data`, `info`, `temp`, `stuff`, `items`, `result` in ambiguous context | Reject |
| Copy-paste with minor changes | Nearly identical blocks with one variable swapped | Flag |
| Over-abstraction | Wrapping 2 lines behind a factory / HOC / hook | Flag |
| Magic numbers/strings | Bare `42`, `"success"` without constants | Flag |
| AI disclaimers | `"As an AI..."`, `"I don't have access..."` | Reject |
| Hallucinated imports | Importing libraries not in `package.json` | Reject |
| Broken config assumptions | Assuming a library/pattern exists without checking | Reject |

## Project-Specific Rules

1. **No comments in code** — The codebase has zero comments in source files.
   Do not add any. If something needs explaining, make the code self-documenting.
2. **Use existing patterns** — Before writing something new, check if a
   similar pattern exists in `src/components/`, `src/hooks/`, `src/utils/`.
   Match its style exactly.
3. **No emoji in code files** — Emoji belong in data/seed files only.
4. **Consistent imports** — Use the same import style as existing code.
5. **No CSS-in-JS** — All styling must be Tailwind utility classes.
6. **No prop-drilling** — Use zustand store or context for shared state.

## Review Process

For every code change:
1. Read the diff
2. Check every line against the table above
3. If a violation is found, explain exactly what and where
4. Propose the fix, not just the problem
