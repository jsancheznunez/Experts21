---
name: supplier-vetting
description: Vet, compare and negotiate with dropshipping suppliers and agents (CJdropshipping, Zendrop, Spocket, Doba, AliExpress sellers, private agents) on reliability, warehouse location, processing time, quality, certifications and terms. Use when choosing, auditing or replacing a supplier.
metadata:
  id: S20
---

# Supplier vetting & negotiation

Context: supplier failure is a top risk (`docs/08-risks.md`); US-warehouse stock is the 2026 default (`docs/01-market.md`).

## Vetting scorecard (per supplier, per SKU)
| Criterion | Evidence to collect | Pass bar |
|---|---|---|
| Stock location | Warehouse country per listing (not just "has US warehouse") | US/EU stock for target market |
| Processing time | Stated + measured on test orders | ≤ 2 business days |
| Delivery time | Test orders to 2–3 US addresses | ≤ 7 days median |
| Product quality | Sample in hand, photos, defect check | Matches listing, no defects |
| Packaging | Unbranded/custom options, damage protection | No supplier branding/invoices with prices in parcel |
| Reliability | Store rating, years active, order volume, dispute history | Established, responsive |
| Communication | Response time to a test question | < 24 h, clear English |
| Certifications | CPC, FCC, CE, UL, SDS for batteries, as relevant | On file before listing (see product-safety-compliance) |
| Pricing & duties | Unit price, shipping, who pays duties (DDP vs DDU) | Landed cost fits unit-economics |
| Returns/defects | Policy for defective/lost items | Replacement or refund within 14 days |
| Integration | Works with our order app; tracking upload | Automated |

## Process
1. Shortlist 3 suppliers per hero SKU.
2. Order samples and 2–3 real test orders; measure processing and delivery.
3. Score; select **primary + backup** for every hero SKU.
4. Negotiate once volume is proven (≈ 10–20 orders/day): unit price, processing SLA, custom packaging/inserts, priority stock reservation, defect handling.
5. Record terms in writing (see contracts-entity-ip for the agreement).

## Ongoing monitoring
Monthly: processing time, delivery time, defect rate, out-of-stock events, price changes. Place a mystery order every 4–6 weeks.

## Red flags
Refuses samples · listing photos stolen from brands · branded/counterfeit goods · no certifications for regulated items · tracking numbers that don't scan · "US warehouse" that ships from China.

## Output
Supplier comparison table, recommended primary/backup, negotiation asks, and the monitoring plan.
