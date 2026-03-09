# K-Bucks Demo

K-Bucks Demo illustrates how the educational incentives platform works. The platform rewards children with a virtual currency (KBU, funded by parents and education sponsors) for completing learning activities such as playing educational games and watching educational videos. Children can redeem KBU for rewards such as toys, experiences, and desired items. Educational content creators and the K-Bucks platform receive a percentage of the KBU flowing through the educational content. The goal of the demo is to show how incentive systems can make learning more engaging and sustainable for children while aligning parents, sponsors, and educational content creators.

The current architecture separates game engines, shared systems, and boot logic into focused modules for safer development and refactoring.

## Project structure

```text
K-Bucks Demo
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
│   ├── engine_registry.js
│   └── app_boot.js
├── scripts/
│   └── release.js
├── package.json
└── vite.config.js
```


### Architecture overview

* **index.html** is the composition root that wires modules together.
* **src/** contains the runtime modules.
* **docs/** contains architecture documentation and refactoring guardrails.

Game engines are intentionally independent:

* `ntc\_engine` - Name That Country
* `oap\_engine` - Optics \& Photonics
* `bingo\_engine` - Practice Times Tables

Shared systems:

* `engine\_registry` - central metadata registry for all game engines
* `wallet\_engine` - wallet persistence and balances
* `incentive\_engine` - KBU unit math and sponsor logic
* `map\_engine` - Leaflet map lifecycle
* `activity\_state` - shared NTC/OAP activity state
* `navigation` - screen transitions
* `app\_boot` - application initialization and boot-time registry validation
* `constants` - shared runtime constants, build version, and Leaflet guardrail values
* `content\_data` - static content definitions

## Demo

The current demo includes several interactive learning experiences:

* Name That Country (NTC) - geography recognition game using an interactive map
* Optics \& Photonics (OAP) - educational video flow with earning mechanics
* Multiply Two Numbers (MTN) - multiplication practice game
* Parent and Sponsor funding flows - simulated funding of a child wallet
* Gameplay telemetry - analytics events for learning and earnings

The application is implemented as a lightweight single-page HTML demo.

## Features

* Incentives-based learning model
* Virtual currency economy (KBU)
* Interactive geography and math games
* Educational video reward flow
* Sponsor and parent funding simulation
* Telemetry events for gameplay analytics
* Modular browser-side architecture for safer iteration

## Quick start

Install dependencies:

```text
npm install
```


Run the development server:

```text
npm run dev
```


Create a new demo release:

```text
npm run release -- VERSION "CHANGELOG MESSAGE"
```


## Development

Start the development server:

&nbsp;   npm run dev


This launches a Vite development server and opens:

```text
http://localhost:5173
```


The dev server automatically reloads the browser when files change.

## Release workflow

Releasing a new demo version is automated.

Run:

```text
npm run release -- VERSION "CHANGELOG MESSAGE"
```


Example:

```text
npm run release -- 0.2.94 "Add Vite dev workflow and Leaflet config regression guard"
```


The release script automatically:

* Updates window.KB\_BUILD\_VERSION in index.html
* Updates the fallback version reference
* Inserts a new entry into CHANGELOG.md
* Commits the changes
* Creates a Git tag (v plus version)

## Team

K-Bucks Demo is developed by a small hybrid human + AI team.

Vlad  
CEO and Head of Product

Max  
AI CTO and Technical Architect

Claude  
AI Software Engineer

## AI-assisted development

This project uses AI-assisted development tools.

* Vlad defines product direction, approves changes, and is responsible for final decisions.
* Max provides architecture guidance, development planning, and technical review.
* Claude assists with implementation, refactoring, and code generation.

Claude Code follows development rules defined in:

```text
CLAUDE.md
```


Additional structure and refactoring guardrails live in:

```text
PROJECT_STRUCTURE.md
docs/ARCHITECTURE_RULES.md
```


These documents help keep changes modular, minimal, and safe.

## Documentation

See the `docs/` directory for additional documentation:

* docs/PROJECT.md - project overview
* docs/ARCHITECTURE.md - system architecture
* docs/DEVELOPMENT.md - development workflow
* docs/INDEX\_HTML\_MAP.md - guide to navigating index.html
* docs/ARCHITECTURE\_DIAGRAM.md - system architecture diagram
* docs/ARCHITECTURE\_RULES.md - architectural guardrails for safe refactoring

## Version history

See:

```text
CHANGELOG.md
```


## License

Prototype and demo code intended for experimentation and product exploration.

