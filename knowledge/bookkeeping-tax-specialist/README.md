# Knowledge — bookkeeping-tax-specialist (Ingrid)

Documents in this folder are read by the **bookkeeping-tax-specialist** agent before every answer (see [`.claude/agents/bookkeeping-tax-specialist.md`](../../.claude/agents/bookkeeping-tax-specialist.md)). Put the consultant's own facts here: they take priority over the general research in `docs/`.

## What belongs here
- Chart of accounts and month-end checklists
- Sales-tax registrations and nexus tracker
- CPA notes and filing calendar
- Reconciliation reports (no bank credentials)

## What does not belong here
- Passwords, API keys, tokens or other credentials
- Customer personal data (names, emails, addresses); summarize or anonymize instead
- General market research that every agent needs: put it in `docs/`

## Conventions
- Prefer Markdown, CSV or PDF. Name files `YYYY-MM-DD-topic.ext` so the newest is obvious.
- Put a one-line summary and the source/date at the top of each Markdown file.
- Remove or archive outdated files (`archive/` subfolder): the agent reads everything here.
