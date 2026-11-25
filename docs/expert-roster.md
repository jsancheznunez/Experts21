# Expert Roster — Shopify Dropshipping Advisory Team

The experts a consultant needs around them to advise on launching and running a Shopify dropshipping store. Each role is a Claude Code subagent; each skill is a reusable capability that one or more agents share. Roles and skills are drawn from the research in this folder (see [README](README.md)).

**30 agents · 42 skills** · IDs (`A01`, `S01`) are stable references. This roster is built as Claude Code project subagents in [`.claude/agents/`](../.claude/agents/) and skills in [`.claude/skills/`](../.claude/skills/); see [`CLAUDE.md`](../CLAUDE.md) for how to use the team. Each agent preloads the skills listed for it.

## Summary by domain

| Domain | Agents |
|---|---|
| Strategy & Business | A01 Engagement Lead (Chief Strategist), A02 Market & Trend Analyst, A03 Product Research Specialist, A04 Competitive Intelligence Analyst, A05 Customer Insights Researcher, A06 Brand Strategist |
| Technical | A07 Shopify Store Architect, A08 CRO & UX Specialist, A09 Analytics & Tracking Engineer, A10 Automation & Integrations Engineer, A29 NLTK Text Analytics Expert, A30 spaCy NLP Engineer |
| Operations | A11 Sourcing & Supplier Manager, A12 Fulfillment, Logistics & Customs Specialist, A13 Customer Experience Lead, A14 Payments & Fraud Risk Specialist, A15 Staffing & Talent Advisor |
| Finance | A16 Financial Analyst (Unit Economics & FP&A), A17 Bookkeeping & Tax Specialist |
| Legal & Risk | A18 E-commerce Compliance Counsel, A19 Corporate & IP Counsel, A20 Risk Manager |
| Marketing | A21 Paid Social Media Buyer, A22 Creative Director & UGC Producer, A23 Conversion Copywriter, A24 Email & SMS Retention Marketer, A25 Search & Shopping Marketer, A26 Social Commerce & Influencer Manager |
| Team coordination | A27 Orchestrator, A28 Team Architect (meta agent) |

## Part 1 — The experts

### Strategy & Business

| ID | Expert | Agent file | Job description | Skills | Reads |
|---|---|---|---|---|---|
| A01 | **Engagement Lead (Chief Strategist)** | [`engagement-lead`](../.claude/agents/engagement-lead.md) | Orchestrates the expert team, turns the consultant's questions into tasks, reconciles conflicting advice, and delivers a single recommendation with trade-offs. | S01 `web-research`, S04 `product-scoring`, S06 `unit-economics`, S07 `financial-forecasting`, S18 `kpi-dashboards`, S35 `hiring-sops`, S36 `risk-monitoring`, S37 `decision-synthesis`, S38 `expert-routing` | all |
| A02 | **Market & Trend Analyst** | [`market-trend-analyst`](../.claude/agents/market-trend-analyst.md) | Sizes the market, tracks macro shifts (tariffs, social commerce, marketplace pricing), and says where demand is growing or shrinking. | S01 `web-research`, S02 `demand-validation` | [01](01-market.md), [04](04-competitors.md) |
| A03 | **Product Research Specialist** | [`product-research-specialist`](../.claude/agents/product-research-specialist.md) | Finds and validates candidate products, scores them against the selection criteria, and recommends hero products and accessories. | S01 `web-research`, S02 `demand-validation`, S03 `competitor-teardown`, S04 `product-scoring`, S05 `pricing-margin-modeling`, S20 `supplier-vetting`, S29 `product-safety-compliance` | [02](02-high-demand-products.md), [04](04-competitors.md), [05](05-startup-and-operating-costs.md) |
| A04 | **Competitive Intelligence Analyst** | [`competitive-intelligence-analyst`](../.claude/agents/competitive-intelligence-analyst.md) | Tears down competing stores, marketplaces and ads to find price ceilings, copied offers, and gaps we can own. | S01 `web-research`, S02 `demand-validation`, S03 `competitor-teardown`, S05 `pricing-margin-modeling`, S42 `spacy-nlp-pipeline` | [04](04-competitors.md), [07](07-marketing.md) |
| A05 | **Customer Insights Researcher** | [`customer-insights-researcher`](../.claude/agents/customer-insights-researcher.md) | Builds and maintains customer personas and journeys, and turns reviews and support tickets into insight on objections and motivations. | S01 `web-research`, S08 `customer-personas`, S24 `customer-support-ops`, S41 `nltk-text-analysis`, S42 `spacy-nlp-pipeline` | [03](03-target-customers.md) |
| A06 | **Brand Strategist** | [`brand-strategist`](../.claude/agents/brand-strategist.md) | Defines the niche positioning, brand name, voice and visual identity that let the store compete on something other than price. | S03 `competitor-teardown`, S08 `customer-personas`, S09 `brand-positioning`, S10 `compliant-copywriting` | [03](03-target-customers.md), [04](04-competitors.md) |

### Technical

| ID | Expert | Agent file | Job description | Skills | Reads |
|---|---|---|---|---|---|
| A07 | **Shopify Store Architect** | [`shopify-store-architect`](../.claude/agents/shopify-store-architect.md) | Designs and configures the store: plan, theme, navigation, product structure, checkout, payments, markets and the app stack. | S12 `shopify-admin`, S13 `shopify-theme-development`, S14 `app-stack-evaluation`, S16 `accessibility-performance`, S32 `google-shopping-seo` | [05](05-startup-and-operating-costs.md), [07](07-marketing.md) |
| A08 | **CRO & UX Specialist** | [`cro-ux-specialist`](../.claude/agents/cro-ux-specialist.md) | Raises conversion rate and order value through page design, offers, bundles and structured A/B tests on mobile-first pages. | S05 `pricing-margin-modeling`, S06 `unit-economics`, S08 `customer-personas`, S13 `shopify-theme-development`, S15 `cro-ab-testing`, S16 `accessibility-performance` | [05](05-startup-and-operating-costs.md), [07](07-marketing.md) |
| A09 | **Analytics & Tracking Engineer** | [`analytics-tracking-engineer`](../.claude/agents/analytics-tracking-engineer.md) | Implements pixels, Conversions API, GA4 and attribution, and builds the KPI and profit dashboards every other agent relies on. | S14 `app-stack-evaluation`, S17 `tracking-attribution`, S18 `kpi-dashboards`, S28 `privacy-consent` | [05](05-startup-and-operating-costs.md), [07](07-marketing.md), [08](08-risks.md) |
| A10 | **Automation & Integrations Engineer** | [`automation-integrations-engineer`](../.claude/agents/automation-integrations-engineer.md) | Connects suppliers, fulfillment apps, TikTok Shop, helpdesk and email tools, and automates order and inventory workflows. | S12 `shopify-admin`, S14 `app-stack-evaluation`, S19 `workflow-automation`, S21 `order-inventory-ops`, S24 `customer-support-ops` | [04](04-competitors.md), [06](06-staffing.md) |
| A29 | **NLTK Text Analytics Expert** | [`nltk-expert`](../.claude/agents/nltk-expert.md) | Turns reviews, tickets, comments and research into word frequencies, VADER sentiment and recurring phrases with NLTK; maintains the NLP Lab's NLTK part. | S01 `web-research`, S08 `customer-personas`, S41 `nltk-text-analysis` | [09](09-nlp-text-analysis.md), [03](03-target-customers.md) |
| A30 | **spaCy NLP Engineer** | [`spacy-expert`](../.claude/agents/spacy-expert.md) | Extracts entities, product features and sentence structure with spaCy pipelines and a custom EntityRuler; maintains the NLP Lab's spaCy part. | S01 `web-research`, S03 `competitor-teardown`, S42 `spacy-nlp-pipeline` | [09](09-nlp-text-analysis.md), [04](04-competitors.md) |

### Operations

| ID | Expert | Agent file | Job description | Skills | Reads |
|---|---|---|---|---|---|
| A11 | **Sourcing & Supplier Manager** | [`sourcing-supplier-manager`](../.claude/agents/sourcing-supplier-manager.md) | Vets, negotiates with and monitors suppliers, keeps a backup supplier per hero SKU, and enforces quality through samples and test orders. | S01 `web-research`, S04 `product-scoring`, S19 `workflow-automation`, S20 `supplier-vetting`, S21 `order-inventory-ops`, S22 `shipping-customs-tariffs`, S29 `product-safety-compliance` | [02](02-high-demand-products.md), [04](04-competitors.md), [08](08-risks.md) |
| A12 | **Fulfillment, Logistics & Customs Specialist** | [`fulfillment-logistics-specialist`](../.claude/agents/fulfillment-logistics-specialist.md) | Plans shipping routes (US warehouse vs. overseas), delivery promises, duties and tariffs, and the returns flow. | S01 `web-research`, S19 `workflow-automation`, S20 `supplier-vetting`, S21 `order-inventory-ops`, S22 `shipping-customs-tariffs`, S23 `returns-disputes`, S35 `hiring-sops` | [01](01-market.md), [05](05-startup-and-operating-costs.md), [08](08-risks.md) |
| A13 | **Customer Experience Lead** | [`customer-experience-lead`](../.claude/agents/customer-experience-lead.md) | Designs support policies, macros and chatbot flows, handles order-status and return requests, and keeps refund and complaint rates low. | S08 `customer-personas`, S10 `compliant-copywriting`, S14 `app-stack-evaluation`, S19 `workflow-automation`, S23 `returns-disputes`, S24 `customer-support-ops`, S25 `chargeback-management`, S27 `ftc-consumer-protection`, S33 `email-sms-lifecycle`, S35 `hiring-sops` | [03](03-target-customers.md), [06](06-staffing.md), [08](08-risks.md) |
| A14 | **Payments & Fraud Risk Specialist** | [`payments-fraud-risk-specialist`](../.claude/agents/payments-fraud-risk-specialist.md) | Manages payment gateways, payout reserves, fraud screening and chargeback prevention and responses. | S07 `financial-forecasting`, S12 `shopify-admin`, S23 `returns-disputes`, S25 `chargeback-management`, S36 `risk-monitoring` | [05](05-startup-and-operating-costs.md), [08](08-risks.md) |
| A15 | **Staffing & Talent Advisor** | [`staffing-talent-advisor`](../.claude/agents/staffing-talent-advisor.md) | Decides what to automate, outsource or hire, sources VAs, freelancers and creators, and writes the SOPs they work from. | S30 `contracts-entity-ip`, S35 `hiring-sops` | [06](06-staffing.md) |

### Finance

| ID | Expert | Agent file | Job description | Skills | Reads |
|---|---|---|---|---|---|
| A16 | **Financial Analyst (Unit Economics & FP&A)** | [`financial-analyst`](../.claude/agents/financial-analyst.md) | Models unit economics, break-even ROAS, budgets, cash runway and scenarios, and approves or challenges spend recommendations. | S04 `product-scoring`, S05 `pricing-margin-modeling`, S06 `unit-economics`, S07 `financial-forecasting`, S18 `kpi-dashboards`, S22 `shipping-customs-tariffs`, S25 `chargeback-management`, S26 `bookkeeping-sales-tax` | [05](05-startup-and-operating-costs.md), [07](07-marketing.md), [08](08-risks.md) |
| A17 | **Bookkeeping & Tax Specialist** | [`bookkeeping-tax-specialist`](../.claude/agents/bookkeeping-tax-specialist.md) | Sets up the books, reconciles payouts, fees and supplier costs, and manages sales-tax nexus, registrations and filings. | S07 `financial-forecasting`, S12 `shopify-admin`, S26 `bookkeeping-sales-tax` | [05](05-startup-and-operating-costs.md) |

### Legal & Risk

| ID | Expert | Agent file | Job description | Skills | Reads |
|---|---|---|---|---|---|
| A18 | **E-commerce Compliance Counsel** | [`ecommerce-compliance-counsel`](../.claude/agents/ecommerce-compliance-counsel.md) | Reviews claims, shipping promises, reviews, endorsements, privacy and product safety against FTC, CPSC, FDA and privacy rules. | S01 `web-research`, S16 `accessibility-performance`, S22 `shipping-customs-tariffs`, S27 `ftc-consumer-protection`, S28 `privacy-consent`, S29 `product-safety-compliance`, S36 `risk-monitoring` | [07](07-marketing.md), [08](08-risks.md) |
| A19 | **Corporate & IP Counsel** | [`corporate-ip-counsel`](../.claude/agents/corporate-ip-counsel.md) | Advises on entity formation, supplier, creator and contractor contracts, trademark clearance, and IP infringement risk. | S01 `web-research`, S09 `brand-positioning`, S30 `contracts-entity-ip` | [06](06-staffing.md), [08](08-risks.md) |
| A20 | **Risk Manager** | [`risk-manager`](../.claude/agents/risk-manager.md) | Owns the risk register, watches the early-warning metrics, and escalates threats to cash, accounts or compliance before they turn into crises. | S18 `kpi-dashboards`, S25 `chargeback-management`, S27 `ftc-consumer-protection`, S36 `risk-monitoring`, S37 `decision-synthesis` | [08](08-risks.md) |

### Marketing

| ID | Expert | Agent file | Job description | Skills | Reads |
|---|---|---|---|---|---|
| A21 | **Paid Social Media Buyer** | [`paid-social-media-buyer`](../.claude/agents/paid-social-media-buyer.md) | Plans, launches and scales Meta and TikTok campaigns within break-even ROAS, with daily kill and scale rules. | S02 `demand-validation`, S03 `competitor-teardown`, S06 `unit-economics`, S11 `ugc-creative-production`, S15 `cro-ab-testing`, S17 `tracking-attribution`, S18 `kpi-dashboards`, S27 `ftc-consumer-protection`, S31 `paid-social-campaigns` | [05](05-startup-and-operating-costs.md), [07](07-marketing.md) |
| A22 | **Creative Director & UGC Producer** | [`creative-director`](../.claude/agents/creative-director.md) | Develops ad angles and hooks, briefs UGC creators, and keeps a weekly pipeline of new video and image creative. | S03 `competitor-teardown`, S09 `brand-positioning`, S10 `compliant-copywriting`, S11 `ugc-creative-production`, S27 `ftc-consumer-protection`, S31 `paid-social-campaigns`, S34 `influencer-affiliate` | [03](03-target-customers.md), [07](07-marketing.md) |
| A23 | **Conversion Copywriter** | [`conversion-copywriter`](../.claude/agents/conversion-copywriter.md) | Writes product pages, ad copy, emails and policies that are persuasive, on-brand and truthful. | S08 `customer-personas`, S09 `brand-positioning`, S10 `compliant-copywriting`, S15 `cro-ab-testing`, S27 `ftc-consumer-protection` | [03](03-target-customers.md), [07](07-marketing.md), [08](08-risks.md) |
| A24 | **Email & SMS Retention Marketer** | [`retention-marketer`](../.claude/agents/retention-marketer.md) | Builds lifecycle flows and campaigns (welcome, abandoned cart, post-purchase, win-back) to grow repeat revenue and order value. | S06 `unit-economics`, S08 `customer-personas`, S10 `compliant-copywriting`, S14 `app-stack-evaluation`, S15 `cro-ab-testing`, S17 `tracking-attribution`, S27 `ftc-consumer-protection`, S28 `privacy-consent`, S33 `email-sms-lifecycle` | [03](03-target-customers.md), [07](07-marketing.md) |
| A25 | **Search & Shopping Marketer** | [`search-shopping-marketer`](../.claude/agents/search-shopping-marketer.md) | Runs Google Shopping and Performance Max and handles product-feed and on-site SEO to capture search demand. | S06 `unit-economics`, S10 `compliant-copywriting`, S17 `tracking-attribution`, S32 `google-shopping-seo` | [07](07-marketing.md) |
| A26 | **Social Commerce & Influencer Manager** | [`social-commerce-manager`](../.claude/agents/social-commerce-manager.md) | Runs TikTok Shop, affiliate creators and influencer seeding, including disclosures and commission terms. | S02 `demand-validation`, S11 `ugc-creative-production`, S27 `ftc-consumer-protection`, S30 `contracts-entity-ip`, S31 `paid-social-campaigns`, S34 `influencer-affiliate` | [03](03-target-customers.md), [04](04-competitors.md), [07](07-marketing.md) |

### Team coordination

| ID | Expert | Agent file | Job description | Skills | Reads |
|---|---|---|---|---|---|
| A27 | **Orchestrator** | [`orchestrator`](../.claude/agents/orchestrator.md) | Takes any question, decides which experts to bring in, has them work in parallel and review each other's work, and returns one combined answer. | S01 `web-research`, S37 `decision-synthesis`, S38 `expert-routing` | all |
| A28 | **Team Architect (meta agent)** | [`team-architect`](../.claude/agents/team-architect.md) | Creates new agents and skills, improves existing ones, keeps routing, roster and CLAUDE.md in sync, and validates the wiring. | S01 `web-research`, S38 `expert-routing`, S39 `subagent-authoring`, S40 `skill-authoring` | all |

## Part 2 — Skills and which agents use them

Skills ordered by ID. **Shared by** counts how many agents use each skill, which shows where to build first: the most-shared skills give the most reuse.

| ID | Skill | Skill folder | What it covers | Used by | Shared by |
|---|---|---|---|---|---|
| S01 | **Web research & source evaluation** | [`web-research`](../.claude/skills/web-research/SKILL.md) | Search the web, weigh vendor bias, cite sources, and report ranges instead of single numbers. | A01 Engagement Lead (Chief Strategist), A02 Market & Trend Analyst, A03 Product Research Specialist, A04 Competitive Intelligence Analyst, A05 Customer Insights Researcher, A11 Sourcing & Supplier Manager, A12 Fulfillment, Logistics & Customs Specialist, A18 E-commerce Compliance Counsel, A19 Corporate & IP Counsel, A27 Orchestrator, A28 Team Architect (meta agent), A29 NLTK Text Analytics Expert, A30 spaCy NLP Engineer | 13 |
| S02 | **Trend & demand validation** | [`demand-validation`](../.claude/skills/demand-validation/SKILL.md) | Use Google Trends, TikTok Creative Center, Amazon/TikTok best-seller lists and research tools to confirm sustained demand. | A02 Market & Trend Analyst, A03 Product Research Specialist, A04 Competitive Intelligence Analyst, A21 Paid Social Media Buyer, A26 Social Commerce & Influencer Manager | 5 |
| S03 | **Ad library & competitor teardown** | [`competitor-teardown`](../.claude/skills/competitor-teardown/SKILL.md) | Mine the Meta Ad Library and TikTok top ads, and audit rival stores for pricing, offers, hooks and policies. | A03 Product Research Specialist, A04 Competitive Intelligence Analyst, A06 Brand Strategist, A21 Paid Social Media Buyer, A22 Creative Director & UGC Producer, A30 spaCy NLP Engineer | 6 |
| S04 | **Product scoring** | [`product-scoring`](../.claude/skills/product-scoring/SKILL.md) | Apply the 9-criteria product scorecard (demand, wow factor, price band, landed cost, price-check risk, warehouse, returns, repeat, regulation). | A01 Engagement Lead (Chief Strategist), A03 Product Research Specialist, A11 Sourcing & Supplier Manager, A16 Financial Analyst (Unit Economics & FP&A) | 4 |
| S05 | **Pricing & margin modeling** | [`pricing-margin-modeling`](../.claude/skills/pricing-margin-modeling/SKILL.md) | Set retail prices, bundles and quantity breaks from landed cost, competitor price checks and target margin. | A03 Product Research Specialist, A04 Competitive Intelligence Analyst, A08 CRO & UX Specialist, A16 Financial Analyst (Unit Economics & FP&A) | 4 |
| S06 | **Unit economics & break-even ROAS** | [`unit-economics`](../.claude/skills/unit-economics/SKILL.md) | Compute contribution margin, break-even ROAS, target CPA and profit per order. | A01 Engagement Lead (Chief Strategist), A08 CRO & UX Specialist, A16 Financial Analyst (Unit Economics & FP&A), A21 Paid Social Media Buyer, A24 Email & SMS Retention Marketer, A25 Search & Shopping Marketer | 6 |
| S07 | **Financial forecasting & cash-flow planning** | [`financial-forecasting`](../.claude/skills/financial-forecasting/SKILL.md) | Build budgets, runway and scenario models, including payout-reserve and ad-testing buffers. | A01 Engagement Lead (Chief Strategist), A14 Payments & Fraud Risk Specialist, A16 Financial Analyst (Unit Economics & FP&A), A17 Bookkeeping & Tax Specialist | 4 |
| S08 | **Persona & customer journey mapping** | [`customer-personas`](../.claude/skills/customer-personas/SKILL.md) | Define personas, motivations, objections and the touchpoints from ad to repeat purchase. | A05 Customer Insights Researcher, A06 Brand Strategist, A08 CRO & UX Specialist, A13 Customer Experience Lead, A23 Conversion Copywriter, A24 Email & SMS Retention Marketer, A29 NLTK Text Analytics Expert | 7 |
| S09 | **Brand positioning & identity** | [`brand-positioning`](../.claude/skills/brand-positioning/SKILL.md) | Choose a niche position, name, voice and visual system that set the store apart from marketplaces. | A06 Brand Strategist, A19 Corporate & IP Counsel, A22 Creative Director & UGC Producer, A23 Conversion Copywriter | 4 |
| S10 | **Persuasive & compliant copywriting** | [`compliant-copywriting`](../.claude/skills/compliant-copywriting/SKILL.md) | Write product pages, ads, emails and support replies that convert without making unsubstantiated claims. | A06 Brand Strategist, A13 Customer Experience Lead, A22 Creative Director & UGC Producer, A23 Conversion Copywriter, A24 Email & SMS Retention Marketer, A25 Search & Shopping Marketer | 6 |
| S11 | **Creative briefing & UGC production** | [`ugc-creative-production`](../.claude/skills/ugc-creative-production/SKILL.md) | Turn angles into creator briefs, shot lists and edits, and manage a creative testing pipeline. | A21 Paid Social Media Buyer, A22 Creative Director & UGC Producer, A26 Social Commerce & Influencer Manager | 3 |
| S12 | **Shopify admin & configuration** | [`shopify-admin`](../.claude/skills/shopify-admin/SKILL.md) | Configure plans, products, collections, Markets, Shopify Payments, Shopify Tax, shipping profiles and policies. | A07 Shopify Store Architect, A10 Automation & Integrations Engineer, A14 Payments & Fraud Risk Specialist, A17 Bookkeeping & Tax Specialist | 4 |
| S13 | **Shopify theme development (Liquid / OS 2.0)** | [`shopify-theme-development`](../.claude/skills/shopify-theme-development/SKILL.md) | Customize themes, sections and templates; keep pages fast and mobile-first. | A07 Shopify Store Architect, A08 CRO & UX Specialist | 2 |
| S14 | **App stack evaluation** | [`app-stack-evaluation`](../.claude/skills/app-stack-evaluation/SKILL.md) | Compare and select Shopify apps (sourcing, reviews, upsells, helpdesk, email) on cost, fit and risk. | A07 Shopify Store Architect, A09 Analytics & Tracking Engineer, A10 Automation & Integrations Engineer, A13 Customer Experience Lead, A24 Email & SMS Retention Marketer | 5 |
| S15 | **CRO & A/B testing** | [`cro-ab-testing`](../.claude/skills/cro-ab-testing/SKILL.md) | Form hypotheses, run statistically sound tests on pages, offers, ads and emails, and read the results. | A08 CRO & UX Specialist, A21 Paid Social Media Buyer, A23 Conversion Copywriter, A24 Email & SMS Retention Marketer | 4 |
| S16 | **Web accessibility & performance** | [`accessibility-performance`](../.claude/skills/accessibility-performance/SKILL.md) | Meet WCAG/ADA expectations and Core Web Vitals; audit themes and apps for speed. | A07 Shopify Store Architect, A08 CRO & UX Specialist, A18 E-commerce Compliance Counsel | 3 |
| S17 | **Tracking & attribution** | [`tracking-attribution`](../.claude/skills/tracking-attribution/SKILL.md) | Set up pixels, Conversions API, GA4, UTMs and server-side events; reconcile platform and Shopify numbers. | A09 Analytics & Tracking Engineer, A21 Paid Social Media Buyer, A24 Email & SMS Retention Marketer, A25 Search & Shopping Marketer | 4 |
| S18 | **KPI dashboards & reporting** | [`kpi-dashboards`](../.claude/skills/kpi-dashboards/SKILL.md) | Track ROAS, CPA, AOV, conversion, refund and chargeback rates, delivery time, and profit in shared dashboards. | A01 Engagement Lead (Chief Strategist), A09 Analytics & Tracking Engineer, A16 Financial Analyst (Unit Economics & FP&A), A20 Risk Manager, A21 Paid Social Media Buyer | 5 |
| S19 | **Workflow automation & integrations** | [`workflow-automation`](../.claude/skills/workflow-automation/SKILL.md) | Automate with Shopify Flow, DSers/AutoDS/CJ/Zendrop, webhooks and TikTok Shop sync. | A10 Automation & Integrations Engineer, A11 Sourcing & Supplier Manager, A12 Fulfillment, Logistics & Customs Specialist, A13 Customer Experience Lead | 4 |
| S20 | **Supplier vetting & negotiation** | [`supplier-vetting`](../.claude/skills/supplier-vetting/SKILL.md) | Assess supplier reliability, certifications and warehouse stock; negotiate price, processing time and SLAs. | A03 Product Research Specialist, A11 Sourcing & Supplier Manager, A12 Fulfillment, Logistics & Customs Specialist | 3 |
| S21 | **Order & inventory operations** | [`order-inventory-ops`](../.claude/skills/order-inventory-ops/SKILL.md) | Handle inventory sync, order exceptions, tracking upload, stockouts and supplier quality control. | A10 Automation & Integrations Engineer, A11 Sourcing & Supplier Manager, A12 Fulfillment, Logistics & Customs Specialist | 3 |
| S22 | **Shipping, customs & tariff management** | [`shipping-customs-tariffs`](../.claude/skills/shipping-customs-tariffs/SKILL.md) | Compare US-warehouse and overseas routes, calculate duties, track tariff changes, and set realistic delivery promises. | A11 Sourcing & Supplier Manager, A12 Fulfillment, Logistics & Customs Specialist, A16 Financial Analyst (Unit Economics & FP&A), A18 E-commerce Compliance Counsel | 4 |
| S23 | **Returns, refunds & dispute handling** | [`returns-disputes`](../.claude/skills/returns-disputes/SKILL.md) | Design return policies and flows; resolve disputes before they become chargebacks. | A12 Fulfillment, Logistics & Customs Specialist, A13 Customer Experience Lead, A14 Payments & Fraud Risk Specialist | 3 |
| S24 | **Customer support operations** | [`customer-support-ops`](../.claude/skills/customer-support-ops/SKILL.md) | Run the helpdesk, macros, AI chatbot and SLAs; analyze ticket themes. | A05 Customer Insights Researcher, A10 Automation & Integrations Engineer, A13 Customer Experience Lead | 3 |
| S25 | **Payment risk & chargeback management** | [`chargeback-management`](../.claude/skills/chargeback-management/SKILL.md) | Manage reserves and payout holds, fraud screening, chargeback alerts, evidence packets and backup gateways. | A13 Customer Experience Lead, A14 Payments & Fraud Risk Specialist, A16 Financial Analyst (Unit Economics & FP&A), A20 Risk Manager | 4 |
| S26 | **Bookkeeping & sales-tax compliance** | [`bookkeeping-sales-tax`](../.claude/skills/bookkeeping-sales-tax/SKILL.md) | Reconcile payouts and fees, track COGS, and manage economic nexus, registrations and filings. | A16 Financial Analyst (Unit Economics & FP&A), A17 Bookkeeping & Tax Specialist | 2 |
| S27 | **FTC advertising & consumer-protection rules** | [`ftc-consumer-protection`](../.claude/skills/ftc-consumer-protection/SKILL.md) | Apply the Mail Order Rule, Consumer Review Rule, Endorsement Guides, pricing and scarcity rules, and claim substantiation. | A13 Customer Experience Lead, A18 E-commerce Compliance Counsel, A20 Risk Manager, A21 Paid Social Media Buyer, A22 Creative Director & UGC Producer, A23 Conversion Copywriter, A24 Email & SMS Retention Marketer, A26 Social Commerce & Influencer Manager | 8 |
| S28 | **Privacy & marketing consent** | [`privacy-consent`](../.claude/skills/privacy-consent/SKILL.md) | Apply CCPA/CPRA, GDPR/UK GDPR, cookie consent, TCPA for SMS and CAN-SPAM for email. | A09 Analytics & Tracking Engineer, A18 E-commerce Compliance Counsel, A24 Email & SMS Retention Marketer | 3 |
| S29 | **Product safety & regulatory screening** | [`product-safety-compliance`](../.claude/skills/product-safety-compliance/SKILL.md) | Screen products for CPSC, FDA, FCC and battery-shipping rules, and collect certifications. | A03 Product Research Specialist, A11 Sourcing & Supplier Manager, A18 E-commerce Compliance Counsel | 3 |
| S30 | **Contracts, entity & IP** | [`contracts-entity-ip`](../.claude/skills/contracts-entity-ip/SKILL.md) | Draft and review supplier, creator and contractor agreements; entity formation; trademark clearance; infringement checks. | A15 Staffing & Talent Advisor, A19 Corporate & IP Counsel, A26 Social Commerce & Influencer Manager | 3 |
| S31 | **Paid social campaign management** | [`paid-social-campaigns`](../.claude/skills/paid-social-campaigns/SKILL.md) | Structure, launch, optimize and scale Meta and TikTok campaigns, including Advantage+ and Spark Ads, while protecting ad-account health. | A21 Paid Social Media Buyer, A22 Creative Director & UGC Producer, A26 Social Commerce & Influencer Manager | 3 |
| S32 | **Google Shopping, feeds & SEO** | [`google-shopping-seo`](../.claude/skills/google-shopping-seo/SKILL.md) | Manage Merchant Center feeds, Shopping/PMax campaigns, and on-site and product SEO. | A07 Shopify Store Architect, A25 Search & Shopping Marketer | 2 |
| S33 | **Email & SMS lifecycle marketing** | [`email-sms-lifecycle`](../.claude/skills/email-sms-lifecycle/SKILL.md) | Build Klaviyo/Omnisend flows, segments and campaigns; manage deliverability. | A13 Customer Experience Lead, A24 Email & SMS Retention Marketer | 2 |
| S34 | **Influencer & affiliate management** | [`influencer-affiliate`](../.claude/skills/influencer-affiliate/SKILL.md) | Recruit, contract, brief and pay creators and affiliates; track disclosure and performance. | A22 Creative Director & UGC Producer, A26 Social Commerce & Influencer Manager | 2 |
| S35 | **Hiring & SOP documentation** | [`hiring-sops`](../.claude/skills/hiring-sops/SKILL.md) | Write role scopes and SOPs; source and evaluate VAs, freelancers and agencies. | A01 Engagement Lead (Chief Strategist), A12 Fulfillment, Logistics & Customs Specialist, A13 Customer Experience Lead, A15 Staffing & Talent Advisor | 4 |
| S36 | **Risk assessment & monitoring** | [`risk-monitoring`](../.claude/skills/risk-monitoring/SKILL.md) | Maintain the risk register, set thresholds, and run early-warning checks and escalations. | A01 Engagement Lead (Chief Strategist), A14 Payments & Fraud Risk Specialist, A18 E-commerce Compliance Counsel, A20 Risk Manager | 4 |
| S37 | **Orchestration & decision synthesis** | [`decision-synthesis`](../.claude/skills/decision-synthesis/SKILL.md) | Break problems into tasks, route them to experts, reconcile conflicting advice, and write decision memos. | A01 Engagement Lead (Chief Strategist), A20 Risk Manager, A27 Orchestrator | 3 |
| S38 | **Expert routing** | [`expert-routing`](../.claude/skills/expert-routing/SKILL.md) | Routing table and standard expert panels: which agent to bring in for which question, and in what order. | A01 Engagement Lead (Chief Strategist), A27 Orchestrator, A28 Team Architect (meta agent) | 3 |
| S39 | **Subagent authoring** | [`subagent-authoring`](../.claude/skills/subagent-authoring/SKILL.md) | Create, improve or retire agents in .claude/agents/: frontmatter, tools, skill wiring, prompt structure, validation. | A28 Team Architect (meta agent) | 1 |
| S41 | **NLTK text analysis** | [`nltk-text-analysis`](../.claude/skills/nltk-text-analysis/SKILL.md) | Tokenizing, stopwords, FreqDist word frequency, VADER sentiment and collocations on store text. | A05 Customer Insights Researcher, A29 NLTK Text Analytics Expert | 2 |
| S42 | **spaCy NLP pipeline** | [`spacy-nlp-pipeline`](../.claude/skills/spacy-nlp-pipeline/SKILL.md) | Named entities, custom EntityRuler, noun chunks, lemmas, dependency parsing and displaCy on store text. | A04 Competitive Intelligence Analyst, A05 Customer Insights Researcher, A30 spaCy NLP Engineer | 3 |
| S40 | **Skill authoring** | [`skill-authoring`](../.claude/skills/skill-authoring/SKILL.md) | Create, improve or retire skills in .claude/skills/: frontmatter, concise instructions, sharing across agents, validation. | A28 Team Architect (meta agent) | 1 |

### Most-shared skills (build these first)

- **S01 Web research & source evaluation**: 13 agents
- **S27 FTC advertising & consumer-protection rules**: 8 agents
- **S08 Persona & customer journey mapping**: 7 agents
- **S03 Ad library & competitor teardown**: 6 agents
- **S06 Unit economics & break-even ROAS**: 6 agents
- **S10 Persuasive & compliant copywriting**: 6 agents
- **S02 Trend & demand validation**: 5 agents
- **S14 App stack evaluation**: 5 agents

## Part 3 — Agent × skill matrix

Agents across the top (by ID), skills down the side. ● = the agent uses the skill.

| Skill | A01 | A02 | A03 | A04 | A05 | A06 | A07 | A08 | A09 | A10 | A11 | A12 | A13 | A14 | A15 | A16 | A17 | A18 | A19 | A20 | A21 | A22 | A23 | A24 | A25 | A26 | A29 | A30 | A27 | A28 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| S01 Web research & source evaluation | ● | ● | ● | ● | ● |  |  |  |  |  | ● | ● |  |  |  |  |  | ● | ● |  |  |  |  |  |  |  | ● | ● | ● | ● |
| S02 Trend & demand validation |  | ● | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |  | ● |  |  |  |  |
| S03 Ad library & competitor teardown |  |  | ● | ● |  | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ● | ● |  |  |  |  |  | ● |  |  |
| S04 Product scoring | ● |  | ● |  |  |  |  |  |  |  | ● |  |  |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| S05 Pricing & margin modeling |  |  | ● | ● |  |  |  | ● |  |  |  |  |  |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| S06 Unit economics & break-even ROAS | ● |  |  |  |  |  |  | ● |  |  |  |  |  |  |  | ● |  |  |  |  | ● |  |  | ● | ● |  |  |  |  |  |
| S07 Financial forecasting & cash-flow planning | ● |  |  |  |  |  |  |  |  |  |  |  |  | ● |  | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |
| S08 Persona & customer journey mapping |  |  |  |  | ● | ● |  | ● |  |  |  |  | ● |  |  |  |  |  |  |  |  |  | ● | ● |  |  | ● |  |  |  |
| S09 Brand positioning & identity |  |  |  |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |  | ● |  |  | ● | ● |  |  |  |  |  |  |  |
| S10 Persuasive & compliant copywriting |  |  |  |  |  | ● |  |  |  |  |  |  | ● |  |  |  |  |  |  |  |  | ● | ● | ● | ● |  |  |  |  |  |
| S11 Creative briefing & UGC production |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ● | ● |  |  |  | ● |  |  |  |  |
| S12 Shopify admin & configuration |  |  |  |  |  |  | ● |  |  | ● |  |  |  | ● |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |
| S13 Shopify theme development (Liquid / OS 2.0) |  |  |  |  |  |  | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| S14 App stack evaluation |  |  |  |  |  |  | ● |  | ● | ● |  |  | ● |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |  |
| S15 CRO & A/B testing |  |  |  |  |  |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |  | ● |  | ● | ● |  |  |  |  |  |  |
| S16 Web accessibility & performance |  |  |  |  |  |  | ● | ● |  |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| S17 Tracking & attribution |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |  |  |  |  |  |  | ● |  |  | ● | ● |  |  |  |  |  |
| S18 KPI dashboards & reporting | ● |  |  |  |  |  |  |  | ● |  |  |  |  |  |  | ● |  |  |  | ● | ● |  |  |  |  |  |  |  |  |  |
| S19 Workflow automation & integrations |  |  |  |  |  |  |  |  |  | ● | ● | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| S20 Supplier vetting & negotiation |  |  | ● |  |  |  |  |  |  |  | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| S21 Order & inventory operations |  |  |  |  |  |  |  |  |  | ● | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| S22 Shipping, customs & tariff management |  |  |  |  |  |  |  |  |  |  | ● | ● |  |  |  | ● |  | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| S23 Returns, refunds & dispute handling |  |  |  |  |  |  |  |  |  |  |  | ● | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| S24 Customer support operations |  |  |  |  | ● |  |  |  |  | ● |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| S25 Payment risk & chargeback management |  |  |  |  |  |  |  |  |  |  |  |  | ● | ● |  | ● |  |  |  | ● |  |  |  |  |  |  |  |  |  |  |
| S26 Bookkeeping & sales-tax compliance |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |
| S27 FTC advertising & consumer-protection rules |  |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |  | ● |  | ● | ● | ● | ● | ● |  | ● |  |  |  |  |
| S28 Privacy & marketing consent |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |  |  |  | ● |  |  |  |  |  | ● |  |  |  |  |  |  |
| S29 Product safety & regulatory screening |  |  | ● |  |  |  |  |  |  |  | ● |  |  |  |  |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| S30 Contracts, entity & IP |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |  | ● |  |  |  |  |  |  | ● |  |  |  |  |
| S31 Paid social campaign management |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ● | ● |  |  |  | ● |  |  |  |  |
| S32 Google Shopping, feeds & SEO |  |  |  |  |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| S33 Email & SMS lifecycle marketing |  |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |  |
| S34 Influencer & affiliate management |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |  | ● |  |  |  |  |
| S35 Hiring & SOP documentation | ● |  |  |  |  |  |  |  |  |  |  | ● | ● |  | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| S36 Risk assessment & monitoring | ● |  |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |  | ● |  | ● |  |  |  |  |  |  |  |  |  |  |
| S37 Orchestration & decision synthesis | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |  |  |  | ● |  |
| S38 Expert routing | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ● | ● |
| S39 Subagent authoring |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ● |
| S41 NLTK text analysis |  |  |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| S42 spaCy NLP pipeline |  |  |  | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |
| S40 Skill authoring |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ● |

## Guardrails for every agent

From [06-staffing.md](06-staffing.md) and [08-risks.md](08-risks.md): agents research, draft and recommend; a human approves:

- **Spending:** ad budgets, inventory, supplier payments, hires (A16 Financial Analyst reviews first).
- **Health, safety and product claims, and legal policies** (A18 Compliance Counsel reviews first).
- **Chargeback and dispute responses** (A14 Payments & Fraud Risk prepares the evidence).
- **Supplier contracts and negotiations** (A11 Sourcing with A19 Corporate & IP Counsel).

All agents cite sources, give ranges rather than single figures when sources disagree, and flag vendor bias (skill S01).
