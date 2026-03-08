// ======================================
// K-BUCKS DEMO
// Module: navigation
// Responsibility: Screen navigation — show/hide game, store, edu, and bingo screens
// Exports: window.KB_NAV
// ======================================
;(function () {

  function showGameScreen(whichKey) {

    const key = (whichKey === "oap") ? "oap" : "ntc"
    kbGeoLoadState(key)
    try { kbDbg("showGameScreen", kbMapState()) } catch (e) {}


    if (currentScreen === "bingo") {
      if (!bingoTimerStopped && bingoTimerRunning) pauseBingoTimer()
    }
currentScreen = "game"
    try { if (window.KB_TELEMETRY) KB_TELEMETRY.screen((kbGeoActiveKey === "oap") ? "optics_and_photonics" : "name_that_country") } catch (e) {}
    if (screenGameEl) screenGameEl.style.display = ""
    if (screenStoreEl) screenStoreEl.style.display = "none"
    if (screenEduEl) screenEduEl.style.display = "none"

    if (screenBingoEl) screenBingoEl.style.display = "none"

    try { kbApplyGeoContextUI() } catch (e) {}
    if (kbGeoActiveKey === "oap") { try { kbOapInitWatchTimer() } catch (e) {} try { kbOapResetOnEnter() } catch (e) {} }
    try { updateScoreDisplay() } catch (e) {}
          try { kbOapApplyPeriodicFlow() } catch (e) {}

    // Recreate Leaflet map fresh each time we enter the game screen.
    // OAP does not use maps.
    try { kbDestroyLeafletMap("showGameScreen") } catch (e) {}
    if (kbGeoActiveKey !== "oap") {
      try { kbEnsureLeafletMap("showGameScreen") } catch (e) {}
    } else {
      try { map = null } catch (e) {}
    }

    try { syncMapHeight() } catch (e) {}
    try { updateFooterDebugAll() } catch (e) {}
    try { kbScheduleDebugUpdate() } catch (e) {}
  }

  function showStoreScreen() {

    try { if (currentScreen === "game") kbGeoSaveState() } catch (e) {}
    try { kbDbg("showStoreScreen", kbMapState()) } catch (e) {}


    if (currentScreen === "bingo") {
      if (!bingoTimerStopped && bingoTimerRunning) pauseBingoTimer()
    }
currentScreen = "store"
    try { if (window.KB_TELEMETRY) KB_TELEMETRY.screen("redemption_store") } catch (e) {}
    if (screenGameEl) screenGameEl.style.display = "none"
    if (screenStoreEl) screenStoreEl.style.display = ""
    if (screenEduEl) screenEduEl.style.display = "none"

    if (screenBingoEl) screenBingoEl.style.display = "none"

    try { kbUpdateGlobalBalances() } catch (e) {}
    try { updateFooterDebugAll() } catch (e) {}
    try { kbScheduleDebugUpdate() } catch (e) {}
  }

  function showEduScreen() {

    try { if (currentScreen === "game") kbGeoSaveState() } catch (e) {}
    try { kbDbg("showEduScreen", kbMapState()) } catch (e) {}


    if (currentScreen === "bingo") {
      if (!bingoTimerStopped && bingoTimerRunning) pauseBingoTimer()
    }
currentScreen = "edu"
    try { if (window.KB_TELEMETRY) KB_TELEMETRY.screen("educational_content") } catch (e) {}
    if (screenGameEl) screenGameEl.style.display = "none"
    if (screenStoreEl) screenStoreEl.style.display = "none"
    if (screenEduEl) screenEduEl.style.display = ""

    if (screenBingoEl) screenBingoEl.style.display = "none"
    try { updateFooterDebugAll() } catch (e) {}
    try { kbScheduleDebugUpdate() } catch (e) {}
    try { updateAccounts() } catch (e) {}
    try { renderEdu() } catch (e) {}
  }

  function showBingoScreen() {

    try { if (currentScreen === "game") kbGeoSaveState() } catch (e) {}
    try { kbDbg("showBingoScreen", kbMapState()) } catch (e) {}


    if (currentScreen === "game") {
      if (timerRunning) pauseTimer()
    }
currentScreen = "bingo"
    try { if (window.KB_TELEMETRY) KB_TELEMETRY.screen("practice_times_tables") } catch (e) {}
    if (screenGameEl) screenGameEl.style.display = "none"
    if (screenStoreEl) screenStoreEl.style.display = "none"
    if (screenEduEl) screenEduEl.style.display = "none"
    if (screenBingoEl) screenBingoEl.style.display = ""
    try { updateFooterDebugAll() } catch (e) {}
    try { kbScheduleDebugUpdate() } catch (e) {}
    try { updateAccounts() } catch (e) {}
    try { kbBingoUpdateAccounts() } catch (e) {}
    try { kbUpgradeBingoPairsToButtons() } catch (e) {}
    try { kbBingoStartNewGame() } catch (e) {}
  }

  function isRedeemOpen() {
    return currentScreen === "store"
  }

  window.KB_NAV = {
    showGameScreen,
    showStoreScreen,
    showEduScreen,
    showBingoScreen,
    isRedeemOpen,
  }

})()
