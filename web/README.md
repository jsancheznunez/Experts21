# Experts21 web app

A React chat app for talking to the advisory team:

- **Sidebar:** every agent with first name, title, model (opus / sonnet / haiku) and voice, grouped by domain.
- **Chat window:** pick an expert and ask; the answer streams in. Each expert keeps its own conversation (saved in your browser).
- **Ask the whole team:** Maya (the orchestrator) picks a panel, the experts answer in parallel, reviewers check their work, and Maya writes one combined answer. You can expand each expert's individual report.

Agents, skills, knowledge folders and research docs are read from this repository **at build time** (`scripts/build-agents.mjs`). The Claude API is only called from **Netlify Functions**, so your API key never reaches the browser.

## How it works

```
Browser (React, Vite)                        Netlify Functions (server)                Claude API
  sidebar ← src/generated/agents.json          /api/chat         streams one expert ──►  messages (stream)
  chat    ── POST /api/chat ─────────────────►  (60 s limit)
  team    ── POST /api/team-run ─────────────►  background, 15 min: plan → experts → reviewers → synthesis
          ── GET  /api/team-status?id= (poll) ◄─ progress stored in Netlify Blobs
```

| File | Purpose |
|---|---|
| `scripts/build-agents.mjs` | Reads `../.claude/agents`, `../.claude/skills`, `../knowledge`, `../docs`. Writes `src/generated/agents.json` (public: names, personalities, models) and `server/generated/agents-full.mjs` (server-only: prompts, skills, docs, knowledge) |
| `server/claude.mjs` | Builds each agent's system prompt, maps models (opus → `claude-opus-5-5`, sonnet → `claude-sonnet-5-5`, haiku → `claude-haiku-5-5`), prompt caching, refusal fallbacks, optional password check |
| `server/team.mjs` | The whole-team flow |
| `netlify/functions/chat.mjs` | `POST /api/chat`, streaming |
| `netlify/functions/team-run.mjs` | `POST /api/team-run`, background function |
| `netlify/functions/team-status.mjs` | `GET /api/team-status` |
| `../netlify.toml` | Tells Netlify to build from `web/`, publish `dist/`, and bundle the functions |

## Deploy to Netlify (step by step)

You need a Netlify account and an Anthropic API key from the [Claude Console](https://platform.claude.com/).

1. **Import the repository**
   1. In Netlify, choose **Add new project → Import an existing project → GitHub**.
   2. Authorize Netlify for GitHub if asked, then pick the repository **`jsancheznunez/Experts21`**.
   3. Choose the branch **`main`**.
   4. Leave the build settings as Netlify shows them: they come from `netlify.toml` (base directory `web`, build command `npm run build`, publish directory `dist`, functions `netlify/functions`). Don't type anything into these fields.
   5. Click **Deploy**. The first deploy builds the site; chatting won't work until the key is set (next step).

2. **Add your API key**
   1. Open the project and go to **Project configuration → Environment variables** (older UI: **Site configuration → Environment variables**).
   2. Click **Add a variable → Add a single variable**.
   3. Key: `ANTHROPIC_API_KEY`. Value: your key.
   4. Tick **Contains secret values** if offered, and make sure the **scopes include Functions** (the default "All scopes" is fine).
   5. Save.

3. **Protect the site with a password (strongly recommended)**
   Anyone who finds your site URL could otherwise spend your API credit.
   1. Add another variable: key `APP_PASSWORD`, value a password of your choice, scopes include Functions.
   2. The app asks for this password the first time you send a message and remembers it in that browser.
   3. Also set a monthly spend limit for the key in the Claude Console.

4. **Redeploy so the functions see the variables**
   Environment variables are fixed per deploy. Go to **Deploys → Trigger deploy → Deploy project** (older UI: **Deploy site**).

5. **Test it**
   1. Open your Netlify URL (shown at the top of the project page, like `https://your-name.netlify.app`).
   2. Pick an expert, for example **Zoe**, and ask a short question. Text should stream in within a few seconds.
   3. Click **Ask the whole team** and ask a bigger question. You'll see the panel, each expert's progress, then the combined answer (about 2–5 minutes).

After this, every push to `main` redeploys automatically, so edits to agents, skills, `knowledge/` or `docs/` show up in the app on the next build.

## Costs and limits

- **Single expert:** one Claude call. Usually a few cents (haiku agents less, opus agents more).
- **Whole team:** about 5–10 calls (Maya on opus for planning and synthesis, plus 2–8 experts). Roughly $0.30–$2 per question, depending on the panel. Long system prompts are cached to reduce repeat costs.
- **Netlify limits:** a single-expert answer must finish within Netlify's 60-second function limit. Answers are capped at 6,000 tokens, which normally fits; if one is cut off, the app says so. Team runs use a background function, which can run up to 15 minutes.
- **Plan note:** Netlify has historically limited background functions to paid plans. If "Ask the whole team" says the run never started, check your plan and the function log (below).

## Run locally

From `web/`:

```bash
npm install
```

```bash
npm run build
```

To run the full app with functions locally, use the Netlify CLI (it also emulates Blobs):

```bash
npx netlify-cli@27.16.2 dev
```

Set `ANTHROPIC_API_KEY` in your shell first (`export ANTHROPIC_API_KEY=...`), or link the site with `netlify link` to use the Netlify variables.

To test the server code against the real Claude API without Netlify:

```bash
node scripts/test-local.mjs chat creative-director "Give me three hooks for a dog car hammock"
```

```bash
node scripts/test-local.mjs team "Keep the panel small: is a $39.95 dog harness viable?"
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| "ANTHROPIC_API_KEY is not set" | Add the variable (scopes include Functions) and **redeploy** |
| "The Claude API rejected the API key" | Check the key value in Netlify; redeploy after changing it |
| "The answer was cut off" | The 60-second limit hit. Ask for a shorter answer, or use Ask the whole team |
| "The team run never started" | Open **Logs → Functions → team-run** in Netlify. Check that background functions are available on your plan and that `APP_PASSWORD` matches |
| Password prompt keeps coming back | The password doesn't match `APP_PASSWORD`; clear it with your browser's site data |
| An agent or knowledge change isn't showing | Push to `main` (or trigger a deploy); data is read at build time |
| Can't find **Trigger deploy** to redeploy | Open **Deploys**, click the latest deploy and use **Retry** / **Options → Retry deploy**, or push any change to `main` (Netlify rebuilds automatically when the project is linked to the GitHub repo) |

## Security notes

- The API key is read only inside Netlify Functions (`server/claude.mjs`). The browser bundle contains names, personalities and models only; prompts, skills and knowledge stay server-side.
- Don't put secrets or customer personal data in `knowledge/`: it's bundled into the functions.
- Chat history is stored in your browser's local storage only.
