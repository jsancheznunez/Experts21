---
name: tracking-attribution
description: Set up and audit conversion tracking - Meta Pixel and Conversions API, TikTok Pixel and Events API, GA4, Google Ads, UTMs and Shopify customer events - and reconcile platform numbers with Shopify. Use when installing tracking or when ad results and store results disagree.
metadata:
  id: S17
---

# Tracking & attribution

## Setup checklist
1. **Shopify customer events** + official channel apps: Facebook & Instagram (Meta Pixel + Conversions API), TikTok (Pixel + Events API), Google & YouTube (GA4 + Google Ads conversions + Merchant Center).
2. Data-sharing level set to maximum allowed (server-side events) for Meta and TikTok.
3. Standard events firing once each: PageView, ViewContent, AddToCart, InitiateCheckout, AddPaymentInfo, Purchase (with value, currency, content IDs).
4. **Deduplication:** browser and server events share `event_id`.
5. Meta: verify domain, configure Aggregated Event Measurement priorities, aim for Event Match Quality ≥ 6.
6. UTMs on every ad, email and influencer link: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` (ad/creative id).
7. Respect consent: cookie banner for EU/UK visitors and states that require it; Shopify Customer Privacy API (see privacy-consent).
8. Test with Meta Events Manager test events, TikTok Pixel Helper, GA4 DebugView and a real test order.

## Attribution reality
- Platforms over-claim (view-through, modelled conversions); Shopify under-attributes social.
- Use **blended metrics** as the source of truth: MER = total revenue ÷ total ad spend; blended CPA = total ad spend ÷ new customers.
- Compare platform ROAS to Shopify-attributed revenue weekly; track the ratio and use it to adjust targets.
- Consider a third-party attribution tool (Triple Whale, Northbeam) only past ~$30–50k/month ad spend.

## Troubleshooting
Duplicate purchases → missing dedup/event_id. Purchases missing → checkout events not connected or consent blocking. Value wrong → currency/tax/shipping inclusion mismatch.

## Output
Tracking plan (events, parameters, destinations), audit results with pass/fail per item, and reconciliation table (platform vs Shopify vs blended).
