---
name: spacy-nlp-pipeline
description: Analyze store text with spaCy - named entities, a custom EntityRuler for platforms, regulations and metrics, noun chunks, lemmas, part-of-speech tags, dependency parsing and displaCy visuals - for competitor pages, supplier listings, reviews and research. Use when a question needs entities, product features or sentence structure from text, or when changing the spaCy part of the web app's NLP Lab.
metadata:
  id: S42
---

# spaCy NLP pipeline

Baseline: `docs/09-nlp-text-analysis.md`. Project pin: **spaCy 3.8.18**, model **en_core_web_sm 3.8.0**. The app's analysis lives in `web/scripts/nlp_analysis.py`.

## Setup
```python
import spacy
nlp = spacy.load("en_core_web_sm")          # tok2vec, tagger, parser, attribute_ruler, lemmatizer, ner
ruler = nlp.add_pipe("entity_ruler", before="ner", config={"phrase_matcher_attr": "LOWER"})
ruler.add_patterns([{"label": "PLATFORM", "pattern": "TikTok Shop"}, {"label": "REGULATION", "pattern": "FTC"}])
docs = list(nlp.pipe(texts))                # batch for speed
```
Install the model with the pinned wheel URL (see `web/nlp-requirements.txt`), not `spacy download`, so builds are reproducible.

## Methods
| Goal | spaCy | Notes |
|---|---|---|
| Entities | `doc.ents` → `ent.text`, `ent.label_` | Statistical labels: ORG, MONEY, PERCENT, DATE, GPE, PRODUCT… |
| Custom entities | `entity_ruler` before `ner` | Project labels: PLATFORM, REGULATION, METRIC; add suppliers and product names as needed |
| Product features | `doc.noun_chunks` → lemmatized text | Drop pronoun roots and all-stopword chunks |
| Normalize words | `token.lemma_`, `token.pos_` | Count verb lemmas for "what customers do", adjectives for "how they describe it" |
| Sentence structure | `token.dep_`, `token.head`, `sent.root` | Find subject–verb–object in complaints |
| Visuals | `displacy.render(doc, style="dep" or "ent")` | Render at build time; embed the SVG/HTML |

## Recipes for the store
- **Competitor teardown:** run competitor product pages through the pipeline; tabulate MONEY (prices), PERCENT (discounts), PLATFORM and claims sentences.
- **Supplier listings:** extract materials, dimensions (CARDINAL/QUANTITY) and certifications with EntityRuler patterns ("CE", "FCC", "BPA-free").
- **Review features:** top noun chunks in 1–2★ reviews give the features that fail; in 4–5★, the features that sell.
- **Complaint triage:** dependency patterns like nsubj → VERB → dobj ("courier lost package") to route tickets.

## Rules
- `en_core_web_sm` mislabels some acronyms and jargon. Spot-check 10–20 entities before reporting, and fix systematic errors with ruler patterns.
- Keep EntityRuler patterns in code (versioned). Document new labels in `docs/09`.
- Strip personal data first. spaCy's PERSON entities can help find names to redact.
- Report counts with the sample size; show example sentences for each finding.

## Output
Entity table by label (top items and counts), noun-chunk and lemma lists, example parses or highlighted sentences, the pipeline and patterns used, caveats.
