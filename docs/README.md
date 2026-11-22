# Shopify Dropshipping Store — Research Docs

Background research for opening a Shopify store that sells dropshipped products online. These docs are the shared context for the team of expert agents that will be built next: each agent should read this index plus the topic files relevant to its role.

**Research date:** November 2026 · **Primary market assumed:** United States · **Currency:** USD

## Index

| # | Topic | File | Key takeaway |
|---|---|---|---|
| 1 | Market | [01-market.md](01-market.md) | ~$340–545B global market in 2026, ~20–23% CAGR; US de minimis ended in 2025, pushing sellers to US-warehoused stock |
| 2 | High-demand products | [02-high-demand-products.md](02-high-demand-products.md) | Pets, home, wellness/sleep, gadgets, beauty tools; score products on demand, margin, shipping speed and regulatory risk |
| 3 | Target customers | [03-target-customers.md](03-target-customers.md) | Millennials (Meta) first, Gen Z (TikTok) second; they expect 2–7 day delivery and social proof |
| 4 | Competitors | [04-competitors.md](04-competitors.md) | Temu/Shein/Amazon win on price, so compete on brand, curation, speed and service; TikTok Shop is both a rival and a channel |
| 5 | Startup & operating costs | [05-startup-and-operating-costs.md](05-startup-and-operating-costs.md) | ~$1.5k lean / $5–9k recommended to launch; $100–500/mo fixed; net margin 10–20%; break-even ROAS ≈ 1.85 |
| 6 | Staffing | [06-staffing.md](06-staffing.md) | Founder + AI agents + freelancers/VAs; humans approve spend, claims, disputes and supplier deals |
| 7 | Marketing | [07-marketing.md](07-marketing.md) | Meta + TikTok paid social with UGC creative, Klaviyo email/SMS from day one; Shopify median conversion ~1.4% |
| 8 | Biggest risks | [08-risks.md](08-risks.md) | Unprofitable ads, payout holds, chargebacks, supplier failure, tariffs, FTC rules; 80–90% of stores fail in year one |

## Recommended strategy

1. **One niche, branded store** with 1–3 hero products, not a general store.
2. **US-warehouse fulfillment** (2–7 days) to handle tariffs, chargebacks and customer expectations.
3. **Price point $25–80**, landed cost ≤ 35% of retail, AOV raised with bundles.
4. **Paid social + UGC** for acquisition; **email/SMS** for retention.
5. **Keep compliance tight:** realistic shipping promises, genuine reviews only, no unsubstantiated claims.
6. **Hold 2–3 months of working capital** for payout reserves and ad testing.

## Expert-agent team

The research is turned into a working team of Claude Code agents:

- **[expert-roster.md](expert-roster.md)** — 28 agents (26 domain experts across business, technical, operations, finance, legal and marketing, plus an orchestrator and a meta "team architect"), the 40 skills they share, and an agent × skill matrix.
- Agents live in [`.claude/agents/`](../.claude/agents/), skills in [`.claude/skills/`](../.claude/skills/). How to use the team: [`CLAUDE.md`](../CLAUDE.md).
- [06-staffing.md](06-staffing.md) explains how the roles map to business functions.

## Caveats

- Many sources are vendor blogs (suppliers, app makers, ad-analytics firms) with a commercial interest; market-size reports differ by definition. Figures are ranges for planning, not facts to quote.
- Prices (Shopify, apps, suppliers) and tariff rates change often. Verify against official pages before making decisions.
- This is not legal or tax advice; have a professional review policies and the business structure.
