// Build-time step: read the team from this repository and write two generated files.
//
//   src/generated/agents.json          PUBLIC, bundled into the browser: names, personalities, models, domains.
//   server/generated/agents-full.mjs   SERVER ONLY, bundled into the Netlify Functions: system prompts,
//                                      skills, research docs and knowledge-folder files.
//
// Sources: ../.claude/agents/*.md, ../.claude/skills/*/SKILL.md, ../knowledge/<agent>/**, ../docs/0*.md

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const WEB = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = join(WEB, "..");
const TEXT_EXT = new Set([".md", ".txt", ".csv", ".json", ".yaml", ".yml"]);
const MAX_KNOWLEDGE_CHARS = 150_000; // per agent

const DOMAINS = {
  purple: "Coordination", yellow: "Coordination", blue: "Strategy & Business", cyan: "Technical",
  orange: "Operations", green: "Finance", red: "Legal & Risk", pink: "Marketing",
};
const DOMAIN_ORDER = ["Coordination", "Strategy & Business", "Technical", "Operations", "Finance", "Legal & Risk", "Marketing"];

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
        fm[key] = fm[key] && typeof fm[key] === "object" && !Array.isArray(fm[key]) ? fm[key] : {};
        fm[key][k.trim()] = unquote(v.join(":"));
      }
      continue;
    }
    const i = raw.indexOf(":");
    key = raw.slice(0, i).trim();
    fm[key] = unquote(raw.slice(i + 1));
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
  return readdirSync(dir).sort().flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? (n === "archive" ? [] : listFiles(p)) : [p];
  });
}

const rel = (p) => relative(REPO, p).split("\\").join("/");

// ---- skills and docs ----
const skills = {};
for (const name of readdirSync(join(REPO, ".claude", "skills")).sort()) {
  const file = join(REPO, ".claude", "skills", name, "SKILL.md");
  if (existsSync(file)) skills[name] = parseFrontMatter(readFileSync(file, "utf8"), file).body;
}
const docs = {};
for (const name of readdirSync(join(REPO, "docs")).sort()) {
  if (/^0\d-.+\.md$/.test(name)) docs[name] = readFileSync(join(REPO, "docs", name), "utf8");
}
const docsCited = (text) => [...new Set([...text.matchAll(/docs\/(0\d-[a-z0-9-]+\.md)/g)].map((m) => m[1]))].filter((d) => docs[d]);

// ---- agents ----
const publicAgents = [];
const fullAgents = {};
for (const file of listFiles(join(REPO, ".claude", "agents")).filter((f) => f.endsWith(".md"))) {
  const { fm, body } = parseFrontMatter(readFileSync(file, "utf8"), file);
  const name = fm.name;
  const firstName = body.match(/Your name is \*\*([^*]+)\*\*/)?.[1] ?? name;
  const title = body.match(/You are the \*\*([^*]+)\*\*/)?.[1] ?? name;
  const voice = body.match(/\*\*Voice:\*\*\s*(.+)/)?.[1]?.trim() ?? "";
  const style = body.match(/\*\*Working style:\*\*\s*(.+)/)?.[1]?.trim() ?? "";
  const agentSkills = toList(fm.skills).filter((s) => skills[s]);

  // Research: docs the agent reads first plus docs its skills cite.
  const research = docsCited([body, ...agentSkills.map((s) => skills[s])].join("\n")).sort();

  // Knowledge folder: README + every text file, up to a size cap.
  const knowledge = [];
  let chars = 0;
  for (const kf of listFiles(join(REPO, "knowledge", name))) {
    if (!TEXT_EXT.has(extname(kf).toLowerCase())) continue;
    const text = readFileSync(kf, "utf8");
    if (chars + text.length > MAX_KNOWLEDGE_CHARS) continue;
    chars += text.length;
    knowledge.push({ path: rel(kf), text });
  }

  publicAgents.push({
    name, firstName, title, voice, style,
    description: fm.description, model: fm.model || "sonnet",
    domain: DOMAINS[fm.color] ?? "Other",
    knowledgeFiles: knowledge.filter((k) => !k.path.endsWith("/README.md")).length,
  });
  fullAgents[name] = { name, firstName, title, model: fm.model || "sonnet", body, skills: agentSkills, research, knowledge };
}

publicAgents.sort((a, b) =>
  DOMAIN_ORDER.indexOf(a.domain) - DOMAIN_ORDER.indexOf(b.domain) ||
  (a.name === "orchestrator" ? -1 : b.name === "orchestrator" ? 1 : 0) ||
  a.title.localeCompare(b.title));

if (!fullAgents.orchestrator) throw new Error("orchestrator agent not found in .claude/agents/");
for (const n of ["expert-routing", "decision-synthesis"]) if (!skills[n]) throw new Error(`skill ${n} not found`);

mkdirSync(join(WEB, "src", "generated"), { recursive: true });
mkdirSync(join(WEB, "server", "generated"), { recursive: true });
writeFileSync(join(WEB, "src", "generated", "agents.json"), JSON.stringify({ agents: publicAgents, domains: DOMAIN_ORDER }, null, 2));
// An ES module (not .json) so the same import works in Netlify's function bundler and in plain Node.
writeFileSync(join(WEB, "server", "generated", "agents-full.mjs"), "export default " + JSON.stringify({
  generatedAt: new Date().toISOString(), agents: fullAgents, skills, docs,
}) + ";\n");

// ---- research links for the Resources page: every external link cited in docs/*.md ----
const links = new Map();
for (const name of readdirSync(join(REPO, "docs")).sort().filter((n) => n.endsWith(".md"))) {
  const md = readFileSync(join(REPO, "docs", name), "utf8");
  for (const m of md.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)) {
    const [, text, url] = m;
    const entry = links.get(url) ?? { url, text: text.replace(/[*`]/g, ""), docs: [] };
    if (!entry.docs.includes(`docs/${name}`)) entry.docs.push(`docs/${name}`);
    links.set(url, entry);
  }
}
writeFileSync(join(WEB, "src", "generated", "research-links.json"), JSON.stringify([...links.values()], null, 2));

const kb = Object.values(fullAgents).reduce((n, a) => n + a.knowledge.length, 0);
console.log(`build-agents: ${publicAgents.length} agents, ${Object.keys(skills).length} skills, ${Object.keys(docs).length} research docs, ${kb} knowledge files, ${links.size} research links`);
