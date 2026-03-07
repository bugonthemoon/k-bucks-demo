K-Bucks Demo

K-Bucks is a prototype educational incentives platform where children earn virtual currency (KBU) by completing learning activities.

The demo currently includes:

Name That Country (NTC) geography game

Optics & Photonics (OAP) educational video flow

Multiply Two Numbers (MTN) math game

Parent and Sponsor funding flows

Telemetry events for gameplay and earnings

The application is implemented as a lightweight single-page HTML demo.

Development

Start the local development server:

npm run dev

This launches a Vite development server and opens:

http://localhost:5173

The dev server automatically reloads the browser when files change.

Release workflow

Releasing a new demo version is automated.

Run:

npm run release -- <version> "<changelog message>"

Example:

npm run release -- 0.2.94 "Add Vite dev workflow and Leaflet config regression guard"

The release script will automatically:

Update window.KB_BUILD_VERSION in index.html

Update the fallback version reference

Insert a new entry into CHANGELOG.md

Commit the changes

Create a Git tag (v<version>)

Project structure
index.html          Main demo application
CHANGELOG.md        Version history
CLAUDE.md           AI editing rules
scripts/release.js  Release automation
package.json        Dev tooling configuration
vite.config.js      Vite dev server configuration
AI-assisted development

This project is developed by a human + AI team.

Role	Responsibility
Vlad	Product owner and final decision maker
Max	Architecture, planning, and review
Claude	Code implementation and refactoring

Claude Code follows rules defined in:

CLAUDE.md

to ensure safe, minimal edits.

Version history

See:

CHANGELOG.md
License

Prototype / demo code for experimentation.