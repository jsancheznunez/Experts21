// Shared server-side helpers for the Netlify Functions. Never imported by the browser bundle.
import Anthropic from "@anthropic-ai/sdk";
import data from "./generated/agents-full.mjs";

export const TEAM = data;

/** Read an environment variable on Netlify (Netlify.env) or in plain Node (process.env). */
export const env = (key) => globalThis.Netlify?.env?.get(key) ?? process.env[key];

// Agent `model:` aliases mapped to current Claude models. Effort is kept modest so
// single-expert answers stream comfortably inside Netlify's 60-second function limit.
// Opus and Sonnet get server-side refusal fallbacks; Haiku has none.
export const MODELS = {
  opus: { id: "claude-opus-5-5", effort: "medium", fallbacks: true },
  sonnet: { id: "claude-sonnet-5-5", effort: "medium", fallbacks: true },
  haiku: { id: "claude-haiku-5-5", effort: "low", fallbacks: false },
};

let client;
export function getClient() {
  if (!env("ANTHROPIC_API_KEY")) {
    throw new HttpError(500, "ANTHROPIC_API_KEY is not set. Add it in Netlify: Site configuration → Environment variables (scope: Functions), then redeploy.");
  }
  client ??= new Anthropic({ apiKey: env("ANTHROPIC_API_KEY") });
  return client;
}

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

/** Optional shared password: when APP_PASSWORD is set, every call must send it in x-app-password. */
export function checkPassword(req) {
  const expected = env("APP_PASSWORD");
  if (expected && req.headers.get("x-app-password") !== expected) throw new HttpError(401, "Password required");
}

export function getAgent(name) {
  const agent = TEAM.agents[name];
  if (!agent) throw new HttpError(404, `Unknown agent: ${name}`);
  return agent;
}

function roster(exclude) {
  return Object.values(TEAM.agents)
    .filter((a) => a.name !== exclude)
    .map((a) => `- ${a.name} (${a.firstName}, ${a.title})`)
    .join("\n");
}

/** The agent's system prompt for this web app: its Claude Code prompt plus everything it would
 *  normally read from disk (skills, research docs, knowledge folder), inlined. */
export function systemPromptFor(name, { extra = "" } = {}) {
  const a = getAgent(name);
  const onlyReadme = a.knowledge.every((k) => k.path.endsWith("/README.md"));
  return [
    a.body,
    "## Running context (web app)",
    "You are answering in a chat web app for the consultant. You have no tools in this app: your skills, the research docs you rely on " +
      `and your knowledge folder (knowledge/${a.name}/) are included below, so use them directly and never say you will read or open a file. ` +
      "You cannot call other experts here; name them under Hand-offs using their agent names from the roster below. " +
      "The research is dated November 2026: flag volatile figures (prices, tariffs, ad costs, laws) as needing verification.",
    extra,
    "## Your skills",
    ...a.skills.map((s) => `### Skill: ${s}\n\n${TEAM.skills[s]}`),
    "## Research docs",
    ...a.research.map((d) => `### docs/${d}\n\n${TEAM.docs[d]}`),
    `## Your knowledge folder (knowledge/${a.name}/)`,
    onlyReadme ? 'Only the README is present: write "No knowledge files yet" under your assumptions.' : "",
    ...a.knowledge.map((k) => `### ${k.path}\n\n${k.text}`),
    "## Team roster (for hand-offs)",
    roster(a.name),
  ].filter(Boolean).join("\n\n");
}

/** Request parameters for one agent turn. The long, stable system prompt is cached. */
export function requestFor(name, messages, { maxTokens = 6000, system, outputFormat } = {}) {
  const a = getAgent(name);
  const m = MODELS[a.model] ?? MODELS.sonnet;
  const params = {
    model: m.id,
    max_tokens: maxTokens,
    system: [{ type: "text", text: system ?? systemPromptFor(name), cache_control: { type: "ephemeral" } }],
    messages,
    output_config: { effort: m.effort, ...(outputFormat ? { format: outputFormat } : {}) },
  };
  if (m.fallbacks) {
    params.betas = ["server-side-fallback-2026-07-01"];
    params.fallbacks = "default";
  }
  return params;
}

/** Start a streamed turn (beta namespace so refusal fallbacks are available). */
export const streamTurn = (params) => getClient().beta.messages.stream(params);

/** Run a turn to completion and return { text, message }. */
export async function completeTurn(params) {
  const message = await streamTurn(params).finalMessage();
  if (message.stop_reason === "refusal") {
    throw new Error(`The model declined to answer${message.stop_details?.category ? ` (${message.stop_details.category})` : ""}.`);
  }
  const text = message.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  return { text, message };
}

/** Turn SDK errors into short, user-facing messages (no secrets, no stack traces). */
export function friendlyError(err) {
  if (err instanceof HttpError) return err.message;
  if (err instanceof Anthropic.AuthenticationError) return "The Claude API rejected the API key. Check ANTHROPIC_API_KEY in Netlify.";
  if (err instanceof Anthropic.RateLimitError) return "Rate limited by the Claude API. Wait a moment and try again.";
  if (err instanceof Anthropic.BadRequestError) return `The Claude API rejected the request: ${err.message}`;
  if (err instanceof Anthropic.APIError) return `Claude API error ${err.status ?? ""}: ${err.message}`.trim();
  return err?.message || "Unexpected error";
}

/** Keep the conversation sane: user/assistant text only, alternating, bounded in size. */
export function cleanMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) throw new HttpError(400, "messages must be a non-empty array");
  const cleaned = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 12_000) }));
  while (cleaned.length && cleaned[0].role !== "user") cleaned.shift();
  if (!cleaned.length || cleaned.at(-1).role !== "user") throw new HttpError(400, "The last message must be from the user");
  // Merge accidental consecutive same-role messages.
  return cleaned.reduce((out, m) => {
    if (out.length && out.at(-1).role === m.role) out.at(-1).content += `\n\n${m.content}`;
    else out.push({ ...m });
    return out;
  }, []);
}
