---
name: chargeback-management
description: Prevent and fight chargebacks and manage payment-processor risk for a dropshipping store - Shopify Payments reserves and payout holds, fraud screening, chargeback alerts, evidence packets and backup gateways. Use when a reserve, chargeback or fraud issue appears, or when planning payments setup.
metadata:
  id: S25
---

# Payment risk & chargeback management

Context: `docs/08-risks.md` — dropshipping stores are flagged as higher chargeback risk; reserves of 20–100% of payouts for up to 120 days are reported.

## Prevention
- Fast, tracked shipping (US warehouse); realistic delivery promises.
- Statement descriptor = recognizable brand name; support contact on receipts.
- Upload tracking promptly; proactive delay emails.
- Refund plausible complaints quickly (cheaper than a dispute).
- Fraud screening: Shopify fraud analysis; hold high-risk orders (mismatched billing/shipping, many attempts, proxy IP) before ordering from supplier.
- Chargeback alerts (Ethoca/Verifi via apps like Chargeflow) to refund before a dispute is filed.
- **Scale ad spend gradually** — sudden sales spikes trigger risk reviews.

## Thresholds
| Metric | Healthy | Act now |
|---|---|---|
| Chargeback rate | < 0.3% | > 0.65% (network monitoring programs start near 0.9–1%) |
| Refund rate | < 5% | > 10% |

## Responding to a chargeback (evidence packet)
Order details and IP/AVS/CVV results · customer communication · tracking with delivery confirmation (signature for high value) · product page and policies as shown at purchase · refund/return history. Submit before the deadline; be factual and concise. Respond only when evidence is strong; otherwise accept and learn.

## If a reserve or hold is applied
1. Read the email terms; check Settings → Payments → reserved funds.
2. Ask Shopify for a written breakdown and release timeline.
3. Send evidence: supplier invoices, fulfillment times, tracking, low dispute rate.
4. Model cash impact (see financial-forecasting); slow ad spend if cash is tight.
5. Keep a **backup gateway** (PayPal, a second processor) approved in advance.

## Output
Risk assessment, prevention checklist status, evidence packet drafts (for human approval before submission), and cash-impact note.
