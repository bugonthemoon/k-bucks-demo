# Claude Code Guidelines for K-Bucks Demo

## Editing rules

* Prefer minimal edits.
* Do not rewrite large sections of files.
* Preserve formatting, indentation, and whitespace.
* Do not reorder existing code unless explicitly asked.

## index.html

This is the main application file (~3000+ lines).

When editing:

* Modify only the smallest necessary line range.
* Never refactor large blocks automatically.
* Always show the exact diff before writing changes.

## Safety checks

Before applying any change:

1. Show the current code.
2. Show the proposed change.
3. Show a concise diff summary.

Never apply edits silently.

## Git workflow

After making changes:

* Use small commits.
* Use clear commit messages.
* Do not stage unrelated files.

## General behavior

* Prefer readability over cleverness.
* Avoid introducing dependencies unless explicitly requested.
* Do not modify project structure unless requested.

## Large file edits

For files larger than 1000 lines (like index.html), always anchor edits to a specific line range when possible.



\## Team workflow



The project is developed by a human + AI team:



\- Vlad (Product Owner): defines goals, priorities, and approves all changes.

\- Max (Architect): designs the implementation plan and reviews proposed changes.

\- Claude (Implementation Engineer): performs code edits and implements approved plans.



Workflow rules:



1\. Do not invent new architecture or features unless explicitly asked.

2\. Follow the plan provided by Max and approved by Vlad.

3\. Prefer small, mechanical edits over large rewrites.

4\. Always show the proposed change and diff before writing files.

5\. If instructions conflict or are unclear, ask for clarification instead of guessing.

