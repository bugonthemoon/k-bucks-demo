// ========================= //
// KB_WALLET                 //
// Wallet/persistence layer  //
// Account update helpers    //
// Available-to-earn helpers //
// Flow rate helpers         //
// Clamp/input helpers       //
// ========================= //
;(function () {

  function kbAvailableToEarnOpticsU() {
    const st = kbGeoState && kbGeoState.oap ? kbGeoState.oap : null
    if (!st) return 0
    return kbAvailableToEarnForGameU(st.flowU, st.parentU, st.sponsorU, st.sponsorMatch)
  }

  // Parent + Sponsors combined flow rate for OAP.
  // Returned in KBU per hour (float), not wallet units.
  function spigotFlowRateU() {
    const parentBalU = Number(parentU)
    const parentRateU = Number(flowU)
    if (!Number.isFinite(parentBalU) || parentBalU <= 0) return 0
    if (!Number.isFinite(parentRateU) || parentRateU <= 0) return 0

    const parentRateK = parentRateU / SCALE

    let sponsorRateK = 0
    const sponsorBalU = Number(sponsorU)
    const m = Number(sponsorMatch)
    if (Number.isFinite(sponsorBalU) && sponsorBalU > 0 && Number.isFinite(m) && m > 0) {
      sponsorRateK = parentRateK / m
    }

    return parentRateK + sponsorRateK
  }

  function sponsorFlowRateU() {
    const parentBalU = Number(parentU)
    const parentRateU = Number(flowU)
    if (!Number.isFinite(parentBalU) || parentBalU <= 0) return 0
    if (!Number.isFinite(parentRateU) || parentRateU <= 0) return 0

    const sponsorBalU = Number(sponsorU)
    if (!Number.isFinite(sponsorBalU) || sponsorBalU <= 0) return 0

    const m = Number(sponsorMatch)
    if (!Number.isFinite(m) || m <= 0) return 0

    return (parentRateU / SCALE) / m
  }

  function fmtSponsorFlowRate() {
    return kbFmtKbuRate2(sponsorFlowRateU())
  }

  // Legacy helper, unused, kept for compatibility.
  function spigotFlowRateK() {
    return spigotFlowRateU()
  }

  function fmtSpigotFlowRate() {
    const k = Number(spigotFlowRateU())
    if (!Number.isFinite(k) || k <= 0) return "0.00"
    const u = Math.trunc(k * SCALE)
    return fmtWalletMin2U(u)
  }

  function spigotKbucksPerHourU() {
    // For NTC and MTN, flow rate is per correct answer.
    // Estimate: flow per answer * (193 questions * 3600 sec/hour) / (1158 sec per full game) = flow * 600.
    return Math.trunc(spigotFlowRateU() * 600)
  }

  function fmtSpigotKbucksPerHour() {
    const isOap = (typeof kbGeoActiveKey !== "undefined" && kbGeoActiveKey === "oap")

    // In OAP, show the KBU drop per interval (every KB_OAP_FLOW_EVERY_SEC seconds of watched time).
    if (isOap) {
      const perHourK = Number(spigotFlowRateU())
      if (!Number.isFinite(perHourK) || perHourK <= 0) return "0.00"
      const intervalK = perHourK * Number(KB_OAP_FLOW_EVERY_SEC) / 3600
      return fmtWalletMin2U(Math.trunc(intervalK * SCALE))
    }

    // In NTC/MTN, flow rate is KBU per correct answer. Estimate KBU per hour as flow * 600.
    const perCorrectK = Number(spigotFlowRateU())
    if (!Number.isFinite(perCorrectK) || perCorrectK <= 0) return "0.00"
    const estPerHourK = perCorrectK * 600
    return fmtWalletMin2U(Math.trunc(estPerHourK * SCALE))
  }

  function clampFlowRate() {
    if (!flowRateInput) return

    const raw = String(flowRateInput.value || "")
    let vU = parseUnitsNoRound(raw)
    if (vU < 0) vU = 0
    if (parentU <= 0) vU = 0

    flowU = vU
        try { kbGeoSaveState() } catch (e) {}
    flowRateInput.value = fmtFlowInputU(flowU)

    saveWallet()
    updateAccounts()
  }

  function clampParentInput() {
    if (!parentInput) return
    const raw = String(parentInput.value || "")
    let vU = toMoneyUnits(raw)
    if (vU < 0) vU = 0
    parentU = vU
    try { kbGeoSaveState() } catch (e) {}
    if (parentU <= 0) flowU = 0
    saveWallet()
    // Re-render flow after clamp
    if (flowRateInput) flowRateInput.value = fmtFlowInputU(flowU)
    updateAccounts()
    if (parentInput) parentInput.value = fmtParentU(parentU)}

  function clampSponsorInput() {
    if (!sponsorInput) return
    const raw = String(sponsorInput.value || "")
    let vU = toMoneyUnits(raw)
    if (vU < 0) vU = 0
    sponsorU = vU

    try { kbGeoSaveState() } catch (e) {}
    saveWallet()
    updateAccounts()
    if (sponsorInput && document.activeElement !== sponsorInput) sponsorInput.value = fmtSponsorU(sponsorU)
  }

          function clampSponsorMatch() {
    if (!sponsorMatchInput) return
    const raw = String(sponsorMatchInput.value || "").trim()
    let v = Number(raw)

    // Reject non-numeric or out of range. Keep last valid sponsorMatch.
    if (!Number.isFinite(v) || v < 3 || v > 7) {
      sponsorMatchInput.value = String(sponsorMatch)
      return
    }

    sponsorMatch = v

    try { kbGeoSaveState() } catch (e) {}
    // Keep whatever the user typed while focused. Otherwise show the numeric value.
    if (document.activeElement !== sponsorMatchInput) sponsorMatchInput.value = String(sponsorMatch)

    saveWallet()
    updateAccounts()
  }

  // Live-update sponsor match while typing so derived lines stay accurate.
  // Does not rewrite the input value while it is focused.
  function kbSponsorMatchLiveUpdate(inputEl) {
    try {
      if (!inputEl) return
      const raw = String(inputEl.value || "").trim()
      if (!raw) return
      const v = Number(raw)
      if (!Number.isFinite(v)) return
      const clamped = Math.min(7, Math.max(3, v))
      sponsorMatch = clamped
      try { kbGeoSaveState() } catch (e) {}
      saveWallet()
      updateAccounts()
    } catch (e) {}
  }

  function loadWallet() {
    try {
      const raw = localStorage.getItem("kbucks_wallet_v14")
      if (!raw) return
      const obj = JSON.parse(raw)
      if (Number.isFinite(obj.parentU)) parentU = obj.parentU
      if (Number.isFinite(obj.sponsorU)) sponsorU = obj.sponsorU
      if (Number.isFinite(obj.sponsorMatch)) sponsorMatch = Math.max(0, Number(obj.sponsorMatch))
      if (Number.isFinite(obj.kbGlobalChildU)) kbGlobalChildU = obj.kbGlobalChildU
      if (Number.isFinite(obj.devU)) devU = obj.devU
      if (Number.isFinite(obj.kbGlobalPlatformU)) kbGlobalPlatformU = obj.kbGlobalPlatformU
      if (Number.isFinite(obj.flowU)) flowU = obj.flowU
      if (Number.isFinite(obj.flowDec)) flowDec = obj.flowDec
      if (Number.isFinite(obj.devCarry)) devCarry = obj.devCarry
      if (Number.isFinite(obj.platCarry)) platCarry = obj.platCarry
    } catch (e) {}
  }

  function saveWallet() {
    try {
      localStorage.setItem("kbucks_wallet_v14", JSON.stringify({ parentU, kbGlobalChildU, devU, kbGlobalPlatformU, flowU, flowDec, devCarry, platCarry , sponsorU , sponsorMatch}))
    } catch (e) {}
  }

  function resetWalletDefaults() {
    // Defaults on every refresh
    parentU = 0 * SCALE
    sponsorU = 0
    sponsorMatch = 5
    kbGlobalChildU = 0
    devU = 0
    kbGlobalPlatformU = 0
    flowU = toUnits("0.00")  // 0.00
    flowDec = 2
    devCarry = 0
    platCarry = 0
    if (flowRateInput) flowRateInput.value = "0.00"
    if (parentInput) parentInput.value = "0.00"
    if (sponsorInput) sponsorInput.value = "0.00"
    if (sponsorMatchInput) sponsorMatchInput.value = "5"
    saveWallet()
    updateAccounts()
  }

  function kbAvailableToEarnNtcU() {
    const st = kbGeoState && kbGeoState.ntc ? kbGeoState.ntc : null
    if (!st) return 0
    return kbAvailableToEarnForGameU(st.flowU, st.parentU, st.sponsorU, st.sponsorMatch)
  }

  function kbComputeAvailableToEarnU() {
    return kbAvailableToEarnNtcU() + kbAvailableToEarnOpticsU() + kbAvailableToEarnBingoU()
  }

  function kbUpdateGlobalBalances() {
    if (redeemBalanceEl) {
      redeemBalanceEl.textContent =
        "Available for the Child to redeem: " + "KBU " + fmtWalletMin2U(kbGlobalChildU)
    }
    if (earnBalanceEl) {
      earnBalanceEl.textContent =
        "Available for the Child to earn (from Parent + Education Sponsors): " + "KBU " + fmtWalletMin2U(kbComputeAvailableToEarnU())
    }
  }

  function updateAccounts() {
    if (parentU <= 0) flowU = 0
    if (parentInput && document.activeElement !== parentInput) parentInput.value = fmtParentU(parentU)
    if (sponsorInput && document.activeElement !== sponsorInput) sponsorInput.value = fmtSponsorU(sponsorU)

    if (flowRateInput && document.activeElement !== flowRateInput) flowRateInput.value = fmtFlowInputU(flowU)
    if (sponsorMatchInput && document.activeElement !== sponsorMatchInput) sponsorMatchInput.value = String(sponsorMatch)

    if (sponsorFlowRateOut) sponsorFlowRateOut.textContent = fmtSponsorFlowRate()
    if (spigotFlowRateOut) spigotFlowRateOut.textContent = fmtSpigotFlowRate()
    if (spigotKbucksPerHourOut) spigotKbucksPerHourOut.textContent = fmtSpigotKbucksPerHour()
    if (childAcctEl) childAcctEl.textContent = "KBU balance: " + fmtWalletMin2U(kbGlobalChildU)
    if (devAcctEl) devAcctEl.textContent = "KBU balance: " + fmtWalletMin2U(devU)
    if (platformAcctEl) platformAcctEl.textContent = "KBU balance: " + fmtWalletMin2U(kbGlobalPlatformU)
    // Empty-wallet highlight disabled for now
    // if (parentInput) parentInput.classList.toggle("emptyWallet", parentU <= 0)
    // if (sponsorInput) sponsorInput.classList.toggle("emptyWallet", sponsorU <= 0)
    kbUpdateGlobalBalances()
    syncSpigotPaneSize()


  }

  window.KB_WALLET = {
    kbAvailableToEarnOpticsU,
    spigotFlowRateU,
    sponsorFlowRateU,
    fmtSponsorFlowRate,
    spigotFlowRateK,
    fmtSpigotFlowRate,
    spigotKbucksPerHourU,
    fmtSpigotKbucksPerHour,
    clampFlowRate,
    clampParentInput,
    clampSponsorInput,
    clampSponsorMatch,
    kbSponsorMatchLiveUpdate,
    loadWallet,
    saveWallet,
    resetWalletDefaults,
    kbAvailableToEarnNtcU,
    kbComputeAvailableToEarnU,
    kbUpdateGlobalBalances,
    updateAccounts,
  }

})()
