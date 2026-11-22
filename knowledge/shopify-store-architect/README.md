# Knowledge — shopify-store-architect (Kenji)

Documents in this folder are read by the **shopify-store-architect** agent before every answer (see [`.claude/agents/shopify-store-architect.md`](../../.claude/agents/shopify-store-architect.md)). Put the consultant's own facts here: they take priority over the general research in `docs/`.

## What belongs here
- Store settings exports and app list
- Theme customization notes and code snippets
- Launch checklists and QA results
- Store URL and plan details (no passwords or API keys)

## What does not belong here
- Passwords, API keys, tokens or other credentials
- Customer personal data (names, emails, addresses); summarize or anonymize instead
- General market research that every agent needs: put it in `docs/`

## Conventions
- Prefer Markdown, CSV or PDF. Name files `YYYY-MM-DD-topic.ext` so the newest is obvious.
- Put a one-line summary and the source/date at the top of each Markdown file.
- Remove or archive outdated files (`archive/` subfolder): the agent reads everything here.
