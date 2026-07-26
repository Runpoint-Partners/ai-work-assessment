// Vendored from the Overflow site: functions/api/_public_benchmark_curves.js
// GENERATED FILE — do not edit by hand. Fix it upstream, then run:
//   node scripts/sync-from-overflow.mjs
// De-branding transforms and integrity hashes live in SYNC-MANIFEST.json.

// Minimum-coverage floor. A metric is published as a density shape only once at
// least this many schema-compatible profiles report it; below the floor it is
// listed under `pending` with no shape, no count, and no extrema. This is what
// keeps a small cohort from being re-identifiable, so do not lower it.
const MIN_PUBLIC_COVERAGE = 8;
const DENSITY_SAMPLES = 33;
const MULTI_ENVIRONMENT_LOCAL_METRICS = new Set([
  "captured_agent_sessions",
  "claude_code_sessions",
  "codex_sessions",
  "agent_sessions_per_observed_week",
  "recent_agent_sessions_28d",
  "active_agent_weeks_12w",
]);

const METRICS = [
  {
    key: "captured_agent_sessions",
    label: "Captured agent sessions",
    unit: "sessions",
    window: "reported local history",
    scale: "log1p",
    domain: [0, 2000],
    minimumPromptVersion: 1,
    minimumSchemaVersion: 1,
    read: (profile) => windowMetrics(profile).sessions,
    caveat: "Capture windows vary by tool and profile, so this describes observed volume rather than lifetime use.",
  },
  {
    key: "claude_code_sessions",
    label: "Claude Code sessions",
    unit: "sessions",
    window: "reported local history",
    scale: "log1p",
    domain: [0, 500],
    minimumPromptVersion: 1,
    minimumSchemaVersion: 1,
    read: (profile) => toolSessions(profile, "claude"),
    caveat: "A tool-specific observed count; capture-window lengths can differ.",
  },
  {
    key: "codex_sessions",
    label: "Codex sessions",
    unit: "sessions",
    window: "reported local history",
    scale: "log1p",
    domain: [0, 500],
    minimumPromptVersion: 1,
    minimumSchemaVersion: 1,
    read: (profile) => toolSessions(profile, "codex"),
    caveat: "A tool-specific observed count; missing Codex windows are omitted rather than treated as zero.",
  },
  {
    key: "agent_sessions_per_observed_week",
    label: "Weekly average across full captured span",
    unit: "sessions / week",
    window: "each profile's full captured date span",
    scale: "log1p",
    domain: [0, 100],
    minimumPromptVersion: 1,
    minimumSchemaVersion: 1,
    read: sessionsPerCapturedWeek,
    caveat: "A long-window average across each profile's full dated capture span, not a recent-activity rate; retention still varies by tool.",
  },
  {
    key: "recent_agent_sessions_28d",
    label: "Recent agent sessions",
    unit: "sessions",
    window: "last 28 days",
    scale: "log1p",
    domain: [0, 500],
    minimumPromptVersion: 4,
    minimumSchemaVersion: 3,
    read: (profile) => finiteNumber(profile?.cadence?.sessions_last_28d),
    caveat: "A comparable recent-usage count available in newer assessments.",
  },
  {
    key: "active_agent_weeks_12w",
    label: "Active agent weeks",
    unit: "weeks",
    window: "last 12 weeks",
    scale: "linear",
    domain: [0, 12],
    minimumPromptVersion: 4,
    minimumSchemaVersion: 3,
    read: (profile) => finiteNumber(profile?.cadence?.active_weeks_last_12),
    caveat: "Weeks with at least one captured agent session during the last 12 weeks.",
  },
  {
    key: "github_active_months_12m",
    label: "GitHub active months",
    unit: "months",
    window: "last 12 months",
    scale: "linear",
    domain: [0, 12],
    minimumPromptVersion: 5,
    minimumSchemaVersion: 4,
    read: (profile) => finiteNumber(profile?.github?.active_months_last_12),
    caveat: "Months with authenticated authored GitHub activity; this measures continuity, not code quality.",
  },
  {
    key: "github_indexed_commits_12m",
    label: "Indexed authored GitHub commits",
    unit: "commits",
    window: "last 12 months",
    scale: "log1p",
    domain: [0, 10000],
    minimumPromptVersion: 5,
    minimumSchemaVersion: 4,
    read: (profile) => finiteNumber(profile?.github?.indexed_authored_activity?.commits_last_12),
    caveat: "Authenticated indexed authored volume; it is not an absolute census or a quality score.",
  },
  {
    key: "github_pull_request_activity_12m",
    label: "GitHub pull-request activity",
    unit: "authored + reviewed PRs",
    window: "last 12 months",
    scale: "log1p",
    domain: [0, 1000],
    minimumPromptVersion: 5,
    minimumSchemaVersion: 4,
    read: (profile) => sumIfPresent(
      profile?.github?.indexed_authored_activity?.authored_pull_requests_last_12,
      profile?.github?.indexed_authored_activity?.reviewed_pull_requests_last_12,
    ),
    caveat: "Authored plus reviewed pull requests visible to the authenticated account; the separate source counts remain available because this total is not a pure review or collaboration measure.",
  },
];

export function buildPublicBenchmarkCurves(rows = []) {
  const profiles = rows.map((row) => ({ row, data: safeParse(row.data_json) })).filter((item) => item.data);
  const available = [];
  const pending = [];

  for (const metric of METRICS) {
    const values = profiles
      .filter((profile) => compatible(profile, metric))
      .map((profile) => metric.read(profile.data))
      .filter((value) => value != null);
    if (values.length < MIN_PUBLIC_COVERAGE) {
      pending.push({
        key: metric.key,
        label: metric.label,
        unit: metric.unit,
        window: metric.window,
        coverage: values.length ? `<${MIN_PUBLIC_COVERAGE}` : "none",
        minimum_coverage: MIN_PUBLIC_COVERAGE,
      });
      continue;
    }
    available.push({
      key: metric.key,
      label: metric.label,
      unit: metric.unit,
      window: metric.window,
      coverage: values.length,
      scale: metric.scale,
      domain: { minimum: metric.domain[0], maximum: metric.domain[1], fixed: true },
      density: empiricalDensity(values, metric),
      density_samples: DENSITY_SAMPLES,
      placement: "Map the local value onto the fixed domain using the declared scale; never send the local value upstream.",
      caveat: metric.caveat,
      directional: values.length < 20,
    });
  }

  return {
    schema: "ai-work-assessment-benchmark-curves",
    version: 1,
    cohort_size: profiles.length,
    available,
    pending,
    privacy: {
      minimum_coverage: MIN_PUBLIC_COVERAGE,
      disclosure: "An aggregate, unnamed cohort comparison. Empirical density shapes on fixed public domains only. No profile rows, raw observations, bucket counts, exact extrema, quantiles, ranks, names, emails, URLs, or identifiers are returned.",
      differential_privacy: false,
    },
  };
}

function compatible(profile, metric) {
  const promptVersion = Number(profile?.row?.prompt_version ?? profile?.data?.prompt_version ?? 1);
  const schemaVersion = Number(profile?.row?.schema_version ?? profile?.data?.schema_version ?? 1);
  const multiEnvironment = profile?.data?.collection_summary?.mode === "multi"
    && Number(profile.data.collection_summary.environment_count) > 1;
  return promptVersion >= metric.minimumPromptVersion
    && schemaVersion >= metric.minimumSchemaVersion
    && !(multiEnvironment && MULTI_ENVIRONMENT_LOCAL_METRICS.has(metric.key));
}

function empiricalDensity(values, metric) {
  const samples = Array(DENSITY_SAMPLES).fill(0);
  for (const value of values) {
    const scaled = metricPosition(value, metric) * (DENSITY_SAMPLES - 1);
    const left = Math.floor(scaled);
    const right = Math.ceil(scaled);
    if (left === right) {
      samples[left] += 1;
    } else {
      samples[left] += right - scaled;
      samples[right] += scaled - left;
    }
  }
  const shaped = samples.map((value, index) =>
    value * 0.5 + (samples[index - 1] || 0) * 0.25 + (samples[index + 1] || 0) * 0.25,
  );
  const peak = Math.max(...shaped, 1);
  return shaped.map((value) => Math.round((value / peak) * 100) / 100);
}

function metricPosition(value, metric) {
  const [minimum, maximum] = metric.domain;
  const bounded = Math.max(minimum, Math.min(maximum, Number(value)));
  if (maximum <= minimum) return 0.5;
  if (metric.scale === "log1p") {
    return (Math.log1p(bounded) - Math.log1p(minimum)) / (Math.log1p(maximum) - Math.log1p(minimum));
  }
  return (bounded - minimum) / (maximum - minimum);
}

function sessionsPerCapturedWeek(profile) {
  const windows = flattenWindows(profile?.windows);
  const dated = windows.filter((window) => window.from && window.to && window.sessions != null);
  if (!dated.length) return null;
  const from = Math.min(...dated.map((window) => Date.parse(window.from)).filter(Number.isFinite));
  const to = Math.max(...dated.map((window) => Date.parse(window.to)).filter(Number.isFinite));
  if (!Number.isFinite(from) || !Number.isFinite(to)) return null;
  const days = Math.max(1, Math.floor((to - from) / 86_400_000) + 1);
  const sessions = dated.reduce((sum, window) => sum + window.sessions, 0);
  return Math.round((sessions / days) * 70) / 10;
}

function windowMetrics(profile) {
  const windows = flattenWindows(profile?.windows);
  return {
    sessions: windows.length ? windows.reduce((sum, window) => sum + (window.sessions || 0), 0) : null,
  };
}

function toolSessions(profile, tool) {
  const windows = flattenWindows(profile?.windows).filter((window) => window.tool === tool);
  return windows.length ? windows.reduce((sum, window) => sum + (window.sessions || 0), 0) : null;
}

function flattenWindows(windows) {
  if (!windows || typeof windows !== "object" || Array.isArray(windows)) return [];
  const result = [];
  for (const [tool, value] of Object.entries(windows)) {
    if (Array.isArray(value)) {
      for (const item of value) pushWindow(result, item?.tool || tool, item);
    } else {
      pushWindow(result, tool, value);
    }
  }
  return result;
}

function pushWindow(result, tool, value) {
  if (!value || typeof value !== "object") return;
  const sessions = finiteNumber(value.sessions);
  if (sessions == null && !value.from && !value.to) return;
  result.push({
    tool: normalizeTool(tool),
    sessions: sessions || 0,
    from: validDate(value.from),
    to: validDate(value.to),
  });
}

function normalizeTool(value) {
  const tool = String(value || "").toLowerCase();
  if (tool.includes("claude")) return "claude";
  if (tool.includes("codex")) return "codex";
  if (tool.includes("cowork")) return "cowork";
  return tool.trim();
}

function validDate(value) {
  return Number.isFinite(Date.parse(value)) ? String(value) : null;
}

function sumIfPresent(...values) {
  const numbers = values.map(finiteNumber).filter((value) => value != null);
  return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) : null;
}

function finiteNumber(value) {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function safeParse(value) {
  try { return JSON.parse(value); } catch { return null; }
}
