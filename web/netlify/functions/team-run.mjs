// POST /api/team-run  { id, question, history }  — background function (Netlify replies 202 at once,
// the work continues for up to 15 minutes). Progress and the final answer are written to Netlify Blobs;
// the browser polls /api/team-status?id=... to read them.
import { getStore } from "@netlify/blobs";
import { checkPassword, friendlyError } from "../../server/claude.mjs";
import { runTeam } from "../../server/team.mjs";

const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async (req) => {
  // A background function's return value is discarded, so failures are recorded in the job instead.
  let body;
  try {
    checkPassword(req);
    body = await req.json();
  } catch (err) {
    console.error("team-run rejected:", friendlyError(err));
    return;
  }
  const { id, question, history } = body ?? {};
  if (!ID.test(id ?? "") || typeof question !== "string" || !question.trim()) return;

  const store = getStore({ name: "team-jobs", consistency: "strong" });
  // Netlify retries a failed background invocation; never start the same job twice.
  if (await store.get(id)) return;

  const cleanHistory = Array.isArray(history)
    ? history.filter((m) => typeof m?.content === "string").slice(-6).map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content.slice(0, 6000) }))
    : [];
  await runTeam({ id, question: question.slice(0, 4000), history: cleanHistory, save: (job) => store.setJSON(id, job) });
};

export const config = { path: "/api/team-run", background: true };
