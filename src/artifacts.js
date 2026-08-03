// Vendored from the Overflow site: functions/api/_profile_artifacts.js
// GENERATED FILE — do not edit by hand. Fix it upstream, then run:
//   node scripts/sync-from-overflow.mjs
// De-branding transforms and integrity hashes live in SYNC-MANIFEST.json.

import { config } from "./config.js";
const PROFILE_DATA_RE = /<script\s+type=["']application\/json["']\s+id=["']profile-data["']>([\s\S]*?)<\/script>/i;
const PROFILE_DATA_BLOCK_RE = /(<script\s+type=["']application\/json["']\s+id=["']profile-data["']>)[\s\S]*?(<\/script>)/i;
const WORK_PROFILE_RE = /<section\b[^>]*\bid=["']work-profile["'][^>]*>[\s\S]*?<\/section>/i;
const HERO_SECTION_RE = /<section\b[^>]*\bclass=["'][^"']*\bhero\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i;
const COHORT_GATE_START_RE = /<!--\s*assessment-cohort-gate:start\s*-->/i;
const RENDERED_ARTIFACT_RE = /<section\b[^>]*\bdata-awa-operator-profile(?:=["'][^"']*["'])?[^>]*>[\s\S]*?<\/section>/gi;
const RENDERED_ARTIFACT_STYLE_RE = /<style\b[^>]*\bid=["']assessment-profile-styles["'][^>]*>[\s\S]*?<\/style>/gi;
const RENDERED_ARTIFACT_SCRIPT_RE = /<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?data-awa-share-download(?:(?!<\/script>)[\s\S])*?<\/script>/gi;
const LENS_RADIO_RE = /<input\b[^>]*\bclass=["'][^"']*\blens-radio\b[^"']*["'][^>]*>/gi;
const LENS_SWITCH_RE = /<div\b[^>]*\bclass=["'][^"']*\blens-switch\b[^"']*["'][^>]*>[\s\S]*?<\/div>/gi;

const FAMILY_META = {
  technical_chops: { label: "Technical chops", code: "T" },
  business_know_how: { label: "Business know-how", code: "B" },
  good_judgment: { label: "Good judgment", code: "J" },
};

const BADGE_META = {
  "prototyper": { serial: "T-01", lines: ["Prototyper"], glyph: '<circle class="fill-hot" cx="25" cy="65" r="8"/><path class="line ivory" d="M38 65h30l20-30h42M68 65h30l20 30h37"/><path class="fine orange" d="M130 35c29 3 35 15 35 30s-6 27-35 30"/><circle class="fine ivory fill-bg" cx="68" cy="65" r="7"/><circle class="fill-ink" cx="130" cy="35" r="5"/><circle class="fill-ink" cx="155" cy="95" r="5"/>' },
  "frontend-crafter": { serial: "T-02", lines: ["Frontend", "Crafter"], glyph: '<rect class="line ivory" x="24" y="18" width="132" height="94" rx="4"/><path class="fine muted" d="M24 42h132M70 42v70"/><rect class="fine orange" x="82" y="55" width="57" height="18"/><path class="fine ivory" d="M82 84h44M82 96h27"/><circle class="fill-hot" cx="38" cy="30" r="4"/><circle class="fill-ink" cx="50" cy="30" r="4"/>' },
  "production-shipper": { serial: "T-03", lines: ["Production", "Shipper"], glyph: '<path class="line ivory" d="M18 25h35l18 22h30M18 65h53M18 105h35l18-22h30"/><path class="line muted" d="M101 18v94"/><path class="fine muted dash" d="M112 18v94"/><path class="line orange" d="M55 65h84"/><path class="fill-hot" d="m140 65-13-9v18z"/><circle class="fine ivory fill-bg" cx="151" cy="65" r="14"/><circle class="fill-hot" cx="151" cy="65" r="6"/>' },
  "systems-architect": { serial: "T-04", lines: ["Systems", "Architect"], glyph: '<path class="line ivory" d="m30 32 60-18 60 18-60 18zM30 65l60-18 60 18-60 18zM30 98l60-18 60 18-60 18z"/><path class="line orange" d="M90 12v106"/><path class="fine muted dash" d="M30 32v66M150 32v66"/><circle class="fill-hot" cx="90" cy="47" r="5"/><circle class="fill-hot" cx="90" cy="80" r="5"/>' },
  "context-engineer": { serial: "T-05", lines: ["Context", "Engineer"], glyph: '<rect class="fine ivory" x="25" y="20" width="55" height="24"/><rect class="fine ivory" x="25" y="53" width="55" height="24"/><rect class="fine ivory" x="25" y="86" width="55" height="24"/><path class="line muted" d="M80 32h25M80 65h25M80 98h25"/><path class="line orange" d="m105 25 40 40-40 40"/><rect class="fine orange" x="123" y="53" width="32" height="24"/><circle class="fill-hot" cx="145" cy="65" r="5"/>' },
  "agent-orchestrator": { serial: "T-06", lines: ["Agent", "Orchestrator"], glyph: '<path class="fine muted dash" d="M90 18 139 40v50l-49 22-49-22V40z"/><path class="fine ivory" d="M90 47V18M107 54l32-14M107 76l32 14M90 83v29M73 76 41 90M73 54 41 40"/><path class="line orange" d="m90 45 18 10v20L90 85 72 75V55z"/><circle class="fill-hot" cx="90" cy="65" r="6"/><circle class="fine ivory fill-bg" cx="90" cy="18" r="8"/><circle class="fine ivory fill-bg" cx="139" cy="40" r="8"/><circle class="fine ivory fill-bg" cx="139" cy="90" r="8"/><circle class="fine ivory fill-bg" cx="90" cy="112" r="8"/><circle class="fine ivory fill-bg" cx="41" cy="90" r="8"/><circle class="fine ivory fill-bg" cx="41" cy="40" r="8"/>' },
  "workflow-architect": { serial: "B-01", lines: ["Workflow", "Architect"], glyph: '<circle class="fine orange" cx="28" cy="30" r="12"/><path class="fine ivory" d="M40 30h28l18 25 20-25h35M86 55l20 25h35M86 55 64 91H35"/><path class="fine orange" d="m86 39 16 16-16 16-16-16z"/><circle class="fill-ink" cx="141" cy="30" r="5"/><circle class="fill-ink" cx="141" cy="80" r="5"/><circle class="fill-hot" cx="35" cy="91" r="6"/>' },
  "value-translator": { serial: "B-02", lines: ["Value", "Translator"], glyph: '<circle class="line orange" cx="38" cy="65" r="22"/><circle class="fill-hot" cx="38" cy="65" r="6"/><path class="line ivory" d="M60 65h35l18-24h35M95 65l18 24h35"/><path class="fine muted dash" d="M78 35v60"/><circle class="fine ivory fill-bg" cx="148" cy="41" r="10"/><circle class="fine ivory fill-bg" cx="148" cy="89" r="10"/>' },
  "clear-communicator": { serial: "B-03", lines: ["Clear", "Communicator"], glyph: '<rect class="fine ivory" x="22" y="20" width="53" height="70" rx="4"/><path class="fine muted" d="M32 34h33M32 47h26M32 60h33"/><path class="line orange" d="M75 55h32"/><path class="fill-hot" d="m109 55-12-8v16z"/><path class="fine ivory" d="M109 32h45v46h-45zM120 44h23M120 56h17"/><path class="line ivory" d="m119 92 9 9 20-25"/>' },
  "adoption-operator": { serial: "B-04", lines: ["Adoption", "Operator"], glyph: '<rect class="fine ivory" x="23" y="51" width="40" height="28"/><path class="line orange" d="M63 65h40"/><path class="fill-hot" d="m105 65-12-8v16z"/><path class="fine ivory" d="M120 41a30 30 0 1 1-7 42"/><path class="fill-ink" d="m116 35 12 5-8 10z"/><circle class="fine ivory fill-bg" cx="145" cy="65" r="14"/><circle class="fill-hot" cx="145" cy="65" r="5"/>' },
  "verification-first": { serial: "J-01", lines: ["Verification", "First"], glyph: '<path class="fine muted dash" d="M28 35h64M28 65h64M28 95h64"/><circle class="fine ivory fill-bg" cx="28" cy="35" r="7"/><circle class="fine ivory fill-bg" cx="28" cy="65" r="7"/><circle class="fine ivory fill-bg" cx="28" cy="95" r="7"/><circle class="line orange" cx="130" cy="65" r="31"/><path class="line ivory" d="m113 66 11 11 23-27"/>' },
  "tradeoff-navigator": { serial: "J-02", lines: ["Tradeoff", "Navigator"], glyph: '<path class="line ivory" d="M90 24v75M55 103h70M52 48h76"/><path class="fine ivory" d="m52 48-22 35h44zM128 48l-22 35h44z"/><circle class="fill-hot" cx="90" cy="24" r="7"/><path class="line orange" d="M62 42h56"/>' },
  "recovery-operator": { serial: "J-03", lines: ["Recovery", "Operator"], glyph: '<path class="line ivory" d="M25 40h55l24 25h45"/><path class="fine muted dash" d="M80 40 104 90h45"/><path class="line orange" d="M120 90H68c-22 0-31-11-31-25"/><path class="fill-hot" d="m37 54-8 13h16z"/><path class="fine orange" d="m104 52 13 13-13 13-13-13z"/><circle class="fine ivory fill-bg" cx="149" cy="65" r="11"/>' },
  "systems-steward": { serial: "J-04", lines: ["Systems", "Steward"], glyph: '<rect class="line ivory" x="29" y="20" width="122" height="90" rx="24"/><circle class="line orange" cx="90" cy="65" r="20"/><circle class="fill-hot" cx="90" cy="65" r="7"/><path class="fine ivory" d="M90 45V27M90 103V85M70 65H41M139 65h-29M76 51 59 38M121 92l-17-13M76 79 59 92M121 38l-17 13"/><path class="fine orange" d="M48 42c-10 15-10 31 0 46M132 88c10-15 10-31 0-46"/>' },
};

const BADGE_GUIDE = {
  "prototyper": { definition: "Turns ambiguous ideas into functional artifacts real users can try.", next: "Show a second distinct working prototype with direct user learning or iteration." },
  "frontend-crafter": { definition: "Demonstrates repeated interface, responsive, accessibility, or design-system judgment.", next: "Show authored interface implementation and the concrete visual or interaction decisions that survived review." },
  "production-shipper": { definition: "Gets substantive changes into live use through a release, deployment, migration, or handoff.", next: "Show independent live outcomes across additional systems, with release verification rather than staging evidence." },
  "systems-architect": { definition: "Makes consequential technical boundary, data, dependency, migration, or reliability decisions.", next: "Show an architecture decision that survived implementation and its effect on reliability, change cost, or scale." },
  "context-engineer": { definition: "Structures, refreshes, compresses, and hands off durable context for agents.", next: "Show the same context system reused across distinct projects with an observable quality or recovery benefit." },
  "agent-orchestrator": { definition: "Scopes work across agents, integrates their results, and verifies the combined outcome.", next: "Show repeated multi-agent delivery across independent systems, including conflict handling and integration checks." },
  "workflow-architect": { definition: "Maps actors, decisions, exceptions, controls, and data into a scalable operating workflow.", next: "Show the workflow operating across another business process, including exception handling and measured adoption." },
  "value-translator": { definition: "Connects business goals, economics, or customer constraints to technical scope and priorities.", next: "Show repeated alternatives, explicit economics, and an observed downstream business outcome." },
  "clear-communicator": { definition: "Provides stable outcomes, context, constraints, corrections, and definitions of done.", next: "Show low clarification burden and clear decision closure across at least three substantive tasks and two periods." },
  "adoption-operator": { definition: "Builds the handoff, training, governance, and operating loop that makes a system stick.", next: "Show a repeated post-launch adoption loop with real users, follow-up review, and evidence the system stayed in use." },
  "verification-first": { definition: "Uses independent checks before accepting output or declaring work complete.", next: "Show diverse verification modes across independent systems, including a check that caught a consequential defect." },
  "tradeoff-navigator": { definition: "Chooses among alternatives using explicit value, cost, risk, maintainability, or time constraints.", next: "Show repeated decisions with named alternatives, consequences, and evidence that the chosen tradeoff held up." },
  "recovery-operator": { definition: "Diagnoses a real failure, restores a safe state, constrains the retry, and changes the approach.", next: "Show independent recovery episodes across systems, including prevention or monitoring added afterward." },
  "systems-steward": { definition: "Improves an established or live system over time through maintenance, reliability, or governance.", next: "Show longer post-launch operating windows with monitoring, maintenance decisions, and careful production change." },
};

function badgeDocsLink() {
  return config.badgesUrl
    ? `<a href="${escapeHtml(config.badgesUrl)}">Definitions &amp; thresholds →</a>`
    : "";
}

export function injectOperatorProfileArtifacts(html, { benchmark = null, local = false } = {}) {
  let output = String(html || "")
    .replace(RENDERED_ARTIFACT_RE, "")
    .replace(RENDERED_ARTIFACT_STYLE_RE, "")
    .replace(RENDERED_ARTIFACT_SCRIPT_RE, "");
  output = removeAlternateLenses(output);
  const profile = parseProfileData(output);
  // Schema v9 uses the fixed matching-profile template. Badge grids and share
  // cards are legacy presentation artifacts and must not be injected into it.
  if (Number(profile?.schema_version) >= 9) return output;
  if (!usesOperatorBadgeSchema(profile) || !profile?.badges || typeof profile.badges !== "object") return output;
  const badges = badgeEntries(profile);
  if (!badges.length || !/<\/head>/i.test(output) || !/<\/body>/i.test(output)) return output;

  const section = operatorProfileSection(profile, badges, benchmark, local);
  output = WORK_PROFILE_RE.test(output)
    ? output.replace(WORK_PROFILE_RE, section)
    : COHORT_GATE_START_RE.test(output)
      ? output.replace(COHORT_GATE_START_RE, `${section}\n<!-- assessment-cohort-gate:start -->`)
      : HERO_SECTION_RE.test(output)
        ? output.replace(HERO_SECTION_RE, (hero) => `${hero}\n${section}`)
        : output.replace(/<\/body>/i, `${section}</body>`);
  return output
    .replace(/<\/head>/i, `${OPERATOR_PROFILE_STYLES}</head>`)
    .replace(/<\/body>/i, `${OPERATOR_PROFILE_SCRIPT}</body>`);
}

function removeAlternateLenses(html) {
  let output = String(html || "")
    .replace(LENS_RADIO_RE, "")
    .replace(LENS_SWITCH_RE, "")
    .replace(/Community lens/gi, "Community profile");
  const profile = parseProfileData(output);
  if (profile?.viewer_lenses && typeof profile.viewer_lenses === "object") {
    profile.viewer_lenses = profile.viewer_lenses.community
      ? { community: profile.viewer_lenses.community }
      : {};
    const safeData = JSON.stringify(profile, null, 2).replace(/</g, "\\u003c");
    output = output.replace(PROFILE_DATA_BLOCK_RE, (_, open, close) => `${open}\n${safeData}\n${close}`);
  }
  return output;
}

function parseProfileData(html) {
  const match = String(html || "").match(PROFILE_DATA_RE);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
}

function badgeEntries(profile) {
  const entries = [];
  for (const [familyKey, family] of Object.entries(FAMILY_META)) {
    const items = Array.isArray(profile?.badges?.[familyKey]) ? profile.badges[familyKey] : [];
    for (const item of items) {
      const meta = BADGE_META[item?.tag];
      if (!meta) continue;
      const stars = clampStars(item?.proof_stars);
      entries.push({
        ...item,
        stars,
        status: stars === 1 || item?.status === "emerging" ? "emerging" : "earned",
        familyKey,
        family: family.label,
        meta,
        promptVersion: Number(profile?.prompt_version) || 1,
        schemaVersion: Number(profile?.schema_version) || 1,
      });
    }
  }
  return entries;
}

function operatorProfileSection(profile, badges, benchmark, local) {
  const earned = badges.filter((badge) => badge.status === "earned");
  const emerging = badges.filter((badge) => badge.status === "emerging").slice(0, 2);
  const missing = missingBadgeEntries(profile, badges);
  const familySections = Object.entries(FAMILY_META).map(([familyKey, family]) => {
    const familyBadges = badges.filter((badge) => badge.familyKey === familyKey);
    if (!familyBadges.length) return "";
    return `<div class="awa-oe__pillar">
      <div class="awa-oe__pillar-head"><span>${escapeHtml(family.label)}</span><i>${familyBadges.filter((badge) => badge.status === "earned").length} earned</i></div>
      <div class="awa-oe__grid">${familyBadges.map(credentialCard).join("")}</div>
      ${familyKey === "business_know_how" ? domainStamps(profile) : ""}
    </div>`;
  }).join("");
  const role = profile?.project_role?.best_fit || profile?.focus || profile?.headline || "";
  return `<section class="awa-oe" id="work-profile" data-awa-operator-profile aria-labelledby="awa-oe-title">
    <div class="awa-oe__top"><div><span class="awa-oe__index">01 / Work profile</span><h2 id="awa-oe-title">Operator Engineer <em>evidence map.</em></h2><p>Labels organize the proof across technical chops, business know-how, and good judgment; the cited work is the claim.</p></div>${badgeDocsLink()}</div>
    <div class="awa-oe__pillars">${familySections}</div>
    <div class="awa-oe__legend"><span><b>★</b> Observed</span><span><b>★★</b> Established</span><span><b>★★★</b> Demonstrated</span><span>Stars show proof strength, not skill level.</span></div>
    ${role ? `<p class="awa-oe__role">${escapeHtml(role)}</p>` : ""}
    ${missingBadgeSection(missing)}
    ${earned.length ? shareStudio(profile, badges, benchmark, local) : ""}
  </section>`;
}

function credentialCard(badge) {
  const lines = badge.meta.lines.map((line) => `<span>${escapeHtml(line)}</span>`).join("");
  return `<article class="awa-credential awa-credential--${badge.status}">
    <div class="awa-credential__inner">
      <div class="awa-credential__head"><span>${escapeHtml(badge.family)}</span><b aria-label="${badge.stars} proof stars">${"★".repeat(badge.stars)}</b><i>${badge.meta.serial}</i></div>
      <svg class="awa-glyph" viewBox="0 0 180 130" role="img" aria-label="${escapeAttr(badge.label)} badge mark">${badge.meta.glyph}</svg>
      <h3>${lines}</h3>
      <p>${escapeHtml(badge.evidence)}</p>
      ${badgeProofNote(badge)}
      ${badge.status === "emerging" ? '<span class="awa-credential__forming">Pattern still forming</span>' : ""}
    </div>
  </article>`;
}

function badgeProofNote(badge) {
  const arcCount = Array.isArray(badge.arc_ids) ? badge.arc_ids.length : 0;
  if (badge.stars < 3) {
    const next = badge.next_star_evidence || BADGE_GUIDE[badge.tag]?.next || "Add independent evidence from another substantive work arc.";
    return `<div class="awa-credential__proof"><b>Next star</b><span>${escapeHtml(next)}</span></div>`;
  }
  if (badge.schemaVersion < 8) {
    return `<div class="awa-credential__proof"><b>Legacy pre-schema-v8 rating</b><span>${arcCount} cited work arc${arcCount === 1 ? "" : "s"}; not yet recalibrated against the current 90-day, cross-system three-star rule.</span></div>`;
  }
  const basis = badge?.proof_basis && typeof badge.proof_basis === "object"
    ? [badge.proof_basis.arc_count ? `${badge.proof_basis.arc_count} qualifying arcs` : "", badge.proof_basis.system_count ? `${badge.proof_basis.system_count} systems` : "", badge.proof_basis.span_days ? `${badge.proof_basis.span_days} days` : ""].filter(Boolean).join(" · ")
    : `${arcCount} cited work arc${arcCount === 1 ? "" : "s"} · ${badge.confidence || "unspecified"} confidence`;
  return `<div class="awa-credential__proof"><b>Why ★★★</b><span>${escapeHtml(basis)}</span></div>`;
}

function usesOperatorBadgeSchema(profile) {
  const schemaVersion = Number(profile?.schema_version) || 1;
  return schemaVersion < 9 && (schemaVersion >= 7 || Number(profile?.prompt_version) >= 8);
}

function missingBadgeEntries(profile, awarded) {
  const awardedTags = new Set(awarded.map((badge) => badge.tag));
  const auditItems = Array.isArray(profile?.badge_audit?.not_awarded) ? profile.badge_audit.not_awarded : [];
  const auditByTag = new Map(auditItems.map((item) => [item?.tag, item]));
  const notes = (Array.isArray(profile?.badge_audit?.evidence_reuse_notes) ? profile.badge_audit.evidence_reuse_notes : []).join(" ").toLowerCase();
  return Object.entries(BADGE_META).filter(([tag]) => !awardedTags.has(tag)).map(([tag, meta]) => {
    const audit = auditByTag.get(tag);
    const omittedByV8Cap = Number(profile?.prompt_version) === 8 && (notes.includes(tag) || /display cap|six-badge|badge cap/i.test(String(audit?.reason || "")));
    const familyKey = meta.serial.startsWith("T-") ? "technical_chops" : meta.serial.startsWith("B-") ? "business_know_how" : "good_judgment";
    return {
      tag,
      meta,
      family: FAMILY_META[familyKey].label,
      label: meta.lines.join(" "),
      state: omittedByV8Cap ? "Unrated by v8 cap" : "Not awarded",
      reason: omittedByV8Cap
        ? audit?.reason || "The prior evaluator said this met a threshold, then removed it to satisfy the six-badge display cap. That rating was never retained."
        : audit?.reason || "This assessment did not retain enough badge-specific evidence to clear the observed threshold.",
      next: omittedByV8Cap
        ? audit?.missing_evidence || "Rerun the current assessment for an independent calibrated rating; the display cap is no longer used as a scoring rule."
        : audit?.missing_evidence || BADGE_GUIDE[tag]?.next || "Add direct, badge-specific evidence from a substantive work arc.",
      definition: BADGE_GUIDE[tag]?.definition || "A controlled Operator Engineer evidence pattern.",
    };
  });
}

function missingBadgeSection(missing) {
  if (!missing.length) return "";
  return `<div class="awa-missing" id="badge-map"><div class="awa-missing__head"><div><span>Full badge map</span><h3>What was not awarded—and why.</h3><p>Gray cards are not deficiencies. They show where this file lacked enough retained proof, or where the old v8 display cap prevented a rating from being saved.</p></div><b>${missing.length} of ${Object.keys(BADGE_META).length} not awarded or unrated</b></div><div class="awa-missing__grid">${missing.map(missingBadgeCard).join("")}</div></div>`;
}

function missingBadgeCard(badge) {
  return `<article class="awa-missing-card"><svg viewBox="0 0 180 130" aria-hidden="true">${badge.meta.glyph}</svg><div><span>${escapeHtml(badge.family)} · ${escapeHtml(badge.state)}</span><h4>${escapeHtml(badge.label)}</h4><p>${escapeHtml(badge.definition)}</p><dl><dt>Why not</dt><dd>${escapeHtml(badge.reason)}</dd><dt>Next proof</dt><dd>${escapeHtml(badge.next)}</dd></dl></div></article>`;
}

function domainStamps(profile) {
  const stamps = [
    ...(Array.isArray(profile?.domain_stamps?.functions) ? profile.domain_stamps.functions : []),
    ...(Array.isArray(profile?.domain_stamps?.industries) ? profile.domain_stamps.industries : []),
  ].filter((stamp) => stamp?.label && Number(stamp?.proof_stars) >= 2).slice(0, 4);
  if (!stamps.length) return "";
  return `<div class="awa-domain-stamps"><span class="awa-domain-stamps__label">Domain proof</span>${stamps.map((stamp) => `<span>${escapeHtml(stamp.label)} <b>${"★".repeat(clampStars(stamp.proof_stars))}</b></span>`).join("")}</div>`;
}

function shareStudio(profile, badges, benchmark, local) {
  const card = shareCardSvg(profile, badges, benchmark, local);
  const slug = slugify(profile?.name || "operator-engineer");
  const localNote = local ? " This localhost preview uses synthetic test-cohort records; its percentiles are not shareable claims." : "";
  return `<div class="awa-share" id="share-card" data-awa-share-studio>
    <div class="awa-share__head"><div><span>Share the proof</span><h3>A LinkedIn-ready evidence card.</h3><p>Activity, coverage, comparative placement, and concrete work arcs lead. Badge terms appear only as secondary evidence lenses.${escapeHtml(localNote)}</p></div><div class="awa-share__actions"><button type="button" data-awa-share-download data-filename="${escapeAttr(slug)}-proof-card.png">${local ? "Download test PNG" : "Download PNG"}</button><button type="button" data-awa-share-copy>Copy profile link</button></div></div>
    <div class="awa-share__frame">${card}</div>
    <p class="awa-share__note" data-awa-share-status aria-live="polite">1200 × 627 · sized for a LinkedIn feed post</p>
  </div>`;
}

function shareCardSvg(profile, badges, benchmark, local) {
  const nameLines = splitName(profile?.name || "Operator Engineer");
  const nameSize = nameLines.join(" ").length > 24 ? 45 : 54;
  const metrics = shareMetrics(profile, benchmark);
  const primary = metrics[0];
  const secondary = metrics[1];
  const captured = metricByKey(benchmark, "capturedSessions")?.displayValue || capturedSessions(profile) || "—";
  const activeWeeks = metricByKey(benchmark, "activeWeeks")?.displayValue || profile?.cadence?.active_weeks_last_12 || "—";
  const arcCount = Array.isArray(profile?.work_arcs) ? profile.work_arcs.length : 0;
  const highlights = shareProofHighlights(badges).map((badge, index) => shareProofBlock(badge, index)).join("");
  return `<svg class="awa-share-card" data-awa-share-card xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 627" role="img" aria-labelledby="awa-share-title awa-share-desc">
    <title id="awa-share-title">${escapeHtml(profile?.name || "Operator Engineer")} — evidence-backed AI work profile</title>
    <desc id="awa-share-desc">A proof-first share card with captured activity, comparative placement, and cited work arcs.</desc>
    <style>.card-label{font-family:Arial Narrow,Arial,sans-serif;font-weight:800;letter-spacing:-1px}.card-mono{font-family:Menlo,Consolas,monospace;letter-spacing:1.5px}.card-body{font-family:Arial,Helvetica,sans-serif}.curve{fill:rgba(169,160,148,.2);stroke:#7e766b;stroke-width:.8;vector-effect:non-scaling-stroke}</style>
    <defs><linearGradient id="awa-card-glow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff4d00"/><stop offset="1" stop-color="#ff7a00"/></linearGradient><clipPath id="awa-card-clip"><rect width="1200" height="627" rx="28"/></clipPath></defs>
    <g clip-path="url(#awa-card-clip)"><rect width="1200" height="627" fill="#0d0c0a"/><circle cx="-22" cy="646" r="250" fill="none" stroke="#ff4d00" stroke-width="86"/><path d="M0 0h390v627H0z" fill="url(#awa-card-glow)" opacity=".06"/><path d="M390 0v627" stroke="#302a23"/><text x="46" y="48" class="card-mono" font-size="14" fill="#ff4d00">${escapeHtml(config.siteName.toUpperCase())} / AI WORK PROFILE</text><text x="1150" y="48" text-anchor="end" class="card-mono" font-size="11" fill="${local ? "#ff4d00" : "#a9a094"}">${local ? "LOCAL TEST COHORT · NOT FOR SHARING" : "EVIDENCE, NOT VIBES"}</text>
      ${nameLines.map((line, index) => `<text x="46" y="${112 + index * (nameSize * .9)}" class="card-label" font-size="${nameSize}" fill="#f3eee4">${escapeHtml(line.toUpperCase())}</text>`).join("")}
      <text x="46" y="286" class="card-label" font-size="100" fill="#ff4d00">${escapeHtml(captured)}</text><text x="46" y="315" class="card-mono" font-size="12" fill="#f3eee4">CAPTURED AGENT SESSIONS</text>
      <text x="46" y="365" class="card-label" font-size="34" fill="#f3eee4">${escapeHtml(activeWeeks)}</text><text x="112" y="365" class="card-body" font-size="15" fill="#c2b9ad">active weeks</text><text x="46" y="405" class="card-label" font-size="34" fill="#f3eee4">${arcCount}</text><text x="112" y="405" class="card-body" font-size="15" fill="#c2b9ad">classified work arcs</text><text x="46" y="588" class="card-mono" font-size="11" fill="#0d0c0a">${escapeHtml(config.shareCardFooter)}</text>
      ${shareMetricBlock(primary, 424, 82)}${shareMetricBlock(secondary, 804, 82)}
      <text x="424" y="324" class="card-mono" font-size="11" fill="#ff4d00">THREE CITED PROOF LENSES</text>${highlights}
      <text x="424" y="585" class="card-mono" font-size="10" fill="#777066">CAPTURE WINDOWS VARY BY TOOL · COMPARISONS USE COMPATIBLE SUBMISSIONS ONLY</text>
    </g>
  </svg>`;
}

function shareMetrics(profile, benchmark) {
  const preferred = ["capturedSessions", "recentSessions", "activeWeeks", "sessionsPerCapturedWeek", "codexSessions", "claudeCodeSessions"];
  const available = Array.isArray(benchmark?.metrics) ? benchmark.metrics.filter((metric) => !metric?.missing && !metric?.pending && Number.isFinite(metric?.percentile)) : [];
  const ordered = preferred.map((key) => available.find((metric) => metric.key === key)).filter(Boolean);
  if (ordered.length >= 2) return ordered.slice(0, 2);
  const fallbacks = [
    { label: "Active agent weeks", displayValue: String(profile?.cadence?.active_weeks_last_12 ?? "—"), shortLabel: "active weeks", percentile: null },
    { label: "Recent agent activity", displayValue: String(profile?.cadence?.sessions_last_28d ?? "—"), shortLabel: "sessions in 28 days", percentile: null },
  ];
  return [...ordered, ...fallbacks].slice(0, 2);
}

function shareMetricBlock(metric, x, y) {
  if (!metric) return "";
  const percentile = Number.isFinite(metric.percentile) ? `${metric.percentile}TH PERCENTILE` : "ABSOLUTE OBSERVATION";
  const curve = metric.densityPath
    ? `<svg x="${x + 18}" y="${y + 64}" width="318" height="50" viewBox="0 0 100 34" preserveAspectRatio="none"><path class="curve" d="${escapeAttr(metric.densityPath)}"/><line x1="${Number(metric.position) || 5}" y1="2" x2="${Number(metric.position) || 5}" y2="31" stroke="#ff4d00" stroke-width="1.2"/><circle cx="${Number(metric.position) || 5}" cy="24" r="3" fill="#0d0c0a" stroke="#ff4d00" stroke-width="2"/></svg>`
    : `<line x1="${x + 18}" y1="${y + 95}" x2="${x + 336}" y2="${y + 95}" stroke="#302a23"/>`;
  return `<g><rect x="${x}" y="${y}" width="350" height="178" rx="5" fill="#15130f" stroke="#373027"/><text x="${x + 18}" y="${y + 27}" class="card-mono" font-size="10" fill="#a9a094">${escapeHtml(String(metric.label || "ACTIVITY").toUpperCase())}</text><text x="${x + 18}" y="${y + 57}" class="card-label" font-size="32" fill="#f3eee4">${escapeHtml(metric.displayValue || "—")}</text><text x="${x + 335}" y="${y + 56}" text-anchor="end" class="card-mono" font-size="10" fill="#ff4d00">${percentile}</text>${curve}<text x="${x + 18}" y="${y + 157}" class="card-mono" font-size="9" fill="#777066">${escapeHtml(String(metric.shortLabel || "OBSERVED").toUpperCase())}${metric.coverage ? ` · DIRECTIONAL N=${metric.coverage}` : ""}</text></g>`;
}

function shareProofHighlights(badges) {
  const preferred = ["production-shipper", "workflow-architect", "verification-first"];
  const earned = badges.filter((badge) => badge.status === "earned");
  const selected = preferred.map((tag) => earned.find((badge) => badge.tag === tag)).filter(Boolean);
  for (const badge of earned) if (selected.length < 3 && !selected.includes(badge)) selected.push(badge);
  return selected.slice(0, 3);
}

function shareProofBlock(badge, index) {
  const x = 424 + index * 250;
  const arcs = Array.isArray(badge.arc_ids) ? badge.arc_ids.length : 0;
  const proofLines = wrapText(badge.evidence || "Evidence cited in the full profile.", 31, 2);
  return `<g><rect x="${x}" y="344" width="224" height="192" rx="4" fill="#11100d" stroke="#302a23"/><path d="M${x} 344h5v192h-5z" fill="#ff4d00"/><text x="${x + 18}" y="373" class="card-mono" font-size="9" fill="#ff4d00">${escapeHtml(badge.meta.serial)} · ${arcs} CITED ARC${arcs === 1 ? "" : "S"}</text>${badge.meta.lines.map((line, lineIndex) => `<text x="${x + 18}" y="${413 + lineIndex * 27}" class="card-label" font-size="25" fill="#f3eee4">${escapeHtml(line.toUpperCase())}</text>`).join("")}${proofLines.map((line, lineIndex) => `<text x="${x + 18}" y="${480 + lineIndex * 17}" class="card-body" font-size="11" fill="#b3aa9e">${escapeHtml(line)}</text>`).join("")}<text x="${x + 18}" y="516" class="card-mono" font-size="8" fill="#777066">LENS, NOT A COMPOSITE SCORE</text></g>`;
}

function metricByKey(benchmark, key) {
  return Array.isArray(benchmark?.metrics) ? benchmark.metrics.find((metric) => metric.key === key && !metric.missing) : null;
}

function capturedSessions(profile) {
  if (!profile?.windows || typeof profile.windows !== "object" || Array.isArray(profile.windows)) return null;
  let total = 0;
  let seen = false;
  for (const value of Object.values(profile.windows)) {
    for (const item of (Array.isArray(value) ? value : [value])) {
      const sessions = Number(item?.sessions);
      if (Number.isFinite(sessions)) { total += sessions; seen = true; }
    }
  }
  return seen ? String(total) : null;
}

function truncate(value, limit) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > limit ? `${text.slice(0, Math.max(0, limit - 1)).trimEnd()}…` : text;
}

function wrapText(value, width, maxLines) {
  const words = String(value || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= width || !line) line = candidate;
    else {
      lines.push(line);
      line = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  const source = words.join(" ");
  const joined = lines.join(" ");
  if (source.length > joined.length && lines.length) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = `${last.slice(0, Math.max(3, width - 1)).trimEnd()}…`;
  }
  return lines;
}

function splitName(value) {
  const words = String(value || "").trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [words[0] || "OPERATOR", "ENGINEER"];
  if (words.length === 2) return words;
  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}

function slugify(value) {
  return String(value || "operator-engineer").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "operator-engineer";
}

function clampStars(value) {
  const stars = Number(value);
  return Number.isFinite(stars) ? Math.max(1, Math.min(3, Math.trunc(stars))) : 1;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

const OPERATOR_PROFILE_SCRIPT = `<script>(()=>{const studio=document.querySelector('[data-awa-share-studio]');if(!studio||studio.dataset.ready)return;studio.dataset.ready='1';const status=studio.querySelector('[data-awa-share-status]');const download=studio.querySelector('[data-awa-share-download]');const copy=studio.querySelector('[data-awa-share-copy]');if(download)download.addEventListener('click',()=>{const svg=studio.querySelector('[data-awa-share-card]');if(!svg)return;const source=new XMLSerializer().serializeToString(svg);const blob=new Blob([source],{type:'image/svg+xml;charset=utf-8'});const url=URL.createObjectURL(blob);const image=new Image();image.onload=()=>{const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=627;const context=canvas.getContext('2d');context.drawImage(image,0,0,1200,627);URL.revokeObjectURL(url);canvas.toBlob((png)=>{if(!png)return;const pngUrl=URL.createObjectURL(png);const link=document.createElement('a');link.href=pngUrl;link.download=download.dataset.filename||'ai-work-assessment-proof-card.png';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(pngUrl),1000);if(status)status.textContent='PNG downloaded · ready to attach on LinkedIn';},'image/png');};image.onerror=()=>{URL.revokeObjectURL(url);if(status)status.textContent='Image export failed in this browser.';};image.src=url;});if(copy)copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);if(status)status.textContent='Profile link copied.';}catch{if(status)status.textContent='Copy the profile URL from your browser.';}});})();</script>`;

const OPERATOR_PROFILE_STYLES = `<style id="assessment-profile-styles">
.awa-oe{--oe-bg:#0d0c0a;--oe-card:#15130f;--oe-paper:#f3eee4;--oe-muted:#a9a094;--oe-line:#302a23;--oe-hot:#ff4d00;position:relative;isolation:isolate;margin:0!important;padding:clamp(56px,8vw,96px) clamp(20px,6vw,76px)!important;border-top:1px solid var(--oe-line)!important;background:var(--oe-bg);color:var(--oe-paper);font-family:inherit;overflow:hidden}.awa-oe *{box-sizing:border-box}.awa-oe__top,.awa-oe__pillars,.awa-oe__legend,.awa-oe__role,.awa-missing,.awa-share{width:min(1120px,100%);margin-left:auto;margin-right:auto}.awa-oe__top{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:28px;align-items:end}.awa-oe__index,.awa-oe__pillar-head,.awa-domain-stamps__label,.awa-share__head>div>span,.awa-missing__head>div>span{display:block;color:var(--oe-hot);font:11px/1.4 ui-monospace,'SF Mono',Menlo,Consolas,monospace;letter-spacing:.15em;text-transform:uppercase}.awa-oe__top h2{max-width:850px;margin:16px 0 0!important;font-size:clamp(42px,7vw,88px)!important;line-height:.88!important;letter-spacing:-.05em!important;text-transform:uppercase}.awa-oe__top h2 em{font-family:Georgia,serif;font-weight:400;text-transform:none;color:var(--oe-hot)}.awa-oe__top p{max-width:660px;margin:20px 0 0;color:var(--oe-muted);font-size:14px;line-height:1.65}.awa-oe__top>a{color:var(--oe-hot);font:11px ui-monospace,'SF Mono',Menlo,Consolas,monospace;letter-spacing:.1em;text-decoration:none;text-transform:uppercase;border-bottom:1px solid var(--oe-hot);padding-bottom:5px;white-space:nowrap}.awa-oe__pillars{display:grid;gap:42px;margin-top:50px}.awa-oe__pillar{border-top:1px solid var(--oe-line);padding-top:15px}.awa-oe__pillar-head{display:flex;justify-content:space-between;gap:18px;color:var(--oe-paper)}.awa-oe__pillar-head i{color:var(--oe-muted);font-style:normal}.awa-oe__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:18px}.awa-credential{min-width:0;min-height:380px;background:linear-gradient(145deg,#1b1813,#0f0e0c);border:1px solid #3b342b;padding:8px;box-shadow:0 12px 30px rgba(0,0,0,.18)}.awa-credential--emerging{border-style:dashed;opacity:.82}.awa-credential__inner{position:relative;height:100%;border:1px solid #29241e;padding:15px;display:flex;flex-direction:column;overflow:hidden}.awa-credential__head{display:grid;grid-template-columns:1fr auto auto;gap:9px;align-items:center;color:var(--oe-muted);font:9px/1.2 ui-monospace,'SF Mono',Menlo,Consolas,monospace;letter-spacing:.1em;text-transform:uppercase}.awa-credential__head b{color:var(--oe-hot);font-weight:500;letter-spacing:1px}.awa-credential__head i{font-style:normal;color:#686157}.awa-glyph{width:36%;min-width:102px;max-width:130px;height:auto;margin:6px 0 0}.awa-glyph .line,.awa-missing-card svg .line{fill:none;stroke-width:4}.awa-glyph .fine,.awa-missing-card svg .fine{fill:none;stroke-width:2}.awa-glyph .ivory{stroke:var(--oe-paper)}.awa-glyph .orange{stroke:var(--oe-hot)}.awa-glyph .muted{stroke:#6d665c}.awa-glyph .dash,.awa-missing-card svg .dash{stroke-dasharray:6 6}.awa-glyph .fill-hot{fill:var(--oe-hot)}.awa-glyph .fill-ink{fill:var(--oe-paper)}.awa-glyph .fill-bg{fill:var(--oe-bg)}.awa-credential h3{margin:auto 0 0!important;font-size:clamp(22px,2.5vw,34px)!important;line-height:.9!important;letter-spacing:-.025em!important;text-transform:uppercase}.awa-credential h3 span{display:block}.awa-credential>div>p{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;margin:10px 0 0;color:var(--oe-muted);font-size:11px;line-height:1.45}.awa-credential__proof{display:grid;gap:4px;margin-top:12px;padding-top:10px;border-top:1px solid var(--oe-line);font-size:10px;line-height:1.45}.awa-credential__proof b{color:var(--oe-hot);font:9px ui-monospace,'SF Mono',Menlo,Consolas,monospace;letter-spacing:.08em;text-transform:uppercase}.awa-credential__proof span{color:#bdb4a8}.awa-credential__forming{position:absolute;right:12px;top:42px;color:var(--oe-hot);font:8px ui-monospace,'SF Mono',Menlo,Consolas,monospace;letter-spacing:.08em;text-transform:uppercase}.awa-domain-stamps{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.awa-domain-stamps>span:not(.awa-domain-stamps__label){border:1px solid var(--oe-line);border-radius:999px;padding:6px 9px;color:var(--oe-muted);font-size:10px}.awa-domain-stamps b{color:var(--oe-hot);font-weight:500}.awa-domain-stamps__label{width:100%;margin-bottom:2px}.awa-oe__legend{display:flex;flex-wrap:wrap;gap:10px 20px;margin-top:28px;color:var(--oe-muted);font:10px/1.5 ui-monospace,'SF Mono',Menlo,Consolas,monospace}.awa-oe__legend b{color:var(--oe-hot)}.awa-oe__role{margin-top:28px!important;padding:20px 22px;border-left:3px solid var(--oe-hot);background:#14120f;color:#d5cdc1;font-size:14px;line-height:1.7}.awa-missing{margin-top:58px;padding-top:32px;border-top:1px solid var(--oe-line)}.awa-missing__head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:28px;align-items:end}.awa-missing__head h3{margin:8px 0 0!important;font-size:clamp(28px,4vw,48px)!important;line-height:.95!important}.awa-missing__head p{max-width:700px;margin:12px 0 0;color:var(--oe-muted);font-size:12px;line-height:1.55}.awa-missing__head>b{color:var(--oe-muted);font:10px ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-weight:400;letter-spacing:.08em;text-transform:uppercase}.awa-missing__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:22px}.awa-missing-card{display:grid;grid-template-columns:92px minmax(0,1fr);gap:14px;padding:16px;border:1px solid #28241e;background:#11100e;color:#8d857a;filter:saturate(.15)}.awa-missing-card svg{width:92px;height:auto;opacity:.45}.awa-missing-card svg .ivory,.awa-missing-card svg .orange,.awa-missing-card svg .muted{stroke:#706a61}.awa-missing-card svg .fill-hot,.awa-missing-card svg .fill-ink{fill:#706a61}.awa-missing-card svg .fill-bg{fill:#11100e}.awa-missing-card>div>span{font:8px ui-monospace,'SF Mono',Menlo,Consolas,monospace;letter-spacing:.08em;text-transform:uppercase}.awa-missing-card h4{margin:5px 0 8px!important;color:#b4aca0;font-size:20px!important;line-height:1!important;text-transform:uppercase}.awa-missing-card p{margin:0;font-size:11px;line-height:1.45}.awa-missing-card dl{display:grid;grid-template-columns:58px 1fr;gap:5px 8px;margin:12px 0 0;padding-top:10px;border-top:1px solid #24211c;font-size:10px;line-height:1.4}.awa-missing-card dt{color:#a59d91;font:8px ui-monospace,'SF Mono',Menlo,Consolas,monospace;letter-spacing:.06em;text-transform:uppercase}.awa-missing-card dd{margin:0}.awa-share{margin-top:64px;padding-top:34px;border-top:1px solid var(--oe-line)}.awa-share__head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:28px;align-items:end}.awa-share__head h3{margin:8px 0 0!important;font-size:clamp(28px,4vw,48px)!important;line-height:.95!important}.awa-share__head p{max-width:650px;margin:12px 0 0;color:var(--oe-muted);font-size:12px;line-height:1.55}.awa-share__actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.awa-share button{appearance:none;border:1px solid var(--oe-hot);background:var(--oe-hot);color:#0d0c0a;padding:11px 14px;font:10px ui-monospace,'SF Mono',Menlo,Consolas,monospace;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}.awa-share button+button{background:transparent;color:var(--oe-paper);border-color:var(--oe-line)}.awa-share button:focus-visible{outline:2px solid var(--oe-paper);outline-offset:3px}.awa-share__frame{margin-top:22px;padding:10px;border:1px solid var(--oe-line);background:#080706;box-shadow:0 26px 70px rgba(0,0,0,.35)}.awa-share-card{display:block;width:100%;height:auto}.awa-share__note{margin:9px 0 0;color:var(--oe-muted);font:9px ui-monospace,'SF Mono',Menlo,Consolas,monospace;letter-spacing:.08em;text-transform:uppercase}
@media(max-width:900px){.awa-oe__grid{grid-template-columns:repeat(2,minmax(0,1fr))}.awa-missing__grid{grid-template-columns:1fr}}
@media(max-width:640px){.awa-oe__top,.awa-share__head,.awa-missing__head{grid-template-columns:1fr;align-items:start}.awa-oe__top>a{width:max-content}.awa-oe__grid{grid-template-columns:1fr}.awa-credential{min-height:360px}.awa-missing-card{grid-template-columns:64px minmax(0,1fr)}.awa-missing-card svg{width:64px}.awa-share__actions{justify-content:flex-start}.awa-share button{flex:1}.awa-share__frame{margin-left:-10px;margin-right:-10px;padding:4px}.awa-oe__legend span:last-child{width:100%}}
@media print{.awa-oe{background:#fff;color:#111}.awa-credential,.awa-oe__role,.awa-share__frame{background:#fff;box-shadow:none}.awa-share__actions{display:none}}
</style>`;
