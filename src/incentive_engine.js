// ======================================
// K-BUCKS DEMO
// Module: incentive_engine
// Responsibility: KBU unit conversion, formatting, and sponsor/wallet math
// Exports: window.KB_ENGINE
// ======================================
;(function () {
  const SCALE = window.KB_CONST.SCALE

  // Wallet display formatter:
  // - comma separators for integer part
  // - at least 2 decimals
  // - more decimals only when they contain non-zero digits
  // - no rounding
  function fmtWalletMin2U(u) {
    const x = Number(u)
    if (!Number.isFinite(x) || x <= 0) return "0.00"

    const intPart = Math.floor(x / SCALE)
    const fracUnits = Math.floor(x % SCALE)

    const intStr = String(intPart).replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    // Build 9 digits of fractional precision.
    let frac = String(fracUnits).padStart(9, "0")
    // Trim trailing zeros, but keep at least 2 digits.
    frac = frac.replace(/0+$/, "")
    if (frac.length < 2) frac = frac.padEnd(2, "0")

    // If everything was zeros, show .00
    if (!frac || /^0+$/.test(frac)) return intStr + ".00"

    return intStr + "." + frac
  }

  function kbFmtKbuRate2(x) {
    const n = Number(x)
    if (!Number.isFinite(n) || n <= 0) return "0.00"
    // Keep two decimals for consistency with balances and readability.
    return n.toFixed(2)
  }

  function kbFmtKbuDrop2(x) {
    const n = Number(x)
    if (!Number.isFinite(n) || n <= 0) return "0.00"
    return n.toFixed(2)
  }

  function fmtParentU(u) {
    return fmtWalletMin2U(u)
  }

  function fmtSponsorU(u) {
    return fmtWalletMin2U(u)
  }

  function fmtOtherU(u) {
    return fmtWalletMin2U(u)
  }

  function fmtMin2Max5(x) {
    const v = Number(x)
    if (!Number.isFinite(v) || v <= 0) return "0.00"
    const parts = v.toFixed(5).split(".")
    let frac = parts[1].replace(/0+$/, "")
    if (frac.length < 2) frac = frac.padEnd(2, "0")
    return parts[0] + "." + frac
  }

  // Format an internal-units value (SCALE = 1e9) with comma separators and minimal decimals.
  // No rounding, no extra trailing zeros.
  function fmtUnitsTrimU(u) {
    const x = Number(u)
    if (!Number.isFinite(x) || x <= 0) return "0.00"

    const intPart = Math.floor(x / SCALE)
    let fracUnits = Math.floor(x % SCALE)

    const intStr = String(intPart).replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    if (!fracUnits) return intStr

    let frac = String(fracUnits).padStart(9, "0")
    frac = frac.replace(/0+$/, "")
    if (!frac) return intStr

    return intStr + "." + frac
  }

  // Format internal units with comma separators and minimal decimals.
  // No padding zeros, no rounding.
  function fmtUnitsFlex(u) {
    const x = Number(u)
    if (!Number.isFinite(x) || x <= 0) return "0.00"

    const intPart = Math.floor(x / SCALE)
    let frac = String(Math.floor(x % SCALE)).padStart(9, "0")
    frac = frac.replace(/0+$/, "")

    const intStr = String(intPart).replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    if (!frac) return intStr
    return intStr + "." + frac
  }

  function fmtFlow(u, decimals) {
    return fmtUnitsFlex(u)
  }

  // Format flow rate for the input box.
  // At least 2 decimals, keep extra precision (up to 9 decimals), no rounding.
  function fmtFlowInputU(u) {
    return fmtWalletMin2U(u)
  }

  function toUnits(val) {
    const raw = String(val == null ? "" : val)
    const cleaned = raw.replace(/,/g, "").trim()
    const x = Number(cleaned)
    if (!Number.isFinite(x)) return 0
    return Math.max(0, Math.round(x * SCALE))
  }

  // Parse a money input string into internal units, truncating (not rounding) to 2 decimals.
  function toMoneyUnits(val) {
    const raw0 = String(val == null ? "" : val)
    const cleaned = raw0.replace(/,/g, "").trim()
    if (!cleaned) return 0

    let sign = 1
    let s = cleaned
    if (s[0] === "-") { sign = -1; s = s.slice(1) }
    if (s[0] === "+") { s = s.slice(1) }

    const parts = s.split(".")
    const intStr = parts[0] || "0"
    if (!/^[0-9]+$/.test(intStr)) {
      const x = Number(cleaned)
      if (!Number.isFinite(x)) return 0
      const truncated = Math.trunc(x * 100) / 100
      return Math.max(0, Math.trunc(truncated * SCALE))
    }

    let frac = parts.length > 1 ? parts[1] : ""
    // Keep only digits, then keep at most 2, then pad to 2 for cents math.
    frac = String(frac).replace(/[^0-9]/g, "").slice(0, 2)
    while (frac.length < 2) frac += "0"

    const intPart = Number(intStr)
    const cents = Number(frac || "0")

    const units = sign * (intPart * SCALE + cents * (SCALE / 100))
    return Math.max(0, units)
  }

  // Parse a decimal string into internal units without rounding.
  // Keeps up to 9 fractional digits (SCALE = 1e9). Extra digits are dropped.
  function parseUnitsNoRound(val) {
    const raw0 = String(val == null ? "" : val)
    const cleaned = raw0.replace(/,/g, "").trim()
    if (!cleaned) return 0

    let s = cleaned
    let sign = 1
    if (s[0] === "-") { sign = -1; s = s.slice(1) }
    if (s[0] === "+") { s = s.slice(1) }

    const parts = s.split(".")
    const intStr = (parts[0] || "0").replace(/[^0-9]/g, "")
    let fracStr = parts.length > 1 ? parts[1] : ""
    fracStr = String(fracStr).replace(/[^0-9]/g, "")

    if (!intStr) return 0

    fracStr = fracStr.slice(0, 9)
    while (fracStr.length < 9) fracStr += "0"

    const intPart = Number(intStr)
    const fracPart = Number(fracStr)

    if (!Number.isFinite(intPart) || !Number.isFinite(fracPart)) return 0

    const u = sign * (intPart * SCALE + fracPart)
    return Math.max(0, u)
  }

  // Global helpers, shared across games
  function kbSponsorTagAlongU(parentUVal, sponsorUVal, matchRatioVal) {
    const p = Number(parentUVal) || 0
    const s = Number(sponsorUVal) || 0
    const r = Number(matchRatioVal) || 0
    if (p <= 0) return 0
    if (s <= 0) return 0
    if (r <= 0) return 0
    const want = Math.floor(p / r)
    return Math.min(s, want)
  }

  // "Child can earn (from Parent + Sponsors)" is global and sums both games.
  function kbAvailableToEarnForGameU(flowRateUVal, parentUVal, sponsorUVal, matchRatioVal) {
    const flow = Number(flowRateUVal) || 0
    if (!Number.isFinite(flow) || flow <= 0) return 0

    const p = Number(parentUVal) || 0
    if (!Number.isFinite(p) || p <= 0) return 0

    const sponsorAdd = kbSponsorTagAlongU(p, sponsorUVal, matchRatioVal)
    return (p + sponsorAdd) * 0.75
  }

  window.KB_ENGINE = {
    toUnits,
    toMoneyUnits,
    parseUnitsNoRound,
    fmtWalletMin2U,
    kbFmtKbuRate2,
    kbFmtKbuDrop2,
    fmtUnitsTrimU,
    fmtUnitsFlex,
    fmtMin2Max5,
    fmtParentU,
    fmtSponsorU,
    fmtOtherU,
    fmtFlow,
    fmtFlowInputU,
    kbSponsorTagAlongU,
    kbAvailableToEarnForGameU,
  }
})()
