// ========================= //
// KB_DATA                   //
// Static content data       //
// Store and educational     //
// item definitions          //
// ========================= //
window.KB_DATA = {

  // REDEMPTION_STORE_START
  STORE_ITEMS: [
    { name: "Plastic Spider Ring", brand: "Generic", cost: 0.05, image: "assets/images/store/plastic_spider_ring.jpg", rating: 4.5, reviews: "1.2M" },
    { name: "STAEDTLER Eraser", brand: "STAEDTLER", cost: 0.10, image: "assets/images/store/eraser.png", rating: 4.9, reviews: "123.7K" },
    { name: "Baskin-Robbins Gift Card", brand: "Baskin-Robbins", cost: 25.00, image: "assets/images/store/baskin_robbins_gift_card.jpg", rating: 3.2, reviews: "46.9K" },
    { name: "UGG Classic Boots", brand: "UGG", cost: 199.00, image: "assets/images/store/ugg_boots.jpg", rating: 4.1, reviews: "23.8K" },
    { name: "PlayStation 5 Digital", brand: "Sony", cost: 399.00, image: "assets/images/store/ps5_digital.jpg", rating: 4.7, reviews: "36.1K" },
    { name: "iPhone 17", brand: "Apple", cost: 799.00, image: "assets/images/store/iphone_17.png", rating: 4.9, reviews: "18.5K" }
  ],
  // REDEMPTION_STORE_END

  // KB_STORE_MANIFEST_EXPECTED: count=6, minCost=0.05, maxCost=799.00, hash=80dbce7d
  KB_STORE_MANIFEST_EXPECTED: {
    count: 6,
    minCost: "0.05",
    maxCost: "799.00",
    hash: "80dbce7d"
  },

  EDU_ITEMS: [
    { key: "ntc", name: "Name That Country", cost: 0.10, image: "assets/images/games/name_that_country.png" },
    { key: "op", name: "Optics and Photonics", cost: 0.00, image: "assets/images/games/cogs.png" },
    { key: "mm", name: "Multiply Two Numbers", cost: 0.05, image: "assets/images/games/multiplication_table.png" }
  ]

}
