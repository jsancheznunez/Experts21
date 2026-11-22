---
name: cro-ab-testing
description: Improve conversion rate and order value with funnel analysis, prioritized hypotheses and statistically sound A/B tests on pages, offers, ads and emails. Use when diagnosing a weak funnel or planning experiments.
metadata:
  id: S15
---

# CRO & A/B testing

## Benchmarks (Shopify, docs/07)
| Metric | Median | Top 20% | Top 10% |
|---|---|---|---|
| Conversion rate | ~1.4% (Shogun 2026: median 1.7%, mean 2.6%) | ≥ 3.2% | ≥ 4.7% |
| Add-to-cart rate | ~4.6% | ≥ 7.5% | ≥ 9.6% |
Health & beauty converts higher (~3% top quartile) than electronics (~1.8%).

## Diagnose the funnel
Sessions → product view → add to cart → checkout started → purchase. Find the biggest drop vs benchmark, split by device (mobile first) and traffic source.

| Drop-off | Usual causes |
|---|---|
| Landing → ATC | Weak hero media, unclear benefit, price shock, no proof, slow page |
| ATC → checkout | Surprise shipping cost, cart friction, distractions |
| Checkout → purchase | Missing payment options, shipping time, trust, forced account |

## Prioritize with ICE
Impact × Confidence × Ease (1–10 each). Test the highest first.

## High-value test ideas
Hero video vs images · offer structure (quantity breaks vs bundle) · free-shipping threshold · guarantee placement · review placement · headline outcome vs feature · sticky ATC · shipping-time messaging · price point.

## Test rules
- One primary metric (conversion rate or revenue per visitor) decided upfront.
- Estimate sample size first; at ~1.5% conversion, detecting a 20% relative lift needs roughly **25–30k visitors per variant**. With low traffic, test big changes or use ad-level tests instead.
- Run full weeks (≥ 7–14 days); don't stop at the first significant peek.
- Don't test during sales/holidays unless that's the question.
- Log: hypothesis, variants, dates, traffic, result, confidence, decision.

## Output
Funnel diagnosis with numbers, a ranked hypothesis list (ICE), and test designs with sample size and duration.
