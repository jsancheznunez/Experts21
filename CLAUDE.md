# Experts21 — Shopify Dropshipping Advisory Team

This project is a team of **30 Claude Code agents** that advise a consultant on opening and running a Shopify store that sells dropshipped products. The team is built on research in `docs/` (dated November 2026).

## Instructions for Claude in this project

- **Business questions** about the store (products, market, costs, marketing, operations, legal, finance, risk): delegate to the **`orchestrator`** agent. It picks the experts, runs them and returns one combined answer. For a narrow question that clearly belongs to one expert, you may call that expert directly.
- **Requests to add, change or fix agents or skills:** delegate to **`team-architect`**.
- Treat `docs/` as the shared baseline. Volatile facts (prices, tariffs, ad costs, laws) must be checked before they're relied on.
- Save generated deliverables under `deliverables/<area>/` (for example `deliverables/answers/`, `deliverables/finance/`). Don't edit the research files `docs/01`–`docs/09` unless asked.

## Layout

```
CLAUDE.md                     this file
docs/                         research (README index, 01–09 topic files), expert-roster.md, agent-brains.md, how-to guide
knowledge/<agent-name>/       each agent's own documents, read before every answer
.claude/agents/               30 subagents (one .md file each)
.claude/skills/<name>/SKILL.md  42 skills, preloaded into agents via the `skills:` field
.claude/scripts/validate_team.py  checks agent and skill wiring
deliverables/                 outputs the team saves (created on demand)
exports/                      agents packaged as uploadable Claude skills (.claude/scripts/export_agent_skill.py)
sdk/                          Node.js Claude Agent SDK script that asks Zoe a question (sdk/README.md)
web/                          React app on Netlify: chat with the experts, NLP Lab (NLTK + spaCy, run at build time), Resources page (web/README.md; netlify.toml at the root)
```

## The team

| Domain | Agents |
|---|---|
| **Coordination** | `orchestrator` (routes any question to the right experts and merges their work into one answer) · `team-architect` (meta agent: creates and improves agents and skills) |
| **Strategy & Business** | `engagement-lead` · `market-trend-analyst` · `product-research-specialist` · `competitive-intelligence-analyst` · `customer-insights-researcher` · `brand-strategist` |
| **Technical** | `shopify-store-architect` · `cro-ux-specialist` · `analytics-tracking-engineer` · `automation-integrations-engineer` · `nltk-expert` · `spacy-expert` |
| **Operations** | `sourcing-supplier-manager` · `fulfillment-logistics-specialist` · `customer-experience-lead` · `payments-fraud-risk-specialist` · `staffing-talent-advisor` |
| **Finance** | `financial-analyst` · `bookkeeping-tax-specialist` |
| **Legal & Risk** | `ecommerce-compliance-counsel` · `corporate-ip-counsel` · `risk-manager` |
| **Marketing** | `paid-social-media-buyer` · `creative-director` · `conversion-copywriter` · `retention-marketer` · `search-shopping-marketer` · `social-commerce-manager` |

Each role's job description, skills and source docs are in [`docs/expert-roster.md`](docs/expert-roster.md); each agent's model, first name, voice and working style are in [`docs/agent-brains.md`](docs/agent-brains.md).

**Knowledge folders:** drop your own documents (supplier quotes, P&L exports, policies, brand guide…) into `knowledge/<agent-name>/`. That agent reads them before every answer, and they take priority over the general research in `docs/`. See [`knowledge/README.md`](knowledge/README.md). Never put credentials or customer personal data there. The routing table (which expert for which question, and standard panels) is in [`.claude/skills/expert-routing/SKILL.md`](.claude/skills/expert-routing/SKILL.md).

### How the orchestrator works
1. **Triage:** restates the question, fills gaps with stated assumptions.
2. **Panel:** picks the smallest set of experts that covers it (usually 2–5). Finance joins whenever money is committed; compliance joins whenever something customer-facing is published or a product is chosen.
3. **Round 1:** the experts work in parallel, each with a standalone brief.
4. **Round 2:** reviewers check and challenge Round 1 work (finance checks numbers, compliance checks claims, risk runs a pre-mortem). Disagreements get one rebuttal round.
5. **Synthesis:** one answer: recommendation, details, disagreements, risks, next steps, items that need human approval, the panel and sources.

### Skills
42 skills hold the working knowledge: methods, checklists, formulas, thresholds and output templates. A skill can be shared by several agents. Each agent **preloads** the full text of its skills at startup through the `skills:` list in its frontmatter. The most shared are `web-research` (11 agents), `ftc-consumer-protection` (8), `unit-economics`, `customer-personas` and `compliant-copywriting` (6 each). Skills can also be used directly in the main session as slash commands, for example `/unit-economics` or `/product-scoring`.

## How to use the team

Ask in plain language. Claude will hand business questions to the orchestrator:
```
Use the orchestrator: should we launch with a pet niche or a home-organization niche, with a $6,000 budget?
```

Call one expert directly with an @-mention or by name:
```
@agent-financial-analyst what's our break-even ROAS at a $44.95 price?
Use the ecommerce-compliance-counsel agent to review this product page: ...
```

Run a whole session as the orchestrator. Every prompt in that session goes through it:
```bash
claude --agent orchestrator
```

Get a saved report by asking for it ("…and save the memo"). The orchestrator writes it to `deliverables/answers/`.

## Extending the team

Ask the meta agent, for example: *"Use team-architect to add an Amazon marketplace expert"* or *"team-architect: the copywriter keeps making medical claims, fix it"*. It follows the `subagent-authoring` and `skill-authoring` skills, updates the routing table, roster and this file, and runs the validator.

After any manual edit, run the validator:
```bash
python3 .claude/scripts/validate_team.py --map
```
It checks frontmatter (including valid YAML, since Claude Code skips agents whose YAML doesn't parse), models, knowledge folders, names, that every listed skill exists and can be preloaded, that every agent is in the routing table, and that the team stays within 10–50 agents. `--map` prints which agents use each skill.

Authoring conventions:
- One file per agent in `.claude/agents/<name>.md`. Lowercase-hyphenated names, same as the filename. Quote any `description` that contains `: `.
- Every expert uses the same prompt sections: Read first · Responsibilities · How you work · Deliverable · Hand-offs · Guardrails.
- Skills live in `.claude/skills/<name>/SKILL.md`, with `metadata.id` set to `S##`. Keep them concise (they're preloaded on every run). Never set `disable-model-invocation: true` on a skill that agents preload.
- Agent tool access is minimal. Research agents get `Read, Grep, Glob, WebSearch, WebFetch`. Agents that save deliverables add `Write, Edit`. Only agents that need calculations or CLIs add `Bash`. Only `orchestrator` has `Agent`.
- Every agent sets `model:`: **opus** (7) for deep strategy, legal and finance judgment plus the orchestrator and team-architect; **sonnet** (20) for most specialist work; **haiku** (3) for fast template and lookup work. Reasons are in [`docs/agent-brains.md`](docs/agent-brains.md).
- Every agent has a first name, voice and working style (**Who you are** section; tone only) and reads its folder in `knowledge/<agent-name>/` before answering.

## Team guardrails (apply to every agent)

- **Agents advise; a human approves.** That covers ad and other spend, health, safety and product claims, legal policies, chargeback and dispute responses, and supplier, creator and contractor contracts.
- **Compliance and safety vetoes override commercial upside.**
- Cite sources and give ranges when sources disagree. Flag vendor bias. Never invent statistics, URLs, reviews or product facts.
- Legal, tax and compliance output is analysis, not legal or tax advice. Route final sign-off to a licensed attorney or CPA.
- Never put credentials, API keys or customer personal data in repository files.

## Cost note

A full orchestrated answer runs several subagents and uses noticeably more tokens than a single reply. For quick factual questions, ask one expert directly or tell the orchestrator to keep the panel small.
