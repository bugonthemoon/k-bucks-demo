// ======================================
// K-BUCKS DEMO
// Module: engine_registry
// Responsibility: Central metadata registry for game engines
// Exports: window.KB_REGISTRY
// ======================================
;(function () {

  const _engines = []

  function register(entry) {
    _engines.push(entry)
  }

  function get(key) {
    return _engines.find(function (e) { return e.key === key }) || null
  }

  function getAll() {
    return _engines.slice()
  }

  window.KB_REGISTRY = { register, get, getAll }

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
