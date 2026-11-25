# Knowledge folders

Each agent has its own folder here and reads it before every answer. Drop documents into the folder of the agent who should know them (for example supplier quotes → `sourcing-supplier-manager/`, a P&L export → `financial-analyst/`). If several agents need the same document, put a copy or a short summary in each relevant folder, or put general research in `docs/`.

Never store credentials or customer personal data here.

| Folder | Agent | Typical documents |
|---|---|---|
| [`orchestrator/`](orchestrator/README.md) | Maya | Records of past questions and the final answers/decisions; consultant preferences (budget limits, risk appetite, report format) |
| [`engagement-lead/`](engagement-lead/README.md) | Eleanor | Business goals, budget and timeline set by the consultant; strategy memos and decisions already made |
| [`market-trend-analyst/`](market-trend-analyst/README.md) | Ravi | Market reports and data exports (PDF, CSV); tariff and trade-policy notices |
| [`product-research-specialist/`](product-research-specialist/README.md) | Jade | Product candidate lists and scorecards; sample-test notes and photos |
| [`competitive-intelligence-analyst/`](competitive-intelligence-analyst/README.md) | Viktor | Competitor lists and store teardowns; ad library screenshots and notes |
| [`customer-insights-researcher/`](customer-insights-researcher/README.md) | Amara | Customer surveys and results; review exports (ours and competitors') |
| [`brand-strategist/`](brand-strategist/README.md) | Luca | Brand guide, logo files and voice guide; name shortlists and clearance status |
| [`shopify-store-architect/`](shopify-store-architect/README.md) | Kenji | Store settings exports and app list; theme customization notes and code snippets |
| [`cro-ux-specialist/`](cro-ux-specialist/README.md) | Priya | Funnel and conversion reports; heatmap or session-recording notes |
| [`analytics-tracking-engineer/`](analytics-tracking-engineer/README.md) | Omar | Tracking plan and event audits; ad platform and shopify data exports |
| [`automation-integrations-engineer/`](automation-integrations-engineer/README.md) | Felix | Workflow diagrams and automation inventory; supplier app settings |
| [`sourcing-supplier-manager/`](sourcing-supplier-manager/README.md) | Mei | Supplier quotes and price lists; sample and test-order results |
| [`fulfillment-logistics-specialist/`](fulfillment-logistics-specialist/README.md) | Diego | Carrier rate cards and shipping quotes; measured delivery-time data |
| [`customer-experience-lead/`](customer-experience-lead/README.md) | Grace | Support macros and chatbot scripts; current refund, shipping and fit-guarantee policies |
| [`payments-fraud-risk-specialist/`](payments-fraud-risk-specialist/README.md) | Tobias | Payment provider emails (reserves, holds); chargeback cases and outcomes |
| [`staffing-talent-advisor/`](staffing-talent-advisor/README.md) | Rosa | Job posts and role scopes; SOPs in use |
| [`financial-analyst/`](financial-analyst/README.md) | Marcus | Budgets and forecasts; real p&l, payout and ad-spend exports |
| [`bookkeeping-tax-specialist/`](bookkeeping-tax-specialist/README.md) | Ingrid | Chart of accounts and month-end checklists; sales-tax registrations and nexus tracker |
| [`ecommerce-compliance-counsel/`](ecommerce-compliance-counsel/README.md) | Helen | Current policies (refund, shipping, privacy, terms); claim substantiation files and test reports |
| [`corporate-ip-counsel/`](corporate-ip-counsel/README.md) | Samuel | Entity documents (formation, operating agreement); signed contracts and templates |
| [`risk-manager/`](risk-manager/README.md) | Nadia | Risk register; incident log and post-mortems |
| [`paid-social-media-buyer/`](paid-social-media-buyer/README.md) | Jake | Ad account exports and performance reports; media plans and budgets |
| [`creative-director/`](creative-director/README.md) | Zoe | Creative briefs and scripts; winning/losing ad notes |
| [`conversion-copywriter/`](conversion-copywriter/README.md) | Theo | Approved product copy and taglines; voice-of-customer phrase bank |
| [`retention-marketer/`](retention-marketer/README.md) | Leila | Flow maps and email/SMS copy; klaviyo/omnisend performance exports |
| [`search-shopping-marketer/`](search-shopping-marketer/README.md) | Arjun | Merchant Center diagnostics and feed exports; search console reports |
| [`social-commerce-manager/`](social-commerce-manager/README.md) | Camila | Creator shortlist and outreach log; commission structures and affiliate terms |
| [`nltk-expert/`](nltk-expert/README.md) | Nils | Anonymized review, ticket or comment exports to analyze (CSV); stopword additions and domain word lists |
| [`spacy-expert/`](spacy-expert/README.md) | Sofia | EntityRuler pattern lists (platforms, suppliers, products, regulations); anonymized competitor page or supplier listing text to analyze |
| [`team-architect/`](team-architect/README.md) | Ada | Feedback about agents' answers (good and bad); requests for new experts or skills |
