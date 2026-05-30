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
- **AI Concierge** — a 24/7 chat widget (bottom-right) that answers buyer/seller questions, surfaces market data, and captures + qualifies leads. Backed by **Claude** via the Node server (`server/`); falls back to a local rule-based assistant when the backend isn't reachable (e.g. static-only hosting).
- Header nav + footer
- Listing detail modal

### Files
```
index.html  buy.html  neighborhoods.html  sell.html  contact.html
assets/
  css/styles.css     # luxury navy + champagne-gold design system
  js/data.js         # SAMPLE listings, neighborhoods, market stats, comps
  js/app.js          # rendering, filters, valuation, concierge (streaming + fallback)
server/
  server.js          # Express: serves the static site + the concierge API
  concierge.js       # POST /api/concierge — streams Claude over SSE, runs the lead tool
  wlv-context.js     # builds the cached system prompt + capture_lead tool definition
  leads.js           # demo lead persistence (swap for your CRM)
  .env.example       # ANTHROPIC_API_KEY, CONCIERGE_MODEL, PORT, LEADS_FILE
robots.txt  sitemap.xml
```

## Run it

**Full experience (Claude concierge):** run the Node server — it serves the site *and* the API on one port.

```bash
cd server
npm install
ANTHROPIC_API_KEY=sk-ant-... npm start
# open http://localhost:8000
```

**Static-only preview (no backend):** the site still works; the concierge falls back to the offline rule-based assistant.

```bash
python3 -m http.server 8000   # from the repo root
```

### How the AI Concierge works
- The widget POSTs the conversation to **`/api/concierge`**, which calls Claude (`claude-opus-4-8` by default — set `CONCIERGE_MODEL` to use `claude-sonnet-4-6` / `claude-haiku-4-5` for higher-volume, lower cost) and **streams** the reply back over Server-Sent Events.
- The Westlake Village context (market stats, neighborhoods, listings, comps, behavior rules) lives in `wlv-context.js` and is sent as a **prompt-cached** system prefix. The `cache_control` breakpoint is in place; caching activates once that context exceeds the ~4,096-token model minimum (it grows past that with the live MLS feed). The server logs `cacheRead`/`cacheWrite` token counts each request so you can verify hits.
- **Lead capture** is structured: Claude calls the `capture_lead` tool once it has a name + email/phone, and `leads.js` records it (demo: appended to `leads.jsonl`). Point this at your CRM/email for production.

## Going live — replace the placeholders

Everything in `assets/js/data.js` is **illustrative sample data**. To launch for real:

1. **MLS / IDX feed** — replace `WLV.listings`, `WLV.recentSales`, and `WLV.marketStats` with data from your MLS/IDX provider (e.g. SimplyRETS, Spark, IDX Broker). The card/grid/modal renderers in `app.js` already expect this shape.
2. **AI Concierge** — now wired to Claude via `server/`. Set `ANTHROPIC_API_KEY`, run the Node server, and point `leads.js` at your CRM. (`botRespondFallback()` in `app.js` is the offline rule-based matcher used only when the backend is unreachable.)
3. **Forms** — the contact and valuation forms are front-end only. Wire them to your CRM, email, or a serverless endpoint.
4. **Domain & analytics** — deploy to the `homesforsalewestlakevillage.com` domain and add analytics.

## Design

Luxury, photo-forward aesthetic: Cormorant Garamond display serif + Inter, a deep-navy and champagne-gold palette, generous whitespace, and full responsiveness down to mobile. SEO meta tags, JSON-LD `RealEstateAgent` schema, sitemap, and robots are in place, built around the phrase *"homes for sale Westlake Village CA."*

> Listings, prices, and sales shown are sample data pending live MLS integration. Equal Housing Opportunity.
