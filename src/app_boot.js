// ======================================
// K-BUCKS DEMO
// Module: app_boot
// Responsibility: Application boot — event listener wiring and startup initialization
// Exports: window.KB_APP_BOOT
// ======================================
;(function () {

  function init() {
    nextBtn.addEventListener("click", () => {
      try { if (window.KB_TELEMETRY) window.KB_TELEMETRY.event("kb_next_question_press", { kb_game: (kbGeoActiveKey === "oap") ? "optics_and_photonics" : "name_that_country", kb_mode: mode }) } catch (e) {}
      if (gameComplete) return
      nextQuestion()
    })

    quitBtn.addEventListener("click", startPracticeMisses)
    if (startNewBtn) startNewBtn.addEventListener("click", () => {
      // Reset score and country deck, keep wallets and settings.
      startNewGame()
    })

    restartBtn.addEventListener("click", startNewGame)

    redeemBtn.addEventListener("click", quitGameToEdu)
    closeRedeemBtn.addEventListener("click", closeRedeem)
    if (openStoreBtn) openStoreBtn.addEventListener("click", openStoreFromEdu)
    // Geo (NTC/OAP) flow rate parsing should not run on each keystroke.
    // Commit on blur, and on Enter by blurring the field.
    if (flowRateInput) {
      flowRateInput.addEventListener("blur", clampFlowRate)
      flowRateInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return
        e.preventDefault()
        flowRateInput.blur()
      })
    }
    // Parent wallet parsing should not run on each keystroke.
    // Commit when the user presses Enter or when the field loses focus.
    if (parentInput) {
      parentInput.addEventListener("blur", clampParentInput)
      parentInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return
        e.preventDefault()
        // Blur triggers clampParentInput, matching click-outside behavior.
        parentInput.blur()
      })
    }

    if (sponsorInput) {
      sponsorInput.addEventListener("blur", clampSponsorInput)
      sponsorInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return
        e.preventDefault()
        sponsorInput.blur()
      })
    }

    if (sponsorMatchInput) {
      sponsorMatchInput.addEventListener("blur", clampSponsorMatch)
      sponsorMatchInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return
        e.preventDefault()
        sponsorMatchInput.blur()
      })
    }

    // Bingo (Screen 4) wallet controls.
    if (bingoFlowRateInput) {
      bingoFlowRateInput.addEventListener("blur", kbBingoClampFlowRate)
      bingoFlowRateInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return
        e.preventDefault()
        bingoFlowRateInput.blur()
      })
    }
    if (bingoParentInput) {
      bingoParentInput.addEventListener("blur", kbBingoClampParentInput)
      bingoParentInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return
        e.preventDefault()
        bingoParentInput.blur()
      })
    }
    if (bingoSponsorInput) {
      bingoSponsorInput.addEventListener("blur", kbBingoClampSponsorInput)
      bingoSponsorInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return
        e.preventDefault()
        bingoSponsorInput.blur()
      })
    }
    if (bingoSponsorMatchInput) {
      bingoSponsorMatchInput.addEventListener("blur", kbBingoClampSponsorMatch)
      bingoSponsorMatchInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return
        e.preventDefault()
        bingoSponsorMatchInput.blur()
      })
    }
    try { kbBingoUpdateAccounts() } catch (e) {}


    const ro = new ResizeObserver(() => syncMapHeight())
    ro.observe(sideEl)
    window.addEventListener("resize", () => syncMapHeight())

    // ========================= //
    // SECTION: STARTUP          //
    // Initialization            //
    // ========================= //
    // Ensure Screen 1 content is rendered on initial load
    try { showEduScreen() } catch (e) {}

    loadCountries()
      .then(() => {
        // Initialize Geo state to NTC defaults (do not wipe wallets on refresh)
        try { kbGeoLoadState("ntc") } catch (e) {}
flowDec = 2
        if (flowRateInput) flowRateInput.value = fmtFlowInputU(flowU)
        clampFlowRate()
        updateAccounts()
        // Do not auto-start Name That Country on initial load.
        // The game starts when the user presses Play.
        syncMapHeight()
      })
      .catch(err => {
        const m = (err && err.message && String(err.message).includes("Could not load map data")) ? String(err.message) : "Could not load data. Please refresh."
        kbSetUnifiedLoadError(m)
        syncMapHeight()
      })
  }

  window.KB_APP_BOOT = { init }

})()
