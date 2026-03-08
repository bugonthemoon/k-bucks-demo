// ======================================
// K-BUCKS DEMO
// Module: engine_registry
// Responsibility: Central metadata registry for game engines
// Exports: window.KB_REGISTRY
// ======================================
;(function () {

  const _engines = []

  function register(entry) {
    if (!entry || typeof entry !== "object") throw new Error("KB_REGISTRY.register: entry must be an object")
    var missing = ["key", "displayName", "namespace", "screen"].filter(function (f) { return !entry[f] })
    if (missing.length) throw new Error("KB_REGISTRY.register: missing required field(s): " + missing.join(", "))
    if (_engines.some(function (e) { return e.key === entry.key })) throw new Error("KB_REGISTRY.register: duplicate key \"" + entry.key + "\"")
    _engines.push(entry)
  }

  function get(key) {
    return _engines.find(function (e) { return e.key === key }) || null
  }

  function getAll() {
    return _engines.slice()
  }

  function has(key) {
    return _engines.some(function (e) { return e.key === key })
  }

  function getOrThrow(key) {
    var entry = get(key)
    if (!entry) throw new Error("KB_REGISTRY.getOrThrow: no engine registered for key \"" + key + "\"")
    return entry
  }

  window.KB_REGISTRY = { register, get, getAll, has, getOrThrow }

  // ---- Current engine registrations ----

  register({
    key:             "ntc",
    displayName:     "Name That Country",
    namespace:       "KB_NTC",
    screen:          "game",
    usesMap:         true,
    usesWalletFlow:  true,
  })

  register({
    key:             "oap",
    displayName:     "Optics & Photonics",
    namespace:       "KB_OAP",
    screen:          "game",
    usesMap:         false,
    usesWalletFlow:  true,
  })

  register({
    key:             "bingo",
    displayName:     "Practice Times Tables",
    namespace:       "KB_BINGO",
    screen:          "bingo",
    usesMap:         false,
    usesWalletFlow:  true,
  })

})()
