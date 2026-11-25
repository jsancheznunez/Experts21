# NLP Lab: the spaCy pipeline in the web app
Summary: how the app's NLP Lab uses spaCy. Source: `web/scripts/nlp_analysis.py`, 25 Nov 2026.

- **Runs:** at build time on Netlify (see the NLTK note in `knowledge/nltk-expert/`); output `web/src/nlp/nlp-results.json`.
- **Versions:** spaCy 3.8.18, model `en_core_web_sm` 3.8.0 installed from its pinned GitHub release wheel.
- **Pipeline:** tok2vec, tagger, parser, attribute_ruler, lemmatizer, **entity_ruler** (added before ner, `phrase_matcher_attr: LOWER`), ner.
- **EntityRuler labels:** PLATFORM (23 phrases: Shopify, TikTok Shop, Temu…), REGULATION (15: FTC, TCPA, de minimis…), METRIC (13: ROAS, CPA, AOV…). Patterns live in `RULER_PATTERNS` in the script.
- **Outputs:** entity counts and top entities for PLATFORM, REGULATION, METRIC, ORG, MONEY, PERCENT, DATE, GPE; highlighted paragraph per doc; top lemmatized noun chunks; top verb and adjective lemmas; a word-to-lemma example; 3 dependency parses with token tables and displaCy SVGs.
- **Known model errors (small model):** acronyms tagged as places (e.g. "VA", "AI" as GPE), tool names as GPE ("Minea"), MONEY values like "0" from price ranges, and odd lemmas for jargon ("dropshipping" → "dropshippe"). Fix systematic ones with ruler patterns.
