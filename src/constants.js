// ======================================
// K-BUCKS DEMO
// Module: constants
// Responsibility: Runtime constants, asset paths, and Leaflet style definitions
// Exports: window.KB_CONST
// ======================================
window.KB_CONST = {

  // ---- Wallet and gameplay ----
  SCALE: 1000000000,

  // ---- OAP flow timing ----
  KB_OAP_FLOW_EVERY_SEC: 10,
  KB_OAP_FLOW_EVERY_MS:  10000,

  // ---- Map config ----
  KB_ZOOM_OUT_AFTER_FIT: 0.25,
  ORANGE_STYLE: {
    color: "#d08a00",
    weight: 3,
    fill: true,
    fillColor: "#f2a400",
    fillOpacity: 1.0
  },

  // ---- Asset paths ----
  COUNTRIES_GEOJSON_PATH: "data/countries.geojson",
  UN_MEMBERS_URL: "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,unMember",
  kbOapVideoByKey: {
    laser: "assets/videos/how_a_laser_works.webm",
    fiber: "assets/videos/how_a_fiber_optic_cable_works.webm",
  },

  // ---- Build version ----
  KB_BUILD_VERSION: window.KB_BUILD_VERSION || "",

  // ---- Leaflet guardrail values ----
  // Expected Leaflet config — used by the regression guard in map_engine.js.
  // Do not change these without also changing the matching L.map() options.
  KB_LEAFLET_ZOOM_SNAP:    0.2,
  KB_LEAFLET_ZOOM_DELTA:   0.2,
  KB_LEAFLET_MIN_ZOOM_MAX: 2.2,

}
