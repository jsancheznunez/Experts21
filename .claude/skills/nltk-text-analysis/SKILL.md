---
name: nltk-text-analysis
description: Analyze store text with NLTK - tokenizing, stopword removal, word frequency (FreqDist), VADER sentiment and collocations - for reviews, support tickets, ad comments and research. Use when a question needs counts, sentiment or recurring phrases from text, or when changing the NLTK part of the web app's NLP Lab.
metadata:
  id: S41
---

# NLTK text analysis

Baseline: `docs/09-nlp-text-analysis.md`. Project pin: **NLTK 3.10.4**. The app's analysis lives in `web/scripts/nlp_analysis.py`.

## Setup (data packages)
```python
import nltk
for pkg in ["punkt_tab", "stopwords", "vader_lexicon"]:
    nltk.download(pkg, download_dir=".nltk_data", quiet=True)
nltk.data.path.insert(0, ".nltk_data")
```
NLTK 3.10 refuses to download through a proxy (anti-SSRF). Only behind a trusted proxy, opt in with `NLTK_ALLOW_PROXIED_URLOPEN=1`.

## Methods
| Goal | NLTK call | Notes |
|---|---|---|
| Sentences / tokens | `sent_tokenize(text)`, `word_tokenize(text)` | Needs `punkt_tab` |
| Remove noise | `nltk.corpus.stopwords.words("english")` + a short domain list | Keep `isalpha()` tokens, lowercase, length > 2 |
| Word frequency | `FreqDist(words).most_common(n)` | Report per segment (product, week) and overall |
| Sentiment | `SentimentIntensityAnalyzer().polarity_scores(s)["compound"]` | ≥ 0.05 positive, ≤ −0.05 negative, else neutral; average over sentences of 5+ words |
| Recurring phrases | `BigramCollocationFinder.from_words(words)`; `apply_word_filter(stop)`; `apply_freq_filter(2)`; `nbest(BigramAssocMeasures.likelihood_ratio, 20)` | Trigrams: `TrigramCollocationFinder` |

## Recipes for the store
- **Review mining:** split reviews by star rating; compare top words and bigrams of 1–2★ vs 4–5★. The difference shows the complaints.
- **Ticket themes:** weekly `FreqDist` on ticket text; alert when a word (e.g. "late", "broken") rises fast.
- **Sentiment trend:** mean VADER compound per product per week; flag drops greater than 0.1.
- **Ad and SEO phrases:** collocations from 5★ reviews become candidate hooks (hand them to compliance before use).

## Rules
- State the sample size with every number; under ~50 texts, call results directional.
- VADER is tuned for short social text: say so when you apply it to long or formal text.
- Strip personal data (names, emails, order numbers) before analysis; never paste raw customer data into the repo.
- Show the code or functions used so results can be reproduced.

## Output
Table of counts or scores, top terms or phrases with frequencies, sentiment summary with example sentences, sample size and caveats.
