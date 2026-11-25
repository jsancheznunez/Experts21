# NLP Lab: the NLTK pipeline in the web app
Summary: how the app's NLP Lab uses NLTK. Source: `web/scripts/nlp_analysis.py`, 25 Nov 2026.

- **Runs:** at build time on Netlify via `web/scripts/build-nlp.sh` (Python virtual environment, `web/nlp-requirements.txt`), output `web/src/nlp/nlp-results.json`. `NLP_STRICT=1` in `netlify.toml` makes a failed analysis fail the deploy (the previous deploy stays live).
- **Versions:** NLTK 3.10.4; data packages `punkt_tab`, `stopwords`, `vader_lexicon` downloaded into `web/.nltk_data`.
- **Corpus:** `docs/0*.md` converted to plain text (Sources sections, links, code and rating-only table cells removed; table rows become sentences; the repeated "Research date" line is dropped).
- **Steps:** `sent_tokenize`/`word_tokenize` → stopwords (NLTK English + per, via, etc, also, may, one, see) → `FreqDist` (top 25 overall, top 12 per doc) → VADER mean compound per doc over sentences of 5+ words, plus most positive/negative sentence → bigram (freq ≥ 2) and trigram (freq ≥ 2) collocations by likelihood ratio.
- **Known quirks:** NLTK 3.10 refuses data downloads through an HTTP proxy unless `NLTK_ALLOW_PROXIED_URLOPEN=1` is set (only behind a trusted proxy). VADER scores on formal research text are indicative only; the risks doc is the only negative one.
