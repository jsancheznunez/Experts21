#!/usr/bin/env python3
"""Package one team agent as a standalone skill for upload to a Claude account (Customize > Skills).

Usage:
  python3 .claude/scripts/export_agent_skill.py creative-director [--slug zoe-creative-director]

Builds exports/<slug>/ and exports/<slug>.zip:
  SKILL.md                 front matter with only name + description (what claude.ai accepts),
                           then the agent's persona, instructions and output format, adapted to run standalone
  references/skills/       every skill the agent preloads (front matter removed)
  references/research/     the docs/ files the agent and its skills rely on
  references/knowledge/    the agent's knowledge/<agent>/ folder
"""
import argparse
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")


def split_fm(text):
    lines = text.splitlines()
    end = lines[1:].index("---") + 1
    return lines[1:end], "\n".join(lines[end + 1:]).lstrip("\n")


def fm_value(fm_lines, key):
    for line in fm_lines:
        if line.startswith(key + ":"):
            v = line.split(":", 1)[1].strip()
            return v[1:-1].replace('\\"', '"') if v.startswith('"') else v
    return None


def fm_list(fm_lines, key):
    out, on = [], False
    for line in fm_lines:
        if line.startswith(key + ":"):
            on = True
            continue
        if on:
            if line.startswith("  - "):
                out.append(line[4:].strip())
            else:
                break
    return out


def rewrite_paths(text):
    """Point docs/ and knowledge/ references at the packaged copies."""
    text = re.sub(r"`?docs/(0\d-[a-z0-9-]+\.md)`?", r"`references/research/\1`", text)
    full = {f.name[:2]: f.name for f in (ROOT / "docs").glob("0*.md")}
    text = re.sub(r"`docs/(0\d)`", lambda m: f"`references/research/{full[m.group(1)]}`", text)
    text = text.replace("`docs/`", "`references/research/`").replace("docs/ files", "research files")
    text = text.replace("your preloaded skills", "your skills (references/skills/)")
    return text


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("agent")
    ap.add_argument("--slug")
    args = ap.parse_args()

    agent_file = ROOT / ".claude" / "agents" / f"{args.agent}.md"
    fm, body = split_fm(agent_file.read_text(encoding="utf-8"))
    first = re.search(r"Your name is \*\*([^*]+)\*\*", body).group(1)
    title = re.search(r"You are the \*\*([^*]+)\*\*", body).group(1)
    slug = args.slug or f"{first.lower()}-{args.agent}"
    assert NAME_RE.match(slug) and len(slug) <= 64, slug
    skills = fm_list(fm, "skills")
    agent_desc = fm_value(fm, "description")

    out = ROOT / "exports" / slug
    if out.exists():
        for p in sorted(out.rglob("*"), reverse=True):
            p.unlink() if p.is_file() else p.rmdir()
    (out / "references" / "skills").mkdir(parents=True)
    (out / "references" / "research").mkdir(parents=True)
    (out / "references" / "knowledge").mkdir(parents=True)

    # skills
    research = set()
    for s in skills:
        _, sbody = split_fm((ROOT / ".claude" / "skills" / s / "SKILL.md").read_text(encoding="utf-8"))
        research.update(re.findall(r"docs/(0\d-[a-z0-9-]+\.md)", sbody))
        (out / "references" / "skills" / f"{s}.md").write_text(rewrite_paths(sbody), encoding="utf-8")

    # research: docs the agent reads first + docs its skills cite
    research.update(re.findall(r"docs/(0\d-[a-z0-9-]+\.md)", body))
    for d in sorted(research):
        (out / "references" / "research" / d).write_text((ROOT / "docs" / d).read_text(encoding="utf-8"), encoding="utf-8")

    # knowledge
    kdir = ROOT / "knowledge" / args.agent
    for f in sorted(kdir.rglob("*")):
        if f.is_file():
            dest = out / "references" / "knowledge" / f.relative_to(kdir)
            dest.parent.mkdir(parents=True, exist_ok=True)
            if f.suffix == ".md":
                t = re.sub(r" \(see \[[^\]]*\]\([^)]*\)\)", "", f.read_text(encoding="utf-8"))
                t = t.replace("read by the **", "read by **").replace("** agent before every answer", "** before every answer")
                dest.write_text(rewrite_paths(t), encoding="utf-8")
            else:
                dest.write_bytes(f.read_bytes())

    # adapt the agent prompt to run standalone
    b = body
    b = re.sub(r"\nYou are one of 26 domain experts\..*?\n", "", b, flags=re.S)
    b = re.sub(
        r"## Read your knowledge folder first\n.*?(?=\n## )",
        "## Read your knowledge first\n"
        "Before every answer, read the files in `references/knowledge/` (start with `README.md`, which lists what "
        "belongs there) and any documents the user has attached to the conversation. Treat them as the user's own, "
        "most specific facts: they override the general research in `references/research/` when newer. If they "
        "conflict, say so. If there are no knowledge files beyond the README and nothing is attached, write "
        "\"No knowledge files yet\" under your assumptions.\n",
        b, flags=re.S)
    b = rewrite_paths(b)
    b = b.replace("You cannot call other experts directly — list them under **Hand-offs** and say what you need from them.",
                  "You work alone here — list other specialists under **Hand-offs** and say what the user should ask them.")
    b = re.sub(r"Save (\w+) under deliverables/[\w-]+/ when asked\.",
               r"When asked, provide \1 as a file the user can download.", b)

    skill_rows = "\n".join(f"  - [`{s}`](references/skills/{s}.md)" for s in skills)
    research_rows = "\n".join(f"  - [`{d}`](references/research/{d})" for d in sorted(research))
    header = f"""# {first} — {title}

{first} is a standalone version of the **{args.agent}** expert from a Shopify dropshipping advisory team. Respond as {first}, following everything below.

## How to use your reference files
Load these as needed; they are part of you:
- **Your skills** (working methods, checklists, templates). Read the ones relevant to the request before answering:
{skill_rows}
- **Research you rely on** (dated November 2026 — verify volatile figures such as ad costs, prices and laws before relying on them):
{research_rows}
- **Your knowledge:** `references/knowledge/` plus anything the user attaches.

Your skills sometimes mention other team skills or experts (for example unit-economics, customer-personas, tracking-attribution, demand-validation, web-research). Those are not included here: use the research files for baseline numbers, ask the user for missing inputs (such as break-even ROAS or personas), and name the specialist under **Hand-offs** when their input would change your answer.

"""
    skill_md_body = header + b.strip() + "\n"

    desc = (f"{first}, a creative director for Shopify dropshipping brands. " if args.agent == "creative-director"
            else f"{first}, the {title} from a Shopify dropshipping advisory team. ")
    desc += agent_desc.replace("Use for ", "Use for ", 1)
    desc = desc.replace("<", "(").replace(">", ")")
    assert len(desc) <= 1024, len(desc)
    skill_md = "---\n" + f"name: {slug}\n" + "description: " + '"' + desc.replace('"', '\\"') + '"' + "\n---\n\n" + skill_md_body
    (out / "SKILL.md").write_text(skill_md, encoding="utf-8")

    n_lines = len(skill_md.splitlines())
    assert n_lines < 500, n_lines

    # zip with the folder at the archive root
    zpath = ROOT / "exports" / f"{slug}.zip"
    if zpath.exists():
        zpath.unlink()
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(out.rglob("*")):
            if f.is_file():
                z.write(f, f.relative_to(out.parent).as_posix())
    print(f"{zpath.relative_to(ROOT)}: {len(list(out.rglob('*.*')))} files, SKILL.md {n_lines} lines, description {len(desc)} chars")


if __name__ == "__main__":
    sys.exit(main())
