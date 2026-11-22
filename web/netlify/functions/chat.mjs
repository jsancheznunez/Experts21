// POST /api/chat  { agent, messages }  ->  streamed NDJSON:
//   {"type":"text","text":"..."} ... {"type":"done","stop_reason":"end_turn"}   or   {"type":"error","message":"..."}
// Streaming keeps a single expert's answer inside Netlify's 60-second function limit.
import { checkPassword, cleanMessages, friendlyError, getAgent, json, requestFor, streamTurn, HttpError } from "../../server/claude.mjs";

export default async (req) => {
  let stream;
  try {
    if (req.method !== "POST") throw new HttpError(405, "Use POST");
    checkPassword(req);
    const { agent, messages } = await req.json();
    if (agent === "orchestrator") throw new HttpError(400, "Use Ask the whole team for the orchestrator");
    getAgent(agent);
    stream = streamTurn(requestFor(agent, cleanMessages(messages)));
  } catch (err) {
    return json(err.status ?? 400, { error: friendlyError(err) });
  }

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      const send = (obj) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") send({ type: "text", text: event.delta.text });
        }
        const final = await stream.finalMessage();
        send({ type: "done", stop_reason: final.stop_reason, model: final.model });
      } catch (err) {
        send({ type: "error", message: friendlyError(err) });
      } finally {
        controller.close();
      }
    },
    cancel() { stream.abort(); },
  });
  return new Response(body, { headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" } });
};

export const config = { path: "/api/chat" };
