---
name: customer-support-ops
description: Run customer support for the store - helpdesk setup, macros, AI chatbot flows, SLAs, tone and ticket analysis (especially "where is my order"). Use when designing support, writing macros or analyzing tickets for insight.
metadata:
  id: S24
---

# Customer support operations

## Setup
- Channels: email + on-site chat (Shopify Inbox, Gorgias or Tidio); social DMs and ad comments routed to the same helpdesk.
- Order data visible inside tickets; tracking pulled automatically.
- **AI chatbot** handles order status, shipping times, returns policy, product FAQs; hands off to a human for refunds over a threshold, angry customers, chargeback threats, safety issues.
- Coverage: US business hours at minimum; PH-based VA (~$5–8/h) for extended hours (`docs/06-staffing.md`).

## SLAs
First response < 4 business hours (chat < 5 min), resolution < 48 h, CSAT ≥ 90%.

## Core macros
1. Where is my order (WISMO) — with live tracking link and expected window.
2. Delay notice (proactive) — new estimate + options (wait / refund) per FTC Mail Order Rule.
3. Return/refund request — per returns-disputes ladder.
4. Damaged/wrong item — request photo, offer replacement/refund.
5. Product how-to / sizing.
6. Cancellation before shipment.
7. Chargeback threat — de-escalate, resolve, escalate to payments specialist.
8. Review request follow-up for happy customers.

## Tone
Warm, fast, specific; own the problem; never blame the supplier ("our warehouse" not "the Chinese supplier"); never promise dates we can't verify.

## Ticket analytics (weekly)
Tickets per 100 orders, % WISMO (alert > 20%), top reasons by product/supplier, sentiment, verbatim quotes → feed to customer-insights and product/sourcing.

## Output
Helpdesk configuration, macro library, chatbot intents and handoff rules, SLA dashboard, and weekly insight summary.
