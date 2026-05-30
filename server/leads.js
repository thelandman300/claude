/* ===========================================================================
   Lead persistence
   ---------------------------------------------------------------------------
   Demo implementation: appends each captured lead to a JSON-lines file.
   In production, replace the body of saveLead() with a call to your CRM
   (Follow Up Boss, kvCORE, HubSpot, Salesforce…) or an email/Slack webhook.
   =========================================================================== */
import fs from "node:fs/promises";
import path from "node:path";

const LEADS_FILE = process.env.LEADS_FILE || path.resolve(process.cwd(), "leads.jsonl");

export async function saveLead(input, req) {
  const lead = {
    name: input.name || "Unknown",
    email: input.email || null,
    phone: input.phone || null,
    intent: input.intent || null,
    interest: input.interest || null,
    notes: input.notes || null,
    source: "ai-concierge",
    capturedAt: new Date().toISOString(),
    ip:
      (req && (req.headers["x-forwarded-for"] || req.socket?.remoteAddress)) ||
      null
  };

  try {
    await fs.appendFile(LEADS_FILE, JSON.stringify(lead) + "\n", "utf8");
  } catch (err) {
    // Never let a persistence failure break the conversation.
    console.error("[leads] failed to persist lead:", err.message);
  }

  console.log(
    `📋 Lead captured: ${lead.name} <${lead.email || lead.phone || "no contact"}> — ${lead.intent || "intent unknown"}`
  );
  return lead;
}
