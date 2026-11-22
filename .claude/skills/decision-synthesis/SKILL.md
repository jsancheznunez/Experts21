---
name: decision-synthesis
description: Combine findings from several experts into one decision - reconcile conflicts, weigh evidence, state trade-offs and write a decision memo with a clear recommendation, conditions and next steps. Use whenever multiple expert inputs must become one answer or a go/no-go call.
metadata:
  id: S37
---

# Orchestration & decision synthesis

## Synthesis method
1. **Restate the question** and the decision criteria (profit, risk, speed, cost, compliance).
2. **Collect** each expert's conclusion, key numbers, confidence and assumptions in one table.
3. **Find agreements** — these become the backbone of the answer.
4. **Resolve conflicts**:
   - Different assumptions → align on one assumption set (usually finance's unit-economics) and re-check.
   - Different evidence → prefer higher-grade sources (web-research grades A–D).
   - Genuine trade-off → present it explicitly with who wins on which criterion.
   - **Compliance and safety vetoes override commercial upside.** A legal/regulatory "no" is a constraint, not an opinion to average.
5. **Decide**: recommendation + conditions under which it changes.
6. **Check** the answer against the guardrails (human approval for spend, claims, disputes, contracts).

## Decision memo template
```
# Decision: [question]
**Recommendation:** [one sentence]  **Confidence:** high/medium/low

## Why
- 3–5 bullets with key numbers (sources)

## Trade-offs and dissent
- [expert] argued … ; resolved by …

## Conditions / kill criteria
- Proceed only if … ; stop if …

## Risks and mitigations
| Risk | Mitigation | Owner |

## Next steps (owner, date)
1. …

## Needs human approval
- [spend / claim / contract / dispute items]

## Contributors
[agents consulted]
```

## Rules
- One answer, not a stapled list of expert reports.
- Keep each expert's attribution for important claims.
- Never hide disagreement; never invent consensus.
- Lead with the answer; detail after.
