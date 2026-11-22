---
name: email-sms-lifecycle
description: Build email and SMS lifecycle marketing in Klaviyo or Omnisend - capture, welcome, abandoned checkout/cart/browse, post-purchase, review request, cross-sell, win-back flows and campaigns - with segmentation and deliverability. Use when setting up or improving retention marketing.
metadata:
  id: S33
---

# Email & SMS lifecycle marketing

Goal: email/SMS often reach **20–30% of revenue** in mature stores (`docs/07-marketing.md`). Set up before launch.

## List growth
Pop-up (delay 5–10 s or exit intent on mobile, easy to dismiss) offering 10% or free shipping; two-step email → SMS opt-in with TCPA-compliant disclosure; checkout consent checkboxes unticked (see privacy-consent).

## Core flows (priority order)
| Flow | Trigger | Messages | Notes |
|---|---|---|---|
| Welcome | Sign-up | 3–5 over 7 days | Brand story, hero product, proof, offer reminder |
| Abandoned checkout | Checkout started | 3 (1 h, 24 h, 48–72 h) | Highest ROI; add SMS for consented |
| Abandoned cart / browse | ATC / product view | 2 each | Lighter touch |
| Post-purchase | Order placed | Confirmation, shipping expectations, how-to/use tips, delivery check-in | Cuts WISMO tickets and refunds |
| Review request | 5–7 days after delivery | 1–2 | Ask all customers; no sentiment gating |
| Cross-sell / replenishment | X days after purchase | 1–2 | Accessories, consumables |
| Win-back | 60–120 days inactive | 2–3 | Incentive last |
| Sunset | No engagement 90–180 days | 1–2 then suppress | Protects deliverability |

## Campaigns
1–2 emails/week to engaged segments; SMS max ~2–4/month; launches, bundles, seasonal moments, content.

## Segmentation
Engaged 30/60/90 days, purchasers vs non-purchasers, product interest, VIP (2+ orders), discount-seekers.

## Deliverability
Authenticate domain (SPF, DKIM, DMARC) — required by Gmail/Yahoo bulk-sender rules; one-click unsubscribe; keep spam complaints < 0.1% (never > 0.3%); send to engaged segments; warm up new domains gradually.

## Metrics
Flow revenue per recipient, placed-order rate, click rate, unsubscribe/spam rates, list growth, email/SMS revenue share.

## Output
Flow map with timing and copy briefs, segment definitions, campaign calendar, deliverability checklist.
