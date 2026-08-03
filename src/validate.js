// Vendored from the Overflow site: functions/api/_assessment_validate.js
// GENERATED FILE — do not edit by hand. Fix it upstream, then run:
//   node scripts/sync-from-overflow.mjs
// De-branding transforms and integrity hashes live in SYNC-MANIFEST.json.

// Pure validation and normalization for uploaded assessment profiles. No env,
// storage, email, or request access lives here — only the rules that decide
// whether a submitted profile is acceptable and what its normalized shape is.
// Inlined from upstream functions/api/_db.js so this module has no imports.
function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

export const MAX_BYTES = 2 * 1024 * 1024;

// Belt-and-suspenders: the assessment prompt scrubs secrets, but reject
// anything that still looks like a live credential before it enters the pool.
const SECRET_PATTERNS = [
  { re: /sk-[A-Za-z0-9_-]{20,}/, label: "an API key (sk-…)" },
  { re: /AKIA[0-9A-Z]{16}/, label: "an AWS access key" },
  { re: /gh[pousr]_[A-Za-z0-9]{30,}/, label: "a GitHub token" },
  { re: /xox[baprs]-[A-Za-z0-9-]{10,}/, label: "a Slack token" },
  { re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/, label: "a private key" },
  { re: /eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}/, label: "a JWT token" },
];
const LOCAL_EVIDENCE_PATTERNS = [
  { re: /\/Users\/[^/\s"']+/i, label: "a local macOS user path" },
  { re: /\/home\/[^/\s"']+/i, label: "a local Linux user path" },
  { re: /[A-Za-z]:\\Users\\[^\\\s"']+/i, label: "a local Windows user path" },
  { re: /"(?:environment_id|environment_label|bundle_path|native_session_digest|fallback_fingerprint|project_fingerprint|session_evidence|environment_ids)"\s*:/i, label: "bundle-only evidence" },
];
const BUNDLE_ONLY_KEYS = [
  "bundle_schema_version",
  "collector_prompt_version",
  "consolidated_at",
  "bundle_count",
  "environments",
  "session_evidence",
  "collection_limits",
  "privacy_scan",
  "environment",
  "environment_id",
  "environment_label",
  "bundle_path",
  "native_session_digest",
  "fallback_fingerprint",
  "project_fingerprint",
];
const SIGNAL_KEYS = [
  "verification_discipline",
  "judgment_rigor",
  "communication_precision",
  "orchestration_leverage",
  "autonomy_scope",
];
const GENERATED_BY_AGENTS = new Set(["claude-code", "codex", "other"]);
const WORK_SURFACES = ["product-operations", "experience-interface", "application-software", "data-models", "workflow-integration", "platform-infrastructure"];
const AGENT_SOURCES = ["codex", "claude", "cowork", "other"];
const TOOL_CATEGORIES = ["shell", "filesystem", "code-edit", "browser-computer-use", "search-research", "version-control", "deploy-infra", "data-database", "mcp-connectors", "subagents"];
const INTERACTION_DIMENSIONS = ["task-framing", "context-strategy", "direction-exploration", "correction-recovery", "feedback-confirmation"];
const PROFILE_EVIDENCE_SOURCES = ["sessions", "github", "linkedin", "assessment"];
const PROFILE_INDUSTRY_DEPTHS = ["deep-current", "deep-sustained", "working-current", "career-depth", "observed-exposure", "career-exposure"];
const PROFILE_MIX_SOURCES = ["claude", "codex"];
const PROFILE_V9_TOP_LEVEL_KEYS = new Set([
  "schema_version", "prompt_version", "name", "focus", "headline", "generated_at", "generated_by",
  "collection_summary", "source_coverage", "windows", "cadence", "activity_analysis", "github", "work_arcs",
  "skills", "agent_practice", "domain_stamps", "project_role", "working_style", "interaction_profile",
  "project_match", "limits", "profile_view", "evidence_index", "matching_index",
]);
const PROFILE_STATISTIC_SOURCE_PREFIXES = [
  "/activity_analysis/coverage/",
  "/activity_analysis/concurrency/",
  "/activity_analysis/context_pressure/",
  "/agent_practice/tool_call_coverage/",
  "/agent_practice/tool_categories/",
  "/agent_practice/reusable_assets/",
  "/cadence/",
];
const PROFILE_EVIDENCE_ID_RE = /^ev-[0-9]{3,12}$/;
const PRIVATE_REFERENCE_PATTERNS = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b(?:https?|ftp|git):\/\/[^\s"']+/i,
  /\bgit@[a-z0-9.-]+:[^\s"']+/i,
  /\b(?:www\.)?(?:linkedin|github)\.com\/[^\s"']+/i,
  /\b(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?\/[^\s"']+/i,
  /(?:\/Users\/[^\s"']+|\/home\/[^\s"']+|[A-Za-z]:\\\\Users\\\\[^\s"']+)/i,
];
const RAW_PRIVATE_KEYS = new Set([
  "raw_prompt", "raw_transcript", "transcript", "messages", "private_url", "profile_url", "authenticated_login",
]);
const LEGACY_BADGE_TAGS = {
  delivery: ["prototype-builder", "production-shipper", "production-owner", "systems-steward", "scale-builder"],
  context: ["zero-to-one", "established-codebase", "mature-systems", "enterprise-sdlc", "solo-stack-owner", "team-contributor", "technical-reviewer"],
  craft: ["frontend-crafter", "product-engineer", "systems-architect", "automation-builder", "integration-engineer", "data-practitioner", "ml-practitioner", "platform-engineer"],
  ai_practice: ["agent-orchestrator", "context-engineer", "verification-first", "toolsmith", "frontier-explorer", "model-strategist", "recovery-operator"],
};
const BADGE_TAGS = {
  technical_chops: ["prototyper", "frontend-crafter", "production-shipper", "systems-architect", "context-engineer", "agent-orchestrator"],
  business_know_how: ["workflow-architect", "value-translator", "clear-communicator", "adoption-operator"],
  good_judgment: ["verification-first", "tradeoff-navigator", "recovery-operator", "systems-steward"],
};

export class ProfileError extends Error {
  constructor(error, status = 400, code = "PROFILE_INVALID") {
    super(error);
    this.error = error;
    this.status = status;
    this.code = code;
  }
}

export function assertNoSecrets(serializedPayload) {
  for (const { re, label } of SECRET_PATTERNS) {
    if (re.test(serializedPayload)) {
      throw new ProfileError(
        `Hold on — the file appears to contain ${label}. Remove it and re-upload. (Nothing was stored.)`,
        422,
        "PROFILE_SECRET_DETECTED",
      );
    }
  }
}

export function assertNoLocalEvidenceLeaks(serializedPayload) {
  for (const { re, label } of LOCAL_EVIDENCE_PATTERNS) {
    if (re.test(String(serializedPayload || ""))) {
      throw new ProfileError(
        `Hold on — the profile appears to contain ${label}. Remove it and re-upload. (Nothing was stored.)`,
        422,
        "PROFILE_LOCAL_EVIDENCE_DETECTED",
      );
    }
  }
}

export function parseProfileData(html) {
  const match = String(html || "").match(/<script type="application\/json" id="profile-data">([\s\S]*?)<\/script>/);
  if (!match) {
    throw new ProfileError("No profile data block found in the file.");
  }
  let profile;
  try {
    profile = JSON.parse(match[1]);
  } catch {
    throw new ProfileError("The embedded profile data is not valid JSON.");
  }
  if (!Array.isArray(profile.skills) || profile.skills.length === 0) {
    throw new ProfileError("The profile has no skills data — re-run the assessment.");
  }
  return profile;
}

export function validateRawProfileV9(profile) {
  if (!isObject(profile) || Number(profile.schema_version) < 9) return;
  if (profile.schema_version !== 9 || profile.prompt_version !== 8) {
    throw new ProfileError("Raw schema v9 profiles require numeric schema_version 9 and prompt_version 8.", 422, "PROFILE_V9_VERSION_INVALID");
  }
  assertAllowedKeys(profile, PROFILE_V9_TOP_LEVEL_KEYS, "profile");
  assertNoRawPrivateKeys(profile);
  assertNoPrivateReferences(profile);
  requireRawString(profile.name, "name");
  requireRawString(profile.focus, "focus");
  requireRawString(profile.headline, "headline");

  const view = requireRawObject(profile.profile_view, "profile_view");
  assertAllowedKeys(view, new Set(["hero", "agent_footprint", "agent_practice", "industries", "subject_matter", "matching", "limits"]), "profile_view");
  const hero = requireRawObject(view.hero, "profile_view.hero");
  assertAllowedKeys(hero, new Set(["thesis", "source_note", "evidence_ids"]), "profile_view.hero");
  requireRawString(hero.thesis, "profile_view.hero.thesis");
  requireRawString(hero.source_note, "profile_view.hero.source_note");
  requireRawEvidenceIds(hero.evidence_ids, "profile_view.hero.evidence_ids");

  const footprint = requireRawObject(view.agent_footprint, "profile_view.agent_footprint");
  assertAllowedKeys(footprint, new Set(["normalized_mix"]), "profile_view.agent_footprint");
  if (!(footprint.normalized_mix === null || isObject(footprint.normalized_mix))) {
    throw new ProfileError("normalized_mix must be a complete object or explicit null.", 422, "PROFILE_V9_RAW_TYPE_INVALID");
  }
  if (isObject(footprint.normalized_mix)) validateRawMix(footprint.normalized_mix);

  const practice = requireRawObject(view.agent_practice, "profile_view.agent_practice");
  assertAllowedKeys(practice, new Set(["role", "statistics", "workflow", "distinctive_fact", "reusable_system", "limitation"]), "profile_view.agent_practice");
  for (const key of ["role", "distinctive_fact", "reusable_system", "limitation"]) validateRawClaim(practice[key], `profile_view.agent_practice.${key}`);
  requireRawArray(practice.statistics, "profile_view.agent_practice.statistics").forEach((item, index) => {
    const path = `profile_view.agent_practice.statistics[${index}]`;
    const statistic = requireRawObject(item, path);
    assertAllowedKeys(statistic, new Set(["tag", "label", "value", "source_field", "evidence_ids"]), path);
    requireRawString(statistic.tag, `${path}.tag`);
    requireRawString(statistic.label, `${path}.label`);
    requireRawFiniteNumber(statistic.value, `${path}.value`);
    requireRawString(statistic.source_field, `${path}.source_field`);
    requireRawEvidenceIds(statistic.evidence_ids, `${path}.evidence_ids`);
  });
  validateAnchoredStatistics(profile, practice.statistics);
  requireRawArray(practice.workflow, "profile_view.agent_practice.workflow").forEach((item, index) => {
    const path = `profile_view.agent_practice.workflow[${index}]`;
    const step = requireRawObject(item, path);
    assertAllowedKeys(step, new Set(["label", "summary", "evidence_ids"]), path);
    requireRawString(step.label, `${path}.label`);
    requireRawString(step.summary, `${path}.summary`);
    requireRawEvidenceIds(step.evidence_ids, `${path}.evidence_ids`);
  });

  requireRawArray(view.industries, "profile_view.industries").forEach((item, index) => {
    const path = `profile_view.industries[${index}]`;
    const industry = requireRawObject(item, path);
    assertAllowedKeys(industry, new Set(["tag", "label", "context", "career_context", "observed_work", "depth", "sources", "evidence_ids"]), path);
    for (const key of ["tag", "label", "context", "career_context", "observed_work", "depth"]) requireRawString(industry[key], `${path}.${key}`, ["career_context", "observed_work"].includes(key));
    requireRawStringArray(industry.sources, `${path}.sources`);
    requireRawEvidenceIds(industry.evidence_ids, `${path}.evidence_ids`);
  });
  requireRawArray(view.subject_matter, "profile_view.subject_matter").forEach((item, index) => {
    const path = `profile_view.subject_matter[${index}]`;
    const subject = requireRawObject(item, path);
    assertAllowedKeys(subject, new Set(["tag", "label", "summary", "evidence_label", "evidence_ids"]), path);
    for (const key of ["tag", "label", "summary", "evidence_label"]) requireRawString(subject[key], `${path}.${key}`);
    requireRawEvidenceIds(subject.evidence_ids, `${path}.evidence_ids`);
  });
  const matching = requireRawObject(view.matching, "profile_view.matching");
  assertAllowedKeys(matching, new Set(["strongest_fit", "add_specialist", "not_shown"]), "profile_view.matching");
  for (const key of ["strongest_fit", "add_specialist", "not_shown"]) {
    const item = requireRawObject(matching[key], `profile_view.matching.${key}`);
    assertAllowedKeys(item, new Set(["label", "summary", "evidence_ids"]), `profile_view.matching.${key}`);
    requireRawString(item.label, `profile_view.matching.${key}.label`);
    requireRawString(item.summary, `profile_view.matching.${key}.summary`);
    requireRawEvidenceIds(item.evidence_ids, `profile_view.matching.${key}.evidence_ids`);
  }
  requireRawArray(view.limits, "profile_view.limits").forEach((item, index) => validateRawClaim(item, `profile_view.limits[${index}]`));

  requireRawArray(profile.evidence_index, "evidence_index").forEach((item, index) => {
    const path = `evidence_index[${index}]`;
    const evidence = requireRawObject(item, path);
    assertAllowedKeys(evidence, new Set(["id", "source", "kind", "summary", "from", "to", "arc_ids"]), path);
    requireRawEvidenceId(evidence.id, `${path}.id`);
    for (const key of ["source", "kind", "summary"]) requireRawString(evidence[key], `${path}.${key}`);
    if (evidence.from != null) requireRawString(evidence.from, `${path}.from`, true);
    if (evidence.to != null) requireRawString(evidence.to, `${path}.to`, true);
    if (evidence.arc_ids != null) requireRawStringArray(evidence.arc_ids, `${path}.arc_ids`, true);
  });

  const coverage = requireRawObject(profile.activity_analysis?.coverage, "activity_analysis.coverage");
  requireRawArray(coverage.source_windows, "activity_analysis.coverage.source_windows").forEach((item, index) => {
    const path = `activity_analysis.coverage.source_windows[${index}]`;
    const row = requireRawObject(item, path);
    assertAllowedKeys(row, new Set(["source", "from", "to", "sessions", "coverage_days", "retention", "limitations"]), path);
    requireRawString(row.source, `${path}.source`);
    if (!AGENT_SOURCES.includes(row.source)) throw new ProfileError(`${path}.source is invalid.`, 422, "PROFILE_V9_RAW_TYPE_INVALID");
    requireRawString(row.from, `${path}.from`);
    requireRawString(row.to, `${path}.to`);
    requireRawNonNegativeInt(row.sessions, `${path}.sessions`);
    if (row.coverage_days != null) requireRawNonNegativeInt(row.coverage_days, `${path}.coverage_days`);
    if (row.retention != null) requireRawString(row.retention, `${path}.retention`, true);
    if (row.limitations != null) requireRawStringArray(row.limitations, `${path}.limitations`, true);
  });
  requireRawArray(coverage.shared_window_sessions, "activity_analysis.coverage.shared_window_sessions").forEach((item, index) => {
    const path = `activity_analysis.coverage.shared_window_sessions[${index}]`;
    const row = requireRawObject(item, path);
    assertAllowedKeys(row, new Set(["source", "from", "to", "sessions"]), path);
    requireRawString(row.source, `${path}.source`);
    requireRawString(row.from, `${path}.from`);
    requireRawString(row.to, `${path}.to`);
    requireRawNonNegativeInt(row.sessions, `${path}.sessions`);
  });
}

function validateRawMix(mix) {
  const path = "profile_view.agent_footprint.normalized_mix";
  assertAllowedKeys(mix, new Set(["from", "to", "calendar_days", "total_sessions", "items", "limitations", "evidence_ids"]), path);
  requireRawString(mix.from, `${path}.from`);
  requireRawString(mix.to, `${path}.to`);
  requireRawNonNegativeInt(mix.calendar_days, `${path}.calendar_days`);
  requireRawNonNegativeInt(mix.total_sessions, `${path}.total_sessions`);
  requireRawStringArray(mix.limitations, `${path}.limitations`);
  requireRawEvidenceIds(mix.evidence_ids, `${path}.evidence_ids`);
  requireRawArray(mix.items, `${path}.items`).forEach((item, index) => {
    const itemPath = `${path}.items[${index}]`;
    const row = requireRawObject(item, itemPath);
    assertAllowedKeys(row, new Set(["source", "sessions", "share", "sessions_per_calendar_day"]), itemPath);
    requireRawString(row.source, `${itemPath}.source`);
    requireRawNonNegativeInt(row.sessions, `${itemPath}.sessions`);
    requireRawFiniteNumber(row.share, `${itemPath}.share`);
    requireRawFiniteNumber(row.sessions_per_calendar_day, `${itemPath}.sessions_per_calendar_day`);
  });
}

function validateRawClaim(value, path) {
  const claim = requireRawObject(value, path);
  assertAllowedKeys(claim, new Set(["summary", "evidence_ids"]), path);
  requireRawString(claim.summary, `${path}.summary`);
  requireRawEvidenceIds(claim.evidence_ids, `${path}.evidence_ids`);
}

function assertAllowedKeys(value, allowedKeys, path) {
  if (!isObject(value)) return;
  const unknown = Object.keys(value).find((key) => !allowedKeys.has(key));
  if (unknown) throw new ProfileError(`${path} contains unknown field "${unknown}".`, 422, "PROFILE_V9_UNKNOWN_FIELD");
}

function assertNoRawPrivateKeys(value, path = "profile") {
  if (Array.isArray(value)) return value.forEach((item, index) => assertNoRawPrivateKeys(item, `${path}[${index}]`));
  if (!isObject(value)) return;
  for (const [key, child] of Object.entries(value)) {
    if (RAW_PRIVATE_KEYS.has(key)) throw new ProfileError(`${path}.${key} is private raw data.`, 422, "PROFILE_V9_PRIVATE_DATA_DETECTED");
    assertNoRawPrivateKeys(child, `${path}.${key}`);
  }
}

function assertNoPrivateReferences(value) {
  const serialized = JSON.stringify(value);
  if (PRIVATE_REFERENCE_PATTERNS.some((pattern) => pattern.test(serialized))) {
    throw new ProfileError("Schema v9 raw data contains an email address, URL, repository path, or host path.", 422, "PROFILE_V9_PRIVATE_DATA_DETECTED");
  }
}

function requireRawObject(value, path) {
  if (!isObject(value)) throw new ProfileError(`${path} must be an object.`, 422, "PROFILE_V9_RAW_TYPE_INVALID");
  return value;
}

function requireRawArray(value, path) {
  if (!Array.isArray(value)) throw new ProfileError(`${path} must be an array.`, 422, "PROFILE_V9_RAW_TYPE_INVALID");
  return value;
}

function requireRawString(value, path, allowEmpty = false) {
  if (typeof value !== "string" || (!allowEmpty && !value.trim())) throw new ProfileError(`${path} must be ${allowEmpty ? "a string" : "a nonempty string"}.`, 422, "PROFILE_V9_RAW_TYPE_INVALID");
}

function requireRawStringArray(value, path, allowEmpty = false) {
  const items = requireRawArray(value, path);
  if ((!allowEmpty && !items.length) || items.some((item) => typeof item !== "string" || !item.trim())) {
    throw new ProfileError(`${path} must contain ${allowEmpty ? "only" : "one or more"} nonempty strings.`, 422, "PROFILE_V9_RAW_TYPE_INVALID");
  }
}

function requireRawFiniteNumber(value, path) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new ProfileError(`${path} must be a finite JSON number.`, 422, "PROFILE_V9_RAW_TYPE_INVALID");
}

function requireRawNonNegativeInt(value, path) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) throw new ProfileError(`${path} must be a nonnegative integer.`, 422, "PROFILE_V9_RAW_TYPE_INVALID");
}

function requireRawEvidenceId(value, path) {
  if (typeof value !== "string" || !PROFILE_EVIDENCE_ID_RE.test(value)) throw new ProfileError(`${path} has an invalid opaque evidence ID.`, 422, "PROFILE_V9_EVIDENCE_ID_INVALID");
}

function requireRawEvidenceIds(value, path) {
  const items = requireRawArray(value, path);
  if (!items.length) throw new ProfileError(`${path} must not be empty.`, 422, "PROFILE_V9_EVIDENCE_REQUIRED");
  items.forEach((item, index) => requireRawEvidenceId(item, `${path}[${index}]`));
}

export function sanitizeProfile(profile) {
  for (const key of BUNDLE_ONLY_KEYS) delete profile[key];
  profile.schema_version = nonNegativeInt(profile.schema_version);
  profile.prompt_version = nonNegativeInt(profile.prompt_version);
  profile.name = clean(profile.name, 200);
  profile.focus = clean(profile.focus || profile.headline, 300);
  profile.headline = clean(profile.headline || profile.focus, 300);
  profile.generated_at = clean(profile.generated_at, 30);

  if (usesProfileV9(profile)) {
    sanitizeSourceCoverage(profile);
    sanitizeWindows(profile);
    sanitizeGithub(profile);
    sanitizeWorkingStyle(profile);
  }

  if (isObject(profile.collection_summary) && profile.collection_summary.mode === "multi") {
    const summary = profile.collection_summary;
    profile.collection_summary = {
      mode: "multi",
      environment_count: Math.min(12, nonNegativeInt(summary.environment_count)),
      input_sessions: nonNegativeInt(summary.input_sessions),
      unique_sessions: nonNegativeInt(summary.unique_sessions),
      exact_duplicates_removed: nonNegativeInt(summary.exact_duplicates_removed),
      strategy_version: positiveInt(summary.strategy_version) || 1,
      environment_coverage: (Array.isArray(summary.environment_coverage) ? summary.environment_coverage : [])
        .map((item, index) => ({
          environment_index: index + 1,
          kind: allowed(item?.kind, ["computer", "vm", "cloud", "other"]) || "other",
          sources: cleanEnumStrings(item?.sources, AGENT_SOURCES, 4),
          from: clean(item?.from, 10),
          to: clean(item?.to, 10),
          unique_sessions: nonNegativeInt(item?.unique_sessions),
        }))
        .filter((item) => item.sources.length && item.from && item.to)
        .slice(0, 12),
    };
  } else if ("collection_summary" in profile) {
    delete profile.collection_summary;
  }

  profile.skills = (Array.isArray(profile.skills) ? profile.skills : [])
    .map((skill) => ({
      tag: clean(skill?.tag, 60),
      label: clean(skill?.label, 120),
      category: clean(skill?.category, 40),
      familiarity: allowed(skill?.familiarity, ["very-familiar", "familiar", "some"]),
      tier: skillTier(skill),
      authorship: allowed(skill?.authorship, ["direct", "directed-reviewed", "mixed", "unclear"]),
      sessions: nonNegativeInt(skill?.sessions),
      ...(usesProfileV9(profile) ? { sources: cleanEnumStrings(skill?.sources, PROFILE_EVIDENCE_SOURCES, 4) } : {}),
      first_observed: clean(skill?.first_observed, 30),
      last_observed: clean(skill?.last_observed, 30),
      evidence: clean(skill?.evidence, 500),
    }))
    .filter((skill) => skill.tag || skill.label)
    .slice(0, 200);

  sanitizeArray(profile, "tools", 40, (tool) => ({
    tag: clean(tool?.tag, 60),
    label: clean(tool?.label, 120),
    kind: allowed(tool?.kind, ["agent", "automation", "platform", "environment"]),
    familiarity: allowed(tool?.familiarity, ["primary", "frequent", "occasional"]),
    sessions: nonNegativeInt(tool?.sessions),
    evidence: clean(tool?.evidence, 500),
  }), (tool) => tool.tag || tool.label);

  if (isObject(profile.agent_practice)) {
    const practice = profile.agent_practice;
    const permission = isObject(practice.permission_practice) ? practice.permission_practice : {};
    profile.agent_practice = {
      tool_call_coverage: (Array.isArray(practice.tool_call_coverage) ? practice.tool_call_coverage : [])
        .map((item) => ({
          source: allowed(item?.source, AGENT_SOURCES),
          from: clean(item?.from, 30),
          to: clean(item?.to, 30),
          sessions_scanned: nonNegativeInt(item?.sessions_scanned),
          sessions_with_tool_metadata: nonNegativeInt(item?.sessions_with_tool_metadata),
          observed_calls: nonNegativeInt(item?.observed_calls),
          limitations: cleanStrings(item?.limitations, 8, 300),
        }))
        .filter((item) => item.source)
        .slice(0, 12),
      tool_categories: (Array.isArray(practice.tool_categories) ? practice.tool_categories : [])
        .map((item) => ({
          tag: allowed(item?.tag, TOOL_CATEGORIES),
          label: clean(item?.label, 120),
          intensity: allowed(item?.intensity, ["habitual", "recurring", "situational"]),
          active_sessions: nonNegativeInt(item?.active_sessions),
          observed_calls: nonNegativeInt(item?.observed_calls),
          sources: cleanEnumStrings(item?.sources, AGENT_SOURCES, 4),
          evidence: clean(item?.evidence, 500),
        }))
        .filter((item) => item.tag && item.label && item.intensity)
        .slice(0, 10),
      reusable_assets: (Array.isArray(practice.reusable_assets) ? practice.reusable_assets : [])
        .map((item) => ({
          tag: clean(item?.tag, 60),
          label: clean(item?.label, 120),
          kind: allowed(item?.kind, ["skill", "command", "mcp", "hook", "automation", "agent-template", "eval"]),
          relationship: allowed(item?.relationship, ["used", "adapted", "created"]),
          active_sessions: nonNegativeInt(item?.active_sessions),
          observed_uses: nonNegativeInt(item?.observed_uses),
          sources: cleanEnumStrings(item?.sources, AGENT_SOURCES, 4),
          evidence: clean(item?.evidence, 500),
        }))
        .filter((item) => (item.tag || item.label) && item.kind && item.relationship)
        .slice(0, 40),
      permission_practice: {
        coverage: (Array.isArray(permission.coverage) ? permission.coverage : [])
          .map((item) => ({
            source: allowed(item?.source, AGENT_SOURCES),
            sessions_scanned: nonNegativeInt(item?.sessions_scanned),
            sessions_with_metadata: nonNegativeInt(item?.sessions_with_metadata),
            limitations: cleanStrings(item?.limitations, 8, 300),
          }))
          .filter((item) => item.source)
          .slice(0, 12),
        modes: (Array.isArray(permission.modes) ? permission.modes : [])
          .map((item) => ({
            source: allowed(item?.source, AGENT_SOURCES),
            mode: clean(item?.mode, 60),
            scope: allowed(item?.scope, ["environment-inherited", "user-selected", "unclear"]),
            sessions: nonNegativeInt(item?.sessions),
            events: nonNegativeInt(item?.events),
          }))
          .filter((item) => item.source && item.mode && item.scope)
          .slice(0, 30),
        elevated_requests: (Array.isArray(permission.elevated_requests) ? permission.elevated_requests : [])
          .map((item) => ({
            source: allowed(item?.source, AGENT_SOURCES),
            category: allowed(item?.category, ["deployment", "network", "filesystem", "process", "account", "other"]),
            requests: nonNegativeInt(item?.requests),
            approved: nonNegativeInt(item?.approved),
            denied: nonNegativeInt(item?.denied),
            unknown_outcome: nonNegativeInt(item?.unknown_outcome),
          }))
          .filter((item) => item.source && item.category)
          .slice(0, 30),
        finding: clean(permission.finding, 700),
        guardrail_pattern: clean(permission.guardrail_pattern, 700),
        limitations: cleanStrings(permission.limitations, 12, 400),
      },
    };
  } else if ("agent_practice" in profile) {
    delete profile.agent_practice;
  }

  if (isObject(profile.activity_analysis)) {
    const activity = profile.activity_analysis;
    const coverage = isObject(activity.coverage) ? activity.coverage : {};
    const concurrency = isObject(activity.concurrency) ? activity.concurrency : {};
    const pressure = isObject(activity.context_pressure) ? activity.context_pressure : {};
    profile.activity_analysis = {
      coverage: {
        from: clean(coverage.from, 30),
        to: clean(coverage.to, 30),
        interactive_sessions: nonNegativeInt(coverage.interactive_sessions),
        scheduled_runs: nonNegativeInt(coverage.scheduled_runs),
        active_days: nonNegativeInt(coverage.active_days),
        sessions_with_model_metadata: nonNegativeInt(coverage.sessions_with_model_metadata),
        sessions_with_event_timestamps: nonNegativeInt(coverage.sessions_with_event_timestamps),
        comparability: allowed(coverage.comparability, ["comparable", "partial", "not-comparable"]),
        source_windows: (Array.isArray(coverage.source_windows) ? coverage.source_windows : [])
          .map((item) => ({
            source: allowed(item?.source, AGENT_SOURCES),
            from: clean(item?.from, 30),
            to: clean(item?.to, 30),
            sessions: nonNegativeInt(item?.sessions),
            coverage_days: nonNegativeInt(item?.coverage_days),
            retention: allowed(item?.retention, ["full-available", "retention-limited", "unknown"]),
            limitations: cleanStrings(item?.limitations, 8, 300),
          }))
          .filter((item) => item.source && item.from && item.to && item.retention)
          .slice(0, 12),
        shared_window_sessions: (Array.isArray(coverage.shared_window_sessions) ? coverage.shared_window_sessions : [])
          .map((item) => ({
            source: allowed(item?.source, PROFILE_MIX_SOURCES),
            from: clean(item?.from, 10),
            to: clean(item?.to, 10),
            sessions: nonNegativeInt(item?.sessions),
          }))
          .filter((item) => item.source && item.from && item.to)
          .slice(0, 2),
        limitations: cleanStrings(coverage.limitations, 12, 400),
      },
      monthly: (Array.isArray(activity.monthly) ? activity.monthly : [])
        .map((month) => ({
          month: clean(month?.month, 10),
          interactive_sessions: nonNegativeInt(month?.interactive_sessions),
          scheduled_runs: nonNegativeInt(month?.scheduled_runs),
          tool_categories: (Array.isArray(month?.tool_categories) ? month.tool_categories : [])
            .map((item) => ({ tag: allowed(item?.tag, TOOL_CATEGORIES), calls: nonNegativeInt(item?.calls) }))
            .filter((item) => item.tag)
            .slice(0, 10),
          models: (Array.isArray(month?.models) ? month.models : [])
            .map((item) => ({ name: clean(item?.name, 80), sessions: nonNegativeInt(item?.sessions) }))
            .filter((item) => item.name)
            .slice(0, 20),
        }))
        .filter((month) => /^\d{4}-\d{2}$/.test(month.month))
        .slice(0, 36),
      concurrency: {
        method: "15-minute event-activity buckets",
        median_interactive_sessions_per_active_day: optionalNonNegativeNumber(concurrency.median_interactive_sessions_per_active_day),
        average_concurrent_sessions: optionalNonNegativeNumber(concurrency.average_concurrent_sessions),
        p95_concurrent_sessions: optionalNonNegativeNumber(concurrency.p95_concurrent_sessions),
        peak_concurrent_sessions: nonNegativeInt(concurrency.peak_concurrent_sessions),
        multi_session_days: nonNegativeInt(concurrency.multi_session_days),
        covered_active_days: nonNegativeInt(concurrency.covered_active_days),
        scheduled_runs_excluded: nonNegativeInt(concurrency.scheduled_runs_excluded),
        limitations: cleanStrings(concurrency.limitations, 12, 400),
      },
      context_pressure: {
        token_limit_events: nonNegativeInt(pressure.token_limit_events),
        affected_sessions: nonNegativeInt(pressure.affected_sessions),
        compaction_events: nonNegativeInt(pressure.compaction_events),
        recovered_sessions: nonNegativeInt(pressure.recovered_sessions),
        repeated_failure_sessions: nonNegativeInt(pressure.repeated_failure_sessions),
        limitations: cleanStrings(pressure.limitations, 12, 400),
      },
      model_usage: (Array.isArray(activity.model_usage) ? activity.model_usage : [])
        .map((item) => ({
          source: allowed(item?.source, AGENT_SOURCES),
          model: clean(item?.model, 80),
          sessions: nonNegativeInt(item?.sessions),
          first_observed: clean(item?.first_observed, 30),
          last_observed: clean(item?.last_observed, 30),
          monthly: (Array.isArray(item?.monthly) ? item.monthly : [])
            .map((month) => ({ month: clean(month?.month, 10), sessions: nonNegativeInt(month?.sessions) }))
            .filter((month) => /^\d{4}-\d{2}$/.test(month.month))
            .slice(0, 36),
        }))
        .filter((item) => item.source && item.model)
        .slice(0, 30),
      trend_status: allowed(activity.trend_status, ["supported", "partial", "not-supported"]),
      comparability_note: clean(activity.comparability_note, 700),
      evolution_summary: clean(activity.evolution_summary, 900),
    };
  } else if ("activity_analysis" in profile) {
    delete profile.activity_analysis;
  }

  if (isObject(profile.interaction_profile)) {
    profile.interaction_profile = {
      summary: clean(profile.interaction_profile.summary, 700),
      dimensions: (Array.isArray(profile.interaction_profile.dimensions) ? profile.interaction_profile.dimensions : [])
        .map((item) => ({
          tag: allowed(item?.tag, INTERACTION_DIMENSIONS),
          label: clean(item?.label, 120),
          pattern: clean(item?.pattern, 700),
          proof_stars: proofStars(item?.proof_stars),
          evidence: clean(item?.evidence, 700),
          counterevidence: clean(item?.counterevidence, 500),
          sources: ["sessions"],
        }))
        .filter((item) => item.tag && item.label && item.pattern && item.evidence)
        .slice(0, 5),
      limitations: cleanStrings(profile.interaction_profile.limitations, 12, 400),
    };
  } else if ("interaction_profile" in profile) {
    delete profile.interaction_profile;
  }

  sanitizeArray(profile, "domains", 40, (domain) => ({
    tag: clean(domain?.tag, 60),
    label: clean(domain?.label, 120),
    depth: allowed(domain?.depth, ["substantial", "some"]),
    evidence_volume: allowed(domain?.evidence_volume, ["high", "medium", "low"]),
    session_count: optionalNonNegativeInt(domain?.session_count),
    first_observed: clean(domain?.first_observed, 30),
    last_observed: clean(domain?.last_observed, 30),
    problem_types: cleanStrings(domain?.problem_types, 12, 120),
    operating_objects: cleanStrings(domain?.operating_objects, 12, 120),
    constraints: cleanStrings(domain?.constraints, 12, 180),
    staffing_implication: clean(domain?.staffing_implication, 400),
    source: "sessions",
    evidence: clean(domain?.evidence, 500),
  }), (domain) => domain.tag || domain.label);

  sanitizeArray(profile, "work_arcs", 20, (arc) => ({
    id: clean(arc?.id, 60),
    label: clean(arc?.label, 160),
    from: clean(arc?.from, 30),
    to: clean(arc?.to, 30),
    sources: cleanStrings(arc?.sources, 5, 30),
    delivery_state: allowed(arc?.delivery_state, ["exploration", "working-prototype", "live-use", "ongoing-operation"]),
    system_context: allowed(arc?.system_context, ["greenfield", "early-system", "established-system", "mature-constrained", "unknown"]),
    primary_surface: allowed(arc?.primary_surface, WORK_SURFACES),
    secondary_surface: allowed(arc?.secondary_surface, ["", ...WORK_SURFACES]),
    change_type: allowed(arc?.change_type, ["new-capability", "integration", "experience-improvement", "architecture-refactor", "migration", "reliability-performance", "incident-recovery", "analysis-decision-support", "operational-automation"]),
    responsibility: allowed(arc?.responsibility, ["directed-task", "scoped-contributor", "workstream-owner", "system-owner"]),
    ...(usesProfileV9(profile) ? { authorship: allowed(arc?.authorship, ["direct", "directed-reviewed", "mixed", "unclear"]) } : {}),
    ...(usesProfileV9(profile) ? { verification_mode: allowed(arc?.verification_mode, ["independent", "self-check", "unclear"]) } : {}),
    reviewer_governor: arc?.reviewer_governor === true,
    confidence: allowed(arc?.confidence, ["high", "medium", "low"]),
    evidence: cleanStrings(arc?.evidence, 8, 500),
    counterevidence: cleanStrings(arc?.counterevidence, 8, 500),
  }), (arc) => arc.id && arc.label && arc.delivery_state && arc.system_context
    && arc.primary_surface && arc.change_type && arc.responsibility && arc.confidence);

  const workArcIds = new Set((profile.work_arcs || []).map((arc) => arc.id));
  if (isObject(profile.badges)) {
    const badgeTags = usesOperatorBadgeSchema(profile) ? BADGE_TAGS : LEGACY_BADGE_TAGS;
    const badges = {};
    for (const [family, tags] of Object.entries(badgeTags)) {
      badges[family] = (Array.isArray(profile.badges[family]) ? profile.badges[family] : [])
        .map((badge) => ({
          tag: allowed(badge?.tag, tags),
          label: clean(badge?.label, 120),
          proof_stars: badgeProofStars(badge),
          status: badgeStatus(badge),
          confidence: allowed(badge?.confidence, ["high", "medium", "low"]),
          arc_ids: cleanStrings(badge?.arc_ids, 20, 60).filter((id) => workArcIds.has(id)),
          evidence: clean(badge?.evidence, 500),
          proof_basis: isObject(badge?.proof_basis) ? {
            arc_count: nonNegativeInt(badge.proof_basis.arc_count),
            system_count: nonNegativeInt(badge.proof_basis.system_count),
            span_days: nonNegativeInt(badge.proof_basis.span_days),
            direct_outcome_count: nonNegativeInt(badge.proof_basis.direct_outcome_count),
            independent_observation_count: nonNegativeInt(badge.proof_basis.independent_observation_count),
          } : null,
          next_star_evidence: clean(badge?.next_star_evidence, 500),
        }))
        .filter((badge) => badge.tag && badge.label && badge.status && badge.confidence && badge.arc_ids.length && badge.evidence)
        .slice(0, 10);
    }
    profile.badges = badges;
  } else if ("badges" in profile) {
    delete profile.badges;
  }

  if (isObject(profile.badge_audit)) {
    profile.badge_audit = {
      candidate_count: nonNegativeInt(profile.badge_audit.candidate_count),
      awarded_count: nonNegativeInt(profile.badge_audit.awarded_count),
      not_awarded: (Array.isArray(profile.badge_audit.not_awarded) ? profile.badge_audit.not_awarded : [])
        .map((item) => ({
          tag: clean(item?.tag, 60),
          reason: clean(item?.reason, 400),
          missing_evidence: clean(item?.missing_evidence, 400),
        }))
        .filter((item) => item.tag && item.reason && item.missing_evidence)
        .slice(0, 14),
      evidence_reuse_notes: cleanStrings(profile.badge_audit.evidence_reuse_notes, 12, 400),
    };
  } else if ("badge_audit" in profile) {
    delete profile.badge_audit;
  }

  if (isObject(profile.domain_stamps)) {
    const cleanDomainStamps = (items) => (Array.isArray(items) ? items : [])
      .map((stamp) => ({
        tag: clean(stamp?.tag, 60),
        label: clean(stamp?.label, 120),
        depth: allowed(stamp?.depth, ["exposure", "repeated", "deep"]),
        proof_stars: proofStars(stamp?.proof_stars),
        arc_count: nonNegativeInt(stamp?.arc_count),
        arc_share: clampedShare(stamp?.arc_share),
        arc_ids: cleanStrings(stamp?.arc_ids, 20, 60).filter((id) => workArcIds.has(id)),
        evidence: clean(stamp?.evidence, 500),
      }))
      .filter((stamp) => (stamp.tag || stamp.label) && stamp.depth && stamp.evidence)
      .slice(0, 30);
    profile.domain_stamps = {
      classified_arc_count: nonNegativeInt(profile.domain_stamps.classified_arc_count),
      industries: cleanDomainStamps(profile.domain_stamps.industries),
      functions: cleanDomainStamps(profile.domain_stamps.functions),
    };
  } else if ("domain_stamps" in profile) {
    delete profile.domain_stamps;
  }

  if (isObject(profile.subject_matter)) {
    profile.subject_matter = {
      transfer_pattern: clean(profile.subject_matter.transfer_pattern, 700),
      career_context_exposure: Array.isArray(profile.subject_matter.career_context_exposure)
        ? profile.subject_matter.career_context_exposure.map((item) => ({
          label: clean(item?.label, 160),
          source: "linkedin",
          evidence: clean(item?.evidence, 400),
        })).filter((item) => item.label).slice(0, 20)
        : [],
    };
  } else if ("subject_matter" in profile) {
    delete profile.subject_matter;
  }

  sanitizeProfileView(profile);

  sanitizeArray(profile, "evidence_index", 120, (item) => ({
    id: clean(item?.id, 80),
    source: allowed(item?.source, PROFILE_EVIDENCE_SOURCES),
    kind: clean(item?.kind, 80),
    summary: clean(item?.summary, 700),
    from: clean(item?.from, 10),
    to: clean(item?.to, 10),
    arc_ids: cleanStrings(item?.arc_ids, 20, 60).filter((id) => workArcIds.has(id)),
  }), (item) => item.id && item.source && item.kind && item.summary);

  if (isObject(profile.matching_index)) {
    profile.matching_index = {
      industries: (Array.isArray(profile.matching_index.industries) ? profile.matching_index.industries : [])
        .map((item) => ({
          tag: clean(item?.tag, 60),
          label: clean(item?.label, 160),
          depth: allowed(item?.depth, ["deep", "working", "exposure", "career-context"]),
          sources: cleanEnumStrings(item?.sources, PROFILE_EVIDENCE_SOURCES, 4),
          evidence_ids: cleanStrings(item?.evidence_ids, 20, 80),
        }))
        .filter((item) => item.tag && item.label && item.depth && item.sources.length)
        .slice(0, 30),
      capabilities: (Array.isArray(profile.matching_index.capabilities) ? profile.matching_index.capabilities : [])
        .map((item) => ({
          tag: clean(item?.tag, 60),
          label: clean(item?.label, 160),
          depth: allowed(item?.depth, ["deep", "working", "touched", "not-established"]),
          authorship: allowed(item?.authorship, ["direct", "directed-reviewed", "mixed", "unclear"]),
          arc_ids: cleanStrings(item?.arc_ids, 20, 60).filter((id) => workArcIds.has(id)),
          evidence_ids: cleanStrings(item?.evidence_ids, 20, 80),
        }))
        .filter((item) => item.tag && item.label && item.depth && item.authorship)
        .slice(0, 50),
      delivery_states: (Array.isArray(profile.matching_index.delivery_states) ? profile.matching_index.delivery_states : [])
        .map((item) => ({
          state: allowed(item?.state, ["exploration", "working-prototype", "live-use", "ongoing-operation"]),
          arc_count: nonNegativeInt(item?.arc_count),
          arc_ids: cleanStrings(item?.arc_ids, 20, 60).filter((id) => workArcIds.has(id)),
          evidence_ids: cleanStrings(item?.evidence_ids, 20, 80),
        }))
        .filter((item) => item.state)
        .slice(0, 20),
      risk_gaps: (Array.isArray(profile.matching_index.risk_gaps) ? profile.matching_index.risk_gaps : [])
        .map((item) => ({
          tag: clean(item?.tag, 60),
          label: clean(item?.label, 160),
          status: allowed(item?.status, ["missing", "shallow", "unclear", "contradicted"]),
          implication: clean(item?.implication, 700),
          evidence_ids: cleanStrings(item?.evidence_ids, 20, 80),
        }))
        .filter((item) => item.tag && item.label && item.status && item.implication)
        .slice(0, 30),
    };
  } else if ("matching_index" in profile) {
    delete profile.matching_index;
  }

  if (isObject(profile.viewer_lenses)) {
    const cleanLens = (lens) => ({
      headline: clean(lens?.headline, 300),
      why_it_matters: (Array.isArray(lens?.why_it_matters) ? lens.why_it_matters : [])
        .map((item) => ({
          text: clean(item?.text, 400),
          evidence_ids: cleanStrings(item?.evidence_ids, 12, 80),
        }))
        .filter((item) => item.text)
        .slice(0, 3),
      caution: clean(lens?.caution, 400),
    });
    profile.viewer_lenses = {
      community: cleanLens(profile.viewer_lenses.community),
    };
  } else if ("viewer_lenses" in profile) {
    delete profile.viewer_lenses;
  }

  sanitizeArray(profile, "comparisons", 8, (comparison) => ({
    role: clean(comparison?.role, 120),
    summary: clean(comparison?.summary, 500),
  }), (comparison) => comparison.role && comparison.summary);

  if (isObject(profile.project_role)) {
    profile.project_role = {
      best_fit: clean(profile.project_role.best_fit, 700),
      less_like: cleanStrings(profile.project_role.less_like, 6, 300),
    };
  } else if ("project_role" in profile) {
    delete profile.project_role;
  }

  if (isObject(profile.project_match)) {
    profile.project_match = {
      good_fit: cleanStrings(profile.project_match.good_fit, 10, 300),
      bring_specialist: cleanStrings(profile.project_match.bring_specialist, 10, 300),
      not_established: cleanStrings(profile.project_match.not_established, 10, 300),
    };
  } else if ("project_match" in profile) {
    delete profile.project_match;
  }

  if (Array.isArray(profile.limits)) profile.limits = cleanStrings(profile.limits, 20, 500);
  else if ("limits" in profile) delete profile.limits;

  if (isObject(profile.signals)) {
    const signals = {};
    for (const key of SIGNAL_KEYS) {
      const signal = cleanSignal(profile.signals[key]);
      if (signal) signals[key] = signal;
    }
    if (Object.keys(signals).length) profile.signals = signals;
    else delete profile.signals;
  } else if ("signals" in profile) {
    delete profile.signals;
  }

  if (isObject(profile.cadence)) {
    profile.cadence = {
      sessions_last_28d: nonNegativeInt(profile.cadence.sessions_last_28d),
      active_weeks_last_12: nonNegativeInt(profile.cadence.active_weeks_last_12),
      sessions_per_observed_week: optionalNonNegativeNumber(profile.cadence.sessions_per_observed_week),
      last_session: clean(profile.cadence.last_session, 30),
    };
  } else if ("cadence" in profile) {
    delete profile.cadence;
  }

  if (isObject(profile.generated_by)) {
    const agent = clean(profile.generated_by.agent, 40);
    profile.generated_by = {
      agent: GENERATED_BY_AGENTS.has(agent) ? agent : "other",
      model: clean(profile.generated_by.model, 80),
    };
  } else if ("generated_by" in profile) {
    delete profile.generated_by;
  }

  if (Array.isArray(profile.flagship)) {
    const flagship = profile.flagship
      .map((item) => ({
        summary: clean(item?.summary, 300),
        sessions: nonNegativeInt(item?.sessions),
        span_days: nonNegativeInt(item?.span_days),
      }))
      .filter((item) => item.summary)
      .slice(0, 3);
    if (flagship.length) profile.flagship = flagship;
    else delete profile.flagship;
  } else if ("flagship" in profile) {
    delete profile.flagship;
  }

  if (usesProfileV9(profile)) {
    for (const key of Object.keys(profile)) {
      if (!PROFILE_V9_TOP_LEVEL_KEYS.has(key)) delete profile[key];
    }
  }
}

function sanitizeSourceCoverage(profile) {
  if (!isObject(profile.source_coverage)) {
    if ("source_coverage" in profile) delete profile.source_coverage;
    return;
  }
  const source = profile.source_coverage;
  const sessions = isObject(source.sessions) ? source.sessions : {};
  const github = isObject(source.github) ? source.github : {};
  const linkedin = isObject(source.linkedin) ? source.linkedin : {};
  profile.source_coverage = {
    sessions: {
      status: allowed(sessions.status, ["included", "unavailable"]),
      usable_sessions: nonNegativeInt(sessions.usable_sessions),
      from: clean(sessions.from, 10),
      to: clean(sessions.to, 10),
      limitations: cleanStrings(sessions.limitations, 10, 300),
    },
    github: {
      status: allowed(github.status, ["included", "declined", "unavailable"]),
      collected_at: clean(github.collected_at, 30),
      account_verified: github.account_verified === true,
      accessible_repositories: nonNegativeInt(github.accessible_repositories),
      private_counts_available: github.private_counts_available === true,
      search_complete: github.search_complete === true,
      limitations: cleanStrings(github.limitations, 10, 300),
    },
    linkedin: {
      status: allowed(linkedin.status, ["included", "declined", "unavailable"]),
      collected_at: clean(linkedin.collected_at, 30),
      identity_verified: linkedin.identity_verified === true,
      sections_seen: cleanStrings(linkedin.sections_seen, 12, 80),
    },
  };
}

function sanitizeWindows(profile) {
  if (!isObject(profile.windows)) {
    if ("windows" in profile) delete profile.windows;
    return;
  }
  const cleanWindow = (item, source = "") => ({
    ...(source ? { tool: clean(source, 60) } : {}),
    from: clean(item?.from, 10),
    to: clean(item?.to, 10),
    sessions: nonNegativeInt(item?.sessions),
    unknown_projects: nonNegativeInt(item?.unknown_projects),
  });
  const windows = {};
  for (const source of ["claude", "codex", "cowork"]) {
    if (isObject(profile.windows[source])) windows[source] = cleanWindow(profile.windows[source]);
  }
  windows.other = (Array.isArray(profile.windows.other) ? profile.windows.other : [])
    .map((item) => cleanWindow(item, item?.tool))
    .filter((item) => item.tool)
    .slice(0, 10);
  profile.windows = windows;
}

function sanitizeGithub(profile) {
  if (!isObject(profile.github)) {
    if ("github" in profile) delete profile.github;
    return;
  }
  const github = profile.github;
  const indexed = isObject(github.indexed_authored_activity) ? github.indexed_authored_activity : {};
  const graph = isObject(github.contribution_graph) ? github.contribution_graph : {};
  const audit = isObject(github.definition_audit) ? github.definition_audit : {};
  const characterization = isObject(github.activity_characterization) ? github.activity_characterization : {};
  const dimensions = isObject(characterization.dimensions) ? characterization.dimensions : {};
  const cleanDimension = (item) => ({
    status: allowed(item?.status, ["supported", "partial", "not-supported"]),
    evidence: clean(item?.evidence, 500),
  });
  profile.github = {
    account_created_at: clean(github.account_created_at, 30),
    earliest_observed_contribution: clean(github.earliest_observed_contribution, 30),
    latest_observed_contribution: clean(github.latest_observed_contribution, 30),
    contribution_years: (Array.isArray(github.contribution_years) ? github.contribution_years : []).map(nonNegativeInt).filter(Boolean).slice(0, 30),
    active_years: nonNegativeInt(github.active_years),
    active_months_observed: nonNegativeInt(github.active_months_observed),
    active_months_last_12: nonNegativeInt(github.active_months_last_12),
    indexed_authored_activity: {
      commits: nonNegativeInt(indexed.commits),
      commits_last_12: nonNegativeInt(indexed.commits_last_12),
      incomplete_results: indexed.incomplete_results === true,
      annual_commits: (Array.isArray(indexed.annual_commits) ? indexed.annual_commits : [])
        .map((item) => ({ year: nonNegativeInt(item?.year), commits: nonNegativeInt(item?.commits) }))
        .filter((item) => item.year)
        .slice(0, 30),
      authored_pull_requests: nonNegativeInt(indexed.authored_pull_requests),
      authored_pull_requests_last_12: nonNegativeInt(indexed.authored_pull_requests_last_12),
      authored_issues: nonNegativeInt(indexed.authored_issues),
      reviewed_pull_requests: nonNegativeInt(indexed.reviewed_pull_requests),
      reviewed_pull_requests_last_12: nonNegativeInt(indexed.reviewed_pull_requests_last_12),
      limitations: cleanStrings(indexed.limitations, 12, 400),
    },
    contribution_graph: {
      qualifying_commits: nonNegativeInt(graph.qualifying_commits),
      qualifying_pull_requests: nonNegativeInt(graph.qualifying_pull_requests),
      qualifying_reviews: nonNegativeInt(graph.qualifying_reviews),
      qualifying_issues: nonNegativeInt(graph.qualifying_issues),
      repositories_contributed_to: nonNegativeInt(graph.repositories_contributed_to),
      annual: (Array.isArray(graph.annual) ? graph.annual : [])
        .map((item) => ({
          year: nonNegativeInt(item?.year),
          commits: nonNegativeInt(item?.commits),
          pull_requests: nonNegativeInt(item?.pull_requests),
          reviews: nonNegativeInt(item?.reviews),
          issues: nonNegativeInt(item?.issues),
          repositories: nonNegativeInt(item?.repositories),
        }))
        .filter((item) => item.year)
        .slice(0, 30),
    },
    definition_audit: {
      status: allowed(audit.status, ["aligned", "material-divergence", "minor-divergence", "incomplete"]),
      summary: clean(audit.summary, 700),
    },
    activity_characterization: {
      version: nonNegativeInt(characterization.version),
      label: clean(characterization.label, 120),
      dimensions: Object.fromEntries(["continuity", "activity_context", "collaboration", "stewardship_optional"]
        .map((key) => [key, cleanDimension(dimensions[key])])),
      conclusion: clean(characterization.conclusion, 700),
    },
    language_exposure: (Array.isArray(github.language_exposure) ? github.language_exposure : [])
      .map((item) => ({
        tag: clean(item?.tag, 60),
        label: clean(item?.label, 120),
        active_years: nonNegativeInt(item?.active_years),
        first_observed: clean(item?.first_observed, 30),
        last_observed: clean(item?.last_observed, 30),
      }))
      .filter((item) => item.tag && item.label)
      .slice(0, 30),
    limitations: cleanStrings(github.limitations, 12, 400),
  };
}

function sanitizeWorkingStyle(profile) {
  if (!isObject(profile.working_style)) {
    if ("working_style" in profile) delete profile.working_style;
    return;
  }
  const result = {};
  for (const key of ["build_review_operate", "agent_collaboration", "verification_discipline", "maintenance_orientation"]) {
    const item = profile.working_style[key];
    if (!isObject(item)) continue;
    result[key] = {
      finding: clean(item.finding, 700),
      evidence: clean(item.evidence, 700),
      sources: cleanEnumStrings(item.sources, PROFILE_EVIDENCE_SOURCES, 4),
    };
  }
  profile.working_style = result;
}

function sanitizeProfileView(profile) {
  if (!isObject(profile.profile_view)) {
    if ("profile_view" in profile) delete profile.profile_view;
    return;
  }

  const view = profile.profile_view;
  const hero = isObject(view.hero) ? view.hero : {};
  const footprint = isObject(view.agent_footprint) ? view.agent_footprint : {};
  const mixUnavailable = footprint.normalized_mix === null;
  const mix = isObject(footprint.normalized_mix) ? footprint.normalized_mix : {};
  const practice = isObject(view.agent_practice) ? view.agent_practice : {};
  const matching = isObject(view.matching) ? view.matching : {};
  const cleanClaim = (item, maxLength = 500) => ({
    summary: clean(item?.summary, maxLength),
    evidence_ids: cleanStrings(item?.evidence_ids, 20, 80),
  });
  const cleanMatch = (item) => ({
    label: clean(item?.label, 160),
    summary: clean(item?.summary, 500),
    evidence_ids: cleanStrings(item?.evidence_ids, 20, 80),
  });

  profile.profile_view = {
    hero: {
      thesis: clean(hero.thesis, 500),
      source_note: clean(hero.source_note, 400),
      evidence_ids: cleanStrings(hero.evidence_ids, 20, 80),
    },
    agent_footprint: {
      normalized_mix: mixUnavailable ? null : {
        from: clean(mix.from, 10),
        to: clean(mix.to, 10),
        calendar_days: nonNegativeInt(mix.calendar_days),
        total_sessions: nonNegativeInt(mix.total_sessions),
        items: (Array.isArray(mix.items) ? mix.items : [])
          .map((item) => ({
            source: allowed(item?.source, PROFILE_MIX_SOURCES),
            sessions: nonNegativeInt(item?.sessions),
            share: clampedShare(item?.share),
            sessions_per_calendar_day: optionalNonNegativeNumber(item?.sessions_per_calendar_day),
          }))
          .filter((item) => item.source)
          .slice(0, 2),
        limitations: Array.isArray(mix.limitations)
          ? cleanStrings(mix.limitations, 5, 400)
          : [clean(mix.limitations, 400)].filter(Boolean),
        evidence_ids: cleanStrings(mix.evidence_ids, 20, 80),
      },
    },
    agent_practice: {
      role: cleanClaim(practice.role),
      statistics: (Array.isArray(practice.statistics) ? practice.statistics : [])
        .map((item) => ({
          tag: clean(item?.tag, 60),
          label: clean(item?.label, 120),
          value: optionalFiniteNumber(item?.value),
          source_field: clean(item?.source_field, 240),
          evidence_ids: cleanStrings(item?.evidence_ids, 20, 80),
        }))
        .filter((item) => item.tag && item.label && item.value != null && item.source_field && item.evidence_ids.length)
        .slice(0, 5),
      workflow: (Array.isArray(practice.workflow) ? practice.workflow : [])
        .map((item) => ({
          label: clean(item?.label, 120),
          summary: clean(item?.summary, 400),
          evidence_ids: cleanStrings(item?.evidence_ids, 20, 80),
        }))
        .filter((item) => item.label && item.summary && item.evidence_ids.length)
        .slice(0, 4),
      distinctive_fact: cleanClaim(practice.distinctive_fact),
      reusable_system: cleanClaim(practice.reusable_system),
      limitation: cleanClaim(practice.limitation),
    },
    industries: (Array.isArray(view.industries) ? view.industries : [])
      .map((item) => ({
        tag: clean(item?.tag, 60),
        label: clean(item?.label, 160),
        context: clean(item?.context, 500),
        career_context: clean(item?.career_context, 500),
        observed_work: clean(item?.observed_work, 500),
        depth: allowed(item?.depth, PROFILE_INDUSTRY_DEPTHS),
        sources: cleanEnumStrings(item?.sources, PROFILE_EVIDENCE_SOURCES, 4),
        evidence_ids: cleanStrings(item?.evidence_ids, 20, 80),
      }))
      .filter((item) => item.tag && item.label && item.context && item.depth)
      .slice(0, 5),
    subject_matter: (Array.isArray(view.subject_matter) ? view.subject_matter : [])
      .map((item) => ({
        tag: clean(item?.tag, 60),
        label: clean(item?.label, 160),
        summary: clean(item?.summary, 500),
        evidence_label: clean(item?.evidence_label, 240),
        evidence_ids: cleanStrings(item?.evidence_ids, 20, 80),
      }))
      .filter((item) => item.tag && item.label && item.summary && item.evidence_label)
      .slice(0, 5),
    matching: {
      strongest_fit: cleanMatch(matching.strongest_fit),
      add_specialist: cleanMatch(matching.add_specialist),
      not_shown: cleanMatch(matching.not_shown),
    },
    limits: (Array.isArray(view.limits) ? view.limits : [])
      .map((item) => cleanClaim(item))
      .filter((item) => item.summary && item.evidence_ids.length)
      .slice(0, 4),
  };
}

export function validateProfileV9(profile) {
  if (!usesProfileV9(profile)) return;
  if (Number(profile.prompt_version) !== 8) {
    throw new ProfileError("Profile schema 9 requires assessment prompt version 8.", 422, "PROFILE_V9_VERSION_INVALID");
  }
  if (!isObject(profile.profile_view) || !Array.isArray(profile.evidence_index) || !isObject(profile.matching_index)) {
    throw new ProfileError("Schema v9 requires profile_view, evidence_index, and matching_index.", 422, "PROFILE_V9_REQUIRED");
  }

  const view = profile.profile_view;
  if (!view.hero?.thesis || !view.hero?.source_note || !view.hero?.evidence_ids?.length) {
    throw new ProfileError("Schema v9 requires a complete profile hero.", 422, "PROFILE_V9_HERO_INVALID");
  }
  if (profile.focus !== view.hero.thesis || profile.headline !== view.hero.thesis) {
    throw new ProfileError("Schema v9 focus and headline must equal the hero thesis.", 422, "PROFILE_V9_HERO_INVALID");
  }

  validateNormalizedMix(
    view.agent_footprint?.normalized_mix,
    profile.activity_analysis?.coverage?.source_windows,
    profile.activity_analysis?.coverage?.shared_window_sessions,
  );
  validateOperatingRatioInputs(profile);

  const practice = view.agent_practice;
  if (!isObject(practice) || !validClaim(practice.role) || !validClaim(practice.distinctive_fact)
    || !validClaim(practice.reusable_system) || !validClaim(practice.limitation)
    || !listWithin(practice.statistics, 1, 3) || practice.statistics.some((item) => !item.evidence_ids?.length)
    || !listWithin(practice.workflow, 4, 4) || practice.workflow.some((item) => !item.evidence_ids?.length)) {
    throw new ProfileError("Schema v9 requires a complete agent-practice view with exactly four workflow steps.", 422, "PROFILE_V9_AGENT_PRACTICE_INVALID");
  }
  validateAnchoredStatistics(profile, practice.statistics);
  if (!listWithin(view.industries, 3, 5) || !listWithin(view.subject_matter, 3, 5)
    || !listWithin(view.limits, 2, 4) || view.limits.some((item) => !validClaim(item))) {
    throw new ProfileError("Schema v9 requires three to five industries and subject areas, plus two to four limits.", 422, "PROFILE_V9_VISIBLE_LIST_INVALID");
  }
  if (view.industries.some((item) => !item.sources?.length || !item.evidence_ids?.length)
    || view.subject_matter.some((item) => !item.evidence_ids?.length)) {
    throw new ProfileError("Every visible industry and subject-matter claim needs evidence references.", 422, "PROFILE_V9_EVIDENCE_REQUIRED");
  }
  validateUniqueVisibleTags(view.industries, "industry");
  validateUniqueVisibleTags(view.subject_matter, "subject-matter");
  for (const industry of view.industries) {
    if (industry.sources.includes("linkedin") && !industry.career_context) {
      throw new ProfileError("An industry sourced from LinkedIn requires a generalized career-context statement.", 422, "PROFILE_V9_INDUSTRY_SOURCE_INVALID");
    }
    if (industry.sources.some((source) => source === "sessions" || source === "github") && !industry.observed_work) {
      throw new ProfileError("An industry sourced from observed work requires an observed-work statement.", 422, "PROFILE_V9_INDUSTRY_SOURCE_INVALID");
    }
  }
  for (const key of ["strongest_fit", "add_specialist", "not_shown"]) {
    if (!view.matching?.[key]?.label || !view.matching?.[key]?.summary || !view.matching?.[key]?.evidence_ids?.length) {
      throw new ProfileError("Schema v9 requires all three matching decisions.", 422, "PROFILE_V9_MATCHING_INVALID");
    }
  }

  const evidenceIds = new Set();
  const evidenceById = new Map();
  for (const item of profile.evidence_index) {
    if (!item.id || !PROFILE_EVIDENCE_ID_RE.test(item.id) || evidenceIds.has(item.id)) {
      throw new ProfileError("Schema v9 evidence IDs must be present and unique.", 422, "PROFILE_V9_EVIDENCE_ID_INVALID");
    }
    if ((item.from && !isIsoDate(item.from)) || (item.to && !isIsoDate(item.to))
      || (item.from && item.to && item.from > item.to)) {
      throw new ProfileError("Schema v9 evidence dates must use valid ordered calendar dates.", 422, "PROFILE_V9_EVIDENCE_DATE_INVALID");
    }
    evidenceIds.add(item.id);
    evidenceById.set(item.id, item);
  }
  if (!evidenceIds.size) {
    throw new ProfileError("Schema v9 requires at least one evidence record.", 422, "PROFILE_V9_EVIDENCE_REQUIRED");
  }

  const referencedIds = [
    ...collectEvidenceIds(view),
    ...Object.values(profile.matching_index).flatMap((items) => (Array.isArray(items) ? items : []).flatMap((item) => item.evidence_ids || [])),
  ];
  if (referencedIds.some((id) => !evidenceIds.has(id))) {
    throw new ProfileError("Schema v9 contains an evidence reference that does not exist.", 422, "PROFILE_V9_EVIDENCE_REFERENCE_INVALID");
  }
  for (const industry of view.industries) {
    for (const source of industry.sources) {
      if (!industry.evidence_ids.some((id) => evidenceById.get(id)?.source === source)) {
        throw new ProfileError("Every declared industry source needs a matching evidence record.", 422, "PROFILE_V9_INDUSTRY_SOURCE_INVALID");
      }
    }
  }
  validateUniqueEvidenceArrays(view, profile.matching_index);

  for (const key of ["industries", "capabilities", "delivery_states", "risk_gaps"]) {
    if (!listWithin(profile.matching_index[key], 1, key === "capabilities" ? 50 : 30)) {
      throw new ProfileError("Schema v9 matching_index lists cannot be empty.", 422, "PROFILE_V9_MATCHING_INDEX_INVALID");
    }
    if (profile.matching_index[key].some((item) => !item.evidence_ids?.length)) {
      throw new ProfileError("Every schema v9 matching-index item needs evidence references.", 422, "PROFILE_V9_EVIDENCE_REQUIRED");
    }
  }
  if (profile.matching_index.delivery_states.some((item) => item.arc_count !== item.arc_ids.length)) {
    throw new ProfileError("Matching delivery-state counts must agree with their work-arc references.", 422, "PROFILE_V9_MATCHING_INDEX_INVALID");
  }

  assertNoRepeatedVisibleCopy(view);
  validateVisibleWordBudgets(view);
  assertNoPrivateUrls(profile);
}

function validateOperatingRatioInputs(profile) {
  const concurrency = isObject(profile.activity_analysis?.concurrency) ? profile.activity_analysis.concurrency : {};
  const multiSessionDays = optionalNonNegativeNumber(concurrency.multi_session_days);
  const coveredActiveDays = optionalNonNegativeNumber(concurrency.covered_active_days);
  if (multiSessionDays != null && coveredActiveDays != null && multiSessionDays > coveredActiveDays) {
    throw new ProfileError("Multi-session days cannot exceed covered active days.", 422, "PROFILE_V9_OPERATING_RATIO_INVALID");
  }
  for (const arc of Array.isArray(profile.work_arcs) ? profile.work_arcs : []) {
    if (arc.verification_mode && !["independent", "self-check", "unclear"].includes(arc.verification_mode)) {
      throw new ProfileError("Work-arc verification mode is invalid.", 422, "PROFILE_V9_OPERATING_RATIO_INVALID");
    }
  }
  const practice = isObject(profile.agent_practice) ? profile.agent_practice : {};
  const coverage = Array.isArray(practice.tool_call_coverage) ? practice.tool_call_coverage : [];
  for (const category of Array.isArray(practice.tool_categories) ? practice.tool_categories : []) {
    if (!Array.isArray(category.sources) || category.sources.length !== 1) continue;
    const denominator = coverage.find((item) => item.source === category.sources[0])?.sessions_scanned;
    if (Number.isFinite(category.active_sessions) && Number.isFinite(denominator) && category.active_sessions > denominator) {
      throw new ProfileError("A tool-category session count cannot exceed its same-source scanned-session denominator.", 422, "PROFILE_V9_OPERATING_RATIO_INVALID");
    }
  }
}

function validateNormalizedMix(mix, sourceWindows = [], sharedWindowSessions = []) {
  if (mix === null) {
    if (!Array.isArray(sharedWindowSessions) || sharedWindowSessions.length !== 0) {
      throw new ProfileError("An unavailable normalized mix requires an empty shared-window ledger.", 422, "PROFILE_V9_MIX_LEDGER_INVALID");
    }
    const observedBySource = PROFILE_MIX_SOURCES.map((source) => (Array.isArray(sourceWindows) ? sourceWindows : [])
      .filter((item) => item?.source === source && isIsoDate(item?.from) && isIsoDate(item?.to)));
    if (observedBySource.some((items) => !items.length)) {
      throw new ProfileError("An unavailable normalized mix requires recorded Claude and Codex windows.", 422, "PROFILE_V9_MIX_WINDOW_INVALID");
    }
    const exactFrom = observedBySource.map((items) => items.map((item) => item.from).sort()[0]).sort().at(-1);
    const exactTo = observedBySource.map((items) => items.map((item) => item.to).sort().at(-1)).sort()[0];
    if (exactFrom <= exactTo) {
      throw new ProfileError("The normalized mix cannot be null while recorded Claude and Codex windows overlap.", 422, "PROFILE_V9_MIX_WINDOW_INVALID");
    }
    return;
  }
  if (!isObject(mix) || !isIsoDate(mix.from) || !isIsoDate(mix.to)) {
    throw new ProfileError("The normalized Claude/Codex mix needs a valid shared date window.", 422, "PROFILE_V9_MIX_WINDOW_INVALID");
  }
  const from = Date.parse(`${mix.from}T00:00:00Z`);
  const to = Date.parse(`${mix.to}T00:00:00Z`);
  const calendarDays = Math.round((to - from) / 86_400_000) + 1;
  if (to < from || calendarDays !== mix.calendar_days || calendarDays < 1) {
    throw new ProfileError("The normalized Claude/Codex mix has an inconsistent calendar window.", 422, "PROFILE_V9_MIX_WINDOW_INVALID");
  }
  if (!listWithin(mix.limitations, 1, 5) || !mix.evidence_ids?.length) {
    throw new ProfileError("The normalized mix needs a limitation and evidence references.", 422, "PROFILE_V9_EVIDENCE_REQUIRED");
  }
  const observedBySource = PROFILE_MIX_SOURCES.map((source) => {
    const windows = (Array.isArray(sourceWindows) ? sourceWindows : [])
      .filter((item) => item?.source === source && isIsoDate(item?.from) && isIsoDate(item?.to));
    if (!windows.length) {
      throw new ProfileError("The normalized mix needs observed source windows for Claude and Codex.", 422, "PROFILE_V9_MIX_WINDOW_INVALID");
    }
    return {
      from: windows.map((item) => item.from).sort()[0],
      to: windows.map((item) => item.to).sort().at(-1),
      session_ceiling: windows.reduce((total, item) => total + nonNegativeInt(item.sessions), 0),
    };
  });
  const exactFrom = observedBySource.map((item) => item.from).sort().at(-1);
  const exactTo = observedBySource.map((item) => item.to).sort()[0];
  if (exactFrom > exactTo || mix.from !== exactFrom || mix.to !== exactTo) {
    throw new ProfileError("The normalized mix must use the exact overlapping Claude and Codex window.", 422, "PROFILE_V9_MIX_WINDOW_INVALID");
  }
  if (!Array.isArray(mix.items) || mix.items.length !== 2
    || new Set(mix.items.map((item) => item.source)).size !== 2
    || !PROFILE_MIX_SOURCES.every((source) => mix.items.some((item) => item.source === source))) {
    throw new ProfileError("The normalized mix must contain exactly one Claude item and one Codex item.", 422, "PROFILE_V9_MIX_SOURCES_INVALID");
  }
  const ledger = Array.isArray(sharedWindowSessions) ? sharedWindowSessions : [];
  if (ledger.length !== 2 || new Set(ledger.map((item) => item?.source)).size !== 2
    || !PROFILE_MIX_SOURCES.every((source) => ledger.some((item) => item?.source === source))) {
    throw new ProfileError("The normalized mix needs one deterministic shared-window record for Claude and Codex.", 422, "PROFILE_V9_MIX_LEDGER_INVALID");
  }
  for (const item of ledger) {
    const visibleItem = mix.items.find((candidate) => candidate.source === item.source);
    const sourceIndex = PROFILE_MIX_SOURCES.indexOf(item.source);
    if (item.from !== exactFrom || item.to !== exactTo || !visibleItem || item.sessions !== visibleItem.sessions
      || sourceIndex < 0 || item.sessions > observedBySource[sourceIndex].session_ceiling) {
      throw new ProfileError("The normalized mix counts must equal the deterministic shared-window records.", 422, "PROFILE_V9_MIX_LEDGER_INVALID");
    }
  }
  const sessionTotal = mix.items.reduce((total, item) => total + item.sessions, 0);
  const shareTotal = mix.items.reduce((total, item) => total + item.share, 0);
  if (mix.total_sessions < 1 || sessionTotal !== mix.total_sessions || Math.abs(shareTotal - 1) > 0.005) {
    throw new ProfileError("The normalized mix totals do not agree.", 422, "PROFILE_V9_MIX_TOTAL_INVALID");
  }
  for (const item of mix.items) {
    const expectedShare = item.sessions / mix.total_sessions;
    const expectedRate = item.sessions / calendarDays;
    if (item.sessions > mix.total_sessions || item.sessions_per_calendar_day == null
      || Math.abs(item.share - expectedShare) > 0.005
      || Math.abs(item.sessions_per_calendar_day - expectedRate) > 0.11) {
      throw new ProfileError("The normalized mix contains inconsistent session arithmetic.", 422, "PROFILE_V9_MIX_ARITHMETIC_INVALID");
    }
  }
}

function validateAnchoredStatistics(profile, statistics) {
  const tags = new Set();
  for (const item of statistics) {
    const tag = String(item.tag || "").toLowerCase();
    if (!tag || tags.has(tag)) {
      throw new ProfileError("Agent-practice statistic tags must be unique.", 422, "PROFILE_V9_STATISTIC_INVALID");
    }
    tags.add(tag);
    if (!PROFILE_STATISTIC_SOURCE_PREFIXES.some((prefix) => item.source_field.startsWith(prefix))) {
      throw new ProfileError("Agent-practice statistics must use an allowed deterministic source field.", 422, "PROFILE_V9_STATISTIC_SOURCE_INVALID");
    }
    const toolCategoryMatch = item.source_field.match(/^\/agent_practice\/tool_categories\/(\d+)\//);
    if (toolCategoryMatch) {
      const category = profile.agent_practice?.tool_categories?.[Number(toolCategoryMatch[1])];
      const genericTag = String(category?.tag || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      if (["shell", "filesystem", "file-system", "code-edit", "code-editing"].includes(genericTag)) {
        throw new ProfileError("Generic shell, file-system, and code-editing activity cannot be a visible hiring statistic.", 422, "PROFILE_V9_STATISTIC_SOURCE_INVALID");
      }
    }
    const anchoredValue = resolveJsonPointer(profile, item.source_field);
    if (typeof anchoredValue !== "number" || !Number.isFinite(anchoredValue) || item.value !== anchoredValue) {
      throw new ProfileError("Agent-practice statistic values must equal their deterministic source fields.", 422, "PROFILE_V9_STATISTIC_VALUE_INVALID");
    }
  }
}

function resolveJsonPointer(root, pointer) {
  if (typeof pointer !== "string" || !pointer.startsWith("/")) return undefined;
  let current = root;
  for (const rawPart of pointer.slice(1).split("/")) {
    const part = rawPart.replace(/~1/g, "/").replace(/~0/g, "~");
    if (!part || ["__proto__", "prototype", "constructor"].includes(part)) return undefined;
    if ((Array.isArray(current) && !/^\d+$/.test(part)) || (!Array.isArray(current) && !isObject(current))) return undefined;
    if (!Object.prototype.hasOwnProperty.call(current, part)) return undefined;
    current = current[part];
  }
  return current;
}

function validateUniqueVisibleTags(items, label) {
  const tags = new Set();
  for (const item of items) {
    const tag = String(item?.tag || "").toLowerCase();
    if (!tag || tags.has(tag)) {
      throw new ProfileError(`Schema v9 ${label} tags must be unique.`, 422, "PROFILE_V9_VISIBLE_TAG_DUPLICATE");
    }
    tags.add(tag);
  }
}

function validateUniqueEvidenceArrays(...roots) {
  const visit = (value, key = "") => {
    if (key === "evidence_ids" && Array.isArray(value)) {
      if (value.length !== new Set(value).size) {
        throw new ProfileError("Each evidence_ids list must contain unique IDs.", 422, "PROFILE_V9_EVIDENCE_REFERENCE_INVALID");
      }
      return;
    }
    if (Array.isArray(value)) value.forEach((item) => visit(item, key));
    else if (isObject(value)) Object.entries(value).forEach(([childKey, child]) => visit(child, childKey));
  };
  roots.forEach((root) => visit(root));
}

function validateVisibleWordBudgets(view) {
  assertWordBudget(view.hero.thesis, 28, "hero thesis");
  assertWordBudget(view.hero.source_note, 24, "hero source note");
  if (view.agent_footprint.normalized_mix) {
    view.agent_footprint.normalized_mix.limitations.forEach((item) => assertWordBudget(item, 36, "mix limitation"));
  }
  assertWordBudget(view.agent_practice.role.summary, 34, "agent-practice role");
  view.agent_practice.workflow.forEach((item) => assertWordBudget(item.summary, 22, "agent workflow step"));
  assertWordBudget(view.agent_practice.distinctive_fact.summary, 30, "distinctive agent fact");
  assertWordBudget(view.agent_practice.reusable_system.summary, 30, "reusable agent system");
  assertWordBudget(view.agent_practice.limitation.summary, 30, "agent-practice limitation");
  view.industries.forEach((item) => {
    assertWordBudget(item.context, 16, "industry context");
    assertWordBudget(item.career_context, 30, "industry career context");
    assertWordBudget(item.observed_work, 30, "industry observed work");
  });
  view.subject_matter.forEach((item) => {
    assertWordBudget(item.summary, 26, "subject-matter summary");
    assertWordBudget(item.evidence_label, 10, "subject-matter evidence label");
  });
  Object.values(view.matching).forEach((item) => assertWordBudget(item.summary, 34, "matching summary"));
  view.limits.forEach((item) => assertWordBudget(item.summary, 24, "profile limit"));
}

function assertWordBudget(value, maximum, label) {
  const count = String(value || "").trim().split(/\s+/).filter(Boolean).length;
  if (count > maximum) {
    throw new ProfileError(`The schema v9 ${label} exceeds its ${maximum}-word budget.`, 422, "PROFILE_V9_WORD_BUDGET_EXCEEDED");
  }
}

function assertNoPrivateUrls(profile) {
  assertNoPrivateReferences(profile);
}

function assertNoRepeatedVisibleCopy(view) {
  const seen = new Set();
  const visit = (value, key = "") => {
    if (typeof value === "string") {
      if (["tag", "source", "depth"].includes(key)) return;
      const normalized = value.toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, " ").trim();
      if (normalized.length < 25) return;
      if (seen.has(normalized)) {
        throw new ProfileError("Schema v9 visible copy contains an exact repeated statement.", 422, "PROFILE_V9_VISIBLE_COPY_REPEATED");
      }
      seen.add(normalized);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, key));
      return;
    }
    if (isObject(value)) {
      for (const [childKey, childValue] of Object.entries(value)) visit(childValue, childKey);
    }
  };
  visit(view);
}

function listWithin(value, min, max) {
  return Array.isArray(value) && value.length >= min && value.length <= max;
}

function validClaim(value) {
  return isObject(value) && Boolean(value.summary) && Array.isArray(value.evidence_ids) && value.evidence_ids.length > 0;
}

function collectEvidenceIds(value) {
  const ids = [];
  const visit = (item, key = "") => {
    if (key === "evidence_ids" && Array.isArray(item)) {
      ids.push(...item);
      return;
    }
    if (Array.isArray(item)) item.forEach((child) => visit(child, key));
    else if (isObject(item)) Object.entries(item).forEach(([childKey, child]) => visit(child, childKey));
  };
  visit(value);
  return ids;
}

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function skillTier(skill) {
  if (["deep", "working", "touched"].includes(skill?.tier)) return skill.tier;
  return { "very-familiar": "deep", familiar: "working", some: "touched" }[skill?.familiarity] || "touched";
}

function badgeProofStars(badge) {
  const value = proofStars(badge?.proof_stars, null);
  if (value != null) return value;
  return badge?.status === "emerging" ? 1 : 2;
}

export function validateBadgeScarcity(profile) {
  // Schema v9 replaces public badge grids with a concise evidence-backed view.
  // Keep the v7/v8 rules intact for older uploads, but do not require badges
  // for the new contract.
  if (usesProfileV9(profile)) return;
  if (!usesOperatorBadgeSchema(profile)) return;
  const completeMap = usesCompleteBadgeMapSchema(profile);
  const families = ["technical_chops", "business_know_how", "good_judgment"];
  const badges = isObject(profile?.badges) ? profile.badges : {};
  const seen = new Set();
  let earnedTotal = 0;
  let emergingTotal = 0;
  for (const family of families) {
    const items = Array.isArray(badges[family]) ? badges[family] : [];
    let familyEarned = 0;
    for (const badge of items) {
      const tag = clean(badge?.tag, 60);
      if (!tag || seen.has(tag)) {
        throw new ProfileError("The badge profile contains a missing or duplicate badge tag. Re-run the current assessment.", 422, "PROFILE_BADGE_INFLATION");
      }
      seen.add(tag);
      if (completeMap) continue;
      if (badgeProofStars(badge) === 1) emergingTotal += 1;
      else {
        familyEarned += 1;
        earnedTotal += 1;
      }
    }
    if (!completeMap && familyEarned > 3) {
      throw new ProfileError("The badge profile awards more than three earned badges in one Operator Engineer pillar. Re-run the current assessment with the scarcity rules.", 422, "PROFILE_BADGE_INFLATION");
    }
  }
  if (!completeMap && (earnedTotal > 6 || emergingTotal > 2)) {
    throw new ProfileError("The badge profile exceeds the evidence budget of six earned and two emerging badges. Re-run the current assessment with the scarcity rules.", 422, "PROFILE_BADGE_INFLATION");
  }
  if (!Array.isArray(profile?.badge_audit?.not_awarded)
    || (!completeMap && profile.badge_audit.not_awarded.length === 0)) {
    throw new ProfileError("The badge profile is missing its not-awarded audit. Re-run the current assessment.", 422, "PROFILE_BADGE_AUDIT_MISSING");
  }
  if (completeMap) {
    const expected = new Set(Object.values(BADGE_TAGS).flat());
    const notAwarded = profile.badge_audit.not_awarded.map((item) => clean(item?.tag, 60)).filter(Boolean);
    const allTags = [...seen, ...notAwarded];
    if (allTags.length !== expected.size || new Set(allTags).size !== expected.size || allTags.some((tag) => !expected.has(tag))) {
      throw new ProfileError("The badge evidence map must rate or explain all 14 controlled badges exactly once.", 422, "PROFILE_BADGE_MAP_INCOMPLETE");
    }
    for (const family of families) {
      for (const badge of (Array.isArray(badges[family]) ? badges[family] : [])) {
        const basis = badge?.proof_basis;
        const hasBasis = isObject(basis)
          && ["arc_count", "system_count", "span_days", "direct_outcome_count"].every((key) => Number.isFinite(Number(basis[key])));
        if (!hasBasis || (badgeProofStars(badge) < 3 && !clean(badge?.next_star_evidence, 500))) {
          throw new ProfileError("Every awarded or observed badge needs a structured proof basis and a next-star requirement when below three stars.", 422, "PROFILE_BADGE_BASIS_MISSING");
        }
      }
    }
  }
}

function usesOperatorBadgeSchema(profile) {
  return Number(profile?.schema_version) >= 7 || Number(profile?.prompt_version) >= 8;
}

function usesCompleteBadgeMapSchema(profile) {
  return Number(profile?.schema_version) >= 8 || Number(profile?.prompt_version) >= 9;
}

function usesProfileV9(profile) {
  return Number(profile?.schema_version) >= 9;
}

function proofStars(value, fallback = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(3, Math.max(1, Math.trunc(number)));
}

function clampedShare(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(1, Math.max(0, Math.round(number * 1000) / 1000));
}

function badgeStatus(badge) {
  return badgeProofStars(badge) === 1 ? "emerging" : "earned";
}

function sanitizeArray(profile, key, limit, mapItem, keepItem) {
  if (!Array.isArray(profile[key])) {
    if (key in profile) delete profile[key];
    return;
  }
  profile[key] = profile[key].map(mapItem).filter(keepItem).slice(0, limit);
}

function cleanStrings(value, limit, maxLength) {
  return (Array.isArray(value) ? value : [])
    .map((item) => clean(item, maxLength))
    .filter(Boolean)
    .slice(0, limit);
}

function cleanEnumStrings(value, values, limit) {
  return (Array.isArray(value) ? value : [])
    .map((item) => allowed(item, values))
    .filter(Boolean)
    .slice(0, limit);
}

function allowed(value, values) {
  const cleanValue = clean(value, 40);
  return values.includes(cleanValue) ? cleanValue : "";
}

function cleanSignal(signal) {
  if (!isObject(signal)) return null;
  const grade = clampedGrade(signal.grade);
  if (grade == null) return null;
  return {
    grade,
    evidence: (Array.isArray(signal.evidence) ? signal.evidence : [])
      .map((item) => clean(item, 300))
      .filter(Boolean)
      .slice(0, 4),
  };
}

function clampedGrade(value) {
  if (value == null || (typeof value !== "number" && typeof value !== "string")) return null;
  if (typeof value === "string" && !value.trim()) return null;
  const grade = Number(value);
  if (!Number.isFinite(grade)) return null;
  return Math.min(5, Math.max(1, Math.trunc(grade)));
}

function nonNegativeInt(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.trunc(number));
}

function positiveInt(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.trunc(number) : null;
}

function optionalNonNegativeInt(value) {
  if (value == null || value === "") return null;
  return nonNegativeInt(value);
}

function optionalNonNegativeNumber(value) {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.round(number * 10) / 10) : null;
}

function optionalFiniteNumber(value) {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function isObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
