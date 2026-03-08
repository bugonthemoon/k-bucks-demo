// ======================================
// K-BUCKS DEMO
// Module: activity_state
// Responsibility: Shared NTC/OAP activity state, context switching, video source and inset sync
// Exports: window.KB_ACTIVITY
// ======================================
;(function () {

  function kbOapSetVideoSrcByKey(videoKey) {
    const v = document.getElementById("oapVideo")
      try { kbOapHookVideoEventsOnce(v) } catch (e) {}
    if (!v) return
    const src = videoKey ? kbOapVideoByKey[videoKey] : ""
    if (!src) {
      try { v.pause() } catch (e) {}
      v.removeAttribute("src")
      v.load()
    function kbOapOnceCanplaySync() {
      v.removeEventListener("canplay", kbOapOnceCanplaySync)
      kbScheduleOapVideoInsetSync()
      kbOapSyncVideoTopInset()
    }
    v.addEventListener("canplay", kbOapOnceCanplaySync)

      return
    }
    if (v.getAttribute("src") !== src) {
      v.setAttribute("src", src)
      v.load()
    }
    try {
      v.currentTime = 0
    } catch (e) {}
    const p = v.play()
    if (p && typeof p.catch === "function") p.catch(() => {})
  }

function kbGeoSaveState() {
    const st = kbGeoState[kbGeoActiveKey]
    if (!st) return
    st.rounds = rounds
    st.correctCount = correctCount
    st.gameComplete = gameComplete
    st.mode = mode
    st.parentU = parentU
    st.sponsorU = sponsorU
    st.flowU = flowU
    st.sponsorMatch = sponsorMatch
    st.devCarry = devCarry
    st.platCarry = platCarry
    st.devU = devU
    st.selectedVideoKey = kbGeoSelectedVideoKey
  }

  function kbGeoLoadState(key) {
    if (!kbGeoState[key]) kbGeoState[key] = { rounds: 0, correctCount: 0, gameComplete: false, mode: "normal", parentU: 0, sponsorU: 0, flowU: 0, sponsorMatch: 5, devCarry: 0, platCarry: 0, devU: 0, selectedVideoKey: "" }
    kbGeoSaveState()
    kbGeoActiveKey = key
    const st = kbGeoState[kbGeoActiveKey]
    rounds = st.rounds
    correctCount = st.correctCount
    gameComplete = st.gameComplete
    mode = st.mode
    parentU = (typeof st.parentU === "number") ? st.parentU : 0
    sponsorU = (typeof st.sponsorU === "number") ? st.sponsorU : 0
    flowU = (typeof st.flowU === "number") ? st.flowU : 0
    sponsorMatch = (typeof st.sponsorMatch === "number") ? st.sponsorMatch : 5
    devCarry = (typeof st.devCarry === "number") ? st.devCarry : 0
    platCarry = (typeof st.platCarry === "number") ? st.platCarry : 0
    devU = (typeof st.devU === "number") ? st.devU : 0
    kbGeoSelectedVideoKey = (typeof st.selectedVideoKey === "string") ? st.selectedVideoKey : ""
    try {
      if (parentInput) parentInput.value = fmtParentU(parentU)
      if (sponsorInput) sponsorInput.value = fmtSponsorU(sponsorU)
      if (flowRateInput) flowRateInput.value = fmtFlowInputU(flowU)
      if (sponsorMatchInput) sponsorMatchInput.value = String(sponsorMatch)
    } catch (e) {}
    try { updateAccounts() } catch (e) {}
    try {
      const titleEl = document.getElementById("geoTitle")
      if (titleEl) titleEl.textContent = (kbGeoActiveKey === "oap") ? "Optics and Photonics" : "Name That Country"
    } catch (e) {}
  }








  function kbOapSyncVideoTopInset() {
    if (kbGeoActiveKey !== "oap") return
    const mapSlot = document.getElementById("mapSlot")
    const prompt = document.getElementById("geoPromptHeader")
    const v = document.getElementById("oapVideo")
    if (!mapSlot || !prompt || !v) return

    // Make absolute positioning relative to the 512x512 box.
    mapSlot.style.setProperty("position", "relative", "important")
    mapSlot.style.setProperty("overflow", "hidden", "important")

    const mapRect = mapSlot.getBoundingClientRect()
    const promptRect = prompt.getBoundingClientRect()

    // Align the top of the video element to the top of the prompt text in the middle pane.
    const topInsetRaw = Math.max(0, Math.round(promptRect.top - mapRect.top))

    // Visual alignment tweak: prompt text sits ~5px lower than the raw geometry suggests.
    const topInset = topInsetRaw + 5

    // Size the video element so the native controls sit directly under the rendered video frame.
    // Use actual aspect ratio when known, otherwise fall back to 16:9 so layout is stable immediately.
    const controlsH = 56
    const fallbackAr = 9 / 16
    const ar = (v.videoWidth && v.videoHeight) ? (v.videoHeight / v.videoWidth) : fallbackAr
    const contentH = Math.round(mapRect.width * ar)

    const maxH = Math.max(120, Math.round(mapRect.height - topInset - 8))
    const extraPad = 16
    const h = Math.min(maxH, Math.max(120, contentH + controlsH + extraPad))

// Force overrides even if older CSS uses !important.
    v.style.setProperty("position", "absolute", "important")
    v.style.setProperty("left", "0px", "important")
    v.style.setProperty("top", topInset + "px", "important")
    v.style.setProperty("width", "100%", "important")
    v.style.setProperty("height", h + "px", "important")
    v.style.setProperty("max-height", h + "px", "important")
    v.style.setProperty("transform", "none", "important")
    v.style.setProperty("object-fit", "contain", "important")
    v.style.setProperty("object-position", "top center", "important")
    v.style.setProperty("display", "block", "important")
    v.style.setProperty("z-index", "1", "important")
  }

function kbScheduleOapVideoInsetSync() {
    if (kbOapVideoInsetRaf) return
    kbOapVideoInsetRaf = requestAnimationFrame(() => {
      kbOapVideoInsetRaf = 0
      kbOapSyncVideoTopInset()
    })
  }

function kbApplyGeoContextUI() {
    const isOap = kbGeoActiveKey === "oap"
    if (isOap) {
      try { stopTimer() } catch (e) {}
    }
    const screen = document.getElementById("screenGame")
    if (screen) {
      if (isOap) screen.classList.add("kbOapMode")
      else screen.classList.remove("kbOapMode")
    }

    const statusEl = document.getElementById("status")
    const timerEl = document.getElementById("timer")
    if (statusEl) statusEl.style.display = isOap ? "none" : ""
    if (timerEl) timerEl.style.display = isOap ? "none" : ""

    const promptEl = document.getElementById("geoPromptHeader")
    if (promptEl) promptEl.textContent = isOap ? "Select a video:" : "Select an answer:"
    if (isOap) kbScheduleOapVideoInsetSync()
    if (isOap) setTimeout(() => kbOapSyncVideoTopInset(), 0)

    const nextBtnEl = document.getElementById("nextBtn")
    const missesBtnEl = document.getElementById("quitBtn") // Misses button, historical id
    const newGameBtnEl = document.getElementById("startNewBtn")
    if (nextBtnEl) nextBtnEl.style.display = isOap ? "none" : ""
    if (missesBtnEl) missesBtnEl.style.display = isOap ? "none" : ""
    if (newGameBtnEl) newGameBtnEl.style.display = isOap ? "none" : ""

    const bottomBarEl = document.querySelector("#screenGame .quizBottomBar")
    if (bottomBarEl) bottomBarEl.classList.toggle("kbOapBottomBar", isOap)

    const oapAttrWrap = document.getElementById("oapAttributionWrap")
    if (oapAttrWrap) oapAttrWrap.style.display = isOap ? "" : "none"

    const v = document.getElementById("oapVideo")
    if (v) {
      if (!isOap) {
        kbOapSetVideoSrcByKey("")
      } else {
        kbOapSetVideoSrcByKey(kbGeoSelectedVideoKey || "")

    kbScheduleOapVideoInsetSync()
      }
    }

    const flowLabelEl = document.getElementById("flowRateLabelText")
    if (flowLabelEl) {
      flowLabelEl.textContent = isOap ? "Flow rate (KBU per hour of watching): " : "Flow rate (KBU per correct answer):"
    }

    const kbuLineLabelEl = document.getElementById("spigotKbucksPerHourLabel")
    if (kbuLineLabelEl) {
      kbuLineLabelEl.textContent = isOap ? ("KBU drop every " + String(KB_OAP_FLOW_EVERY_SEC) + " seconds: ") : "KBU per hour (estimate): "
    }
  }

  function kbOapClearSelectedVideo() {
    try { kbGeoSelectedVideoKey = "" } catch (e) {}
    try { kbOapSelectedBulletText = "" } catch (e) {}
    try {
      const answersEl = document.getElementById("answers")
      if (!answersEl) return
      const btns = answersEl.querySelectorAll(".ansBtn")
      btns.forEach((b) => b.classList.remove("selected"))
    } catch (e) {}
  }

  window.KB_ACTIVITY = {
    kbOapSetVideoSrcByKey,
    kbGeoSaveState,
    kbGeoLoadState,
    kbOapSyncVideoTopInset,
    kbScheduleOapVideoInsetSync,
    kbApplyGeoContextUI,
    kbOapClearSelectedVideo,
  }

})()
