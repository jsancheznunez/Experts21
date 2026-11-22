# Ask Zoe from Node.js (Claude Agent SDK)

`ask-zoe.mjs` loads **Zoe**, the team's creative director, from this repository and asks a question passed on the command line. It uses the [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview) (`@anthropic-ai/claude-agent-sdk`, pinned to `0.3.330`).

## What it loads

| Source | What Zoe gets |
|---|---|
| `.claude/agents/creative-director.md` | Personality, instructions and deliverable format (system prompt), model (`sonnet`), tools |
| `.claude/skills/<name>/SKILL.md` | The 7 skills listed in Zoe's `skills:` front matter, inlined into the prompt |
| `knowledge/creative-director/` | Every text file (`.md .txt .csv .json .yaml`), inlined; `archive/` is skipped |
| `docs/` | Not inlined: Zoe reads the research files with the `Read` tool when needed |

The SDK runs in isolation mode (`settingSources: []`), so this project's `CLAUDE.md` and other agents don't affect the answer. Zoe runs as the main agent (`agent: "creative-director"`) with read-only tools (Read, Grep, Glob, WebSearch, WebFetch); writing files, running commands and calling other agents are blocked. Each run is capped at 20 turns and about $2 (see the settings below).

## Requirements

- Node.js 18.14 or later
- An Anthropic API key from the [Claude Console](https://platform.claude.com/)

The SDK bundles the Claude Code binary, so nothing else needs to be installed.

## Install

From the repository root:

```bash
cd sdk
```

```bash
npm install
```

## Set your API key

macOS / Linux:

```bash
export ANTHROPIC_API_KEY=your-api-key
```

Windows (PowerShell):

```powershell
$env:ANTHROPIC_API_KEY = "your-api-key"
```

The SDK reads the key from the environment and doesn't load `.env` files. Never commit the key to this repository. Amazon Bedrock, Google Vertex AI and Microsoft Foundry work too: set `CLAUDE_CODE_USE_BEDROCK=1`, `CLAUDE_CODE_USE_VERTEX=1` or `CLAUDE_CODE_USE_FOUNDRY=1` and that platform's credentials instead of the API key.

## Run

```bash
node ask-zoe.mjs "Write three UGC hooks and a creator brief for a waterproof dog car hammock"
```

The answer is printed to stdout; progress, turn count and estimated cost go to stderr. With npm:

```bash
npm run ask-zoe -- "Which ad angle should we test first for the harness walk kit?"
```

### Check the setup without spending anything

Show what was loaded (no API call):

```bash
node ask-zoe.mjs --dry-run "any question"
```

Start an SDK session and confirm it registered Zoe (no model request):

```bash
node ask-zoe.mjs --check
```

### Settings (environment variables)

| Variable | Default | Effect |
|---|---|---|
| `ZOE_MODEL` | `sonnet` (from Zoe's file) | Model alias or full ID, e.g. `opus` |
| `ZOE_MAX_TURNS` | `20` | Maximum agent turns |
| `ZOE_MAX_BUDGET_USD` | `2` | Stop when the estimated cost reaches this amount |
| `ZOE_VERBOSE` | off | `1` prints each tool call to stderr |

## Feeding Zoe your own material

Drop briefs, winning-ad notes, brand guides or creator rosters into `knowledge/creative-director/` (text formats). They are loaded on the next run. Binary files such as PDFs and images, or anything beyond about 200,000 characters in total, are listed as "Skipped" in `--dry-run` and not inlined.
