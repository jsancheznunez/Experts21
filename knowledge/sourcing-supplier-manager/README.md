# Knowledge — sourcing-supplier-manager (Mei)

Documents in this folder are read by the **sourcing-supplier-manager** agent before every answer (see [`.claude/agents/sourcing-supplier-manager.md`](../../.claude/agents/sourcing-supplier-manager.md)). Put the consultant's own facts here: they take priority over the general research in `docs/`.

## What belongs here
- Supplier quotes and price lists
- Sample and test-order results
- Supplier agreements and SLAs
- Certificates (food-contact, Prop 65, FCC, CPC)

## What does not belong here
- Passwords, API keys, tokens or other credentials
- Customer personal data (names, emails, addresses); summarize or anonymize instead
- General market research that every agent needs: put it in `docs/`

## Conventions
- Prefer Markdown, CSV or PDF. Name files `YYYY-MM-DD-topic.ext` so the newest is obvious.
- Put a one-line summary and the source/date at the top of each Markdown file.
- Remove or archive outdated files (`archive/` subfolder): the agent reads everything here.
