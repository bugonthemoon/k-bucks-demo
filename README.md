# K-Bucks

K-Bucks is a prototype educational incentives platform that rewards children with a virtual currency (KBU) for completing learning activities such as educational games and videos. The current architecture separates game engines, shared systems, and boot logic into focused modules for safer development and refactoring. Adapted from your current README fileciteturn10file0.

The goal of the project is to explore how incentive systems can make learning more engaging and sustainable for children while aligning parents, sponsors, and educational content creators.

## Project structure

    K-Bucks Demo
    │
    ├── index.html              # main composition root
    ├── PROJECT_STRUCTURE.md    # module overview for developers and AI tools
    ├── CHANGELOG.md            # version history
    ├── CLAUDE.md               # AI editing rules
    ├── .editorconfig           # formatting rules
    ├── .gitignore              # repo hygiene rules
    ├── docs/
    │   ├── PROJECT.md
    │   ├── ARCHITECTURE.md
    │   ├── DEVELOPMENT.md
    │   ├── INDEX_HTML_MAP.md
    │   ├── ARCHITECTURE_DIAGRAM.md
    │   └── ARCHITECTURE_RULES.md
    │
    ├── src/
    │   ├── navigation.js
    │   ├── map_engine.js
    │   ├── activity_state.js
    │   ├── ntc_engine.js
    │   ├── oap_engine.js
    │   ├── bingo_engine.js
    │   ├── wallet_engine.js
    │   ├── incentive_engine.js
    │   ├── content_data.js
    │   ├── constants.js
    │   └── app_boot.js
    │
    ├── scripts/
    │   └── release.js
    ├── package.json
    └── vite.config.js

### Architecture overview

- **index.html** is the composition root that wires modules together.
- **src/** contains the runtime modules.
- **docs/** contains architecture documentation and refactoring guardrails.

Game engines are intentionally independent:

- `ntc_engine` - Name That Country
- `oap_engine` - Optics & Photonics
- `bingo_engine` - Practice Times Tables

Shared systems:

- `wallet_engine` - wallet persistence and balances
- `incentive_engine` - KBU unit math and sponsor logic
- `map_engine` - Leaflet map lifecycle
- `activity_state` - shared NTC/OAP activity state
- `navigation` - screen transitions
- `app_boot` - application initialization
- `constants` - shared runtime constants
- `content_data` - static content definitions

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
- Modular browser-side architecture for safer iteration

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

Additional structure and refactoring guardrails live in:

    PROJECT_STRUCTURE.md
    docs/ARCHITECTURE_RULES.md

These documents help keep changes modular, minimal, and safe.

## Documentation

See the `docs/` directory for additional documentation:

- docs/PROJECT.md - project overview
- docs/ARCHITECTURE.md - system architecture
- docs/DEVELOPMENT.md - development workflow
- docs/INDEX_HTML_MAP.md - guide to navigating index.html
- docs/ARCHITECTURE_DIAGRAM.md - system architecture diagram
- docs/ARCHITECTURE_RULES.md - architectural guardrails for safe refactoring

## Version history

See:

    CHANGELOG.md

## License

Prototype and demo code intended for experimentation and product exploration.
