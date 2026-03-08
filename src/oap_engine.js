// ======================================
// K-BUCKS DEMO
// Module: oap_engine
// Responsibility: Optics and Photonics watch engine — video timer, flow application, video list
// Exports: window.KB_OAP
// ======================================
;(function () {

  // ---- Video element and event helpers ----

  function kbOapGetVideoEl() {
    try { return document.getElementById("oapVideo") } catch (e) { return null }
  }

  function kbOapHookVideoEventsOnce(v) {
    if (!v) return
    if (v.__kbOapHooked) return
    v.__kbOapHooked = true

    const sync = () => { try { kbOapSyncLastVideoTime() } catch (e) {} }

    v.addEventListener("playing", sync)
    v.addEventListener("pause", sync)
    v.addEventListener("seeking", sync)
    v.addEventListener("seeked", sync)
    v.addEventListener("ended", sync)
  }

  function kbOapAttachVideoMetaListener() {
    const v = document.getElementById("oapVideo")
    if (!v) return
    v.addEventListener("loadedmetadata", () => { kbScheduleOapVideoInsetSync(); kbOapSyncVideoTopInset(); })
    v.addEventListener("canplay", () => { kbScheduleOapVideoInsetSync(); kbOapSyncVideoTopInset(); })
  }

  function kbOapSyncLastVideoTime() {
    const v = kbOapGetVideoEl()
    if (!v) return
    const t = Number(v.currentTime || 0)
    kbOapLastVideoTimeSec = isFinite(t) ? t : 0
  }

  function kbOapStopVideoPlayback() {
    try {
      const v = document.getElementById("oapVideo")
      if (v) {
        v.pause()
        try { v.currentTime = 0 } catch (e) {}
        kbOapWasPlayingBeforeBlur = false
        kbOapLastVideoTimeSec = 0
      }
    } catch (e) {}
  }

  // ---- Window activity and focus helpers ----

  function kbOapIsWindowActive() {
    // Treat "hidden" as inactive. hasFocus() is unreliable across browsers and devtools.
    try { return !document.hidden } catch (e) { return true }
  }

  function kbOapMaybePauseForInactivity() {
    const v = kbOapGetVideoEl()
    if (!v) return
    if (!kbOapIsWindowActive() && !v.paused) {
      kbOapWasPlayingBeforeBlur = true
      try { v.pause() } catch (e) {}
    }
  }

  function kbOapMaybeResumeAfterFocus() {
    const v = kbOapGetVideoEl()
    if (!v) return
    // Only auto resume if we paused due to inactivity, and a source is loaded.
    if (kbOapWasPlayingBeforeBlur && kbOapIsWindowActive()) {
      kbOapWasPlayingBeforeBlur = false
      try {
        const p = v.play()
        if (p && typeof p.catch === "function") p.catch(() => {})
      } catch (e) {}
    }
  }

  // ---- Progress and payout helpers ----

  function kbOapClampProgress() {
    try {
      kbOapProgressMs = Math.max(0, kbOapProgressMs || 0)
    } catch (e) {}
  }

  function kbOapApplyPeriodicFlow() {
    try {
      if (kbGeoActiveKey !== "oap") return
      if (mode !== "normal") return

      const everyMs = KB_OAP_FLOW_EVERY_MS
      const progMs = Number(kbOapProgressMs) || 0
      const baseMs = (Number(kbOapLastFlowProgressMs) || 0)

      // Only pay out when we have crossed one or more whole intervals.
      const diffMs = progMs - baseMs
      if (!Number.isFinite(diffMs) || diffMs < everyMs) return

      let ticks = Math.floor(diffMs / everyMs)
      if (!Number.isFinite(ticks) || ticks <= 0) return

      // Move the watermark forward by whole ticks. Any remainder stays for the next call.
      kbOapLastFlowProgressMs = baseMs + ticks * everyMs

      let tickIndex = 0

      const kbOapToKbu = (u) => {
        const n = Number(u) || 0
        return n > 0 ? (n / SCALE) : 0
      }

      // FlowU for OAP is KBU/hour (in internal units). Convert to "per interval" amount.
      // Use truncation (no rounding) to keep behavior predictable.
      const m = Number(sponsorMatch)

      let anyMoved = false

      while (ticks > 0) {
        ticks -= 1
        tickIndex += 1
        const tickMs = baseMs + tickIndex * everyMs

        // Default is "no payout" for this tick. We still emit telemetry per requirements.
        let parentPayU = 0
        let sponsorPayU = 0

        // If the Parent wallet is empty, force Parent flow rate to 0 immediately, but keep emitting zero-payout ticks.
        if (parentU <= 0) {
          parentU = 0
          flowU = 0
        }

        // Compute per-tick payout only when flow is positive and Parent has funds.
        if (parentU > 0 && (Number(flowU) || 0) > 0) {
          // flowU is KBU/hour (internal units). Convert to "per interval" amount in KBU-space, then back to units.
          const wantParentPayU = Math.floor(((Number(flowU) || 0) / SCALE) * (everyMs / 3600000) * SCALE)
          parentPayU = wantParentPayU > 0 ? Math.min(wantParentPayU, parentU) : 0

          if (parentPayU > 0 && Number.isFinite(m) && m > 0 && sponsorU > 0) {
            const wantSponsorPayU = Math.floor(Number(parentPayU) / m)
            if (wantSponsorPayU > 0) sponsorPayU = Math.min(wantSponsorPayU, sponsorU)
          }
        }

        const totalPayU = parentPayU + sponsorPayU

        // Emit kb_answer for every tick, even if there is no payout.
        try {
          if (window.KB_TELEMETRY) {
            window.KB_TELEMETRY.event("kb_answer", {
              kb_game: "optics_and_photonics",
              kb_mode: "normal",
              kb_correct: totalPayU > 0 ? 1 : 0,
              kb_round: formatTimeHMS(tickMs),
              kb_bullet: kbOapGetSelectedBulletText(),
              kb_total_pay_kbu: totalPayU > 0 ? kbOapToKbu(totalPayU) : 0,
              kb_parent_pay_kbu: parentPayU > 0 ? kbOapToKbu(parentPayU) : 0,
              kb_sponsor_pay_kbu: sponsorPayU > 0 ? kbOapToKbu(sponsorPayU) : 0
            })
          }
        } catch (e) {}

        if (totalPayU <= 0) continue

        // Split: 75% child, 12.5% content developer, 12.5% platform.
        // Use carry remainders (denominator 8) to avoid systematic rounding bias.
        const devNumer = totalPayU + devCarry
        const platNumer = totalPayU + platCarry

        const devAdd = Math.floor(devNumer / 8)
        const platAdd = Math.floor(platNumer / 8)

        devCarry = devNumer % 8
        platCarry = platNumer % 8

        const childAdd = totalPayU - devAdd - platAdd

        parentU -= parentPayU
        sponsorU -= sponsorPayU

        kbGlobalChildU += childAdd
        devU += devAdd
        kbGlobalPlatformU += platAdd

        anyMoved = true

        // If the Parent wallet is now empty, force flow to 0 right away.
        if (parentU <= 0) {
          parentU = 0
          flowU = 0
        }
        if (sponsorU < 0) sponsorU = 0
      }

      if (anyMoved) {
        try { kbGeoSaveState() } catch (e) {}
        saveWallet()
        clampFlowRate()
        updateAccounts()
      }
    } catch (e) {}
  }

  function kbOapWatchTick() {
    try {
      if (kbGeoActiveKey !== "oap") return
      const v = kbOapGetVideoEl()
      if (!v) return

      // Anti-cheating. Do not allow playback while inactive.
      kbOapMaybePauseForInactivity()

      const curSecRaw = Number(v.currentTime || 0)
      const curSec = isFinite(curSecRaw) ? curSecRaw : 0
      const prevSec = isFinite(kbOapLastVideoTimeSec) ? kbOapLastVideoTimeSec : curSec

      // Only count watch time when the video is actually playing and the page is active.
      if (!v.paused && !v.ended && kbOapIsWindowActive()) {
        const dSec = curSec - prevSec

        // Count only forward playback deltas, ignore seeks and large jumps.
        if (dSec > 0 && dSec <= 1.5) {
          kbOapProgressMs = (kbOapProgressMs || 0) + dSec * 1000
          kbOapClampProgress()
          try { updateScoreDisplay() } catch (e) {}
          try { kbOapApplyPeriodicFlow() } catch (e) {}
        }
      }

      kbOapLastVideoTimeSec = curSec
    } catch (e) {}
  }

  // ---- Video list and answer selection ----

  function kbOapGetSelectedBulletText() {
    try {
      if (kbOapSelectedBulletText && String(kbOapSelectedBulletText).trim()) return String(kbOapSelectedBulletText).trim()
      // Fallback based on selected key
      const k = String(kbGeoSelectedVideoKey || "")
      if (k === "fiber") return "Fiber optic cables 5:35"
      if (k === "laser") return "How a laser works 4:52"
      return ""
    } catch (e) { return "" }
  }

  function kbRenderOapVideoList() {
    if (kbGeoActiveKey !== "oap") return
    const answersEl = document.getElementById("answers")
    if (!answersEl) return

    answersEl.innerHTML = ""
    const items = [
      { key: "fiber", displayName: "Fiber optic cables 5:35" },
      { key: "laser", displayName: "How a laser works 4:52" },
    ]

    kbOapSetVideoSrcByKey(kbGeoSelectedVideoKey || "")

    for (const opt of items) {
      const li = document.createElement("li")
      const btn = document.createElement("button")
      btn.className = "ansBtn"
      btn.type = "button"

      const bullet = document.createElement("span")
      bullet.className = "bullet"
      bullet.textContent = "•"

      const label = document.createElement("span")
      label.className = "label"
      label.textContent = opt.displayName

      const mark = document.createElement("span")
      mark.className = "mark"
      mark.textContent = ""

      btn.appendChild(bullet)
      btn.appendChild(label)
      btn.appendChild(mark)

      if (kbGeoSelectedVideoKey === opt.key) {
        btn.classList.add("kbOapSelected")
        mark.textContent = "✓"

        try { kbOapSelectedBulletText = opt.displayName } catch (e) {}
      }

      btn.addEventListener("click", () => {
        if (kbGeoActiveKey !== "oap") return
        kbGeoSelectedVideoKey = opt.key
        try { kbOapSelectedBulletText = opt.displayName } catch (e) {}
        const all = Array.from(document.querySelectorAll("#quizPane .ansBtn"))
        for (const b of all) {
          b.classList.remove("kbOapSelected")
          const m = b.querySelector(".mark")
          if (m) m.textContent = ""
        }
        btn.classList.add("kbOapSelected")
        const myMark = btn.querySelector(".mark")
        if (myMark) myMark.textContent = "✓"
        kbGeoSaveState()
        kbOapSetVideoSrcByKey(kbGeoSelectedVideoKey)
        setTimeout(() => kbOapSyncVideoTopInset(), 0)

        const msgEl = document.getElementById("message")
        if (msgEl) msgEl.textContent = ""
      })

      li.appendChild(btn)
      answersEl.appendChild(li)
    }

    const msgEl = document.getElementById("message")
    if (msgEl) msgEl.textContent = ""
  }

  // ---- OAP entry points ----

  function kbOapResetOnEnter() {
    // Reset OAP progress numerator and UI selection like "New game" state.
    try { kbOapProgressMs = 0 } catch (e) {}
    try { kbOapStopVideoPlayback() } catch (e) {}
    try { kbOapClearSelectedVideo() } catch (e) {}
    try { kbOapWasPlayingBeforeBlur = false } catch (e) {}
    try { kbOapLastVideoTimeSec = 0 } catch (e) {}
    try { kbOapLastTickTs = 0 } catch (e) {}
    try { kbOapLastFlowProgressMs = 0 } catch (e) {}
  }

  function kbOapInitWatchTimer() {
    if (kbOapTickTimer) return
    kbOapTickTimer = setInterval(kbOapWatchTick, 250)

    // Keep tick baseline correct when playback state changes.
    document.addEventListener("play", (ev) => {
      try {
        if (kbGeoActiveKey !== "oap") return
        const v = kbOapGetVideoEl()
        if (!v) return
        if (ev.target !== v) return
        kbOapLastTickTs = performance.now()
      } catch (e) {}
    }, true)

    document.addEventListener("pause", (ev) => {
      try {
        const v = kbOapGetVideoEl()
        if (!v) return
        if (ev.target !== v) return
        kbOapLastTickTs = performance.now()
      } catch (e) {}
    }, true)

    document.addEventListener("timeupdate", (ev) => {
      try {
        if (kbGeoActiveKey !== "oap") return
        const v = kbOapGetVideoEl()
        if (!v) return
        if (ev.target !== v) return
        if (v.paused || v.ended) { kbOapLastVideoTimeSec = Number(v.currentTime || 0) || 0; return }
        if (!kbOapIsWindowActive()) return

        const cur = Number(v.currentTime || 0) || 0
        const prev = Number(kbOapLastVideoTimeSec || 0) || 0
        const dMs = (cur - prev) * 1000
        // Count only small forward progress, ignore seeks and jumps.
        if (dMs > 0 && dMs <= 1500) {
          kbOapProgressMs = (kbOapProgressMs || 0) + dMs
          kbOapClampProgress()
          try { updateScoreDisplay() } catch (e) {}
          try { kbOapApplyPeriodicFlow() } catch (e) {}
        }
        kbOapLastVideoTimeSec = cur
        kbOapLastTickTs = performance.now()
      } catch (e) {}
    }, true)

    document.addEventListener("seeking", (ev) => {
      try {
        const v = kbOapGetVideoEl()
        if (!v) return
        if (ev.target !== v) return
        kbOapLastTickTs = performance.now()
      } catch (e) {}
    }, true)

    document.addEventListener("ended", (ev) => {
      try {
        const v = kbOapGetVideoEl()
        if (!v) return
        if (ev.target !== v) return
        kbOapLastTickTs = performance.now()
      } catch (e) {}
    }, true)

    // Pause when tab becomes hidden, resume when visible again.
    document.addEventListener("visibilitychange", () => {
      try {
        const v = kbOapGetVideoEl()
        if (!v) return
        if (kbGeoActiveKey !== "oap") return
        if (document.hidden) {
          if (!v.paused) kbOapWasPlayingBeforeBlur = true
          try { v.pause() } catch (e) {}
        } else {
          kbOapMaybeResumeAfterFocus()
          kbOapSyncLastVideoTime()
        }
      } catch (e) {}
    })

    window.addEventListener("blur", () => {
      try {
        if (kbGeoActiveKey !== "oap") return
        const v = kbOapGetVideoEl()
        if (!v) return
        if (!v.paused) kbOapWasPlayingBeforeBlur = true
        try { v.pause() } catch (e) {}
      } catch (e) {}
    })

    window.addEventListener("focus", () => {
      try {
        if (kbGeoActiveKey !== "oap") return
        kbOapMaybeResumeAfterFocus()
        kbOapSyncLastVideoTime()
      } catch (e) {}
    })
  }

  window.KB_OAP = {
    kbOapAttachVideoMetaListener,
    kbOapStopVideoPlayback,
    kbOapResetOnEnter,
    kbOapIsWindowActive,
    kbOapHookVideoEventsOnce,
    kbOapGetVideoEl,
    kbOapClampProgress,
    kbOapSyncLastVideoTime,
    kbOapMaybePauseForInactivity,
    kbOapMaybeResumeAfterFocus,
    kbOapApplyPeriodicFlow,
    kbOapWatchTick,
    kbOapInitWatchTimer,
    kbOapGetSelectedBulletText,
    kbRenderOapVideoList,
  }

})()
