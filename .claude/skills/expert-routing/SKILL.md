---
name: expert-routing
description: Routing table for the Shopify dropshipping expert team - which subagent to bring in for which question, standard expert panels for common decisions, and the order they should work in. Use when deciding which experts to consult, or when checking team coverage before adding a new agent.
metadata:
  id: S38
---

# Expert routing

Full roster: `docs/expert-roster.md`. Agent files: `.claude/agents/`.

## Who to bring in
| Agent (subagent name) | Bring in when the question involves… |
|---|---|
| engagement-lead | Overall strategy, go/no-go, business model, final review of a big recommendation |
| market-trend-analyst | Market size, macro trends, tariffs/de minimis, platform shifts, timing |
| product-research-specialist | What to sell, product ideas, scoring and validating products |
| competitive-intelligence-analyst | Competitors, marketplace prices, ad spying, positioning gaps |
| customer-insights-researcher | Who the customer is, personas, objections, reviews/ticket insight |
| brand-strategist | Niche, brand name, positioning, voice, identity |
| shopify-store-architect | Store setup, plan, theme, apps, checkout, payments config, Markets |
| cro-ux-specialist | Conversion rate, page design, offers/bundles, A/B tests |
| analytics-tracking-engineer | Pixels, CAPI, attribution, dashboards, data discrepancies |
| automation-integrations-engineer | Supplier app integration, Shopify Flow, TikTok Shop sync, workflows |
| sourcing-supplier-manager | Choosing/vetting/negotiating suppliers, quality, samples |
| fulfillment-logistics-specialist | Shipping routes, delivery times, customs, tariffs, returns logistics |
| customer-experience-lead | Support setup, macros, chatbot, refunds policy in practice, WISMO |
| payments-fraud-risk-specialist | Payment gateways, payout holds/reserves, fraud, chargebacks |
| staffing-talent-advisor | Hiring VAs/freelancers, outsourcing, SOPs, team structure |
| financial-analyst | Unit economics, pricing math, budgets, forecasts, ROAS targets, cash |
| bookkeeping-tax-specialist | Accounting setup, reconciliation, sales tax, nexus |
| ecommerce-compliance-counsel | FTC rules, claims, reviews, privacy, product safety, ADA |
| corporate-ip-counsel | Entity formation, contracts, trademarks, IP infringement |
| risk-manager | Risk register, pre-mortems, early-warning metrics, escalations |
| paid-social-media-buyer | Meta/TikTok ads, budgets, campaign structure, scaling |
| creative-director | Ad concepts, hooks, UGC briefs, creative testing |
| conversion-copywriter | Product pages, ad copy, emails, policies wording |
| retention-marketer | Email/SMS flows, list growth, repeat purchases |
| search-shopping-marketer | Google Shopping/PMax, Merchant Center, SEO |
| social-commerce-manager | TikTok Shop, influencers, affiliates, creator programs |
| nltk-expert | Text analytics with NLTK: word frequency, VADER sentiment, collocations on reviews, tickets, comments; the NLP Lab's NLTK part |
| spacy-expert | NLP with spaCy: entities, custom EntityRuler, noun chunks, lemmas, dependency parses on competitor pages, listings, reviews; the NLP Lab's spaCy part |
| team-architect | Creating or improving agents and skills (not business questions) |

## Standard panels
| Question type | Round 1 (parallel) | Round 2 (review) |
|---|---|---|
| "Should we sell product X?" | product-research-specialist, competitive-intelligence-analyst, sourcing-supplier-manager | financial-analyst (margins), ecommerce-compliance-counsel (safety/claims) |
| "Which niche / brand?" | market-trend-analyst, customer-insights-researcher, brand-strategist | competitive-intelligence-analyst, corporate-ip-counsel (name clearance), engagement-lead |
| "How do we launch?" | shopify-store-architect, paid-social-media-buyer, creative-director, retention-marketer | financial-analyst (budget), ecommerce-compliance-counsel, risk-manager |
| "Is it profitable / how much budget?" | financial-analyst, paid-social-media-buyer | risk-manager, engagement-lead |
| "Sales are dropping / ads stopped working" | analytics-tracking-engineer, paid-social-media-buyer, cro-ux-specialist | creative-director, financial-analyst |
| "Shopify is holding our money / chargebacks" | payments-fraud-risk-specialist, customer-experience-lead, fulfillment-logistics-specialist | financial-analyst (cash), risk-manager |
| "Supplier problems / slow shipping" | sourcing-supplier-manager, fulfillment-logistics-specialist | customer-experience-lead, ecommerce-compliance-counsel (Mail Order Rule) |
| "Set up the business legally" | corporate-ip-counsel, bookkeeping-tax-specialist, ecommerce-compliance-counsel | financial-analyst |
| "Who do we hire?" | staffing-talent-advisor, financial-analyst | the function's expert(s) |
| "What are customers / competitors saying?" (reviews, tickets, competitor pages) | nltk-expert, spacy-expert, customer-insights-researcher | competitive-intelligence-analyst, ecommerce-compliance-counsel (before quoting customer phrases) |
| "Write a product page / ad" | conversion-copywriter, creative-director, customer-insights-researcher | ecommerce-compliance-counsel, cro-ux-specialist |

## Routing rules
- Use the **smallest panel** that covers the question (typically 2–5 experts). Single-domain questions → one expert.
- Always add **financial-analyst** when money is committed and **ecommerce-compliance-counsel** when anything customer-facing is published or a product is chosen.
- Add **risk-manager** or **engagement-lead** for go/no-go and strategic decisions.
- Round 2 reviewers receive Round 1 outputs and must check them, not restart the research.
