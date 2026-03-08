\# Repository Rules



This document captures the development guardrails used in the K-Bucks demo repository.



These rules help keep the project stable as the demo evolves.



---



\## Versioning



The demo version is controlled by:



KB\_BUILD\_VERSION



This value appears in:



\- index.html

\- the footer of the demo

\- CHANGELOG.md



Version updates should normally be created through the release script:



npm run release -- VERSION "CHANGELOG MESSAGE"



The script automatically:



\- updates KB\_BUILD\_VERSION

\- updates CHANGELOG.md

\- creates a commit

\- creates a git tag



---



\## index.html editing rules



index.html is the main application file and contains most of the demo logic.



Guidelines:



\- Make the smallest possible edits.

\- Avoid large refactors unless explicitly planned.

\- Preserve indentation and formatting.

\- Test the UI after any change.



Because this file is large, edits should ideally be targeted to a specific section.



---



\## Documentation rules



Project documentation lives in two places.



Root directory:



README.md

CHANGELOG.md

CLAUDE.md



docs directory:



docs/PROJECT.md

docs/ARCHITECTURE.md

docs/DEVELOPMENT.md

docs/INDEX\_HTML\_MAP.md

docs/REPO\_RULES.md



New documentation should normally go inside the docs directory.



---



\## Git workflow



Typical workflow:



git status

git add .

git commit -m "Describe the change"



Commits should be small and describe a single logical change.



---



\## Release workflow



New demo versions should normally be created using the release script.



Example:



npm run release -- 0.2.95 "Add telemetry improvements"



This ensures that:



\- the version number is updated

\- the changelog stays consistent

\- git tags are created properly

