# K-Bucks Demo — Project Structure

This document describes the module architecture of the K-Bucks demo so AI coding tools and developers understand the code layout quickly.

## Entry Point

index.html  
Main orchestration script. Responsible for:

- Loading all engine modules
- Wiring module exports
- Creating the runtime environment
- Starting the application via `KB_APP_BOOT.init()`

---

# src Modules

## navigation.js
Controls screen transitions.

Responsibilities:
- showEduScreen
- showGameScreen
- showBingoScreen
- showStoreScreen

Exports:
`window.KB_NAV`

---

## map_engine.js
Leaflet map lifecycle and rendering.

Responsibilities:
- map creation
- tile layer management
- double-buffer handling
- tile seam healing

Exports:
`window.KB_MAP`

---

## activity_state.js
Shared geo activity state.

Used by:
- Name That Country
- Optics & Photonics

Responsibilities:
- geo activity switching
- video/map context
- inset synchronization

Exports:
`window.KB_ACTIVITY`

---

## ntc_engine.js
Name That Country gameplay engine.

Responsibilities:
- country deck
- guessing logic
- scoring
- timer
- map highlighting

Exports:
`window.KB_NTC`

---

## oap_engine.js
Optics & Photonics watch engine.

Responsibilities:
- video playback tracking
- watch timer
- reward flow

Exports:
`window.KB_OAP`

---

## bingo_engine.js
Practice Times Tables engine.

Responsibilities:
- bingo board logic
- game progression
- wallet rewards

Exports:
`window.KB_BINGO`

---

## wallet_engine.js
Wallet persistence and accounting.

Responsibilities:
- wallet balances
- flow rate logic
- account updates
- available-to-earn calculations

Exports:
`window.KB_WALLET`

---

## incentive_engine.js
Core KBU math utilities.

Responsibilities:
- KBU unit conversions
- formatting helpers
- sponsor math

Exports:
`window.KB_ENGINE`

---

## content_data.js
Static content definitions.

Responsibilities:
- educational content list
- redemption store items

Exports:
`window.KB_DATA`

---

## constants.js
Shared runtime constants.

Responsibilities:
- asset paths
- style constants
- map constants
- build version (sourced from `window.KB_BUILD_VERSION`)
- Leaflet guardrail values (used by drift detection in map_engine.js)

Exports:
`window.KB_CONST`

---

## engine_registry.js
Central metadata registry for game engines.

Responsibilities:
- engine registration (key, displayName, namespace, screen)
- registry lookup and validation
- source of truth for which engines are present at boot

Exports:
`window.KB_REGISTRY`

---

## app_boot.js
Application boot layer.

Responsibilities:
- boot-time registry validation (engine presence and namespace checks)
- event listener wiring
- startup initialization
- ResizeObserver
- initial screen rendering

Exports:
`window.KB_APP_BOOT`