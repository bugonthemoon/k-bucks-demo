// ======================================
// K-BUCKS DEMO
// Module: constants
// Responsibility: Runtime constants, asset paths, and Leaflet style definitions
// Exports: window.KB_CONST
// ======================================
window.KB_CONST = {
  SCALE: 1000000000,
  KB_ZOOM_OUT_AFTER_FIT: 0.25,
  KB_OAP_FLOW_EVERY_SEC: 10,
  KB_OAP_FLOW_EVERY_MS: 10000,
  UN_MEMBERS_URL: "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,unMember",
  ORANGE_STYLE: {
    color: "#d08a00",
    weight: 3,
    fill: true,
    fillColor: "#f2a400",
    fillOpacity: 1.0
  },
  kbOapVideoByKey: {
    laser: "assets/videos/how_a_laser_works.webm",
    fiber: "assets/videos/how_a_fiber_optic_cable_works.webm",
  },
  COUNTRIES_GEOJSON_PATH: "data/countries.geojson"
}
