# homesforsalewestlakevillage.com

A residential real estate website purpose-built for the **Westlake Village, CA** market — buyers, sellers, and lead generation in one luxurious, mobile-first site.

## What's here

Pure static HTML/CSS/JS — no build step, no dependencies. Open `index.html` in a browser, or serve the folder.

| Page | Purpose |
|------|---------|
| `index.html` | Home — hero search, live market stats, featured listings, neighborhoods, seller CTA, feature overview |
| `buy.html` | Browse all listings with filters (price, beds, neighborhood, type) + sorting + detail modal |
| `neighborhoods.html` | North Ranch, The Trails, Westlake Island, First Neighborhood, Three Springs, Lakeshore |
| `sell.html` | Instant home valuation tool + recent comparable sales + consultation CTA |
| `contact.html` | Lead capture / contact form |

### Shared pieces (injected on every page)
- **AI Concierge** — a 24/7 chat widget (bottom-right) that answers buyer/seller questions, surfaces market data, and captures + qualifies leads. Currently a rule-based sample assistant; see "Going live" to swap in a real LLM.
- Header nav + footer
- Listing detail modal

### Files
```
index.html  buy.html  neighborhoods.html  sell.html  contact.html
assets/
  css/styles.css     # luxury navy + champagne-gold design system
  js/data.js         # SAMPLE listings, neighborhoods, market stats, comps
  js/app.js          # rendering, filters, valuation, concierge, lead capture
robots.txt  sitemap.xml
```

## Run a local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Going live — replace the placeholders

Everything in `assets/js/data.js` is **illustrative sample data**. To launch for real:

1. **MLS / IDX feed** — replace `WLV.listings`, `WLV.recentSales`, and `WLV.marketStats` with data from your MLS/IDX provider (e.g. SimplyRETS, Spark, IDX Broker). The card/grid/modal renderers in `app.js` already expect this shape.
2. **AI Concierge** — `botRespond()` in `app.js` is a small rule-based matcher. Point it at an LLM endpoint (e.g. an Anthropic Claude API backend) for true natural-language answers; keep the lead-capture flow.
3. **Forms** — the contact and valuation forms are front-end only. Wire them to your CRM, email, or a serverless endpoint.
4. **Domain & analytics** — deploy to the `homesforsalewestlakevillage.com` domain and add analytics.

## Design

Luxury, photo-forward aesthetic: Cormorant Garamond display serif + Inter, a deep-navy and champagne-gold palette, generous whitespace, and full responsiveness down to mobile. SEO meta tags, JSON-LD `RealEstateAgent` schema, sitemap, and robots are in place, built around the phrase *"homes for sale Westlake Village CA."*

> Listings, prices, and sales shown are sample data pending live MLS integration. Equal Housing Opportunity.
