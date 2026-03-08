# K-Bucks Architecture

The K-Bucks demo is implemented as a lightweight single-page web application.

High-level architecture:

Browser UI
    ↓
index.html (SPA)
    ↓
Game modules
    • Name That Country (NTC)
    • Multiply Two Numbers (MTN)
    • Optics & Photonics (OAP)
    ↓
Incentive engine (KBU flow)
    ↓
Telemetry events

Key characteristics:

- Single-page HTML application
- Game modules embedded within the main UI
- Incentive engine distributes virtual currency (KBU)
- Telemetry events capture gameplay activity
- Versioning controlled through KB_BUILD_VERSION
