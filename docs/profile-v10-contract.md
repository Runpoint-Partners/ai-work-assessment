# Overflow profile schema 10 contract (draft)

Draft for review. Nothing here ships until the release sequence in
`docs/assessment-release-process.md` runs. Schema 10 extends schema 9 and
changes nothing in it. Read `docs/profile-v9-contract.md` first.

Versions at release: assessment prompt 9, profile schema 10, helper 9.0.0.
`minimumCompatiblePromptVersion` stays 6, so schema 9 profiles stay readable
under their original rules.

## Why

From the Oct 6 call and Oct 9 email with Sam. The profile should help people
send work to each other and stay worth re-running:

1. How complex someone's setup is: a stock harness, or a customized one.
2. How much of their agent use is coding, and how much is other work.
3. Their personal projects, which show whether someone cares how things turn out.
4. What work they can take and what work they're looking for.

Items 1 to 3 belong in the assessment. Item 4 does not. See "Outside the
assessment" below.

## 1. Setup footprint (deterministic)

Schema 9 already records each reusable asset in
`agent_practice.reusable_assets[]` with a `kind` (`skill`, `command`, `mcp`,
`hook`, `automation`, `agent-template`, `eval`) and a `relationship` (`used`,
`adapted`, `created`). Schema 10 adds one collector ledger so asset use can
be read as a share of sessions:

```text
agent_practice
  reusable_asset_coverage
    sessions_scanned          integer, the classified sessions: work_mix coding + other
    sessions_using_assets     integer, those sessions that invoked at least one listed asset
    limitations[]
```

The renderer derives the visible setup footprint. The model writes none of it:

- distinct assets by kind, and how many the person created or adapted;
- the share of sessions that used any asset (`sessions_using_assets / sessions_scanned`);
- a placement band from the distinct-asset count: `stock` (0), `light` (1 to 3),
  `customized` (4 to 10), `extensive` (11 or more).

The band describes the setup, not skill. Visible copy must not rank a
customized setup above a stock one. The Oct 6 call made the point that
heavy tinkerers often do no better than people on a stock setup.

Validation:

- `sessions_using_assets <= sessions_scanned`;
- `sessions_scanned` equals `work_mix.coding_sessions + work_mix.other_sessions`, the
  only interactive sessions whose tool calls were read;
- every asset with `active_sessions > 0` implies `sessions_using_assets > 0`;
- `/agent_practice/reusable_asset_coverage/` joins the allow-listed statistic roots.

## 2. Coding and other work (deterministic counts, model kinds)

New collector ledger:

```text
activity_analysis
  work_mix
    method                    "code-change tool calls per interactive session"
    interactive_sessions      integer, equals activity_analysis.coverage.interactive_sessions
    coding_sessions           sessions with at least one code-change tool call
    other_sessions            sessions with tool metadata and no code-change call
    unclassified_sessions     sessions without enough tool metadata
    other_kinds[]             { tag, sessions }
                              tag: research | writing | planning | data-analysis |
                                   operations | design | other
    limitations[]
```

The classification is mechanical. A session counts as coding when its
metadata ledger shows a file-edit or file-write call on source code. The
collector counts sessions, and the model never estimates a share.
`other_kinds` takes judgment, so the model may assign those tags. The counts
still come from per-session labels, not a guess.

Validation:

- `coding_sessions + other_sessions + unclassified_sessions == interactive_sessions`;
- `coding_sessions + other_sessions` does not exceed the sum of
  `agent_practice.tool_call_coverage[].sessions_with_tool_metadata`, because a session
  without tool metadata is always unclassified;
- the `other_kinds[].sessions` values sum to `other_sessions`, with each tag at most once;
- `interactive_sessions` equals `activity_analysis.coverage.interactive_sessions`.

The renderer adds a "Coding and other work" bar to the agent footprint. It
shows coding and other work as shares of the classified sessions, other work
by kind, and a note counting the unclassified sessions it leaves out. It is labeled as a share of
session records, like the normalized mix. It must not imply time spent or
quality.

## 3. Personal projects (new work-arc axis, one visible claim)

Every work arc gets one more axis:

- `work_context`: `client`, `employer`, `personal`, `open-source`, or `unclear`

`personal` requires evidence that the person chose the problem for themselves.
A greenfield repository alone does not count. Missing or ambiguous evidence is
`unclear`.

One visible claim, which is null when no arc is `personal`:

```text
profile_view
  side_projects               null | { summary, evidence_ids[] }   summary 30 words
```

The renderer shows the personal-arc count and their delivery states next to
the summary. The summary describes what the work shows, such as care for
the user-facing result, finishing, or taking a project to live use. It must not
name a project, repository, product, or URL. The schema 9 privacy boundary is
unchanged.

Validation:

- `side_projects` is null exactly when no arc has `work_context: personal`;
- `side_projects.evidence_ids` must include a `work-arc` record for a personal arc;
- the word budget and repeated-copy checks cover it like any other claim.

Links to personal projects stay out of the payload. People add them on the
site. See below.

## Cohort comparison (server-owned)

Sam wanted the profile to stay useful after the first run. After upload, the
server adds cohort distributions for three new values: distinct asset count,
asset-session share, and coding share. They use the same privacy floor and
compatibility rules as the existing benchmark curves in
`functions/api/_profile_benchmark.js`. No placement is estimated locally.

## Outside the assessment

These are site features, not contract fields. They ship separately:

- **Work I can take / work I'm looking for.** This is a statement the person
  makes about themselves, so the model must not infer it. The person sets it on the
  profile dashboard, and it's stored in `supply_availability` with its expiry. The
  served profile shows it. That table is an OS2 projection today, so writes go
  through OS2 like other practitioner data.
- **Personal project links.** Up to three public links with one line each,
  added by the person on the profile dashboard and shown next to
  `side_projects`. The server checks that each one is a public URL.

## Compatibility

- Schema 9 payloads validate under schema 9 rules, unchanged.
- Schema 10 requires every field above. Use empty ledgers or `null` where
  the evidence is missing, never zero-filled placeholders. The rule matches
  the schema 9 normalized mix.
- Older readers ignore the new fields. `focus` and `headline` still mirror the
  hero thesis.

## Implementation order

1. This draft, reviewed.
2. Server validator and sanitizer (`functions/api/_assessment_validate.js`):
   raw schema 10 checks, keep the new fields, and the allow-listed statistic root.
3. Public renderer validator (`public/apply/profile-renderer.mjs`): the same checks.
4. Template (`public/apply/profile-template.mjs`): setup footprint,
   coding and other work, and side projects.
5. Contract bump to prompt 9, schema 10, helper 9.0.0, with freshness rules
   that keep schema 9 compatible. Then the prompt (`public/apply/prompt.md`),
   collector (`public/apply/collect.md`), and report (`public/apply/report.md`):
   the per-session `code_change`, `assets_used`, and `other_kind` fields, the
   two ledgers, `work_context`, and `side_projects`, with budgets. Multi-environment
   bundles carry the per-session fields inside `observations`, so the bundle
   schema stays at version 1.
6. Golden fixture and sample (`scripts/fixtures/profile-v10.golden.json`,
   `npm run assessment:sample`), plus tests.
7. The open-source sync and release steps. The collector and report point to
   helper tag `v9.0.0`, so the website must not ship before that tag exists.

## Open questions

- Band thresholds: are 0, 1 to 3, 4 to 10, and 11+ distinct assets the right cut points?
- Should `work_context: client` and `employer` stay separate, or merge into `paid`?
- Should the side-projects summary appear when only `open-source` arcs exist,
  or only for `personal`?
