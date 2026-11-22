---
name: privacy-consent
description: Apply privacy and marketing-consent rules to the store - CCPA/CPRA and other US state privacy laws, GDPR/UK GDPR, cookie consent, TCPA for SMS and CAN-SPAM for email. Use when setting up tracking, email/SMS capture, privacy policies or selling to new regions.
metadata:
  id: S28
---

# Privacy & marketing consent

Not legal advice — escalate to e-commerce compliance counsel for final review.

## Privacy policy must cover
Data collected (identifiers, order data, device/cookie data), purposes, sharing/selling (incl. ad pixels = "sharing" for cross-context advertising under CPRA), retention, rights and how to exercise them, contact, effective date. Keep it consistent with the actual apps and pixels installed.

## US state privacy laws (CCPA/CPRA and similar)
- Thresholds vary (e.g. CCPA: $25M+ revenue, or buy/sell/share data of 100k+ consumers, or 50%+ revenue from selling data). Small stores may fall below, but ad pixels count as sharing — build compliant habits early.
- "Do Not Sell or Share My Personal Information" link and Global Privacy Control signal handling where required.
- Respond to access/deletion requests (Shopify supports customer data requests).

## GDPR / UK GDPR (if selling to EU/UK)
Lawful basis for processing; **prior consent for non-essential cookies/pixels**; consent banner with reject as easy as accept; data processing agreements with apps; right of access/erasure.

## Email — CAN-SPAM (US)
Accurate from/subject lines, physical postal address, working one-click unsubscribe honored within 10 business days. Use the checkout consent checkbox **unticked** by default; double opt-in for EU.

## SMS — TCPA
**Prior express written consent** for marketing texts (clear disclosure at opt-in: brand, recurring automated messages, frequency, "msg & data rates may apply", STOP to opt out); honor STOP immediately; respect quiet hours (state rules, e.g. 8am–9pm local); keep consent records. TCPA damages are $500–1,500 per message — high risk.

## Implementation checklist
Shopify Customer Privacy settings + cookie banner by region · pixels gated by consent · consent captured with timestamp/source in Klaviyo/Omnisend · unsubscribe and STOP tested · privacy policy matches installed apps.

## Output
Compliance gap list, required policy text changes, consent-flow specs, and items for counsel review.
