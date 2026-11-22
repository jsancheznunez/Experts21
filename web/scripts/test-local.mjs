// Local end-to-end test of the server code against the real Claude API (costs a few cents to ~$1).
// Needs ANTHROPIC_API_KEY in your shell. Run `npm run generate` first (or `npm run build`).
//
//   node scripts/test-local.mjs chat [agent] "question"    stream one expert through the chat function
//   node scripts/test-local.mjs team "question"            run the whole-team flow with an in-memory store
import chat from "../netlify/functions/chat.mjs";
import { runTeam } from "../server/team.mjs";

const [mode = "chat", ...rest] = process.argv.slice(2);

if (mode === "chat") {
  const agent = rest.length > 1 ? rest[0] : "customer-experience-lead";
  const question = rest.length > 1 ? rest.slice(1).join(" ") : rest[0] ?? "In two sentences: what is your role on the team?";
  const res = await chat(new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", "x-app-password": process.env.APP_PASSWORD ?? "" },
    body: JSON.stringify({ agent, messages: [{ role: "user", content: question }] }),
  }));
  console.error(`HTTP ${res.status} ${res.headers.get("content-type")}`);
  if (!res.ok) { console.error(await res.text()); process.exit(1); }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "", last = null;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const event = JSON.parse(buffer.slice(0, nl));
      buffer = buffer.slice(nl + 1);
      if (event.type === "text") process.stdout.write(event.text);
      else last = event;
    }
  }
  console.error(`\n\nFinal event: ${JSON.stringify(last)}`);
  process.exit(last?.type === "done" ? 0 : 1);
}

if (mode === "team") {
  const question = rest.join(" ") || "Keep the panel to two experts and the answer short: is a $39.95 dog harness with $11 landed cost viable?";
  const started = Date.now();
  const job = await runTeam({
    id: crypto.randomUUID(),
    question,
    save: async (j) => {
      const last = j.steps.at(-1);
      if (last && last.at === j.updatedAt) console.error(`[${((Date.now() - started) / 1000).toFixed(0)}s] ${j.status}: ${last.text}`);
    },
  });
  console.log(`\n${job.answer ?? job.error}`);
  process.exit(job.status === "done" ? 0 : 1);
}

console.error('Usage: node scripts/test-local.mjs chat [agent] "question"  |  node scripts/test-local.mjs team "question"');
process.exit(1);
