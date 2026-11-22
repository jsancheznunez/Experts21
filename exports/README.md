# Exports

Standalone skills built from team agents, ready to upload to a Claude account (**Customize → Skills → upload a skill**, choosing the `.zip`).

| File | Agent | Contents |
|---|---|---|
| `zoe-creative-director.zip` | `creative-director` (Zoe) | Persona and instructions in `SKILL.md`; 7 skills, 4 research docs and the knowledge folder under `references/` |

The unzipped folder next to each zip is the same content, for reading on GitHub.

## How to upload to claude.ai

1. **Download the zip** from GitHub: open `exports/zoe-creative-director.zip` in the repository and click **Download raw file**. Don't unzip it.
2. **Turn on code execution** (skills need it): **Settings → Capabilities → Code execution and file creation** (called **Create and edit files** in newer layouts). On Team/Enterprise plans an admin manages this in Organization settings.
3. **Upload:** **Customize → Skills → +** → create skill → **Upload a skill** → choose the `.zip`.
4. **Turn it on:** make sure the skill's toggle is on in the skills list.
5. **Use it:** start a new chat and ask for creative work, e.g. *"Zoe, write three UGC hooks and a creator brief for a waterproof dog car hammock."* Claude loads the skill when the request matches its description. You can also name it directly.

Upload checklist (the exporter already enforces it): the zip holds the skill **folder** at its root, the folder name equals the `name` in `SKILL.md`, the front matter has only `name` and `description`, and the description is at most 200 characters. Custom skills are private to your account unless an organization owner enables skill sharing.

## Rebuild or export another agent

```bash
python3 .claude/scripts/export_agent_skill.py creative-director --slug zoe-creative-director
python3 .claude/scripts/export_agent_skill.py financial-analyst     # → exports/marcus-financial-analyst.zip
```

The script copies the agent's preloaded skills, the `docs/` research files they cite and the agent's `knowledge/` folder, rewrites internal paths, and keeps only `name` and `description` in the front matter (extra keys are rejected on upload) and trims the description to the 200-character limit (or pass `--description`). Re-run it after adding files to `knowledge/<agent>/` so the export includes them.
