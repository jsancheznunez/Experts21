---
name: financial-forecasting
description: Build startup budgets, monthly P&L and cash-flow forecasts, runway and scenarios for the store, including ad-testing budgets and payout-reserve buffers. Use for budgeting, funding, go/no-go and scaling decisions.
metadata:
  id: S07
---

# Financial forecasting & cash-flow planning

Baseline costs: `docs/05-startup-and-operating-costs.md`.

## Startup budget (one-time)
| Item | Lean | Recommended |
|---|---|---|
| Domain, theme, brand kit | $15–65 | $465–1,240 |
| Entity formation + EIN | $50–300 | $300–800 |
| Samples | $100 | $200–500 |
| Initial creative (UGC) | $0 | $500–1,500 |
| Legal policies | $0 | $200–500 |
| Ad-testing budget (4–8 weeks) | $1,000 | $3,000–5,000 |
| **Total** | **~$1.5k** | **~$5–9k** |

Fixed monthly: **~$100–500** (Shopify $29–105, apps, email, helpdesk, workspace).

## Monthly forecast structure
```
Ad spend (input)  → Orders = Ad spend ÷ CPA (+ organic/email orders)
Revenue = Orders × AOV
COGS + shipping + fees + refunds (from unit-economics)
Contribution = Revenue − variable costs
Net = Contribution − Ad spend − Fixed costs − Staff
```
Model 12 months with three scenarios: **Base**, **Downside** (CPA +30%, AOV −10%, refunds 10%), **Upside**.

## Cash-flow specifics for dropshipping
- Ad platforms bill daily or at thresholds; suppliers are paid at order time; Shopify payouts take 2–3 business days.
- **Payout reserves:** new or fast-growing dropshipping stores can have 20–100% of payouts held for weeks up to 120 days. Model a downside where 25% of revenue is held for 90 days.
- Keep **2–3 months of ad spend + fixed costs** as working capital.
- Sales tax collected is not revenue; set it aside (see bookkeeping-sales-tax).

## Decision rules
- Scale ad spend only while ROAS ≥ target for 7+ days and cash covers the reserve downside.
- Stop rule: if cumulative test spend reaches the cap with no product at or above break-even ROAS, pause and re-plan.

## Output
Assumptions table, 12-month forecast (monthly rows), cash low-point and month, runway, the scenario comparison, and explicit spend recommendations for human approval.
