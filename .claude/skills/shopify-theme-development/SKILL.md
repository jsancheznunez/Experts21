---
name: shopify-theme-development
description: Customize Shopify Online Store 2.0 themes with Liquid, JSON templates, sections and blocks, using Shopify CLI, while keeping pages fast and mobile-first. Use when building or changing theme code, templates or page layouts.
metadata:
  id: S13
---

# Shopify theme development (Liquid / OS 2.0)

## Theme choice
- Start from **Dawn** (free, fast, maintained) or a reputable premium OS 2.0 theme ($250–400). Avoid themes that depend on many apps for basic features.
- Prefer native theme settings and sections over custom code; prefer custom code over heavy apps.

## Workflow
1. `shopify theme pull` / work on a duplicate (unpublished) theme, never edit the live theme directly.
2. Develop with `shopify theme dev` (local preview); commit theme code to git.
3. `shopify theme check` for Liquid errors and performance warnings.
4. Push to an unpublished theme, QA on mobile and desktop, then publish with human approval.

## OS 2.0 structure
- `templates/*.json` define which sections render; `sections/*.liquid` with `{% schema %}` for merchant-editable settings and blocks; `snippets/` for reusable pieces; `assets/` for CSS/JS; `config/settings_schema.json` for global settings; `locales/` for strings.
- Use alternate product templates (e.g. `product.hero.json`) for hero-product landing pages.
- Use metafields/metaobjects for structured content (FAQs, specs, size charts) instead of hard-coding.

## Hero product page sections
Media gallery with video first → headline/benefits → offer block (quantity breaks/bundles) → trust badges and shipping promise → reviews → how it works → comparison table → FAQ → sticky add-to-cart on mobile.

## Performance & quality rules
- Lazy-load below-the-fold images, use `image_url` with width parameters and `srcset`.
- Avoid render-blocking scripts; defer app scripts; remove leftover app code after uninstalling.
- Keep accessibility basics: semantic headings, alt text, labels, contrast, focus states (see accessibility-performance).
- No hard-coded prices or claims in theme code; content belongs in admin/metafields.
