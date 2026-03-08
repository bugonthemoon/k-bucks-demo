# K-Bucks Demo — Architecture Rules

This document defines structural rules that must not be violated when modifying the project.

## 1\. Module boundaries

Each module in `src/` has a single responsibility and exposes a namespace on `window`.

Current exported namespaces:

* `window.KB\_NAV`
* `window.KB\_MAP`
* `window.KB\_ACTIVITY`
* `window.KB\_NTC`
* `window.KB\_OAP`
* `window.KB\_BINGO`
* `window.KB\_WALLET`
* `window.KB\_ENGINE`
* `window.KB\_DATA`
* `window.KB\_CONST`
* `window.KB\_APP\_BOOT`

Rules:

* Do not access another module's internal variables directly.
* Interact across modules only through exported functions or values.
* Do not move logic from one module into another unless explicitly requested.

## 2\. index.html is the composition root

`index.html` wires all modules together.

Rules:

* Do not move engine logic back into `index.html`.
* Do not create new feature logic in `index.html` unless explicitly requested.
* Keep `index.html` focused on state declarations, DOM references, module wiring, and composition.

## 3\. Engine independence

Game engines must remain independent:

* `src/ntc\_engine.js`
* `src/oap\_engine.js`
* `src/bingo\_engine.js`

Rules:

* These engines must not depend on each other directly.
* Shared behavior should go through shared modules such as:

  * `src/wallet\_engine.js`
  * `src/incentive\_engine.js`
  * `src/activity\_state.js`
  * `src/map\_engine.js`

* Do not copy logic from one engine into another.

## 4\. Constants belong in constants.js

Shared constants must live in:

* `src/constants.js`

Rules:

* Do not duplicate shared configuration values across modules.
* Prefer adding true constants to `src/constants.js`.
* Do not move mutable state into `src/constants.js`.

## 5\. Boot logic belongs in app\_boot.js

Application startup and event wiring must remain in:

* `src/app\_boot.js`

Rules:

* Do not scatter startup wiring across engine files.
* Do not move boot-time orchestration back into `index.html`.
* Keep app initialization centralized.

## 6\. Avoid new globals

All globals should live under the `window.KB\_\*` namespace.

Rules:

* Do not introduce new top-level globals.
* New shared modules should export through a single `window.KB\_\*` namespace.
* Prefer one namespace per module.

## 7\. Prefer adding modules over growing files

Rules:

* If a file grows large or gains multiple responsibilities, add a new module in `src/`.
* Prefer small, coherent modules over expanding an existing file with unrelated logic.
* Keep edits minimal and mechanical whenever possible.

## 8\. Refactoring rules

Rules:

* No UI changes during refactoring unless explicitly requested.
* No copy changes during refactoring unless explicitly requested.
* No behavior changes during refactoring unless explicitly requested.
* Prefer mechanical moves over rewrites.
* Preserve existing naming until refactoring is complete, unless renaming is explicitly requested.

## 9\. Documentation expectations

When architecture changes:

* Update `PROJECT\_STRUCTURE.md` if module responsibilities change materially.
* Keep module header comments accurate.
* Keep the architecture overview comment in `index.html` aligned with the actual module layout.
