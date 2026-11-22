---
name: unit-economics
description: Compute per-order contribution margin, break-even ROAS, target CPA and net profit per order for a Shopify dropshipping store. Use for any decision involving price, ad budget, product cost, shipping, fees or profitability.
metadata:
  id: S06
---

# Unit economics & break-even ROAS

Reference model: `docs/05-startup-and-operating-costs.md`.

## Per-order model
```
Revenue (AOV)                         R
− Product landed cost (incl. duties)  C
− Shipping to customer                S
− Payment processing                  P = 2.9% × R + $0.30   (Shopify Basic; Grow 2.7%, Advanced 2.5%; +2%/1%/0.6% with a 3rd-party gateway; PayPal ≈ 3.5%)
− Refunds / returns / chargebacks     F ≈ 5% × R (adjust with real data)
− Apps & tools allocated              A ≈ fixed monthly apps ÷ monthly orders
= Contribution before ads             CM = R − C − S − P − F − A
Contribution margin %                 CM% = CM ÷ R
Break-even ROAS                       = 1 ÷ CM%
Break-even CPA                        = CM
Target CPA (for net margin m)         = CM − m × R
Net profit per order                  = CM − actual CPA
```

## Worked example (docs/05)
AOV $45 → C $11, S $5, P $1.61, F $2.25, A $1.00 → CM $24.14 (54%) → **break-even ROAS ≈ 1.85**, break-even CPA $24.14. At CPA $15–20, net profit $4–9 per order (10–20%).

## Benchmarks
- Net margin: experienced sellers 15–20%, beginners under 10%, electronics 10–15%.
- Target ad ROAS: **2.5–3.0+** for a healthy business.
- DTC median CPA ~$17 (vendor benchmark; vertical-dependent).

## Rules
- Always state assumptions explicitly; show the table.
- Run a sensitivity check: CPA ±30%, product cost +20% (tariff shock), refund rate 10%.
- Use real Shopify/ad data when available; benchmarks only until then.
- Use Bash/Python for the arithmetic when more than a few numbers are involved, so the results are exact.

## Output
The per-order table, CM%, break-even ROAS, break-even and target CPA, net profit at expected CPA, and the sensitivity table with the scenario that breaks the model.
