---
name: product-scoring
description: Score a candidate dropshipping product on the 9-criteria scorecard (demand, wow factor, price band, landed cost, price-check risk, US warehouse, returns, repeat potential, regulatory risk) and give a go/test/reject verdict. Use whenever products or niches are compared.
metadata:
  id: S04
---

# Product scoring

Source of the criteria: `docs/02-high-demand-products.md`.

## Scorecard (1 = poor, 5 = excellent)
| # | Criterion | Weight | 5 looks like | 1 looks like |
|---|---|---|---|---|
| 1 | Visible demand | 2 | Validated by 4+ signals (see demand-validation) | No evidence |
| 2 | "Wow" / problem-solving in 3 seconds | 1.5 | Instantly demonstrable on video | Needs explanation |
| 3 | Retail price band $25–$80 | 1 | $35–$60 | Under $15 or over $150 |
| 4 | Landed cost ≤ 30–35% of retail | 2 | ≤ 25% | ≥ 50% |
| 5 | Hard to price-check | 1.5 | Bundle/branded/exclusive variant | Identical $6 Temu listing |
| 6 | US/EU warehouse stock (2–7 days) | 1.5 | 2+ suppliers with US stock | China-only, 2–4 weeks |
| 7 | Low return/defect risk | 1 | Small, light, durable, no sizing | Fragile, sized, electronic |
| 8 | Repeat or accessory potential | 1 | Consumable or natural add-ons | One-off |
| 9 | Low regulatory risk | 2 (gate) | No claims or certifications needed | Ingestible, medical, kids', batteries, IP-sensitive |

**Weighted score** = Σ(score × weight) / Σ(weights) → out of 5.

## Gates (automatic reject regardless of score)
- Criterion 9 scores 1 (e.g. medical claims, children's product without CPC certification, counterfeit/trademark issues, weapons).
- Contribution margin before ads below 45% (check with unit-economics).
- No supplier can deliver within 10 days to the target market.

## Verdict
| Weighted score | Verdict |
|---|---|
| ≥ 4.0 | **Go** — candidate hero product |
| 3.3–3.9 | **Test** — small ad test with a capped budget |
| < 3.3 or any gate failed | **Reject** |

## Output
A table with one row per product: scores per criterion, weighted score, gates, verdict, and the single biggest risk. Show your evidence for criteria 1, 4 and 9.
