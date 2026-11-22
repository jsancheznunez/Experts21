---
name: accessibility-performance
description: Audit and improve storefront accessibility (WCAG 2.2 AA, ADA lawsuit risk) and performance (Core Web Vitals, app script weight). Use when choosing a theme, adding apps, launching pages or reviewing legal exposure for the website.
metadata:
  id: S16
---

# Web accessibility & performance

## Why it matters
- **Legal:** ADA website-accessibility lawsuits frequently target ecommerce stores (`docs/08-risks.md`). Overlay widgets do not prevent lawsuits; fixing the site does.
- **Revenue:** slower mobile pages convert worse; ad platforms also reward fast landing pages.

## Accessibility checklist (WCAG 2.2 AA essentials)
- Text alternatives: meaningful `alt` on product images; decorative images `alt=""`.
- Color contrast ≥ 4.5:1 for body text, 3:1 for large text and UI components.
- Full keyboard navigation: menus, variant pickers, cart drawer, modals; visible focus states; no keyboard traps.
- Form labels and error messages linked to fields (newsletter, checkout, contact).
- Logical heading order (one H1 per page).
- Captions for product videos; no auto-playing audio.
- Pop-ups dismissible by keyboard and screen reader; don't block content on mobile.
- Target size ≥ 24×24 px for tap targets.
- Publish an accessibility statement with a contact method.

Tools: Lighthouse, axe DevTools, WAVE, manual keyboard and screen-reader (VoiceOver/NVDA) pass.

## Performance targets (mobile, field data)
| Metric | Good |
|---|---|
| Largest Contentful Paint | ≤ 2.5 s |
| Interaction to Next Paint | ≤ 200 ms |
| Cumulative Layout Shift | ≤ 0.1 |

Levers: compress and size images, lazy-load below the fold, limit apps and remove leftover scripts, defer third-party JS, limit custom fonts, avoid heavy sliders.

## Output
Findings ranked by severity (legal risk + user impact), with the page/element, the fix, and the owner; before/after scores for performance work.
