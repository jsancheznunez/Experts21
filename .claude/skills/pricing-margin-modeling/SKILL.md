---
name: pricing-margin-modeling
description: Set retail prices, compare-at prices, bundles, quantity breaks and free-shipping thresholds from landed cost, competitor price ladders and target margins. Use when pricing a product, designing an offer or raising average order value.
metadata:
  id: S05
---

# Pricing & margin modeling

## Inputs
- Landed cost per unit = product cost + duties/tariffs + inbound freight (for US-warehouse stock) + packaging.
- Shipping cost to customer.
- Competitor price ladder (from competitor-teardown).
- Target contribution margin before ads: **≥ 50–55%** (see unit-economics).

## Rules of thumb (from docs/05)
- Retail ≈ **3–4× landed cost** in the $25–$80 band.
- Landed cost ≤ 30–35% of retail.
- Price endings: $X9.95 / $X9.99 for impulse; round numbers for premium positioning.
- A **compare-at** price must be a real former or prevailing price. Fictitious "was" prices are deceptive (see ftc-consumer-protection).

## Order-value levers
| Lever | Typical design | Effect |
|---|---|---|
| Quantity break | Buy 2 save 10%, buy 3 save 15–20% | +15–30% AOV |
| Bundle | Hero + 1–2 accessories at 10–15% off | Raises AOV, harder to price-check |
| Free-shipping threshold | ~20–30% above the hero price | Pushes a second item |
| Post-purchase upsell | One-click add-on at 10–20% off | +5–10% AOV |
| Guarantee | 30-day money back | Raises conversion; budget refunds |

## Method
1. Build a table of price points (e.g. $34.95 / $39.95 / $44.95) × offer structures.
2. For each, compute contribution margin per order and break-even ROAS (formula in unit-economics).
3. Check the price against the competitor ladder: we need a visible reason to cost more than Amazon/Temu.
4. Recommend one price and offer, plus one alternative to A/B test (see cro-ab-testing).

## Output
Recommended price, compare-at (only if legitimate), offer structure, AOV estimate, contribution margin, break-even ROAS, and the test plan.
