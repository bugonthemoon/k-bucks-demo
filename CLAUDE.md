# Claude Code Guidelines for K-Bucks Demo

## Editing rules
- Prefer minimal edits.
- Do not rewrite large sections of files.
- Preserve formatting, indentation, and whitespace.
- Do not reorder existing code unless explicitly asked.

## index.html
This is the main application file (~3000+ lines).

When editing:
- Modify only the smallest necessary line range.
- Never refactor large blocks automatically.
- Always show the exact diff before writing changes.

## Safety checks
Before applying any change:
1. Show the current code.
2. Show the proposed change.
3. Show a concise diff summary.

Never apply edits silently.

## Git workflow
After making changes:
- Use small commits.
- Use clear commit messages.
- Do not stage unrelated files.

## General behavior
- Prefer readability over cleverness.
- Avoid introducing dependencies unless explicitly requested.
- Do not modify project structure unless requested.