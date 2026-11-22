---
name: web-research
description: Research a business question on the web, weigh source quality and vendor bias, and report cited ranges instead of single numbers. Use whenever an answer depends on market data, prices, benchmarks, regulations or anything that may have changed since the docs/ research (Nov 2026).
metadata:
  id: S01
---

# Web research & source evaluation

## Start from the project research
1. Read the relevant file in `docs/` first (see `docs/README.md` for the index). It is the shared baseline, dated November 2026.
2. Only search the web for what the docs do not cover, or to refresh figures that change often: prices, tariffs, ad costs, platform policies, laws.

## Search method
- Run 2–4 differently worded queries; include the year (e.g. "2026") for anything time-sensitive.
- Prefer primary sources: official pricing pages, government sites (FTC, CBP, USTR, CPSC, IRS, state revenue offices), platform help centers (Shopify, Meta, TikTok, Google), audited reports.
- Then reputable secondary sources: eMarketer, Euromonitor, major law firms, established trade press.
- Treat as **vendor-grade** (useful but biased): supplier blogs (CJdropshipping, Doba, Spocket, Zendrop), app-maker blogs, ad-analytics firms (Triple Whale, Madgicx), "statistics" roundup sites.

## Grade every key figure
| Grade | Meaning |
|---|---|
| A | Primary/official source, current |
| B | Reputable independent secondary source |
| C | Vendor or roundup source, or older than 12 months |
| D | Single anecdote, forum post, unclear origin |

## Reporting rules
- When sources disagree, give the **range** and name the sources at each end. Never average incompatible definitions.
- State the date of each figure and flag anything older than 12 months.
- Separate **facts** (sourced), **estimates** (derived, show the math) and **opinions** (your judgment).
- End with a `Sources` list of markdown links. Never invent a URL or a statistic; if you could not find it, say so.
- Flag conflicts of interest explicitly ("source sells this product/tool").

## Output block
```
Finding: …
Range / value: …  (grade, date)
Sources: [name](url), [name](url)
Confidence: high | medium | low — why
```
