#!/usr/bin/env node
// Ask Zoe, the team's creative director, a question with the Claude Agent SDK.
//
//   node ask-zoe.mjs "Write three UGC hooks for a waterproof dog car hammock"
//   node ask-zoe.mjs --dry-run "..."   # show what was loaded; no API call
//   node ask-zoe.mjs --check           # start an SDK session and confirm Zoe is registered; no API call
//
// What gets loaded, all from this repository:
//   .claude/agents/creative-director.md        Zoe's system prompt, tools and model
//   .claude/skills/<name>/SKILL.md             every skill listed in Zoe's `skills:` front matter
//   knowledge/creative-director/**             Zoe's knowledge folder (text files)
// The research in docs/ stays on disk; Zoe reads it with the Read tool (cwd is the repo root).

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { query } from "@anthropic-ai/claude-agent-sdk";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const AGENT_NAME = "creative-director";
// Zoe answers questions; she doesn't edit files or run commands from this script.
const ALLOWED_TOOLS = ["Read", "Grep", "Glob", "WebSearch", "WebFetch"];
const TEXT_EXTENSIONS = new Set([".md", ".txt", ".csv", ".json", ".yaml", ".yml"]);
const MAX_KNOWLEDGE_CHARS = 200_000; // keep the system prompt a sensible size

// ---------- loading ----------

/** Split a Markdown file with YAML front matter into { fm, body }. Handles the
 *  shapes used in .claude/: scalars, quoted strings, block lists and one-level maps. */
function parseFrontMatter(text, file) {
  const lines = text.split(/\r?\n/);
  if (lines[0].trim() !== "---") throw new Error(`${file}: front matter must start on line 1`);
  const end = lines.indexOf("---", 1);
  if (end === -1) throw new Error(`${file}: missing closing ---`);
  const fm = {};
  let key = null;
  for (const raw of lines.slice(1, end)) {
    if (!raw.trim() || raw.trimStart().startsWith("#")) continue;
    if (/^\s/.test(raw)) {
      const item = raw.trim();
      if (key && item.startsWith("- ")) (fm[key] = Array.isArray(fm[key]) ? fm[key] : []).push(unquote(item.slice(2)));
      else if (key && item.includes(":")) {
        const [k, ...v] = item.split(":");
        fm[key] = typeof fm[key] === "object" && !Array.isArray(fm[key]) ? fm[key] : {};
        fm[key][k.trim()] = unquote(v.join(":"));
      }
      continue;
    }
    const idx = raw.indexOf(":");
    key = raw.slice(0, idx).trim();
    fm[key] = unquote(raw.slice(idx + 1));
  }
  return { fm, body: lines.slice(end + 1).join("\n").trim() };
}

function unquote(v) {
  v = v.trim();
  if (v.length >= 2 && v.startsWith('"') && v.endsWith('"')) return JSON.parse(v);
  if (v.length >= 2 && v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1).replaceAll("''", "'");
  return v;
}

const toList = (v) => (Array.isArray(v) ? v : String(v || "").split(",").map((s) => s.trim()).filter(Boolean));

function listFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).sort().flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? (name === "archive" ? [] : listFiles(p)) : [p];
  });
}

export function loadZoe() {
  const agentFile = join(REPO_ROOT, ".claude", "agents", `${AGENT_NAME}.md`);
  const { fm, body } = parseFrontMatter(readFileSync(agentFile, "utf8"), agentFile);
  if (fm.name !== AGENT_NAME) throw new Error(`${agentFile}: expected name ${AGENT_NAME}, found ${fm.name}`);
  const firstName = body.match(/Your name is \*\*([^*]+)\*\*/)?.[1] ?? AGENT_NAME;

  // Skills Zoe preloads in Claude Code, inlined so the SDK session needs no filesystem settings.
  const skills = toList(fm.skills).map((name) => {
    const file = join(REPO_ROOT, ".claude", "skills", name, "SKILL.md");
    if (!existsSync(file)) throw new Error(`Skill "${name}" listed by ${AGENT_NAME} not found at ${file}`);
    return { name, file, body: parseFrontMatter(readFileSync(file, "utf8"), file).body };
  });

  // Knowledge folder: README plus every text document the consultant has added.
  const knowledgeDir = join(REPO_ROOT, "knowledge", AGENT_NAME);
  const knowledge = [];
  const skipped = [];
  let chars = 0;
  for (const file of listFiles(knowledgeDir)) {
    if (!TEXT_EXTENSIONS.has(extname(file).toLowerCase())) { skipped.push(file); continue; }
    const text = readFileSync(file, "utf8");
    if (chars + text.length > MAX_KNOWLEDGE_CHARS) { skipped.push(file); continue; }
    chars += text.length;
    knowledge.push({ file, text });
  }

  const rel = (p) => relative(REPO_ROOT, p);
  const prompt = [
    body,
    "## Running context",
    `You are running as a standalone agent through the Claude Agent SDK, with the repository root as your working directory. ` +
      `Your skills and your knowledge folder are already included below, so you do not need to read them again. ` +
      `Read the docs/ files listed under "Read first" with the Read tool when they are relevant. ` +
      `You cannot call other experts here: name them under Hand-offs. You have read-only tools; do not try to write files.`,
    "## Your skills (preloaded)",
    ...skills.map((s) => `### Skill: ${s.name}\n\n${s.body}`),
    `## Your knowledge folder (knowledge/${AGENT_NAME}/, preloaded)`,
    knowledge.length > 1 || knowledge.some((k) => !k.file.endsWith("README.md"))
      ? "" : "Only the README is present: write \"No knowledge files yet\" under your assumptions.",
    ...knowledge.map((k) => `### File: ${rel(k.file)}\n\n${k.text.trim()}`),
    skipped.length ? `Not loaded (binary or over size limit; read with the Read tool if needed): ${skipped.map(rel).join(", ")}` : "",
  ].filter(Boolean).join("\n\n");

  return {
    firstName,
    agentFile: rel(agentFile),
    definition: {
      description: fm.description,
      prompt,
      tools: toList(fm.tools).filter((t) => ALLOWED_TOOLS.includes(t)),
      model: process.env.ZOE_MODEL || fm.model || "inherit",
    },
    skills: skills.map((s) => rel(s.file)),
    knowledge: knowledge.map((k) => rel(k.file)),
    skipped: skipped.map(rel),
  };
}

function sdkOptions(zoe) {
  return {
    cwd: REPO_ROOT,
    settingSources: [], // isolation: no CLAUDE.md, settings or filesystem agents; Zoe's context is built above
    agents: { [AGENT_NAME]: zoe.definition },
    agent: AGENT_NAME, // run the main thread as Zoe
    allowedTools: zoe.definition.tools,
    disallowedTools: ["Write", "Edit", "Bash", "NotebookEdit", "Agent"],
    maxTurns: Number(process.env.ZOE_MAX_TURNS || 20),
    maxBudgetUsd: Number(process.env.ZOE_MAX_BUDGET_USD || 2),
  };
}

// ---------- modes ----------

function printSummary(zoe) {
  const d = zoe.definition;
  console.log(`Agent:      ${zoe.firstName} (${AGENT_NAME}) from ${zoe.agentFile}`);
  console.log(`Model:      ${d.model}`);
  console.log(`Tools:      ${d.tools.join(", ")}`);
  console.log(`Skills:     ${zoe.skills.length} inlined\n            ${zoe.skills.join("\n            ")}`);
  console.log(`Knowledge:  ${zoe.knowledge.length} file(s)\n            ${zoe.knowledge.join("\n            ")}`);
  if (zoe.skipped.length) console.log(`Skipped:    ${zoe.skipped.join(", ")}`);
  console.log(`Prompt:     ${d.prompt.length.toLocaleString()} characters`);
}

async function check(zoe) {
  // Start a real SDK session with streaming input that never sends a message, read the
  // initialization handshake, and confirm the session registered Zoe. No model request is made.
  let release;
  const idle = new Promise((r) => (release = r));
  async function* noMessages() { await idle; }
  const q = query({ prompt: noMessages(), options: sdkOptions(zoe) });
  const timeout = setTimeout(() => { console.error("Timed out waiting for the SDK to initialize."); q.close(); process.exit(1); }, 60_000);
  try {
    const init = await q.initializationResult();
    const found = init.agents.find((a) => a.name === AGENT_NAME);
    if (!found) throw new Error(`SDK session did not register "${AGENT_NAME}". Agents: ${init.agents.map((a) => a.name).join(", ")}`);
    console.log(`SDK session initialized; agent registered: ${found.name} (model: ${found.model ?? "default"})`);
    console.log(`Description: ${found.description}`);
  } finally {
    clearTimeout(timeout);
    release();
    q.close();
  }
}

async function ask(zoe, question) {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.CLAUDE_CODE_USE_BEDROCK && !process.env.CLAUDE_CODE_USE_VERTEX
      && !process.env.CLAUDE_CODE_USE_FOUNDRY && !process.env.CLAUDE_CODE_USE_ANTHROPIC_AWS) {
    console.error("ANTHROPIC_API_KEY is not set. Export it first (see sdk/README.md), or run with --dry-run / --check.");
    process.exit(2);
  }
  const verbose = process.env.ZOE_VERBOSE === "1";
  console.error(`Asking ${zoe.firstName}… (model: ${zoe.definition.model})\n`);
  let exitCode = 0;
  try {
    for await (const message of query({ prompt: question, options: sdkOptions(zoe) })) {
      if (verbose && message.type === "assistant") {
        for (const block of message.message?.content ?? []) {
          if (block.type === "tool_use") console.error(`  [tool] ${block.name} ${JSON.stringify(block.input).slice(0, 120)}`);
        }
      }
      if (message.type === "result") {
        if (message.subtype === "success") console.log(message.result);
        else { console.error(`Run ended without an answer: ${message.subtype}`); exitCode = 1; }
        console.error(`\n(${message.num_turns} turns, ~$${(message.total_cost_usd ?? 0).toFixed(4)})`);
      }
    }
  } catch (err) {
    console.error(`Error: ${err.message ?? err}`);
    exitCode = 1;
  }
  process.exit(exitCode);
}

// ---------- CLI ----------

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const question = args.filter((a) => !a.startsWith("--")).join(" ").trim();
const zoe = loadZoe();

if (flags.has("--help") || flags.has("-h") || (!question && !flags.has("--check") && !flags.has("--dry-run"))) {
  console.log('Usage: node ask-zoe.mjs [--dry-run] "your question"   |   node ask-zoe.mjs --check');
  process.exit(question ? 0 : 1);
} else if (flags.has("--dry-run")) {
  printSummary(zoe);
  if (question) console.log(`Question:   ${question}\n(dry run: no API call made)`);
} else if (flags.has("--check")) {
  printSummary(zoe);
  await check(zoe);
} else {
  await ask(zoe, question);
}
