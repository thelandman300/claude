/* ===========================================================================
   AI Concierge endpoint — POST /api/concierge
   ---------------------------------------------------------------------------
   Streams a Claude response over Server-Sent Events and handles structured
   lead capture via the capture_lead tool. The system prompt (the Westlake
   Village context) is built once and sent with a cache_control breakpoint so
   repeated requests reuse it from the prompt cache.
   =========================================================================== */
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, LEAD_TOOL } from "./wlv-context.js";
import { saveLead } from "./leads.js";

// Resolves ANTHROPIC_API_KEY from the environment.
const client = new Anthropic();

// Default to the most capable model; override with CONCIERGE_MODEL
// (e.g. claude-sonnet-4-6 or claude-haiku-4-5 for higher-volume, lower cost).
const MODEL = process.env.CONCIERGE_MODEL || "claude-opus-4-8";

// Built once → byte-stable → cacheable prefix.
const SYSTEM_PROMPT = buildSystemPrompt();

const MAX_HISTORY = 20;   // cap turns sent back to the API
const MAX_TOOL_TURNS = 4; // guard against a runaway tool loop

export async function handleConcierge(req, res) {
  // Validate + sanitize the conversation the client sent.
  const incoming = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const messages = incoming
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    res.status(400).json({ error: "messages must be non-empty and end with a user turn" });
    return;
  }

  // Open the SSE stream.
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });
  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

  // Working transcript that grows as tool turns are appended.
  const work = messages.slice();

  try {
    let turn = 0;
    while (turn++ < MAX_TOOL_TURNS) {
      const stream = client.messages.stream({
        model: MODEL,
        max_tokens: 1024,
        thinking: { type: "disabled" }, // snappy chat replies; concierge Q&A isn't deep reasoning
        output_config: { effort: "low" },
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" } // cache the WLV context prefix
          }
        ],
        tools: [LEAD_TOOL],
        messages: work
      });

      // Forward text tokens as they arrive.
      stream.on("text", (delta) => send({ type: "text", text: delta }));

      const final = await stream.finalMessage();

      const u = final.usage || {};
      console.log(
        `[concierge] model=${MODEL} in=${u.input_tokens ?? 0} ` +
          `cacheWrite=${u.cache_creation_input_tokens ?? 0} ` +
          `cacheRead=${u.cache_read_input_tokens ?? 0} out=${u.output_tokens ?? 0}`
      );

      if (final.stop_reason === "tool_use") {
        work.push({ role: "assistant", content: final.content });
        const toolResults = [];
        for (const block of final.content) {
          if (block.type === "tool_use" && block.name === "capture_lead") {
            const lead = await saveLead(block.input, req);
            send({ type: "lead_captured", lead: { name: lead.name } });
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content:
                "Lead saved successfully. A Westlake Village specialist will follow up shortly."
            });
          } else if (block.type === "tool_use") {
            // Unknown tool — return an error result so the model can recover.
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: "Unknown tool.",
              is_error: true
            });
          }
        }
        work.push({ role: "user", content: toolResults });
        continue; // let the model produce its closing message
      }

      break; // end_turn (or any non-tool stop)
    }

    send({ type: "done" });
  } catch (err) {
    console.error("[concierge] error:", err?.message || err);
    send({ type: "error", message: "The concierge is briefly unavailable." });
  } finally {
    res.end();
  }
}
