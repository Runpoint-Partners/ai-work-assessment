# Version history

The assessment, profile schema, and open-source helper have separate version numbers.

- **Assessment v9** is the current assessment method and prompt.
- **Profile schema v10** is the JSON format written by Assessment v9.
- **Helper v9.0.0** is the current release of the open-source command-line tools and fixed renderer.

The generated profile records both `prompt_version` and `schema_version`. Those fields show which assessment contract produced the report.

## Assessment compatibility

| Assessment | Profile schema | Released | Status | What changed |
| --- | --- | --- | --- | --- |
| v9 | v10 | Unreleased | Current | Added a coding and other work view counted from session tool records, a setup footprint from reusable skills, MCPs, hooks, and other assets, a work context on each work arc, and a side-projects claim from personal or open-source work that never names a project. Sessions without tool records stay unclassified. A profile from only Claude Code or only Codex now validates. |
| v8 | v9 | August 2, 2026 | Compatible | Replaced the dense badge map with a concise matching profile. Added source-backed industry and subject expertise, normalized Claude and Codex activity, deterministic agent-operating ratios, fixed rendering, strict privacy fields, and anti-repetition rules. |
| v7 | v8 | July 26, 2026 | Compatible | Added the optional multi-environment workflow. The report remains readable and can be updated to the current matching format. |
| v6 | v8 | July 21, 2026 | Compatible | Introduced the complete fourteen-badge evidence model. The report remains readable and can be updated to the current matching format. |
| v5 or earlier | v7 or earlier | Before July 21, 2026 | Update recommended | These reports use an older contract. Run Assessment v9 to get the current evidence and matching output. |

Compatible reports remain readable under their original rules. Run Assessment v9 when you want the coding mix, setup footprint, and side projects, or when your recent work has changed.

## Open-source helper releases

| Helper release | Released | Change |
| --- | --- | --- |
| v9.0.0 | Unreleased | Added schema-v10 validation and rendering, vendored the Assessment v9 prompt, contract, and sample, and added the coding mix, setup footprint, and side projects to the `validate` report. Profiles from only Claude Code or only Codex now validate, under schema-v9 rules as well as v10, when the missing tool is absent everywhere; `validate` names the one tool. Multi-environment bundles carry the new per-session fields inside `observations`; the bundle schema is unchanged. |
| v8.0.0 | August 2, 2026 | Added schema-v9 validation and fixed rendering, vendored the current prompt and sample, and added a cross-repository release check. |
| v7.0.2 | July 30, 2026 | Clarified the version contract and corrected the Assessment v7 instructions. |
| v7.0.1 | July 26, 2026 | Fixed command-line execution through package shims. |
| v7.0.0 | July 26, 2026 | Added the multi-environment evidence tools. |

The helper version follows semantic versioning. A helper patch release does not make a compatible profile stale.
