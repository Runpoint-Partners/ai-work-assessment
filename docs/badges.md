# Legacy schema-v8 badge reference

Assessment v8 and profile schema v9 do not generate or display badges. This file remains only for validating and explaining older schema-v8 reports.

# The badge system

Badges name what your work shows across three parts of an ideal operator engineer: **technical chops**, **business know-how**, and **good judgment**. Each badge is a navigational lens into cited work — not a substitute for the proof behind it.

Fourteen badges, no ladder. A person can earn several. Stars show how strong the proof is for each one, never seniority, rank, or a combined score.

```
★    Observed        ★★   Established        ★★★  Demonstrated
```

**Stars show proof strength, not skill level.**

---

## Why this exists

Resumes, titles, portfolios, and raw code increasingly fail to show how someone actually works with AI. This assessment looks instead for observable decisions, repeated behaviors, and outcomes across real work.

- **Real work over self-report.** Work arcs and outcomes carry more weight than claimed expertise, job titles, or a list of installed tools.
- **Behavior over volume.** Activity and cadence provide context but never become a capability score. What matters is what the person chose, changed, checked, and shipped.
- **Evidence over labels.** Every badge must point back to badge-specific proof. A missing badge means the retained evidence did not clear its gate — not that the person lacks the ability.

**Visible evidence only.** The evaluator never reads or reconstructs private chain-of-thought. It inspects visible requests, clarification, revisions, tool use, verification, recovery, and decision closure. It must preserve counterexamples, distinguish the person's choices from an agent's mistakes, and label every coverage gap.

## How the assessment works

Raw histories stay on the machine. Only a finished, owner-reviewed profile ever goes anywhere, and only if the owner decides to send it.

1. **Choose sources.** You select which agent histories, GitHub activity, and optional career context to include. Every source gets a dated coverage window.
2. **Extract locally.** The evaluator reads retained evidence on your machine and separates observed work from self-reported context.
3. **Build work arcs.** Related sessions become real work arcs with a problem, decisions, artifacts, outcomes, dates, and a confidence level.
4. **Apply badge gates.** All fourteen badges begin at zero. Qualifying proof, independent observations, outcomes, time span, and counterevidence determine each result.
5. **Show the whole map.** Awarded badges, unawarded badges, coverage limits, and the proof needed for the next star are shown together.
6. **Owner review.** You check sensitive abstractions and factual claims, then decide whether to keep the HTML local or share it.

## How to read a result

A badge is a compact index into evidence. It is useful only when its definition, proof, limits, and counterevidence travel with it.

**What a badge says**

- **A defined behavior was observed.** The evidence clears the badge's positive gate.
- **The pattern has a stated proof strength.** Stars describe breadth, independence, outcomes, and time span.
- **The claim is inspectable.** A reader can follow it back to specific work arcs and see the closest misses.
- **The result is bounded by the source window.** It describes the evidence available for this run.

**What a badge does not say**

- **It is not an intelligence, personality, or seniority score.** Confidence, polish, verbosity, and native fluency are not proxies.
- **It is not a hiring decision or certification.** It is a structured conversation starter about demonstrated work.
- **It is not a complete career history.** Local tools retain different amounts of history, and missing evidence is not negative evidence.
- **It is not a ranking of human worth or potential.** Stars are never combined into one universal score.

---

## The three pillars

### Technical chops

How the person builds. These distinguish functional learning, interface craft, live delivery, technical structure, context management, and multi-agent coordination.

| Badge | Serial |
| --- | --- |
| Prototyper | T-01 |
| Frontend Crafter | T-02 |
| Production Shipper | T-03 |
| Systems Architect | T-04 |
| Context Engineer | T-05 |
| Agent Orchestrator | T-06 |

### Business know-how

What the person understands and translates. Specific industry and functional domain badges appear here too, rather than masquerading as generic technical skill.

| Badge | Serial |
| --- | --- |
| Workflow Architect | B-01 |
| Value Translator | B-02 |
| Clear Communicator | B-03 |
| Adoption Operator | B-04 |

### Good judgment

How the person decides, verifies, recovers, and cares for systems over time. These require observable decisions, not confident language.

| Badge | Serial |
| --- | --- |
| Verification-First | J-01 |
| Tradeoff Navigator | J-02 |
| Recovery Operator | J-03 |
| Systems Steward | J-04 |

---

## What one through three stars means

Stars describe the breadth, independence, and confidence of the evidence for one badge. They are not beginner/intermediate/expert and are never added into a person score.

| | Level | Requires |
| --- | --- | --- |
| ★ | **Observed** | One concrete badge-specific episode, or several observations inside one narrow arc. Proves occurrence, not repeatability. Maps to `status: emerging`. |
| ★★ | **Established** | At least two distinct qualifying arcs, or one sustained 30+ day arc with three independent observations; at least one direct outcome and no unresolved material contradiction. |
| ★★★ | **Demonstrated** | At least three badge-specific arcs across two systems or organizations and 90+ days, with two high-confidence arcs and two direct outcomes. There is no two-arc shortcut. |

## How badges stay honest

Not everyone should get everything. The assessment starts at zero for all fourteen badges and has to earn its way to each one.

- **Every badge gets a verdict.** All fourteen are rated or explicitly not awarded, so nothing plausible quietly disappears. A missing badge means the evidence did not clear that gate — not that you lack the ability. A whole pillar may come back empty.
- **Evidence is spent once.** One piece of evidence supports one badge. The same work arc counts twice only when it shows two genuinely different decisions or outcomes. What you read is the real rating; nothing is boosted or muted to make the layout look even.
- **The near misses are shown.** Contradictions and closest misses get inspected and kept. Every one- or two-star badge tells you exactly what additional evidence would earn the next star.

The validator enforces the arithmetic: a profile is rejected if the rated badges and the not-awarded audit do not together cover all fourteen controlled tags exactly once, if a badge is rated without a structured proof basis, or if a badge below three stars omits its next-star requirement.

---

## What each badge requires

Every badge has a positive gate and a specific "not enough" rule. The assessment must cite qualifying work arcs and independent observations, then check the disqualifier before awarding stars.

### Technical chops

**Prototyper**
*Qualifies:* repeatedly turns ambiguous ideas into functional artifacts a real user can try; two working-prototype-or-stronger arcs.
*Not enough:* mockups, plans, isolated experiments, or tool usage without a usable artifact.

**Frontend Crafter**
*Qualifies:* recurring visual, interaction, responsive, accessibility, or design-system judgment on interface work.
*Not enough:* React/CSS presence, hosted builders, generated imagery, or a polished screenshot without demonstrated decisions.

**Production Shipper**
*Qualifies:* repeatedly gets substantive changes into real use with merge, release, deployment, migration, or handoff evidence.
*Not enough:* local apps, staging links, prototypes, plans, or "ready to ship" claims.

**Systems Architect**
*Qualifies:* repeated consequential decisions about technical boundaries, data models, dependencies, integrations, migrations, or reliability that survive implementation.
*Not enough:* general systems language, broad ownership, diagrams, or technology selection without a consequential design decision.

**Context Engineer**
*Qualifies:* repeatedly structures, retrieves, refreshes, compresses, or hands off durable agent context through reusable mechanisms.
*Not enough:* long prompts, a large context window, copied background, or an installed memory tool.

**Agent Orchestrator**
*Qualifies:* decomposes work across agents, scopes ownership, integrates results, and verifies the combined outcome.
*Not enough:* spawning subagents, parallel calls, or token volume without synthesis and control.

### Business know-how

**Workflow Architect**
*Qualifies:* maps actors, decisions, exceptions, controls, and data movement into a scalable business workflow or automation.
*Not enough:* generic automation, a connector, or a linear happy-path script without real process understanding.

**Value Translator**
*Qualifies:* repeatedly connects goals, economics, KPIs, customer needs, or operating constraints to technical scope and priority.
*Not enough:* requirements transcription, strategy language, or stakeholder contact without an observable outcome link or tradeoff.

**Clear Communicator**
*Qualifies:* across three substantive tasks, supplies a usable outcome, relevant context, constraints, and definition of done; corrections are specific and exploration closes in a decision.
*Not enough:* politeness, confidence, verbosity, grammar, native fluency, long prompts, agent agreement, or one unusually good brief.

**Adoption Operator**
*Qualifies:* repeatedly designs handoff, training, governance, review cadence, change management, or the operating loop after delivery.
*Not enough:* a demo, documentation alone, launch messaging, or a one-time handoff.

### Good judgment

**Verification-First**
*Qualifies:* repeatedly uses independent checks before acceptance: tests, visual QA, source comparison, reconciliation, production checks, or second-agent audit.
*Not enough:* the producing agent saying it works, casual review, or one check performed only after failure.

**Tradeoff Navigator**
*Qualifies:* repeatedly chooses among real alternatives using value, cost, latency, risk, maintainability, reversibility, or time.
*Not enough:* preferences, tool loyalty, changing tactics without new evidence, or a decision with no stated consequence.

**Recovery Operator**
*Qualifies:* detects a real failure, diagnoses it, constrains retry or rollback, restores safe state, and changes the approach.
*Not enough:* ordinary iteration, repeated retries, or a successful first attempt.

**Systems Steward**
*Qualifies:* improves a live or established system over time through monitoring, maintenance, refactoring, reliability, or governance.
*Not enough:* shipping the initial release, claiming ownership, or returning once for an isolated fix.

---

## System rule

The three pillars are collectively broad, while every badge has a separate evidence test.

- **Prototyper is not a junior Production Shipper.** One proves fast functional learning; the other proves live delivery. Neither is a level of the other.
- **Systems Architect is technical structure; Workflow Architect is business-process structure.** Do not award both from the same generic architecture language.
- **Production Shipper gets work live; Systems Steward proves separate post-launch care.**
- **Context Engineer manages information supplied to agents; Agent Orchestrator manages work distributed across agents.** Tool presence alone earns neither.

Domain badges — specific industry and functional stamps such as *Professional-services finance ★★★* — render beneath Business know-how. They are evidence-backed domain proof, not generic controlled badges. Career-only context carries no proof stars and is labeled *Context only*.
