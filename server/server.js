/* ===========================================================================
   homesforsalewestlakevillage.com — app server
   Serves the static site AND the Claude-powered concierge API on one port.
   ===========================================================================
   Run:  ANTHROPIC_API_KEY=sk-ant-... npm start   (from the server/ directory)
   Then: http://localhost:8000
   =========================================================================== */
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleConcierge } from "./concierge.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, ".."); // repo root holds the static site

const app = express();
app.use(express.json({ limit: "1mb" }));

// Concierge API
app.post("/api/concierge", handleConcierge);
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, model: process.env.CONCIERGE_MODEL || "claude-opus-4-8" })
);

// Static site (index.html, buy.html, assets/, …)
app.use(express.static(SITE_ROOT, { extensions: ["html"] }));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`▶ Westlake Village site + AI Concierge running at http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn(
      "⚠ ANTHROPIC_API_KEY is not set — the concierge API will error and the " +
        "widget will fall back to its offline rule-based assistant."
    );
  }
});
