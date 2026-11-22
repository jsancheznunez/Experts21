---
name: workflow-automation
description: Design and build store automations and integrations - Shopify Flow, supplier/order apps (DSers, AutoDS, CJ, Zendrop), TikTok Shop sync, webhooks, helpdesk and email integrations. Use when automating order, inventory, support or marketing workflows.
metadata:
  id: S19
---

# Workflow automation & integrations

## Core automations for a dropshipping store
| Workflow | Tooling | Rule |
|---|---|---|
| Order routing to supplier | DSers/AutoDS/CJ/Zendrop auto-order | Auto-place after fraud check passes; hold high-risk orders |
| Tracking sync | Supplier app → Shopify fulfillment | Tracking uploaded within 24–72 h; alert if missing after 72 h |
| Inventory & price sync | Supplier app | Auto-hide out-of-stock variants; alert on supplier price rise > 10% |
| Fraud hold | Shopify Flow + fraud analysis | High risk → cancel/refund or manual review before ordering |
| Delayed shipment | Flow + email | No tracking movement 5+ days → notify customer + ticket |
| Review request | Reviews app | Send 5–7 days after delivery, not after shipment |
| Tagging | Flow | Tag VIPs, repeat buyers, high-refund customers |
| Low-stock / supplier failure | Flow/app alert | Switch to backup supplier (see supplier-vetting) |
| TikTok Shop | Shopify TikTok app | Sync catalog and inventory; orders fulfilled through the same supplier flow |
| Support | Helpdesk ↔ Shopify | Order data in ticket view; macros pull tracking automatically |

## Design rules
- Map the workflow first: trigger → conditions → actions → failure path → alert.
- Every automation needs a failure path and a human alert; silent failures cause chargebacks.
- Idempotency: guard against duplicate orders to suppliers (check for existing supplier order ID).
- Least-privilege API scopes; store credentials only in the app/platform, never in repo files.
- Test with test orders before enabling on live orders; document each automation (purpose, owner, last tested).

## Output
Workflow diagram/description, configuration steps, test plan, and monitoring/alert setup.
