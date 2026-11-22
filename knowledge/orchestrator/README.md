# Knowledge — orchestrator (Maya)

Documents in this folder are read by the **orchestrator** agent before every answer (see [`.claude/agents/orchestrator.md`](../../.claude/agents/orchestrator.md)). Put the consultant's own facts here: they take priority over the general research in `docs/`.

## What belongs here
- Records of past questions and the final answers/decisions
- Consultant preferences (budget limits, risk appetite, report format)
- Standing context about the business (stage, niche, live products)
- Notes on which panels worked well or badly

## What does not belong here
- Passwords, API keys, tokens or other credentials
- Customer personal data (names, emails, addresses); summarize or anonymize instead
- General market research that every agent needs: put it in `docs/`

## Conventions
- Prefer Markdown, CSV or PDF. Name files `YYYY-MM-DD-topic.ext` so the newest is obvious.
- Put a one-line summary and the source/date at the top of each Markdown file.
- Remove or archive outdated files (`archive/` subfolder): the agent reads everything here.
