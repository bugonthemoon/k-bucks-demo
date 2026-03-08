// ======================================
// K-BUCKS DEMO
// Module: map_engine
// Responsibility: Leaflet map lifecycle, double-buffer management, and tile heal helpers
// Exports: window.KB_MAP
// ======================================
;(function () {

  // ---- Buffer helpers ----

  function kbGetFrontBuffer() { return kbMapBuffers[kbFrontKey] }
  function kbGetBackBuffer() { return kbMapBuffers[kbBackKey] }

  function kbSetBufferClasses() {
    const f = kbGetFrontBuffer()
    const b = kbGetBackBuffer()
    try {
      if (f && f.div) {
        f.div.classList.add("kbMapFront")
        f.div.classList.remove("kbMapBack")
      }
      if (b && b.div) {
        b.div.classList.add("kbMapBack")
        b.div.classList.remove("kbMapFront")
      }
    } catch (e) {}
  }

  // ---- Map creation and destruction ----

  function kbCreateLeafletMap(containerId) {
    // Allow zooming out far enough to see the full world map even in smaller slots (e.g., 512x512).
    // We compute the "fit-world" zoom for the container and set that as minZoom.
    let kbMinZoom = 2.2
    try {
      const el = document.getElementById(containerId)
      const w = el ? (el.clientWidth || 0) : 0
      const h = el ? (el.clientHeight || 0) : 0
      const size = Math.min(w, h)
      if (size >= 256) {
        const fitZoom = Math.log(size / 256) / Math.log(2)
        // Leaflet uses zoomSnap 0.2, so snap down to the nearest 0.2 to guarantee the world fits.
        kbMinZoom = Math.max(0, Math.min(2.2, Math.floor(fitZoom / 0.2) * 0.2))
      }
    } catch (e) {}

    const m = L.map(containerId, {
      zoomControl: true,
      attributionControl: false,
      minZoom: kbMinZoom,
      maxBounds: WORLD_BOUNDS,
      maxBoundsViscosity: 1.0,
      worldCopyJump: false,
      zoomSnap: 0.2,
      zoomDelta: 0.2,
      preferCanvas: false
    }).setView([20, 0], 2.2)

    // Regression guard: warn if critical Leaflet config values drift from intended values.
    try {
      const kbExpected = { zoomSnap: 0.2, zoomDelta: 0.2, minZoomMax: 2.2 }
      if (m.options.zoomSnap !== kbExpected.zoomSnap)
        console.warn("[KB] Leaflet zoomSnap drifted: expected " + kbExpected.zoomSnap + ", got " + m.options.zoomSnap)
      if (m.options.zoomDelta !== kbExpected.zoomDelta)
        console.warn("[KB] Leaflet zoomDelta drifted: expected " + kbExpected.zoomDelta + ", got " + m.options.zoomDelta)
      if (m.options.minZoom > kbExpected.minZoomMax)
        console.warn("[KB] Leaflet minZoom drifted: expected <= " + kbExpected.minZoomMax + ", got " + m.options.minZoom)
    } catch (e) {}

    try {
      window.kbMapSeq = (window.kbMapSeq || 0) + 1
      m._kbSeq = window.kbMapSeq
    } catch (e) {}

    L.control.attribution({ prefix: "" }).addTo(m)

    const tileLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      detectRetina: true,
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors © CARTO © Leaflet",
      noWrap: true,
      bounds: WORLD_BOUNDS,
      updateWhenIdle: true,
      keepBuffer: 4,
      // Avoid showing gray "missing tile" blocks if a tile request fails or is throttled.
      errorTileUrl: "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="
    }).addTo(m)

    return { map: m, tileLayer: tileLayer }
  }

  function kbDestroyLeafletMap(reason) {
    try { if (typeof kbDbg === "function") kbDbg("destroyLeafletMap", { reason: reason }) } catch (e) {}

    const bufs = [kbMapBuffers.front, kbMapBuffers.back]
    for (const buf of bufs) {
      try {
        if (buf && buf.map) {
          try { buf.map.off() } catch (e) {}
          try { buf.map.remove() } catch (e) {}
        }
      } catch (e) {}
      try {
        if (buf && buf.div) {
          try { delete buf.div._leaflet_id } catch (e) {}
        }
      } catch (e) {}
      try {
        if (buf) {
          buf.map = null
          buf.tileLayer = null
          buf.currentLayer = null
        }
      } catch (e) {}
    }

    map = null
    kbBaseTileLayer = null
  }

  function kbEnsureLeafletMap(reason) {
    if (map) return map

    kbMapBuffers.front.div = document.getElementById(kbMapBuffers.front.id)
    kbMapBuffers.back.div = document.getElementById(kbMapBuffers.back.id)

    const frontPair = kbCreateLeafletMap(kbMapBuffers.front.id)
    kbMapBuffers.front.map = frontPair.map
    kbMapBuffers.front.tileLayer = frontPair.tileLayer

    const backPair = kbCreateLeafletMap(kbMapBuffers.back.id)
    kbMapBuffers.back.map = backPair.map
    kbMapBuffers.back.tileLayer = backPair.tileLayer

    kbFrontKey = "front"
    kbBackKey = "back"
    kbSetBufferClasses()

    map = kbMapBuffers.front.map
    kbBaseTileLayer = kbMapBuffers.front.tileLayer

    // Keep mapDiv pointing to the visible buffer
    try { if (kbMapBuffers.front.div) mapDiv = kbMapBuffers.front.div } catch (e) {}
    try { if (typeof kbDebug !== "undefined" && kbDebug && mapDiv) mapDiv.appendChild(kbDebug) } catch (e) {}

    try { if (typeof kbDbg === "function") kbDbg("ensureLeafletMap", { reason: reason }) } catch (e) {}
    return map
  }

  // ---- Tile healing and invalidation ----

  function kbHealTilesOnBuffer(buf, reason, opts) {
    const o = opts || {}
    const doRedraw = !!o.redraw
    try {
      if (buf && buf.map && buf.map.invalidateSize) {
        try { buf.map.invalidateSize({ animate: false, pan: false }) } catch (e) {
          try { buf.map.invalidateSize() } catch (e2) {}
        }
      }
    } catch (e) {}
    if (doRedraw) {
      try { if (buf && buf.tileLayer && buf.tileLayer.redraw) buf.tileLayer.redraw() } catch (e) {}
    }
    try { if (typeof kbDbg === "function") kbDbg("healTiles", { reason: reason, redraw: doRedraw }) } catch (e) {}
  }

  function kbHealTiles(reason, opts) {
    // Wrapper for legacy calls. Heal both front and back Leaflet buffers if present.
    try { kbHealTilesOnBuffer(kbGetFrontBuffer(), reason || "heal", opts) } catch (e) {}
    try { kbHealTilesOnBuffer(kbGetBackBuffer(), reason || "heal", opts) } catch (e) {}
  }

  // ---- Buffer swap ----

  function kbSwapMapBuffers(reason) {
    try { if (typeof kbDbg === "function") kbDbg("swapBuffers", { reason: reason }) } catch (e) {}

    const tmp = kbFrontKey
    kbFrontKey = kbBackKey
    kbBackKey = tmp
    kbSetBufferClasses()

    const f = kbGetFrontBuffer()
    if (f) {
      map = f.map
      kbBaseTileLayer = f.tileLayer
      try { if (f.div) mapDiv = f.div } catch (e) {}
      try { if (typeof kbDebug !== "undefined" && kbDebug && mapDiv) mapDiv.appendChild(kbDebug) } catch (e) {}
      try { currentLayer = f.currentLayer } catch (e) {}
      try { kbHealTilesOnBuffer(f, "swap") } catch (e) {}
    }

    const b = kbGetBackBuffer()
    try { kbHealTilesOnBuffer(b, "swap-back") } catch (e) {}
  }

  window.KB_MAP = {
    kbGetFrontBuffer,
    kbGetBackBuffer,
    kbSetBufferClasses,
    kbCreateLeafletMap,
    kbHealTilesOnBuffer,
    kbHealTiles,
    kbDestroyLeafletMap,
    kbEnsureLeafletMap,
    kbSwapMapBuffers,
  }

})()
