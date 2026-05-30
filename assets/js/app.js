/* ===========================================================================
   homesforsalewestlakevillage.com — App logic
   Injects shared chrome (nav, footer, AI concierge) and powers the
   interactive pieces: listing grids, filters, valuation, and the chatbot.
   =========================================================================== */
(function () {
  "use strict";

  var page = document.body.dataset.page || "";

  /* ---------------------------------------------------------------------
     Shared chrome
     --------------------------------------------------------------------- */
  function navLink(href, label, key) {
    var active = key === page ? " active" : "";
    return '<a href="' + href + '" class="' + active.trim() + '">' + label + "</a>";
  }

  function renderHeader() {
    var el = document.getElementById("site-header");
    if (!el) return;
    el.className = "site-header";
    el.innerHTML =
      '<div class="container nav">' +
        '<a href="index.html" class="brand">' +
          '<span class="brand__name">Westlake Village</span>' +
          '<span class="brand__sub">Homes For Sale</span>' +
        "</a>" +
        '<nav class="nav__links" id="navLinks">' +
          navLink("buy.html", "Buy", "buy") +
          navLink("neighborhoods.html", "Neighborhoods", "neighborhoods") +
          navLink("sell.html", "Sell", "sell") +
          navLink("index.html#market", "Market Stats", "") +
          navLink("contact.html", "Contact", "contact") +
          '<a href="contact.html" class="btn btn--gold nav__cta">Talk to an Agent</a>' +
        "</nav>" +
        '<button class="nav__toggle" id="navToggle" aria-label="Menu">' +
          "<span></span><span></span><span></span>" +
        "</button>" +
      "</div>";

    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    toggle.addEventListener("click", function () { links.classList.toggle("open"); });
  }

  function renderFooter() {
    var el = document.getElementById("site-footer");
    if (!el) return;
    el.className = "site-footer";
    el.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          "<div>" +
            '<div class="footer-brand">Westlake Village Homes</div>' +
            '<p style="margin-top:12px;max-width:320px;color:#aeb8c4;">Your dedicated source for buying and selling homes in Westlake Village, California. Local expertise, luxury service, AI-powered convenience.</p>' +
          "</div>" +
          "<div><h4>Explore</h4>" +
            '<a href="buy.html">Browse Listings</a>' +
            '<a href="neighborhoods.html">Neighborhoods</a>' +
            '<a href="index.html#market">Market Stats</a>' +
            '<a href="sell.html">Home Valuation</a>' +
          "</div>" +
          "<div><h4>Company</h4>" +
            '<a href="contact.html">Contact</a>' +
            '<a href="sell.html">Sell With Us</a>' +
            '<a href="#" onclick="WLVApp.openConcierge();return false;">Ask the Concierge</a>' +
          "</div>" +
          "<div><h4>Get in Touch</h4>" +
            '<a href="tel:+18055550100">(805) 555-0100</a>' +
            '<a href="mailto:hello@homesforsalewestlakevillage.com">hello@homesforsalewestlakevillage.com</a>' +
            '<p style="color:#aeb8c4;margin-top:10px;font-size:.9rem;">Westlake Village, CA 91361</p>' +
          "</div>" +
        "</div>" +
        '<div class="footer-bottom">' +
          "<span>© " + new Date().getFullYear() + " homesforsalewestlakevillage.com — All rights reserved.</span>" +
          "<span>Listings shown are illustrative samples pending live MLS feed integration. Equal Housing Opportunity.</span>" +
        "</div>" +
      "</div>";
  }

  /* ---------------------------------------------------------------------
     Stats
     --------------------------------------------------------------------- */
  function renderStats() {
    var el = document.getElementById("market-stats");
    if (!el) return;
    var s = WLV.marketStats;
    el.innerHTML =
      stat(WLV.fmtPriceShort(s.medianPrice), "Median Price", "+" + s.monthOverMonth + "% MoM") +
      stat(s.activeListings, "Active Listings", "Updated " + s.updated) +
      stat(s.avgDaysOnMarket, "Avg Days on Market", "Seller's market") +
      stat("$" + s.medianPricePerSqft, "Median $ / Sq Ft", "Westlake Village");
    function stat(num, label, sub) {
      return '<div class="stat"><div class="stat__num">' + num + '</div>' +
             '<div class="stat__label">' + label + '</div>' +
             '<div class="stat__sub">' + sub + "</div></div>";
    }
  }

  /* ---------------------------------------------------------------------
     Listing cards
     --------------------------------------------------------------------- */
  function listingCard(l) {
    return (
      '<article class="card" data-id="' + l.id + '">' +
        '<div class="card__media">' +
          '<span class="card__tag">' + l.status + "</span>" +
          '<span class="card__dom">' + l.daysOnMarket + " days</span>" +
          '<img loading="lazy" src="' + l.image + '" alt="' + l.address + '">' +
        "</div>" +
        '<div class="card__body">' +
          '<div class="card__price">' + WLV.fmtPrice(l.price) + "</div>" +
          '<div class="card__addr">' + l.address + "</div>" +
          '<div class="card__hood">' + WLV.neighborhoodName(l.neighborhood) + " · " + l.type + "</div>" +
          '<div class="card__specs">' +
            "<span><b>" + l.beds + "</b> bd</span>" +
            "<span><b>" + l.baths + "</b> ba</span>" +
            "<span><b>" + l.sqft.toLocaleString() + "</b> sqft</span>" +
          "</div>" +
          '<p class="card__blurb">' + l.blurb + "</p>" +
          '<div class="card__foot"><button class="btn btn--outline btn--block" data-view="' + l.id + '">View Details</button></div>' +
        "</div>" +
      "</article>"
    );
  }

  function bindCardViews(container) {
    container.querySelectorAll("[data-view]").forEach(function (b) {
      b.addEventListener("click", function () { openListingModal(b.dataset.view); });
    });
  }

  function renderFeatured() {
    var el = document.getElementById("featured-listings");
    if (!el) return;
    var picks = WLV.listings.slice().sort(function (a, b) { return a.daysOnMarket - b.daysOnMarket; }).slice(0, 6);
    el.innerHTML = picks.map(listingCard).join("");
    bindCardViews(el);
  }

  /* ---------------------------------------------------------------------
     Buy page: filters + grid
     --------------------------------------------------------------------- */
  function initBuyPage() {
    var grid = document.getElementById("listing-grid");
    if (!grid) return;
    var meta = document.getElementById("results-meta");

    function read(id) { var e = document.getElementById(id); return e ? e.value : ""; }

    function apply() {
      var hood = read("f-hood");
      var type = read("f-type");
      var minP = parseInt(read("f-min") || "0", 10);
      var maxP = parseInt(read("f-max") || "0", 10);
      var beds = parseInt(read("f-beds") || "0", 10);
      var sort = read("f-sort");

      var out = WLV.listings.filter(function (l) {
        if (hood && l.neighborhood !== hood) return false;
        if (type && l.type !== type) return false;
        if (minP && l.price < minP) return false;
        if (maxP && l.price > maxP) return false;
        if (beds && l.beds < beds) return false;
        return true;
      });

      if (sort === "price-asc") out.sort(function (a, b) { return a.price - b.price; });
      else if (sort === "price-desc") out.sort(function (a, b) { return b.price - a.price; });
      else if (sort === "newest") out.sort(function (a, b) { return a.daysOnMarket - b.daysOnMarket; });
      else if (sort === "sqft") out.sort(function (a, b) { return b.sqft - a.sqft; });

      grid.innerHTML = out.length
        ? out.map(listingCard).join("")
        : '<p style="grid-column:1/-1;color:var(--muted);">No listings match your filters yet. Try widening your search — or ask the concierge to set up an alert.</p>';
      bindCardViews(grid);
      if (meta) meta.textContent = out.length + " home" + (out.length === 1 ? "" : "s") + " for sale in Westlake Village";
    }

    ["f-hood", "f-type", "f-min", "f-max", "f-beds", "f-sort"].forEach(function (id) {
      var e = document.getElementById(id);
      if (e) e.addEventListener("change", apply);
    });
    var reset = document.getElementById("f-reset");
    if (reset) reset.addEventListener("click", function () {
      ["f-hood", "f-type", "f-min", "f-max", "f-beds"].forEach(function (id) { var e = document.getElementById(id); if (e) e.value = ""; });
      var s = document.getElementById("f-sort"); if (s) s.value = "newest";
      apply();
    });

    // Honor ?hood= / ?type= from hero search
    var params = new URLSearchParams(location.search);
    if (params.get("hood")) { var h = document.getElementById("f-hood"); if (h) h.value = params.get("hood"); }
    if (params.get("type")) { var t = document.getElementById("f-type"); if (t) t.value = params.get("type"); }
    if (params.get("max")) { var m = document.getElementById("f-max"); if (m) m.value = params.get("max"); }

    apply();
  }

  /* ---------------------------------------------------------------------
     Listing modal
     --------------------------------------------------------------------- */
  function openListingModal(id) {
    var l = WLV.listings.find(function (x) { return x.id === id; });
    if (!l) return;
    var m = document.getElementById("listing-modal");
    m.querySelector("#modal-content").innerHTML =
      '<img class="modal__img" src="' + l.image + '" alt="' + l.address + '">' +
      '<div class="modal__body">' +
        '<div class="card__price" style="font-size:2.2rem;">' + WLV.fmtPrice(l.price) + "</div>" +
        "<h3 style=\"margin:.2em 0;\">" + l.address + "</h3>" +
        '<div class="card__hood">' + WLV.neighborhoodName(l.neighborhood) + ", Westlake Village CA · " + l.type + "</div>" +
        '<div class="card__specs" style="margin-top:18px;">' +
          "<span><b>" + l.beds + "</b> beds</span>" +
          "<span><b>" + l.baths + "</b> baths</span>" +
          "<span><b>" + l.sqft.toLocaleString() + "</b> sqft</span>" +
          (l.lotSqft ? "<span><b>" + (l.lotSqft / 43560).toFixed(2).replace(/\.?0+$/, "") + "</b> ac lot</span>" : "") +
          "<span>Built <b>" + l.year + "</b></span>" +
        "</div>" +
        "<p style=\"margin-top:18px;color:var(--muted);\">" + l.blurb + "</p>" +
        '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:22px;">' +
          '<a class="btn btn--gold" href="contact.html?subject=Showing%20request%20for%20' + encodeURIComponent(l.address) + '">Schedule a Showing</a>' +
          '<button class="btn btn--outline" onclick="WLVApp.askAbout(\'' + l.address.replace(/'/g, "") + '\')">Ask the Concierge</button>' +
        "</div>" +
      "</div>";
    m.classList.add("open");
  }

  function initModal() {
    var m = document.getElementById("listing-modal");
    if (!m) return;
    m.querySelector(".modal__overlay").addEventListener("click", close);
    m.querySelector(".modal__close").addEventListener("click", close);
    function close() { m.classList.remove("open"); }
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---------------------------------------------------------------------
     Neighborhoods
     --------------------------------------------------------------------- */
  function neighborhoodCard(n, linkToBuy) {
    var href = linkToBuy ? 'href="buy.html?hood=' + n.id + '"' : 'href="#"';
    return (
      '<a class="hood" ' + href + '>' +
        '<img loading="lazy" src="' + n.image + '" alt="' + n.name + '">' +
        '<div class="hood__body">' +
          "<h3>" + n.name + "</h3>" +
          '<div class="hood__tagline">' + n.tagline + "</div>" +
          '<div class="hood__price">Median ' + WLV.fmtPriceShort(n.medianPrice) + "</div>" +
        "</div>" +
      "</a>"
    );
  }

  function renderNeighborhoodsPreview() {
    var el = document.getElementById("neighborhoods-preview");
    if (!el) return;
    el.innerHTML = WLV.neighborhoods.slice(0, 3).map(function (n) { return neighborhoodCard(n, true); }).join("");
  }

  function renderNeighborhoodsFull() {
    var el = document.getElementById("neighborhoods-full");
    if (!el) return;
    el.innerHTML = WLV.neighborhoods.map(function (n) {
      return (
        '<div class="card">' +
          '<div class="card__media"><img loading="lazy" src="' + n.image + '" alt="' + n.name + '"></div>' +
          '<div class="card__body">' +
            "<h3>" + n.name + "</h3>" +
            '<div class="card__hood">' + n.tagline + " · Median " + WLV.fmtPriceShort(n.medianPrice) + "</div>" +
            '<p class="card__blurb">' + n.blurb + "</p>" +
            '<div class="card__foot"><a class="btn btn--outline btn--block" href="buy.html?hood=' + n.id + '">View ' + n.name + " Homes</a></div>" +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  /* ---------------------------------------------------------------------
     Seller: valuation + comps
     --------------------------------------------------------------------- */
  function initValuation() {
    var form = document.getElementById("valuation-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var beds = parseInt(document.getElementById("v-beds").value || "3", 10);
      var sqft = parseInt(document.getElementById("v-sqft").value || "2000", 10);
      var hood = document.getElementById("v-hood").value;
      var n = WLV.neighborhoods.find(function (x) { return x.id === hood; });
      var ppsf = WLV.marketStats.medianPricePerSqft;
      // crude sample model: blend neighborhood median with sqft * ppsf
      var base = sqft * ppsf;
      if (n) base = (base + n.medianPrice) / 2;
      base += (beds - 3) * 45000;
      var est = Math.round(base / 5000) * 5000;
      var low = Math.round(est * 0.94 / 5000) * 5000;
      var high = Math.round(est * 1.07 / 5000) * 5000;

      var out = document.getElementById("valuation-result");
      out.innerHTML =
        '<div class="eyebrow" style="color:var(--gold);">Estimated Market Value</div>' +
        '<div class="est">' + WLV.fmtPrice(est) + "</div>" +
        '<div class="range">Likely range ' + WLV.fmtPrice(low) + " – " + WLV.fmtPrice(high) + "</div>" +
        '<p style="color:#c4ccd6;margin:16px 0 0;font-size:.9rem;">This is an automated sample estimate. For a precise, agent-prepared valuation that accounts for finishes, views, and recent comps, request a free listing consultation below.</p>' +
        '<a class="btn btn--gold" style="margin-top:18px;" href="contact.html?subject=Listing%20consultation%20request">Get My Free Listing Consultation</a>';
      out.style.display = "block";
      out.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function renderComps() {
    var el = document.getElementById("recent-sales");
    if (!el) return;
    el.innerHTML = WLV.recentSales.map(function (s) {
      return (
        '<div class="card"><div class="card__body" style="padding:20px 22px;">' +
          '<div class="card__price" style="font-size:1.4rem;">' + WLV.fmtPrice(s.soldPrice) + "</div>" +
          '<div class="card__addr">' + s.address + "</div>" +
          '<div class="card__hood">' + WLV.neighborhoodName(s.neighborhood) + " · Sold " + s.soldDate + "</div>" +
          '<div class="card__specs">' +
            "<span><b>" + s.beds + "</b> bd</span><span><b>" + s.baths + "</b> ba</span><span><b>" + s.sqft.toLocaleString() + "</b> sqft</span>" +
          "</div>" +
        "</div></div>"
      );
    }).join("");
  }

  /* ---------------------------------------------------------------------
     Contact form
     --------------------------------------------------------------------- */
  function initContact() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var params = new URLSearchParams(location.search);
    var subj = document.getElementById("c-subject");
    if (subj && params.get("subject")) subj.value = params.get("subject");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.reset();
      toast("Thanks! Your request was received — we'll be in touch shortly.");
      var ok = document.getElementById("contact-success");
      if (ok) ok.style.display = "block";
    });
  }

  /* ---------------------------------------------------------------------
     AI Concierge (rule-based sample assistant + lead capture)
     --------------------------------------------------------------------- */
  var concierge = { open: false, stage: "chat", lead: {} };
  var conciergeHistory = []; // [{role, content}] sent to the Claude backend

  function renderConcierge() {
    var fab = document.createElement("button");
    fab.className = "concierge-fab";
    fab.id = "conciergeFab";
    fab.innerHTML = "💬 Ask the Concierge";
    document.body.appendChild(fab);

    var box = document.createElement("div");
    box.className = "concierge";
    box.id = "concierge";
    box.innerHTML =
      '<div class="concierge__head">' +
        '<div class="concierge__avatar">W</div>' +
        "<div><div class=\"concierge__title\">Westlake Concierge</div>" +
        '<div class="concierge__status">AI assistant · online</div></div>' +
        '<button class="concierge__close" id="conciergeClose">×</button>' +
      "</div>" +
      '<div class="concierge__body" id="conciergeBody"></div>' +
      '<form class="concierge__foot" id="conciergeForm">' +
        '<input id="conciergeInput" autocomplete="off" placeholder="Ask about listings, prices, schools…">' +
        '<button type="submit" aria-label="Send">➤</button>' +
      "</form>";
    document.body.appendChild(box);

    fab.addEventListener("click", openConcierge);
    document.getElementById("conciergeClose").addEventListener("click", closeConcierge);
    document.getElementById("conciergeForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var inp = document.getElementById("conciergeInput");
      var v = inp.value.trim();
      if (!v) return;
      inp.value = "";
      sendToConcierge(v);
    });

    greet();
  }

  function greet() {
    pushBot(
      "Hi! I'm your Westlake Village real estate concierge. I can help with current listings, " +
      "prices, neighborhoods, schools, or a home valuation. What brings you in today?"
    );
    pushChips([
      "I'm looking to buy",
      "I want to sell my home",
      "Show me the market",
      "Tell me about the neighborhoods"
    ]);
  }

  function bodyEl() { return document.getElementById("conciergeBody"); }
  function scrollBottom() { var b = bodyEl(); b.scrollTop = b.scrollHeight; }

  function pushBot(html) {
    var d = document.createElement("div");
    d.className = "msg msg--bot";
    d.innerHTML = html;
    bodyEl().appendChild(d);
    scrollBottom();
  }
  function pushUser(text) {
    var d = document.createElement("div");
    d.className = "msg msg--user";
    d.textContent = text;
    bodyEl().appendChild(d);
    scrollBottom();
  }
  function pushChips(arr) {
    var wrap = document.createElement("div");
    wrap.className = "chips";
    arr.forEach(function (label) {
      var c = document.createElement("button");
      c.type = "button";
      c.className = "chip";
      c.textContent = label;
      c.addEventListener("click", function () {
        wrap.remove();
        sendToConcierge(label);
      });
      wrap.appendChild(c);
    });
    bodyEl().appendChild(wrap);
    scrollBottom();
  }

  // Entry point for every user message: show it, record it, get a reply.
  function sendToConcierge(text) {
    pushUser(text);
    conciergeHistory.push({ role: "user", content: text });
    botRespondAI();
  }

  // Stream a reply from the Claude-backed /api/concierge endpoint.
  // Falls back to the offline rule-based assistant if the API is unavailable
  // (e.g. the site is served statically without the Node backend running).
  function botRespondAI() {
    var bubble = document.createElement("div");
    bubble.className = "msg msg--bot";
    bubble.textContent = "…";
    bodyEl().appendChild(bubble);
    scrollBottom();

    fetch("/api/concierge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conciergeHistory })
    }).then(function (resp) {
      if (!resp.ok || !resp.body) throw new Error("Concierge API unavailable");
      var reader = resp.body.getReader();
      var decoder = new TextDecoder();
      var buffer = "";
      var full = "";

      function pump() {
        return reader.read().then(function (chunk) {
          if (chunk.done) return finish();
          buffer += decoder.decode(chunk.value, { stream: true });
          var parts = buffer.split("\n\n");
          buffer = parts.pop();
          for (var i = 0; i < parts.length; i++) {
            var dataLine = parts[i].split("\n").filter(function (l) {
              return l.indexOf("data:") === 0;
            })[0];
            if (!dataLine) continue;
            var payload;
            try { payload = JSON.parse(dataLine.slice(5).trim()); } catch (e) { continue; }
            if (payload.type === "text") {
              full += payload.text;
              bubble.textContent = full;
              scrollBottom();
            } else if (payload.type === "lead_captured") {
              var first = payload.lead && payload.lead.name ? payload.lead.name.split(" ")[0] : "";
              toast("Thanks" + (first ? ", " + first : "") + "! A specialist will follow up shortly.");
            } else if (payload.type === "error") {
              throw new Error(payload.message || "Concierge error");
            }
          }
          return pump();
        });
      }

      function finish() {
        if (!full.trim()) throw new Error("Empty response");
        bubble.innerHTML = formatBotText(full);
        scrollBottom();
        conciergeHistory.push({ role: "assistant", content: full });
      }

      return pump();
    }).catch(function () {
      // Graceful degradation: drop the empty bubble and use the local matcher.
      bubble.remove();
      var last = conciergeHistory.length ? conciergeHistory[conciergeHistory.length - 1].content : "";
      botRespondFallback(last);
    });
  }

  // Lightweight, injection-safe formatting for streamed model text.
  function formatBotText(s) {
    var esc = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    esc = esc.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    esc = esc.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|[\w./?=#-]+\.html[^\s)]*)\)/g, '<a href="$2">$1</a>');
    esc = esc.replace(/(^|[\s(])((?:buy|sell|neighborhoods|contact|index)\.html)\b/g, '$1<a href="$2">$2</a>');
    esc = esc.replace(/(^|[\s(])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
    return esc.replace(/\n/g, "<br>");
  }

  // Offline fallback — small intent matcher used when the Claude backend
  // can't be reached. Keeps the widget useful on static-only hosting.
  function botRespondFallback(text) {
    var t = text.toLowerCase();

    // Lead capture flow
    if (concierge.stage === "ask-name") {
      concierge.lead.name = text;
      concierge.stage = "ask-contact";
      pushBot("Great to meet you, " + text.split(" ")[0] + "! What's the best email or phone number to reach you?");
      return;
    }
    if (concierge.stage === "ask-contact") {
      concierge.lead.contact = text;
      concierge.stage = "chat";
      pushBot(
        "Perfect — I've logged your info and a Westlake Village specialist will follow up shortly. " +
        "Anything else I can help with in the meantime?"
      );
      pushChips(["Show me listings", "Free home valuation", "Best neighborhoods"]);
      return;
    }

    if (/(buy|buying|looking|search|listing)/.test(t)) {
      var cheapest = WLV.listings.slice().sort(function (a, b) { return a.price - b.price; })[0];
      pushBot(
        "We've got <b>" + WLV.marketStats.activeListings + " active listings</b> in Westlake Village right now, " +
        "from around " + WLV.fmtPriceShort(cheapest.price) + " up to luxury estates over $4M. " +
        "You can browse and filter them all on the <a href='buy.html'>Buy page</a>. " +
        "Want me to have an agent set up custom alerts for you?"
      );
      askForLead();
      return;
    }
    if (/(sell|selling|valuation|worth|value|estimate)/.test(t)) {
      pushBot(
        "It's a strong seller's market — median price is " + WLV.fmtPriceShort(WLV.marketStats.medianPrice) +
        " and homes are averaging just " + WLV.marketStats.avgDaysOnMarket + " days on market. " +
        "Try our <a href='sell.html'>instant home valuation tool</a>, or I can set up a free listing consultation."
      );
      askForLead();
      return;
    }
    if (/(market|price|stat|trend|median)/.test(t)) {
      var s = WLV.marketStats;
      pushBot(
        "Here's the latest Westlake Village snapshot (" + s.updated + "):<br>" +
        "• Median price: <b>" + WLV.fmtPriceShort(s.medianPrice) + "</b> (+" + s.monthOverMonth + "% MoM)<br>" +
        "• Active listings: <b>" + s.activeListings + "</b><br>" +
        "• Avg days on market: <b>" + s.avgDaysOnMarket + "</b><br>" +
        "• Median $/sqft: <b>$" + s.medianPricePerSqft + "</b>"
      );
      pushChips(["Show me listings", "What's my home worth?"]);
      return;
    }
    if (/(neighborhood|north ranch|trails|island|area|community|where)/.test(t)) {
      pushBot(
        "Westlake Village has some wonderful communities. A few favorites:<br>" +
        "• <b>North Ranch</b> — gated luxury estates & golf<br>" +
        "• <b>Westlake Island</b> — waterfront living on the lake<br>" +
        "• <b>The Trails</b> — family-friendly & walkable<br>" +
        "See them all on the <a href='neighborhoods.html'>Neighborhoods page</a>."
      );
      pushChips(["Browse North Ranch", "Browse The Trails", "I want to buy"]);
      return;
    }
    if (/(school|education|district)/.test(t)) {
      pushBot(
        "Westlake Village is served by the highly rated Conejo Valley Unified School District, with several " +
        "9- and 10-rated schools. Families especially love The Trails and First Neighborhood for school access. " +
        "Want me to connect you with an agent who knows the school boundaries in detail?"
      );
      askForLead();
      return;
    }
    if (/(commute|drive|freeway|\bla\b|los angeles)/.test(t)) {
      pushBot(
        "Westlake Village sits right off the 101, about 35–45 minutes to West LA and the Valley outside rush hour — " +
        "a big reason it's so popular with LA County relocators."
      );
      return;
    }
    if (/(hi|hello|hey|thanks|thank you)/.test(t)) {
      pushBot("Happy to help! Are you thinking about buying, selling, or just exploring the area?");
      pushChips(["Buying", "Selling", "Just exploring"]);
      return;
    }

    // Fallback
    pushBot(
      "Good question! A local specialist can give you the most accurate answer on that. " +
      "Can I grab your name so we can follow up?"
    );
    concierge.stage = "ask-name";
  }

  function askForLead() {
    if (concierge.lead.name) return;
    setTimeout(function () {
      pushBot("So we can follow up with details — what's your name?");
      concierge.stage = "ask-name";
    }, 500);
  }

  function openConcierge() {
    document.getElementById("concierge").classList.add("open");
    document.getElementById("conciergeFab").style.display = "none";
    concierge.open = true;
    setTimeout(function () { var i = document.getElementById("conciergeInput"); if (i) i.focus(); }, 100);
  }
  function closeConcierge() {
    document.getElementById("concierge").classList.remove("open");
    document.getElementById("conciergeFab").style.display = "flex";
    concierge.open = false;
  }
  function askAbout(address) {
    openConcierge();
    sendToConcierge("I'm interested in " + address + " — can you tell me more and help me schedule a showing?");
  }

  /* ---------------------------------------------------------------------
     Hero search
     --------------------------------------------------------------------- */
  function initHeroSearch() {
    var form = document.getElementById("hero-search");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var params = new URLSearchParams();
      var hood = document.getElementById("hs-hood").value;
      var type = document.getElementById("hs-type").value;
      var max = document.getElementById("hs-price").value;
      if (hood) params.set("hood", hood);
      if (type) params.set("type", type);
      if (max) params.set("max", max);
      location.href = "buy.html" + (params.toString() ? "?" + params.toString() : "");
    });

    // Populate neighborhood options
    var sel = document.getElementById("hs-hood");
    if (sel) WLV.neighborhoods.forEach(function (n) {
      var o = document.createElement("option"); o.value = n.id; o.textContent = n.name; sel.appendChild(o);
    });
  }

  function populateHoodSelects() {
    document.querySelectorAll("[data-hood-options]").forEach(function (sel) {
      WLV.neighborhoods.forEach(function (n) {
        var o = document.createElement("option"); o.value = n.id; o.textContent = n.name; sel.appendChild(o);
      });
    });
  }

  /* ---------------------------------------------------------------------
     Toast
     --------------------------------------------------------------------- */
  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 3500);
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFooter();
    renderStats();
    renderFeatured();
    renderNeighborhoodsPreview();
    renderNeighborhoodsFull();
    renderComps();
    populateHoodSelects();
    initHeroSearch();
    initBuyPage();
    initModal();
    initValuation();
    initContact();
    renderConcierge();
  });

  // Public hooks used by inline handlers
  window.WLVApp = {
    openConcierge: openConcierge,
    askAbout: askAbout,
    toast: toast
  };
})();
