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

export function sanitizeProfile(profile) {
  profile.name = clean(profile.name, 200);
  profile.focus = clean(profile.focus || profile.headline, 300);
  profile.headline = clean(profile.headline || profile.focus, 300);

  profile.skills = profile.skills
    .map((skill) => ({
      tag: clean(skill?.tag, 60),
      label: clean(skill?.label, 120),
      category: clean(skill?.category, 40),
      familiarity: allowed(skill?.familiarity, ["very-familiar", "familiar", "some"]),
      tier: skillTier(skill),
      authorship: allowed(skill?.authorship, ["direct", "directed-reviewed", "mixed", "unclear"]),
      sessions: nonNegativeInt(skill?.sessions),
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

function optionalNonNegativeInt(value) {
  if (value == null || value === "") return null;
  return nonNegativeInt(value);
}

function optionalNonNegativeNumber(value) {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.round(number * 10) / 10) : null;
}

export function isObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
