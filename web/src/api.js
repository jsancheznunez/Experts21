// Browser-side calls to the Netlify Functions. The API key never reaches the browser:
// these endpoints call Claude on the server.

export class PasswordError extends Error {
  constructor() { super("Password required"); }
}

const headers = (password) => ({
  "content-type": "application/json",
  ...(password ? { "x-app-password": password } : {}),
});

async function errorFrom(res) {
  if (res.status === 401) return new PasswordError();
  try {
    const body = await res.json();
    return new Error(body.error || `Request failed (${res.status})`);
  } catch {
    return new Error(`Request failed (${res.status})`);
  }
}

/** Stream one expert's answer. Calls onText(chunk) as text arrives. */
export async function streamChat({ agent, messages, password, onText, signal }) {
  const res = await fetch("/api/chat", {
    method: "POST", headers: headers(password), body: JSON.stringify({ agent, messages }), signal,
  });
  if (!res.ok) throw await errorFrom(res);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let done = null;
  for (;;) {
    const { value, done: finished } = await reader.read();
    if (finished) break;
    buffer += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line) continue;
      const event = JSON.parse(line);
      if (event.type === "text") onText(event.text);
      else if (event.type === "error") throw new Error(event.message);
      else if (event.type === "done") done = event;
    }
  }
  if (!done) throw new Error("The answer was cut off (Netlify functions stop after 60 seconds). Ask for a shorter answer, or use Ask the whole team for big questions.");
  if (done.stop_reason === "refusal") throw new Error("The model declined to answer this question.");
  if (done.stop_reason === "max_tokens") onText("\n\n*(Answer truncated at the length limit.)*");
  return done;
}

/** Start an orchestrated team run (background function; Netlify replies 202 immediately). */
export async function startTeam({ id, question, history, password }) {
  const res = await fetch("/api/team-run", {
    method: "POST", headers: headers(password), body: JSON.stringify({ id, question, history }),
  });
  if (!res.ok && res.status !== 202) throw await errorFrom(res);
}

/** Read a team run's progress. Returns { status: "queued" } until the background function has started. */
export async function teamStatus({ id, password }) {
  const res = await fetch(`/api/team-status?id=${encodeURIComponent(id)}`, { headers: headers(password) });
  if (res.status === 404) return { status: "queued" };
  if (!res.ok) throw await errorFrom(res);
  return res.json();
}
