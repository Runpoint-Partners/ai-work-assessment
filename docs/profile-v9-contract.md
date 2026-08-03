# Overflow profile schema 9 contract

Profile schema 9 separates collection, model judgment, deterministic metrics,
and display. The assessment model returns JSON. It does not author the report.

## Pipeline

1. A local collector reads the selected sources and creates privacy-safe
   evidence.
2. The assessment model forms work arcs, matching data, and concise visible
   conclusions.
3. `profile-renderer.mjs validate` checks the contract, evidence references,
   word budgets, duplicate claims, and deterministic arithmetic.
4. `profile-renderer.mjs render` applies the fixed Overflow template.
5. The server adds compatible cohort distributions after a reviewed profile is
   submitted.

## Three data layers

`evidence_index` is the claim ledger. Each privacy-safe record has a stable ID,
source, kind, summary, date window, and related work arcs. Every visible claim
must cite one or more of these IDs.

`from` and `to` are optional when a generalized career or limitation record has
no defensible calendar window. When present, each date must be valid and ordered.

`matching_index` is exhaustive machine-readable matching data. It keeps
industries, capabilities, delivery states, and risk gaps even when the public
page does not show them.

`profile_view` is the only source for visible narrative copy. It contains the
hero, agent footprint, agent practice, industries, subject matter, matching
conclusions, and limits. It has strict item and word budgets.

Rich schema-v8 fields remain available for compatibility and server matching:
`skills`, `work_arcs`, `activity_analysis`, `agent_practice`, `domain_stamps`,
`github`, `working_style`, `interaction_profile`, `project_role`,
`project_match`, and `limits`.

Work arcs also carry `verification_mode: independent|self-check|unclear`. This supports a visible verification ratio without treating a successful-looking implementation as an independent check.

## Visible contract

```text
profile_view
  hero
    thesis
    source_note
    evidence_ids[]
  agent_footprint
    normalized_mix
      from
      to
      calendar_days
      total_sessions
      items[] { source, sessions, share, sessions_per_calendar_day }
      limitations
      evidence_ids[]
  agent_practice
    role { summary, evidence_ids[] }
    statistics[1..3] { tag, label, value, source_field, evidence_ids[] }
    workflow[4] { label, summary, evidence_ids[] }
    distinctive_fact { summary, evidence_ids[] }
    reusable_system { summary, evidence_ids[] }
    limitation { summary, evidence_ids[] }
  industries[3..5]
    { tag, label, context, career_context, observed_work, depth, sources[], evidence_ids[] }
  subject_matter[3..5]
    { tag, label, summary, evidence_label, evidence_ids[] }
  matching
    strongest_fit { label, summary, evidence_ids[] }
    add_specialist { label, summary, evidence_ids[] }
    not_shown { label, summary, evidence_ids[] }
  limits[2..4]
    { summary, evidence_ids[] }
```

## Deterministic ownership

The model does not calculate or invent these values:

- source session counts;
- retained date windows;
- exact-duplicate removal;
- the shared Claude/Codex calendar window;
- session-record share and sessions per calendar day;
- cohort counts, medians, percentiles, and distribution curves;
- copy-budget, evidence-reference, and duplicate-claim validation;
- HTML, CSS, charts, upload behavior, and responsive rendering.

The renderer also owns these agent-operating ratios:

- same-source subagent sessions divided by scanned sessions;
- multi-session active days divided by covered active days;
- owned live or operating work arcs divided by qualifying work arcs;
- independently verified work arcs divided by classified work arcs;
- primary work-surface and change-type counts across qualifying work arcs.

Every ratio retains its numerator, denominator, and coverage basis. An unsupported ratio is omitted. `reviewer_governor` can support a review-governance ratio, but it cannot be labeled independent verification.

Every visible agent-practice statistic must contain a finite non-negative
numeric `value` and an allow-listed JSON Pointer in `source_field`. The pointer
must resolve to the same value in the schema-9 payload. Allowed roots are
`/activity_analysis/coverage/`, `/activity_analysis/concurrency/`,
`/activity_analysis/context_pressure/`, `/agent_practice/tool_call_coverage/`,
`/agent_practice/tool_categories/`, `/agent_practice/reusable_assets/`, and
`/cadence/`. The model selects a useful field and label. It does not calculate,
round, format, estimate, or free-type the number.

The normalized Claude/Codex mix uses the exact overlapping calendar window.
Only interactive top-level session records in that window count. Scheduled
runs, subagents, prompt-log entries, model-switch duplicates, and records
outside the shared window do not count. The visible label must say that it is
session-record share. It cannot imply time spent, preference, quality, or
completed work.

`activity_analysis.coverage.shared_window_sessions` is the deterministic ledger
for this comparison. It contains exactly two rows:

```json
[
  { "source": "claude", "from": "YYYY-MM-DD", "to": "YYYY-MM-DD", "sessions": 0 },
  { "source": "codex", "from": "YYYY-MM-DD", "to": "YYYY-MM-DD", "sessions": 0 }
]
```

Both rows use the same inclusive dates. `profile_view.agent_footprint.normalized_mix`
must copy those dates and source counts exactly. Its `calendar_days`,
`total_sessions`, source shares, and sessions per calendar day are deterministic
derivatives of the two ledger rows. Validation rejects missing sources,
different row windows, count differences, and arithmetic differences.

The local collector produces this ledger from readable session records.
Validators enforce internal consistency between the ledger, normalized mix,
and visible arithmetic. Overflow does not authenticate counts against raw local
history because raw sessions and transcripts are not uploaded.

If the retained Claude and Codex windows do not overlap, use this exact shape:

```json
{
  "activity_analysis": {
    "coverage": { "shared_window_sessions": [] }
  },
  "profile_view": {
    "agent_footprint": { "normalized_mix": null }
  }
}
```

Do not send `{}`, one ledger row, zero-filled rows, placeholder dates, or an
estimated ratio. The fixed renderer uses the null mix and empty ledger to show
the upload and coverage placeholder.

## Synthesis ownership

The model owns claims that require language or judgment:

- coherent work arcs and authorship mode;
- the distinguishing thesis;
- how the person frames, divides, verifies, recovers, and reuses agent controls;
- holistic industry depth from career context and observed work;
- subject-matter expertise;
- strongest fit, specialist need, unsupported work, and material limits.

## Anti-slop constraints

- No visible badge cards or star ratings.
- No generic tool ledger.
- No resume timeline.
- No repeated claim or paraphrased conclusion.
- No industry claim based only on a company name.
- No agent-practice claim based only on code editing or filesystem use.
- No visible claim without evidence IDs.
- No local estimate of cohort placement.

## Privacy boundary

Schema 9 retains generalized, source-labeled synthesis from an opted-in
LinkedIn profile. This includes broad industry context, subject matter, role
framing, and career duration when they improve matching.

Schema 9 must not contain raw LinkedIn profile data, employer or organization
names, job titles, schools, profile URLs, contact details, raw career
descriptions, or a career timeline. The only identifying fields allowed in the
payload are the public profile `name` and an optional server-issued `slug`.

The same boundary applies to technical sources. The payload must not contain
raw prompts, transcript excerpts, tool output, file contents, credentials,
tokens, user or machine paths, private URLs, repository names, organization
names, collaborator names, client names, email addresses, or bundle correlation
keys. Evidence summaries must use privacy-safe abstractions.

Evidence IDs are opaque references. They match `^ev-[0-9]{3,12}$` and cannot
encode a source, person, employer, project, capability, or date. Sequential IDs
such as `ev-001` are valid. Semantic IDs such as `ev-linkedin` are invalid.

For every value in a visible `sources` array, the same object's `evidence_ids`
must include at least one evidence record with the matching `source`. This
prevents a visible LinkedIn marker from being backed only by session evidence,
or a session marker from being backed only by assessment synthesis. Claude and
Codex labels in the normalized mix are collector harnesses, not visible
evidence-source declarations.

## Local renderer interface

Download both public modules into one directory:

```sh
curl -fsS https://austin.overflowbuilders.com/apply/profile-renderer.mjs -o profile-renderer.mjs
curl -fsS https://austin.overflowbuilders.com/apply/profile-template.mjs -o profile-template.mjs
node profile-renderer.mjs validate profile.json
node profile-renderer.mjs render profile.json --out project-fit-{slug}.html
```

Validation and rendering make no upload request. A user must review the local
page, choose visibility, and consent before submission. The payload already
excludes raw LinkedIn profile data. It retains the generalized, source-labeled
industry synthesis used for matching.

## Migration notes

- Set `schema_version` to `9` and `prompt_version` to `8`.
- Populate `activity_analysis.coverage.shared_window_sessions` before synthesis.
  The visible normalized mix mirrors it and cannot supply independent counts.
- When no overlap exists, use an empty shared-window ledger and a null normalized
  mix. The renderer owns the coverage placeholder.
- Keep `focus` and `headline` equal to the hero thesis for older readers.
- Keep the bundle schema at version 1. The v8.0.0 environment ID,
  validation, and consolidation commands remain compatible.
- Do not emit the legacy `career` object for schema 9.
- Stop reading visible copy from legacy badges, tools, career timeline, or
  domain stamps. Read it only from `profile_view`.
- Continue using rich legacy fields and `matching_index` for private matching.
