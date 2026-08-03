# Version history

The assessment, profile schema, and open-source helper have separate version numbers.

- **Assessment v8** is the current assessment method and prompt.
- **Profile schema v9** is the matching-focused JSON format written by Assessment v8.
- **Helper v8.0.0** is the current release of the open-source command-line tools and fixed renderer.

The generated profile records both `prompt_version` and `schema_version`. Those fields show which assessment contract produced the report.

## Assessment compatibility

| Assessment | Profile schema | Released | Status | What changed |
| --- | --- | --- | --- | --- |
| v8 | v9 | August 2, 2026 | Current | Replaced the dense badge map with a concise matching profile. Added source-backed industry and subject expertise, normalized Claude and Codex activity, deterministic agent-operating ratios, fixed rendering, strict privacy fields, and anti-repetition rules. |
| v7 | v8 | July 26, 2026 | Compatible | Added the optional multi-environment workflow. The report remains readable and can be updated to the current matching format. |
| v6 | v8 | July 21, 2026 | Compatible | Introduced the complete fourteen-badge evidence model. The report remains readable and can be updated to the current matching format. |
| v5 or earlier | v7 or earlier | Before July 21, 2026 | Update recommended | These reports use an older contract. Run Assessment v8 to get the current evidence and matching output. |

Compatible reports remain readable under their original rules. Run Assessment v8 when you want the current concise matching profile or when your recent work has changed.

## Open-source helper releases

| Helper release | Released | Change |
| --- | --- | --- |
| v8.0.0 | August 2, 2026 | Added schema-v9 validation and fixed rendering, vendored the current prompt and sample, and added a cross-repository release check. |
| v7.0.2 | July 30, 2026 | Clarified the version contract and corrected the Assessment v7 instructions. |
| v7.0.1 | July 26, 2026 | Fixed command-line execution through package shims. |
| v7.0.0 | July 26, 2026 | Added the multi-environment evidence tools. |

The helper version follows semantic versioning. A helper patch release does not make a compatible profile stale.
