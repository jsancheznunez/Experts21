---
name: shopify-admin
description: Configure a Shopify store end to end - plan choice, products and variants, collections, Markets, Shopify Payments, Shopify Tax, shipping profiles, policies, domains and checkout settings. Use when setting up or changing store configuration.
metadata:
  id: S12
---

# Shopify admin & configuration

Plan and fee facts: `docs/05-startup-and-operating-costs.md`. Verify live prices at shopify.com/pricing before advising.

## Plan choice (2026)
| Plan | Monthly / annual | Card rate | 3rd-party gateway fee |
|---|---|---|---|
| Basic | $39 / $29 | ~2.9% + 30¢ | 2% |
| Grow | $105 / $79 | ~2.7% + 30¢ | 1% |
| Advanced | $399 / $299 | ~2.5% + 30¢ | 0.6% |
Start on Basic; move to Grow at roughly $10–15k/month revenue.

## Launch configuration checklist
1. **Store details:** legal business name, address, support email, currency, units.
2. **Domain:** connect custom domain, set primary, force HTTPS.
3. **Payments:** Shopify Payments (enable Shop Pay), PayPal, Apple/Google Pay; BNPL (Shop Pay Installments/Klarna) for $50+ AOV. Statement descriptor = brand name (reduces "unrecognized charge" chargebacks).
4. **Checkout:** require phone optional, email marketing consent checkbox (unticked), address autocomplete, tipping off.
5. **Shipping profiles:** rates matched to supplier ship-from locations; free-shipping threshold; delivery-time text that matches reality.
6. **Taxes:** Shopify Tax on; register in states where nexus applies (coordinate with bookkeeping-sales-tax).
7. **Markets:** start with the US; add CA/UK/AU only with duties/VAT handled.
8. **Policies:** refund, privacy, terms, shipping, contact (generate then legal-review).
9. **Products:** titles, descriptions, variants, SKUs matching supplier SKUs, weights, HS codes and country of origin, SEO fields, alt text.
10. **Collections & navigation:** niche-led menu, footer with policies and contact.
11. **Notifications:** brand the order, shipping and delivery emails.
12. **Staff accounts** with least privilege; enable 2FA for everyone.
13. **Pre-launch test:** place real test orders (Bogus Gateway, then a live refunded order).

## Rules
- Never change payments, tax or policy settings on a live store without human approval.
- Record every configuration change (what, why, date).
- If the Shopify MCP/GraphQL tools are available in the session, read store data with them instead of guessing.
