# Exports

Standalone skills built from team agents, ready to upload to a Claude account (**Customize → Skills → upload a skill**, choosing the `.zip`).

| File | Agent | Contents |
|---|---|---|
| `zoe-creative-director.zip` | `creative-director` (Zoe) | Persona and instructions in `SKILL.md`; 7 skills, 4 research docs and the knowledge folder under `references/` |

The unzipped folder next to each zip is the same content, for reading on GitHub.

## Rebuild or export another agent

```bash
python3 .claude/scripts/export_agent_skill.py creative-director --slug zoe-creative-director
python3 .claude/scripts/export_agent_skill.py financial-analyst     # → exports/marcus-financial-analyst.zip
```

The script copies the agent's preloaded skills, the `docs/` research files they cite and the agent's `knowledge/` folder, rewrites internal paths, and keeps only `name` and `description` in the front matter (extra keys are rejected on upload). Re-run it after adding files to `knowledge/<agent>/` so the export includes them.
