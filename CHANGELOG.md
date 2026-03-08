# CHANGELOG

## Legacy notes

- 0.1.357 (2026-01-28): Remove NTC footer pin JS and rely on CSS only to prevent zoom freezes.
- 0.1.251 (2026-01-26): Set global wrap horizontal padding to 8px and keep NTC row height 32px.
- 0.1.238 (2026-01-26): Screen 3 layout test. Set map slot to 512x512, move game buttons under answers, and move account panes into a right-side column.
- 0.1.237 (2026-01-25): Call KB_TELEMETRY.screen only from show*Screen functions.
- 0.1.236 (2026-01-24): Attach kb_anon_user_id to all kb_* GA4 events.

## Releases

- 0.2.94 (2026-03-08): Internal refactor sweep: modularized engine source files, added boot-time registry validation, centralized build version and Leaflet guardrail values in KB_CONST, and aligned project docs.
- 0.2.93 (2026-02-18): Set OAP initial flow rate to 3.60 KBU per hour of watching.
- 0.2.91 (2026-02-17): Set initial Parent and Sponsor balances and flow rates for NTC, OAP, and MTN.
- 0.2.92 (2026-02-17): Fix startup initialization so NTC Parent/Sponsor defaults persist and Screen 1 Available-to-earn includes NTC.
- 0.2.90 (2026-02-17): Added kb_game_quit on Quit for OAP, NTC, and MTN. OAP kb_answer now fires every 10 seconds of watched time, including zero-payout ticks.
- 0.2.89 (2026-02-17): Added kb_bullet param to kb_answer for NTC, MTN, and OAP (selected bullet text or video title).
- 0.2.88 (2026-02-17): OAP GA kb_answer now fires on each 10-second watched-time KBU drop, not on bullet selection.
- 0.2.87 (2026-02-17): Educational Content ratings update. Optics and Photonics now shows 4.4 stars.
- 0.2.86 (2026-02-17): Educational Content ratings update. Optics and Photonics now shows 4.5 stars. Multiply Two Numbers now shows 4.1 stars.
- 0.2.84 (2026-02-17): Standardize spigot formatting across OAP, NTC, and MTN by using MTN wallet formatting (min 2 decimals, up to 9, with thousand separators) for spigot Flow rate and KBU/hour or KBU drop lines.
- 0.2.83 (2026-02-17): NTC and MTN spigot Flow rate and KBU per hour lines now update on blur or Enter for Parent and Sponsor input boxes.
- 0.2.83 (2026-02-17): NTC spigot Flow rate now includes Sponsors contribution in display precision (up to 3 decimals, trimmed).
- 0.2.81 (2026-02-17): Fixed OAP periodic KBU deduction to respect updated flow rate. Fixed NTC "KBU per hour (estimate)" to not use OAP drop logic.
- 0.2.79 (2026-02-17): Fixed OAP spigot flow math and formatting. Updated "Flow rate" and "KBU drop" to recalc on blur or Enter for all four OAP inputs.
- 0.2.77 (2026-02-17): OAP KBU per hour line now shows per-interval drop (every KB_OAP_FLOW_EVERY_SEC seconds) and label updates dynamically.
- 0.2.77 (2026-02-17): Removed footer candy easter-egg, and added OAP periodic KBU flow every 10 seconds of watched time.
- 0.2.78 (2026-02-17): OAP match ratio updates live while typing so flow and drop lines stay correct.
- 0.2.74 (2026-02-17): Locked spigot pane height to 69 px across game screens to eliminate third-column jitter.
- 0.2.74 (2026-02-17): OAP spigot row locked to 69px height to match NTC spacing and prevent any vertical shifting.
- 0.2.72 (2026-02-17): OAP spigotInner top-aligned to prevent icon shifting when row height changes after input edits.
- 0.2.70 (2026-02-17): Reserved spigot image size (width/height attrs and 56px CSS) to prevent initial layout shift in OAP.
- 0.2.69 (2026-02-17): Reordered OAP Select-a-video list so Fiber optic cables appears first.
- 0.2.67 (2026-02-16): OAP spigot icon pinned to top to prevent vertical jitter when inputs update.
- 0.2.66 (2026-02-16): OAP rename video label to "Fiber optic cables 5:35".
- 0.2.65 (2026-02-16): OAP KBU per hour (estimate) equals Parent+Sponsors flow rate. Rename Watch time to Total watch time.
- 0.2.64 (2026-02-16): OAP KBU per hour estimate now equals Parent+Sponsors flow rate (per hour). NTC/MTN unchanged.
- 0.2.63 (2026-02-16): OAP KBU per hour estimate equals flow rate. Rename Progress to Watch time in OAP and allow watch time to exceed 100%.
- 0.2.62 (2026-02-16): Restore NTC/MTN KBU per hour estimate math. OAP per-hour estimate equals flow rate. OAP selected video shows a checkmark.
- 0.2.61 (2026-02-16): OAP KBU per hour estimate equals flow rate. Selected video button shows checkmark.
- 0.2.60 (2026-02-16): OAP Progress now shows m:ss for numerator and denominator, and integer percent.
- 0.2.59 (2026-02-16): OAP Progress uses video currentTime deltas for exact sync with player timer.
- 0.2.58 (2026-02-16): Initialize OAP watch timer on OAP entry so Progress enumerator updates while playing.
- 0.2.57 (2026-02-16): Fix crash on start caused by malformed kbOapIsWindowActive try/catch block.
- 0.2.56 (2026-02-16): Fix OAP Progress UI not updating by adding timeupdate-based progress tracking and making window-activity detection reliable.
- 0.2.55 (2026-02-16): Fix crash on start caused by stray kbOapLastTickTs assignment. Ensure OAP watch timer initializes on OAP entry.
- 0.2.54 (2026-02-16): OAP Progress enumerator now ticks reliably using real-time deltas while video plays, with pause/resume hooks.
- 0.2.53 (2026-02-16): Fix crash on load from stray OAP progress code token, and initialize OAP watch timer.
- 0.2.52 (2026-02-16): Fix crash on load caused by malformed kbOapProgressMs declaration.
- 0.2.51 (2026-02-16): OAP Progress numerator now tracks watch time while video plays, pauses on tab blur or hidden and resumes on focus, ms precision with hh:mm:ss display.
- 0.2.50 (2026-02-16): OAP Quit stops video playback; entering OAP resets Progress numerator and clears selected video.
- 0.2.49 (2026-02-16): OAP Progress rendering now keys off kbGeoActiveKey === "oap" and forces update on OAP entry.
- 0.2.48 (2026-02-16): Fix OAP Progress showing NTC counters by detecting OAP mode and rendering hh:mm:ss progress using OAP-specific variables.
- 0.2.47 (2026-02-16): OAP Progress uses OAP-specific time-based numerator and denominator, showing 00:00:00/00:10:27 (0%).
- 0.2.41 (2026-02-16): OAP shows video durations in the Select a video list.
- 0.2.40 (2026-02-16): OAP extra padding below native controls adjusted from 32px to 16px.
- 0.2.39 (2026-02-16): OAP adds 32px extra padding below native controls by increasing computed video element height.
- 0.2.38 (2026-02-16): OAP sizes video element to video-frame height plus native controls height so controls sit directly under the video frame, not at the 512x512 bottom.
- 0.2.37 (2026-02-16): OAP video element now extends to the bottom of the 512x512 box so native controls sit on the bottom edge (overlay style).
- 0.2.36 (2026-02-16): OAP video top inset tweak adjusted from +6px to +5px.
- 0.2.35 (2026-02-16): OAP video top alignment nudged down 6px to match prompt, and native controls pushed down with extra control padding.
- 0.2.34 (2026-02-16): OAP moves native controls up by sizing the video element using a 16:9 fallback until metadata loads, then re-syncs on metadata and canplay.
- 0.2.33 (2026-02-16): OAP sizes the native video element to the rendered video content height plus a controls allowance so controls sit directly under the video.
- 0.2.32 (2026-02-16): OAP aligns video content to the top using object-position so the first frame starts at the prompt-aligned top edge.
- 0.2.31 (2026-02-16): OAP forces video positioning using inline !important styles to override any prior centered rules.
- 0.2.30 (2026-02-16): OAP enforces video positioning relative to #mapSlot and re-syncs after mode switch and source load so top alignment takes effect.
- 0.2.29 (2026-02-16): OAP sets video top and height via inline styles computed from the prompt position, ensuring pixel-perfect alignment and a bottom gap for native controls.
- 0.2.28 (2026-02-16): OAP positions native video element using a computed top inset and a fixed bottom gap so controls do not hug the 512x512 bottom edge.
- 0.2.27 (2026-02-16): OAP video top inset is computed dynamically to align pixel-perfect with the "Select a video" prompt.
- 0.2.26 (2026-02-16): OAP positions the native video player at a fixed top inset so controls sit under the video and do not hug the 512x512 bottom edge.
- 0.2.25 (2026-02-16): OAP uses native video controls and positions the video+controls group with a top inset aligned to the quiz prompt.
- 0.2.23 (2026-02-16): Fix OAP video element placement so it fills the 512x512 area, not the attribution box.
- 0.2.22 (2026-02-16): OAP video buttons now play local .webm files inside the 512x512 video area.
- 0.2.21 (2026-02-16): OAP uses "Select a video:" prompt. OAP video area background matches the right-pane background.
- 0.2.19 (2026-02-16): Make OAP attribution use the same Leaflet-style attribution box styling as NTC.
- 0.2.18 (2026-02-16): Split Content Developer wallet balance for NTC vs OAP. Make geo Parent, Sponsors, Flow rate, Match ratio, and Dev wallet per-content, while Child and Platform remain global. Update OAP flow label text.
- 0.2.17 (2026-02-16): Include OAP in Screen 1 total 'Available for the Child to earn' calculation.
- 0.2.15 (2026-02-16): Fix Screen 1 per-item KBU fields so each content card shows its own Parent, Sponsors, and Available to earn values.
- 0.2.12 (2026-02-16): Fix JS syntax in Screen 1 Educational Content list so cards render again, keep OAP video-screen changes.
- 0.2.13 (2026-02-16): Fix Screen 3 layout regression caused by a broken DOM structure and a stray CSS selector, remove the extra top footer.
- 0.2.14 (2026-02-16): Separate OAP vs NTC account inputs and balances by saving and restoring Parent, Sponsors, flow rate, and match ratio per mode.
- 0.2.10 (2026-02-16): OAP replica now removes score and time, removes maps, and shows a video-watch UI with Watch a video list and Quit back to Educational Content.
- 0.2.9 (2026-02-16): Screen 1, Watch for Optics and Photonics now opens an OAP replica of the Name That Country screen, with separate OAP game-state variables.
- 0.2.9 (2026-02-16): Screen 1, change Optics and Photonics attribution from (Developer) to (Instructor).
- 0.2.9 (2026-02-16): Screen 1, change Optics and Photonics button label from Play to Watch.
- 0.2.6 (2026-02-16): Screen 1, add Optics and Photonics educational content card using cogs.png, Play does nothing, blank-start KBU lines.

- 0.2.2 (2026-01-31): Remove duplicate shortcut icon link to avoid double favicon requests.
- 0.2.1 (2026-01-31): Update favicon links with cache-buster query string.
- 0.2.0 (2026-01-31): Version bump only.

- 0.1.533 (2026-01-31): Add non-integer DPR tile seam masking, stronger low-fraction DPR mask, and post-resize DPR class update burst.
- 0.1.519 (2026-01-31): Move EDU KBU blocks 1 px left.
- 0.1.518 (2026-01-31): Educational Content KBU block header is no longer bold.
- 0.1.517 (2026-01-31): Remove trailing period from redeem toast message.
- 0.1.514 (2026-01-31): Remove tooltip period, unify borders to #ddd, set KBU input borders to #888, and match tooltip background to button.
- 0.1.516 (2026-01-31): Add loading and empty states for EDU and Store lists. Show unified user-facing data load error message in EDU and Store panes.
- 0.1.515 (2026-01-31): Tooltip background matches attribution background.

- 0.1.513 (2026-01-31): Make ⓘ glyph non-bold, match glyph and tooltip colors to the (75%) label, and tighten glyph spacing.

- 0.1.512 (2026-01-31): Match global balance tooltip styling to footer color, and set tooltip rounding to 4px.

- 0.1.511 (2026-01-31): Use ⓘ glyph for global-balance tooltip icon and position tooltip to the right, vertically centered.

- 0.1.510 (2026-01-31): Refine scope tooltip icon to a small circled i, update tooltip text, left align tooltip, remove shadow and bolding, and match tooltip border to mega panes.

- 0.1.509 (2026-01-31): Refine scope tooltips for Child and K-Bucks Platform balances, use superscript (i), and use a custom tooltip with 2 px rounding.

- 0.1.507 (2026-01-30): Add scope tooltips for Child and K-Bucks Platform balances, and add thousands separators to displayed KBU values in store prices.

- 0.1.505 (2026-01-31): Move EDU KBU funds blocks right by 1 px more.

- 0.1.504 (2026-01-31): Move EDU KBU funds blocks right by 1 px.

- 0.1.503 (2026-01-31): Move EDU KBU funds blocks right by 70 px. Apply the indent to the EDU funds block wrappers, since eduFundsCol uses display contents.
- 0.1.502 (2026-01-31): Apply the wallet formatter, min two and up to nine decimals, to all displayed KBU values, including Content Developer and EDU funds blocks. Format Sponsors flow rate with the same precision. Move EDU KBU blocks right by 134 px based on screenshot alignment.

- 0.1.502 (2026-01-31): Apply the wallet formatter, min two and up to nine decimals, to all displayed KBU values, including Content Developer and EDU funds blocks. Format Sponsors flow rate with the same precision. Move EDU KBU blocks right by 134 px based on screenshot alignment.

- 0.1.501 (2026-01-31): Always show at least 2 decimals and up to 9 decimals when needed for spigot flow rate, KBU per hour estimate, and balances. Move EDU funds blocks 100 px further right.

- 0.1.500 (2026-01-31): Spigot flow rate now shows at least 2 decimals. EDU funds blocks: rename Education Sponsors line to Sponsors. Shift EDU funds blocks right to align with the KBU header.

- 0.1.499 (2026-01-30): Revert ratio label and map attribution text. Shorten spigot flow rate label to Parent + Sponsors. Update redemption store available line. Remove global tag from game balance labels.

- 0.1.498 (2026-01-31): UI copy polish. Select an answer, use × in PTT, standardize Sponsors labels, simplify ratio range text, change EDU funds header to KBU, rename Available to Available to earn, and tidy map attribution.

- 0.1.497 (2026-01-31): Label only global balances as KBU balance (global). Keep other balances as KBU balance.

- 0.1.496 (2026-01-31): Add scope hints to KBU balance labels, this content for Parent, Education Sponsors, and Content Developer, global for Child and K-Bucks Platform.

- 0.1.495 (2026-01-31): Rename all account pane labels from KBU deposit and KBU account to KBU balance in both games.

- 0.1.494 (2026-01-31): Rename K-Bucks labels to KBU in both game account panes, adjust match ratio suffix spacing, and update spigot labels.

- 0.1.493 (2026-01-31): Copy polish for practice messages, overlay title, spigot K-Bucks per hour label, and Parent-to-Sponsors match ratio formatting. Replace technical load errors with a user friendly message. Fix storeThumb CSS width and height properties.

- 0.1.492 (2026-01-30): Leaflet tile seam mitigations. Apply mix-blend-mode plus-lighter to Leaflet tiles when devicePixelRatio is non-integer. Heal after wheel zoom settles by invalidating size and redrawing tiles.

- 0.1.491 (2026-01-30): Screen 2, set Plastic Spider Ring brand to Generic. Rename Gift Card to Baskin-Robbins Gift Card and set brand to Baskin-Robbins.

- 0.1.479 (2026-01-29): Screen 2, rename Classic Sheepskin Boots to UGG Classic Boots.

- 0.1.478 (2026-01-29): Screen 2, rename Eraser to STAEDTLER Eraser.

- 0.1.477 (2026-01-29): Screen 2, match redemption item text spacing and alignment to Educational Content. Rename Plastic Vinyl Eraser to Eraser.

- 0.1.476 (2026-01-29): Screen 2, add Brand line under redemption item names. Update item names and brands.
- 0.1.475 (2026-01-29): Screen 2, restore Available-to-redeem header font to match Screen 1. Limit 13px storePrice styling to redemption item prices only.
- 0.1.474 (2026-01-29): Screen 2, Redemption Store item typography matches Educational Content card fonts.
- 0.1.473 (2026-01-29): Screen 2, keep Redemption Store item list full width. Column 2 is collapsed for now.
- 0.1.472 (2026-01-29): Screen 2, Redemption Store uses a two-column grid wrapper, column 2 is empty for now.
- 0.1.397: Add favicon.ico links (cache-busted).
- 0.1.396 (2026-01-28): Spigot padding left 12px to 8px, spigot text gap 8px to 12px.
- 0.1.393 (2026-01-28): NTC attribution flush to map edge (remove Leaflet control margins and corner padding).
- 0.1.396 (2026-01-28): Round NTC attribution box corners to 4px.
- 0.1.392 (2026-01-28): NTC attribution: font size 11, background #f4f4f4, right-aligned to map edge.
- 0.1.392 (2026-01-28): NTC attribution: font size 13, transparent background, centered at bottom.
- 0.1.392 (2026-01-28): NTC attribution: font size 10, right-aligned (not centered), keep square box.
- 0.1.388 (2026-01-28): Leaflet attribution box: remove border, set font size 13, add © Leaflet.
- 0.1.387 (2026-01-28): Style Leaflet attribution to match footer (font, colors, rounded box).
- 0.1.385 (2026-01-28): Column-2 mega pane for NTC + MTN, merged Select-your-answer and bottom controls, removed inter-pane gaps.
- 0.1.384 (2026-01-28): Spigot row, moved 12 px right by padding on the spigot section wrapper.
      - 0.1.383 (2026-01-28): Move spigot image 12px to the right.
      - 0.1.383 (2026-01-28): Mega-pane padding tune: -2px bottom on five non-spigot sections, +5px bottom on spigot section.
      - 0.1.381 (2026-01-28): Reduce spigot bottom padding by ~40px and redistribute +6px bottom padding to each non-spigot section.
      - 0.1.379 (2026-01-28): Mega-pane top-five sections bottom padding +20px for visibility test.
      - 0.1.377 (2026-01-28): Mega-pane spigot flush-left. Add 2px m
      - 0.1.378 (2026-01-28): Mega-pane top-five sections bottom padding +1px.ore bottom padding to top five mega sections.
      - 0.1.376 (2026-01-28): Spigot 52px and closer left. Add 1px more bottom padding to top five mega sections.
      - 0.1.375 (2026-01-28): Add 1px more bottom padding to top five mega sections.
      - 0.1.374 (2026-01-28): Mega-pane spigot larger, add 1px bottom padding to top five mega sections.
- 0.1.373 (2026-01-28): Mega-pane spigot icon larger and text vertically centered. Harmonize Platform section spacing.
- 0.1.372 (2026-01-28): Consolidated accounts pane: hide scrollbars and size to 384x512 content with 1 px border.
- 0.1.372 (2026-01-28): Tighten consolidated accounts pane spacing to remove scrollbar.
- 0.1.370 (2026-01-28): NTC and MTN: Reduce consolidated accounts pane padding to eliminate scrollbar.
- 0.1.370 (2026-01-28): NTC and MTN: Consolidate the accounts column into a single 384x512 pane.
- 0.1.367 (2026-01-28): MTN: Remove #bingoPane padding and border so 514x514 board frame fits without clipping.
- 0.1.366 (2026-01-28): MTN: Fix board edge clipping by removing global bingoPairBtn padding inside the MTN grid.
- 0.1.366 (2026-01-28): MTN: Remove unintended inner offset by anchoring the 512x512 grid to the frame content box.
- 0.1.362 (2026-01-28): Center MTN 512x512 board inside a 514x514 stage so footer position matches other screens.
- 0.1.363 (2026-01-28): MTN: Add a 1px border frame around the 512x512 board so the board area totals 514x514 like NTC.
- 0.1.361 (2026-01-28): Make MTN layout width and height match NTC so the copyright footer does not shift between screens.
- 0.1.360 (2026-01-28): Fix NTC and MTN footer alignment by removing forced footer width and setting per-screen widths.
- 0.1.359 (2026-01-28): Stabilize footer position across screens by removing per-screen width overrides.
- 0.1.358 (2026-01-28): Set copyright top-gap to 8px.
- 0.1.355 (2026-01-28): Set .scoreInline and .acctLine to 13px. Set copyright text to 13px and 6px top-gap.
- 0.1.353 (2026-01-27): Rename multiplication game to "Multiply Two Numbers".
- 0.1.352 (2026-01-27): Rename "Multiply Two Numbers" everywhere (was "Practice Times Tables").
- 0.1.351 (2026-01-27): Educational Content screen order: Name That Country first, Multiply Two Numbers second.
- 0.1.350 (2026-01-27): Align answer bullets so the dot is vertically aligned under the 'S' in 'Select your answer' in both NTC and PTT.
- 0.1.350 (2026-01-27): Unify NTC and PTT "Select your answer" panes styling and layout to match pre-PTT NTC pane.
- 0.1.348 (2026-01-27): PTT header buttons to 15px, ensure AxB label spacing and 13px label font apply (override fixes).
- 0.1.346 (2026-01-27): PTT AxB label: reintroduce spaces as "A × B" and set AxB label font size to 13px.
- 0.1.345 (2026-01-27): PTT grid: set cell size to 44×44 px, keep 2px gaps, add 4px padding each side inside 512×512.
- 0.1.342 (2026-01-27): PTT grid: make all 11×11 board cells exactly 46×46 px by switching to fixed 46px tracks and resizing the board to fit.
- 0.1.341 (2026-01-27): PTT: enforce 14 px on AxB cells and remove spacing around x so it renders as AxB.
- 0.1.340 (2026-01-27): PTT: increase AxB pair button font size to 14px and render labels as "AxB" (no spaces).
- 0.1.339 (2026-01-27): PTT Misses mode: mark answered cells with red or green results like normal mode, and clear the board when the misses loop restarts.
- 0.1.338 (2026-01-27): PTT: highlight the current A x B pair button in orange while the question is being shown.
- 0.1.337 (2026-01-27): Fix PTT blank-start. Hide A x B labels when blank or showing results, prevent text concatenation, and keep current-pair cell unhighlighted.
- 0.1.336 (2026-01-27): PTT reveals. Pair buttons start blank, show "A × B" only for the current question, then replace with the correct result number and keep red or green marking.
- 0.1.334 (2026-01-27): PTT polish. Pair buttons are 12px with visible "A × B" spacing. Current pair highlight is list-gray. Keep header highlights until Next question, then reset headers for the new pair.
- 0.1.332 (2026-01-27): PTT polish. Fix AxB rendering to remove added spacing, set pair font to 14px, restore NTC-matching answer bullet alignment and spacing, and enforce non-interactive board cursor.
- 0.1.330 (2026-01-27): Multiply Two Numbers board polish. Make header cells match pair cell sizing, add top-left X, disable board clicks, restore compact A × B rendering, and highlight row and column headers for the current pair.
- 0.1.331 (2026-01-27): PTT UI polish. Tighten AxB labels to "AxB" style, change corner to lowercase "x", and align answer bullets and row sizing to match NTC.
- 0.1.328 (2026-01-27): Fix PTT answer rendering by restoring bingoPairBtn buttons, and harden NTC answer click handling to prevent runtime crashes.
- 0.1.327 (2026-01-27): Polish Multiply Two Numbers UI to match Name That Country, fix versioning, tighten board cell sizing, and align list and footer styling.
- 0.1.326 (2026-01-27): Multiply Two Numbers screen UI now matches Name That Country layout, with a 512x512 multiplication-board slot and aligned panes.
- 0.1.325 (2026-01-27): Align Educational Content and Redemption Store message-slot behavior, so card start position matches when the message line is empty.
- 0.1.324 (2026-01-27): Educational Content now reserves a one-line message slot under the Available line, matching Redemption Store, so the list starts at the same vertical position.
- 0.1.323 (2026-01-27): Redemption Store list now always starts 10px below the Redeemed line, even when no redeemed message is shown, by reserving a one-line message slot.
- 0.1.322 (2026-01-27): Fix main-pane header spacing so the list starts exactly 10px below the last header line (including Redeemed message) by removing the extra header-block bottom margin.
- 0.1.321 (2026-01-27): Main panes: list now starts 10px below the last header line (Available or Redeemed message) and store list keeps its scrollbar without card size shifting.
- 0.1.320 (2026-01-27): Leaflet minZoom now adapts to the map slot size so you can zoom out to see the full world map, which helps with countries like New Zealand and Fiji.
- 0.1.319 (2026-01-27): Name That Country practice-mode: show Misses in the Progress slot so it lines up with Progress.
- 0.1.318 (2026-01-27): Name That Country practice mode header: align "Misses" to start where "Progress" starts.
- 0.1.317 (2026-01-27): Name That Country header: rename "Practice misses" label to "Misses".
- 0.1.316 (2026-01-27): Remove trailing footer dot. Make edu and store cards match by setting card padding top and bottom to 8 px.
- 0.1.314 (2026-01-27): Set all content and store thumbs to 144 px. Restore the canonical demo footer text on all screens.
- 0.1.312 (2026-01-27): Unify Screen 1 and Screen 2 list spacing. Match Screen 2 for top offset below the 'Available' line and for card-to-card spacing.
- 0.1.313 (2026-01-27): Reduce Screen 1 and Screen 2 card list gap from 8 px to 4 px.
- 0.1.311 (2026-01-27): Screen 1: match Screen 2 header and list spacing so first content card aligns consistently below the 'Available' line.
- 0.1.308 (2026-01-27): Screen 2: align first redemption item border with Screen 1 by removing the extra header bottom margin.
      - 0.1.309 (2026-01-27): Screen 2: match Screen 1 header spacing by removing default paragraph margins on the redeem balance line.
- 0.1.307 (2026-01-27): Screen 2: restore internal store list scrollbar, align list top to 10px below header and keep 10px gap above the bottom button. Footer: remove the extra best-viewed text.
- 0.1.306 (2026-01-27): Screen 2: Mirror Screen 1 list spacing so the store list starts 10px below the redeem balance line and ends 10px above the bottom button, while keeping scrolling enabled.
- 0.1.305 (2026-01-27): Screen 1: Ensure the first content card border starts 10px below the earn line by hiding the empty #eduPaneMessage spacer and tightening Screen 1 spacing, while keeping scrolling enabled.
- 0.1.302 (2026-01-26): Resize Screen 2 Redemption Store white pane (#redeemPane) to 1166x514 with 10px 10px padding to match Screen 1 and NTC footprint.
- 0.1.301 (2026-01-26): Make the Misses-style button formatting apply to all buttons automatically via CSS (button:not(.ansBtn)), so dynamically generated Play and Redeem buttons get the same size.
- 0.1.300 (2026-01-26): Standardize non-answer buttons across all screens using a global .kbBtn style based on the NTC Misses button. Keep NTC answer rows (.ansBtn) unchanged.
- 0.1.299 (2026-01-26): Screen 1: set Educational Content pane padding to 10px 10px to match NTC pane padding.
- 0.1.298 (2026-01-26): Resize Screen 1 Educational Content white pane to 1166x514 to match NTC (map-to-parent width and map height).
- 0.1.297 (2026-01-26): Pin the NTC footer under the map using DOM-measured positioning (transform) to remove the persistent bottom gap.
- 0.1.296 (2026-01-26): Fix the large blank gap above the footer in NTC by locking the grid row height to --ntcMapSize with a final CSS override.
- 0.1.295 (2026-01-26): In NTC, tie the layout height (--kb-main-h) to the map pane size (--ntcMapSize) so the footer sits close to the map instead of leaving a tall blank area.
- 0.1.294 (2026-01-26): Restore the original Progress-to-map spacing behavior and set the footer-to-map spacing to 10px to match the 0.1.284 look.
- 0.1.293 (2026-01-26): Fix footer spacing not applying by adding a final #screenGame .copyrightLine override that sets margin-top (matches header spacing) and prevents later .copyrightLine rules from overriding it.
- 0.1.292 (2026-01-26): Make footer gap match the current header spacing by setting .copyrightLine margin-top to calc(20px + --ntcHeaderExtraPad). Disable the JS footer-gap experiment.
- 0.1.290 (2026-01-26): Fix JS syntax in footer gap sync (remove stray brace) and keep sync applied to the visible footer.
- 0.1.289 (2026-01-26): Fix footer gap sync by applying the measured gap to the visible footer element (there are multiple footer nodes in the DOM).
- 0.1.288 (2026-01-26): Make footer-to-map spacing match Progress-to-map spacing by measuring the actual gap and applying it to the footer on load and resize.
- 0.1.287 (2026-01-26): Increase footer-to-map spacing to visually match the Progress-to-map gap by adding --ntcFooterMatchPad (14px).
- 0.1.286 (2026-01-26): Match footer-to-map spacing to header-to-map spacing by replacing fixed header height with padding and tying footer margin to the same value.
- 0.1.285 (2026-01-26): Increase footer spacing by setting .copyrightLine margin-top to 10px.
- 0.1.284 (2026-01-26): Simplify footer by removing the legacy best-viewed note. Center footer within NTC layout width.
- 0.1.283 (2026-01-26): Set quiz header margin-bottom to 6px and answers padding-bottom to 6px.
- 0.1.282 (2026-01-26): Restore NTC answer line-height to 1.3 (button and label) to prevent descender clipping.
- 0.1.281 (2026-01-26): Set quiz header margin-bottom to 8px and answers padding-bottom to 8px.
- 0.1.280 (2026-01-26): Reduce NTC answer line-height to 1.25 (button and label) for tighter vertical spacing.
- 0.1.279 (2026-01-26): Adjust NTC quiz spacing by reducing header margin and adding bottom padding to the answers list.
- 0.1.278 (2026-01-26): Use min-height 34px and padding 0px 10px for NTC answer rows for stable height without extra vertical padding.
- 0.1.277 (2026-01-26): Adjust NTC answer row padding to 10px 10px.
- 0.1.276 (2026-01-26): Adjust NTC answer row padding to 0px 10px for tightest vertical spacing.
- 0.1.275 (2026-01-26): Adjust NTC answer row padding to 4px 10px for tighter vertical spacing.
- 0.1.274 (2026-01-26): Set NTC answer line-height to 1.3 (button and label) to prevent descender clipping.
- 0.1.273 (2026-01-26): Set NTC answer option rows (#screenGame .ansBtn) min-height to 34px to prevent descender clipping.
- 0.1.272 (2026-01-26): Bump version to match the file-name version suffix guardrail.
- 0.1.271 (2026-01-26): Make Education Sponsors pane absorb zoom rounding by flex-growing, remove visible breathing gap.
- 0.1.270 (2026-01-26): Remove visible 1fr spacer gap in NTC column 3, instead anchor top and bottom using flex and let spacing below spigot absorb rounding.
- 0.1.269 (2026-01-26): Lock NTC column 3 top and bottom to map using grid with a 1fr spacer row, fix footer version.
- 0.1.268 (2026-01-26): In NTC, set the game grid row to 1fr and lock the grid height to the map size so column 3 stays top and bottom aligned when browser zoom changes.
- 0.1.260 (2026-01-26): In NTC, set column 2 and 3 pane padding to 10px on all sides for a layout comparison.
- 0.1.259 (2026-01-26): In NTC, set column 2 and 3 pane padding to 12px on all sides for a layout comparison.
- 0.1.257 (2026-01-27): Fix NTC column overlap by locking left side column width to 258px and preventing overflow.
- 0.1.253 (2026-01-27): Lock NTC grid, restore bullet sizing and dot alignment, set global padding to 8px.
      - 0.1.235 (2026-01-24): Fix missing kbHealTiles wrapper and sync redemption store manifest expected hash.
      - 0.1.234 (2026-01-23): Add GA4 telemetry hooks (games, questions, rewards, redemptions) and persistent anonymous user ID.
      - 0.1.233 (2026-01-22): Update footer text across screens to 2025-2026 range, include viewing recommendation, and bump version.
      - 0.1.231 (2026-01-17): Reduce Leaflet tile seam artifacts and make footer version updates consistent across screens.
      - 0.1.226 (2026-01-17): Rename browser tab title to 'K-Bucks Demo'.
      - 0.1.225 (2025-12-27): Screen 2 wording, 'Available to Redeem' -> 'Available to redeem'.
      - 0.1.224 (2025-12-27): Restore Leaflet zoomSnap 0.2, zoomDelta 0.2, minZoom 2.2, and setView zoom 2.2. Fix footer version placeholders.
      - 0.1.223 (2025-12-27): Screen 1 wording, 'Child can earn' -> 'Available for the Child to earn'.
      - 0.1.222 (2025-12-27): Add K-Bucks/Hour (estimate) to Multiply Two Numbers spigot, keep version fields consistent.
      - 0.1.221 (2025-12-27): Restore Leaflet zoomSnap 0.2, zoomDelta 0.2, minZoom 2.2.
