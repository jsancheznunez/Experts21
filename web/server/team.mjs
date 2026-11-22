// "Ask the whole team": the orchestrator (Maya) plans a panel, the experts answer in parallel,
// reviewers check their work, and the orchestrator writes one combined answer.
// Runs inside a Netlify background function (15-minute limit); progress is saved after each step.
import { TEAM, getAgent, requestFor, completeTurn, systemPromptFor, friendlyError } from "./claude.mjs";

const NOT_EXPERTS = new Set(["orchestrator", "team-architect"]);
const MAX_ROUND1 = 5;
const MAX_ROUND2 = 3;

const expertNames = () => Object.keys(TEAM.agents).filter((n) => !NOT_EXPERTS.has(n)).sort();

const PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["restated_question", "assumptions", "round1", "round2"],
  properties: {
    restated_question: { type: "string" },
    assumptions: { type: "array", items: { type: "string" } },
    round1: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, required: ["agent", "brief"],
        properties: { agent: { type: "string", enum: expertNames() }, brief: { type: "string" } },
      },
    },
    round2: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, required: ["agent", "focus"],
        properties: { agent: { type: "string", enum: expertNames() }, focus: { type: "string" } },
      },
    },
  },
};

function planSystemPrompt() {
  const experts = expertNames().map((n) => {
    const a = getAgent(n);
    return `- ${n} (${a.firstName}, ${a.title})`;
  }).join("\n");
  return [
    "You are Maya, the orchestrator of a Shopify dropshipping advisory team. Your only job in this step is to plan the panel for the consultant's question.",
    "Pick the smallest panel that covers the question: 1 expert for a single-domain question, usually 2–5 in Round 1 (at most 5), " +
      "and 0–3 reviewers in Round 2 who check and challenge Round 1 work (at most 8 experts in total). " +
      "Always include financial-analyst when money is committed and ecommerce-compliance-counsel when anything customer-facing is published or a product is chosen. " +
      "Add risk-manager or engagement-lead for go/no-go decisions. Don't put the same expert in both rounds.",
    "Write each Round 1 brief so it stands alone: the consultant's question, the context and assumptions, the expert's specific part, " +
      "and which other experts are on the question. Ask for the expert's standard deliverable in under ~500 words. " +
      "For each reviewer, say what to check (numbers, claims, risks).",
    "If key facts are missing (budget, niche, market, stage), state reasonable assumptions instead of asking.",
    "## Available experts",
    experts,
    "## Routing table and standard panels",
    TEAM.skills["expert-routing"],
  ].join("\n\n");
}

const reportList = (reports) => reports.map((r) => `### ${r.agent} (${r.firstName}, ${r.title})\n\n${r.text}`).join("\n\n");

export async function runTeam({ id, question, history = [], save }) {
  const job = {
    id, question, status: "planning", startedAt: new Date().toISOString(), updatedAt: null,
    steps: [], plan: null, experts: {}, answer: null, error: null,
  };
  const step = async (text, patch = {}) => {
    Object.assign(job, patch, { updatedAt: new Date().toISOString() });
    if (text) job.steps.push({ at: job.updatedAt, text });
    await save(structuredClone(job));
  };
  const context = history.length
    ? `Earlier in this conversation:\n${history.map((m) => `${m.role === "user" ? "Consultant" : "Team"}: ${m.content}`).join("\n\n")}\n\n`
    : "";

  try {
    await step("Maya is choosing the panel…");

    // 1. Plan
    const planned = await completeTurn(requestFor("orchestrator", [{ role: "user", content: `${context}Consultant's question: ${question}` }], {
      system: planSystemPrompt(),
      maxTokens: 4000,
      outputFormat: { type: "json_schema", schema: PLAN_SCHEMA },
    }));
    const plan = JSON.parse(planned.text);
    const seen = new Set();
    plan.round1 = plan.round1.filter((e) => !seen.has(e.agent) && seen.add(e.agent)).slice(0, MAX_ROUND1);
    plan.round2 = plan.round2.filter((e) => !seen.has(e.agent) && seen.add(e.agent)).slice(0, MAX_ROUND2);
    if (!plan.round1.length) throw new Error("The orchestrator did not pick any experts.");
    for (const [round, list] of [[1, plan.round1], [2, plan.round2]]) {
      for (const e of list) {
        const a = getAgent(e.agent);
        job.experts[e.agent] = { round, firstName: a.firstName, title: a.title, status: "waiting", text: null };
      }
    }
    const names = (list) => list.map((e) => job.experts[e.agent].firstName).join(", ");
    await step(`Panel: ${names(plan.round1)}${plan.round2.length ? `; reviewers: ${names(plan.round2)}` : ""}.`, { plan, status: "round1" });

    // 2. Round 1 in parallel
    const runExpert = async (agent, prompt) => {
      job.experts[agent].status = "working";
      await step(null);
      try {
        const { text } = await completeTurn(requestFor(agent, [{ role: "user", content: prompt }], { maxTokens: 6000 }));
        Object.assign(job.experts[agent], { status: "done", text });
        await step(`${job.experts[agent].firstName} (${job.experts[agent].title}) finished.`);
        return { agent, firstName: job.experts[agent].firstName, title: job.experts[agent].title, text };
      } catch (err) {
        Object.assign(job.experts[agent], { status: "error", text: friendlyError(err) });
        await step(`${job.experts[agent].firstName} could not answer: ${friendlyError(err)}`);
        return null;
      }
    };
    const assumptions = plan.assumptions.length ? `\n\nAssumptions: ${plan.assumptions.join("; ")}` : "";
    const round1 = (await Promise.all(plan.round1.map((e) => runExpert(e.agent, `${context}${e.brief}${assumptions}`)))).filter(Boolean);
    if (!round1.length) throw new Error("None of the Round 1 experts could answer.");

    // 3. Round 2 reviewers check Round 1 work
    let round2 = [];
    if (plan.round2.length) {
      await step("Reviewers are checking the Round 1 work…", { status: "round2" });
      round2 = (await Promise.all(plan.round2.map((e) => runExpert(e.agent,
        `${context}Consultant's question: ${plan.restated_question}${assumptions}\n\n` +
        `You are reviewing other experts' work. Check, challenge and fill gaps; do not restart the research. Your focus: ${e.focus}\n\n` +
        `## Round 1 reports\n\n${reportList(round1)}\n\nReturn your standard deliverable in under ~400 words.`)))).filter(Boolean);
    }

    // 4. Synthesis
    await step("Maya is writing the combined answer…", { status: "synthesis" });
    const synthesis = await completeTurn(requestFor("orchestrator", [{
      role: "user",
      content: `${context}Consultant's question: ${question}\n\nRestated: ${plan.restated_question}${assumptions}\n\n` +
        `## Round 1 reports\n\n${reportList(round1)}` +
        (round2.length ? `\n\n## Round 2 reviews\n\n${reportList(round2)}` : "") +
        "\n\nWrite the one combined answer now, in your Output format.",
    }], {
      maxTokens: 8000,
      system: systemPromptFor("orchestrator", {
        extra: "In this web app the server has already run the panel you planned. The experts' reports are in the user message. " +
          "Use them only; never invent expert output. Do not try to call the Agent tool. The decision-synthesis skill below is your method.",
      }) + "\n\n## Skill: decision-synthesis\n\n" + TEAM.skills["decision-synthesis"],
    }));
    await step("Done.", { status: "done", answer: synthesis.text });
  } catch (err) {
    await step(`Stopped: ${friendlyError(err)}`, { status: "error", error: friendlyError(err) });
  }
  return job;
}
