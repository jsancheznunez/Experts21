---
name: shipping-customs-tariffs
description: Compare US-warehouse vs overseas fulfillment, calculate duties and tariffs after the end of US de minimis, track trade-policy changes, and set realistic delivery promises. Use for shipping strategy, landed-cost calculations or delivery-time copy.
metadata:
  id: S22
---

# Shipping, customs & tariff management

## Key facts (docs/01, docs/08 — verify current rates)
- US **de minimis ($800 duty-free) ended**: China/Hong Kong on **May 2, 2025** (EO 14256); all countries on **August 29, 2025** (EO 14324). Every direct-to-consumer import parcel now owes duties and needs customs data.
- Tariff rates on China-origin goods change frequently; check CBP and USTR notices and the Harmonized Tariff Schedule (HTS) before pricing.
- US-warehouse delivery: **2–7 days**. Direct from China: **7–30+ days**.

## Route comparison
| Route | Speed | Duties | Best for |
|---|---|---|---|
| US warehouse (supplier stock) | 2–7 days | Paid once on bulk import, built into unit price | Default for hero products |
| Direct from China (DDP) | 7–15 days | Prepaid by shipper, in price | Testing long-tail SKUs |
| Direct from China (DDU) | 7–30 days | Customer pays at door | Avoid: refusals, chargebacks |
| Other origins (Vietnam, Mexico, EU) | Varies | Different tariff rates | Diversification |

## Landed cost per unit
```
Unit price + international freight share + duty (HTS rate × customs value)
+ additional tariffs (e.g. Section 301 / reciprocal) + broker/processing fees
+ domestic last-mile shipping
```
Add a **tariff buffer** (e.g. +10–15% on China-origin cost) in pricing models until rates stabilize.

## Delivery promise rules
- Promise the supplier's measured P90, not the best case. State "ships in X days, arrives in Y–Z business days".
- FTC Mail Order Rule: must have a reasonable basis for the stated time (or 30 days if none stated); if delayed, get consent or refund.
- Show the promise on the product page, cart and order confirmation consistently.

## International expansion
CA/UK/AU/EU: check VAT/GST collection (UK and EU require collection at checkout for low-value goods), duties, and local delivery times before enabling a Market.

## Output
Route recommendation per SKU, landed-cost table with tariff assumptions and sources, and delivery-promise copy.
