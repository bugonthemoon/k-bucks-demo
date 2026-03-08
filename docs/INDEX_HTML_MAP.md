# index.html Map

This document is a navigation guide for `index.html` in the K-Bucks demo.

The file is large and contains most of the application logic, UI markup, and runtime behavior.
This map helps developers and AI tools locate the correct section quickly and avoid editing unrelated code.

Purpose:

- help developers navigate the file
- support targeted edits
- reduce accidental cross‑section changes
- provide safe editing guidance

See also:

- docs/ARCHITECTURE.md
- docs/ARCHITECTURE_DIAGRAM.md
- docs/REPO_RULES.md

---

## File role

`index.html` is the main application file for the demo.

It currently contains:

- UI markup
- layout styles
- screen structure
- game modules
- wallet and incentive logic
- telemetry hooks
- application initialization

Because this file is large, edits should always target the smallest relevant section.

---

# Section Map

## 1. Global configuration

Contains:

- build version (`KB_BUILD_VERSION`)
- configuration constants
- telemetry configuration
- shared helper functions
- global variables

Safe edits:

- version updates
- constants
- telemetry configuration

Avoid touching when editing:

- gameplay logic
- screen layout
- wallet math

---

## 2. Screen management

Responsible for switching between screens.

Typical functions:

- `showHomeScreen()`
- `showGameScreen()`
- `showStoreScreen()`

These functions also fire telemetry events.

Safe edits:

- navigation logic
- screen transitions

Avoid touching when editing:

- gameplay rules
- wallet engine

---

## 3. Educational Content screen

Displays available learning activities.

Includes:

- Name That Country
- Multiply Two Numbers
- Optics and Photonics

Handles:

- play/watch buttons
- available KBU calculations
- content list rendering

Safe edits:

- labels
- layout
- button behavior

Avoid touching when editing:

- game engine logic

---

## 4. Game modules

Each learning activity has its own logic.

### Name That Country (NTC)

Main geography game using Leaflet.

Key responsibilities:

- map initialization
- country selection
- answer validation
- score tracking

Safe edits:

- map behavior
- scoring rules
- round progression

Avoid touching when editing:

- MTN logic
- OAP video logic

---

### Multiply Two Numbers (MTN)

Multiplication practice grid.

Key responsibilities:

- question generation
- answer validation
- board state updates

Safe edits:

- board behavior
- question generation
- scoring

Avoid touching when editing:

- NTC map logic
- OAP playback logic

---

### Optics and Photonics (OAP)

Video-based learning activity.

Key responsibilities:

- video playback
- watch‑time tracking
- KBU payout timing

Safe edits:

- video behavior
- reward timing

Avoid touching when editing:

- MTN gameplay
- NTC gameplay

---

## 5. Incentive engine

Handles KBU flow through the system.

Includes:

- parent funding
- sponsor funding
- flow rate calculation
- KBU drop events

Safe edits:

- payout calculations
- formatting of values

Avoid touching when editing:

- gameplay modules unless payouts change

---

## 6. Wallet system

Tracks balances for:

- Child
- Parent
- Sponsors
- Content Developer
- Platform

Safe edits:

- balance calculations
- display formatting

Avoid touching when editing:

- gameplay logic

---

## 7. Telemetry

GA4 events such as:

- `kb_game_start`
- `kb_answer`
- `kb_game_quit`
- `kb_reward`

Events include an anonymous user identifier.

Safe edits:

- event parameters
- additional telemetry signals

Avoid touching when editing:

- gameplay logic unless necessary

---

## 8. UI layout and styles

Includes:

- main layout grid
- pane layout
- spigot component
- typography and spacing

Safe edits:

- spacing
- typography
- color adjustments
- pane dimensions

Avoid touching when editing:

- JavaScript logic

---

# Editing guidelines

When modifying `index.html`:

1. Identify the smallest relevant section.
2. Change only that section unless a cross‑section dependency exists.
3. Preserve indentation and formatting.
4. Avoid large refactors without approval.
5. After editing, verify that the affected screen behaves correctly.
