---
name: kpi-dashboards
description: Define, compute and report the store's KPIs - ROAS, MER, CPA, AOV, conversion, refund and chargeback rates, delivery time, contribution and net profit - with targets and alert thresholds. Use for performance reviews, dashboards and weekly reporting.
metadata:
  id: S18
---

# KPI dashboards & reporting

## Core KPI set
| KPI | Formula | Target / alert (from docs/05, 07, 08) |
|---|---|---|
| Revenue, orders, AOV | AOV = revenue ÷ orders | AOV trending up with bundles |
| Conversion rate | orders ÷ sessions | ≥ 1.4% median; ≥ 3.2% top 20% |
| Add-to-cart rate | ATC sessions ÷ sessions | ≥ 4.6% |
| Platform ROAS | attributed revenue ÷ spend (per platform) | ≥ 2.5–3.0; alert below break-even 3+ days |
| MER (blended) | total revenue ÷ total ad spend | ≥ break-even ROAS × 1.3 |
| Blended CPA / nCAC | ad spend ÷ (new) customers | ≤ target CPA from unit-economics |
| Contribution margin | see unit-economics | ≥ 50% before ads |
| Net profit | contribution − ads − fixed − staff | 10–20% of revenue |
| Refund rate | refunds ÷ orders | < 5%; act > 10% |
| Chargeback rate | chargebacks ÷ orders | < 0.3%; act > 0.65% |
| Order-to-delivery days | median and 90th percentile | ≤ 7; act > 10 |
| "Where is my order" tickets | WISMO ÷ orders | < 10%; act > 20% |
| Repeat purchase rate | repeat customers ÷ customers (90 days) | rising |
| Email/SMS revenue share | flows + campaigns ÷ revenue | 20–30% at maturity |

## Reporting cadence
- **Daily (5 min):** spend, revenue, ROAS/MER, CPA, orders, anything breaching an alert.
- **Weekly:** full KPI table vs last week and target, top/bottom products and creatives, ops metrics, actions.
- **Monthly:** P&L, cash, cohort repeat rate, risk register review.

## Rules
- Always show period, comparison period and data source (Shopify, Meta, TikTok, helpdesk).
- Lead with the 3 things that changed and what to do about them.
- Use exact computed numbers (Bash/Python) rather than mental math.

## Output
A KPI table with status (🟢 on target / 🟡 watch / 🔴 act), the top 3 insights, and recommended actions with owners.
