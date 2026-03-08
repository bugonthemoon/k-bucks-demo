\# Architecture Diagram



This document provides a simple visual view of the K-Bucks demo architecture.



\## High-level system



Browser UI

&nbsp;   ↓

index.html

&nbsp;   ↓

Screens and game flows

&nbsp;   - Educational Content

&nbsp;   - Redemption Store

&nbsp;   - Name That Country

&nbsp;   - Optics \& Photonics

&nbsp;   - Multiply Two Numbers

&nbsp;   ↓

Incentive engine

&nbsp;   - Parent funding

&nbsp;   - Sponsor funding

&nbsp;   - Flow rate calculation

&nbsp;   - KBU drop logic

&nbsp;   ↓

Wallet system

&nbsp;   - Child

&nbsp;   - Parent

&nbsp;   - Sponsors

&nbsp;   - Content Developer

&nbsp;   - Platform

&nbsp;   ↓

Telemetry

&nbsp;   - kb\_game\_start

&nbsp;   - kb\_answer

&nbsp;   - kb\_game\_quit

&nbsp;   - kb\_reward



\## Runtime assets



index.html depends on:



\- assets/images

\- assets/videos

\- data/countries.geojson



\## Development flow



Developer

&nbsp;   ↓

Local Git repo

&nbsp;   ↓

Vite development server

&nbsp;   ↓

Browser test

&nbsp;   ↓

Commit

&nbsp;   ↓

Release script



\## Notes



\- The demo is currently implemented as a single-page application in `index.html`.

\- Most business logic currently lives in `index.html`.

\- The incentive engine is the core logic of the project.

\- Future refactors may extract logic into separate modules.

