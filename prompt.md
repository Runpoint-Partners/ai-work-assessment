<!--
AI Work Assessment — prompt version 7, profile schema version 8.

Give this prompt to a capable coding agent (Claude Code, Codex, or similar) on
the machine whose work is being assessed. It produces one self-contained HTML
report on that machine. The default configuration performs NO network upload of
any kind: the report is a local file, full stop.

Optional destination adapters, including the hosted flow used by Overflow's
community site, are defined in the final section. Ignore that section unless the
run was deliberately configured to target a host.
-->

# AI Work Assessment

Build a concise, evidence-based profile of the person running this prompt from configurable, clearly separated source layers:

1. their local AI coding-session history;
2. longitudinal technical activity available through their authenticated GitHub account;
3. optional LinkedIn career history, only when the person explicitly opts in.

A configured copy of this prompt may begin with a `Source choices for this run` block. When present, it is authoritative: inspect only sources marked `include`; do not inspect, request, or mention sources marked `omit`; and never treat a user's omission as evidence of missing ability. `claude` covers Claude Code, Cowork, and desktop-launched Claude sessions. `other_local` covers best-effort readable history from Cursor, Gemini CLI, Pi, opencode, aider, and local-model runtimes. If no source-choice block is present, use every available technical source and ask whether to include LinkedIn as described below.

The reader is deciding what kind of AI practitioner this person demonstrably is and where they belong in a community or on a particular project. The output must answer what they actually work on, whether their evidence centers on prototypes, production shipping, operating live systems, or changing mature systems, which technical surfaces and AI practices recur, what the source-specific captured activity can honestly show, how they frame and steer agent work, where their subject-matter experience lies, and what the evidence does not establish.

The result is one HTML file written to the user's computer for them to review. Nothing is uploaded, submitted, or transmitted anywhere, and the finished report makes no network request of any kind. This is the v6/schema-v8 contract. The report is complete on its own: it holds the entire work profile and needs no server, account, or connection to be useful. Do not request, reconstruct, embed, estimate, or display any cohort distribution, placement, percentile, comparison count, or curve. A single locally generated profile has nothing to compare itself against, and inventing a comparison would be fabrication. If this run was explicitly configured with a destination adapter, the final section of this prompt states the additional requirements; otherwise ignore that section entirely.

The finished file must begin with a compact report header: an outlined square holding the first letter of `{{SITE_NAME}}`, the text `{{SITE_NAME}}`, the generation date, and a `Private preview` marker. When `{{SITE_URL}}` is configured, the wordmark links to that absolute URL, opens only on an explicit click, and works from a local `file://` page; when it is not configured, render the wordmark as plain text with no link at all. Use the dark palette and `{{ACCENT}}` accent specified in Step 9, restrained uppercase mono labels, and editorial display type. Do not put `Experience profile` in the wordmark.

Before doing anything, tell the user in 4–7 plain sentences, mentioning only sources selected for this run:

- You will analyze readable local AI coding-agent history and any project-session records you can access.
- You will use their already-authenticated GitHub account to gather contribution metadata and long-term technical activity; you will not publish, modify, clone, star, follow, or write anything on GitHub.
- LinkedIn career history is optional. If included, you will open it in an authenticated browser, verify that the person can see the page, and use it only as separately labeled career context.
- Source analysis and report generation happen locally. GitHub and, if selected, LinkedIn receive normal authenticated read requests. The finished profile stays on the person's computer; nothing is uploaded, and no comparison against anyone else is calculated or shown.
- Client names, colleague names, personal details, credentials, and identifying project names will be removed or abstracted.
- Local retention limits the session-evidence window, GitHub visibility depends on account and organization access, and LinkedIn is self-reported career context rather than proof of implementation.
- The process usually takes 15–25 minutes, depending on session volume and source coverage.

Only when no configured source-choice block is present, ask exactly one source-choice question before proceeding:

> Include LinkedIn career history? **Recommended, but optional.** Reply `yes — <your LinkedIn URL>` to include it, or `no` to build the profile from local sessions and GitHub only.

If the user answers yes without a URL, ask only for the URL. When a configured source-choice block includes LinkedIn but no URL is supplied, ask only for the URL. When it omits LinkedIn, do not ask about or open LinkedIn. Honor every configured include/omit choice without asking the user to reconsider it. Do not ask other setup questions unless an included GitHub or LinkedIn source reaches a genuine user-owned sign-in, SSO, MFA, or account-identity boundary.

---

## Report identity

Three placeholders control how the report brands itself. A configured copy of this prompt may set them; otherwise use the defaults exactly.

| Placeholder | Default | Use |
| --- | --- | --- |
| `{{SITE_NAME}}` | `AI Work Assessment` | Wordmark, document title, and the share-card eyebrow. |
| `{{SITE_URL}}` | *(none)* | Absolute URL for the wordmark link. When unset, the wordmark is plain text and the report contains no links to any site. |
| `{{ACCENT}}` | `#ff4d00` | The single accent color used across the report. |

Never invent a brand, organization, product name, or URL that was not configured. An unset value means the element is omitted, not guessed.

## What this profile is

This is an evidence-based AI work profile and project-staffing document, not a recommendation letter, personality test, leaderboard entry, or résumé rewrite.

The useful question is not whether the person is "good at AI". Anyone running this prompt is likely a heavy AI-tool user. Identify what is different about this person:

- the work they repeatedly choose to do;
- the tools, languages, frameworks, platforms, and delivery practices they use;
- the depth of evidence for each;
- whether they personally implement, direct and review agents, or do both;
- whether their evidence shows exploration, working prototypes, live delivery, ongoing operation, or mature-system change;
- the system contexts and technical surfaces in which that work occurs;
- a limited stack of rule-derived badges, each backed by normalized work arcs;
- their industry and subject-matter exposure;
- the project roles they resemble and do not resemble;
- the kinds of projects that fit them, need a complementary specialist, or are not supported by the evidence.

Do not infer that work shipped merely because a session exists. Session history can show sustained implementation, debugging, deployment activity, or operational ownership. It cannot reliably prove that a customer or employer released the work. Use verbs such as "worked on", "implemented", "debugged", "operated", or "directed" unless release is directly established.

## Hard rules

1. **Evidence over praise.** Every capability claim must trace to observed session evidence.
2. **No overall scores or pre-submission placement.** Do not assign an overall score, percentile, rank, radar chart, or 1–5 grade. The only stars allowed are the badge-specific 1–3 proof stars defined below; they measure evidence strength, never talent, seniority, or relative rank. Never total or average badge stars. Do not place any metric on a distribution or estimate where the person might fall. The source-specific GitHub activity characterization is allowed only when it follows the explicit standard below and says that it is not a seniority or expertise score. Do not call the person "world-class", "exceptional", "impressive", "expert-level", "10x", "top-tier", or "highly skilled".
3. **Specificity is the product.** Prefer "frequently directs Next.js/TypeScript changes and verifies them in the browser" over "strong full-stack developer". If a sentence could describe most coding-agent users, rewrite it or remove it.
4. **Source boundaries are hard boundaries.** Local sessions support claims about recent working behavior and implementation evidence. GitHub supports longitudinal technical activity and collaboration evidence. LinkedIn supports career chronology and stated role context only. Never present LinkedIn claims as implementation proof, and never let LinkedIn affect skill tiers or project-fit scoring.
5. **Volume is not quality.** Commit counts, contribution days, repository counts, session counts, followers, stars, endorsements, and network size are descriptive metadata, not measures of skill or seniority.
6. **Show authorship honestly.** Distinguish direct implementation, agent-directed and reviewed work, mixed evidence, and unclear authorship. Directing agents well is a real mode of work; do not disguise it as hand-written implementation.
7. **Provenance is visible.** Every substantive section and machine-readable claim must identify whether it comes from `sessions`, `github`, `linkedin`, or a cautious synthesis of named sources.
8. **Limits are required.** Name missing evidence, shallow evidence, retention gaps, source-access gaps, and project types that would require a complementary specialist.
9. **Privacy is structural.** Abstract identifying client and private-project information during extraction, not only during final editing. Never store or display access tokens, private repository URLs, connection lists, email addresses, or collaborator names.
10. **Concise output.** Keep the visible profile between 700 and 1,100 words, excluding embedded JSON and form labels. Prefer short findings, labels, and visual comparisons. Do not repeat evidence across sections.
11. **Write for the profile owner.** Address the reader as `you`. Keep implementation and assessment language out of the visible page. Never show prompt or schema versions, contract names, characterization versions, API terminology, source-policy labels, `directional`, `coverage`, `compatible profiles`, `optional enrichment`, `not assessed`, or internal field names. Translate anything useful into plain language and omit the rest.
12. **Normalize before characterizing.** Do not jump from raw sessions to person-level labels. First group evidence into substantial work arcs, then classify each arc across the controlled axes below.
13. **One value per axis.** Every work arc gets exactly one delivery state, system context, primary work surface, change type, and responsibility level. Use `unknown` where allowed rather than blending categories or guessing. A secondary work surface may be recorded but never replaces the required primary surface.
14. **Badges are derived conclusions.** Do not choose badges because they sound plausible. Apply the explicit qualification rules to the normalized work arcs. Tool installation, job titles, employer prestige, session volume, GitHub volume, and self-description never earn a badge by themselves.
15. **Complete badge evidence map.** Badges are non-exclusive and describe different dimensions. Evaluate every controlled badge exactly once. Show earned and observed badges with their proof, and show every unawarded badge in a quieter gray map with the reason and evidence needed to move it forward. Do not hide a qualifying badge merely to satisfy a display cap.
16. **Interaction analysis is behavioral, not psychological.** Describe observable task framing, context provision, correction, exploration, feedback, and orchestration. Do not infer intelligence, mental health, motives, personality disorders, or hidden emotions. Do not expose or reconstruct hidden chain-of-thought, private reasoning tokens, or system/developer messages; use only visible conversational behavior and outcome evidence.
17. **Activity is a timeline, not a virtue.** Show cadence, concurrency, context pressure, tool/platform use, and model choice over time when the logs support them. Separate interactive work from scheduled automation and background workers. Never equate more sessions, more concurrent work, a newer model, or more tokens with better performance.
18. **One reader-facing profile.** Build one canonical evidence profile. Do not add an internal staffing lens, employer-specific interpretation, audience toggle, or alternate scoring view.

---

## Step 1 — Inventory local evidence

Inspect only the local source families marked `include`. If Codex, Claude, or other local agents are omitted, skip their paths completely and record the omission as a user choice rather than a coverage failure.

Inspect these primary stores:

- **Claude Code:** `~/.claude/projects/*/*.jsonl`
- **Codex CLI/Desktop:** `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl`
- **Cowork metadata on macOS:** `~/Library/Application Support/Claude/local-agent-mode-sessions/**/local_*.json`
- **Claude desktop-launched Code metadata:** `~/Library/Application Support/Claude/claude-code-sessions/**/*.json`

Claude desktop-launched Code metadata often points to a transcript already present in `~/.claude/projects`; use it for attribution but never double-count it.

When the Claude family is included, also read the long-horizon prompt log `~/.claude/history.jsonl` (one JSON line per submitted prompt: `display`, `timestamp`, `project`) and, when present, `~/.claude/file-history/`. These survive the roughly 30-day transcript cleanup and often reach back months or years. Treat them as timeline evidence only: they extend the cadence, project-span, and breadth picture past the transcript retention window, and they widen the Claude `source_windows` coverage range honestly. They contain no work product, so they can never raise a skill tier, delivery state, or badge on their own, and full transcripts remain the only depth source. Prompt text is raw user input and may name clients or private projects — apply the same abstraction rules during extraction as for transcripts, and never quote a logged prompt verbatim in the profile.

Also check, best effort, for readable history from Gemini CLI, opencode, aider, Pi, Cursor CLI, and local-model runtimes such as Ollama or LM Studio. Installed software alone is not evidence of working familiarity. Record it only when sessions or project artifacts show use.

For each store, collect session count, total size, date range, distinct projects, and unknown-project count. If fewer than five usable sessions exist in total, stop and explain that there is not enough evidence yet.

## Step 2 — Collect authenticated GitHub context

If GitHub is marked `omit`, skip this step completely, make no GitHub request, and set its source status to `declined` rather than `unavailable`.

Use GitHub only through the person's existing authenticated `gh` session. Begin with `gh auth status` and `gh api user`. Never print, read, copy, summarize, or persist the token. Make no GitHub mutations.

If GitHub is not authenticated, ask the user to complete `gh auth login` and tell you when it is ready. If they decline, continue with GitHub marked `unavailable`; do not silently substitute public scraping. When `gh api user` succeeds, treat that authenticated account as the account the person chose to analyze and set `account_verified: true`. Record the login as provenance, but do not create or display an identity-confidence score or warning.

Use the GitHub GraphQL or REST API and a local script to collect and aggregate. Keep GitHub's different counting surfaces separate; they answer different questions and must never be merged under a label such as `total commits`.

Collect these two commit measures independently:

- **Indexed authored commits:** authenticated commit-search `total_count` for `author:<login>`, plus bounded annual counts. Label it exactly `indexed authored commits`. Record `incomplete_results`, the query date, and the authenticated login. This is the broadest account-level count available here, but it is still not an absolute lifetime census.
- **Contribution-graph qualifying commits:** yearly `contributionsCollection.totalCommitContributions`. Label it exactly `contribution-graph qualifying commits`. GitHub applies profile-contribution eligibility rules, so this is a subset and must never be presented as the person's complete commit history.

Also collect broad authenticated search totals for authored pull requests, authored issues, and reviewed pull requests when available. Run separate bounded queries for the trailing 12 months to populate `commits_last_12`, `authored_pull_requests_last_12`, and `reviewed_pull_requests_last_12`. Use the exact generation date minus 12 months as the boundary and record it in methodology. Do not substitute contribution-graph PR/review/issue counts for these broader totals without the same explicit `contribution-graph qualifying` label.

Then collect and aggregate:

- account creation date and contribution years;
- earliest and latest observed contribution dates;
- annual indexed-authored commit counts and, separately, annual contribution-graph qualifying counts;
- broad lifetime-visible and trailing-12-month counts for indexed authored commits, authored pull requests, and reviewed pull requests, with their query definitions;
- active days, active months by year, total observed active months, active years, longest visible continuity, and recent activity;
- accessible repository metadata needed to summarize public/private coverage, repository age, maintenance span, archived/fork status, and primary languages, when available without cloning;
- repeated evidence of creating, maintaining, reviewing, or collaborating on software over time;
- repeat work in the same repository across months or years, release/tag activity, merged pull requests, reviews, and issue participation when visible. Omit unavailable signals from the visible profile.

Query each contribution year separately when the API requires bounded windows. Aggregate repository information locally and immediately discard private repository names, URLs, organization names, collaborator identities, commit messages, issue text, and PR text. Do not clone repositories merely for this assessment. Inspect code only when the repository is already present locally and the local-session analysis independently makes it relevant.

Before drawing any experience conclusion, run a definition audit. Compare annual indexed-authored commits with annual contribution-graph qualifying commits across the same date windows. If the counts differ materially, explain why and prohibit the graph count from driving the activity characterization. A search `total_count` may describe volume, but search enumeration is capped and cannot establish a complete repository census; do not infer distinct-repository totals from a truncated result set.

Record coverage honestly: authenticated account, collection date, accessible repository count, whether private contribution counts were available, search completeness, any organization/SSO gaps, and the possibility of missing work from unlinked commit emails, other Git hosts, deleted repositories, or inaccessible organizations. Account creation is not the start of a career; describe only "observed GitHub activity since …".

Never use stars, followers, contribution volume, lines changed, or repository count as a skill score. GitHub may strengthen claims about longevity, continuity, maintenance, collaboration, and technology exposure, but session or code evidence is still required for implementation-depth claims.

### GitHub Activity Characterization v3

Characterize the observable activity without turning GitHub into a seniority score or withholding a useful conclusion because an optional signal is unavailable. Contribution-graph qualifying counts cannot drive the characterization; use consistently defined indexed-authored activity.

Use this standard internally and store it in JSON. Do not show the standard's name, version, rung names, or unavailable optional signals in the visible profile. Show only the useful conclusion and the facts supporting it.

Consider these dimensions separately:

- **Continuity:** active calendar years, recent annual activity, and month-level continuity when it can be collected reliably;
- **Activity context:** indexed authored commits and authored pull requests, explicitly labeled as volume rather than complexity or quality;
- **Collaboration:** authored pull requests, reviews, and issue participation;
- **Optional stewardship signal:** repeat work, releases, review responsibility, or long-lived maintenance when visible. If unavailable, omit it from the visible profile and do not lower the characterization.

Use the highest supported descriptive label:

1. **Visible activity** — at least one indexed authored event.
2. **Repeated activity** — indexed authored activity in at least 2 calendar years, including recent activity.
3. **Sustained recent activity** — indexed authored activity in at least 3 calendar years including the current or immediately preceding year, plus visible authored pull-request, review, or issue activity.

`Stewardship observed` is an optional additional signal, not a fourth rung and not a prerequisite. Never translate this label into professional years, seniority, job level, implementation depth, or an overall profile score.

The person running the prompt is the profile owner. A successful authenticated `gh api user` result is sufficient attribution for this assessment; display-name differences are not a scoring dimension and require no warning. Store characterization version 3 in JSON and mark older characterizations stale when the policy changes.

## Step 3 — Collect optional LinkedIn career context

If LinkedIn is marked `omit`, skip this step completely and set LinkedIn mode to `declined`. Do not mention its absence as a deficiency.

Set LinkedIn mode to one of `included`, `declined`, or `unavailable`.

If the user opted in, open the supplied LinkedIn URL in the available authenticated browser. Do not use unauthenticated scraping, search-engine snippets, or a different person's browser profile. Confirm that the page is visible and that its displayed identity matches the practitioner. If LinkedIn requires login, SSO, MFA, or a passkey, ask the user to complete that step in the same browser and continue only when they say it is ready. If access still fails, mark LinkedIn `unavailable` and continue; do not infer the missing history.

Read only the practitioner's own profile sections needed for career context:

- headline and About summary;
- experience roles, organizations, date ranges, industries, and stated responsibilities;
- education, certifications, and clearly stated professional specialties when relevant;
- broad career transitions, overlapping roles, leadership scope, and total observable chronology.

Do not inspect posts, comments, reactions, recommendations, endorsements, connections, followers, contact details, or other people's profiles. Do not click external links. Treat LinkedIn as self-reported. It may explain chronology, industry exposure, or role framing, but it cannot establish implementation quality or override contradictory session/GitHub evidence.

Because the user explicitly opted in, public employer names and role titles may appear in the local review copy when they materially clarify the chronology. Still remove client names, colleague names, contact information, and sensitive personal details. Title the section `Career history` and say `From LinkedIn` once. Keep it visually separate from observed proof. Wrap every visible LinkedIn-derived element outside the main career section—including any source card or limit note—in its own `<!-- assessment-linkedin-context:start -->` / `<!-- assessment-linkedin-context:end -->` pair so it can be stripped cleanly in one pass.

If the user declined LinkedIn, do not open LinkedIn and do not mention missing LinkedIn as a deficiency. State only that career context was not included by choice.

## Step 4 — Distill local sessions with a script

Do not read hundreds of megabytes of raw logs into context. Write and run a small Python script that produces temporary digest files.

For every session, extract:

- tool, date, working directory/project, branch when present, file size, and user-message count;
- user messages only, excluding tool output, system reminders, injected instructions, environment blocks, and command stdout;
- enough message context to understand the requested work, corrections, decisions, and verification;
- no more than roughly 40 user messages per session, taking the first 25 and last 15 for longer sessions and truncating individual messages to roughly 700 characters.

Also produce a separate metadata-only agent-operations ledger. This ledger must never contain command text, tool arguments, file contents, URLs, credentials, tool output, or resource identifiers. Record only:

- tool/function name, broad category, source harness, session identifier, and timestamp;
- explicit reusable-skill, command, MCP, hook, automation, agent-template, or eval-harness use when it can be identified safely;
- permission mode metadata, whether the mode appears environment-inherited, user-selected, or unclear, and explicit mode-change events;
- requests for elevated access and their broad purpose (`deployment`, `network`, `filesystem`, `process`, `account`, or `other`), plus approved or denied outcome only when the log states it unambiguously;
- denominators needed for honest interpretation: sessions scanned, sessions with usable tool metadata, observed tool calls, and sessions with usable permission metadata.

Extend that ledger with a privacy-safe activity timeline:

- one coverage window per source harness, including first and last readable event, coverage days, whether retention appears limited, and known limitations. A log's first readable date is never evidence that the person first adopted the tool on that date;
- monthly interactive-session counts, scheduled/background-run counts, tool-category counts, and model-session counts by source;
- model names only when explicitly present in session metadata. Normalize aliases cautiously, retain `unknown`, and never infer a model from dates or product branding;
- context-pressure events such as explicit context-length/token-limit failures, compaction events, and recoveries. Store category and counts only—never the surrounding prompt, error text, or reasoning content;
- interactive concurrency from 15-minute activity buckets. A session is active in a bucket only when an observable user, assistant, or tool event occurs in that bucket; do not treat the entire first-to-last session span as continuously active;
- active days, median interactive sessions per active day, average concurrent sessions across active buckets, 95th-percentile concurrency, peak concurrency, and days with two or more interactive sessions;
- scheduled automations, subagents, and background workers in separate fields. They may describe orchestration but must not inflate interactive multitasking.

Coverage comparability is mandatory. Mark the timeline `comparable` only when the same source has at least three complete months of materially consistent readable coverage. Mark it `partial` when a useful same-source comparison exists but is shorter or incomplete, and `not-comparable` when totals mainly reflect different retention windows or sources entering and leaving the readable data. Claude-family transcripts are commonly retention-limited to roughly the last 30 days; detect the actual window and disclose it rather than assuming older activity did not exist. When `~/.claude/history.jsonl` reaches further back, report two windows explicitly — the transcript (depth) window and the prompt-log (timeline) window — and never present prompt-log-only months as if they carried transcript-grade evidence. A long prompt-log window can justify `comparable` for cadence and project-span statements only; depth claims stay bounded by the transcript window. For a Claude-only user whose only long-horizon source is the prompt log, label the section `Activity and cadence over time` and say plainly which months rest on prompt counts alone.

For interaction analysis, retain a bounded digest of visible user messages and visible conversational assistant responses needed to understand framing, clarification, correction, feedback, and resolution. Exclude assistant analysis/reasoning records, hidden chain-of-thought, system/developer instructions, injected context, and tool output. Never attempt to reconstruct private reasoning from logs.

Codex and Claude-family harnesses encode permissions differently. Preserve source-specific counts and vocabulary; never merge them into one permission score. An approval policy supplied by the host environment is not evidence that the user personally chose it. An installed skill, MCP, or tool is not evidence of use.

Support both major Codex formats: newer `response_item` payloads and older top-level message records. Resolve Codex project attribution from session metadata, turn context, environment-context paths, and finally absolute paths in user messages. Revisit the parser if more than about 10% of sessions remain unknown.

Cowork metadata has lower fidelity. Use title and initial message as evidence of what the user delegates, but do not pretend it contains implementation details.

Compute combined cadence only as methodology metadata: sessions in the last 28 days, active weeks in the last 12 weeks, sessions per observed week, and most recent session. Do not treat volume as skill. Do not benchmark distinct project counts yet: worktrees, monorepos, deleted paths, and temporary directories make that definition too unstable.

Group digests into chunks of roughly 150–250 KB, keeping projects together when practical.

## Step 5 — Extract local-session observations

Use parallel subagents for chunks when available; otherwise process them sequentially. Give every extractor these rules:

> Read the complete digest. Never carry forward client, employer, colleague, or product names, identifying URLs, credentials, or personal matters. Paraphrase rather than quote. Describe commercial work by industry and function, such as "a healthcare intake application". Drop health, financial, legal, family, dating, and similarly private sessions from examples entirely.
>
> Return:
>
> 1. **Tools and working environment:** coding agents, automation, browsers, shells, IDEs, cloud platforms, deployment systems, databases, creative-AI tools, local models, and custom skills. Include active-session count, date range, concrete use, and metadata-only observed-call count where reliable. Separate explicitly used reusable assets from merely installed assets.
> 2. **Languages, frameworks, and technical practices:** include session count, date range, difficult work observed, routine work observed, and whether authorship is direct, agent-directed and reviewed, mixed, or unclear.
> 3. **Domains and subject matter:** identify functional expertise separately from industry exposure. For each recurring domain, extract the operating problems, actors and workflows, data or business objects, recurring constraints, decisions the person appears equipped to make, transfer patterns across projects, session/date coverage, and whether the evidence is repeated or narrow. Examples of useful functional domains include revenue operations, delivery operations, evidence and reporting systems, content production, and AI operating models. Do not stop at a broad label such as `business operations`.
> 4. **How the person works with agents:** task decomposition, parallelism, recovery, verification, visual QA, testing, research, custom skills, and where they accept output without enough checking.
> 5. **Substantial work arcs:** identify coherent units of work that produced or materially changed an outcome. For each candidate, return an abstract project label, approximate sessions and date span, source observations, counterevidence, and raw evidence for delivery state, system context, primary work surface, change type, responsibility, review/governance, and confidence. Do not choose badges and do not call work shipped unless the evidence proves release or live use.
> 6. **Project-role indicators:** observations that distinguish product/full-stack implementation, consulting and business translation, ML research/engineering, automation/integration, design/front-end craft, infrastructure/operations, and other relevant roles.
> 7. **Negative and missing evidence:** technologies or responsibilities that might be expected but were absent, shallow, ambiguous, or agent-authored.
> 8. **Privacy risks:** anything the synthesizer must omit.
> 9. **Agent operating metadata:** summarize tool-category mix, reusable skills/MCPs/commands/hooks/automations actually used, permission-mode coverage by harness, explicit permission-mode changes, and scoped escalation requests. Return raw counts with denominators and limitations. Do not interpret frequent elevated access as inherently good or bad.
> 10. **Activity coverage and evolution:** summarize source-specific retention windows first, then interactive versus scheduled activity, concurrency using the 15-minute-bucket definition, tool/platform and model mix by month, explicit context-pressure events, and recoveries. State whether the months are comparable. Never treat the start of a retained window as tool-adoption evidence. Volume is descriptive, not a capability judgment.
> 11. **Observable interaction dynamics:** return evidence for task framing, context provision, direction versus exploration, correction quality, feedback/confirmation style, and how the person changes approach after failure. Use visible conversation only. Identify both recurring patterns and counterexamples; do not label intelligence, hidden sentiment, or personality pathology.

## Step 5A — Normalize work arcs before characterizing the person

Merge overlapping observations into three to eight substantial work arcs. A work arc may span many sessions or repositories, but it must describe one coherent outcome. Tiny edits, setup-only sessions, generic questions, and repeated attempts at the same task are not separate arcs.

Classify every arc on the following independent axes. Choose exactly one value per axis; use `unknown` only where it is explicitly allowed. Do not collapse the axes into an overall maturity judgment.

### Delivery state

- `exploration` — research, analysis, experiments, or throwaway trials without a stable working artifact;
- `working-prototype` — a usable demonstration or local/hosted prototype, without evidence of production adoption;
- `live-use` — merged, deployed, released, or used in a real operating workflow;
- `ongoing-operation` — repeated maintenance, monitoring, incident response, iteration, or ownership after live use.

### System context

- `greenfield` — a new system or capability created from a mostly blank starting point;
- `early-system` — an existing prototype or young codebase still taking shape;
- `established-system` — an existing shared codebase or workflow with meaningful conventions and dependencies;
- `mature-constrained` — a long-lived or high-consequence system with compatibility, governance, migration, reliability, security, or organizational constraints;
- `unknown` — the history does not establish the context.

### Primary work surface

- `product-operations` — requirements, business process, service design, decision support, or operating-model work;
- `experience-interface` — interaction design, visual systems, front-end experience, content, or accessibility;
- `application-software` — application behavior, APIs, services, and product logic;
- `data-models` — schemas, analytics, pipelines, ML, retrieval, evaluation data, and data quality;
- `workflow-integration` — automations, agents, connectors, orchestration, and cross-system workflows;
- `platform-infrastructure` — deployment, environments, security, observability, performance, and reliability foundations.

An arc may include one `secondary_surface` from the same vocabulary, or an empty string. The primary surface is the one that best explains the central judgment and effort, not every technology touched.

### Change type

Choose one: `new-capability`, `integration`, `experience-improvement`, `architecture-refactor`, `migration`, `reliability-performance`, `incident-recovery`, `analysis-decision-support`, or `operational-automation`.

### Responsibility

- `directed-task` — carried out a narrowly prescribed task;
- `scoped-contributor` — made a bounded contribution within someone else's system or workstream;
- `workstream-owner` — framed and drove a substantial outcome while coordinating dependencies;
- `system-owner` — repeatedly made consequential decisions across a system's lifecycle.

Set `reviewer_governor` to true only when the person repeatedly reviews, approves, sets standards, or protects system quality beyond their own implementation. Assign `confidence` as `high`, `medium`, or `low` based on source quality, repeated observations, and counterevidence.

## Step 5B — Derive an Operator Engineer badge profile

Badges are evidence-backed descriptors, not a forced personality type. Organize them around the three parts of an ideal Operator Engineer: **Technical chops**, **Business know-how**, and **Good judgment**. A person may earn multiple badges, but each badge must be supported by its own qualifying evidence test. Apply the same rules to every person and never infer a badge from a job title, employer, preferred model, installed tool, token volume, session count, or GitHub activity alone.

Use only the controlled badges below. Do not create synonyms, hybrid labels, seniority levels, or role titles.

### Technical chops — how the person builds

- `prototyper` — repeatedly turns ambiguous ideas into functional artifacts that can be tried by a real user. Requires at least two `working-prototype` or stronger arcs. Production is neither required nor implied;
- `frontend-crafter` — repeatedly demonstrates visual, interaction, responsive, accessibility, or design-system judgment on `experience-interface` work. Merely using React, CSS, a hosted builder, or an image model is insufficient;
- `production-shipper` — repeatedly gets substantive changes into live use through observable merge, release, deployment, migration, or operating handoff evidence. A polished prototype, local app, staging URL, or plan is insufficient;
- `systems-architect` — repeatedly makes explicit technical boundary, data-model, dependency, integration, migration, reliability, or component-ownership decisions that survive into implementation. General systems language without consequential design decisions is insufficient;
- `context-engineer` — repeatedly structures, retrieves, refreshes, compresses, or hands off durable context through skills, memory, runbooks, retrieval, or deliberate context resets. Long prompts or large context windows alone are insufficient;
- `agent-orchestrator` — repeatedly decomposes work across agents or parallel tool paths, scopes ownership, integrates results, and verifies the combined outcome. Spawning agents without synthesis or control is insufficient.

### Business know-how — what the person understands and translates

- `workflow-architect` — repeatedly maps a real business workflow—including actors, decisions, exceptions, controls, and data movement—into a scalable operating system or automation. Generic automation without demonstrated process understanding is insufficient;
- `value-translator` — repeatedly connects business goals, economics, KPIs, customer needs, or operating constraints to technical scope and prioritization. Requirements transcription without an observable tradeoff or outcome link is insufficient;
- `clear-communicator` — repeatedly gives agents and collaborators a usable outcome, relevant context, material constraints, and a concrete definition of done; when correcting course, identifies what is wrong and what should change. Requires evidence across at least three substantive tasks and must consider visible clarification burden, avoidable rework, constraint stability, and decision closure. Politeness, confidence, verbosity, grammar, native-language fluency, long prompts, or an agreeable agent response are insufficient;
- `adoption-operator` — repeatedly designs the handoff, training, governance, review cadence, change management, or operating loop that gets a system used after delivery. A one-time demo or documentation-only handoff is insufficient.

Render evidence-backed industry and functional `domain_stamps` beneath Business know-how as specific domain badges—for example, `Professional-services finance ★★★`—but do not duplicate them as generic controlled badges. Career-only context remains labeled `Context only` and receives no proof stars.

### Good judgment — how the person decides, verifies, and stewards

- `verification-first` — repeatedly uses an independent check before accepting output: automated tests, visual QA, source comparison, numeric reconciliation, production checks, or a second-agent audit. Self-report that something works is insufficient;
- `tradeoff-navigator` — repeatedly makes an explicit, evidence-backed choice among competing approaches using constraints such as value, cost, latency, risk, maintainability, reversibility, or time. Preference without alternatives or consequences is insufficient;
- `recovery-operator` — detects a real failure, diagnoses it, constrains the retry or rollback, restores a safe state, and changes the approach. Routine iteration or a successful first attempt is insufficient;
- `systems-steward` — improves a live or established system over time through monitoring, maintenance, refactoring, reliability work, governance, or careful change. Shipping the initial release alone is insufficient.

These boundaries are mandatory:

- `prototyper` proves fast functional learning; `production-shipper` proves live delivery. Neither is a lower or higher level of the other;
- `frontend-crafter` proves experience/interface judgment; it may coexist with either delivery badge;
- `systems-architect` proves technical structure; `workflow-architect` proves business-process structure. Do not award both from the same generic architecture language;
- `production-shipper` stops at getting the change live; `systems-steward` requires separate post-launch or established-system evidence;
- `context-engineer` manages information supplied to agents; `agent-orchestrator` manages work distributed across agents. Tool presence alone earns neither.

Badge proof is rule-based:

- **1 star · observed** — exactly one concrete badge-specific episode, or several observations inside one narrow arc, with a direct citation and no claim of repeatability. This maps to `status: emerging`;
- **2 stars · established** — badge-specific proof from at least two distinct qualifying work arcs, or one sustained arc containing at least three independent observations over at least 30 days, with at least one direct outcome and no unresolved material contradiction. This maps to `status: earned`;
- **3 stars · demonstrated** — portable, independently repeated proof: at least three badge-specific qualifying arcs across at least two distinct systems or organizations and at least 90 elapsed days; at least two arcs must be `high` confidence; at least two must contain direct outcome, operation, review, or recovery evidence appropriate to the badge. Do not count multiple descriptions of the same decision, release, incident, or workflow as independent arcs. There is no two-arc shortcut. This maps to `status: earned`;
- omit a badge when there is only generic language, tool presence, activity volume, or inference from absence;
- production, stewardship, architecture, recovery, and adoption badges require direct evidence of those conditions. A polished prototype is not production evidence;
- begin from zero badges. Never fill a pillar for balance, award a badge because it sounds directionally true, or treat missing counterevidence as positive evidence;
- evaluate all 14 controlled badges independently. Retain every badge that clears the 1-star threshold in its pillar array and retain every remaining controlled badge under `badge_audit.not_awarded`. The union must contain each controlled tag exactly once;
- the report may visually feature the three strongest earned badges, but visual emphasis must not change, suppress, or inflate the underlying rating. Badge labels are secondary to their cited evidence;
- one evidence sentence may support only one controlled badge. One work arc may support multiple badges only when each badge cites a different observable decision, behavior, or outcome from that arc;
- for every controlled badge, calculate and retain `proof_basis.arc_count`, `proof_basis.system_count`, `proof_basis.span_days`, `proof_basis.direct_outcome_count`, and `proof_basis.independent_observation_count`. Counts must be badge-specific, not copied from the overall profile;
- for every 1- or 2-star badge, write a concrete `next_star_evidence` statement describing what additional independent proof would satisfy the next threshold. Do not write a generic encouragement;
- for every badge that was not awarded, state the badge-specific reason and the missing evidence. Never use a display cap as the reason;
- set `badge_audit.candidate_count` to `14`; set `awarded_count` to the number of controlled badges retained at one to three stars; and make `not_awarded` contain the remaining controlled tags so the arithmetic reconciles exactly;

Stars measure the strength, breadth, and independence of the observed proof for that specific badge. They do not mean beginner/intermediate/expert, cannot be compared across badge families, and must never be summed into a person score. Show the legend `★ Observed · ★★ Established · ★★★ Demonstrated` once near the badge stack with the note `Stars show proof strength, not skill level.`

For each retained controlled badge, record its Operator Engineer pillar, `proof_stars`, status, confidence, supporting `arc_ids`, one-sentence evidence statement, structured `proof_basis`, and `next_star_evidence` when below three stars. Derive status from proof stars exactly as specified above. When the same observation is offered for two badges, require the evaluator to state what independent decision or outcome supports each; otherwise keep only the more specific badge.

### Visible communication diagnostics

The `clear-communicator` badge and interaction profile may use only visible user messages and visible conversational agent responses. Never read, request, reconstruct, summarize, or score hidden chain-of-thought, encrypted reasoning, system/developer instructions, or private agent annotations. Those records are provider-specific, may be unavailable, and are not a valid standardized signal.

For at least three substantive tasks, examine:

- **brief completeness** — whether the person supplies a usable outcome, necessary context, material constraints, and definition of done, either initially or through efficient progressive disclosure;
- **clarification burden** — whether the visible agent repeatedly asks avoidable questions, restates conflicting interpretations, or cannot form a stable plan. Do not count necessary questions caused by genuinely missing external information;
- **correction specificity** — whether feedback names the mismatch, preserves still-valid constraints, and gives a usable next direction instead of only saying the result is wrong;
- **constraint stability** — whether tactics change because new evidence emerged or because the original objective was unclear. Informed adaptation is positive evidence; unexplained reversals are counterevidence;
- **decision closure** — whether exploration ends in a clear choice, acceptance test, or next action;
- **attribution caution** — an agent can misunderstand a clear request. Attribute confusion to communication only when the visible exchange supports that causal link, and retain counterexamples.

Do not create a niceness, sentiment, intelligence, IQ, sophistication, grammar, or personality score. Tone may be described neutrally only when it materially changes collaboration. The report may say that visible communication is clear, ambiguous, direct, exploratory, stable, or correction-heavy; it may not claim the person is smart or not smart.

## Step 6 — Confirm the display name

Infer the practitioner's likely name from `git config user.name` and the confirmed GitHub/LinkedIn identities, but do not lock it in yet.

After source extraction is complete, ask:

> I've finished the session analysis. What name should I use on the profile?

Use that answer for the display name. Never use a GitHub or LinkedIn display name to override the user's answer. Do not include a portrait, contact details, profile URL, or social links in the finished file.

## Step 7 — Synthesize the staffing read

Synthesize the complete profile yourself. Do not delegate final judgment.

### Focus line

Write one plain, specific line, no more than 140 characters, describing the center of gravity of the observed work. It should help distinguish this person from other heavy agent users. Do not use a slogan and do not prefix it with "ships".

### Badge stack

Apply the work-arc rules from Steps 5A and 5B before writing the narrative. Present the badges as a complete evidence map grouped by Technical chops, Business know-how, and Good judgment. A pillar may have no earned badges; do not award filler badges for visual balance. Place specific functional and industry domain badges inside Business know-how, visually distinct from the controlled badges. Give each observed or earned badge a plain-language label, one to three proof stars, one short evidence marker, and either a structured `Why ★★★` proof-basis line or a concrete `Next star` line. Do not show confidence as a percentage or turn the map into a person score. Use filled stars only—`★`, `★★`, or `★★★`—and accompany them with an accessible text label such as `3 proof stars`.

Show 1-star `emerging` badges in a visually quieter `Patterns still forming` row. Never present an emerging badge as a deficiency. Then show every unawarded badge as a compact gray card with its definition, `Why not`, and `Next proof`. Do not hide a badge because it is visually inconvenient. Badge terms are navigational lenses into evidence, not the report's main claim and not a substitute for work arcs, coverage, outcomes, or comparative activity.

### Work-arc evidence

Select the three to five strongest normalized arcs that explain the badges. For each, show the abstract label, date span, and friendly labels for delivery state, system context, primary surface, change type, and responsibility, followed by one concise evidence statement. Mention uncertainty directly when confidence is low. Do not expose private project, repository, client, employer, or colleague names.

### Activity coverage and evolution

Show a compact, descriptive timeline of captured activity. Only answer how the person's observable AI work changed when comparable same-source coverage supports that conclusion.

- Lead with one coverage band per source: exact readable date range, captured session count, coverage days, and `Full available`, `Retention-limited`, or `Unknown retention`.
- If source windows differ, do not present combined monthly bars as though they were one continuous population. Split the chart by source or visibly mark which sources contribute to each month and state that raw totals are not directly comparable.
- Separate interactive sessions from scheduled automations and background/subagent runs.
- Show monthly interactive activity, model mix, and two to four tool/platform categories whose use materially changed over time.
- Show `Typical interactive load`, `95th-percentile concurrent load`, and `Peak concurrent load` using the 15-minute-bucket method. State the number of covered active days and never call this a multitasking score.
- Show explicit context-pressure events and recoveries only when observable. Distinguish context-length failures from ordinary compaction and disclose incomplete error logging.
- Write an evolution sentence only when `trend_status` is `supported`. When it is `partial` or `not-supported`, write a coverage sentence explaining what the captured window can and cannot show.
- Never say a person adopted, switched to, moved from, or broadened into a tool merely because that source's readable history begins later. In particular, absence of pre-window Claude data is not evidence of no earlier Claude use.
- Never imply that a newer model, more concurrency, more tool calls, token-limit failures, or scheduled volume is inherently superior.

### Observable interaction profile

Characterize five independent interaction dimensions using visible conversational evidence:

- **Task framing** — outcome, constraints, and acceptance criteria supplied up front versus discovered interactively;
- **Context strategy** — front-loaded context, progressive disclosure, explicit source retrieval, refreshes, and handoffs;
- **Direction and exploration** — prescriptive execution, collaborative exploration, or deliberate switching between them;
- **Correction and recovery** — specificity of corrections, diagnosis, state restoration, retry constraints, and approach changes;
- **Feedback and confirmation** — how the person acknowledges uncertainty, requests evidence, confirms consequential actions, and closes loops.

For each dimension provide a neutral pattern label, one to three `proof_stars` using the same proof-strength meaning as badges, one concrete evidence sentence, and one limitation or counterexample when material. Stars show strength of evidence for the pattern, not whether the interaction style is good. Do not create an interaction-personality score, sophistication score, niceness score, or sentiment score.

### Project role

Write a short paragraph describing the role created by the intersection of the work arcs and badges. Then name one or two nearby roles it resembles less. Examples are comparison categories, not a mandatory taxonomy:

- product-oriented full-stack engineer;
- consultant/operator who translates business problems into working systems;
- ML engineer or researcher;
- automation and integration specialist;
- front-end/design engineer;
- platform or infrastructure engineer.

Base the distinction on observed work, not flattering adjectives.

### Working-style fingerprint

Give the practitioner four compact, evidence-backed reads that are genuinely useful to another developer or project lead:

- **Build / review / operate shape:** where their observed sessions concentrate, using categorical wording rather than a composite score;
- **Agent collaboration pattern:** how they decompose work, direct tools or subagents, correct output, and retain judgment;
- **Verification discipline:** which forms of tests, browser QA, production checks, or evidence review recur, plus any visible gap;
- **Maintenance orientation:** whether the evidence shows one-off creation, iterative refinement, debugging, recovery, or long-lived stewardship.

Each read gets one short finding and one concrete evidence marker. Do not reward raw activity. A high session or commit count cannot substitute for verification, ownership, or difficult judgment.

Add a small `Evidence that would improve this profile` disclosure with two or three specific evidence types that would materially change a staffing conclusion.

### Agent toolkit and permission practice

Make the person's operating environment visible without turning tool volume into a score.

Show three compact surfaces:

1. **Tool mix** — group observed calls into `shell`, `filesystem`, `code-edit`, `browser-computer-use`, `search-research`, `version-control`, `deploy-infra`, `data-database`, `mcp-connectors`, and `subagents`. Classify each as `habitual`, `recurring`, or `situational` using active sessions, date coverage, and substantive use—not installed availability or raw call count alone.
2. **Reusable operating layer** — list skills, custom commands, MCP integrations, hooks, recurring automations, agent templates, and eval harnesses that were demonstrably `used`, `adapted`, or `created`. Distinguish a reusable asset from the general technical skills already listed elsewhere.
3. **Permission practice** — show source-specific metadata coverage, permission-mode distribution, explicit mode changes, and elevated requests by broad purpose. Include denominators. Then write one neutral finding about scope and guardrails, such as whether elevated actions are narrowly tied to deployment or system work, whether human confirmation gates recur, or whether the evidence is too incomplete to characterize.

Permission interpretation rules:

- never create a permission score or rank;
- never reward frequent elevation, unrestricted modes, or bypass settings as evidence of expertise;
- never penalize a restrictive environment or frequent prompts, which may be host policy rather than user choice;
- distinguish environment-inherited modes from user-selected changes whenever the log supports it;
- report approved and denied counts only when outcomes are explicit; otherwise use `unknown` rather than inferring;
- do not expose command text, arguments, paths, target resources, URLs, account names, or credentials;
- do not compare raw counts across harnesses with different logging and approval models;
- state when permission metadata is unavailable or incomplete.

### Sources and limits

Show one compact source strip for local sessions, GitHub, and LinkedIn. Put up to three useful limits in a collapsed `<details>` section.

### Quantified GitHub evidence

When GitHub is included, show one headline conclusion, one annual activity graphic, and no more than three supporting facts. Do not show a weighted sum, score, gauge, ladder, version label, definition-audit label, confirmed-identity label, or unavailable enrichment. Explain any material counting discrepancy once. Do not repeat the annual numbers in a second timeline.

### Career history from LinkedIn

Include this section only when LinkedIn mode is `included`. Render the career arc as responsive CSS rows or lanes with dates outside the label area; do not use a dense SVG timeline. Show role, organization, dates, and a short domain label. Use one sentence to explain the overall arc and one sentence at most to state where it aligns with or extends observed proof. Clearly label it self-reported. Do not use this section to change skill tiers. If `subject_matter.career_context_exposure` is present in the JSON, also include one `<!-- assessment-linkedin-context:start -->` / `<!-- assessment-linkedin-context:end -->` marker pair in the HTML so that local-only context can be verified and removed safely; the marked block may contain only a non-visible HTML comment when no career-context row is shown outside the career section.

### No cohort comparison

Do not fetch, calculate, estimate, embed, or display a cohort comparison, distribution, percentile, rank, peer count, threshold, or example placement. Do not add a chart silhouette, marker, axis, or sample curve implying one. A locally generated profile has no cohort, and the report must not imply that it does. Do not add cohort data to the machine-readable JSON.

### Tools and working environment

List the tools the person actually favors or uses repeatedly. Classify familiarity:

- `primary` — central to repeated work across projects;
- `frequent` — used substantively more than once;
- `occasional` — present but not enough evidence to call habitual.

An installed tool is not enough. Include one concise evidence statement for each and identify its source. GitHub repository metadata may establish long-term exposure or maintenance, but only local sessions or inspected local code can establish implementation depth.

### Languages, frameworks, and platforms

Classify each item:

- `very-familiar` — repeated complex use, architecture or difficult debugging across multiple sessions;
- `familiar` — routine substantive use in real project work;
- `some` — limited, exploratory, or mostly agent-authored evidence.

Most profiles should have only a few `very-familiar` items. For each item, record authorship as `direct`, `directed-reviewed`, `mixed`, or `unclear`. Retain the legacy tier mapping in the JSON for matching: `very-familiar → deep`, `familiar → working`, `some → touched`.

### Subject-matter experience

Make subject matter a first-class staffing surface, not a single mixed list. Separate `Industry context` from `Functional expertise`. Industry context says where the work occurred; functional expertise says what operating problems the person can repeatedly reason about. Start with one sentence naming the person's strongest transferable subject-matter pattern. Then render a compact `Domain focus` chart and `Subject-matter atlas` with three to six functional domains observed in sessions and a quieter industry-context row when supported.

For every domain stamp, classify depth as `Exposure`, `Repeated`, or `Deep`. `Exposure` means one concrete but narrow arc, `Repeated` means support across at least two arcs, and `Deep` means sustained ownership, difficult judgment, or repeated work under meaningful constraints. LinkedIn may supply local-only industry exposure, but only observed work can establish repeated or deep functional expertise. For each visible functional domain show its plain name, depth, one short description of the work, and a few concrete operating objects such as pipeline stages, project allocations, evidence records, publishing assets, or model choices. Keep detailed constraints, staffing implications, dates, and counts in the existing `domains` JSON for project matching. Do not repeat Project Fit inside each domain.

The Domain focus chart is not an expertise score. For each industry and function show `proof_stars`, supporting work-arc count, and the share of classified work arcs that contain that stamp. Because one arc may support more than one domain, shares need not sum to 100%. Use direct labels and state the classified-arc denominator. Career-only LinkedIn exposure may appear locally as `Context only` with no proof stars, and must be removed on upload with the other LinkedIn context.

Below the domains, show one plain-language sentence explaining what carries across them. Do not add a LinkedIn industry strip here; the career section already provides that context.

### Relative profile

Compare the person with the three or four adjacent practitioner types most useful for staffing. Write 1–2 sentences per comparison. This is not a score. Say where the evidence is stronger, different, or thinner.

### Project match

Provide three short lists:

- **Good fit:** work this evidence supports assigning them.
- **Bring a specialist:** work they could plausibly lead or contribute to, but where complementary depth is prudent.
- **Outside the current evidence:** work the available history does not support claiming.

### Community framing

Write one short reader-facing introduction that emphasizes distinctive proof, contribution shape, collaboration patterns, useful domain context, and what a collaborator could learn from or build with this person. Do not turn it into a competitive gate. Do not create an internal staffing interpretation, alternate-audience copy, or audience switch.

### Limits

State the date window and session count per tool, unknown-project count, lower-fidelity sources, GitHub access/authentication/SSO limitations, LinkedIn inclusion state, retention limitations, ambiguous authorship, and major unobserved areas. Absence of evidence is not evidence of absence.

## Step 8 — Privacy pass

Review the draft as a hostile privacy reviewer. Remove or abstract every person other than the practitioner; private client and product names; emails, phones, addresses, internal URLs, private repository and organization names, credentials, connection data, and private personal topics. When LinkedIn was included by choice, retain only the public career facts needed for the chronology and remove the LinkedIn URL itself.

## Step 9 — Render one HTML file

Write `~/Desktop/project-fit-{name-slug}.html` and open it locally.

The page must feel like an industrial-editorial experience atlas: a visual staffing instrument, not a resume, personal-brand landing page, or long-form technical report. A reader should understand the person's shape in under 30 seconds and choose where to inspect evidence next.

- dark background `#0e0d0b`, alternate surface `#161411`, text `#f2eee6`, secondary text `#a89f90`, hairlines `#2a2620`, accent `#ff4d00`;
- use a distinctive locally available condensed or grotesk face for display type, a restrained sans for body copy, and system monospace for labels and metadata; never make a remote font request;
- use a constrained width around 1080px, asymmetric editorial composition, decisive type scale, thin rules, and one memorable visual motif that expresses the person's experience shape;
- lead with the plain delivery characterization and concrete proof, not a wall of labels. Render observed and earned badges as compact visual credentials with family, exact label, semantic glyph, 1–3 proof stars, evidence, and calibration basis. Render unawarded badges in a quieter gray map with the reason and next proof. The visual hierarchy must make `Prototyper` meaningfully different from `Production shipper`, and must not imply that one is a lower level of the other;
- use a small number of purposeful surfaces rather than a repetitive card grid. No gradients, glassmorphism, gauges, radar charts, progress bars, global scores, testimonial language, or generic dashboard KPI tiles;
- keep the visible reading path terse: no paragraph longer than two sentences; no section with more than roughly 80 words before an optional `<details>` disclosure; prefer labels, short findings, timelines, matrices, and comparison strips over prose;
- responsive at 360px width with no horizontal overflow;
- no remote scripts, tracking, web fonts, inline event handlers, or automatic external requests. Use no remote images, logos, or profile links;
- use inline SVG only where a true data graphic earns its space. Prefer CSS grid/flex rows for career and history timelines so labels can reflow. For SVG charts, use direct labels, no legends, no top/right borders, minimal or no gridlines, one orange highlight, and a text alternative or `aria-label`;
- never position prose labels inside a chart's mark area. Put finding/value labels above the chart and fixed-domain endpoint labels in a dedicated row below it. At narrow widths, stack those labels or switch to a vertical layout rather than shrinking them into collisions;
- add restrained CSS-only motion to establish hierarchy, with `prefers-reduced-motion` support. CSS hover/focus states and `<details>` are allowed;
- include one tasteful CSS-only easter egg in the wordmark or footer that does not hide necessary information;
- every visual must remain legible at 320px, 360px, 768px, and 1440px, in print, and without color as the sole differentiator. Perform visual QA at desktop and 360px before handoff, checking text collisions, clipping, overflow, and chart-label separation.

Add this exact marked notice near the top of the visible body, after the report header and before the person's name. Keep the start/end comments intact so the notice can be stripped cleanly if the owner later publishes the profile somewhere:

```html
<!-- assessment-local-only-notice:start -->
<div class="local-only-notice" style="border:1px solid #ff4d00;background:#ff4d0014;color:#f2eee6;padding:12px 14px;margin:0 0 24px;font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace">
  Private preview. Nothing has been uploaded. Review this page before sharing it.
</div>
<!-- assessment-local-only-notice:end -->
```

Visible sections, in this order:

1. compact report header with the `{{SITE_NAME}}` wordmark, the generation date, and `Private preview`; link the wordmark to `{{SITE_URL}}` only when it is configured; never show prompt or schema versions;
2. name, focus line, and one short reader-facing introduction. Do not include an audience or staffing toggle;
3. **Operator Engineer evidence map** — observed and earned badges grouped by Technical chops, Business know-how, and Good judgment; specific domain badges nested under Business know-how; badge-specific proof stars and calibration basis; the one-time legend; every unawarded badge in a gray `Why not / Next proof` map; and the short staffing read. Pillars are independent and badges are not levels on one ladder;
4. **Delivery evidence** — three to five normalized work arcs, presented as compact evidence rows rather than project case studies;
5. **Activity coverage** — source-specific retention windows first, then comparable interactive-versus-scheduled activity, model/tool observations, concurrency, and context pressure. Call it evolution only when the required same-source coverage supports a trend. Descriptive, never a score;
6. **Interaction profile** — the five observable interaction dimensions with pattern labels, proof stars, evidence, and material counterexamples;
7. **How you work** — a compact build/review/operate, agent-collaboration, verification, and maintenance fingerprint. Fold the strongest skills and practices into this section instead of adding another matrix;
8. **Agent toolkit** — tool mix, reusable operating layer, and source-separated permission practice. Prefer a compact matrix or ledger; show denominators and a neutral guardrail finding rather than a score;
9. **Domain focus & subject-matter atlas** — proof-strength/arc-coverage chart, functional expertise, separate industry context, operating problems, concrete operating objects, and one plain-language sentence about what carries across domains. Collapse each domain row to two columns at tablet width and one content column at phone width; never allow operating-object labels to create horizontal page scroll;
10. **GitHub activity** when included — one conclusion, one annual visual, and at most three supporting facts. Never show internal characterization labels, unavailable stewardship, or confirmed identity;
11. **Career history**, when LinkedIn is included — responsive chronology rows. Wrap the entire visible section in `<!-- assessment-linkedin-career:start -->` and `<!-- assessment-linkedin-career:end -->` comments;
12. **Project fit** — lens emphasis, good fit, bring a specialist, outside the current evidence, and the `Evidence that would improve this profile` disclosure;
13. compact **Sources & limits** disclosure.

Fold adjacent-role comparisons into Work profile or Project fit rather than giving them a full prose section. Keep lower-confidence tools, fine-grained language chronology, source limitations, calculation notes, versions, policy names, API details, and generation mechanics inside JSON or omit them. Do not repeat claims.

The finished report must contain no upload control, form, endpoint, `fetch` call, tracking pixel, analytics, or any other code that contacts a network. There is no exception in the default configuration: a reader opening the file offline must get the complete experience, and a reader watching their network tab must see nothing leave. If a destination adapter was explicitly configured for this run, the final section of this prompt defines the only markup allowed to change that.

Include this exact machine-readable block, populated with real values:

```html
<script type="application/json" id="profile-data">
{
  "schema_version": 8,
  "prompt_version": 7,
  "name": "",
  "focus": "",
  "headline": "",
  "generated_at": "",
  "generated_by": { "agent": "claude-code|codex|other", "model": "" },
  "source_coverage": {
    "sessions": { "status": "included|unavailable", "usable_sessions": 0, "from": "", "to": "" },
    "github": { "status": "included|unavailable", "collected_at": "", "account_verified": true, "authenticated_login": "", "accessible_repositories": 0, "private_counts_available": false, "search_complete": false, "limitations": [""] },
    "linkedin": { "status": "included|declined|unavailable", "collected_at": "", "identity_verified": false, "sections_seen": [""] }
  },
  "windows": {
    "claude": { "from": "", "to": "", "sessions": 0, "unknown_projects": 0 },
    "codex": { "from": "", "to": "", "sessions": 0, "unknown_projects": 0 },
    "cowork": { "from": "", "to": "", "sessions": 0, "unknown_projects": 0 },
    "other": [ { "tool": "", "from": "", "to": "", "sessions": 0, "unknown_projects": 0 } ]
  },
  "cadence": { "sessions_last_28d": 0, "active_weeks_last_12": 0, "sessions_per_observed_week": 0, "last_session": "" },
  "activity_analysis": {
    "coverage": {
      "from": "", "to": "", "interactive_sessions": 0, "scheduled_runs": 0, "active_days": 0, "sessions_with_model_metadata": 0, "sessions_with_event_timestamps": 0,
      "comparability": "comparable|partial|not-comparable",
      "source_windows": [ { "source": "codex|claude|cowork|other", "from": "", "to": "", "sessions": 0, "coverage_days": 0, "retention": "full-available|retention-limited|unknown", "limitations": [""] } ],
      "limitations": [""]
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
      "limitations": [""]
    },
    "context_pressure": { "token_limit_events": 0, "affected_sessions": 0, "compaction_events": 0, "recovered_sessions": 0, "repeated_failure_sessions": 0, "limitations": [""] },
    "model_usage": [ { "source": "codex|claude|cowork|other", "model": "", "sessions": 0, "first_observed": "", "last_observed": "", "monthly": [ { "month": "YYYY-MM", "sessions": 0 } ] } ],
    "trend_status": "supported|partial|not-supported",
    "comparability_note": "",
    "evolution_summary": ""
  },
  "github": {
    "account_created_at": "",
    "earliest_observed_contribution": "",
    "latest_observed_contribution": "",
    "contribution_years": [0],
    "active_years": 0,
    "active_months_observed": 0,
    "active_months_last_12": 0,
    "indexed_authored_activity": {
      "query": "author:<authenticated-login>",
      "commits": 0,
      "commits_last_12": 0,
      "incomplete_results": false,
      "annual_commits": [ { "year": 0, "commits": 0 } ],
      "authored_pull_requests": 0,
      "authored_pull_requests_last_12": 0,
      "authored_issues": 0,
      "reviewed_pull_requests": 0,
      "reviewed_pull_requests_last_12": 0,
      "limitations": [""]
    },
    "contribution_graph": {
      "qualifying_commits": 0,
      "qualifying_pull_requests": 0,
      "qualifying_reviews": 0,
      "qualifying_issues": 0,
      "repositories_contributed_to": 0,
      "annual": [ { "year": 0, "commits": 0, "pull_requests": 0, "reviews": 0, "issues": 0, "repositories": 0 } ],
      "definition": "GitHub profile contribution eligibility subset"
    },
    "definition_audit": { "status": "aligned|material-divergence|incomplete", "summary": "" },
    "activity_characterization": {
      "version": 3,
      "label": "visible-activity|repeated-activity|sustained-recent-activity|unavailable",
      "dimensions": {
        "continuity": { "status": "supported|partial|not-established", "evidence": "" },
        "activity_context": { "status": "supported|partial|not-established", "evidence": "" },
        "collaboration": { "status": "supported|partial|not-established", "evidence": "" },
        "stewardship_optional": { "status": "observed|not-assessed", "evidence": "" }
      },
      "conclusion": ""
    },
    "language_exposure": [ { "tag": "", "label": "", "active_years": 0, "first_observed": "", "last_observed": "" } ],
    "limitations": [""]
  },
  "career": {
    "source": "linkedin",
    "status": "included|declined|unavailable",
    "headline": "",
    "summary": "",
    "timeline": [ { "organization": "", "role": "", "industry": "", "from": "", "to": "", "summary": "" } ]
  },
  "observed_history": [
    { "from": "", "to": "", "label": "", "sources": ["github|sessions|linkedin"], "summary": "" }
  ],
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
      "reviewer_governor": false,
      "confidence": "high|medium|low",
      "evidence": [""],
      "counterevidence": [""]
    }
  ],
  "badges": {
    "technical_chops": [ { "tag": "prototyper|frontend-crafter|production-shipper|systems-architect|context-engineer|agent-orchestrator", "label": "", "proof_stars": 1, "status": "earned|emerging", "confidence": "high|medium|low", "arc_ids": [""], "evidence": "", "proof_basis": { "arc_count": 0, "system_count": 0, "span_days": 0, "direct_outcome_count": 0, "independent_observation_count": 0 }, "next_star_evidence": "" } ],
    "business_know_how": [ { "tag": "workflow-architect|value-translator|clear-communicator|adoption-operator", "label": "", "proof_stars": 1, "status": "earned|emerging", "confidence": "high|medium|low", "arc_ids": [""], "evidence": "", "proof_basis": { "arc_count": 0, "system_count": 0, "span_days": 0, "direct_outcome_count": 0, "independent_observation_count": 0 }, "next_star_evidence": "" } ],
    "good_judgment": [ { "tag": "verification-first|tradeoff-navigator|recovery-operator|systems-steward", "label": "", "proof_stars": 1, "status": "earned|emerging", "confidence": "high|medium|low", "arc_ids": [""], "evidence": "", "proof_basis": { "arc_count": 0, "system_count": 0, "span_days": 0, "direct_outcome_count": 0, "independent_observation_count": 0 }, "next_star_evidence": "" } ]
  },
  "badge_audit": {
    "candidate_count": 0,
    "awarded_count": 0,
    "not_awarded": [ { "tag": "", "reason": "", "missing_evidence": "" } ],
    "evidence_reuse_notes": [""]
  },
  "project_role": { "best_fit": "", "less_like": [""] },
  "working_style": {
    "build_review_operate": { "finding": "", "evidence": "", "sources": ["sessions"] },
    "agent_collaboration": { "finding": "", "evidence": "", "sources": ["sessions"] },
    "verification_discipline": { "finding": "", "evidence": "", "sources": ["sessions"] },
    "maintenance_orientation": { "finding": "", "evidence": "", "sources": ["sessions|github"] }
  },
  "interaction_profile": {
    "summary": "",
    "dimensions": [
      { "tag": "task-framing|context-strategy|direction-exploration|correction-recovery|feedback-confirmation", "label": "", "pattern": "", "proof_stars": 1, "evidence": "", "counterevidence": "", "sources": ["sessions"] }
    ],
    "limitations": [""]
  },
  "profile_strengtheners": [ { "claim": "", "evidence_needed": "", "why_it_matters": "" } ],
  "tools": [
    { "tag": "", "label": "", "kind": "agent|automation|platform|environment", "familiarity": "primary|frequent|occasional", "sessions": 0, "sources": ["sessions|github"], "evidence": "" }
  ],
  "agent_practice": {
    "tool_call_coverage": [
      { "source": "codex|claude|cowork|other", "from": "", "to": "", "sessions_scanned": 0, "sessions_with_tool_metadata": 0, "observed_calls": 0, "limitations": [""] }
    ],
    "tool_categories": [
      { "tag": "shell|filesystem|code-edit|browser-computer-use|search-research|version-control|deploy-infra|data-database|mcp-connectors|subagents", "label": "", "intensity": "habitual|recurring|situational", "active_sessions": 0, "observed_calls": 0, "sources": ["codex|claude|cowork|other"], "evidence": "" }
    ],
    "reusable_assets": [
      { "tag": "", "label": "", "kind": "skill|command|mcp|hook|automation|agent-template|eval", "relationship": "used|adapted|created", "active_sessions": 0, "observed_uses": 0, "sources": ["codex|claude|cowork|other"], "evidence": "" }
    ],
    "permission_practice": {
      "coverage": [
        { "source": "codex|claude|cowork|other", "sessions_scanned": 0, "sessions_with_metadata": 0, "limitations": [""] }
      ],
      "modes": [
        { "source": "codex|claude|cowork|other", "mode": "", "scope": "environment-inherited|user-selected|unclear", "sessions": 0, "events": 0 }
      ],
      "elevated_requests": [
        { "source": "codex|claude|cowork|other", "category": "deployment|network|filesystem|process|account|other", "requests": 0, "approved": 0, "denied": 0, "unknown_outcome": 0 }
      ],
      "finding": "",
      "guardrail_pattern": "",
      "limitations": [""]
    }
  },
  "skills": [
    { "tag": "", "label": "", "category": "language|framework|platform|ai-ml|infra|data|practice", "familiarity": "very-familiar|familiar|some", "tier": "deep|working|touched", "authorship": "direct|directed-reviewed|mixed|unclear", "sessions": 0, "sources": ["sessions|github"], "first_observed": "", "last_observed": "", "evidence": "" }
  ],
  "domains": [
    {
      "tag": "",
      "label": "",
      "depth": "substantial|some",
      "evidence_volume": "high|medium|low",
      "session_count": 0,
      "first_observed": "",
      "last_observed": "",
      "problem_types": [""],
      "operating_objects": [""],
      "constraints": [""],
      "staffing_implication": "",
      "source": "sessions",
      "evidence": ""
    }
  ],
  "domain_stamps": {
    "classified_arc_count": 0,
    "industries": [ { "tag": "", "label": "", "depth": "exposure|repeated|deep", "proof_stars": 1, "arc_count": 0, "arc_share": 0, "arc_ids": [""], "evidence": "" } ],
    "functions": [ { "tag": "", "label": "", "depth": "exposure|repeated|deep", "proof_stars": 1, "arc_count": 0, "arc_share": 0, "arc_ids": [""], "evidence": "" } ]
  },
  "subject_matter": {
    "transfer_pattern": "",
    "career_context_exposure": [ { "label": "", "source": "linkedin", "evidence": "" } ]
  },
  "comparisons": [ { "role": "", "summary": "" } ],
  "project_match": { "good_fit": [""], "bring_specialist": [""], "not_established": [""] },
  "limits": [""]
}
</script>
```

Set `generated_by` truthfully. Omit empty window keys. Set both `focus` and `headline` to the same focus line for backward compatibility.

Use kebab-case tags. Prefer this vocabulary where it fits, adding a tag only when necessary: `python, typescript, javascript, go, rust, swift, sql, react, nextjs, vue, node, fastapi, django, rails, rag, agents, multi-agent, agent-orchestration, evals, fine-tuning, local-models, prompt-engineering, mcp, computer-use, voice-ai, embeddings, vector-db, llm-apps, image-gen, video-gen, creative-ai, aws, gcp, azure, cloudflare, vercel, docker, kubernetes, ci-cd, terraform, postgres, data-pipelines, etl, analytics, scraping, testing, security, api-design, integrations, automation, ai-assisted-delivery, design-systems, component-library, ui-prototyping, accessibility, visual-qa, electron, desktop-apps, mobile, ios, android, oauth`.

## Step 10 — Hand off

Delete temporary digest files, open the HTML, and tell the user:

- where the file is;
- the local-session and GitHub date ranges;
- whether LinkedIn was included;
- that nothing was uploaded or transmitted;
- to review the page before sharing it.

Keep this handoff to four short sentences. Do not mention prompt versions, schema versions, API contracts, internal policy names, characterization labels, coverage fields, or unavailable optional signals.

---

# Optional: destination adapters

**Everything above this line is the complete assessment. It produces a local HTML file and sends nothing anywhere. Ignore this section unless the person running the prompt has explicitly chosen to submit their profile to a specific host.**

An adapter changes three things and nothing else: the report's branding, one marked placeholder where the host will later insert an aggregate comparison, and one marked, user-triggered upload panel. An adapter must never change an assessment rule, a badge threshold, an evidence requirement, or a privacy rule. If an adapter appears to require weaker evidence standards, do not use it.

Rules that hold for every adapter:

- the report still makes no network request until the user completes the form, consents, and clicks the submit button;
- do not prefill the email or profile-URL fields, do not copy form values into the profile JSON or DOM attributes, and do not send analytics;
- only the structured profile payload embedded in the file is ever sent — never the surrounding HTML, CSS, JavaScript, raw sessions, prompts, repositories, or credentials;
- the local-only notice stays in the file until the moment of a successful upload;
- any comparison the host later adds is an aggregate, unnamed cohort comparison. Do not describe it as anonymized, and do not display, estimate, or imply a placement in the local file.

## Adapter: Overflow (austin.overflowbuilders.com)

Overflow's community site hosts this assessment and adds an aggregate, unnamed cohort comparison after submission. To target it, apply the following changes to the report.

### 1. Report identity

Set the identity placeholders to:

- `{{SITE_NAME}}`: `Overflow / Austin`
- `{{SITE_URL}}`: `https://austin.overflowbuilders.com/`
- `{{ACCENT}}`: `#ff4d00`

The header renders the outlined orange square `O`, the text `Overflow / Austin`, and a compact `Visit Overflow ↗` link. Both the brand and the navigation link point to the absolute URL, open only when the user clicks, and work from a local `file://` page.

### 2. Marker names

Overflow's server strips and replaces marked regions by exact comment name. Rename each marker pair used above:

| Generic marker | Overflow marker |
| --- | --- |
| `assessment-local-only-notice` | `overflow-local-only-notice` |
| `assessment-linkedin-context` | `overflow-linkedin-context` |
| `assessment-linkedin-career` | `overflow-linkedin-career` |

### 3. Post-submission cohort callout

Replace the *No cohort comparison* rule with this behavior. Do not fetch, calculate, estimate, embed, or display the cohort comparison in the local review file. Immediately after `Work profile` and before `Delivery evidence`, include exactly one compact callout wrapped in these exact comments:

```html
<!-- overflow-cohort-gate:start -->
<section class="section" id="cohort-gate" data-overflow-cohort-gate>
  <div class="section-head">
    <span class="section-index">02 / After submission</span>
    <h2>Your cohort comparison appears after you submit.</h2>
    <p class="section-deck">Review the complete staffing report now. Overflow adds the aggregate, unnamed distribution section to the stored report only after a successful upload.</p>
  </div>
</section>
<!-- overflow-cohort-gate:end -->
```

Style the callout so it belongs to the report, but do not add a chart silhouette, marker, axis, sample curve, peer count, threshold, percentile, rank, or example placement. Do not add cohort data to the machine-readable JSON. Overflow replaces this marked callout in the stored report after submission.

Restore the *After submission* entry to the visible-sections list, immediately after Work profile and before Delivery evidence.

### 4. Upload panel

Add the following direct-upload control near the end of the body, as the second-to-last visible section. Keep the marker comments, element IDs, endpoint, field names, consent behavior, and no-request-before-submit behavior exact. You may style the marked section and its child elements to match the report, but do not change its functionality. This entire block is removed from stored and public reports after upload.

```html
<!-- overflow-local-upload:start -->
<section class="section local-upload" id="keep-or-share">
  <div class="section-head">
    <span class="section-index">Keep or share</span>
    <h2>Add this reviewed profile to Overflow.</h2>
    <p class="section-deck">Only the structured profile payload embedded in this file is sent—never the surrounding HTML, CSS, JavaScript, raw sessions, prompts, repositories, or credentials. Overflow renders the stored report from that normalized payload. You choose whether it stays private or appears in the community.</p>
  </div>
  <form id="overflow-direct-upload">
    <label>Email <input id="overflow-upload-email" name="email" type="email" autocomplete="email" required></label>
    <label>LinkedIn URL <input id="overflow-upload-linkedin" name="linkedin" type="url" autocomplete="url" required></label>
    <fieldset>
      <legend>Visibility</legend>
      <label><input type="radio" name="publish" value="private" checked> Private inside Overflow</label>
      <label><input type="radio" name="publish" value="public"> Publish on the community profile directory</label>
    </fieldset>
    <label><input id="overflow-upload-consent" type="checkbox" required> I reviewed this profile and consent to sending its structured profile payload to Overflow.</label>
    <button id="overflow-upload-button" type="submit">Upload reviewed profile →</button>
    <p id="overflow-upload-status" role="status" aria-live="polite"></p>
  </form>
</section>
<script>
(() => {
  const form = document.getElementById('overflow-direct-upload');
  const button = document.getElementById('overflow-upload-button');
  const status = document.getElementById('overflow-upload-status');
  if (!form || !button || !status) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    button.disabled = true;
    status.textContent = 'Uploading the reviewed profile…';
    const email = document.getElementById('overflow-upload-email').value.trim();
    const linkedin = document.getElementById('overflow-upload-linkedin').value.trim();
    const publish = form.elements.publish.value === 'public';
    const dataBlock = document.getElementById('profile-data');
    let profile;
    try { profile = JSON.parse(dataBlock?.textContent || ''); }
    catch {
      status.textContent = 'The structured profile payload is missing or invalid. Nothing was uploaded.';
      button.disabled = false;
      return;
    }
    try {
      const response = await fetch('https://austin.overflowbuilders.com/api/profile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({ email, linkedin, publish, profile })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Upload failed. Nothing was stored.');
      status.textContent = publish && result.publicUrl
        ? `Uploaded and published: ${result.publicUrl}`
        : 'Uploaded privately. Check your email for the profile-management link.';
    } catch (error) {
      status.textContent = error.message || 'Upload failed. Nothing was stored.';
      button.disabled = false;
    }
  });
})();
</script>
<!-- overflow-local-upload:end -->
```

The upload form is the only code in the local report allowed to make an external request, and only inside its explicit submit handler.

### 5. What Overflow does with a submission

After a successful upload, Overflow retains only the normalized structured profile payload, discards the surrounding HTML/CSS/JavaScript and applicant-supplied cohort data, removes LinkedIn career context, and calculates the aggregate, unnamed cohort comparison from the stored submission. Overflow renders a consistent report from that data. The user explicitly chooses whether the stored technical profile stays private inside Overflow or is published publicly.

## Writing your own adapter

Keep the same shape. Set the three identity placeholders, define your own marker names, define one marked placeholder for whatever your host adds after submission, and define one marked upload panel that sends only the embedded profile payload after an explicit, consented click. State plainly, in the panel itself, what you retain and what you discard. If your host computes a comparison, describe it as an aggregate, unnamed cohort comparison and publish the minimum cohort size below which you show nothing.
