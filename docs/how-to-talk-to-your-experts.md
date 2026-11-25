# How to Talk to Your Experts

Ways to put questions to the 30-agent advisory team. For who's on the team, see [`CLAUDE.md`](../CLAUDE.md) and [expert-roster.md](expert-roster.md).

There are three ways in:

| You want… | Ask… | What happens |
|---|---|---|
| A quick answer in one area | **One expert** directly | That expert answers alone. Fast and cheap. |
| A decision that spans several areas | **The orchestrator** | It picks 2–8 experts, runs them in parallel, has reviewers check their work, and returns **one** combined answer. |
| A broad review of the whole business | **The whole team** through the orchestrator | It brings in one or more experts from every domain and merges their findings. |

You can type all of these in a normal Claude Code session opened in this project.

---

## 1. Ask one specific expert

Name the agent, or @-mention it. Use the agent's exact name from the roster.

```
@agent-financial-analyst What's our break-even ROAS if we sell at $44.95 with $12 landed cost and $5 shipping?
```

```
Use the ecommerce-compliance-counsel agent to review this product page copy for FTC problems:
"Clinically proven to stop snoring in one night. Only 3 left! Was $89, now $39."
```

```
Ask the sourcing-supplier-manager: how do I check whether a CJdropshipping listing really ships from a US warehouse?
```

```
@agent-nltk-expert here are 40 anonymized reviews (pasted below). What do 1–2★ reviewers complain about most, and what is the VADER sentiment trend?
```

```
Use the spacy-expert agent to extract prices, discounts and platforms from this competitor product page: ...
```

**Tips**
- One expert won't automatically consult the others. Its answer ends with a **Hand-offs** section naming who else should weigh in. Ask those experts next, or switch to the orchestrator.
- Good for: a calculation, a copy review, a checklist, a definition, a single-domain "how do I…".

---

## 2. Ask the team to coordinate one answer (orchestrator)

Start with **"Use the orchestrator:"**. Give it the decision you need, your numbers, and any constraints. It picks the experts itself. The likely panel under each example comes from the standard panels in [`expert-routing`](../.claude/skills/expert-routing/SKILL.md); the orchestrator can adjust it.

### Example A — Choose the niche and launch plan
```
Use the orchestrator: I have a $6,000 total budget and 15 hours a week. Should I launch a dog-accessories brand
or a small-space home-organization brand? Recommend one niche, three hero products to test, a brand direction,
and a 90-day launch plan with a budget split. Flag anything that needs my approval.
```
**Likely panel:** market-trend-analyst, product-research-specialist, customer-insights-researcher, brand-strategist → reviewed by financial-analyst, ecommerce-compliance-counsel, engagement-lead.

### Example B — Go/no-go on a specific product
```
Use the orchestrator: should we sell this product? A portable neck massager, supplier cost $14 plus $6 US-warehouse
shipping, competitors sell it at $49-$69 and Temu has a lookalike at $18. We'd want to claim it "relieves neck pain".
Give me a go/test/reject verdict with margins, the claims we can legally make, and supplier requirements.
```
**Likely panel:** product-research-specialist, competitive-intelligence-analyst, sourcing-supplier-manager → reviewed by financial-analyst (margins) and ecommerce-compliance-counsel (health claim, product safety).

### Example C — Fix a business in trouble
```
Use the orchestrator: we're 6 weeks in. Meta ROAS fell from 2.8 to 1.4 over 10 days, Shopify just put a 25% reserve
on our payouts for 90 days, and "where is my order" tickets are 30% of orders because the supplier is slow.
We have $4,000 cash left. What do we do this week, in priority order? Save the memo.
```
**Likely panel:** paid-social-media-buyer, analytics-tracking-engineer, payments-fraud-risk-specialist, fulfillment-logistics-specialist, customer-experience-lead → reviewed by financial-analyst (cash) and risk-manager. Saved to `deliverables/answers/`.

### Example D — Plan a channel expansion
```
Use the orchestrator: our hero product does $15k/month on Meta at a 2.6 ROAS. Should we add TikTok Shop with
affiliate creators and Google Shopping next quarter? Compare the two, give a budget and creator plan, the
operational changes needed (shipping speed, inventory sync), and what could go wrong.
```
**Likely panel:** social-commerce-manager, search-shopping-marketer, automation-integrations-engineer, fulfillment-logistics-specialist → reviewed by financial-analyst, ecommerce-compliance-counsel (creator disclosure), risk-manager.

### Writing good orchestrator prompts
- **State the decision** you need ("recommend one", "go/no-go", "what do we do this week").
- **Give your real numbers:** budget, prices, costs, ROAS, cash, timeline. Otherwise the experts use the benchmarks in `docs/` and say so.
- **Name the outputs** you want (verdict, plan, budget split, copy, checklist).
- Add **"Save the memo"** to get a file in `deliverables/answers/`.
- Optional controls: "keep the panel small" (cheaper), "include the risk-manager", "no web searches, use docs only".

---

## 3. Ask the whole team

The orchestrator is the way in to the whole team. Normally it uses the **smallest** panel that fits, capped at 8 experts. For a full review, ask for every domain explicitly:

```
Use the orchestrator for a whole-team launch-readiness review. Bring in at least one expert from every domain:
strategy, technical, operations, finance, legal & risk, and marketing. Each expert lists the top 3 gaps in our
plan from their area, then the risk-manager and engagement-lead rank everything into one prioritized
pre-launch checklist with owners. Our plan: [paste plan or point to a file, e.g. deliverables/answers/plan.md].
Save the memo.
```

```
Use the orchestrator: run a whole-team pre-mortem. It's 6 months from now and the store has failed.
Have each domain's lead expert explain the most likely cause from their area, then merge the answers into
a ranked risk register with early-warning metrics and the prevention step for each.
```

**Notes**
- A whole-team run covers about 6–8 experts (one or more per domain) plus reviewers. It's the most thorough option and also the slowest and most expensive. Save it for major decisions.
- To have **all 28 experts** answer at once, ask `team-architect` to raise the orchestrator's 8-expert cap. Above that size, the answers tend to get repetitive rather than better.

---

## Changing the team itself

That goes to the meta agent, not the orchestrator:
```
Use team-architect to add an Amazon marketplace expert and wire it into the routing table.
```
```
team-architect: the conversion-copywriter keeps suggesting countdown timers. Tighten its rules so it stops.
```
