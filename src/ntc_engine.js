// ======================================
// K-BUCKS DEMO
// Module: ntc_engine
// Responsibility: Name That Country gameplay engine — map, timer, scoring, country loader
// Exports: window.KB_NTC
// ======================================
;(function () {

  // Show countries slightly smaller than a tight fit. Fractional zoom remains enabled.
  function kbZoomOutAfterNextMoveEnd(targetMap, delta) {
    try {
      if (!targetMap || !Number.isFinite(delta) || delta <= 0) return
      targetMap.once("moveend", () => {
        try {
          const z = targetMap.getZoom()
          if (!Number.isFinite(z)) return
          targetMap.setZoom(z - delta, { animate: false })
        } catch (e) {}
      })
    } catch (e) {}
  }

  function kbMapState() {
    const rect = mapDiv ? mapDiv.getBoundingClientRect() : { width: 0, height: 0 }
    let size = { x: 0, y: 0 }
    let center = null
    let zoom = null
    try { size = map.getSize() } catch (e) {}
    try { center = map.getCenter() } catch (e) {}
    try { zoom = map.getZoom() } catch (e) {}
    return {
      screen: (typeof currentScreen !== "undefined") ? currentScreen : "unknown",
      mapRect: { w: Math.round(rect.width), h: Math.round(rect.height) },
      mapOffset: { w: mapDiv ? mapDiv.offsetWidth : 0, h: mapDiv ? mapDiv.offsetHeight : 0 },
      leafletSize: { x: size.x, y: size.y },
      center: center ? { lat: +center.lat.toFixed(5), lng: +center.lng.toFixed(5) } : null,
      zoom: zoom
    }
  }

  function kbNormalizeMapView(reason) {
    if (!map || !map.getCenter) return false
    let c = null
    try { c = map.getCenter() } catch (e) {}
    if (!c) return false

    const bad = (Math.abs(c.lat) > 80) || (Math.abs(c.lng) > 180) || (!isFinite(c.lat)) || (!isFinite(c.lng))
    if (!bad) return false

    try { kbDbg("normalizeMapView", { reason: reason, before: kbMapState() }) } catch (e) {}
    try { if (map.stop) map.stop() } catch (e) {}
    try { map.setView([20, 0], 2.2, { animate: false }) } catch (e) {}
    try { if (map.invalidateSize) map.invalidateSize({ animate: false, pan: false }) } catch (e) {}
    try { kbDbg("normalizeMapView done", { reason: reason, after: kbMapState() }) } catch (e) {}
    return true
  }

  function pad2(n) {
    return String(n).padStart(2, "0")
  }

  function formatTimeHMS(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const hh = String(hours).padStart(2, "0")
    return hh + ":" + pad2(minutes) + ":" + pad2(seconds)
  }

  function formatTimeMSS(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return String(minutes) + ":" + pad2(seconds)
  }

  function setTimerVisible(visible) {
    if (!timerEl) return
    timerEl.style.display = visible ? "" : "none"
  }

  function renderTimer() {
    if (!timerEl) return
    const ms = timerElapsedMs + (timerRunning ? (Date.now() - timerStartMs) : 0)
    timerEl.textContent = "Time: " + formatTimeHMS(ms)
  }

  function startTimer() {
    if (timerStopped) return
    if (mode !== "normal") return
    if (timerRunning) return
    timerRunning = true
    timerStartMs = Date.now()
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = setInterval(renderTimer, 1000)
    renderTimer()
  }

  function pauseTimer() {
    if (!timerRunning) {
      renderTimer()
      return
    }
    timerElapsedMs += Date.now() - timerStartMs
    timerRunning = false
    timerStartMs = 0
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = null
    renderTimer()
  }

  function stopTimer() {
    pauseTimer()
    timerStopped = true
  }

  function resetAndStartTimer() {
    timerElapsedMs = 0
    timerStopped = false
    timerRunning = false
    timerStartMs = 0
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = null
    renderTimer()
    startTimer()
  }

  function pick(obj, keys) {
    for (const k of keys) {
      if (obj && obj[k] != null && String(obj[k]).trim() !== "") return obj[k]
    }
    return null
  }

  function normNameKey(s) {
    return String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9 ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }

  const NAME_ALIAS_TO_CANON = new Map([
    ["united states of america", "united states"],
    ["russian federation", "russia"],
    ["iran islamic republic of", "iran"],
    ["venezuela bolivarian republic of", "venezuela"],
    ["bolivia plurinational state of", "bolivia"],
    ["tanzania united republic of", "tanzania"],
    ["lao people s democratic republic", "laos"],
    ["viet nam", "vietnam"],
    ["syrian arab republic", "syria"],
    ["moldova republic of", "moldova"],
    ["korea republic of", "south korea"],
    ["korea democratic people s republic of", "north korea"],
    ["czech republic", "czechia"],
    ["cote d ivoire", "cote divoire"],
    ["congo", "republic of the congo"],
    ["congo democratic republic of the", "democratic republic of the congo"],
    ["myanmar burma", "myanmar"],
    ["brunei darussalam", "brunei"],
    ["timor leste", "east timor"],
    ["macedonia", "north macedonia"],
    ["swaziland", "eswatini"],
    ["cape verde", "cabo verde"],
    ["the bahamas", "bahamas"],
    ["turkiye", "turkey"],
    ["türkiye", "turkey"]
  ])

  function canon(name) {
    const n = normNameKey(name)
    return NAME_ALIAS_TO_CANON.get(n) || n
  }

  function getISO2(props) {
    return pick(props, ["ISO3166-1-Alpha-2", "ISO_A2", "iso_a2", "iso2", "ISO2", "alpha2", "alpha-2", "cca2", "id"])
  }

  function getISO3(props) {
    return pick(props, ["ISO3166-1-Alpha-3", "ISO_A3", "iso_a3", "ADM0_A3", "adm0_a3", "iso3", "ISO3", "alpha3", "alpha-3", "cca3"])
  }

  function geoName(props) {
    if (!props) return null
    return pick(props, [
      "ADMIN", "admin",
      "NAME", "name",
      "NAME_EN", "name_en",
      "SOVEREIGNT", "sovereignt",
      "COUNTRY", "country",
      "Country"
    ])
  }

  function shuffle(arr) {
    const a = arr.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const t = a[i]
      a[i] = a[j]
      a[j] = t
    }
    return a
  }

  function pickNOther(n, excludeKey) {
    const pool = countries.filter(c => c.key !== excludeKey)
    return shuffle(pool).slice(0, n)
  }

  function buildPracticeDeck() {
    const arr = []
    for (const k of misses) {
      const c = countryByKey.get(k)
      if (c) arr.push(c)
    }
    deck = shuffle(arr)
    deckIndex = 0
  }

  function clearMapLayer() {
    try {
      const fbuf = (typeof kbGetFrontBuffer === "function") ? kbGetFrontBuffer() : null
      if (fbuf && fbuf.map === map) {
        try { kbClearLayerOn(fbuf) } catch (e) {}
        try { currentLayer = null } catch (e) {}
        return
      }
    } catch (e) {}

    if (currentLayer) {
      try { map.removeLayer(currentLayer) } catch (e) {}
      currentLayer = null
    }
  }

  function setCountryOnMap(feature) {
    clearMapLayer()
    try {
      const nm = feature && feature.properties ? (feature.properties.name || feature.properties.ADMIN || feature.properties.admin || feature.properties.NAME || "") : ""
      kbDbg("setCountryOnMap", { name: nm, now: kbMapState() })
    } catch (e) {}

    currentLayer = L.geoJSON(feature, { style: ORANGE_STYLE }).addTo(map)
    currentLayer.bringToFront()

    try {
      const fbuf = (typeof kbGetFrontBuffer === "function") ? kbGetFrontBuffer() : null
      if (fbuf && fbuf.map === map) fbuf.currentLayer = currentLayer
    } catch (e) {}

    const b = currentLayer.getBounds()
    if (!b || !b.isValid()) return

    // If the map is hidden (for example, the redemption store is open), defer fitBounds
    if (mapDiv && (mapDiv.offsetWidth === 0 || mapDiv.offsetHeight === 0)) {
      pendingBounds = b
      try { kbDbg("setCountryOnMap defer pendingBounds", kbMapState()) } catch (e) {}
      return
    }
    pendingBounds = null

    const size = map.getSize()
    const padY = Math.round(size.y * 0.25)
    const padX = Math.round(size.x * 0.10)

    try {
      kbDbg("setCountryOnMap fitBounds", {
        now: kbMapState(),
        padX: padX,
        padY: padY,
        bounds: (function(){ try { const sw = b.getSouthWest(); const ne = b.getNorthEast(); return { sw: { lat:+sw.lat.toFixed(5), lng:+sw.lng.toFixed(5) }, ne: { lat:+ne.lat.toFixed(5), lng:+ne.lng.toFixed(5) } } } catch(e){ return null } })()
      })
    } catch (e) {}
    try { kbZoomOutAfterNextMoveEnd(map, KB_ZOOM_OUT_AFTER_FIT) } catch (e) {}
    map.fitBounds(b, {
      paddingTopLeft: [padX, padY],
      paddingBottomRight: [padX, padY],
      maxZoom: 13,
      animate: false
    })
    try { setTimeout(() => kbHealTiles("afterFitBounds"), 0) } catch (e) {}
  }

  function kbClearLayerOn(buf) {
    try {
      if (buf && buf.map && buf.currentLayer) {
        buf.map.removeLayer(buf.currentLayer)
      }
    } catch (e) {}
    try { if (buf) buf.currentLayer = null } catch (e) {}
  }

  function formatScorePctInt(correct, total) {
    if (!total || total <= 0) return ""
    const pct = (correct / total) * 100
    const pctInt = Math.round(pct)
    return " (" + String(pctInt) + "%)"
  }

  function formatScorePct(correct, total) {
    if (!total || total <= 0) return ""
    const pct = (correct / total) * 100
    const pct1 = Math.round(pct * 10) / 10
    const pctStr = (pct1 % 1 === 0) ? String(Math.round(pct1)) : String(pct1)
    return " (" + pctStr + "%)"
  }

  function updateScoreDisplay(finalMode) {
    if (progressEl) progressEl.classList.remove("kbFlexBreak")
    const total = (deck && deck.length) ? deck.length : (countries && countries.length ? countries.length : 0)

    if (mode === "practice") {
      setTimerVisible(false)
      if (progressEl) progressEl.classList.remove("kbFlexBreak")
      const b = total
      const a = Math.min(Math.max(deckIndex || 0, 0), b)
      if (progressEl) progressEl.textContent = "Misses: " + a + "/" + b
      if (statusEl) statusEl.textContent = ""
      return
    }
    if (kbGeoActiveKey === "oap") {
      setTimerVisible(false)
      if (timerEl) timerEl.textContent = ""
      if (statusEl) statusEl.textContent = ""
      if (progressEl) {
        const a = Math.max(0, Math.floor(kbOapProgressMs || 0))
        const b = Math.max(0, Math.floor(kbOapTotalMs || 0))
        progressEl.textContent = "Total watch time: " + formatTimeMSS(a) + "/" + formatTimeMSS(b) + formatScorePctInt(a, b)
      }
      return
    }

    setTimerVisible(true)

    if (progressEl) {
      const shown = Math.min(Math.max(rounds || 0, 0), total)
      if (kbGeoActiveKey === "oap") {
        progressEl.textContent = "Progress: " + formatTimeHMS(kbOapProgressMs) + "/" + formatTimeHMS(kbOapTotalMs) + formatScorePct(kbOapProgressMs, kbOapTotalMs)
      } else {
        progressEl.textContent = "Progress: " + shown + "/" + total + formatScorePct(shown, total)
      }
    }

    if (finalMode) {
      statusEl.textContent = "Final score: " + correctCount + "/" + rounds + formatScorePct(correctCount, rounds)
      return
    }

    if (rounds <= 0) {
      statusEl.textContent = "Score: 0/0 (0%)"
      return
    }

    statusEl.textContent = "Score: " + correctCount + "/" + rounds + formatScorePct(correctCount, rounds)
  }

  function syncMapHeight() {
    if (!mapDiv) return
    const slot = mapSlotEl || document.getElementById("mapSlot")
    const h = slot ? slot.clientHeight : (sideEl ? sideEl.offsetHeight : 0)
    try { kbDbg("syncMapHeight h", { h: h, now: kbMapState() }) } catch (e) {}
    if (!h || h <= 0) return

    const desired = h + "px"
    const seq = (map && map._kbSeq) ? map._kbSeq : 0
    const forceForNewMap = seq && window.kbLastSyncMapSeq !== seq

    if (window.kbLastSyncMapH === desired && !forceForNewMap) return
    window.kbLastSyncMapH = desired
    if (seq) window.kbLastSyncMapSeq = seq

    mapDiv.style.height = desired

    try {
      if (map && map.invalidateSize) {
        try { map.invalidateSize({ animate: false, pan: false }) } catch (e) { map.invalidateSize() }
      }
    } catch (e) {}
    try {
      const backBuf = kbGetBackBuffer()
      if (backBuf && backBuf.map && backBuf.map.invalidateSize) {
        try { backBuf.map.invalidateSize({ animate: false, pan: false }) } catch (e) { backBuf.map.invalidateSize() }
      }
    } catch (e) {}
    try { kbDbg("syncMapHeight invalidateSize", kbMapState()) } catch (e) {}
  }

  function resetUIForNewQuestion() {
    answersEl.innerHTML = ""
    if (messageEl) messageEl.textContent = ""
    nextBtn.disabled = true
    locked = false
    try { kbUpdateNextBtnEnabled() } catch (e) {}
  }

  function kbUpdateNextBtnEnabled() {
    if (!nextBtn) return
    // Next question is enabled immediately after an answer is selected.
    // We still prebuild the next map in the background, but we do not gate the button on prebuild readiness.
    if (!locked) {
      nextBtn.disabled = true
      return
    }
    nextBtn.disabled = false
  }

  function renderAnswers(options) {
    answersEl.innerHTML = ""

    for (const opt of options) {
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

      btn.addEventListener("click", () => onGuess(opt.key, btn))

      li.appendChild(btn)
      answersEl.appendChild(li)
    }
  }

  function lockAnswers() {
    const allButtons = Array.from(document.querySelectorAll("#quizPane .ansBtn"))
    for (const b of allButtons) b.disabled = true
    return allButtons
  }

  function onGuess(chosenKey, chosenBtn) {
    if (locked) return
    if (!current) { locked = false; return }
    locked = true
    kbUpdateNextBtnEnabled()

    rounds += 1

    let kbTelemetryIsCorrect = false
    let kbTelemetryTotalPayU = 0
    let kbTelemetryParentPayU = 0
    let kbTelemetrySponsorPayU = 0

    const correctKey = current.key
    const correctDisplay = current.displayName
    const allButtons = lockAnswers()

    if (chosenKey === correctKey) {
      kbTelemetryIsCorrect = true
      correctCount += 1
      chosenBtn.classList.add("correct")
      const _mk = chosenBtn.querySelector(".mark"); if (_mk) _mk.textContent = "✓"

      if (mode === "normal") {
        // Reward payout on a correct answer is the sum of the parent and sponsor flow rates.
        // That sum is distributed 75% to Child, 12.5% to Developer, 12.5% to Platform.
        const parentFlowU = Math.min(flowU, parentU)
        const parentPayU = parentFlowU > 0 ? parentFlowU : 0

        let sponsorPayU = 0
        const m = Number(sponsorMatch)
        if (parentFlowU > 0 && Number.isFinite(m) && m > 0 && sponsorU > 0) {
          const sponsorFlowU = Math.floor(Number(parentFlowU) / m)
          if (sponsorFlowU > 0) sponsorPayU = Math.min(sponsorFlowU, sponsorU)
        }

        const totalPayU = parentPayU + sponsorPayU

        kbTelemetryParentPayU = parentPayU
        kbTelemetrySponsorPayU = sponsorPayU
        kbTelemetryTotalPayU = totalPayU

        if (totalPayU > 0) {
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

          saveWallet()
          clampFlowRate()
          updateAccounts()
        } else {
          if (messageEl) messageEl.textContent = ""
        }
      } else {
        // Practice misses mode, no money flows.
        if (messageEl) messageEl.textContent = ""
      }
    } else {
      chosenBtn.classList.add("wrong")
      const _mk2 = chosenBtn.querySelector(".mark"); if (_mk2) _mk2.textContent = "✕"

      const correctBtn = allButtons.find(b => { const _l = b.querySelector(".label"); return _l && _l.textContent === correctDisplay })
      if (correctBtn) {
        correctBtn.classList.add("correct")
        const _mk3 = correctBtn.querySelector(".mark"); if (_mk3) _mk3.textContent = "✓"
      }

      if (mode === "normal") {
        // Record a miss (unique countries) for Practice misses mode.
        if (!missesSet.has(correctKey)) {
          missesSet.add(correctKey)
          misses.push(correctKey)
        }
        if (quitBtn) quitBtn.disabled = misses.length === 0
      }
    }

    if (mode === "practice") {
      nextBtn.textContent = "Next question"
      updateScoreDisplay(false)
    } else {
      const done = rounds >= deck.length
      if (done) {
        gameComplete = true
        stopTimer()
        nextBtn.textContent = "Game over"
        nextBtn.disabled = true
        updateScoreDisplay(true)
      } else {
        nextBtn.textContent = "Next question"
        updateScoreDisplay(false)
      }
    }

  try {
    if (window.KB_TELEMETRY) {
      const toKbu = (u) => {
        const n = Number(u) || 0
        return n > 0 ? (n / SCALE) : 0
      }
      if (kbGeoActiveKey !== "oap") {
      window.KB_TELEMETRY.event("kb_answer", {
        kb_game: (kbGeoActiveKey === "oap") ? "optics_and_photonics" : "name_that_country",
        kb_mode: mode,
        kb_correct: kbTelemetryIsCorrect ? 1 : 0,
        kb_round: rounds,
        kb_bullet: (function(){ try { const _l = chosenBtn && chosenBtn.querySelector(".label"); return _l ? String(_l.textContent || "").trim() : ""; } catch (e) { return ""; } })(),
        kb_total_pay_kbu: toKbu(kbTelemetryTotalPayU),
        kb_parent_pay_kbu: toKbu(kbTelemetryParentPayU),
        kb_sponsor_pay_kbu: toKbu(kbTelemetrySponsorPayU)
      })
      }
    }
  } catch (e) {}

  syncMapHeight()
}

  function nextQuestion() {
    try { kbDbg("nextQuestion", kbMapState()) } catch (e) {}

    resetUIForNewQuestion()

    if (mode === "practice") {
      // Practice misses: infinite loop over missed countries.
      if (misses.length === 0) {
        if (messageEl) messageEl.textContent = "No misses yet. Play a New game first."
        nextBtn.disabled = true
        if (quitBtn) quitBtn.disabled = true
        syncMapHeight()
        return
      }

      if (!deck || deck.length === 0 || deckIndex >= deck.length) {
        buildPracticeDeck()
      }

      const currentIndex = deckIndex
      const pickOne = deck[deckIndex]
      deckIndex += 1
      current = pickOne

      let usedPrebuilt = false
      try {
        if (kbPrebuildReady && kbPrebuilt && kbPrebuilt.index === currentIndex && kbPrebuilt.key === pickOne.key) {
          kbSwapMapBuffers("use-prebuilt")
          usedPrebuilt = true
          kbPrebuilt = null
          kbPrebuildReady = true
        }
      } catch (e) {}

      if (!usedPrebuilt) {
        setCountryOnMap(pickOne.feature)
        try { kbResetPrebuild("practice") } catch (e) {}
      }

      const others = pickNOther(9, pickOne.key)
      const options = shuffle([pickOne, ...others])

      renderAnswers(options)

      try { kbStartPrebuildForIndex(deckIndex, "after-render") } catch (e) {}

      nextBtn.textContent = "Next question"
      updateScoreDisplay(false)

      syncMapHeight()
      return
    }

    if (gameComplete) return

    if (deckIndex >= deck.length) {
      gameComplete = true
      nextBtn.textContent = "Game over"
      nextBtn.disabled = true
      updateScoreDisplay(true)
      syncMapHeight()
      return
    }

    const currentIndex = deckIndex
    const pickOne = deck[deckIndex]
    deckIndex += 1
    current = pickOne

    let usedPrebuilt = false
    try {
      if (kbPrebuildReady && kbPrebuilt && kbPrebuilt.index === currentIndex && kbPrebuilt.key === pickOne.key) {
        kbSwapMapBuffers("use-prebuilt-normal")
        usedPrebuilt = true
        kbPrebuilt = null
        kbPrebuildReady = true
      }
    } catch (e) {}

    if (!usedPrebuilt) {
      setCountryOnMap(pickOne.feature)
    }

    const others = pickNOther(9, pickOne.key)
    const options = shuffle([pickOne, ...others])

    renderAnswers(options)
    updateScoreDisplay(false)

    try { kbStartPrebuildForIndex(deckIndex, "after-render-normal") } catch (e) {}

    syncMapHeight()
  }

  function startNewGame() {
    try { kbNormalizeMapView("startNewGame") } catch (e) {}

    try { kbDbg("startNewGame", kbMapState()) } catch (e) {}

    overlay.classList.remove("show")

    rounds = 0
    correctCount = 0
    gameComplete = false

    mode = "normal"

    try { if (window.KB_TELEMETRY) window.KB_TELEMETRY.event("kb_game_start", { kb_game: (kbGeoActiveKey === "oap") ? "optics_and_photonics" : "name_that_country" }) } catch (e) {}

    try { kbResetPrebuild("startNewGame") } catch (e) {}
    try { kbClearLayerOn(kbGetFrontBuffer()) } catch (e) {}
    try { kbClearLayerOn(kbGetBackBuffer()) } catch (e) {}

    setTimerVisible(true)
    resetAndStartTimer()
    misses = []
    missesSet = new Set()
    if (quitBtn) quitBtn.disabled = true

    deck = shuffle(countries)
    deckIndex = 0

    nextBtn.textContent = "Next question"
    updateScoreDisplay(false)

    updateAccounts()
    if (messageEl) messageEl.textContent = ""

    nextQuestion()
  }

  function startPracticeMisses() {
    overlay.classList.remove("show")

    pauseTimer()
    setTimerVisible(false)

    if (misses.length === 0) {
      if (messageEl) messageEl.textContent = "No misses yet. Play a New game first."
      if (quitBtn) quitBtn.disabled = true
      return
    }

    mode = "practice"
    rounds = 0
    correctCount = 0
    gameComplete = false

    buildPracticeDeck()

    if (!deck || deck.length === 0) {
      if (messageEl) messageEl.textContent = "No missed countries could be loaded. Start a new game and miss a few questions first."
      nextBtn.disabled = true
      if (quitBtn) quitBtn.disabled = true
      return
    }

    nextBtn.textContent = "Next question"
    updateScoreDisplay(false)
    if (messageEl) messageEl.textContent = ""
    nextQuestion()
  }

  function quitGame() {
    overlay.classList.add("show")
    document.getElementById("finalText").textContent =
      "Final score: " + correctCount + "/" + rounds + "."
  }

  async function loadCountries() {
    updateScoreDisplay(false)

    const [unRes, geoRes] = await Promise.all([
      fetch(UN_MEMBERS_URL),
      fetch(COUNTRIES_GEOJSON_PATH)
    ])

    if (!unRes.ok) throw new Error("Could not load map data. Please refresh the page.")
    if (!geoRes.ok) throw new Error("Could not load map data. Please refresh the page.")

    const unRaw = await unRes.json()
    const gj = await geoRes.json()

    const unArr = Array.isArray(unRaw) ? unRaw : []

    const unByA2 = new Map()
    const unByA3 = new Map()
    const unByCanonName = new Map()

    for (const x of unArr) {
      if (!x || (x.unMember !== true && String(x.cca3 || "").toUpperCase() !== "GNB")) continue

      const cca2 = String(x.cca2 || "").toUpperCase()
      const cca3 = String(x.cca3 || "").toUpperCase()
      const common = x.name && x.name.common ? String(x.name.common) : ""
      const official = x.name && x.name.official ? String(x.name.official) : ""

      const key = cca3 || cca2 || canon(common) || canon(official)
      const entry = { key, cca2, cca3, common, official }

      if (cca2) unByA2.set(cca2, entry)
      if (cca3) unByA3.set(cca3, entry)

      if (common) unByCanonName.set(canon(common), entry)
      if (official) unByCanonName.set(canon(official), entry)
    }

    const feats = (gj && gj.features) ? gj.features : []

    const matched = []
    for (const f of feats) {
      const props = f.properties || {}
      const name = geoName(props)
      if (!name) continue

      const iso2u = String(getISO2(props) || "").toUpperCase()
      const iso3u = String(getISO3(props) || "").toUpperCase()

      let entry = null

      if (iso3u && unByA3.has(iso3u)) entry = unByA3.get(iso3u)
      else if (iso2u && unByA2.has(iso2u)) entry = unByA2.get(iso2u)
      else {
        const cn = canon(name)
        if (unByCanonName.has(cn)) entry = unByCanonName.get(cn)
      }

      if (!entry) continue

      let displayName = entry.common || entry.official || name

      // Fix diacritics for consistent display
      if (normNameKey(displayName) === "sao tome and principe") displayName = "Sao Tome and Principe"

      matched.push({
        key: entry.key,
        displayName,
        feature: f
      })
    }

    const seen = new Set()
    countries = matched.filter(x => {
      if (!x.key) return false
      if (seen.has(x.key)) return false
      seen.add(x.key)
      return true
    })

    if (countries.length < 150) {
      throw new Error("UN filter left too few countries")
    }

    // Build a lookup map so Practice misses can quickly map keys to country objects.
    countryByKey = new Map()
    for (const c of countries) countryByKey.set(c.key, c)
  }

  window.KB_NTC = {
    kbZoomOutAfterNextMoveEnd,
    kbMapState,
    kbNormalizeMapView,
    pad2,
    formatTimeHMS,
    formatTimeMSS,
    setTimerVisible,
    renderTimer,
    startTimer,
    pauseTimer,
    stopTimer,
    resetAndStartTimer,
    pick,
    normNameKey,
    canon,
    getISO2,
    getISO3,
    geoName,
    shuffle,
    pickNOther,
    buildPracticeDeck,
    clearMapLayer,
    setCountryOnMap,
    kbClearLayerOn,
    formatScorePctInt,
    formatScorePct,
    updateScoreDisplay,
    syncMapHeight,
    resetUIForNewQuestion,
    kbUpdateNextBtnEnabled,
    renderAnswers,
    lockAnswers,
    onGuess,
    nextQuestion,
    startNewGame,
    startPracticeMisses,
    quitGame,
    loadCountries,
  }

})()
