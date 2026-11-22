# Knowledge — team-architect (Ada)

Documents in this folder are read by the **team-architect** agent before every answer (see [`.claude/agents/team-architect.md`](../../.claude/agents/team-architect.md)). Put the consultant's own facts here: they take priority over the general research in `docs/`.

## What belongs here
- Feedback about agents' answers (good and bad)
- Requests for new experts or skills
- Change log of team edits
- Ideas for new skills

## What does not belong here
- Passwords, API keys, tokens or other credentials
- Customer personal data (names, emails, addresses); summarize or anonymize instead
- General market research that every agent needs: put it in `docs/`

## Conventions
- Prefer Markdown, CSV or PDF. Name files `YYYY-MM-DD-topic.ext` so the newest is obvious.
- Put a one-line summary and the source/date at the top of each Markdown file.
- Remove or archive outdated files (`archive/` subfolder): the agent reads everything here.
