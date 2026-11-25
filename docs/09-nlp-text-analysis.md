# 09 — NLP for the Store: NLTK and spaCy

> Research date: November 2026. Versions used in this project: **NLTK 3.10.4** and **spaCy 3.8.18** with the **en_core_web_sm 3.8.0** model.

A dropshipping business produces a lot of text: customer reviews, support tickets, ad comments, competitor product pages, supplier listings and its own research. Natural language processing (NLP) turns that text into numbers the team can act on. This project uses two open-source Python libraries, each for what it does best.

## The two libraries

| | NLTK | spaCy |
|---|---|---|
| What it is | Natural Language Toolkit: a broad library of classic NLP algorithms, corpora and lexicons | Industrial NLP library with trained pipelines (tagger, parser, named-entity recognizer) |
| Strengths | Tokenizing, stopword lists, frequency distributions, collocations, rule-based VADER sentiment | Named entities, noun chunks, lemmas, part-of-speech tags, dependency parsing, rule-based EntityRuler, displaCy visualizations |
| Model needed | No trained model; downloads small data packages (`punkt_tab`, `stopwords`, `vader_lexicon`) | A trained pipeline such as `en_core_web_sm` (about 12 MB) |
| Speed | Fine for small to medium corpora | Built for speed on large volumes |
| License | Apache 2.0 | MIT |

## Where each one helps the business

| Business question | Library and method |
|---|---|
| What do customers complain about most? | NLTK: tokenize reviews and tickets, remove stopwords, `FreqDist` of words; collocations to find recurring phrases ("arrived broken", "wrong size") |
| Are reviews getting better or worse? | NLTK: VADER sentiment per review, averaged by week or product |
| Which brands, platforms and prices do competitors mention? | spaCy: named entities (ORG, MONEY, PERCENT) plus a custom `EntityRuler` for platforms and regulations |
| What product features do customers talk about? | spaCy: noun chunks ("battery life", "strap buckle"), lemmatized so plurals and tenses group together |
| Who did what to whom in a complaint ("the courier left the box outside")? | spaCy: dependency parse (subject, verb, object) |
| Which phrases should go into ad copy and SEO? | NLTK collocations plus spaCy noun chunks from top reviews |

## How this project uses them

The web app's **NLP Lab** page shows both libraries applied to the team's own research (`docs/01`–`docs/09`). The analysis runs in `web/scripts/nlp_analysis.py` during every Netlify build, because Netlify Functions run JavaScript, not Python. Results go to `web/src/nlp/nlp-results.json`.

**Part 1, NLTK:**
- `sent_tokenize` and `word_tokenize` (Punkt) give sentence and token counts.
- The English `stopwords` list (plus a few corpus-specific words) is removed.
- `FreqDist` gives word frequency, for the whole corpus and per document.
- `SentimentIntensityAnalyzer` (VADER) gives mean compound sentiment per document, plus the most positive and most negative sentence.
- `BigramCollocationFinder` and `TrigramCollocationFinder` are ranked by likelihood ratio.

**Part 2, spaCy:**
- `en_core_web_sm` provides statistical named entities (ORG, MONEY, PERCENT, DATE, GPE).
- An `entity_ruler` added before `ner` adds custom labels: **PLATFORM** (Shopify, TikTok Shop, Temu…), **REGULATION** (FTC, TCPA, de minimis…) and **METRIC** (ROAS, CPA, AOV…).
- `doc.noun_chunks` gives noun chunks, lemmatized.
- `token.lemma_` with `token.pos_` gives the most frequent verbs, plus a word-to-lemma example.
- Dependency parses use `token.dep_` and `token.head`, drawn with `displacy.render(style="dep")`.

## Limitations to keep in mind

- **VADER** was built for short social-media text. On formal research or very long reviews, the scores are indicative only. Negations and sarcasm can fool it.
- **en_core_web_sm** is the small English model. It is fast, but it mislabels some acronyms (for example "VA" as a place) and occasionally lemmatizes jargon oddly. Larger models (`en_core_web_md`, `en_core_web_lg`, `en_core_web_trf`) are more accurate and much bigger.
- **EntityRuler patterns** only find what is listed. Update the pattern lists as the store's platforms and suppliers change.
- **Sample size:** sentiment and frequency from a few dozen reviews are anecdotes, not trends.
- **Privacy:** strip customer names, emails and addresses before analyzing tickets or reviews.

## Sources

- [NLTK documentation](https://www.nltk.org/)
- [NLTK tokenize API](https://www.nltk.org/api/nltk.tokenize.html)
- [NLTK sentiment HOWTO (VADER)](https://www.nltk.org/howto/sentiment.html)
- [NLTK collocations HOWTO](https://www.nltk.org/howto/collocations.html)
- [Installing NLTK data](https://www.nltk.org/data.html)
- [nltk on PyPI](https://pypi.org/project/nltk/)
- [spaCy linguistic features](https://spacy.io/usage/linguistic-features)
- [spaCy EntityRuler API](https://spacy.io/api/entityruler)
- [spaCy rule-based matching](https://spacy.io/usage/rule-based-matching)
- [spaCy English models](https://spacy.io/models/en)
- [displaCy visualizers](https://spacy.io/usage/visualizers)
- [spacy on PyPI](https://pypi.org/project/spacy/)
