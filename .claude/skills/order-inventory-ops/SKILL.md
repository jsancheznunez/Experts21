---
name: order-inventory-ops
description: Run day-to-day order and inventory operations for a dropshipping store - order placement, tracking upload, exceptions, stockouts, supplier quality control and SLAs. Use when designing or troubleshooting operations, or writing ops SOPs.
metadata:
  id: S21
---

# Order & inventory operations

## Daily ops routine (SOP outline)
1. **Fraud review** of flagged orders before they go to the supplier.
2. **Place/confirm supplier orders** (automated; verify none stuck in "pending").
3. **Tracking check:** every order older than 72 h has tracking; chase supplier otherwise.
4. **Movement check:** tracking with no scan for 5+ days → contact supplier and customer.
5. **Exceptions queue:** address errors, wrong item, damaged, lost, returned to sender.
6. **Inventory/price sync review:** out-of-stock variants hidden; supplier price increases flagged.
7. **Log** exceptions with cause (supplier, carrier, address, customer) for the weekly review.

## Exception playbook
| Exception | Action |
|---|---|
| Out of stock after order | Switch to backup supplier; if not possible within 24 h, email customer with options (wait/swap/refund) — FTC Mail Order Rule requires consent to delay or a refund |
| Address error | Contact customer before supplier ships; fix in both systems |
| Lost in transit | Carrier claim via supplier; reship or refund per policy |
| Wrong/damaged item | Photo from customer → replacement or refund; claim from supplier |
| Supplier processing > SLA | Escalate; route new orders to backup |

## SLAs to track
Processing ≤ 2 business days · tracking upload ≤ 72 h · delivery median ≤ 7 days, P90 ≤ 10 · defect rate < 2% · exception rate < 5%.

## Weekly review
Exceptions by cause and supplier, SLA performance, stockouts, and actions (switch suppliers, update shipping text, adjust inventory buffers).

## Output
SOPs, exception handling rules, SLA dashboard definition, and root-cause actions.
