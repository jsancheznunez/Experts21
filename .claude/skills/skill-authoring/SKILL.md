---
name: skill-authoring
description: Create, improve or retire Claude Code project skills in .claude/skills/[name]/SKILL.md for the expert team - frontmatter, concise domain instructions, supporting files, sharing a skill across agents, and validation. Use when an agent needs a new capability or an existing skill is wrong, stale or too long.
metadata:
  id: S40
---

# Skill authoring

Reference: https://code.claude.com/docs/en/skills (verify field names there when unsure).

## File format
`.claude/skills/<skill-name>/SKILL.md`; opening `---` on line 1.

| Field | Use in this project |
|---|---|
| `name` | Same as the folder; lowercase-hyphenated |
| `description` | What it does + when to use it, key use case first, natural keywords; no `<` or `>`; description + `when_to_use` ≤ 1,536 chars |
| `metadata.id` | Stable ID `S##` matching `docs/expert-roster.md` (ignored by Claude Code, used by our validator) |
| `disable-model-invocation` | **Never `true` for skills agents preload** — it blocks preloading |
| `allowed-tools`, `context: fork`, `agent`, `arguments`, `argument-hint` | Only for task-style skills that run a procedure |

## Content rules
- Domain knowledge skills are **preloaded into every agent that lists them**, so every line costs tokens in every run. Keep SKILL.md well under 500 lines (this team targets 40–80).
- Lead with the most important rules; after compaction only the first ~5,000 tokens of a skill are kept.
- Write instructions, checklists, formulas, thresholds and output formats — not essays.
- Cite the `docs/` file a fact comes from; date volatile numbers (prices, tariffs, benchmarks) and tell the agent to verify them.
- Put long reference material in a supporting file in the skill folder and link it (`[reference.md](reference.md)`); scripts go in `scripts/` and are run, not loaded.
- One skill = one capability that can be **shared**. If two agents need the same knowledge, they share one skill; don't duplicate text into agent prompts.

## Changing skills — checklist
1. Check existing skills (`ls .claude/skills`) for overlap; extend before creating.
2. Write or edit the SKILL.md; assign the next free `S##` id for new skills.
3. Wire it: add the skill name to the `skills:` list of every agent that needs it.
4. Update `docs/expert-roster.md` (skill table) and `CLAUDE.md` if the skill list is shown there.
5. Run `python3 .claude/scripts/validate_team.py --map`; fix every ERROR; resolve "not preloaded by any agent" warnings.

## Improving a skill
Signals: agents give inconsistent answers, cite stale numbers, ignore a rule, or produce the wrong format. Fix by tightening the rule, moving it to the top, adding a threshold or an output template, or refreshing data via web-research (note the new date and source).
