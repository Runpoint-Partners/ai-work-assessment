// Vendored from the Overflow site: scripts/lib/evidence-bundle.mjs
// GENERATED FILE — do not edit by hand. Fix it upstream, then run:
//   node scripts/sync-from-overflow.mjs
// De-branding transforms and integrity hashes live in SYNC-MANIFEST.json.

import { createHash, randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

export const BUNDLE_SCHEMA_VERSION = 1;
export const CONSOLIDATION_STRATEGY_VERSION = 1;
export const MAX_BUNDLE_BYTES = 4 * 1024 * 1024;

const SOURCE_VALUES = new Set(["codex", "claude", "cowork", "other"]);
const ENVIRONMENT_KINDS = new Set(["computer", "vm", "cloud", "other"]);
const EVIDENCE_QUALITY = new Map([
  ["metadata-only", 1],
  ["partial-transcript", 2],
  ["full-transcript", 3],
]);
const RETENTION_VALUES = new Set(["full-available", "retention-limited", "unknown"]);
const SECRET_PATTERNS = [
  /sk-[A-Za-z0-9_-]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /gh[pousr]_[A-Za-z0-9]{30,}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}/,
];
const PRIVATE_PATTERNS = [
  /\/Users\/[^/\s"']+/i,
  /\/home\/[^/\s"']+/i,
  /[A-Za-z]:\\Users\\[^\\\s"']+/i,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /https?:\/\/[^\s"']+/i,
];

export class BundleError extends Error {
  constructor(message, code = "BUNDLE_INVALID") {
    super(message);
    this.code = code;
  }
}

export function sha256(value) {
  return createHash("sha256").update(String(value || "")).digest("hex");
}

export function nativeSessionDigest(source, nativeSessionId) {
  return sha256(`${normalizeSource(source)}\0${String(nativeSessionId || "").trim()}`);
}

export function projectFingerprint(projectKey) {
  return sha256(normalizeProjectKey(projectKey));
}

export function stableEnvironmentId({
  configPath = join(homedir(), ".ai-work-assessment", "environment-id"),
} = {}) {
  let salt = "";
  try {
    salt = readFileSync(configPath, "utf8").trim();
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  if (!/^[a-f0-9]{64}$/.test(salt)) {
    salt = randomBytes(32).toString("hex");
    mkdirSync(dirname(configPath), { recursive: true, mode: 0o700 });
    writeFileSync(configPath, `${salt}\n`, { mode: 0o600 });
  }
  return sha256(`ai-work-assessment-environment\0${salt}`).slice(0, 24);
}

export function validateBundle(input) {
  const bundle = clone(input);
  if (!isObject(bundle)) throw new BundleError("The bundle must be a JSON object.");
  const serialized = JSON.stringify(bundle);
  if (Buffer.byteLength(serialized) > MAX_BUNDLE_BYTES) {
    throw new BundleError(`The bundle is larger than ${MAX_BUNDLE_BYTES} bytes.`, "BUNDLE_TOO_LARGE");
  }
  assertPrivacySafe(serialized);
  if (Number(bundle.bundle_schema_version) !== BUNDLE_SCHEMA_VERSION) {
    throw new BundleError(`Expected bundle schema ${BUNDLE_SCHEMA_VERSION}.`, "BUNDLE_VERSION_UNSUPPORTED");
  }
  if (!isObject(bundle.environment) || !/^[a-f0-9]{24}$/.test(String(bundle.environment.id || ""))) {
    throw new BundleError("The bundle has no valid opaque environment ID.");
  }
  const kind = ENVIRONMENT_KINDS.has(bundle.environment.kind) ? bundle.environment.kind : "other";
  const label = clean(bundle.environment.label, 80);
  const collectedAt = iso(bundle.collected_at);
  if (!collectedAt) throw new BundleError("The bundle has no valid collected_at timestamp.");

  const sourceCoverage = array(bundle.source_coverage).slice(0, 16).map((item) => {
    const source = normalizeSource(item?.source);
    const from = date(item?.from);
    const to = date(item?.to);
    if (!source || !from || !to) throw new BundleError("Every source coverage row needs a supported source and date range.");
    return {
      source,
      from,
      to,
      coverage_days: nonNegativeInt(item?.coverage_days),
      sessions: nonNegativeInt(item?.sessions),
      retention: RETENTION_VALUES.has(item?.retention) ? item.retention : "unknown",
      limitations: cleanStrings(item?.limitations, 8, 240),
    };
  });

  const sessionEvidence = array(bundle.session_evidence).slice(0, 20_000).map((item, index) => {
    const source = normalizeSource(item?.source);
    const nativeDigest = digest(item?.native_session_digest);
    const fallbackFingerprint = digest(item?.fallback_fingerprint);
    const project = digest(item?.project_fingerprint);
    const firstEvent = iso(item?.first_event);
    const lastEvent = iso(item?.last_event);
    const quality = EVIDENCE_QUALITY.has(item?.evidence_quality) ? item.evidence_quality : "";
    if (!source || (!nativeDigest && !fallbackFingerprint) || !project || !firstEvent || !lastEvent || !quality) {
      throw new BundleError(`Session evidence row ${index + 1} is incomplete.`);
    }
    return {
      source,
      native_session_digest: nativeDigest || undefined,
      fallback_fingerprint: fallbackFingerprint || undefined,
      first_event: firstEvent,
      last_event: lastEvent,
      project_fingerprint: project,
      project_label: clean(item?.project_label, 100),
      evidence_quality: quality,
      event_count: nonNegativeInt(item?.event_count),
      observations: sanitizeObservations(item?.observations),
      limitations: cleanStrings(item?.limitations, 8, 240),
    };
  });

  return {
    bundle_schema_version: BUNDLE_SCHEMA_VERSION,
    collector_prompt_version: positiveInt(bundle.collector_prompt_version) || 8,
    environment: { id: bundle.environment.id, kind, ...(label ? { label } : {}) },
    collected_at: collectedAt,
    source_coverage: sourceCoverage,
    session_evidence: sessionEvidence,
    collection_limits: cleanStrings(bundle.collection_limits, 16, 300),
    privacy_scan: {
      passed: true,
      scanner_version: positiveInt(bundle.privacy_scan?.scanner_version) || 1,
    },
  };
}

export function consolidateBundles(inputs) {
  const validated = array(inputs).map(validateBundle);
  if (!validated.length) throw new BundleError("No evidence bundles were supplied.");

  const latestByEnvironment = new Map();
  for (const bundle of validated) {
    const existing = latestByEnvironment.get(bundle.environment.id);
    if (!existing || Date.parse(bundle.collected_at) > Date.parse(existing.collected_at)) {
      latestByEnvironment.set(bundle.environment.id, bundle);
    }
  }
  const bundles = [...latestByEnvironment.values()].sort((a, b) =>
    a.environment.id.localeCompare(b.environment.id),
  );
  const records = new Map();
  let inputSessions = 0;
  let exactDuplicatesRemoved = 0;

  for (const bundle of bundles) {
    for (const session of bundle.session_evidence) {
      inputSessions += 1;
      const identity = session.native_session_digest
        ? `${session.source}:native:${session.native_session_digest}`
        : `${session.source}:fallback:${session.fallback_fingerprint}`;
      const existing = records.get(identity);
      if (!existing) {
        records.set(identity, {
          ...session,
          environment_ids: [bundle.environment.id],
        });
        continue;
      }
      exactDuplicatesRemoved += 1;
      const environments = [...new Set([...existing.environment_ids, bundle.environment.id])].sort();
      const preferred = EVIDENCE_QUALITY.get(session.evidence_quality) > EVIDENCE_QUALITY.get(existing.evidence_quality)
        ? session
        : existing;
      records.set(identity, { ...preferred, environment_ids: environments });
    }
  }

  const sessionEvidence = [...records.values()].sort((a, b) =>
    a.first_event.localeCompare(b.first_event)
      || a.source.localeCompare(b.source)
      || (a.native_session_digest || a.fallback_fingerprint).localeCompare(b.native_session_digest || b.fallback_fingerprint),
  );
  const activeBundles = bundles.filter((bundle) => bundle.session_evidence.length > 0);

  return {
    bundle_schema_version: BUNDLE_SCHEMA_VERSION,
    strategy_version: CONSOLIDATION_STRATEGY_VERSION,
    consolidated_at: new Date().toISOString(),
    bundle_count: bundles.length,
    environment_count: activeBundles.length,
    input_sessions: inputSessions,
    unique_sessions: sessionEvidence.length,
    exact_duplicates_removed: exactDuplicatesRemoved,
    environments: activeBundles.map((bundle, index) => ({
      environment_index: index + 1,
      id: bundle.environment.id,
      kind: bundle.environment.kind,
      ...(bundle.environment.label ? { label: bundle.environment.label } : {}),
      collected_at: bundle.collected_at,
      sources: bundle.source_coverage,
      unique_sessions: sessionEvidence.filter((session) => session.environment_ids.includes(bundle.environment.id)).length,
    })),
    session_evidence: sessionEvidence,
    collection_limits: [...new Set(bundles.flatMap((bundle) => bundle.collection_limits))].slice(0, 24),
  };
}

export function publicCollectionSummary(consolidated) {
  if (!isObject(consolidated)) throw new BundleError("The consolidation result is missing.");
  return {
    mode: "multi",
    environment_count: nonNegativeInt(consolidated.environment_count),
    input_sessions: nonNegativeInt(consolidated.input_sessions),
    unique_sessions: nonNegativeInt(consolidated.unique_sessions),
    exact_duplicates_removed: nonNegativeInt(consolidated.exact_duplicates_removed),
    strategy_version: positiveInt(consolidated.strategy_version) || CONSOLIDATION_STRATEGY_VERSION,
    environment_coverage: array(consolidated.environments).slice(0, 12).map((environment, index) => {
      const windows = array(environment?.sources);
      const dates = windows.flatMap((window) => [date(window?.from), date(window?.to)]).filter(Boolean).sort();
      return {
        environment_index: index + 1,
        kind: ENVIRONMENT_KINDS.has(environment?.kind) ? environment.kind : "other",
        sources: [...new Set(windows.map((window) => normalizeSource(window?.source)).filter(Boolean))].slice(0, 4),
        from: dates[0] || "",
        to: dates.at(-1) || "",
        unique_sessions: nonNegativeInt(environment?.unique_sessions),
      };
    }),
  };
}

export function assertPrivacySafe(serialized) {
  const value = String(serialized || "");
  if (SECRET_PATTERNS.some((pattern) => pattern.test(value))) {
    throw new BundleError("The bundle appears to contain a credential.", "BUNDLE_SECRET_DETECTED");
  }
  if (PRIVATE_PATTERNS.some((pattern) => pattern.test(value))) {
    throw new BundleError("The bundle appears to contain a path, URL, or email address.", "BUNDLE_PRIVATE_DATA_DETECTED");
  }
}

function sanitizeObservations(value) {
  const observations = isObject(value) ? clone(value) : {};
  const serialized = JSON.stringify(observations);
  if (Buffer.byteLength(serialized) > 24_000) throw new BundleError("One session observation is too large.");
  if (depth(observations) > 6) throw new BundleError("One session observation is nested too deeply.");
  assertPrivacySafe(serialized);
  return observations;
}

function normalizeProjectKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^git@([^:]+):/, "$1/")
    .replace(/^https?:\/\//, "")
    .replace(/\.git$/, "")
    .replace(/[?#].*$/, "")
    .split("/")
    .slice(-2)
    .join("/");
}

function normalizeSource(value) {
  const source = String(value || "").trim().toLowerCase();
  return SOURCE_VALUES.has(source) ? source : "";
}

function digest(value) {
  const candidate = String(value || "").trim().toLowerCase();
  return /^[a-f0-9]{64}$/.test(candidate) ? candidate : "";
}

function clean(value, max) {
  return String(value || "").trim().slice(0, max);
}

function cleanStrings(value, limit, max) {
  return array(value).map((item) => clean(item, max)).filter(Boolean).slice(0, limit);
}

function nonNegativeInt(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.trunc(number)) : 0;
}

function positiveInt(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.trunc(number) : null;
}

function date(value) {
  const candidate = String(value || "").slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(candidate) && Number.isFinite(Date.parse(candidate))
    ? candidate
    : "";
}

function iso(value) {
  const parsed = Date.parse(String(value || ""));
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : "";
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function isObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function clone(value) {
  return structuredClone(value);
}

function depth(value, level = 0) {
  if (value == null || typeof value !== "object") return level;
  return Math.max(level, ...Object.values(value).map((item) => depth(item, level + 1)));
}
