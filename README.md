# K-Bucks

K-Bucks is a prototype educational incentives platform that rewards children with a virtual currency (KBU) for completing learning activities such as educational games and videos.

The goal of the project is to explore how incentive systems can make learning more engaging and sustainable for children while aligning parents, sponsors, and educational content creators.

## Demo

The current demo includes several interactive learning experiences:

- Name That Country (NTC) - geography recognition game using an interactive map
- Optics & Photonics (OAP) - educational video flow with earning mechanics
- Multiply Two Numbers (MTN) - multiplication practice game
- Parent and Sponsor funding flows - simulated funding of a child wallet
- Gameplay telemetry - analytics events for learning and earnings

The application is implemented as a lightweight single-page HTML demo.

## Features

- Incentives-based learning model
- Virtual currency economy (KBU)
- Interactive geography and math games
- Educational video reward flow
- Sponsor and parent funding simulation
- Telemetry events for gameplay analytics

## Quick start

Install dependencies:

    npm install

Run the development server:

    npm run dev

Create a new demo release:

    npm run release -- VERSION "CHANGELOG MESSAGE"

## Development

Start the development server:

    npm run dev

This launches a Vite development server and opens:

    http://localhost:5173

The dev server automatically reloads the browser when files change.

## Release workflow

Releasing a new demo version is automated.

Run:

    npm run release -- VERSION "CHANGELOG MESSAGE"

Example:

    npm run release -- 0.2.94 "Add Vite dev workflow and Leaflet config regression guard"

The release script automatically:

- Updates window.KB_BUILD_VERSION in index.html
- Updates the fallback version reference
- Inserts a new entry into CHANGELOG.md
- Commits the changes
- Creates a Git tag (v plus version)

## Project structure

    index.html           Main demo application
    CHANGELOG.md         Version history
    CLAUDE.md            AI editing rules
    scripts/release.js   Release automation
    package.json         Dev tooling configuration
    vite.config.js       Vite dev server configuration

## Team

K-Bucks is developed by a small hybrid human + AI team.

Vlad
CEO and Head of Product

Max
AI CTO and Technical Architect

Claude
AI Software Engineer

## AI-assisted development

This project uses AI-assisted development tools.

- Vlad defines product direction, approves changes, and is responsible for final decisions.
- Max provides architecture guidance, development planning, and technical review.
- Claude assists with implementation, refactoring, and code generation.

Claude Code follows development rules defined in:

    CLAUDE.md

to ensure safe, minimal edits.

## Version history

See:

    CHANGELOG.md

## License

Prototype and demo code intended for experimentation and product exploration.

## Documentation

See the `/docs` directory for additional documentation:

- docs/PROJECT.md — project overview
- docs/ARCHITECTURE.md — system architecture
- docs/DEVELOPMENT.md — development workflow
- docs/INDEX_HTML_MAP.md — guide to navigating index.html
- docs/ARCHITECTURE_DIAGRAM.md — system architecture diagram