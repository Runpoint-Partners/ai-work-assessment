// Vendored from the Overflow site: public/apply/profile-template.mjs
// GENERATED FILE — do not edit by hand. Fix it upstream, then run:
//   node scripts/sync-from-overflow.mjs
// De-branding transforms and integrity hashes live in SYNC-MANIFEST.json.

const SITE_URL = "https://austin.overflowbuilders.com";
const PROFILE_V9_TOP_LEVEL_KEYS = new Set([
  "schema_version", "prompt_version", "name", "focus", "headline", "generated_at", "generated_by",
  "collection_summary", "source_coverage", "windows", "cadence", "activity_analysis", "github", "work_arcs",
  "skills", "agent_practice", "domain_stamps", "project_role", "working_style", "interaction_profile",
  "project_match", "limits", "profile_view", "evidence_index", "matching_index",
]);
const PRIVATE_REFERENCE_PATTERNS = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b(?:https?|ftp|git):\/\/[^\s"']+/i,
  /\bgit@[a-z0-9.-]+:[^\s"']+/i,
  /\b(?:www\.)?(?:linkedin|github)\.com\/[^\s"']+/i,
  /\b(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?\/[^\s"']+/i,
  /(?:\/Users\/[^\s"']+|\/home\/[^\s"']+|[A-Za-z]:\\Users\\[^\s"']+)/i,
];
const RAW_PRIVATE_KEYS = new Set([
  "raw_prompt", "raw_transcript", "transcript", "messages", "private_url", "profile_url", "authenticated_login",
]);

export function profileV9PrivacyErrors(profile) {
  if (!isRecord(profile)) return ["Schema v9 profile data must be an object."];
  const errors = [];
  if (profile.schema_version !== 9 || profile.prompt_version !== 8) errors.push("Schema v9 rendering requires numeric schema_version 9 and prompt_version 8.");
  if (!isRecord(profile.profile_view?.hero) || !isRecord(profile.profile_view?.agent_footprint) || !isRecord(profile.profile_view?.agent_practice) || !Array.isArray(profile.profile_view?.industries) || !Array.isArray(profile.profile_view?.subject_matter) || !isRecord(profile.profile_view?.matching) || !Array.isArray(profile.evidence_index) || !isRecord(profile.matching_index)) errors.push("Schema v9 rendering requires the complete profile view, evidence index, and matching index.");
  const heroThesis = value(profile.profile_view?.hero?.thesis);
  if (value(profile.focus) !== heroThesis || value(profile.headline) !== heroThesis) errors.push("Schema v9 focus and headline must equal the hero thesis.");
  const mix = profile.profile_view?.agent_footprint?.normalized_mix;
  if (isRecord(mix)) {
    for (const key of ["calendar_days", "total_sessions"]) if (typeof mix[key] !== "number" || !Number.isFinite(mix[key])) errors.push(`Schema v9 ${key} must be a JSON number.`);
    list(mix.items).forEach((item, index) => {
      for (const key of ["sessions", "share", "sessions_per_calendar_day"]) if (typeof item?.[key] !== "number" || !Number.isFinite(item[key])) errors.push(`Schema v9 mix item ${index} ${key} must be a JSON number.`);
    });
  }
  const unknown = Object.keys(profile).filter((key) => !PROFILE_V9_TOP_LEVEL_KEYS.has(key));
  if (unknown.length) errors.push(`Schema v9 profile data contains unknown top-level keys: ${unknown.join(", ")}.`);
  validateVisibleShapeKeys(profile, errors);
  const visit = (item, key = "") => {
    if (RAW_PRIVATE_KEYS.has(key)) errors.push(`Schema v9 profile data cannot retain raw source fields (${key}).`);
    if (typeof item === "string") {
      if (PRIVATE_REFERENCE_PATTERNS.some((pattern) => pattern.test(item))) errors.push("Schema v9 profile data cannot retain email addresses, source URLs, repository paths, or private links.");
    } else if (Array.isArray(item)) item.forEach((child) => visit(child, key));
    else if (isRecord(item)) Object.entries(item).forEach(([childKey, child]) => visit(child, childKey));
  };
  visit(profile);
  return [...new Set(errors)];
}

function validateVisibleShapeKeys(profile, errors) {
  const view = isRecord(profile.profile_view) ? profile.profile_view : {};
  knownKeys(view, ["hero", "agent_footprint", "agent_practice", "industries", "subject_matter", "matching", "limits"], "profile_view", errors);
  knownKeys(view.hero, ["thesis", "source_note", "evidence_ids"], "profile_view.hero", errors);
  knownKeys(view.agent_footprint, ["normalized_mix"], "profile_view.agent_footprint", errors);
  const mix = view.agent_footprint?.normalized_mix;
  if (isRecord(mix)) {
    knownKeys(mix, ["from", "to", "calendar_days", "total_sessions", "items", "limitations", "evidence_ids"], "profile_view.agent_footprint.normalized_mix", errors);
    list(mix.items).forEach((item, index) => knownKeys(item, ["source", "sessions", "share", "sessions_per_calendar_day"], `profile_view.agent_footprint.normalized_mix.items[${index}]`, errors));
  }
  const practice = isRecord(view.agent_practice) ? view.agent_practice : {};
  knownKeys(practice, ["role", "statistics", "workflow", "distinctive_fact", "reusable_system", "limitation"], "profile_view.agent_practice", errors);
  ["role", "distinctive_fact", "reusable_system", "limitation"].forEach((key) => knownKeys(practice[key], ["summary", "evidence_ids"], `profile_view.agent_practice.${key}`, errors));
  list(practice.statistics).forEach((item, index) => knownKeys(item, ["tag", "label", "value", "source_field", "evidence_ids"], `profile_view.agent_practice.statistics[${index}]`, errors));
  list(practice.workflow).forEach((item, index) => knownKeys(item, ["label", "summary", "evidence_ids"], `profile_view.agent_practice.workflow[${index}]`, errors));
  list(view.industries).forEach((item, index) => knownKeys(item, ["tag", "label", "context", "career_context", "observed_work", "depth", "sources", "evidence_ids"], `profile_view.industries[${index}]`, errors));
  list(view.subject_matter).forEach((item, index) => knownKeys(item, ["tag", "label", "summary", "evidence_label", "evidence_ids"], `profile_view.subject_matter[${index}]`, errors));
  const matching = isRecord(view.matching) ? view.matching : {};
  knownKeys(matching, ["strongest_fit", "add_specialist", "not_shown"], "profile_view.matching", errors);
  ["strongest_fit", "add_specialist", "not_shown"].forEach((key) => knownKeys(matching[key], ["label", "summary", "evidence_ids"], `profile_view.matching.${key}`, errors));
  list(view.limits).forEach((item, index) => knownKeys(item, ["summary", "evidence_ids"], `profile_view.limits[${index}]`, errors));
  list(profile.evidence_index).forEach((item, index) => knownKeys(item, ["id", "source", "kind", "summary", "from", "to", "arc_ids"], `evidence_index[${index}]`, errors));
  const matchingIndex = isRecord(profile.matching_index) ? profile.matching_index : {};
  knownKeys(matchingIndex, ["industries", "capabilities", "delivery_states", "risk_gaps"], "matching_index", errors);
  list(matchingIndex.industries).forEach((item, index) => knownKeys(item, ["tag", "label", "depth", "sources", "evidence_ids"], `matching_index.industries[${index}]`, errors));
  list(matchingIndex.capabilities).forEach((item, index) => knownKeys(item, ["tag", "label", "depth", "authorship", "arc_ids", "evidence_ids"], `matching_index.capabilities[${index}]`, errors));
  list(matchingIndex.delivery_states).forEach((item, index) => knownKeys(item, ["state", "arc_count", "arc_ids", "evidence_ids"], `matching_index.delivery_states[${index}]`, errors));
  list(matchingIndex.risk_gaps).forEach((item, index) => knownKeys(item, ["tag", "label", "status", "implication", "evidence_ids"], `matching_index.risk_gaps[${index}]`, errors));
}

function knownKeys(valueToCheck, allowed, path, errors) {
  if (!isRecord(valueToCheck)) return;
  const unknown = Object.keys(valueToCheck).filter((key) => !allowed.includes(key));
  if (unknown.length) errors.push(`${path} contains unknown fields: ${unknown.join(", ")}.`);
}

export function assertSafeProfileV9ForRender(profile) {
  const errors = profileV9PrivacyErrors(profile);
  if (errors.length) throw new Error(`Unsafe schema v9 profile: ${errors.join(" ")}`);
}

/**
 * Render the fixed schema-v9 profile document. The assessment supplies data and
 * concise claims; it does not supply markup, styles, scripts, or chart shapes.
 */
export function renderProfileV9Document(profile = {}, {
  localPreview = false,
  cohortSection = "",
  cohortMode = localPreview ? "preview" : "loading",
  showUpload = localPreview,
  branding = {},
} = {}) {
  assertSafeProfileV9ForRender(profile);
  const safeProfile = isRecord(profile) ? profile : {};
  const view = isRecord(safeProfile.profile_view) ? safeProfile.profile_view : {};
  const evidence = evidenceMap(safeProfile.evidence_index);
  const presentation = presentationOptions(branding);
  const name = value(safeProfile.name) || presentation.memberFallback;
  const focus = value(safeProfile.focus || safeProfile.headline) || "Project-fit profile";
  const generated = value(safeProfile.generated_at);
  const hero = isRecord(view.hero) ? view.hero : {};
  const thesis = value(hero.thesis) || focus;
  const sourceNote = value(hero.source_note);
  const serialized = JSON.stringify(safeProfile, null, 2).replace(/</g, "\\u003c");
  const cohort = cohortSection || (cohortMode === "none" ? "" : cohortGate(cohortMode === "preview"));
  const documentStyles = presentation.accentColor === "#ff4d00"
    ? PROFILE_V9_STYLES
    : PROFILE_V9_STYLES.replaceAll("#ff4d00", presentation.accentColor);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>${escapeHtml(name)} — ${escapeHtml(presentation.titleSuffix)}</title>
<style>${documentStyles}</style>
</head>
<body data-view="summary">
<header class="shell site-head">
  <a class="brand" href="#top" id="brand-egg" aria-label="${escapeAttr(presentation.siteName)} profile home"><span class="brand-mark">${escapeHtml(presentation.initial)}</span><span>${escapeHtml(presentation.headerLabel)}</span></a>
  <div class="view-switch" aria-label="Profile detail level">
    <button type="button" data-view-button="summary" aria-pressed="true">30-second read</button>
    <button type="button" data-view-button="full" aria-pressed="false">Evidence detail</button>
  </div>
</header>
<main id="top">
  ${localPreview ? LOCAL_ONLY_NOTICE : ""}
  <section class="shell hero reveal" aria-labelledby="profile-name">
    <div>
      <span class="eyebrow">Project-fit profile</span>
      <h1 id="profile-name">${renderName(name)}</h1>
      <p class="thesis">${escapeHtml(thesis)}</p>
      ${sourceNote ? `<p class="hero-note">${escapeHtml(sourceNote)}</p>` : ""}
      ${sourceMarkers(hero.evidence_ids, evidence, true)}
    </div>
  </section>
  ${agentFootprint(view.agent_footprint, cohort, evidence, cohortMode)}
  ${agentPractice(view.agent_practice, safeProfile, evidence)}
  ${industries(view.industries, evidence)}
  ${subjectMatter(view.subject_matter, evidence)}
  ${matchingDecision(view.matching, evidence)}
  ${shareCard(view, safeProfile, evidence, presentation)}
  ${showUpload ? localUploadPanel() : ""}
  ${sourcesAndLimits(view.limits, safeProfile, evidence)}
</main>
<footer class="shell"><span>${escapeHtml(presentation.footerLabel)}</span>${presentation.manageUrl ? `<a href="${escapeAttr(presentation.manageUrl)}">Manage profile</a>` : ""}</footer>
<div class="toast" id="profile-toast" role="status" aria-live="polite">Fewer labels. Better decisions.</div>
<script>${PROFILE_V9_SCRIPT}</script>
<script type="application/json" id="profile-data">
${serialized}
</script>
</body>
</html>`;
}

function agentFootprint(footprintValue, cohort, evidence, cohortMode) {
  const footprint = isRecord(footprintValue) ? footprintValue : {};
  const mix = isRecord(footprint.normalized_mix) ? footprint.normalized_mix : {};
  const items = list(mix.items).filter(isRecord).slice(0, 2);
  const mixMarkup = items.length ? normalizedMix(mix, items, evidence) : emptyMix();
  return `<section class="shell section reveal" id="agent-footprint" aria-labelledby="agent-footprint-title">
    <div class="section-head"><span class="section-index">01 / Agent footprint</span><div><h2 id="agent-footprint-title">Observed agent activity.</h2><p>${cohortMode === "none" ? "Activity counts use retained local history." : "Network placement uses submitted profiles that follow the same rules."} Tool mix uses the same dates for both tools.</p></div></div>
  </section>
  ${cohort}
  <section class="shell section section-continuation reveal" id="normalized-mix" aria-label="Normalized agent source mix">${mixMarkup}</section>`;
}

function normalizedMix(mix, items, evidence) {
  const total = number(mix.total_sessions);
  const days = number(mix.calendar_days);
  const from = value(mix.from);
  const to = value(mix.to);
  const widths = items.map((item) => clamp(number(item.share), 0, 100));
  const aria = items.map((item) => `${sourceLabel(item.source)} ${formatPercent(item.share)}, ${formatNumber(item.sessions)} sessions`).join("; ");
  const limitations = list(mix.limitations).map(value).filter(Boolean).slice(0, 3);
  const primaryLimitation = limitations[0] || "This comparison describes session-record share only.";
  return `<div class="split-method">
    <div class="split-method-head"><div><span class="source">Matched-window comparison</span><h3>Normalized Claude / Codex mix</h3></div><span>${days ? `${days}-day shared window` : "Shared window"}</span></div>
    <div class="split-bar" role="img" aria-label="${escapeAttr(aria)}" style="grid-template-columns:${widths.map((width) => `${Math.max(width, 1)}fr`).join(" ")}">
      ${items.map((item, index) => `<div class="split-segment" data-source="${escapeAttr(value(item.source))}" style="--segment:${index}"><b>${escapeHtml(sourceLabel(item.source))}</b><strong>${escapeHtml(formatPercent(item.share))}</strong></div>`).join("")}
    </div>
    <div class="split-facts">${items.map((item) => `<div><span>${escapeHtml(sourceLabel(item.source))}</span><b>${escapeHtml(formatNumber(item.sessions))}${number(item.sessions_per_calendar_day) != null ? ` · ${escapeHtml(formatDecimal(item.sessions_per_calendar_day))}/day` : ""}</b></div>`).join("")}</div>
    <p>${from || to ? `Both counts use ${escapeHtml(dateRange(from, to))}. ` : ""}${total != null ? `${escapeHtml(formatNumber(total))} session records are inside the shared window. ` : ""}${escapeHtml(primaryLimitation)} Counts come from local session records. Fixed checks confirm the totals without reading the raw session text.</p>
    ${limitations.length > 1 ? `<div class="limit-list full-only">${limitations.slice(1).map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>` : ""}
    ${sourceMarkers(mix.evidence_ids, evidence, true)}
  </div>`;
}

function emptyMix() {
  return `<div class="empty-state"><span class="source">Matched-window comparison</span><h3>Normalized Claude / Codex mix</h3><p>A fair split needs session counts from the same calendar window. Upload compatible source history to calculate it. No ratio is estimated.</p></div>`;
}

function agentPractice(practiceValue, profile, evidence) {
  if (!isRecord(practiceValue)) return "";
  const practice = practiceValue;
  const workflow = list(practice.workflow).filter(isRecord).slice(0, 4);
  const role = claim(practice.role);
  const distinctive = claim(practice.distinctive_fact);
  const reusable = claim(practice.reusable_system);
  const limitation = claim(practice.limitation);
  const operating = operatingProfile(profile);
  const statistics = list(practice.statistics)
    .filter(isRecord)
    .filter((item) => !(/^\/agent_practice\/tool_categories\//.test(value(item.source_field)) && operating.signals.some((signal) => /delegation/i.test(signal.label))))
    .slice(0, 3);
  if (!role.summary && !workflow.length && !operating.signals.length) return "";
  return `<section class="shell section reveal" id="agent-practice" aria-labelledby="agent-practice-title">
    <div class="section-head section-head--practice"><span class="section-index">02 / Agent operating profile</span><div><h2 class="long-title" id="agent-practice-title">${escapeHtml(role.summary || "Observed agent operating pattern")}</h2><p>How this person delegates, coordinates, owns, and checks agent work.</p>${sourceMarkers(practiceEvidenceIds(practice), evidence)}</div></div>
    ${statistics.length ? `<div class="practice-stats" aria-label="Observed agent activity statistics">${statistics.map((item) => `<article class="practice-stat"><strong>${escapeHtml(formatNumber(item.value))}</strong><span>${escapeHtml(value(item.label))}</span></article>`).join("")}</div>` : ""}
    ${operating.signals.length ? `<div class="operating-signals" aria-label="Agent operating ratios" data-signal-count="${operating.signals.length}" style="--signal-count:${operating.signals.length}">${operating.signals.map((item) => `<article class="operating-signal"><span class="source">${escapeHtml(item.tag)}</span><strong>${escapeHtml(item.value)}</strong><h3>${escapeHtml(item.label)}</h3><p>${escapeHtml(item.detail)}</p><small>${escapeHtml(item.basis)}</small></article>`).join("")}</div>` : ""}
    ${operating.mixes.length ? `<div class="operating-mixes" aria-label="Observed work mix" style="--mix-count:${operating.mixes.length}">${operating.mixes.map(operatingMix).join("")}</div>` : ""}
    ${workflow.length ? `<div class="practice-flow full-only" aria-label="Observed agent workflow">${workflow.map((item, index) => `<article class="practice-step"><span class="step-no">${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(value(item.label))}</h3><p>${escapeHtml(value(item.summary))}</p></article>`).join("")}</div>` : ""}
    ${practiceProof("What is distinctive", distinctive, evidence)}
    ${practiceProof("Reusable operating system", reusable, evidence)}
    ${limitation.summary ? `<div class="practice-proof full-only"><h3>Where the evidence bends</h3><div><p>${escapeHtml(limitation.summary)}</p></div></div>` : ""}
  </section>`;
}

function operatingProfile(profile) {
  const arcs = list(profile?.work_arcs).filter(isRecord);
  const concurrency = isRecord(profile?.activity_analysis?.concurrency) ? profile.activity_analysis.concurrency : {};
  const practice = isRecord(profile?.agent_practice) ? profile.agent_practice : {};
  const categories = list(practice.tool_categories).filter(isRecord);
  const coverage = list(practice.tool_call_coverage).filter(isRecord);
  const signals = [];

  const delegation = categories.find((item) => /subagent|delegat/i.test(`${value(item.tag)} ${value(item.label)}`));
  const delegationSource = list(delegation?.sources).map(value).filter(Boolean).length === 1 ? value(delegation.sources[0]) : "";
  const delegationCoverage = coverage.find((item) => value(item.source) === delegationSource);
  const delegatedSessions = number(delegation?.active_sessions);
  const delegationDenominator = number(delegationCoverage?.sessions_scanned);
  if (delegatedSessions != null && delegationDenominator && delegatedSessions <= delegationDenominator) {
    signals.push({
      tag: "01 / Delegation",
      value: formatPercent(delegatedSessions / delegationDenominator),
      label: "Delegation rate",
      detail: `${formatNumber(delegatedSessions)} of ${formatNumber(delegationDenominator)} scanned ${sourceLabel(delegationSource)} sessions used subagents.`,
      basis: "Same-source session count",
    });
  }

  const multiSessionDays = number(concurrency.multi_session_days);
  const coveredActiveDays = number(concurrency.covered_active_days);
  if (multiSessionDays != null && coveredActiveDays && multiSessionDays <= coveredActiveDays) {
    signals.push({
      tag: "02 / Parallel work",
      value: formatPercent(multiSessionDays / coveredActiveDays),
      label: "Multi-session active days",
      detail: `${formatNumber(multiSessionDays)} of ${formatNumber(coveredActiveDays)} observed active days included more than one interactive session.`,
      basis: "Active-day count · scheduled runs excluded",
    });
  }

  if (arcs.length) {
    const ownedRealUse = arcs.filter((arc) => ["live-use", "ongoing-operation"].includes(value(arc.delivery_state)) && ["workstream-owner", "system-owner"].includes(value(arc.responsibility)));
    const ongoing = ownedRealUse.filter((arc) => value(arc.delivery_state) === "ongoing-operation").length;
    if (ownedRealUse.length) signals.push({
      tag: "03 / Delivery ownership",
      value: `${ownedRealUse.length}/${arcs.length}`,
      label: "Owned into real use",
      detail: `${ownedRealUse.length} of ${arcs.length} work examples reached real use under this person's ownership${ongoing ? `; ${ongoing} continued into operation` : ""}.`,
      basis: "Work examples with retained evidence",
    });

    const verificationEligible = arcs.filter((arc) => ["independent", "self-check", "unclear"].includes(value(arc.verification_mode)));
    const independentlyVerified = verificationEligible.filter((arc) => value(arc.verification_mode) === "independent");
    if (verificationEligible.length && independentlyVerified.length) signals.push({
      tag: "04 / Verification",
      value: `${independentlyVerified.length}/${verificationEligible.length}`,
      label: "Independently checked work",
      detail: `${independentlyVerified.length} of ${verificationEligible.length} work examples show a separate review or acceptance check.`,
      basis: "Retained evidence · unknown stays in the count",
    });
    else {
      const governed = arcs.filter((arc) => arc.reviewer_governor === true);
      if (governed.length) signals.push({
        tag: "04 / Review control",
        value: `${governed.length}/${arcs.length}`,
        label: "Work with review controls",
        detail: `${governed.length} of ${arcs.length} work examples show review, approval, or standards ownership.`,
        basis: "Retained evidence · not an independent-check rate",
      });
    }
  }

  const mixes = [
    workMix("Primary work surface", arcs, "primary_surface"),
    workMix("Change type", arcs, "change_type"),
  ].filter((item) => item.items.length);
  return { signals: signals.slice(0, 4), mixes };
}

function workMix(title, arcs, key) {
  const counts = new Map();
  for (const arc of arcs) {
    const item = value(arc[key]);
    if (item) counts.set(item, (counts.get(item) || 0) + 1);
  }
  return { title, total: arcs.length, items: [...counts.entries()].map(([keyValue, count]) => ({ label: label(keyValue), count })) };
}

function operatingMix(mix) {
  const widths = mix.items.map((item) => Math.max(1, item.count));
  const aria = mix.items.map((item) => `${item.label}: ${item.count} of ${mix.total}`).join("; ");
  return `<div class="operating-mix"><div class="operating-mix-head"><h3>${escapeHtml(mix.title)}</h3><span>${escapeHtml(formatNumber(mix.total))} qualifying arcs</span></div><div class="operating-mix-bar" role="img" aria-label="${escapeAttr(aria)}" style="grid-template-columns:${widths.map((width) => `${width}fr`).join(" ")}">${mix.items.map((item) => `<i title="${escapeAttr(`${item.label}: ${item.count} of ${mix.total}`)}"></i>`).join("")}</div><div class="operating-mix-labels">${mix.items.map((item) => `<span><b>${escapeHtml(item.label)}</b>${escapeHtml(`${item.count}/${mix.total}`)}</span>`).join("")}</div></div>`;
}

function practiceProof(title, item, evidence) {
  if (!item.summary) return "";
  return `<div class="practice-proof"><h3>${escapeHtml(title)}</h3><div><p>${escapeHtml(item.summary)}</p></div></div>`;
}

function practiceEvidenceIds(practice) {
  const claims = [practice.role, ...list(practice.statistics), ...list(practice.workflow), practice.distinctive_fact, practice.reusable_system, practice.limitation];
  return [...new Set(claims.flatMap((item) => list(item?.evidence_ids).map(value).filter(Boolean)))];
}

function industries(industryValue, evidence) {
  const rows = list(industryValue).filter(isRecord).slice(0, 5);
  if (!rows.length) return "";
  return `<section class="shell section reveal" id="industries" aria-labelledby="industries-title">
    <div class="section-head"><span class="section-index">03 / Career &amp; industries</span><div><h2 class="long-title" id="industries-title">Where their expertise comes from.</h2><p>Career context establishes duration and responsibility. Observed work shows what is active now.</p></div></div>
    <div class="industry-map">${rows.map((item, index) => `<article class="industry-row${index >= 3 ? " full-only" : ""}">
      <h3>${escapeHtml(value(item.label))}${value(item.context) ? `<span>${escapeHtml(value(item.context))}</span>` : ""}</h3>
      <div class="industry-blend"><p><b>Career context</b>${escapeHtml(value(item.career_context) || "No career-context claim was retained.")}</p><p><b>Observed work</b>${escapeHtml(value(item.observed_work) || "No qualifying current work was retained.")}</p>${sourceMarkers(item.evidence_ids, evidence, true)}</div>
      <span class="industry-depth ${depthTone(item.depth)}">${escapeHtml(depthLabel(item.depth))}</span>
    </article>`).join("")}</div>
  </section>`;
}

function subjectMatter(subjectValue, evidence) {
  const rows = list(subjectValue).filter(isRecord).slice(0, 5);
  if (!rows.length) return "";
  return `<section class="shell section reveal" id="subject-matter" aria-labelledby="subject-matter-title">
    <div class="section-head"><span class="section-index">04 / Subject matter</span><div><h2 id="subject-matter-title">What they know.</h2><p>Each area names the work that supports it. Generic tool use does not qualify.</p></div></div>
    <div class="expertise-matrix">${rows.map((item, index) => `<article class="expertise-item${index >= 3 ? " full-only" : ""}"><h3>${escapeHtml(value(item.label))}</h3><div><p>${escapeHtml(value(item.summary))}</p>${sourceMarkers(item.evidence_ids, evidence)}</div><span class="evidence-type">${escapeHtml(value(item.evidence_label) || "Retained evidence")}</span></article>`).join("")}</div>
  </section>`;
}

function matchingDecision(matchingValue, evidence) {
  if (!isRecord(matchingValue)) return "";
  const cells = [
    ["Strongest fit", matchingValue.strongest_fit, "fit", false],
    ["Add a specialist", matchingValue.add_specialist, "pair", true],
    ["Not shown", matchingValue.not_shown, "gap", true],
  ].map(([eyebrow, raw, tone, detailOnly]) => ({ eyebrow, tone, detailOnly, ...claim(raw), label: value(raw?.label) })).filter((item) => item.label || item.summary);
  if (!cells.length) return "";
  return `<section class="shell section reveal" id="matching-decision" aria-labelledby="matching-title"><div class="section-head"><span class="section-index">05 / Matching decision</span><div><h2 id="matching-title">How to use the profile.</h2><p>Make the staffing decision without turning uncertainty into a score.</p></div></div><div class="decision-grid">${cells.map((item) => `<article class="decision-cell${item.detailOnly ? " full-only" : ""}" data-tone="${item.tone}"><span class="eyebrow">${item.eyebrow}</span><h3>${escapeHtml(item.label)}</h3><p>${escapeHtml(item.summary)}</p>${sourceMarkers(item.evidence_ids, evidence)}</article>`).join("")}</div></section>`;
}

function shareCard(view, profile, evidence, presentation) {
  const hero = isRecord(view.hero) ? view.hero : {};
  const mix = isRecord(view.agent_footprint?.normalized_mix) ? view.agent_footprint.normalized_mix : {};
  const items = list(mix.items).filter(isRecord);
  const claude = items.find((item) => value(item.source) === "claude");
  const codex = items.find((item) => value(item.source) === "codex");
  const role = claim(view.agent_practice?.role);
  const industry = list(view.industries).find(isRecord) || {};
  const fit = isRecord(view.matching?.strongest_fit) ? view.matching.strongest_fit : {};
  const name = value(profile.name) || presentation.memberFallback;
  const filename = `${value(profile.slug) || name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "ai-work-profile";
  return `<section class="shell section reveal full-only share-studio" id="profile-share-card" aria-labelledby="share-card-title">
    <div class="section-head"><span class="section-index">06 / Share</span><div><h2 id="share-card-title">Share the signal.</h2><p>A fixed LinkedIn card keeps the identity, tool mix, and three hiring signals readable.</p></div></div>
    <div class="share-actions"><button type="button" data-profile-share-download data-filename="${escapeAttr(filename)}-profile.png">Download PNG</button><button type="button" data-profile-share-copy>Copy profile link</button><span data-profile-share-status aria-live="polite">1200 × 627</span></div>
    <div class="share-frame">
      <svg data-profile-share-svg viewBox="0 0 1200 627" role="img" aria-label="${escapeAttr(presentation.siteName)} matching profile card for ${escapeAttr(name)}" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="627" fill="#0a0a09"/><path d="M0 0H1200V627H0Z" fill="none" stroke="#38342d"/>
        <rect x="54" y="48" width="28" height="28" fill="none" stroke="${escapeAttr(presentation.accentColor)}"/><text x="64" y="68" fill="${escapeAttr(presentation.accentColor)}" font-family="monospace" font-size="14">${escapeHtml(presentation.initial)}</text>
        <text x="98" y="69" fill="#f4f0e8" font-family="monospace" font-size="15" font-weight="700" letter-spacing="2">${escapeHtml(presentation.shareLabel)}</text>
        <text x="1146" y="69" fill="#928a7e" text-anchor="end" font-family="monospace" font-size="12" letter-spacing="1">EVIDENCE, NOT VIBES</text>
        <text x="54" y="166" fill="#f4f0e8" font-family="Arial Narrow,Arial,sans-serif" font-size="76" font-weight="800">${escapeHtml(name.toUpperCase())}</text>
        ${svgTextLines(value(hero.thesis), 54, 222, 580, 31, 42)}
        <g transform="translate(700 150)"><text fill="#928a7e" font-family="monospace" font-size="12" letter-spacing="1">SHARED-WINDOW AGENT MIX</text>
          <rect y="30" width="446" height="70" fill="#f4f0e8"/><rect x="${446 * clamp(number(claude?.share), 0, 100) / 100}" y="30" width="${446 * clamp(number(codex?.share), 0, 100) / 100}" height="70" fill="#ff4d00"/>
          <text x="18" y="75" fill="#0a0a09" font-family="Arial,sans-serif" font-size="21" font-weight="700">CLAUDE ${escapeHtml(formatPercent(claude?.share))}</text><text x="428" y="75" fill="#0a0a09" text-anchor="end" font-family="Arial,sans-serif" font-size="21" font-weight="700">CODEX ${escapeHtml(formatPercent(codex?.share))}</text>
          <text y="126" fill="#b8b0a3" font-family="monospace" font-size="13">${escapeHtml(formatNumber(mix.total_sessions))} retained records / ${escapeHtml(formatNumber(mix.calendar_days))} shared days · ${escapeHtml(formatDecimal(number(mix.total_sessions) / number(mix.calendar_days)))} / day</text>
          <text y="150" fill="#928a7e" font-family="monospace" font-size="10">ACTIVITY DENSITY, NOT QUALITY OR TIME SPENT</text>
        </g>
        ${shareSignal(54, 438, "AGENT PRACTICE", role.summary)}${shareSignal(432, 438, "INDUSTRY", value(industry.label))}${shareSignal(810, 438, "STRONGEST FIT", value(fit.label))}
        <line x1="54" y1="592" x2="1146" y2="592" stroke="#38342d"/><text x="54" y="616" fill="#928a7e" font-family="monospace" font-size="11">Career context + observed agent work</text><text x="1146" y="616" fill="${escapeAttr(presentation.accentColor)}" text-anchor="end" font-family="monospace" font-size="11">${escapeHtml(presentation.shareFooter)}</text>
      </svg>
    </div>
    ${sourceMarkers([...list(hero.evidence_ids), ...list(role.evidence_ids), ...list(industry.evidence_ids), ...list(fit.evidence_ids)], evidence)}
  </section>`;
}

function shareSignal(x, y, labelText, summary) {
  return `<g transform="translate(${x} ${y})"><text fill="#ff4d00" font-family="monospace" font-size="11" letter-spacing="1">${escapeHtml(labelText)}</text>${svgTextLines(summary, 0, 34, 310, 20, 25, "#f4f0e8")}</g>`;
}

function svgTextLines(raw, x, y, width, fontSize, lineHeight, fill = "#b8b0a3") {
  const maxChars = Math.max(12, Math.floor(width / (fontSize * .56)));
  const words = value(raw).split(/\s+/).filter(Boolean);
  const lines = [];
  for (const word of words) {
    const current = lines.at(-1) || "";
    if (!current || `${current} ${word}`.length > maxChars) lines.push(word);
    else lines[lines.length - 1] = `${current} ${word}`;
  }
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="Arial,sans-serif" font-size="${fontSize}">${lines.slice(0, 4).map((line, index) => `<tspan x="${x}" dy="${index ? lineHeight : 0}">${escapeHtml(line)}</tspan>`).join("")}</text>`;
}

function sourcesAndLimits(limitsValue, profile, evidence) {
  const limits = list(limitsValue).map(claim).filter((item) => item.summary).slice(0, 5);
  const entries = [...evidence.values()].slice(0, 16);
  const sourceSummary = [...new Set(entries.map((item) => sourceLabel(item.source)).filter(Boolean))];
  const generated = value(profile.generated_at);
  return `<section class="shell section full-only" id="sources-and-limits" aria-labelledby="limits-title">
    <div class="section-head"><span class="section-index">07 / Sources &amp; limits</span><div><h2 id="limits-title">Where the data stops.</h2><p>${sourceSummary.length ? `Sources retained in this profile: ${escapeHtml(sourceSummary.join(", "))}.` : "Only retained evidence can support a visible claim."}</p></div></div>
    <div class="limits">${limits.map((item) => `<article><p>${escapeHtml(item.summary)}</p>${sourceMarkers(item.evidence_ids, evidence)}</article>`).join("") || `<article><p>No additional profile-specific limit was submitted.</p></article>`}</div>
    ${entries.length ? `<details><summary>Evidence index</summary><div class="evidence-index">${entries.map((item) => `<div><b>${escapeHtml(value(item.id))}</b><span>${escapeHtml(sourceLabel(item.source))}</span><p>${escapeHtml(value(item.summary))}</p></div>`).join("")}</div></details>` : ""}
    ${generated ? `<p class="generated">Generated ${escapeHtml(generated)}</p>` : ""}
  </section>`;
}

function cohortGate(localPreview) {
  if (localPreview) {
    return `<!-- overflow-cohort-gate:start -->
<section class="cohort-gate" id="cohort-gate" data-overflow-cohort-gate data-example-distribution aria-labelledby="cohort-gate-title">
  <div class="shell"><div class="cohort-card cohort-sample"><div class="cohort-sample-head"><div><span class="section-index">Comparison preview</span><h2 id="cohort-gate-title">This is not network data.</h2></div><span class="cohort-example-stamp">Example only</span></div><p>The shapes below only preview the report format. Upload this profile to calculate real distributions and plot its position.</p><div class="cohort-sample-rows" aria-label="Example chart shapes with no network data">${["Activity density", "Delegation rate", "Parallel-work rate"].map(sampleDistributionRow).join("")}</div><div class="cohort-sample-foot"><p class="cohort-sample-note">No cohort values · No position · No percentile</p><a class="cohort-upload-link" href="#keep-or-share">Upload to plot this profile →</a></div></div></div>
</section>
<!-- overflow-cohort-gate:end -->`;
  }

  return `<!-- overflow-cohort-gate:start -->
<section class="cohort-gate" id="cohort-gate" data-overflow-cohort-gate aria-labelledby="cohort-gate-title">
  <div class="shell"><div class="cohort-card"><span class="section-index">Anonymous cohort view</span><h2 id="cohort-gate-title">Network comparison is loading.</h2><p>Compatible network placement will appear here.</p></div></div>
</section>
<!-- overflow-cohort-gate:end -->`;
}

function sampleDistributionRow(metricLabel, index) {
  const paths = [
    "M0 54 C16 53 27 45 40 35 C55 23 73 20 90 28 C110 38 123 48 145 45 C168 42 183 23 205 18 C228 12 244 21 260 34 C277 48 296 52 320 54 L320 64 L0 64 Z",
    "M0 55 C22 54 34 50 49 42 C68 32 81 17 101 15 C123 13 136 29 151 39 C168 50 187 48 202 37 C218 25 232 21 248 29 C264 37 277 51 320 55 L320 64 L0 64 Z",
    "M0 55 C33 54 45 49 59 38 C71 29 84 25 99 31 C112 36 122 48 137 48 C157 48 165 22 185 17 C207 12 219 36 236 44 C253 52 276 54 320 55 L320 64 L0 64 Z",
  ];
  return `<div class="cohort-sample-row"><div class="cohort-sample-value"><span>${escapeHtml(metricLabel)}</span><strong>Example distribution</strong></div><div class="cohort-sample-chart"><svg viewBox="0 0 320 68" aria-hidden="true"><path class="cohort-density-fill" d="${paths[index % paths.length]}"/><line x1="0" y1="55" x2="320" y2="55"/><text x="160" y="39" text-anchor="middle">EXAMPLE · NOT NETWORK DATA</text></svg></div></div>`;
}

function localUploadPanel() {
  return `<!-- overflow-local-upload:start -->
<section class="shell section local-upload" id="keep-or-share">
  <div class="section-head"><span class="section-index">Keep or share</span><div><h2>Add this reviewed profile to Overflow.</h2><p>Only the structured profile payload embedded in this file is sent. Raw sessions, prompts, repositories, credentials, and this page code stay local.</p></div></div>
  <form id="overflow-direct-upload">
    <label>Email <input id="overflow-upload-email" name="email" type="email" autocomplete="email" required></label>
    <label>LinkedIn URL <input id="overflow-upload-linkedin" name="linkedin" type="url" autocomplete="url" required></label>
    <fieldset><legend>Visibility</legend><label><input type="radio" name="publish" value="private" checked> Private inside Overflow</label><label><input type="radio" name="publish" value="public"> Publish on the community profile directory</label></fieldset>
    <label class="consent"><input id="overflow-upload-consent" type="checkbox" required> I reviewed this profile and consent to sending its structured profile payload to Overflow.</label>
    <button id="overflow-upload-button" type="submit">Upload reviewed profile →</button>
    <p id="overflow-upload-status" role="status" aria-live="polite"></p>
  </form>
</section>
<script>${LOCAL_UPLOAD_SCRIPT}</script>
<!-- overflow-local-upload:end -->`;
}

function sourceMarkers(idsValue, evidence, summaryVisible = false) {
  const ids = [...new Set(list(idsValue).map(value).filter(Boolean))];
  const entries = ids.map((id) => evidence.get(id)).filter(Boolean);
  const sources = [...new Set(entries.map((item) => value(item.source)).filter(Boolean))];
  if (!sources.length && !ids.length) return "";
  const labels = sources.length ? sources.map(sourceLabel) : ["Evidence cited"];
  const title = ids.length ? `Evidence: ${ids.join(", ")}` : "Source-backed claim";
  return `<span class="source-markers${summaryVisible ? " source-markers--summary" : ""}" title="${escapeAttr(title)}" aria-label="${escapeAttr(`${labels.join(", ")}. ${title}`)}">${labels.map((item) => `<i>${escapeHtml(item)}</i>`).join("")}</span>`;
}

function evidenceMap(valueToMap) {
  const result = new Map();
  for (const item of list(valueToMap)) if (isRecord(item) && value(item.id)) result.set(value(item.id), item);
  return result;
}

function claim(raw) {
  if (isRecord(raw)) return { summary: value(raw.summary), evidence_ids: list(raw.evidence_ids) };
  return { summary: value(raw), evidence_ids: [] };
}

function renderName(name) {
  const parts = String(name).trim().split(/\s+/);
  if (parts.length < 2) return escapeHtml(name);
  const final = parts.pop();
  return `${escapeHtml(parts.join(" "))} <span>${escapeHtml(final)}</span>`;
}

function sourceLabel(source) {
  const normalized = value(source).toLowerCase();
  return ({ claude: "Claude Code", codex: "Codex", sessions: "Sessions", github: "GitHub", linkedin: "LinkedIn", assessment: "Assessment" })[normalized] || label(normalized);
}

function depthLabel(depth) {
  return ({ "deep-current": "Deep · current", "deep-sustained": "Deep · sustained", "working-current": "Working · current", "career-depth": "Career depth", "observed-exposure": "Observed exposure", "career-exposure": "Career exposure" })[value(depth)] || label(depth) || "Evidence retained";
}

function depthTone(depth) {
  return /career|exposure/.test(value(depth)) ? "context" : "";
}

function dateRange(from, to) {
  if (from && to) return `${from}–${to}`;
  return from || to || "shared window";
}

function formatNumber(raw) {
  const parsed = number(raw);
  return parsed == null ? "—" : parsed.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

function formatPercent(raw) {
  const parsed = number(raw);
  if (parsed == null) return "—";
  const percent = parsed <= 1 ? parsed * 100 : parsed;
  return `${percent.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
}

function formatDecimal(raw) {
  const parsed = number(raw);
  return parsed == null ? "—" : parsed.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

function number(raw) {
  if (raw == null || raw === "") return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function presentationOptions(raw) {
  const options = isRecord(raw) ? raw : {};
  const siteName = value(options.siteName) || "Overflow";
  const initial = value(options.initial) || siteName.charAt(0).toUpperCase() || "A";
  const accentColor = /^#[0-9a-f]{6}$/i.test(value(options.accentColor)) ? value(options.accentColor) : "#ff4d00";
  return {
    siteName,
    initial: initial.slice(0, 2),
    accentColor,
    memberFallback: value(options.memberFallback) || `${siteName} member`,
    titleSuffix: value(options.titleSuffix) || `${siteName} matching profile`,
    headerLabel: value(options.headerLabel) || `${siteName} / Matching profile`,
    footerLabel: value(options.footerLabel) || `${siteName} / evidence, not vibes`,
    manageUrl: options.manageUrl === null ? "" : value(options.manageUrl) || `${SITE_URL}/profile/`,
    shareLabel: value(options.shareLabel) || `${siteName.toUpperCase()} / MATCHING PROFILE`,
    shareFooter: value(options.shareFooter) || "overflowbuilders.com",
  };
}

function clamp(raw, minimum, maximum) {
  const parsed = raw == null ? 0 : raw <= 1 ? raw * 100 : raw;
  return Math.min(maximum, Math.max(minimum, parsed));
}

function label(raw) {
  return value(raw).replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function value(raw) {
  return typeof raw === "string" || typeof raw === "number" ? String(raw).trim() : "";
}

function list(raw) {
  return Array.isArray(raw) ? raw : [];
}

function isRecord(raw) {
  return Boolean(raw) && typeof raw === "object" && !Array.isArray(raw);
}

function escapeHtml(raw) {
  return String(raw ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function escapeAttr(raw) {
  return escapeHtml(raw).replace(/`/g, "&#96;");
}

const LOCAL_ONLY_NOTICE = `<!-- overflow-local-only-notice:start -->
<div class="shell local-only-notice">Private preview. Nothing has been uploaded. Review this page before sharing it.</div>
<!-- overflow-local-only-notice:end -->`;

const LOCAL_UPLOAD_SCRIPT = `(() => {
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
      const response = await fetch('${SITE_URL}/api/profile', {
        method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'omit',
        body: JSON.stringify({ email, linkedin, publish, profile })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Upload failed. Nothing was stored.');
      status.textContent = publish && result.publicUrl ? \`Uploaded and published: \${result.publicUrl}\` : 'Uploaded privately. Check your email for the profile-management link.';
    } catch (error) {
      status.textContent = error.message || 'Upload failed. Nothing was stored.';
      button.disabled = false;
    }
  });
})();`;

const PROFILE_V9_SCRIPT = `(() => {
  const body = document.body;
  const buttons = [...document.querySelectorAll('[data-view-button]')];
  buttons.forEach((button) => button.addEventListener('click', () => {
    body.dataset.view = button.dataset.viewButton;
    buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  }));
  const shareSvg = document.querySelector('[data-profile-share-svg]');
  const shareDownload = document.querySelector('[data-profile-share-download]');
  const shareCopy = document.querySelector('[data-profile-share-copy]');
  const shareStatus = document.querySelector('[data-profile-share-status]');
  if (shareSvg && shareDownload) shareDownload.addEventListener('click', () => {
    const source = new XMLSerializer().serializeToString(shareSvg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 627;
      canvas.getContext('2d').drawImage(image, 0, 0, 1200, 627); URL.revokeObjectURL(url);
      canvas.toBlob((png) => {
        if (!png) return;
        const downloadUrl = URL.createObjectURL(png); const link = document.createElement('a');
        link.href = downloadUrl; link.download = shareDownload.dataset.filename || 'overflow-profile.png'; link.click();
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
        if (shareStatus) shareStatus.textContent = 'PNG downloaded';
      }, 'image/png');
    };
    image.onerror = () => { URL.revokeObjectURL(url); if (shareStatus) shareStatus.textContent = 'PNG export failed'; };
    image.src = url;
  });
  if (shareCopy) shareCopy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); if (shareStatus) shareStatus.textContent = 'Profile link copied'; }
    catch { if (shareStatus) shareStatus.textContent = 'Copy failed'; }
  });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) document.querySelectorAll('.reveal').forEach((item) => item.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible'); observer.unobserve(entry.target);
    }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
  }
  let clicks = 0;
  const mark = document.getElementById('brand-egg');
  const toast = document.getElementById('profile-toast');
  if (mark && toast) mark.addEventListener('click', () => {
    clicks += 1;
    if (clicks !== 5) return;
    toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2800); clicks = 0;
  });
})();`;

const PROFILE_V9_STYLES = `
:root{--ink:#0a0a09;--surface:#11110f;--surface-2:#181713;--paper:#f4f0e8;--muted:#b8b0a3;--quiet:#928a7e;--line:#38342d;--hot:#ff4d00;--green:#9ee0ad;--amber:#ffc66d;--red:#ff8a73;--content:1180px;--gutter:clamp(20px,4vw,56px);--display:"Avenir Next Condensed","Avenir Next",sans-serif;--body:"Avenir Next",Avenir,sans-serif;--mono:".SF NS Mono",Menlo,Consolas,monospace;color-scheme:dark}
*{box-sizing:border-box}html{scroll-behavior:smooth;overflow-x:hidden}body{margin:0;overflow-x:hidden;background:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px),var(--ink);background-size:48px 48px;color:var(--paper);font:17px/1.55 var(--body)}a{color:inherit}button,input{font:inherit}.shell{width:min(var(--content),calc(100% - (var(--gutter) * 2)));margin-inline:auto}.site-head{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:68px;border-bottom:1px solid var(--line);background:rgba(10,10,9,.94);backdrop-filter:blur(18px)}.brand{display:inline-flex;align-items:center;gap:12px;text-decoration:none;font:700 12px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase}.brand-mark{display:grid;place-items:center;width:25px;height:25px;border:1px solid var(--hot);color:var(--hot);transition:transform .3s ease}.brand:hover .brand-mark{transform:rotate(-8deg)}.view-switch{display:inline-flex;padding:3px;border:1px solid var(--line);background:#0e0e0c}.view-switch button{border:0;background:transparent;color:var(--muted);padding:9px 12px;cursor:pointer;font:700 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase}.view-switch button[aria-pressed=true]{background:var(--paper);color:var(--ink)}.local-only-notice{border:1px solid var(--hot);background:rgba(255,77,0,.08);padding:12px 14px;margin-top:24px;font:12px/1.6 var(--mono)}.eyebrow,.source,.section-index,.source-markers{font:700 10px/1.4 var(--mono);letter-spacing:.1em;text-transform:uppercase}.eyebrow,.section-index{color:var(--hot)}.source{color:var(--quiet)}.hero{padding:clamp(72px,12vw,150px) 0 clamp(62px,9vw,110px)}.hero h1{max-width:1000px;margin:20px 0 0;font:700 clamp(68px,12vw,168px)/.78 var(--display);letter-spacing:-.065em;text-transform:uppercase}.hero h1 span{color:var(--hot)}.thesis{max-width:1040px;margin:38px 0 0;font-size:clamp(24px,3.2vw,43px);line-height:1.08;letter-spacing:-.035em}.hero-note{max-width:880px;margin:20px 0 0;color:var(--muted);font-size:16px}.section{padding:clamp(72px,10vw,124px) 0;border-bottom:1px solid var(--line);scroll-margin-top:82px}.section-continuation{padding-top:56px}.section-head{display:grid;grid-template-columns:210px minmax(0,1fr);gap:30px;margin-bottom:52px}.section-head h2{margin:-8px 0 0;font:700 clamp(44px,6vw,78px)/.9 var(--display);letter-spacing:-.045em;text-transform:uppercase}.section-head h2.long-title{font-size:clamp(40px,5vw,66px)}.section-head p{max-width:760px;margin:20px 0 0;color:var(--muted)}.source-markers{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px;color:var(--quiet);letter-spacing:.04em}.source-markers i{font-style:normal;border:1px solid var(--line);padding:4px 6px}.cohort-gate{border-block:1px solid var(--line);background:var(--surface);padding:clamp(52px,7vw,84px) 0}.cohort-gate h2{max-width:850px;margin:16px 0 0;font:700 clamp(40px,6vw,72px)/.9 var(--display);text-transform:uppercase}.cohort-gate p{max-width:720px;color:var(--muted)}.empty-distribution{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:28px;height:70px;margin-top:38px;border-bottom:1px solid var(--line)}.empty-distribution i{border-top:1px dashed var(--quiet);opacity:.45}.split-method{padding:30px;border:1px solid var(--line);background:rgba(255,77,0,.035)}.split-method-head{display:flex;justify-content:space-between;gap:22px;align-items:end}.split-method h3,.empty-state h3{margin:9px 0 0;font:700 clamp(28px,4vw,42px)/.95 var(--display);text-transform:uppercase}.split-method-head>span{color:var(--green);font:700 11px/1.4 var(--mono);letter-spacing:.07em;text-transform:uppercase}.split-bar{display:grid;min-height:76px;margin-top:22px;border:1px solid var(--line)}.split-segment{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding:17px;background:var(--paper);color:var(--ink);min-width:0}.split-segment+ .split-segment{border-left:1px solid var(--ink);background:var(--hot)}.split-segment b{font-size:14px}.split-segment strong{font:700 30px/.8 var(--display)}.split-facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:10px}.split-facts div{display:flex;justify-content:space-between;gap:16px;padding:12px 16px;border:1px solid var(--line);color:var(--muted);font-size:13px}.split-facts b{color:var(--paper)}.split-method>p,.empty-state p{max-width:900px;margin:18px 0 0;color:var(--muted);font-size:14px}.limit-list{margin-top:20px;padding-left:18px;border-left:2px solid var(--amber)}.limit-list p{color:var(--muted);font-size:13px}.empty-state{padding:30px;border:1px solid var(--line);background:var(--surface)}.practice-lead{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(300px,.8fr);gap:clamp(42px,8vw,100px);padding-bottom:46px;border-bottom:1px solid var(--paper)}.practice-thesis{margin:0;max-width:780px;font:700 clamp(36px,5vw,64px)/.94 var(--display);letter-spacing:-.035em;text-transform:uppercase}.practice-stats{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--paper)}.practice-stat{padding:19px 16px 16px 0;border-bottom:1px solid var(--line)}.practice-stat:nth-child(even){border-left:1px solid var(--line);padding-left:16px}.practice-stat strong{display:block;color:var(--hot);font:700 38px/.9 var(--display)}.practice-stat>span:not(.source-markers){display:block;margin-top:8px;color:var(--muted);font-size:12px}.practice-flow{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid var(--line)}.practice-step{min-height:182px;padding:28px 24px 26px 0}.practice-step+.practice-step{border-left:1px solid var(--line);padding-left:24px}.step-no{color:var(--hot);font:700 11px/1 var(--mono)}.practice-step h3{margin:24px 0 0;font:700 27px/.95 var(--display);text-transform:uppercase}.practice-step p{margin:12px 0 0;color:var(--muted);font-size:14px}.practice-proof{display:grid;grid-template-columns:210px minmax(0,1fr);gap:30px;padding:25px 0;border-bottom:1px solid var(--line)}.practice-proof h3{margin:0;font-size:18px}.practice-proof p{margin:0;color:var(--muted)}.industry-map,.expertise-matrix{border-top:1px solid var(--paper)}.industry-row,.expertise-item{display:grid;grid-template-columns:minmax(220px,.72fr) minmax(0,1.28fr) 150px;gap:34px;align-items:start;padding:30px 0;border-bottom:1px solid var(--line)}.industry-row h3{margin:0;font:700 28px/.95 var(--display);text-transform:uppercase}.industry-row h3 span{display:block;margin-top:10px;color:var(--muted);font:500 13px/1.35 var(--body);text-transform:none}.industry-blend{display:grid;grid-template-columns:1fr 1fr;gap:24px}.industry-blend p,.expertise-item p{margin:0;color:var(--muted);font-size:15px}.industry-blend b{display:block;margin-bottom:7px;color:var(--paper);font:700 10px/1.3 var(--mono);letter-spacing:.08em;text-transform:uppercase}.industry-depth,.evidence-type{color:var(--green);text-align:right;font:700 11px/1.4 var(--mono);letter-spacing:.07em;text-transform:uppercase}.industry-depth.context{color:var(--amber)}.expertise-item h3{margin:0;font-size:22px;line-height:1.1}.decision-grid{display:grid;grid-template-columns:1.15fr .95fr .9fr;border-top:1px solid var(--paper)}.decision-cell{padding:28px 28px 0 0}.decision-cell+.decision-cell{border-left:1px solid var(--line);padding-left:28px}.decision-cell h3{margin:16px 0 0;font:700 32px/.95 var(--display);text-transform:uppercase}.decision-cell p{margin:16px 0 0;color:var(--muted);font-size:15px}.decision-cell[data-tone=pair] .eyebrow{color:var(--amber)}.decision-cell[data-tone=gap] .eyebrow{color:var(--red)}.limits{border-top:1px solid var(--paper)}.limits article{padding:22px 0;border-bottom:1px solid var(--line)}.limits p{max-width:900px;margin:0;color:var(--muted)}details{margin-top:24px;border:1px solid var(--line);padding:18px}summary{cursor:pointer;color:var(--hot);font:700 11px var(--mono);letter-spacing:.08em;text-transform:uppercase}.evidence-index>div{display:grid;grid-template-columns:110px 100px 1fr;gap:18px;padding:14px 0;border-bottom:1px solid var(--line)}.evidence-index b,.evidence-index span{font:700 10px var(--mono);text-transform:uppercase}.evidence-index span{color:var(--hot)}.evidence-index p{margin:0;color:var(--muted);font-size:13px}.generated{color:var(--quiet);font:10px var(--mono);text-transform:uppercase}.local-upload form{display:grid;gap:18px;max-width:760px}.local-upload label,.local-upload fieldset{display:grid;gap:8px;color:var(--muted)}.local-upload input[type=email],.local-upload input[type=url]{width:100%;border:1px solid var(--line);background:var(--surface);color:var(--paper);padding:13px}.local-upload fieldset{border:1px solid var(--line);padding:16px}.local-upload fieldset label,.consent{display:flex;align-items:flex-start;gap:9px}.local-upload button{width:max-content;border:1px solid var(--hot);background:var(--hot);color:var(--ink);padding:13px 17px;cursor:pointer;font:700 11px var(--mono);letter-spacing:.08em;text-transform:uppercase}.share-actions{display:flex;align-items:center;gap:10px;margin:-24px 0 22px}.share-actions button{border:1px solid var(--hot);background:transparent;color:var(--paper);padding:11px 14px;cursor:pointer;font:700 10px var(--mono);letter-spacing:.08em;text-transform:uppercase}.share-actions button:first-child{background:var(--hot);color:var(--ink)}.share-actions span{margin-left:auto;color:var(--quiet);font:10px var(--mono);text-transform:uppercase}.share-frame{border:1px solid var(--line);background:#0a0a09;box-shadow:0 28px 70px rgba(0,0,0,.36);overflow:hidden}.share-frame svg{display:block;width:100%;height:auto}footer{min-height:110px;display:flex;align-items:center;justify-content:space-between;gap:20px;color:var(--muted);font:10px var(--mono);letter-spacing:.1em;text-transform:uppercase}footer b{color:var(--hot)}footer a{text-decoration:none;border-bottom:1px solid var(--line)}.toast{position:fixed;right:24px;bottom:24px;z-index:70;max-width:280px;transform:translateY(130%);opacity:0;background:var(--hot);color:var(--ink);padding:14px 16px;font:700 11px var(--mono);text-transform:uppercase;transition:.25s ease}.toast.show{transform:none;opacity:1}.reveal{opacity:1;transform:none}.full-only{display:none!important}body[data-view=full] .full-only{display:block!important}body[data-view=full] .industry-row.full-only,body[data-view=full] .expertise-item.full-only,body[data-view=full] .practice-proof.full-only,body[data-view=full] .practice-flow.full-only,body[data-view=full] .decision-cell.full-only{display:grid!important}body:not([data-view=full]) .industry-row{grid-template-columns:minmax(0,1fr) 150px}body:not([data-view=full]) .industry-blend{display:none}body:not([data-view=full]) .decision-grid{grid-template-columns:1fr}
body:not([data-view=full]) .source-markers:not(.source-markers--summary){display:none}
.section{padding:clamp(54px,7vw,88px) 0;border-bottom:0}.section-continuation{padding-top:30px}.section-head{grid-template-columns:1fr;gap:12px;margin-bottom:38px}.section-head h2{margin:0}.section-head p{margin-top:12px}.hero{padding-top:clamp(64px,9vw,112px);padding-bottom:clamp(52px,7vw,86px)}.cohort-gate{border:0;background:transparent;padding:12px 0}.cohort-card{border-left:2px solid var(--hot);padding:24px 0 24px 24px}.cohort-gate h2{margin:8px 0 0;font-size:clamp(28px,4vw,42px);line-height:.95}.cohort-gate p{margin:12px 0 0}.cohort-sample{max-width:none}.cohort-sample-head{display:flex;align-items:end;justify-content:space-between;gap:24px}.cohort-upload-link{display:inline-flex;min-height:44px;align-items:center;justify-content:center;border:1px solid var(--hot);padding:12px 16px;color:var(--paper);text-decoration:none;font:700 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}.cohort-upload-link:hover{background:var(--hot);color:var(--ink)}.cohort-sample-rows{margin-top:24px;border-top:1px solid var(--line)}.cohort-sample-row{display:grid;grid-template-columns:minmax(220px,.65fr) minmax(320px,1.35fr);gap:32px;align-items:center;min-height:104px;border-bottom:1px solid var(--line)}.cohort-sample-value{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:baseline}.cohort-sample-value strong{color:var(--hot);font:700 40px/.8 var(--display)}.cohort-sample-value span{max-width:210px;color:var(--muted);font-size:13px;line-height:1.3}.cohort-sample-chart svg{display:block;width:100%;height:68px;overflow:visible}.cohort-sample-chart line{stroke:var(--quiet);stroke-width:1}.cohort-density-fill{fill:rgba(244,240,232,.12);stroke:var(--muted);stroke-width:1.5}.cohort-placement-line{stroke:var(--hot)!important;stroke-dasharray:3 4}.cohort-placement-dot{fill:var(--ink);stroke:var(--hot);stroke-width:3}.cohort-sample-chart text{fill:var(--hot);font:700 8px var(--mono);letter-spacing:.08em}.cohort-sample-note{color:var(--quiet)!important;font:700 9px/1.4 var(--mono);letter-spacing:.08em;text-transform:uppercase}.empty-distribution{display:none}
.section-head--practice h2{max-width:940px;font-size:clamp(40px,5vw,64px)}.operating-signals{display:grid;grid-template-columns:repeat(var(--signal-count),minmax(0,1fr));border-top:1px solid var(--paper);border-bottom:1px solid var(--line)}.operating-signal{min-width:0;padding:24px 24px 24px 0}.operating-signal+.operating-signal{border-left:1px solid var(--line);padding-left:24px}.operating-signal>strong{display:block;margin-top:20px;color:var(--hot);font:700 clamp(44px,5vw,64px)/.8 var(--display)}.operating-signal h3{margin:16px 0 0;font:700 20px/1 var(--display);text-transform:uppercase}.operating-signal p{margin:12px 0 0;color:var(--muted);font-size:14px;line-height:1.45}.operating-signal small{display:block;margin-top:16px;color:var(--quiet);font:700 10px/1.4 var(--mono);letter-spacing:.04em;text-transform:uppercase}.operating-mixes{display:grid;grid-template-columns:repeat(var(--mix-count),minmax(0,1fr));gap:32px;padding:32px 0;border-bottom:1px solid var(--paper)}.operating-mix-head{display:flex;align-items:end;justify-content:space-between;gap:16px}.operating-mix-head h3{margin:0;font:700 22px/1 var(--display);text-transform:uppercase}.operating-mix-head span{color:var(--quiet);font:700 10px/1.4 var(--mono);letter-spacing:.05em;text-transform:uppercase}.operating-mix-bar{display:grid;height:16px;margin-top:16px;border:1px solid var(--line)}.operating-mix-bar i{display:block;background:var(--hot)}.operating-mix-bar i:nth-child(2){background:var(--paper)}.operating-mix-bar i:nth-child(3){background:var(--green)}.operating-mix-bar i:nth-child(4){background:var(--amber)}.operating-mix-bar i+i{border-left:1px solid var(--ink)}.operating-mix-labels{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:12px}.operating-mix-labels span{display:flex;gap:8px;color:var(--quiet);font-size:12px}.operating-mix-labels b{color:var(--muted);font-weight:600}.cohort-example-stamp{border:1px solid var(--hot);padding:8px 12px;color:var(--hot);font:700 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase}.cohort-sample-row{grid-template-columns:minmax(220px,.65fr) minmax(320px,1.35fr);min-height:88px}.cohort-sample-value{display:block}.cohort-sample-value span{display:block;color:var(--paper);font:700 18px/1 var(--display);text-transform:uppercase}.cohort-sample-value strong{display:block;margin-top:8px;color:var(--quiet);font:700 10px/1.4 var(--mono);letter-spacing:.06em;text-transform:uppercase}.cohort-density-fill{fill:rgba(146,138,126,.08);stroke:var(--quiet);stroke-dasharray:4 5;opacity:.55}.cohort-sample-chart text{fill:var(--quiet);font-size:10px;opacity:.8}.cohort-sample-foot{display:flex;align-items:center;justify-content:space-between;gap:24px}.cohort-sample-foot .cohort-upload-link{margin-top:16px}.cohort-sample-note{margin-top:16px!important;font-size:10px}.cohort-upload-link:focus-visible{outline:2px solid var(--paper);outline-offset:4px}.cohort-placement-line,.cohort-placement-dot{display:none}
@media(max-width:900px){.practice-lead{grid-template-columns:1fr}.operating-signals{grid-template-columns:1fr 1fr}.operating-signals[data-signal-count="1"]{grid-template-columns:1fr}.operating-signal:nth-child(3){border-left:0}.operating-signal:nth-child(n+3){border-top:1px solid var(--line)}.decision-grid{grid-template-columns:1fr}.decision-cell+.decision-cell{border-left:0;border-top:1px solid var(--line);padding-left:0}.industry-row,.expertise-item{grid-template-columns:minmax(200px,.7fr) minmax(0,1.3fr)}.industry-depth,.evidence-type{grid-column:2;text-align:left}.practice-flow{grid-template-columns:1fr 1fr}.practice-step:nth-child(3){border-left:0}.practice-step:nth-child(n+3){border-top:1px solid var(--line)}}
@media(max-width:620px){body{font-size:16px}.shell{width:min(calc(100% - 32px),var(--content))}.site-head{align-items:flex-start;padding:14px 0}.brand>span:last-child{display:none}.view-switch button{padding:8px;font-size:9px}.hero{padding-top:68px}.hero h1{font-size:clamp(58px,21vw,92px)}.section-head{grid-template-columns:1fr;gap:18px}.split-method{padding:20px}.split-method-head{align-items:flex-start;flex-direction:column}.split-bar{grid-template-columns:1fr!important}.split-segment+.split-segment{border-left:0;border-top:1px solid var(--ink)}.split-facts,.practice-stats,.practice-flow{grid-template-columns:1fr}.split-facts div{align-items:flex-start;flex-direction:column}.practice-stat:nth-child(even),.practice-step+.practice-step{border-left:0;padding-left:0}.practice-step:nth-child(n+2){border-top:1px solid var(--line)}.practice-proof,.industry-row,.expertise-item,body:not([data-view=full]) .industry-row{grid-template-columns:1fr;gap:10px}.industry-blend{grid-template-columns:1fr}.industry-depth,.evidence-type{grid-column:auto;text-align:left}.evidence-index>div{grid-template-columns:1fr;gap:6px}.share-actions{align-items:stretch;flex-direction:column}.share-actions span{margin-left:0}.share-actions button{width:100%}footer{flex-direction:column;align-items:flex-start;padding-block:28px}.local-upload button{width:100%}}
@media(max-width:620px){.site-head{align-items:center;min-height:58px;padding:8px 0}.hero{padding:48px 0 44px}.thesis{margin-top:28px}.section{padding:44px 0}.section-continuation{padding-top:22px}.section-head{gap:12px;margin-bottom:28px}.section-head p{margin-top:8px}.section-head--practice h2{font-size:36px}.cohort-gate{padding:4px 0}.cohort-card{padding:16px 0 16px 16px}.cohort-gate h2{font-size:30px}.cohort-gate p{margin-top:8px;line-height:1.45}.cohort-sample-head{display:block}.cohort-example-stamp{display:inline-block;margin-top:16px}.cohort-upload-link{width:100%;margin-top:16px}.cohort-sample-rows{margin-top:20px}.cohort-sample-row{grid-template-columns:1fr;gap:8px;min-height:0;padding:16px 0}.cohort-sample-value span{font-size:16px}.cohort-sample-value strong{margin-top:8px;font-size:10px}.cohort-sample-chart svg{height:56px}.cohort-sample-foot{display:block}.cohort-sample-note{margin-top:12px!important;font-size:10px}.operating-signals{grid-template-columns:1fr}.operating-signal{padding:24px 0}.operating-signal+.operating-signal{border-left:0;border-top:1px solid var(--line);padding-left:0}.operating-signal:nth-child(3){border-top:1px solid var(--line)}.operating-signal>strong{font-size:52px}.operating-mixes{grid-template-columns:1fr;gap:32px;padding:32px 0}.operating-mix-head{align-items:flex-start;flex-direction:column;gap:4px}.operating-mix-labels{display:grid;grid-template-columns:1fr}.operating-mix-labels span{justify-content:space-between}}
.practice-stats{grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-bottom:32px}.practice-stat:nth-child(even){border-left:0}.practice-stat+.practice-stat{border-left:1px solid var(--line);padding-left:16px}
@media(max-width:620px){.practice-stats{grid-template-columns:1fr}.practice-stat+.practice-stat{border-left:0;padding-left:0}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}
@media print{:root{--ink:#fff;--surface:#fff;--paper:#111;--muted:#444;--quiet:#555;--line:#bbb;--hot:#b33500}.site-head{position:static}.view-switch,.local-upload,.local-only-notice,.toast{display:none!important}.reveal{opacity:1;transform:none}.full-only{display:block!important}.industry-row.full-only,.expertise-item.full-only,.practice-proof.full-only{display:grid!important}.section{break-inside:avoid}}
`;
