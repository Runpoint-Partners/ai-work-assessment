import test from "node:test";
import assert from "node:assert/strict";

import { buildPublicBenchmarkCurves } from "../src/curves.js";

const MINIMUM_COVERAGE = 8;

// A synthetic cohort row in the shape the store produces.
function row(sessions, overrides = {}) {
  const profile = {
    prompt_version: 6,
    schema_version: 8,
    windows: { claude: { from: "2026-01-01", to: "2026-06-30", sessions } },
    cadence: { sessions_last_28d: sessions, active_weeks_last_12: 9 },
    ...overrides,
  };
  return { prompt_version: profile.prompt_version, schema_version: profile.schema_version, data_json: JSON.stringify(profile) };
}

function cohort(size, start = 40) {
  return Array.from({ length: size }, (_, index) => row(start + index * 17));
}

function find(list, key) {
  return list.find((item) => item.key === key);
}

test("respects the minimum-coverage floor", async (t) => {
  await t.test(`withholds a metric below N=${MINIMUM_COVERAGE}`, () => {
    const result = buildPublicBenchmarkCurves(cohort(MINIMUM_COVERAGE - 1));
    const metric = find(result.pending, "captured_agent_sessions");
    assert.ok(metric, "metric should be listed as pending");
    assert.equal(find(result.available, "captured_agent_sessions"), undefined);
    assert.equal(metric.minimum_coverage, MINIMUM_COVERAGE);
    assert.equal(metric.coverage, `<${MINIMUM_COVERAGE}`);
  });

  await t.test(`publishes a metric at exactly N=${MINIMUM_COVERAGE}`, () => {
    const result = buildPublicBenchmarkCurves(cohort(MINIMUM_COVERAGE));
    const metric = find(result.available, "captured_agent_sessions");
    assert.ok(metric, "metric should be available");
    assert.equal(metric.coverage, MINIMUM_COVERAGE);
    assert.equal(find(result.pending, "captured_agent_sessions"), undefined);
  });

  await t.test("reports no coverage at all when nobody supplies the metric", () => {
    const rows = cohort(MINIMUM_COVERAGE + 4).map((item) => {
      const profile = JSON.parse(item.data_json);
      delete profile.windows;
      return { ...item, data_json: JSON.stringify(profile) };
    });
    const metric = find(buildPublicBenchmarkCurves(rows).pending, "captured_agent_sessions");
    assert.equal(metric.coverage, "none");
  });

  await t.test("withholds metrics the cohort's schema predates", () => {
    const rows = cohort(MINIMUM_COVERAGE + 2).map((item) => ({ ...item, prompt_version: 4, schema_version: 3 }));
    const result = buildPublicBenchmarkCurves(rows);
    // GitHub metrics need prompt 5 / schema 4; these rows cannot contribute.
    assert.ok(find(result.pending, "github_active_months_12m"));
    assert.equal(find(result.available, "github_active_months_12m"), undefined);
  });
});

test("published curves are shapes, not observations", async (t) => {
  const result = buildPublicBenchmarkCurves(cohort(24));
  const metric = find(result.available, "captured_agent_sessions");

  await t.test("returns a normalized density of fixed length", () => {
    assert.equal(metric.density.length, metric.density_samples);
    assert.equal(metric.density_samples, 33);
    assert.ok(metric.density.every((value) => value >= 0 && value <= 1));
    assert.equal(Math.max(...metric.density), 1, "density is normalized to its own peak");
  });

  await t.test("uses a fixed public domain rather than the cohort's range", () => {
    assert.equal(metric.domain.fixed, true);
    assert.equal(metric.domain.minimum, 0);
    assert.equal(metric.domain.maximum, 2000);
    const wider = buildPublicBenchmarkCurves(cohort(24, 900));
    assert.deepEqual(find(wider.available, "captured_agent_sessions").domain, metric.domain);
  });

  await t.test("leaks no rows, extrema, quantiles, or identifiers", () => {
    // Scoped to the data, not the privacy note — that note names the very
    // things it withholds.
    const serialized = JSON.stringify({ available: result.available, pending: result.pending });
    for (const forbidden of ["Riley", "data_json", "quantile", "median", "minimum_value", "maximum_value"]) {
      assert.ok(!serialized.includes(forbidden), `payload leaked "${forbidden}"`);
    }
    assert.deepEqual(
      Object.keys(metric).sort(),
      [
        "caveat",
        "coverage",
        "density",
        "density_samples",
        "directional",
        "domain",
        "key",
        "label",
        "placement",
        "scale",
        "unit",
        "window",
      ],
    );
  });

  await t.test("marks a thin cohort directional", () => {
    assert.equal(find(buildPublicBenchmarkCurves(cohort(12)).available, "captured_agent_sessions").directional, true);
    assert.equal(metric.directional, false);
  });
});

test("declares the privacy contract in the payload", () => {
  const result = buildPublicBenchmarkCurves(cohort(10));
  assert.equal(result.privacy.minimum_coverage, MINIMUM_COVERAGE);
  assert.equal(result.privacy.differential_privacy, false);
  assert.match(result.privacy.disclosure, /aggregate, unnamed cohort comparison/);
  assert.doesNotMatch(result.privacy.disclosure, /anonymi[sz]ed/i);
  assert.equal(result.cohort_size, 10);
});

test("ignores rows that are not parseable profiles", () => {
  const rows = [...cohort(MINIMUM_COVERAGE), { prompt_version: 6, schema_version: 8, data_json: "{not json" }];
  const result = buildPublicBenchmarkCurves(rows);
  assert.equal(result.cohort_size, MINIMUM_COVERAGE);
});
