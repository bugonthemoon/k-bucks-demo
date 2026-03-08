# index.html Map

This document provides a high-level map of the main sections of index.html.
The file is large and contains most of the application logic for the K-Bucks demo.

Purpose of this document:
- help developers navigate the file
- make targeted edits easier
- help AI tools avoid modifying the wrong sections

---

## 1. Global configuration

Contains:

- build version (KB_BUILD_VERSION)
- configuration constants
- telemetry configuration
- global variables

---

## 2. Screen management

Functions responsible for switching between screens.

Typical functions:

showHomeScreen()
showGameScreen()
showStoreScreen()

These functions also fire telemetry events.

---

## 3. Educational Content screen

Displays the list of available learning activities.

Includes:

- Name That Country
- Multiply Two Numbers
- Optics and Photonics

Handles:

- play/watch buttons
- available KBU calculations

---

## 4. Game modules

Each learning experience has its own logic.

### Name That Country (NTC)

Main geography game using Leaflet.

Key responsibilities:

- map initialization
- country selection
- answer validation
- score tracking

### Multiply Two Numbers (MTN)

Multiplication practice grid.

Key responsibilities:

- question generation
- answer validation
- board state updates

### Optics and Photonics (OAP)

Video-based learning activity.

Key responsibilities:

- video playback
- watch-time tracking
- KBU payout timing

---

## 5. Incentive engine

Handles KBU flow.

Includes logic for:

- parent funding
- sponsor funding
- flow rate calculation
- KBU drop events

---

## 6. Wallet system

Tracks balances for:

- Child
- Parent
- Sponsors
- Content Developer
- Platform

---

## 7. Telemetry

GA4 events such as:

kb_game_start  
kb_answer  
kb_game_quit  
kb_reward  

These events include the anonymous user ID.

---

## 8. UI layout and styles

Includes:

- main layout grid
- pane layout
- spigot component
- typography and spacing

---

## Editing guidelines

When modifying index.html:

- change the smallest possible section
- avoid large refactors
- preserve indentation and formatting
- verify UI layout after changes