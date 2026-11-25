# Knowledge — spacy-expert (Sofia)

Documents in this folder are read by the **spacy-expert** agent before every answer (see [`.claude/agents/spacy-expert.md`](../../.claude/agents/spacy-expert.md)). Put the consultant's own facts here: they take priority over the general research in `docs/`.

## What belongs here
- EntityRuler pattern lists (platforms, suppliers, products, regulations)
- Anonymized competitor page or supplier listing text to analyze
- Spot-check notes on model errors and the fixes applied
- Notes on the NLP Lab's spaCy section (pipeline, versions, known quirks)

## What does not belong here
- Passwords, API keys, tokens or other credentials
- Customer personal data (names, emails, addresses); summarize or anonymize instead
- General market research that every agent needs: put it in `docs/`

## Conventions
- Prefer Markdown, CSV or PDF. Name files `YYYY-MM-DD-topic.ext` so the newest is obvious.
- Put a one-line summary and the source/date at the top of each Markdown file.
- Remove or archive outdated files (`archive/` subfolder): the agent reads everything here.
