#!/usr/bin/env python3
"""Validate the expert team in .claude/agents and .claude/skills.

Checks frontmatter, naming, agent -> skill wiring, routing-table coverage and
size limits taken from the Claude Code subagent and skill docs.

Usage:
  python3 .claude/scripts/validate_team.py          # validate, exit 1 on errors
  python3 .claude/scripts/validate_team.py --map    # also print skill -> agents map
No third-party dependencies.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AGENTS_DIR = ROOT / ".claude" / "agents"
SKILLS_DIR = ROOT / ".claude" / "skills"
ROUTING = SKILLS_DIR / "expert-routing" / "SKILL.md"

NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
KNOWN_TOOLS = {
    "Agent", "Bash", "Edit", "Glob", "Grep", "NotebookEdit", "Read", "Skill",
    "TodoWrite", "WebFetch", "WebSearch", "Write", "SendMessage",
}
AGENT_FIELDS = {
    "name", "description", "tools", "disallowedTools", "model", "permissionMode",
    "maxTurns", "autoCompactWindow", "skills", "mcpServers", "hooks", "memory",
    "background", "omitClaudeMd", "effort", "isolation", "color", "initialPrompt",
    "experimental",
}
SKILL_FIELDS = {
    "name", "description", "when_to_use", "argument-hint", "arguments",
    "disable-model-invocation", "user-invocable", "allowed-tools", "disallowed-tools",
    "model", "effort", "context", "agent", "background", "hooks", "paths", "shell",
    "metadata", "license", "compatibility",
}
COLORS = {"red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"}
MODELS = {"opus", "sonnet", "haiku", "fable", "inherit"}
MIN_AGENTS, MAX_AGENTS = 10, 50

errors, warnings = [], []


def parse_frontmatter(path):
    """Minimal YAML frontmatter parser: scalars, block lists, one-level maps."""
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        errors.append(f"{rel(path)}: opening '---' must be the first line")
        return {}, text
    try:
        end = lines[1:].index("---") + 1
    except ValueError:
        errors.append(f"{rel(path)}: missing closing '---'")
        return {}, text
    fm_text = "\n".join(lines[1:end])
    try:  # strict check with PyYAML when available: Claude Code skips agents whose YAML does not parse
        import yaml
        try:
            yaml.safe_load(fm_text)
        except yaml.YAMLError as exc:
            errors.append(f"{rel(path)}: frontmatter is not valid YAML ({str(exc).splitlines()[0]}); quote values containing ': '")
    except ImportError:
        for raw in lines[1:end]:
            if not raw.startswith((" ", "\t")) and ":" in raw:
                v = raw.split(":", 1)[1].strip()
                if v and v[0] not in "\"'[{|>" and ": " in v:
                    errors.append(f"{rel(path)}: unquoted value contains ': ' (invalid YAML); wrap it in quotes")
    data, key = {}, None
    for raw in lines[1:end]:
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        if raw.startswith((" ", "\t")):
            item = raw.strip()
            if key is None:
                continue
            if item.startswith("- "):
                if not isinstance(data[key], list):
                    data[key] = []
                data[key].append(item[2:].strip().strip("'\""))
            elif ":" in item:
                if not isinstance(data[key], dict):
                    data[key] = {}
                k, v = item.split(":", 1)
                data[key][k.strip()] = v.strip().strip("'\"")
            continue
        if ":" not in raw:
            errors.append(f"{rel(path)}: cannot parse frontmatter line: {raw!r}")
            continue
        k, v = raw.split(":", 1)
        key, v = k.strip(), v.strip()
        if len(v) >= 2 and v[0] == v[-1] == '"':
            v = v[1:-1].replace('\\"', '"')
        data[key] = v.strip("'\"") if v else ""
    body = "\n".join(lines[end + 1:])
    return data, body


def rel(p):
    return p.relative_to(ROOT).as_posix()


def as_list(value):
    if isinstance(value, list):
        return value
    if not value:
        return []
    return [v.strip() for v in str(value).split(",") if v.strip()]


def load_skills():
    skills = {}
    if not SKILLS_DIR.is_dir():
        errors.append(".claude/skills/ not found")
        return skills
    for d in sorted(p for p in SKILLS_DIR.iterdir() if p.is_dir()):
        f = d / "SKILL.md"
        if not f.is_file():
            warnings.append(f"{rel(d)}: no SKILL.md (ignored)")
            continue
        fm, body = parse_frontmatter(f)
        name = fm.get("name", d.name)
        for k in fm:
            if k not in SKILL_FIELDS:
                warnings.append(f"{rel(f)}: unknown field '{k}' (Claude Code ignores it)")
        if name != d.name:
            errors.append(f"{rel(f)}: name '{name}' must match folder '{d.name}'")
        if not NAME_RE.match(d.name):
            errors.append(f"{rel(f)}: folder name must be lowercase-hyphenated")
        desc = fm.get("description", "") + " " + fm.get("when_to_use", "")
        if not fm.get("description"):
            errors.append(f"{rel(f)}: missing description")
        if len(desc.strip()) > 1536:
            errors.append(f"{rel(f)}: description + when_to_use > 1536 chars")
        if "<" in desc or ">" in desc:
            errors.append(f"{rel(f)}: description must not contain < or >")
        n_lines = len(f.read_text(encoding="utf-8").splitlines())
        if n_lines > 500:
            warnings.append(f"{rel(f)}: {n_lines} lines (docs recommend < 500)")
        skills[d.name] = {
            "file": f,
            "id": (fm.get("metadata") or {}).get("id") if isinstance(fm.get("metadata"), dict) else None,
            "no_model": str(fm.get("disable-model-invocation", "")).lower() in {"true", "yes", "on", "1"},
        }
    ids = [s["id"] for s in skills.values() if s["id"]]
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        errors.append(f"duplicate skill metadata ids: {sorted(dup)}")
    return skills


def load_agents(skills):
    agents = {}
    persona_names = {}
    if not AGENTS_DIR.is_dir():
        errors.append(".claude/agents/ not found")
        return agents
    for f in sorted(AGENTS_DIR.rglob("*.md")):
        fm, body = parse_frontmatter(f)
        name = fm.get("name")
        if not name:
            errors.append(f"{rel(f)}: missing name")
            continue
        if not NAME_RE.match(name):
            errors.append(f"{rel(f)}: name '{name}' must be lowercase-hyphenated")
        if name in agents:
            errors.append(f"{rel(f)}: duplicate agent name '{name}'")
        if f.stem != name:
            warnings.append(f"{rel(f)}: filename differs from name '{name}'")
        if not fm.get("description"):
            errors.append(f"{rel(f)}: missing description")
        for k in fm:
            if k not in AGENT_FIELDS:
                warnings.append(f"{rel(f)}: unknown field '{k}' (Claude Code ignores it)")
        tools = as_list(fm.get("tools"))
        for t in tools:
            base = t.split("(")[0]
            if base not in KNOWN_TOOLS and not base.startswith("mcp__"):
                warnings.append(f"{rel(f)}: unrecognized tool '{t}'")
        color = fm.get("color")
        if color and color not in COLORS:
            errors.append(f"{rel(f)}: invalid color '{color}'")
        model = fm.get("model")
        if not model:
            errors.append(f"{rel(f)}: missing model (set opus, sonnet or haiku; see docs/agent-brains.md)")
        elif model not in MODELS and not model.startswith("claude-"):
            errors.append(f"{rel(f)}: unrecognized model '{model}'")
        kdir = ROOT / "knowledge" / name
        if not (kdir / "README.md").is_file():
            errors.append(f"{rel(f)}: missing knowledge folder README at knowledge/{name}/README.md")
        if f"knowledge/{name}/" not in body:
            errors.append(f"{rel(f)}: prompt does not tell the agent to read knowledge/{name}/")
        m = re.search(r"Your name is \*\*([^*]+)\*\*", body)
        if not m:
            errors.append(f"{rel(f)}: missing 'Who you are' personality (Your name is **Name**)")
        else:
            persona_names.setdefault(m.group(1), []).append(name)
        agent_skills = as_list(fm.get("skills"))
        if len(agent_skills) > 32:
            errors.append(f"{rel(f)}: more than 32 skills (only the first 32 load)")
        for s in agent_skills:
            if s not in skills:
                errors.append(f"{rel(f)}: skill '{s}' does not exist in .claude/skills/")
            elif skills[s]["no_model"]:
                errors.append(f"{rel(f)}: skill '{s}' has disable-model-invocation and cannot be preloaded")
        if not body.strip():
            errors.append(f"{rel(f)}: empty system prompt body")
        agents[name] = {"file": f, "skills": agent_skills, "tools": tools}
    for first, owners in persona_names.items():
        if len(owners) > 1:
            errors.append(f"first name '{first}' is used by several agents: {', '.join(owners)}")
    brains = ROOT / "docs" / "agent-brains.md"
    if brains.is_file():
        text = brains.read_text(encoding="utf-8")
        for name in agents:
            if f"`{name}`" not in text:
                warnings.append(f"agent '{name}' is missing from docs/agent-brains.md")
    n = len(agents)
    if not MIN_AGENTS <= n <= MAX_AGENTS:
        errors.append(f"team has {n} agents; target range is {MIN_AGENTS}-{MAX_AGENTS}")
    return agents


def check_routing(agents):
    if not ROUTING.is_file():
        warnings.append("expert-routing skill not found; routing coverage not checked")
        return
    text = ROUTING.read_text(encoding="utf-8")
    listed = set(re.findall(r"^\|\s*([a-z][a-z0-9-]*)\s*\|", text, flags=re.M))
    for name in agents:
        if name != "orchestrator" and name not in listed:
            errors.append(f"agent '{name}' is missing from the expert-routing table")
    for name in listed:
        if name not in agents:
            errors.append(f"expert-routing lists '{name}' but no such agent exists")


def main():
    skills = load_skills()
    agents = load_agents(skills)
    check_routing(agents)
    used = {}
    for a, info in agents.items():
        for s in info["skills"]:
            used.setdefault(s, []).append(a)
    for s in skills:
        if s not in used:
            warnings.append(f"skill '{s}' is not preloaded by any agent")
    delegators = [a for a, i in agents.items() if "Agent" in i["tools"]]

    print(f"Agents: {len(agents)}  Skills: {len(skills)}  Delegating agents: {', '.join(delegators) or 'none'}")
    if "--map" in sys.argv:
        print("\nSkill -> agents")
        for s in sorted(skills, key=lambda k: (skills[k]["id"] or "", k)):
            print(f"  {skills[s]['id'] or '-':4} {s:28} ({len(used.get(s, []))}) {', '.join(used.get(s, []))}")
    for w in warnings:
        print(f"WARN  {w}")
    for e in errors:
        print(f"ERROR {e}")
    print("OK" if not errors else f"{len(errors)} error(s)")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
