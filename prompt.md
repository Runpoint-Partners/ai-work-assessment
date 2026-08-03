# Overflow AI Work Assessment v8

Build one concise, evidence-based work profile for the person who runs this prompt. Use only the source families selected for this run:

1. readable local AI coding-agent history;
2. the person's authenticated GitHub account;
3. LinkedIn career history when the person explicitly opts in.

A configured copy can begin with a `Source choices for this run` block. Treat that block as authoritative. Inspect only sources marked `include`. Do not inspect, request, or mention sources marked `omit`. `claude` includes Claude Code, Cowork, and desktop-launched Claude sessions. `other_local` includes readable history from Cursor, Gemini CLI, Pi, opencode, aider, and local-model runtimes.

Your job is evidence extraction and synthesis. Produce structured JSON only.
Deterministic local code calculates counts, coverage windows, the matched-window
Claude/Codex mix, and duplicate checks. Deterministic server code calculates
cohort statistics after submission. The fixed Overflow renderer creates the
review page. Do not write HTML, CSS, JavaScript, SVG, charts, upload forms, or
cohort curves.

The output contract is profile schema 9 and prompt version 8.

## Start with a short disclosure

Before you inspect anything, tell the user in 4 to 7 plain sentences:

- which selected local agent histories you will analyze;
- that GitHub access is read-only through their existing authenticated account;
- that LinkedIn is optional and is used only as separately labeled career context;
- that extraction and profile generation happen locally;
- that identifying private-project information is abstracted during extraction;
- that local retention and account visibility limit what the evidence can establish;
- that nothing is uploaded automatically.

If there is no source-choice block, ask exactly:

> Include LinkedIn career history? **Recommended, but optional.** Reply `yes - <your LinkedIn URL>` to include it, or `no` to build the profile from local sessions and GitHub only.

If LinkedIn is included without a URL, ask only for the URL. Do not ask the user to reconsider an omitted source. Ask for help only at a genuine sign-in, SSO, MFA, passkey, or account-identity boundary.

## What the assessment must answer

The reader is matching this person to a community, team, or project. Identify:

- what distinguishes this person's work from ordinary coding-agent use;
- what they repeatedly build, change, operate, or repair;
- how they use agents to frame, decompose, parallelize, verify, recover, and preserve reusable controls;
- which technical capabilities are demonstrated and how the work was authored;
- which industries and subject-matter areas are supported by career context, observed work, or both;
- where the evidence is strong, where a specialist should join, and what is not established.

Do not infer a release from the existence of a session. Use `implemented`, `worked on`, `debugged`, `operated`, or `directed` unless merge, deployment, release, adoption, or live operation is directly established.

## Hard rules

1. Every capability claim must trace to observed evidence.
2. Volume describes activity. It does not measure talent, seniority, or quality.
3. Distinguish direct implementation, agent-directed and reviewed work, mixed work, and unclear authorship.
4. Local sessions support recent working behavior. GitHub supports longitudinal activity and collaboration. LinkedIn supports self-reported career context. Keep these boundaries visible in the data.
5. Industry assessment must be holistic. Combine LinkedIn career context with observed agent work when both exist. Do not turn the result into a resume timeline.
6. Describe agent use through role, decomposition, parallelism, verification, recovery, and reusable controls. `Code editing`, `filesystem`, `GitHub`, and similar universal tools are not visible differentiators.
7. Do not create visible badge cards, star ratings, a generic tool ledger, an employer chronology, or a list of every technology touched.
8. Do not assign an overall score, rank, percentile, or cohort placement. Cohort curves and comparisons are server-owned after submission.
9. Preserve negative evidence and uncertainty. An omitted source is a user choice, not evidence of missing ability.
10. Abstract client, employer, project, product, colleague, repository, and
organization names during extraction. Schema 9 keeps only generalized LinkedIn
synthesis. It must not contain a LinkedIn profile dump, employer or organization
names, job titles, profile URLs, contact details, raw career descriptions, or a
career timeline. Only the explicit public identity fields `name` and an optional
server-issued `slug` can identify the profile owner. Never store credentials,
tokens, private paths or URLs, raw prompts, transcript excerpts, or file contents
in the schema-9 JSON.
11. Do not inspect hidden reasoning, system messages, developer messages, injected instructions, or private chain-of-thought. Use visible conversational behavior only.
12. Do not repeat a visible claim. Each conclusion gets one home in `profile_view`.
13. Every visible claim must cite one or more `evidence_index` IDs.
14. Use ASD-STE100 as a clarity guide. Use short sentences, active voice, stable terms, and common words. Do not use formal dictionary restrictions unless requested.

## 1. Inventory selected local evidence

Inspect only selected source families. Primary stores are:

- Claude Code: `~/.claude/projects/*/*.jsonl`
- Codex CLI/Desktop: `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl`
- Cowork metadata on macOS: `~/Library/Application Support/Claude/local-agent-mode-sessions/**/local_*.json`
- Claude desktop-launched Code metadata: `~/Library/Application Support/Claude/claude-code-sessions/**/*.json`

Claude desktop metadata can point to a transcript already stored under `~/.claude/projects`. Use it for attribution and count the session once.

When Claude is included, inspect `~/.claude/history.jsonl` and `~/.claude/file-history/` when present. Treat prompt-log records as timeline evidence only. They can extend cadence and project-span coverage. They cannot raise implementation depth, delivery state, or capability on their own. Never quote prompt text.

Check other selected local agents on a best-effort basis. Installed software is not evidence of use.

Use a local script to inventory session count, total size, date range, distinct privacy-safe projects, and unknown-project count. If fewer than five usable sessions exist, stop and explain that the retained evidence is too small.

## 2. Collect authenticated GitHub context

Skip GitHub completely when it is omitted. Otherwise use only the existing authenticated `gh` session. Start with:

```sh
gh auth status
gh api user
```

Never print, copy, summarize, or persist the token. Make no mutations. Do not clone repositories for this assessment.

If authentication is unavailable, ask the user to run `gh auth login`. Continue with GitHub marked `unavailable` if they decline.

Collect and keep separate:

- indexed authored commits from authenticated commit search, including bounded annual and trailing-12-month counts;
- contribution-graph qualifying commits, with GitHub's eligibility definition;
- authored pull requests, authored issues, and reviewed pull requests when available;
- active years and months, first and last observed contribution dates, and recent activity;
- accessible repository coverage, language exposure, repeat work, maintenance span, releases, merges, and review activity when visible.

Search enumeration can be capped. Never infer a complete repository census from truncated results. Compare annual indexed-authored counts with contribution-graph counts before drawing a continuity conclusion. Contribution volume cannot establish skill depth.

Discard private repository names, organization names, URLs, collaborator identities, commit messages, issue text, and pull-request text after local aggregation. Record collection date, authenticated account, available private counts, query completeness, and access gaps.

Use GitHub only to support longevity, continuity, maintenance, collaboration, and technology exposure. Session or locally present code evidence is still required for implementation-depth claims.

## 3. Collect optional LinkedIn context

Set LinkedIn status to `included`, `declined`, or `unavailable`.

When included, open the supplied URL in the authenticated browser. Confirm that the page is visible and matches the practitioner. Do not use search snippets, unauthenticated scraping, a different browser profile, or other people's profiles.

Read only:

- headline and About;
- experience roles, organizations, dates, industries, and stated responsibilities;
- education, certifications, and stated specialties when relevant;
- broad career transitions, leadership scope, and observable chronology.

Do not inspect posts, comments, reactions, endorsements, recommendations, connections, followers, contact details, or external links.

LinkedIn may support industry exposure, subject context, broad career duration,
and role framing. It cannot prove implementation quality or override
contradictory observed work. Use the page only as temporary input. Convert useful
facts into generalized, source-labeled industry and subject-matter synthesis.
Discard names, organizations, titles, URLs, dates tied to named roles, and raw
descriptions before you build schema-9 JSON. Do not create a `career.timeline`.

## 4. Distill sessions locally

Do not load hundreds of megabytes of raw logs into model context. Write a temporary local script that extracts a bounded digest.

For each session, retain:

- source, date range, privacy-safe project label, branch when useful, file size, and user-message count;
- visible user messages needed to understand the requested outcome, corrections, decisions, and verification;
- at most the first 25 and last 15 relevant user messages for long sessions;
- messages truncated to about 700 characters;
- visible conversational agent responses needed to understand clarification, correction, and resolution.

Exclude tool output, command output, file contents, system reminders, environment blocks, injected instructions, hidden analysis, and private reasoning.

Create a separate metadata-only agent-operations ledger. Store only source harness, session ID, timestamp, broad tool category, safe function name, and explicit use of reusable skills, commands, MCPs, hooks, automations, agent templates, or evaluation harnesses. Keep scheduled runs, subagents, and background workers separate from interactive work.

Record permission metadata by source. Distinguish environment-inherited, user-selected, and unclear modes. Do not treat broad permissions as good or bad. Record elevated requests only by broad purpose and unambiguous outcome.

Capture event timestamps needed for deterministic concurrency. Do not calculate final counts or comparisons in prose. The fixed validator and renderer own those calculations.

## 5. Extract evidence observations

Process digest chunks of about 150 to 250 KB. Parallel extractors are allowed, but each gets the same privacy rules. Each extractor returns:

- technical capabilities, difficult work, routine work, authorship mode, and evidence dates;
- functional and industry subject matter, operating problems, actors, data objects, constraints, and decisions;
- agent practice across task framing, decomposition, parallelism, verification, recovery, reusable controls, and limitations;
- substantial work-arc candidates with evidence and counterevidence;
- role indicators and project-fit implications;
- negative and missing evidence;
- privacy risks that the synthesizer must omit.

Do not choose a public profile label from one session. Do not infer skill from tool installation, model choice, job title, employer prestige, or activity volume.

### Normalize work arcs

Merge overlapping observations into 3 to 8 coherent work arcs. Tiny edits, setup-only sessions, generic questions, and repeated attempts at the same outcome are not separate arcs.

Each arc gets exactly one value on each axis:

- `delivery_state`: `exploration`, `working-prototype`, `live-use`, or `ongoing-operation`
- `system_context`: `greenfield`, `early-system`, `established-system`, `mature-constrained`, or `unknown`
- `primary_surface`: `product-operations`, `experience-interface`, `application-software`, `data-models`, `workflow-integration`, or `platform-infrastructure`
- optional `secondary_surface` from the same vocabulary
- `change_type`: `new-capability`, `integration`, `experience-improvement`, `architecture-refactor`, `migration`, `reliability-performance`, `incident-recovery`, `analysis-decision-support`, or `operational-automation`
- `responsibility`: `directed-task`, `scoped-contributor`, `workstream-owner`, or `system-owner`
- `authorship`: `direct`, `directed-reviewed`, `mixed`, or `unclear`
- `verification_mode`: `independent`, `self-check`, or `unclear`
- `confidence`: `high`, `medium`, or `low`

Set `reviewer_governor` only when repeated evidence shows review, approval, standards, or quality control beyond the person's own implementation.

Set `verification_mode: independent` only when the retained evidence names a separate reviewer, reviewer agent, evaluation harness, production request, visual check, or other check that is independent of the implementation pass. A test run inside the same implementation pass is `self-check`. Missing or ambiguous evidence is `unclear`. Never infer independent verification from a successful-looking result.

### Analyze agent practice

Agent practice must explain how the person uses coding agents, not merely which products they open. Look for:

- how they define outcomes and material constraints;
- how they split work and assign ownership;
- whether they run independent tasks in parallel;
- how they integrate results;
- which independent checks they require;
- how they diagnose failures and constrain retries;
- which skills, runbooks, hooks, templates, or evaluation controls they reuse;
- where authorship or verification remains unclear.

Use neutral language. Do not infer psychology, intelligence, intent, or emotion.

### Synthesize industries and subject matter

Industry is the economic or organizational setting. Subject matter is the operating problem or body of knowledge. Keep them separate.

For each industry, combine:

- career duration and role context from LinkedIn;
- current and repeated work arcs from sessions;
- longitudinal support from GitHub when it adds useful context.

Describe the balance directly. Examples: `deep career context with current observed work`, `current observed work with limited career context`, or `career depth; no current qualifying work arc`. Do not favor the resume when current work points elsewhere. Do not infer regulated-industry experience merely because an industry can be regulated.

For subject matter, prefer hireable specifics such as `delivery operations`, `CRM and revenue workflows`, `evidence and reporting systems`, `agent operating models`, or `service pricing`. Avoid broad labels such as `business`, `software`, or `AI` unless a narrower label is unsupported.

## 6. Build the evidence index

Create privacy-safe evidence records before writing visible copy. Each record
has one stable opaque ID in the form `ev-001`, `ev-002`, and so on. IDs must
match `^ev-[0-9]{3,12}$`. They cannot encode a source, person, employer,
project, capability, or date. Do not use semantic IDs such as `ev-linkedin` or
`ev-client-crm`. A visible claim can cite several records. One record can
support several claims only when those claims describe different aspects of
the same observation.

Evidence sources are `sessions`, `github`, `linkedin`, or `assessment`. Use
`assessment` only for a conclusion or deterministic aggregate derived from
several indexed records. Evidence kinds are `work-arc`, `agent-practice`,
`career-context`, `activity`, `capability`, `negative-evidence`, or
`limitation`.

Keep summaries concrete and short. Cite arc IDs where applicable. A LinkedIn
evidence record can say `Sustained founder and operator context supports
enterprise software experience.` It cannot name an employer, title, school, URL,
or dated role. No raw prompts, transcript text, names, URLs, paths, contact
details, or identifying project information belong in the index.

Every declared visible evidence source must have direct citation support. For
each value in a visible `sources` array, at least one ID in that same object's
`evidence_ids` must resolve to an `evidence_index` record whose `source` equals
the declared value. A sessions record does not support a declared `linkedin`
source. An `assessment` record does not replace either source. The `claude` and
`codex` labels in normalized-mix items identify collector harnesses, not
evidence-source declarations. Support both with the cited `sessions` or
`assessment` record.

## 7. Write the visible profile

Write `profile_view` last. It is the only source for visible narrative copy. The renderer will not expose the rich legacy matching fields.

Use these hard budgets:

| Section | Required size | Copy budget |
|---|---:|---:|
| Hero | 1 thesis, 1 source note | thesis 28 words; source note 24 words |
| Agent footprint | 1 normalized mix | limitation 36 words |
| Agent practice | 1 role, up to 3 statistics, exactly 4 workflow steps, 1 distinctive fact, 1 reusable system, 1 limitation | role 34 words; each workflow summary 22 words; each other summary 30 words |
| Industries | 3 to 5 | context 16 words; career context 30; observed work 30 |
| Subject matter | 3 to 5 | summary 26 words; evidence label 10 words |
| Matching | exactly 3 conclusions | each summary 34 words |
| Limits | 2 to 4 | each summary 24 words |

Additional visible rules:

- Put each claim in one section only.
- Do not repeat the hero thesis in matching.
- Do not reuse a sentence or close paraphrase.
- Treat one fact as one claim even when the wording changes. For example, if the
  hero says the person founded three companies, do not repeat the founder count
  in an industry row or subject-matter row. Use those rows for different facts.
- Do not list employers or chronological roles.
- Do not show a generic tool, skill, or badge grid.
- Use numbers only when deterministic structured fields support them.
- The fixed renderer calculates operating ratios from their source numerators and denominators. Do not calculate, round, or free-type delegation rate, multi-session-day rate, owned-real-use rate, independent-verification rate, work-surface share, or change-type share in visible copy.
- A ratio can appear only when its numerator and denominator cover the same source and evidence window. Keep source-specific retention limits visible. Never combine Claude tool metadata with a Codex denominator.
- Every `agent_practice.statistics` item is numeric. Set `source_field` to one
  allow-listed JSON Pointer in the same payload and copy that field's exact
  numeric value into `value`. Do not calculate, round, format, estimate, or
  free-type a statistic. The renderer formats the verified number.
- When the evidence supports it, use one statistic for a distinguishing agent
  tool pattern such as subagents, reusable skills, browser/computer-use, data,
  deployment, or connectors. Include the scanned-session denominator in the
  label. Never select shell, file-system, or code-edit activity as a
  distinguishing signal.
- Every narrative object includes `evidence_ids`.
- `activity_analysis.coverage.shared_window_sessions` is the deterministic
  source of truth for the matched Claude/Codex window. It contains exactly one
  Claude row and one Codex row. Both rows use the same inclusive `from` and `to`
  dates and contain the filtered interactive session count for that window.
- `normalized_mix` must mirror `shared_window_sessions` exactly. Its dates and
  source counts cannot differ. Calculate `calendar_days`, `total_sessions`,
  `share`, and `sessions_per_calendar_day` from those two rows. It measures
  session-record share only. Never estimate or rewrite a count.
- If the retained Claude and Codex windows do not overlap, set
  `activity_analysis.coverage.shared_window_sessions` to `[]` and set
  `profile_view.agent_footprint.normalized_mix` to `null`. This is the only
  valid unavailable shape. Do not emit `{}`, partial rows, placeholder counts,
  or an estimated ratio. The fixed renderer shows the upload and coverage
  placeholder.
- The local collector produces `shared_window_sessions` from readable local
  records. Validators confirm that the payload and visible arithmetic agree.
  Overflow cannot authenticate the session counts against raw history because
  raw sessions are not uploaded. The fixed renderer states this limit beside
  the mix. Do not repeat it in a model-authored limitation.
- Cohort metrics, percentiles, distribution curves, and comparison sample size do not belong in this JSON. The server adds them after submission.

## 8. Produce profile schema 9 JSON

Return one valid JSON object. Do not wrap it in Markdown. Do not add commentary before or after it.

Required top-level structure:

```json
{
  "schema_version": 9,
  "prompt_version": 8,
  "name": "",
  "focus": "",
  "headline": "",
  "generated_at": "UTC ISO-8601",
  "generated_by": { "agent": "claude-code|codex|other", "model": "" },
  "collection_summary": {},
  "source_coverage": {},
  "windows": {},
  "cadence": {},
  "activity_analysis": {},
  "github": {},
  "work_arcs": [],
  "skills": [],
  "agent_practice": {},
  "domain_stamps": {},
  "project_role": {},
  "working_style": {},
  "interaction_profile": {},
  "project_match": {},
  "limits": [],
  "profile_view": {},
  "evidence_index": [],
  "matching_index": {}
}
```

Keep the established schema-v8 fields needed for server matching. In particular,
preserve rich `skills`, `work_arcs`, `activity_analysis`, `agent_practice`, and
`domain_stamps` data. Preserve `github`, `working_style`,
`interaction_profile`, `project_role`, `project_match`, and `limits` when
evidence exists. Do not include the legacy `career` object in schema 9. Omit
empty optional window keys. Set `focus` and `headline` to the same thesis for
backward compatibility.

Use these compact compatibility shapes. Copy deterministic values from the
local extraction and aggregation scripts. Do not estimate missing counts.

```json
{
  "collection_summary": {
    "mode": "multi",
    "environment_count": 0,
    "input_sessions": 0,
    "unique_sessions": 0,
    "exact_duplicates_removed": 0,
    "strategy_version": 1,
    "environment_coverage": [
      {
        "environment_index": 1,
        "kind": "computer|vm|cloud|other",
        "sources": ["codex|claude|cowork|other"],
        "from": "YYYY-MM-DD",
        "to": "YYYY-MM-DD",
        "unique_sessions": 0
      }
    ]
  },
  "source_coverage": {
    "sessions": { "status": "included|unavailable", "usable_sessions": 0, "from": "", "to": "", "limitations": [] },
    "github": { "status": "included|declined|unavailable", "collected_at": "", "account_verified": false, "accessible_repositories": 0, "private_counts_available": false, "search_complete": false, "limitations": [] },
    "linkedin": { "status": "included|declined|unavailable", "collected_at": "", "identity_verified": false, "sections_seen": [] }
  },
  "windows": {
    "claude": { "from": "", "to": "", "sessions": 0, "unknown_projects": 0 },
    "codex": { "from": "", "to": "", "sessions": 0, "unknown_projects": 0 },
    "cowork": { "from": "", "to": "", "sessions": 0, "unknown_projects": 0 },
    "other": [ { "tool": "", "from": "", "to": "", "sessions": 0, "unknown_projects": 0 } ]
  },
  "cadence": {
    "sessions_last_28d": 0,
    "active_weeks_last_12": 0,
    "sessions_per_observed_week": 0,
    "last_session": ""
  },
  "activity_analysis": {
    "coverage": {
      "from": "",
      "to": "",
      "interactive_sessions": 0,
      "scheduled_runs": 0,
      "active_days": 0,
      "comparability": "comparable|partial|not-comparable",
      "source_windows": [
        { "source": "codex|claude|cowork|other", "from": "", "to": "", "sessions": 0, "coverage_days": 0, "retention": "full-available|retention-limited|unknown", "limitations": [] }
      ],
      "shared_window_sessions": [
        { "source": "claude", "from": "YYYY-MM-DD", "to": "YYYY-MM-DD", "sessions": 0 },
        { "source": "codex", "from": "YYYY-MM-DD", "to": "YYYY-MM-DD", "sessions": 0 }
      ],
      "limitations": []
    },
    "monthly": [
      { "month": "YYYY-MM", "interactive_sessions": 0, "scheduled_runs": 0, "tool_categories": [ { "tag": "", "calls": 0 } ], "models": [ { "name": "", "sessions": 0 } ] }
    ],
    "concurrency": {
      "method": "15-minute event-activity buckets",
      "median_interactive_sessions_per_active_day": 0,
      "average_concurrent_sessions": 0,
      "p95_concurrent_sessions": 0,
      "peak_concurrent_sessions": 0,
      "multi_session_days": 0,
      "covered_active_days": 0,
      "scheduled_runs_excluded": 0,
      "limitations": []
    },
    "context_pressure": { "token_limit_events": 0, "affected_sessions": 0, "compaction_events": 0, "recovered_sessions": 0, "repeated_failure_sessions": 0, "limitations": [] },
    "model_usage": [ { "source": "codex|claude|cowork|other", "model": "", "sessions": 0, "first_observed": "", "last_observed": "" } ],
    "trend_status": "supported|partial|not-supported",
    "comparability_note": "",
    "evolution_summary": ""
  },
  "github": {
    "account_created_at": "",
    "earliest_observed_contribution": "",
    "latest_observed_contribution": "",
    "contribution_years": [],
    "active_years": 0,
    "active_months_observed": 0,
    "active_months_last_12": 0,
    "indexed_authored_activity": {
      "commits": 0,
      "commits_last_12": 0,
      "incomplete_results": false,
      "annual_commits": [ { "year": 0, "commits": 0 } ],
      "authored_pull_requests": 0,
      "authored_pull_requests_last_12": 0,
      "authored_issues": 0,
      "reviewed_pull_requests": 0,
      "reviewed_pull_requests_last_12": 0,
      "limitations": []
    },
    "contribution_graph": {
      "qualifying_commits": 0,
      "qualifying_pull_requests": 0,
      "qualifying_reviews": 0,
      "qualifying_issues": 0,
      "repositories_contributed_to": 0,
      "annual": [ { "year": 0, "commits": 0, "pull_requests": 0, "reviews": 0, "issues": 0, "repositories": 0 } ]
    },
    "definition_audit": { "status": "aligned|material-divergence|incomplete", "summary": "" },
    "language_exposure": [ { "tag": "", "label": "", "active_years": 0, "first_observed": "", "last_observed": "" } ],
    "limitations": []
  },
  "work_arcs": [
    {
      "id": "arc-1",
      "label": "",
      "from": "",
      "to": "",
      "sources": ["sessions|github"],
      "delivery_state": "exploration|working-prototype|live-use|ongoing-operation",
      "system_context": "greenfield|early-system|established-system|mature-constrained|unknown",
      "primary_surface": "product-operations|experience-interface|application-software|data-models|workflow-integration|platform-infrastructure",
      "secondary_surface": "",
      "change_type": "new-capability|integration|experience-improvement|architecture-refactor|migration|reliability-performance|incident-recovery|analysis-decision-support|operational-automation",
      "responsibility": "directed-task|scoped-contributor|workstream-owner|system-owner",
      "authorship": "direct|directed-reviewed|mixed|unclear",
      "verification_mode": "independent|self-check|unclear",
      "reviewer_governor": false,
      "confidence": "high|medium|low",
      "evidence": [],
      "counterevidence": []
    }
  ],
  "skills": [
    { "tag": "", "label": "", "category": "language|framework|platform|ai-ml|infra|data|practice", "familiarity": "very-familiar|familiar|some", "tier": "deep|working|touched", "authorship": "direct|directed-reviewed|mixed|unclear", "sessions": 0, "sources": ["sessions|github"], "first_observed": "", "last_observed": "", "evidence": "" }
  ],
  "agent_practice": {
    "tool_call_coverage": [
      { "source": "codex|claude|cowork|other", "from": "", "to": "", "sessions_scanned": 0, "sessions_with_tool_metadata": 0, "observed_calls": 0, "limitations": [] }
    ],
    "tool_categories": [
      { "tag": "", "label": "", "intensity": "habitual|recurring|situational", "active_sessions": 0, "observed_calls": 0, "sources": ["codex|claude|cowork|other"], "evidence": "" }
    ],
    "reusable_assets": [
      { "tag": "", "label": "", "kind": "skill|command|mcp|hook|automation|agent-template|eval", "relationship": "used|adapted|created", "active_sessions": 0, "observed_uses": 0, "sources": ["codex|claude|cowork|other"], "evidence": "" }
    ],
    "permission_practice": { "coverage": [], "modes": [], "elevated_requests": [], "finding": "", "guardrail_pattern": "", "limitations": [] },
    "interaction_metadata": {},
    "limitations": []
  },
  "domain_stamps": {
    "classified_arc_count": 0,
    "industries": [ { "tag": "", "label": "", "depth": "exposure|repeated|deep", "arc_count": 0, "arc_share": 0, "arc_ids": [], "evidence": "" } ],
    "functions": [ { "tag": "", "label": "", "depth": "exposure|repeated|deep", "arc_count": 0, "arc_share": 0, "arc_ids": [], "evidence": "" } ]
  },
  "project_role": { "best_fit": "", "less_like": [] },
  "working_style": {},
  "interaction_profile": {},
  "project_match": { "good_fit": [], "bring_specialist": [], "not_established": [] },
  "limits": []
}
```

Omit `collection_summary` for a normal one-environment run. The multi-environment
prompt supplies it. Keep lower-confidence and exhaustive observations in these
legacy fields even when they do not appear in `profile_view`.

Use this schema-v9 extension exactly:

```json
{
  "profile_view": {
    "hero": {
      "thesis": "",
      "source_note": "",
      "evidence_ids": ["ev-001"]
    },
    "agent_footprint": {
      "normalized_mix": {
        "from": "YYYY-MM-DD",
        "to": "YYYY-MM-DD",
        "calendar_days": 0,
        "total_sessions": 0,
        "items": [
          {
            "source": "claude|codex",
            "sessions": 0,
            "share": 0,
            "sessions_per_calendar_day": 0
          }
        ],
        "limitations": [
          "Session-record share only. It does not measure time, preference, quality, or completed work."
        ],
        "evidence_ids": ["ev-002"]
      }
    },
    "agent_practice": {
      "role": { "summary": "", "evidence_ids": ["ev-003"] },
      "statistics": [
        {
          "tag": "",
          "label": "",
          "value": 0,
          "source_field": "/activity_analysis/concurrency/peak_concurrent_sessions",
          "evidence_ids": ["ev-003"]
        }
      ],
      "workflow": [
        { "label": "Frame", "summary": "", "evidence_ids": ["ev-003"] },
        { "label": "Divide", "summary": "", "evidence_ids": ["ev-004"] },
        { "label": "Verify", "summary": "", "evidence_ids": ["ev-005"] },
        { "label": "Operate", "summary": "", "evidence_ids": ["ev-006"] }
      ],
      "distinctive_fact": { "summary": "", "evidence_ids": ["ev-004"] },
      "reusable_system": { "summary": "", "evidence_ids": ["ev-006"] },
      "limitation": { "summary": "", "evidence_ids": ["ev-007"] }
    },
    "industries": [
      {
        "tag": "",
        "label": "",
        "context": "",
        "career_context": "",
        "observed_work": "",
        "depth": "deep-current|deep-sustained|working-current|career-depth|observed-exposure|career-exposure",
        "sources": ["sessions|github|linkedin|assessment"],
        "evidence_ids": ["ev-008"]
      }
    ],
    "subject_matter": [
      {
        "tag": "",
        "label": "",
        "summary": "",
        "evidence_label": "",
        "evidence_ids": ["ev-009"]
      }
    ],
    "matching": {
      "strongest_fit": { "label": "", "summary": "", "evidence_ids": ["ev-010"] },
      "add_specialist": { "label": "", "summary": "", "evidence_ids": ["ev-011"] },
      "not_shown": { "label": "", "summary": "", "evidence_ids": ["ev-012"] }
    },
    "limits": [
      { "summary": "", "evidence_ids": ["ev-013"] }
    ]
  },
  "evidence_index": [
    {
      "id": "ev-001",
      "source": "sessions|github|linkedin|assessment",
      "kind": "work-arc|agent-practice|career-context|activity|capability|negative-evidence|limitation",
      "summary": "",
      "from": "YYYY-MM-DD",
      "to": "YYYY-MM-DD",
      "arc_ids": ["arc-1"]
    }
  ],
  "matching_index": {
    "industries": [
      {
        "tag": "",
        "label": "",
        "depth": "deep|working|exposure|career-context",
        "sources": ["sessions|github|linkedin|assessment"],
        "evidence_ids": ["ev-001"]
      }
    ],
    "capabilities": [
      {
        "tag": "",
        "label": "",
        "depth": "deep|working|touched|not-established",
        "authorship": "direct|directed-reviewed|mixed|unclear",
        "arc_ids": ["arc-1"],
        "evidence_ids": ["ev-001"]
      }
    ],
    "delivery_states": [
      {
        "state": "exploration|working-prototype|live-use|ongoing-operation",
        "arc_count": 0,
        "arc_ids": ["arc-1"],
        "evidence_ids": ["ev-001"]
      }
    ],
    "risk_gaps": [
      {
        "tag": "",
        "label": "",
        "status": "missing|shallow|unclear|contradicted",
        "implication": "",
        "evidence_ids": ["ev-001"]
      }
    ]
  }
}
```

When Claude and Codex have no overlapping retained dates, replace the two mix
fields with this exact unavailable shape. Keep the rest of the profile:

```json
{
  "activity_analysis": {
    "coverage": {
      "shared_window_sessions": []
    }
  },
  "profile_view": {
    "agent_footprint": {
      "normalized_mix": null
    }
  }
}
```

`matching_index` must be exhaustive enough for server-side staffing filters. It
can be richer than the visible profile. Each of its four arrays must contain at
least one evidence-backed item, including `risk_gaps`. Do not hide a relevant
capability or risk gap merely because it is not selected for display.

The legacy top-level `agent_practice` keeps source-level tool-call coverage, categories, reusable assets, permission practice, interaction metadata, and limitations for matching and audit. These values are not a visible generic-tool section.

### Deterministic agent-operating ratios

The fixed renderer can show up to four hiring-relevant operating ratios. The model supplies classified work arcs and collector-backed counts. The renderer performs all division and formatting.

- **Delegation rate:** `subagents.active_sessions / tool_call_coverage.sessions_scanned` for the same single source and coverage window. If exact tool coverage is unavailable, omit the ratio. Do not use total cross-tool sessions as the denominator.
- **Multi-session active-day rate:** `activity_analysis.concurrency.multi_session_days / covered_active_days`. Scheduled runs remain excluded.
- **Owned into real use:** work arcs whose `delivery_state` is `live-use` or `ongoing-operation` and whose `responsibility` is `workstream-owner` or `system-owner`, divided by all qualifying work arcs.
- **Independent-verification rate:** work arcs with `verification_mode: independent`, divided by all work arcs that have `independent`, `self-check`, or `unclear` classification. `Unclear` remains in the denominator so missing evidence cannot inflate the rate.
- **Review governance:** if verification mode is unavailable, the renderer may show `reviewer_governor` arcs divided by qualifying work arcs. The label must state that this is review governance, not independent verification.
- **Work mix:** renderer-owned counts of `primary_surface` and `change_type` across qualifying work arcs. These are distributions of retained arcs, not estimates of time spent.
- **Recovery:** show a recovery rate only when `context_pressure.recovered_sessions` and the matching failure-session denominator are collector-derived from the same scanned window. Otherwise keep recovery qualitative.
- **Reusable controls:** show a reuse rate only when one non-overlapping session-level category supplies `active_sessions` and same-source `tool_call_coverage` supplies `sessions_scanned`. Never sum overlapping reusable assets.

The page must omit an unsupported ratio. It must not substitute a qualitative score, badge, or invented denominator.

Allowed `source_field` roots for visible agent-practice statistics are:

- `/activity_analysis/coverage/`
- `/activity_analysis/concurrency/`
- `/activity_analysis/context_pressure/`
- `/agent_practice/tool_call_coverage/`
- `/agent_practice/tool_categories/`
- `/agent_practice/reusable_assets/`
- `/cadence/`

The pointer must resolve to a finite, non-negative number. Array indices are
allowed inside the three `agent_practice` collections. A label can explain the
metric, but it cannot change its meaning. If a candidate has no useful
deterministic field, do not use that candidate. Select one to three statistics
from the allow-listed fields. Do not substitute a qualitative word such as
`Repeated` for a number.

The legacy top-level `skills` keeps languages, frameworks, platforms, AI practices, infrastructure, data, and delivery practices with depth, authorship, dates, sources, and evidence. The renderer shows only selected subject-matter and matching conclusions.

The legacy top-level `domain_stamps` keeps classified arc counts plus structured industry and functional coverage. Do not convert those rows into visible badges.

## 9. Self-audit before rendering

Check every item:

- [ ] Output is valid JSON with `schema_version: 9` and `prompt_version: 8`.
- [ ] Every visible narrative claim cites existing `evidence_index` IDs.
- [ ] Every evidence ID is opaque, matches `^ev-[0-9]{3,12}$`, and contains
      no semantic source, person, employer, project, capability, or date label.
- [ ] Every value in a visible `sources` array is backed by a cited evidence
      record whose `source` matches that value.
- [ ] Evidence IDs contain no raw prompts, names, private URLs, paths, or credentials.
- [ ] The schema-9 payload contains no raw LinkedIn profile data, employer or
      organization names, job titles, profile URLs, raw career descriptions, or
      career timeline.
- [ ] Generalized LinkedIn-derived industry and subject-matter synthesis remains
      source-labeled and evidence-backed.
- [ ] `profile_view.industries` and `profile_view.subject_matter` each contain 3 to 5 items.
- [ ] Agent workflow contains exactly 4 steps.
- [ ] Every visible agent-practice statistic is numeric, includes an allow-listed
      `source_field`, and exactly matches that structured field's value.
- [ ] Agent practice describes role, decomposition, parallelism, verification, recovery, and reusable controls when supported.
- [ ] Every work arc has `verification_mode`; independent means a separate retained check, self-check means the implementation pass checked itself, and unclear means the evidence does not establish either.
- [ ] Every operating ratio has a source-compatible numerator and denominator. The model did not calculate or write the displayed percentage.
- [ ] No visible section lists generic tools, badge cards, employers, or resume chronology.
- [ ] No visible claim appears twice or as a close paraphrase.
- [ ] Every visible section meets its item and word budget.
- [ ] Industry context combines career and observed work without treating LinkedIn as implementation proof.
- [ ] Negative evidence appears in matching, limits, or both.
- [ ] Normalized mix uses one exact shared calendar window and deterministic counts.
- [ ] `activity_analysis.coverage.shared_window_sessions` contains exactly one
      Claude row and one Codex row with identical inclusive dates.
- [ ] Normalized mix dates and source session counts exactly match the shared
      window ledger. Its total, shares, and daily rates reconcile to those rows.
- [ ] If there is no overlap, `shared_window_sessions` is `[]` and
      `normalized_mix` is `null`. No ratio or partial mix is present.
- [ ] When a mix is present, its limitation says that Overflow validates
      payload consistency but does not authenticate counts against raw history.
- [ ] Mix is labeled session-record share only and does not imply time, preference, quality, or completed work.
- [ ] Cohort placement and curves are absent from the local JSON.
- [ ] Rich legacy matching fields remain populated.
- [ ] Omitted sources are not described as deficiencies.

Fix all failures before handoff.

## 10. Validate and render locally

Save the JSON as `profile.json`. Download the fixed renderer and template into one temporary directory:

```sh
mkdir -p ./overflow-profile-render
curl -fsS https://austin.overflowbuilders.com/apply/profile-renderer.mjs -o ./overflow-profile-render/profile-renderer.mjs
curl -fsS https://austin.overflowbuilders.com/apply/profile-template.mjs -o ./overflow-profile-render/profile-template.mjs
cp ./profile.json ./overflow-profile-render/profile.json
cd ./overflow-profile-render
node profile-renderer.mjs validate profile.json
node profile-renderer.mjs render profile.json --out project-fit-{slug}.html
```

Validation and rendering are local and deterministic. The renderer checks schema shape, evidence references, visible section budgets, exact four-step workflow, duplicate visible claims, and normalized mix arithmetic. It does not upload the profile.

Open the rendered HTML and inspect desktop and mobile layouts. If validation or rendering fails, fix `profile.json` and run both commands again. Do not edit the generated HTML to repair content or layout.

The fixed page contains Overflow's reviewed submission control. It makes no
request until the user completes the form, chooses visibility, consents, and
clicks the final upload button. Do not prefill the form or trigger submission.
Only the structured payload is sent. Schema 9 contains generalized,
source-labeled LinkedIn synthesis and no raw LinkedIn profile data. The server
calculates compatible cohort comparisons from stored assessment data.

## 11. Handoff

Tell the user in four short sentences:

1. the exact JSON and HTML paths;
2. the local-session and GitHub date ranges;
3. whether LinkedIn was included;
4. that nothing was uploaded and they should review the page before sharing or submitting it.

Do not mention prompt versions, schema versions, internal field names, or implementation details in the user-facing handoff.
