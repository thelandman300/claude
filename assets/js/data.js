/* ===========================================================================
   homesforsalewestlakevillage.com — Sample data layer
   ---------------------------------------------------------------------------
   This file holds placeholder market data and listings used to power the site
   before a live MLS feed is connected. Everything here is illustrative sample
   data for Westlake Village, CA. When the MLS / IDX feed is wired up, replace
   the contents of WLV.listings and WLV.marketStats with the live source.
   =========================================================================== */
window.WLV = window.WLV || {};

/* ---- Live market snapshot (sample) ------------------------------------- */
WLV.marketStats = {
  medianPrice: 1545000,
  activeListings: 38,
  avgDaysOnMarket: 21,
  medianPricePerSqft: 612,
  monthOverMonth: 2.4,          // % change in median price
  updated: "May 2026"
};

/* ---- Neighborhoods ----------------------------------------------------- */
WLV.neighborhoods = [
  {
    id: "north-ranch",
    name: "North Ranch",
    tagline: "Gated estates & championship golf",
    medianPrice: 2650000,
    blurb:
      "North Ranch is Westlake Village's premier luxury enclave — sprawling " +
      "estates, equestrian trails, and the North Ranch Country Club golf course. " +
      "Expect privacy, acreage, and architecturally significant homes.",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "the-trails",
    name: "The Trails",
    tagline: "Family-friendly & walkable",
    medianPrice: 1485000,
    blurb:
      "Tucked against the hills, The Trails offers a tight-knit community feel " +
      "with top-rated schools, parks, and easy access to hiking. A favorite for " +
      "growing families relocating from LA County.",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "westlake-island",
    name: "Westlake Island",
    tagline: "Waterfront living on the lake",
    medianPrice: 2980000,
    blurb:
      "An exclusive man-made island community on Westlake Lake. Private docks, " +
      "water views, and a resort lifestyle minutes from the village. The most " +
      "coveted waterfront addresses in the city.",
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "first-neighborhood",
    name: "First Neighborhood",
    tagline: "Original Westlake charm",
    medianPrice: 1295000,
    blurb:
      "The community that started it all — mature trees, greenbelts, a private " +
      "pool, and unbeatable proximity to the lake and the village shops.",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "three-springs",
    name: "Three Springs",
    tagline: "Modern hillside homes",
    medianPrice: 1725000,
    blurb:
      "Newer construction with open floor plans, canyon views, and quick freeway " +
      "access. Popular with professionals and commuters.",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "lakeshore",
    name: "Lakeshore",
    tagline: "Townhomes & lake access",
    medianPrice: 985000,
    blurb:
      "Lock-and-leave townhomes and condos with lake access — an ideal entry " +
      "point into the Westlake Village market for downsizers and first-time buyers.",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
  }
];

/* ---- Listings (sample) ------------------------------------------------- */
WLV.listings = [
  {
    id: "wlv-001",
    address: "1428 Lake Sherwood Dr",
    neighborhood: "westlake-island",
    price: 3295000,
    beds: 5, baths: 5.5, sqft: 5380, lotSqft: 12500,
    type: "Single Family",
    status: "Active",
    year: 2016,
    daysOnMarket: 9,
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    blurb:
      "Stunning contemporary waterfront estate with private dock, infinity pool, " +
      "and walls of glass framing the lake."
  },
  {
    id: "wlv-002",
    address: "2105 Upper Ranch Rd",
    neighborhood: "north-ranch",
    price: 2895000,
    beds: 5, baths: 6, sqft: 6120, lotSqft: 43560,
    type: "Single Family",
    status: "Active",
    year: 2008,
    daysOnMarket: 17,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    blurb:
      "Gated Mediterranean estate on an acre in North Ranch. Resort grounds, " +
      "guest casita, and sport court."
  },
  {
    id: "wlv-003",
    address: "873 Triunfo Canyon Rd",
    neighborhood: "the-trails",
    price: 1525000,
    beds: 4, baths: 3, sqft: 2840, lotSqft: 9800,
    type: "Single Family",
    status: "Active",
    year: 1989,
    daysOnMarket: 6,
    image:
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80",
    blurb:
      "Beautifully remodeled two-story in The Trails. Open kitchen, pool, and " +
      "steps from award-winning schools."
  },
  {
    id: "wlv-004",
    address: "3201 Three Springs Dr",
    neighborhood: "three-springs",
    price: 1689000,
    beds: 4, baths: 3.5, sqft: 3210, lotSqft: 8200,
    type: "Single Family",
    status: "Active",
    year: 2014,
    daysOnMarket: 24,
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80",
    blurb:
      "Modern hillside home with canyon views, chef's kitchen, and an oversized " +
      "primary suite."
  },
  {
    id: "wlv-005",
    address: "640 First Neighborhood Ln",
    neighborhood: "first-neighborhood",
    price: 1245000,
    beds: 3, baths: 2, sqft: 2050, lotSqft: 7400,
    type: "Single Family",
    status: "Active",
    year: 1968,
    daysOnMarket: 12,
    image:
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1200&q=80",
    blurb:
      "Single-story charmer on a greenbelt. Updated throughout with access to " +
      "community pool and the lake."
  },
  {
    id: "wlv-006",
    address: "118 Lakeshore Ct",
    neighborhood: "lakeshore",
    price: 949000,
    beds: 2, baths: 2.5, sqft: 1620, lotSqft: 0,
    type: "Townhome",
    status: "Active",
    year: 1998,
    daysOnMarket: 31,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    blurb:
      "Turnkey lock-and-leave townhome with lake access, two-car garage, and a " +
      "private patio."
  },
  {
    id: "wlv-007",
    address: "1990 N Ranch Center Dr",
    neighborhood: "north-ranch",
    price: 4250000,
    beds: 6, baths: 7, sqft: 7800, lotSqft: 65340,
    type: "Single Family",
    status: "Active",
    year: 2019,
    daysOnMarket: 4,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    blurb:
      "New-construction modern farmhouse on 1.5 gated acres. Show-stopping " +
      "great room, wine cellar, and pool house."
  },
  {
    id: "wlv-008",
    address: "455 Westlake Island Dr",
    neighborhood: "westlake-island",
    price: 2675000,
    beds: 4, baths: 4, sqft: 3950, lotSqft: 6500,
    type: "Single Family",
    status: "Active",
    year: 2001,
    daysOnMarket: 19,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    blurb:
      "Lakefront home with private dock and panoramic water views. Entertainer's " +
      "backyard and dual primary suites."
  },
  {
    id: "wlv-009",
    address: "1277 The Trails Ct",
    neighborhood: "the-trails",
    price: 1395000,
    beds: 4, baths: 2.5, sqft: 2510, lotSqft: 8900,
    type: "Single Family",
    status: "Active",
    year: 1985,
    daysOnMarket: 8,
    image:
      "https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=1200&q=80",
    blurb:
      "Light-filled family home backing to open space. Vaulted ceilings, " +
      "remodeled baths, and a sparkling pool."
  },
  {
    id: "wlv-010",
    address: "3550 Skelton Canyon Cir",
    neighborhood: "three-springs",
    price: 1849000,
    beds: 5, baths: 4, sqft: 3680, lotSqft: 9100,
    type: "Single Family",
    status: "Active",
    year: 2012,
    daysOnMarket: 14,
    image:
      "https://images.unsplash.com/photo-1568605115459-4b731c2a2e8d?auto=format&fit=crop&w=1200&q=80",
    blurb:
      "Spacious two-story with downstairs guest suite, loft, and a backyard " +
      "built for California indoor-outdoor living."
  },
  {
    id: "wlv-011",
    address: "201 Lakeshore Dr #4",
    neighborhood: "lakeshore",
    price: 815000,
    beds: 2, baths: 2, sqft: 1340, lotSqft: 0,
    type: "Condo",
    status: "Active",
    year: 1991,
    daysOnMarket: 27,
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    blurb:
      "Ground-floor condo steps from the water with a remodeled kitchen and a " +
      "resort-style community pool."
  },
  {
    id: "wlv-012",
    address: "925 Westlake Blvd",
    neighborhood: "first-neighborhood",
    price: 1175000,
    beds: 3, baths: 2.5, sqft: 1980, lotSqft: 6800,
    type: "Single Family",
    status: "Active",
    year: 1972,
    daysOnMarket: 15,
    image:
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=80",
    blurb:
      "Move-in ready single-story near the village shops and dining. Drought-" +
      "tolerant landscaping and a flexible bonus room."
  }
];

/* ---- Recently sold comps (sample, for the seller valuation page) ------- */
WLV.recentSales = [
  { address: "1502 Lake Sherwood Dr", neighborhood: "westlake-island", soldPrice: 3150000, beds: 5, baths: 5, sqft: 5100, soldDate: "Apr 2026" },
  { address: "2240 Upper Ranch Rd",   neighborhood: "north-ranch",     soldPrice: 2780000, beds: 5, baths: 5.5, sqft: 5900, soldDate: "Apr 2026" },
  { address: "910 Triunfo Canyon Rd", neighborhood: "the-trails",      soldPrice: 1465000, beds: 4, baths: 3, sqft: 2780, soldDate: "Mar 2026" },
  { address: "3315 Three Springs Dr", neighborhood: "three-springs",   soldPrice: 1625000, beds: 4, baths: 3.5, sqft: 3140, soldDate: "Mar 2026" },
  { address: "705 First Neighborhood Ln", neighborhood: "first-neighborhood", soldPrice: 1198000, beds: 3, baths: 2, sqft: 1990, soldDate: "Feb 2026" },
  { address: "140 Lakeshore Ct",      neighborhood: "lakeshore",       soldPrice: 905000,  beds: 2, baths: 2.5, sqft: 1580, soldDate: "Feb 2026" }
];

/* ---- Helpers ----------------------------------------------------------- */
WLV.fmtPrice = function (n) {
  return "$" + Number(n).toLocaleString("en-US");
};
WLV.fmtPriceShort = function (n) {
  if (n >= 1000000) return "$" + (n / 1000000).toFixed(2).replace(/0$/, "") + "M";
  if (n >= 1000) return "$" + Math.round(n / 1000) + "K";
  return "$" + n;
};
WLV.neighborhoodName = function (id) {
  var n = WLV.neighborhoods.find(function (x) { return x.id === id; });
  return n ? n.name : id;
};
