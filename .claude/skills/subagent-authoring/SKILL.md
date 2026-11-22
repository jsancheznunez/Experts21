---
name: subagent-authoring
description: Create, improve or retire Claude Code project subagents in .claude/agents/ for the expert team - frontmatter fields, tool and skill wiring, prompt structure, routing-table updates and validation. Use when adding a new expert, changing an agent's role, tools or skills, or fixing an agent that performs poorly.
metadata:
  id: S39
---

# Subagent authoring

Reference: https://code.claude.com/docs/en/sub-agents (verify field names there when unsure; the page changes).

## File format
`.claude/agents/<name>.md` — the opening `---` must be line 1; YAML frontmatter, then the system prompt in Markdown.

| Field | Use in this project |
|---|---|
| `name` (required) | lowercase-hyphenated, unique; same as filename; no `:` |
| `description` (required) | When to delegate: start with "Use for/when…", list trigger topics; keep ≤ ~60 words (all descriptions share a ~15k-token budget) |
| `tools` | Comma list. Research: `Read, Grep, Glob, WebSearch, WebFetch`; add `Write, Edit` for agents that save deliverables; `Bash` only for calculations/CLI work; `Agent` only for agents that delegate (orchestrator) |
| `skills` | YAML list of skill folder names; **full skill content is preloaded** at startup; max 32; skills with `disable-model-invocation: true` cannot be preloaded |
| `model` | Omit (inherit) unless there is a reason; `sonnet`/`haiku` for cheap high-volume agents |
| `color` | Domain color: business blue, technical cyan, operations orange, finance green, legal red, marketing pink, orchestrator purple, meta yellow |
| others | `permissionMode`, `maxTurns`, `memory`, `effort`, `isolation`, `hooks`, `mcpServers` — only when needed |

## Prompt body template (keep this structure for every expert)
```
You are the [Role] on the Shopify dropshipping advisory team. [one-line job]

## Read first            → docs/ files for this role
## Responsibilities      → 4–6 bullets
## How you work          → numbered method that applies the preloaded skills
## Deliverable           → exact output format
## Work with others      → which experts to recommend for hand-offs (subagents can't see each other)
## Guardrails            → shared team guardrails + role-specific ones
```
Subagents start with a fresh context: the body plus preloaded skills is all they know, so name the docs to read and the output format explicitly.

## Changing the team — checklist
1. Check `expert-routing` for overlap; prefer extending an existing agent or skill over adding a new one.
2. Create/edit the agent file; wire skills that exist (create missing ones with skill-authoring).
3. Add or update the agent's row in `.claude/skills/expert-routing/SKILL.md` (and panels if relevant).
4. Update `docs/expert-roster.md` and the team table in `CLAUDE.md`.
5. Run `python3 .claude/scripts/validate_team.py --map` and fix every ERROR.
6. Keep the team within 10–50 agents.

## Improving an agent
Look for: vague description (wrong delegation), missing docs references, missing output format, tools too broad, skills not wired, guardrails missing. Change one thing at a time and state why.
