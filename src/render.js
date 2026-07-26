// Vendored from the Overflow site: functions/api/_profile_document.js
// GENERATED FILE — do not edit by hand. Fix it upstream, then run:
//   node scripts/sync-from-overflow.mjs
// De-branding transforms and integrity hashes live in SYNC-MANIFEST.json.

import { config } from "./config.js";

export function renderProfileDocument(profile = {}) {
  const safeProfile = profile && typeof profile === "object" && !Array.isArray(profile) ? profile : {};
  const name = text(safeProfile.name) || "Unnamed practitioner";
  const focus = text(safeProfile.focus || safeProfile.headline) || "Project-fit profile";
  const generated = text(safeProfile.generated_at);
  const role = text(safeProfile.project_role?.best_fit);
  const intro = text(safeProfile.community_profile?.introduction || safeProfile.community_introduction);
  const serialized = JSON.stringify(safeProfile, null, 2).replace(/</g, "\\u003c");
  const allStyles = styles();
  const documentStyles = safeProfile.collection_summary?.mode === "multi"
    ? allStyles
    : allStyles.replace(/\.provenance\{[^}]+\}/, "");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>${escapeHtml(name)} — ${escapeHtml(config.siteName)} profile</title>
<style>${documentStyles}</style>
</head>
<body>
<header class="site-head">
  ${brandMark()}
  <div>${generated ? `Generated ${escapeHtml(generated)}` : "Submitted profile"}</div>
</header>
<main>
  <section class="hero">
    <p class="eyebrow">Project-fit profile</p>
    <h1>${escapeHtml(name)}</h1>
    <p class="focus">${escapeHtml(focus)}</p>
    ${intro ? `<p class="intro">${escapeHtml(intro)}</p>` : ""}
    <p class="attestation">Structured profile submitted by its owner. The payload is validated and normalized; claims derived from local source history are not independently verified.</p>
  </section>
  ${workProfile(role, safeProfile)}
  ${cohortGate()}
  ${deliveryEvidence(safeProfile)}
  ${activityCoverage(safeProfile)}
  ${interactionProfile(safeProfile)}
  ${workingStyle(safeProfile)}
  ${agentToolkit(safeProfile)}
  ${subjectMatter(safeProfile)}
  ${projectFit(safeProfile)}
  ${sourcesAndLimits(safeProfile)}
</main>
${footer()}
<script type="application/json" id="profile-data">
${serialized}
</script>
</body>
</html>`;
}

export function addScriptNonce(html, nonce) {
  const safeNonce = String(nonce || "").replace(/[^A-Za-z0-9_-]/g, "");
  if (!safeNonce) return String(html || "");
  return String(html || "").replace(/<script\b(?![^>]*\bnonce=)/gi, `<script nonce="${safeNonce}"`);
}

export function profileDocumentHeaders({ nonce, published = false } = {}) {
  return {
    "content-type": "text/html; charset=utf-8",
    "cache-control": published ? "public, max-age=300" : "no-store",
    "content-security-policy": [
      "default-src 'none'",
      `script-src 'nonce-${String(nonce || "")}'`,
      "style-src 'unsafe-inline'",
      "img-src data:",
      "font-src data:",
      "connect-src 'none'",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'none'",
      "frame-ancestors 'self'",
    ].join("; "),
    "referrer-policy": "no-referrer",
    "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "x-content-type-options": "nosniff",
  };
}

function workProfile(role, profile) {
  const comparisons = array(profile.comparisons).slice(0, 4);
  return section("01 / Work profile", "Where the evidence points.", `
    ${role ? `<p class="section-lead">${escapeHtml(role)}</p>` : ""}
    ${comparisons.length ? `<div class="rows">${comparisons.map((item) => row(item?.role, item?.summary)).join("")}</div>` : empty("No adjacent-role comparison was submitted.")}
  `, 'id="work-profile"');
}

function deliveryEvidence(profile) {
  const arcs = array(profile.work_arcs).slice(0, 5);
  if (!arcs.length) return "";
  return section("02 / Delivery evidence", "Observed work arcs.", `<div class="rows">${arcs.map((arc) => {
    const meta = [arc?.delivery_state, arc?.system_context, arc?.primary_surface, arc?.responsibility].map(label).filter(Boolean).join(" · ");
    const evidence = array(arc?.evidence).slice(0, 3).map(text).filter(Boolean).join(" ");
    return row(arc?.label, evidence, meta);
  }).join("")}</div>`, 'id="delivery-evidence"');
}

function activityCoverage(profile) {
  const activity = profile.activity_analysis;
  if (!activity || typeof activity !== "object" || Array.isArray(activity)) return "";
  const coverage = activity.coverage || {};
  const concurrency = activity.concurrency || {};
  const facts = [
    fact("Interactive sessions", coverage.interactive_sessions),
    fact("Scheduled runs", coverage.scheduled_runs),
    fact("Active days", coverage.active_days),
    fact("Peak concurrent", concurrency.peak_concurrent_sessions),
  ].filter(Boolean).join("");
  const summary = text(activity.evolution_summary || activity.comparability_note);
  const environments = finite(profile.collection_summary?.environment_count);
  const provenance = profile.collection_summary?.mode === "multi" && environments > 1
    ? `<p class="attestation">Combined from ${environments} environments</p>`
    : "";
  return section("03 / Activity coverage", "What the retained history can show.", `${provenance}${facts ? `<div class="facts">${facts}</div>` : ""}${summary ? `<p class="section-lead">${escapeHtml(summary)}</p>` : ""}`);
}

function interactionProfile(profile) {
  const interaction = profile.interaction_profile;
  const dimensions = array(interaction?.dimensions).slice(0, 5);
  if (!dimensions.length) return "";
  return section("04 / Interaction profile", text(interaction?.summary) || "Observable collaboration patterns.", `<div class="rows">${dimensions.map((item) => row(item?.label, item?.pattern, stars(item?.proof_stars))).join("")}</div>`);
}

function workingStyle(profile) {
  const style = profile.working_style;
  const entries = style && typeof style === "object" && !Array.isArray(style) ? Object.entries(style).slice(0, 6) : [];
  const tools = array(profile.tools).slice(0, 8);
  const skills = array(profile.skills).slice(0, 12);
  if (!entries.length && !tools.length && !skills.length) return "";
  const styleRows = entries.map(([key, item]) => row(label(key), item?.finding, item?.evidence)).join("");
  return section("05 / How you work", "Build, review, operate, and maintain.", `
    ${styleRows ? `<div class="rows">${styleRows}</div>` : ""}
    ${tools.length ? chipGroup("Favored tools", tools.map((item) => item?.label || item?.tag)) : ""}
    ${skills.length ? chipGroup("Frameworks and practices", skills.map((item) => item?.label || item?.tag)) : ""}
  `);
}

function agentToolkit(profile) {
  const practice = profile.agent_practice;
  if (!practice || typeof practice !== "object" || Array.isArray(practice)) return "";
  const categories = array(practice.tool_categories).slice(0, 10);
  const assets = array(practice.reusable_assets).slice(0, 10);
  const permission = practice.permission_practice || {};
  if (!categories.length && !assets.length && !text(permission.finding)) return "";
  return section("06 / Agent toolkit", "The reusable operating layer.", `
    ${categories.length ? `<div class="rows">${categories.map((item) => row(item?.label || item?.tag, item?.evidence, item?.intensity)).join("")}</div>` : ""}
    ${assets.length ? chipGroup("Reusable assets", assets.map((item) => item?.label || item?.tag)) : ""}
    ${text(permission.finding) ? `<p class="section-lead">${escapeHtml(text(permission.finding))}</p>` : ""}
  `);
}

function subjectMatter(profile) {
  const domains = array(profile.domains).slice(0, 8);
  const transfer = text(profile.subject_matter?.transfer_pattern);
  if (!domains.length && !transfer) return "";
  return section("07 / Subject matter", "Where operating context repeats.", `
    ${transfer ? `<p class="section-lead">${escapeHtml(transfer)}</p>` : ""}
    ${domains.length ? `<div class="rows">${domains.map((domain) => {
      const detail = [text(domain?.evidence), array(domain?.problem_types).slice(0, 3).map(text).filter(Boolean).join(" · ")].filter(Boolean).join(" ");
      return row(domain?.label || domain?.tag, detail, domain?.depth);
    }).join("")}</div>` : ""}
  `);
}

function projectFit(profile) {
  const match = profile.project_match || {};
  const groups = [
    ["Good fit", match.good_fit],
    ["Bring a specialist", match.bring_specialist],
    ["Outside current evidence", match.not_established],
  ].filter(([, values]) => array(values).length);
  const strengtheners = array(profile.profile_strengtheners).slice(0, 3);
  if (!groups.length && !strengtheners.length) return "";
  return section("08 / Project fit", "Staff against evidence, not labels.", `
    <div class="fit-grid">${groups.map(([title, values]) => `<div><h3>${escapeHtml(title)}</h3><ul>${array(values).slice(0, 8).map((value) => `<li>${escapeHtml(text(value))}</li>`).join("")}</ul></div>`).join("")}</div>
    ${strengtheners.length ? `<details><summary>Evidence that would improve this profile</summary><div class="rows">${strengtheners.map((item) => row(item?.claim, item?.evidence_needed, item?.why_it_matters)).join("")}</div></details>` : ""}
  `);
}

function sourcesAndLimits(profile) {
  const windows = flattenWindows(profile.windows).slice(0, 8);
  const limits = array(profile.limits).slice(0, 8).map(text).filter(Boolean);
  const collection = profile.collection_summary;
  const environmentRows = collection?.mode === "multi"
    ? array(collection.environment_coverage).slice(0, 12).map((environment, index) => {
      const sources = array(environment?.sources).map(label).filter(Boolean).join(", ");
      const range = `${text(environment?.from) || "?"} → ${text(environment?.to) || "?"}`;
      return row(`Environment ${index + 1}`, range, `${sources || "Local history"} · ${finite(environment?.unique_sessions)} unique sessions`);
    }).join("")
    : "";
  const assembly = collection?.mode === "multi"
    ? `<details><summary>How this profile was assembled</summary>
      <p class="muted">The profile owner assembled local evidence bundles. Overflow validates the submitted profile but does not verify the machines or their origin. Exact duplicate sessions found in more than one bundle were counted once.</p>
      ${environmentRows ? `<div class="rows">${environmentRows}</div>` : ""}
    </details>`
    : "";
  return section("09 / Sources and limits", "What this submission contains.", `
    ${windows.length ? `<div class="rows">${windows.map((window) => row(window.tool, `${window.from || "?"} → ${window.to || "?"}`, `${window.sessions ?? 0} sessions`)).join("")}</div>` : ""}${assembly ? `\n    ${assembly}` : ""}
    ${limits.length ? `<details><summary>Known limits</summary><ul>${limits.map((limit) => `<li>${escapeHtml(limit)}</li>`).join("")}</ul></details>` : ""}
  `);
}

function section(index, title, body, attrs = "") {
  return `<section class="section" ${attrs}><div class="section-head"><span>${escapeHtml(index)}</span><h2>${escapeHtml(title)}</h2></div>${body}</section>`;
}

function row(title, body, meta = "") {
  const safeTitle = text(title);
  const safeBody = text(body);
  const safeMeta = text(meta);
  if (!safeTitle && !safeBody) return "";
  return `<article class="row"><div><h3>${escapeHtml(safeTitle || "Evidence")}</h3>${safeMeta ? `<span>${escapeHtml(label(safeMeta))}</span>` : ""}</div>${safeBody ? `<p>${escapeHtml(safeBody)}</p>` : ""}</article>`;
}

function chipGroup(title, values) {
  const items = values.map(text).filter(Boolean);
  return items.length ? `<div class="chip-group"><h3>${escapeHtml(title)}</h3><div>${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div></div>` : "";
}

function fact(title, value) {
  if (value == null || value === "" || !Number.isFinite(Number(value))) return "";
  return `<div><strong>${escapeHtml(String(value))}</strong><span>${escapeHtml(title)}</span></div>`;
}

function empty(message) {
  return `<p class="muted">${escapeHtml(message)}</p>`;
}

function flattenWindows(windows) {
  if (!windows || typeof windows !== "object" || Array.isArray(windows)) return [];
  const result = [];
  for (const [key, value] of Object.entries(windows)) {
    for (const item of (Array.isArray(value) ? value : [value])) {
      if (!item || typeof item !== "object") continue;
      result.push({ tool: text(item.tool || key), from: text(item.from), to: text(item.to), sessions: finite(item.sessions) });
    }
  }
  return result;
}

function stars(value) {
  const count = Math.min(3, Math.max(0, Math.trunc(Number(value) || 0)));
  return count ? "★".repeat(count) : "";
}

function finite(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.trunc(number)) : 0;
}

function label(value) {
  return text(value).replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

const styles = () => `
:root{--bg:#0e0d0b;--surface:#161411;--paper:#f2eee6;--muted:#a89f90;--line:#2a2620;--hot:${config.accentColor};color-scheme:dark}
*{box-sizing:border-box}html{background:var(--bg);color:var(--paper);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}body{margin:0}a{color:inherit}.site-head,main,footer{width:min(1080px,calc(100% - 40px));margin:auto}.site-head{min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:24px;border-bottom:1px solid var(--line);font:11px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}.brand{text-decoration:none;color:var(--paper)}.brand span{display:inline-grid;place-items:center;width:24px;height:24px;border:1px solid var(--hot);color:var(--hot);margin-right:9px}.hero{padding:clamp(64px,10vw,130px) 0 72px;border-bottom:1px solid var(--line)}.eyebrow,.section-head span{font:10px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.13em;text-transform:uppercase;color:var(--hot)}h1{margin:14px 0 0;font-size:clamp(54px,10vw,126px);line-height:.82;letter-spacing:-.065em;max-width:960px}.focus{max-width:760px;margin:30px 0 0;font-size:clamp(22px,3.4vw,42px);line-height:1.06;color:#d8d1c5}.intro,.section-lead{max-width:760px;font-size:17px;line-height:1.65}.provenance{display:inline-flex;margin:0 0 18px;padding:7px 10px;border:1px solid var(--hot);color:var(--hot);font:10px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase}.attestation{max-width:780px;margin:34px 0 0;padding:14px 16px;border-left:2px solid var(--hot);background:var(--surface);color:var(--muted);font:11px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace}.section{padding:70px 0;border-bottom:1px solid var(--line)}.section-head{display:grid;grid-template-columns:180px minmax(0,1fr);gap:20px;margin-bottom:36px}.section-head h2{margin:0;font-size:clamp(32px,5vw,64px);line-height:.95;letter-spacing:-.045em}.rows{border-top:1px solid var(--line)}.row{display:grid;grid-template-columns:minmax(180px,.7fr) minmax(0,1.3fr);gap:30px;padding:20px 0;border-bottom:1px solid var(--line)}.row h3,.chip-group h3,.fit-grid h3{margin:0;font-size:15px}.row span{display:block;margin-top:6px;color:var(--hot);font:9px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase}.row p{margin:0;color:#c4bcb0;line-height:1.65}.facts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin-bottom:28px}.facts div{background:var(--surface);padding:20px}.facts strong,.facts span{display:block}.facts strong{font-size:34px;color:var(--hot)}.facts span{margin-top:6px;color:var(--muted);font-size:11px}.chip-group{display:grid;grid-template-columns:180px 1fr;gap:20px;margin-top:28px}.chip-group>div{display:flex;flex-wrap:wrap;gap:8px}.chip-group span{border:1px solid var(--line);padding:7px 10px;color:#c4bcb0;font-size:12px}.fit-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}.fit-grid>div{background:var(--surface);padding:22px}.fit-grid h3{color:var(--hot)}ul{padding-left:18px;color:#c4bcb0;line-height:1.6}details{margin-top:24px;border:1px solid var(--line);padding:18px}summary{cursor:pointer;color:var(--hot);font:11px ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase;letter-spacing:.08em}.muted{color:var(--muted)}footer{min-height:110px;display:flex;align-items:center;justify-content:space-between;gap:20px;color:var(--muted);font:10px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.1em;text-transform:uppercase}footer b{color:var(--hot)}footer a{text-decoration:none;border-bottom:1px solid var(--line)}
@media(max-width:700px){.site-head{align-items:flex-start;padding:20px 0}.site-head,.section-head,.row,.chip-group{grid-template-columns:1fr}.site-head{display:grid}.section{padding:52px 0}.section-head{gap:10px}.facts,.fit-grid{grid-template-columns:1fr}.row{gap:10px}.site-head,main,footer{width:min(100% - 28px,1080px)}h1{font-size:clamp(48px,17vw,82px)}}
@media print{:root{--bg:#fff;--surface:#fff;--paper:#111;--muted:#555;--line:#ccc;--hot:#b33500}.attestation,.facts div,.fit-grid>div{background:#fff}.section{break-inside:avoid}}
`;

// Rendered only when a deployment actually adds an aggregate, unnamed cohort
// comparison after submission. A purely local run never mentions a cohort.
function cohortGate() {
  if (!config.cohortComparison) return "";
  return `<!-- assessment-cohort-gate:start -->
<section class="section" id="cohort-gate" data-assessment-cohort-gate>
  <div class="section-head"><span>After submission</span><h2>Aggregate cohort comparison is loading.</h2></div>
</section>
<!-- assessment-cohort-gate:end -->`;
}

function brandMark() {
  const name = escapeHtml(config.siteName);
  const initial = escapeHtml(config.siteName.trim().charAt(0).toUpperCase() || "A");
  const mark = `<span>${initial}</span> ${name}`;
  return config.siteUrl
    ? `<a class="brand" href="${escapeHtml(config.siteUrl)}">${mark}</a>`
    : `<span class="brand">${mark}</span>`;
}

function footer() {
  const links = (Array.isArray(config.footerLinks) ? config.footerLinks : [])
    .filter((link) => link && link.href && link.label)
    .map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`)
    .join("");
  return `<footer><span>${escapeHtml(config.siteName.toUpperCase())}</span>${links}</footer>`;
}
