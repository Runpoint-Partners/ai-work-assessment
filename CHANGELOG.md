# Version history

The assessment, profile schema, and open-source helper have separate version numbers.

- **Assessment v7** is the current assessment method and prompt.
- **Profile schema v8** is the JSON format written by Assessment v6 and v7. It does not mean there is an Assessment v8.
- **Helper v7.0.2** is the current release of the optional open-source command-line tools. Patch releases fix the helper without changing the assessment method.

The generated profile records both `prompt_version` and `schema_version`. Those fields show which assessment contract produced the report.

## Assessment compatibility

| Assessment | Profile schema | Released | Status | What changed |
| --- | --- | --- | --- | --- |
| v7 | v8 | July 26, 2026 | Current | Added the optional multi-environment workflow so evidence from more than one computer can be validated and combined. |
| v6 | v8 | July 21, 2026 | Compatible | Introduced the complete fourteen-badge evidence model and the current structured profile contract. A complete v6 report remains valid. |
| v5 or earlier | v7 or earlier | Before July 21, 2026 | Update recommended | These reports use an older contract. Run Assessment v7 to get the current evidence model and output. |

If a complete v6 report covers all of your work, you do not need to rerun it. Rerun Assessment v7 when your work is spread across multiple computers or when you want the latest output.

## Open-source helper releases

| Helper release | Released | Change |
| --- | --- | --- |
| v7.0.2 | July 30, 2026 | Clarified the version contract and corrected the Assessment v7 instructions. |
| v7.0.1 | July 26, 2026 | Fixed command-line execution through package shims. |
| v7.0.0 | July 26, 2026 | Added the multi-environment evidence tools. |

The helper version follows semantic versioning. A helper patch release does not make a compatible profile stale.
