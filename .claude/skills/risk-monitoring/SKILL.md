---
name: risk-monitoring
description: Maintain the store's risk register, score likelihood and impact, set early-warning thresholds, and run escalation checks for ad profitability, payment holds, chargebacks, suppliers, tariffs, compliance, ad accounts and IP. Use for risk reviews, pre-mortems and any go/no-go decision.
metadata:
  id: S36
---

# Risk assessment & monitoring

Baseline register: `docs/08-risks.md` (80–90% of stores fail in year one; only ~1–5% sustain net profit).

## Register format
| ID | Risk | Likelihood (1–5) | Impact (1–5) | Score (L×I) | Leading indicator | Threshold | Mitigation | Owner (agent) | Status |
|---|---|---|---|---|---|---|---|---|---|

## Baseline top risks
1. Unprofitable ad spend → financial-analyst, paid-social-media-buyer
2. Payment holds/reserves → payments-fraud-risk-specialist
3. Chargebacks and refunds → payments-fraud-risk-specialist, customer-experience-lead
4. Supplier failure → sourcing-supplier-manager
5. Tariff/trade changes → fulfillment-logistics-specialist
6. Regulatory/legal (FTC, CPSC, privacy, ADA) → ecommerce-compliance-counsel
7. Price undercutting and copycats → brand-strategist, competitive-intelligence-analyst
8. Ad account bans → paid-social-media-buyer
9. Product liability/safety → ecommerce-compliance-counsel, sourcing-supplier-manager
10. IP infringement → corporate-ip-counsel
11. Founder burnout / key-person risk → staffing-talent-advisor

## Early-warning thresholds
| Metric | Healthy | Act now |
|---|---|---|
| ROAS vs break-even | > 1.3× | < break-even 3+ days |
| Chargeback rate | < 0.3% | > 0.65% |
| Refund rate | < 5% | > 10% |
| Order-to-delivery | ≤ 7 days | > 10 days |
| WISMO tickets | < 10% of orders | > 20% |
| Payout reserve | none | any new notice |
| Cash runway | > 3 months | < 6 weeks |

## Methods
- **Pre-mortem:** "It's 6 months later and this failed — why?" List causes, map to register.
- **Scenario test:** run the downside case through financial-forecasting.
- **Escalation:** any "act now" threshold → alert the human owner with the metric, cause hypothesis, recommended action and deadline.

## Output
Updated register (top 10 by score), threshold status table, new/changed risks, and escalations.
