// ======================================
// K-BUCKS DEMO
// Module: bingo_engine
// Responsibility: Practice Times Tables gameplay engine — board, wallet, game flow, timer
// Exports: window.KB_BINGO
// ======================================
;(function () {

  // Private: all unique products from 1×1 to 10×10, sorted.
  const kbBingoUniqueResults = (() => {
    const s = new Set()
    for (let a = 1; a <= 10; a += 1) {
      for (let b = 1; b <= 10; b += 1) s.add(a * b)
    }
    return Array.from(s).sort((x, y) => x - y)
  })()

  // ---- Flow rate helpers ----

  function kbBingoSpigotFlowRateU() {
    let parentFlowU = Number(kbBingoFlowU)
    const parentWalletU = Number(kbBingoParentU)
    if (!Number.isFinite(parentFlowU) || parentFlowU <= 0) return 0
    if (!Number.isFinite(parentWalletU) || parentWalletU <= 0) return 0
    parentFlowU = Math.min(parentFlowU, parentWalletU)
    let sponsorAddU = 0
    const m = Number(kbBingoSponsorMatch)
    const sponsorWalletU = Number(kbBingoSponsorU)
    if (Number.isFinite(sponsorWalletU) && sponsorWalletU > 0 && Number.isFinite(m) && m > 0) {
      sponsorAddU = Math.trunc(parentFlowU / m)
      if (sponsorAddU > sponsorWalletU) sponsorAddU = sponsorWalletU
      if (sponsorAddU < 0) sponsorAddU = 0
    }
    return parentFlowU + sponsorAddU
  }

  function kbBingoFmtSpigotFlowRate() {
    return fmtWalletMin2U(kbBingoSpigotFlowRateU())
  }

  function kbBingoSpigotKbucksPerHourU() {
    // Estimate: flow per answer * 600 (see Screen 3 formula).
    return Math.trunc(kbBingoSpigotFlowRateU() * 600)
  }

  function kbBingoFmtSpigotKbucksPerHour() {
    return fmtWalletMin2U(kbBingoSpigotKbucksPerHourU())
  }

  // ---- Wallet and account display ----

  function kbBingoSyncSpigotPaneSize() {
    if (!bingoChildPaneEl || !bingoSpigotPaneEl) return
    const r = bingoChildPaneEl.getBoundingClientRect()
    const w = Math.round(r.width)
    const h = Math.round(r.height)
    if (!w || !h || w < 120 || h < 40) return
    bingoSpigotPaneEl.style.width = w + "px"
    bingoSpigotPaneEl.style.height = h + "px"
  }

  function kbBingoUpdateAccounts() {
    if (kbBingoParentU <= 0) kbBingoFlowU = 0
    if (bingoParentInput && document.activeElement !== bingoParentInput) bingoParentInput.value = fmtParentU(kbBingoParentU)
    if (bingoSponsorInput && document.activeElement !== bingoSponsorInput) bingoSponsorInput.value = fmtSponsorU(kbBingoSponsorU)
    if (bingoFlowRateInput && document.activeElement !== bingoFlowRateInput) bingoFlowRateInput.value = fmtFlowInputU(kbBingoFlowU)
    if (bingoSponsorMatchInput && document.activeElement !== bingoSponsorMatchInput) bingoSponsorMatchInput.value = String(kbBingoSponsorMatch)
    if (bingoSpigotFlowRateOut) bingoSpigotFlowRateOut.textContent = kbBingoFmtSpigotFlowRate()
    if (bingoSpigotKbucksPerHourOut) bingoSpigotKbucksPerHourOut.textContent = kbBingoFmtSpigotKbucksPerHour()
    if (bingoChildAcctEl) bingoChildAcctEl.textContent = "KBU balance: " + fmtWalletMin2U(kbGlobalChildU)
    if (bingoDevAcctEl) bingoDevAcctEl.textContent = "KBU balance: " + fmtOtherU(kbBingoDevU)
    if (bingoPlatformAcctEl) bingoPlatformAcctEl.textContent = "KBU balance: " + fmtWalletMin2U(kbGlobalPlatformU)
    kbBingoSyncSpigotPaneSize()
    kbUpdateGlobalBalances()
  }

  function kbBingoClampFlowRate() {
    if (!bingoFlowRateInput) return
    const raw = String(bingoFlowRateInput.value || "")
    let vU = parseUnitsNoRound(raw)
    if (vU < 0) vU = 0
    if (kbBingoParentU <= 0) vU = 0
    kbBingoFlowU = vU
    bingoFlowRateInput.value = fmtFlowInputU(kbBingoFlowU)
    kbBingoUpdateAccounts()
  }

  function kbBingoClampParentInput() {
    if (!bingoParentInput) return
    const raw = String(bingoParentInput.value || "")
    let vU = toMoneyUnits(raw)
    if (vU < 0) vU = 0
    kbBingoParentU = vU
    if (kbBingoParentU <= 0) kbBingoFlowU = 0
    if (bingoFlowRateInput) bingoFlowRateInput.value = fmtFlowInputU(kbBingoFlowU)
    kbBingoUpdateAccounts()
    if (bingoParentInput) bingoParentInput.value = fmtParentU(kbBingoParentU)
  }

  function kbBingoClampSponsorInput() {
    if (!bingoSponsorInput) return
    const raw = String(bingoSponsorInput.value || "")
    let vU = toMoneyUnits(raw)
    if (vU < 0) vU = 0
    kbBingoSponsorU = vU
    kbBingoUpdateAccounts()
    if (bingoSponsorInput && document.activeElement !== bingoSponsorInput) bingoSponsorInput.value = fmtSponsorU(kbBingoSponsorU)
  }

  function kbBingoClampSponsorMatch() {
    if (!bingoSponsorMatchInput) return
    const raw = String(bingoSponsorMatchInput.value || "").trim()
    let v = Number(raw)
    if (!Number.isFinite(v) || v < 3 || v > 7) {
      bingoSponsorMatchInput.value = String(kbBingoSponsorMatch)
      return
    }
    kbBingoSponsorMatch = v
    if (document.activeElement !== bingoSponsorMatchInput) bingoSponsorMatchInput.value = String(kbBingoSponsorMatch)
    kbBingoUpdateAccounts()
  }

  function kbAvailableToEarnBingoU() {
    return kbAvailableToEarnForGameU(kbBingoFlowU, kbBingoParentU, kbBingoSponsorU, kbBingoSponsorMatch)
  }

  // ---- Board setup and tile helpers ----

  function kbUpgradeBingoPairsToButtons() {
    if (kbBingoPairsUpgradedToButtons) return
    kbBingoPairsUpgradedToButtons = true
    const lines = document.querySelectorAll('#screenBingo .bingoLine')
    lines.forEach((line) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'bingoPairBtn'
      while (line.firstChild) btn.appendChild(line.firstChild)
      line.replaceWith(btn)
    })
  }

  function kbShuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = arr[i]
      arr[i] = arr[j]
      arr[j] = tmp
    }
    return arr
  }

  function kbBingoEnsurePttHeaderMeta() {
    const grid = document.getElementById("bingoGrid")
    if (!grid) return
    const kids = Array.from(grid.children || [])
    if (kids.length < 121) return
    for (let r = 0; r < 11; r += 1) {
      for (let c = 0; c < 11; c += 1) {
        const el = kids[r * 11 + c]
        if (!el) continue
        if (r === 0 && c === 0) {
          try { if (!el.textContent || !el.textContent.trim()) el.textContent = "×" } catch (e) {}
          continue
        }
        if (r === 0 && el.classList && el.classList.contains("pttHdr")) {
          try { el.dataset.col = String(c) } catch (e) {}
        }
        if (c === 0 && el.classList && el.classList.contains("pttHdr")) {
          try { el.dataset.row = String(r) } catch (e) {}
        }
      }
    }
  }

  function kbBingoClearHeaderHighlights() {
    const els = document.querySelectorAll("#screenBingo .pttHdr.kbBingoHdrCurrent, #screenBingo .pttCorner.kbBingoHdrCurrent")
    for (const el of els) {
      try { el.classList.remove("kbBingoHdrCurrent") } catch (e) {}
    }
  }

  function kbBingoSetHeaderHighlights(pair) {
    kbBingoClearHeaderHighlights()
    if (!pair) return
    const a = Number(pair.a)
    const b = Number(pair.b)
    if (!a || !b) return
    const rowHdr = document.querySelector(`#screenBingo .pttHdr[data-row="${a}"]`)
    const colHdr = document.querySelector(`#screenBingo .pttHdr[data-col="${b}"]`)
    try { if (rowHdr) rowHdr.classList.add("kbBingoHdrCurrent") } catch (e) {}
    try { if (colHdr) colHdr.classList.add("kbBingoHdrCurrent") } catch (e) {}
  }

  function kbBingoEnsurePairResultSpan(btn) {
    if (!btn) return null
    let r = null
    try { r = btn.querySelector('.bingoResult') } catch (e) { r = null }
    if (!r) {
      r = document.createElement('span')
      r.className = 'bingoResult'
      r.textContent = ''
      try { btn.appendChild(r) } catch (e) {}
    }
    return r
  }

  function kbBingoSetPairDisplay(btn, mode, resultText) {
    if (!btn) return
    const r = kbBingoEnsurePairResultSpan(btn)
    if (mode === 'blank') {
      btn.classList.add('kbBingoBlank')
      btn.classList.remove('kbBingoShowResult')
      if (r) r.textContent = ''
      try { btn.dataset.kbResult = '' } catch (e) {}
      return
    }
    if (mode === 'result') {
      btn.classList.remove('kbBingoBlank')
      btn.classList.add('kbBingoShowResult')
      const t = String(resultText == null ? '' : resultText)
      if (r) r.textContent = t
      try { btn.dataset.kbResult = t } catch (e) {}
      return
    }
    btn.classList.remove('kbBingoBlank')
    btn.classList.remove('kbBingoShowResult')
    if (r) r.textContent = ''
    try { btn.dataset.kbResult = '' } catch (e) {}
  }

  function kbBingoBlankAllPairs() {
    for (const p of kbBingoPairs) {
      try { kbBingoSetPairDisplay(p.btn, 'blank') } catch (e) {}
    }
  }

  function kbBingoEnsurePairs() {
    kbBingoEnsurePttHeaderMeta()
    const btns = Array.from(document.querySelectorAll('#screenBingo .bingoPairBtn'))
    kbBingoPairs = []
    kbBingoPairByKey = new Map()
    for (const btn of btns) {
      try { kbBingoEnsurePairResultSpan(btn) } catch (e) {}
      const aEl = btn.querySelector('.bingoA')
      const bEl = btn.querySelector('.bingoB')
      let a = aEl ? parseInt(String(aEl.textContent || '').trim(), 10) : NaN
      let b = bEl ? parseInt(String(bEl.textContent || '').trim(), 10) : NaN
      if (!Number.isFinite(a) || !Number.isFinite(b)) {
        a = parseInt(String(btn.dataset.a || ''), 10)
        b = parseInt(String(btn.dataset.b || ''), 10)
      }
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue
      const key = String(a) + 'x' + String(b)
      btn.dataset.a = String(a)
      btn.dataset.b = String(b)
      btn.dataset.key = key
      const pair = { key, a, b, btn }
      kbBingoPairs.push(pair)
      kbBingoPairByKey.set(key, pair)
    }
  }

  function kbBingoClearHighlights() {
    for (const p of kbBingoPairs) {
      p.btn.classList.remove("kbBingoDoneCorrect")
      p.btn.classList.remove("kbBingoDoneWrong")
      p.btn.classList.remove("kbBingoCurrent")
    }
  }

  // ---- Question presentation ----

  function kbBingoUpdateHeader(finalMode) {
    const total = kbBingoPairs.length || 100
    if (kbBingoMode === "practice") {
      if (bingoProgressEl) {
        const presented = kbBingoPracticeTotal > 0 ? Math.min(kbBingoPracticeShown, kbBingoPracticeTotal) : 0
        bingoProgressEl.textContent = "Misses: " + presented + "/" + kbBingoPracticeTotal
      }
      if (bingoStatusEl) bingoStatusEl.textContent = ""
      if (bingoTimerEl) bingoTimerEl.textContent = ""
    } else {
      const answered = kbBingoAnsweredKeys.size
      const correct = kbBingoCorrectCount
      if (bingoProgressEl) {
        bingoProgressEl.textContent = "Progress: " + answered + "/" + total + formatScorePct(answered, total)
      }
      if (bingoStatusEl) {
        const prefix = finalMode ? "Final score: " : "Score: "
        bingoStatusEl.textContent = prefix + correct + "/" + answered + (answered <= 0 ? " (0%)" : formatScorePct(correct, answered))
      }
    }
    if (bingoQuitBtn) bingoQuitBtn.disabled = kbBingoMisses.size === 0
  }

  function kbBingoResetUIForNewQuestion() {
    if (bingoAnswersEl) bingoAnswersEl.innerHTML = ""
    if (bingoMessageEl) bingoMessageEl.textContent = ""
    if (bingoNextBtn) {
      bingoNextBtn.textContent = "Next question"
      bingoNextBtn.disabled = true
    }
    kbBingoLocked = false
  }

  function kbBingoRenderAnswers(options) {
    if (!bingoAnswersEl) return
    bingoAnswersEl.innerHTML = ""
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
      btn.addEventListener("click", () => kbBingoOnGuess(opt.key, btn))
      li.appendChild(btn)
      bingoAnswersEl.appendChild(li)
    }
  }

  function kbBingoLockAnswers() {
    const btns = Array.from((bingoAnswersEl || document).querySelectorAll(".ansBtn"))
    for (const b of btns) b.disabled = true
    return btns
  }

  function kbBingoBuildOptions(correctValue) {
    const correctKey = String(correctValue)
    const pool = kbBingoUniqueResults.map(v => String(v)).filter(v => v !== correctKey)
    kbShuffleInPlace(pool)
    const picked = pool.slice(0, 9)
    const allKeys = [correctKey, ...picked]
    kbShuffleInPlace(allKeys)
    return allKeys.map(k => ({ key: k, displayName: k }))
  }

  function kbBingoSetCurrentPair(pair) {
    for (const p of kbBingoPairs) {
      try { p.btn.classList.remove('kbBingoCurrent') } catch (e) {}
    }
    kbBingoCurrentPair = pair
    if (pair && pair.btn) {
      try { pair.btn.classList.add('kbBingoCurrent') } catch (e) {}
    }
    kbBingoSetHeaderHighlights(pair)
    for (const p of kbBingoPairs) {
      const btn = p.btn
      if (!btn) continue
      const done = btn.classList.contains('kbBingoDoneCorrect') || btn.classList.contains('kbBingoDoneWrong')
      if (done) {
        const t = String(btn.dataset.kbResult || (Number(p.a) * Number(p.b)))
        kbBingoSetPairDisplay(btn, 'result', t)
        continue
      }
      if (pair && p.key === pair.key) {
        kbBingoSetPairDisplay(btn, 'question')
      } else {
        kbBingoSetPairDisplay(btn, 'blank')
      }
    }
  }

  function kbBingoPresentRandomPair() {
    kbBingoEnsurePairs()
    if (kbBingoPairs.length === 0) return
    if (kbBingoMode === "practice") {
      if (!kbBingoPracticeDeck || kbBingoPracticeDeck.length === 0) {
        if (bingoMessageEl) bingoMessageEl.textContent = "No misses yet. Press \"New game\" first."
        if (bingoNextBtn) { bingoNextBtn.textContent = "Next question"; bingoNextBtn.disabled = true }
        kbBingoUpdateHeader(false)
        return
      }
      if (kbBingoPracticeIndex >= kbBingoPracticeDeck.length) {
        kbBingoPracticeIndex = 0
        kbBingoPracticeShown = 0
        kbBingoRounds = 0
        kbBingoCorrectCount = 0
        kbShuffleInPlace(kbBingoPracticeDeck)
        kbBingoUpdateHeader(false)
        kbBingoClearHighlights()
        kbBingoClearHeaderHighlights()
        kbBingoBlankAllPairs()
        kbBingoCurrentPair = null
      }
      const key = kbBingoPracticeDeck[kbBingoPracticeIndex]
      const pick = kbBingoPairByKey.get(key)
      if (!pick) {
        kbBingoPracticeDeck = kbBingoPracticeDeck.filter(k => k !== key)
        kbBingoPracticeTotal = kbBingoPracticeDeck.length
        kbBingoPracticeIndex = Math.min(kbBingoPracticeIndex, kbBingoPracticeDeck.length)
        kbBingoUpdateHeader(false)
        return kbBingoPresentRandomPair()
      }
      kbBingoSetCurrentPair(pick)
      kbBingoPracticeShown += 1
      kbBingoPracticeIndex += 1
      kbBingoUpdateHeader(false)
      const correctValue = pick.a * pick.b
      const options = kbBingoBuildOptions(correctValue)
      kbBingoCurrentAnswerKey = String(correctValue)
      kbBingoResetUIForNewQuestion()
      kbBingoRenderAnswers(options)
      return
    }
    const candidates = kbBingoPairs.filter(p => !kbBingoAnsweredKeys.has(p.key))
    if (candidates.length === 0) {
      kbBingoComplete = true
      if (bingoNextBtn) { bingoNextBtn.textContent = "Game over"; bingoNextBtn.disabled = true }
      stopBingoTimer()
      kbBingoUpdateHeader(true)
      return
    }
    const pick = candidates[Math.floor(Math.random() * candidates.length)]
    kbBingoSetCurrentPair(pick)
    const correctValue = pick.a * pick.b
    const options = kbBingoBuildOptions(correctValue)
    kbBingoCurrentAnswerKey = String(correctValue)
    kbBingoResetUIForNewQuestion()
    kbBingoRenderAnswers(options)
  }

  function kbBingoOnGuess(chosenKey, chosenBtn) {
    if (kbBingoLocked) return
    kbBingoLocked = true
    const correctKey = kbBingoCurrentAnswerKey
    const allButtons = kbBingoLockAnswers()
    const isCorrect = String(chosenKey) === String(correctKey)
    const isPractice = kbBingoMode === "practice"
    let kbTelemetryTotalPayU = 0
    let kbTelemetryParentPayU = 0
    let kbTelemetrySponsorPayU = 0
    if (isPractice) {
      kbBingoRounds += 1
      if (isCorrect) kbBingoCorrectCount += 1
    } else {
      if (kbBingoCurrentPair) {
        kbBingoAnsweredKeys.add(kbBingoCurrentPair.key)
        if (!isCorrect) kbBingoMisses.add(kbBingoCurrentPair.key)
      }
      kbBingoRounds = kbBingoAnsweredKeys.size
      if (isCorrect) kbBingoCorrectCount += 1
    }
    kbBingoUpdateHeader(false)
    if (!isPractice && isCorrect) {
      let parentFlowU = Number(kbBingoFlowU)
      const parentWalletU = Number(kbBingoParentU)
      if (!Number.isFinite(parentFlowU) || parentFlowU <= 0 || !Number.isFinite(parentWalletU) || parentWalletU <= 0) {
        parentFlowU = 0
      } else {
        parentFlowU = Math.min(parentFlowU, parentWalletU)
      }
      let parentPayU = parentFlowU
      let sponsorPayU = 0
      const m = Number(kbBingoSponsorMatch)
      const sponsorWalletU = Number(kbBingoSponsorU)
      if (parentFlowU > 0 && Number.isFinite(m) && m > 0 && Number.isFinite(sponsorWalletU) && sponsorWalletU > 0) {
        const sponsorFlowU = Math.floor(Number(parentFlowU) / m)
        if (sponsorFlowU > 0) sponsorPayU = Math.min(sponsorFlowU, sponsorWalletU)
      }
      const totalPayU = parentPayU + sponsorPayU
      kbTelemetryParentPayU = parentPayU
      kbTelemetrySponsorPayU = sponsorPayU
      kbTelemetryTotalPayU = totalPayU
      if (totalPayU > 0) {
        const devNumer = totalPayU + kbBingoDevCarry
        const platNumer = totalPayU + kbBingoPlatCarry
        const devAdd = Math.floor(devNumer / 8)
        const platAdd = Math.floor(platNumer / 8)
        kbBingoDevCarry = devNumer % 8
        kbBingoPlatCarry = platNumer % 8
        const childAdd = totalPayU - devAdd - platAdd
        kbBingoParentU -= parentPayU
        kbBingoSponsorU -= sponsorPayU
        kbGlobalChildU += childAdd
        kbBingoDevU += devAdd
        kbGlobalPlatformU += platAdd
        if (kbBingoParentU <= 0) kbBingoFlowU = 0
        try { kbBingoUpdateAccounts() } catch (e) {}
      }
    }
    try {
      if (window.KB_TELEMETRY) {
        const toKbu = (u) => { const n = Number(u) || 0; return n > 0 ? (n / SCALE) : 0 }
        window.KB_TELEMETRY.event("kb_answer", {
          kb_game: "practice_times_tables",
          kb_mode: kbBingoMode,
          kb_correct: isCorrect ? 1 : 0,
          kb_round: kbBingoRounds,
          kb_bullet: (function(){ try { const _l = chosenBtn && chosenBtn.querySelector(".label"); return _l ? String(_l.textContent || "").trim() : ""; } catch (e) { return ""; } })(),
          kb_total_pay_kbu: toKbu(kbTelemetryTotalPayU),
          kb_parent_pay_kbu: toKbu(kbTelemetryParentPayU),
          kb_sponsor_pay_kbu: toKbu(kbTelemetrySponsorPayU)
        })
      }
    } catch (e) {}
    if (isCorrect) {
      chosenBtn.classList.add("correct")
      const m = chosenBtn.querySelector(".mark")
      if (m) m.textContent = "✓"
    } else {
      chosenBtn.classList.add("wrong")
      const m = chosenBtn.querySelector(".mark")
      if (m) m.textContent = "✕"
      const correctBtn = allButtons.find(b => { const label = b.querySelector(".label"); return label && String(label.textContent) === String(correctKey) })
      if (correctBtn) {
        correctBtn.classList.add("correct")
        const m2 = correctBtn.querySelector(".mark")
        if (m2) m2.textContent = "✓"
      }
    }
    try {
      if (kbBingoCurrentPair && kbBingoCurrentPair.btn) {
        const pairBtn = kbBingoCurrentPair.btn
        pairBtn.classList.remove("kbBingoCurrent")
        pairBtn.classList.remove("kbBingoDoneCorrect")
        pairBtn.classList.remove("kbBingoDoneWrong")
        pairBtn.classList.add(isCorrect ? "kbBingoDoneCorrect" : "kbBingoDoneWrong")
        try { kbBingoSetPairDisplay(pairBtn, "result", String(correctKey)) } catch (e) {}
      }
    } catch (e) {}
    if (!isPractice) {
      const done = kbBingoAnsweredKeys.size >= kbBingoPairs.length
      if (done) {
        kbBingoComplete = true
        if (bingoNextBtn) { bingoNextBtn.textContent = "Game over"; bingoNextBtn.disabled = true }
        stopBingoTimer()
        kbBingoUpdateHeader(true)
      } else {
        if (bingoNextBtn) bingoNextBtn.disabled = false
      }
      return
    }
    if (bingoNextBtn) bingoNextBtn.disabled = false
  }

  // ---- Timer ----

  function renderBingoTimer() {
    if (!bingoTimerEl) return
    if (kbBingoMode === "practice") { bingoTimerEl.textContent = ""; return }
    const now = Date.now()
    const ms = bingoTimerElapsedMs + (bingoTimerRunning ? (now - bingoTimerStartMs) : 0)
    bingoTimerEl.textContent = "Time: " + formatTimeHMS(ms)
  }

  function startBingoTimer() {
    if (bingoTimerStopped) return
    if (currentScreen !== "bingo") return
    if (bingoTimerRunning) return
    bingoTimerRunning = true
    bingoTimerStartMs = Date.now()
    if (bingoTimerInterval) clearInterval(bingoTimerInterval)
    bingoTimerInterval = setInterval(renderBingoTimer, 1000)
    renderBingoTimer()
  }

  function pauseBingoTimer() {
    if (!bingoTimerRunning) { renderBingoTimer(); return }
    const now = Date.now()
    bingoTimerElapsedMs += (now - bingoTimerStartMs)
    bingoTimerRunning = false
    bingoTimerStartMs = 0
    if (bingoTimerInterval) clearInterval(bingoTimerInterval)
    bingoTimerInterval = null
    renderBingoTimer()
  }

  function stopBingoTimer() {
    pauseBingoTimer()
    bingoTimerStopped = true
  }

  function resetAndStartBingoTimer() {
    bingoTimerElapsedMs = 0
    bingoTimerStopped = false
    bingoTimerRunning = false
    bingoTimerStartMs = 0
    if (bingoTimerInterval) clearInterval(bingoTimerInterval)
    bingoTimerInterval = null
    renderBingoTimer()
    startBingoTimer()
  }

  // ---- Game flow entry points ----

  function kbBingoStartNewGame() {
    try { if (window.KB_TELEMETRY) window.KB_TELEMETRY.event("kb_game_start", { kb_game: "practice_times_tables" }) } catch (e) {}
    kbBingoEnsurePairs()
    kbBingoAnsweredKeys = new Set()
    kbBingoMisses = new Set()
    kbBingoMode = "normal"
    kbBingoPracticeTotal = 0
    kbBingoCurrentPair = null
    kbBingoLocked = false
    kbBingoComplete = false
    kbBingoRounds = 0
    kbBingoCorrectCount = 0
    kbBingoCurrentAnswerKey = null
    kbBingoClearHighlights()
    kbBingoClearHeaderHighlights()
    kbBingoBlankAllPairs()
    try { kbBingoUpdateAccounts() } catch (e) {}
    if (bingoNextBtn) { bingoNextBtn.textContent = "Next question"; bingoNextBtn.disabled = true }
    if (bingoMessageEl) bingoMessageEl.textContent = ""
    kbBingoUpdateHeader(false)
    resetAndStartBingoTimer()
    kbBingoPresentRandomPair()
  }

  function kbBingoStartPracticeMisses() {
    if (!kbBingoMisses || kbBingoMisses.size === 0) {
      if (bingoMessageEl) bingoMessageEl.textContent = "No misses yet. Press \"New game\" first."
      if (bingoQuitBtn) bingoQuitBtn.disabled = true
      return
    }
    kbBingoEnsurePairs()
    kbBingoMode = "practice"
    kbBingoComplete = false
    kbBingoPracticeDeck = Array.from(kbBingoMisses)
    kbShuffleInPlace(kbBingoPracticeDeck)
    kbBingoPracticeIndex = 0
    kbBingoPracticeShown = 0
    kbBingoPracticeTotal = kbBingoPracticeDeck.length
    kbBingoRounds = 0
    kbBingoCorrectCount = 0
    kbBingoCurrentAnswerKey = null
    kbBingoClearHighlights()
    kbBingoClearHeaderHighlights()
    kbBingoBlankAllPairs()
    if (bingoNextBtn) { bingoNextBtn.textContent = "Next question"; bingoNextBtn.disabled = true }
    if (bingoMessageEl) bingoMessageEl.textContent = ""
    resetAndStartBingoTimer()
    kbBingoPresentRandomPair()
  }

  function quitBingoToEdu() {
    try { kbDbg("quitBingoToEdu", kbMapState()) } catch (e) {}
    try {
      if (window.KB_TELEMETRY) window.KB_TELEMETRY.event("kb_game_quit", { kb_game: "practice_times_tables" })
    } catch (e) {}
    if (bingoTimerRunning) pauseBingoTimer()
    showEduScreen()
  }

  window.KB_BINGO = {
    kbBingoSpigotFlowRateU,
    kbBingoFmtSpigotFlowRate,
    kbBingoSpigotKbucksPerHourU,
    kbBingoFmtSpigotKbucksPerHour,
    kbBingoSyncSpigotPaneSize,
    kbBingoUpdateAccounts,
    kbBingoClampFlowRate,
    kbBingoClampParentInput,
    kbBingoClampSponsorInput,
    kbBingoClampSponsorMatch,
    kbUpgradeBingoPairsToButtons,
    kbShuffleInPlace,
    kbBingoUpdateHeader,
    kbBingoEnsurePttHeaderMeta,
    kbBingoClearHeaderHighlights,
    kbBingoSetHeaderHighlights,
    kbBingoEnsurePairResultSpan,
    kbBingoSetPairDisplay,
    kbBingoBlankAllPairs,
    kbBingoEnsurePairs,
    kbBingoClearHighlights,
    kbBingoResetUIForNewQuestion,
    kbBingoRenderAnswers,
    kbBingoLockAnswers,
    kbBingoBuildOptions,
    kbBingoSetCurrentPair,
    kbBingoPresentRandomPair,
    kbBingoOnGuess,
    kbBingoStartNewGame,
    kbBingoStartPracticeMisses,
    quitBingoToEdu,
    renderBingoTimer,
    startBingoTimer,
    pauseBingoTimer,
    stopBingoTimer,
    resetAndStartBingoTimer,
    kbAvailableToEarnBingoU,
  }

})()
