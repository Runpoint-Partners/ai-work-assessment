import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ProfileError,
  assertNoSecrets,
  parseProfileData,
  sanitizeProfile,
  validateBadgeScarcity,
  validateProfileV9,
  validateRawProfileV9,
} from "../src/validate.js";
import { freshness } from "../bin/cli.mjs";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures", "profile-v6.html");
const fixtureHtml = readFileSync(FIXTURE, "utf8");
const CURRENT_FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures", "profile-v10.sample.json");
const V9_FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures", "profile-v9.sample.json");

// Each test gets its own copy: sanitizeProfile mutates in place.
function loadFixture() {
  return parseProfileData(fixtureHtml);
}

function normalize(profile) {
  sanitizeProfile(profile);
  validateBadgeScarcity(profile);
  return profile;
}

function expectRejection(code, mutate) {
  const profile = loadFixture();
  mutate(profile);
  assert.throws(
    () => normalize(profile),
    (error) => {
      assert.ok(error instanceof ProfileError, `expected a ProfileError, got ${error}`);
      assert.equal(error.code, code);
      return true;
    },
  );
}

test("accepts the v6 fixture", async (t) => {
  await t.test("parses, sanitizes, and clears badge scarcity", () => {
    const profile = normalize(loadFixture());
    assert.equal(profile.schema_version, 8);
    assert.equal(profile.prompt_version, 6);
    assert.equal(profile.name, "Riley Okafor");
    assert.ok(profile.work_arcs.length >= 3);
  });

  await t.test("rates or explains all 14 controlled badges exactly once", () => {
    const profile = normalize(loadFixture());
    const rated = Object.values(profile.badges).flat().map((badge) => badge.tag);
    const explained = profile.badge_audit.not_awarded.map((item) => item.tag);
    const all = [...rated, ...explained];
    assert.equal(all.length, 14);
    assert.equal(new Set(all).size, 14);
  });

  await t.test("every rated badge cites work arcs that exist", () => {
    const profile = normalize(loadFixture());
    const arcIds = new Set(profile.work_arcs.map((arc) => arc.id));
    for (const badge of Object.values(profile.badges).flat()) {
      assert.ok(badge.arc_ids.length > 0, `${badge.tag} cites no arcs`);
      for (const id of badge.arc_ids) assert.ok(arcIds.has(id), `${badge.tag} cites unknown arc ${id}`);
    }
  });

  await t.test("reports a current freshness window", () => {
    const profile = loadFixture();
    assert.ok(Number.isFinite(Date.parse(profile.cadence.last_session)));
    // Relative dates, so the assertion does not rot as the fixture ages.
    const daysAgo = (days) => new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
    assert.equal(freshness({ cadence: { last_session: daysAgo(6) } }).label, "current");
    assert.equal(freshness({ cadence: { last_session: daysAgo(90) } }).label, "aging");
    assert.equal(freshness({ cadence: { last_session: daysAgo(400) } }).label, "stale");
    assert.equal(freshness({}).label, "unknown");
  });
});

test("accepts the current matching-profile fixture", () => {
  const profile = JSON.parse(readFileSync(CURRENT_FIXTURE, "utf8"));
  assert.doesNotThrow(() => validateRawProfileV9(profile));
  sanitizeProfile(profile);
  assert.doesNotThrow(() => validateProfileV9(profile));
  assert.equal(profile.schema_version, 10);
  assert.equal(profile.prompt_version, 9);
  assert.equal(profile.profile_view.agent_practice.workflow.length, 4);
  assert.equal(profile.activity_analysis.work_mix.coding_sessions, 138);
  assert.equal(profile.agent_practice.reusable_asset_coverage.sessions_scanned, 188);
  assert.ok(profile.profile_view.side_projects);
});

test("keeps accepting schema-v9 profiles under their original rules", () => {
  const profile = JSON.parse(readFileSync(V9_FIXTURE, "utf8"));
  assert.doesNotThrow(() => validateRawProfileV9(profile));
  sanitizeProfile(profile);
  assert.doesNotThrow(() => validateProfileV9(profile));
  assert.equal(profile.schema_version, 9);
  assert.ok(!("work_mix" in profile.activity_analysis) && !("side_projects" in profile.profile_view));
});

// A person who never used Codex: the harness is gone everywhere, and the
// interactive totals shrink to the remaining window.
function claudeOnly(profile) {
  const coverage = profile.activity_analysis.coverage;
  const dropped = coverage.source_windows.filter((item) => item.source === "codex").reduce((sum, item) => sum + item.sessions, 0);
  coverage.source_windows = coverage.source_windows.filter((item) => item.source !== "codex");
  coverage.shared_window_sessions = [];
  coverage.interactive_sessions -= dropped;
  profile.profile_view.agent_footprint.normalized_mix = null;
  profile.agent_practice.tool_call_coverage = profile.agent_practice.tool_call_coverage.filter((item) => item.source !== "codex");
  for (const arc of profile.work_arcs) arc.sources = arc.sources.filter((source) => source !== "codex").concat(arc.sources.includes("claude") ? [] : ["claude"]);
  if (profile.activity_analysis.work_mix) {
    profile.activity_analysis.work_mix.interactive_sessions -= dropped;
    profile.activity_analysis.work_mix.unclassified_sessions -= dropped;
  }
  return profile;
}

for (const [label, path] of [["schema-v10", CURRENT_FIXTURE], ["schema-v9", V9_FIXTURE]]) {
  test(`accepts a ${label} profile from one tool only`, () => {
    const profile = claudeOnly(JSON.parse(readFileSync(path, "utf8")));
    assert.doesNotThrow(() => validateRawProfileV9(profile));
    sanitizeProfile(profile);
    assert.doesNotThrow(() => validateProfileV9(profile));
  });
}

test("rejects a dropped tool window when that tool still appears elsewhere", () => {
  const profile = claudeOnly(JSON.parse(readFileSync(CURRENT_FIXTURE, "utf8")));
  profile.work_arcs[0].sources = ["codex"];
  validateRawProfileV9(profile);
  sanitizeProfile(profile);
  assert.throws(() => validateProfileV9(profile), (error) => error instanceof ProfileError && error.code === "PROFILE_V9_MIX_WINDOW_INVALID");
});

test("rejects one asset active in more sessions than used any asset", () => {
  const profile = JSON.parse(readFileSync(CURRENT_FIXTURE, "utf8"));
  profile.agent_practice.reusable_assets[0].active_sessions = 5000;
  validateRawProfileV9(profile);
  sanitizeProfile(profile);
  assert.throws(() => validateProfileV9(profile), (error) => error instanceof ProfileError && error.code === "PROFILE_V10_ASSET_COVERAGE_INVALID");
});

test("rejects coding and other-work sessions without tool metadata", () => {
  const profile = JSON.parse(readFileSync(CURRENT_FIXTURE, "utf8"));
  Object.assign(profile.activity_analysis.work_mix, { coding_sessions: 570, other_sessions: 0, unclassified_sessions: 0, other_kinds: [] });
  profile.agent_practice.reusable_asset_coverage.sessions_scanned = 570;
  validateRawProfileV9(profile);
  sanitizeProfile(profile);
  assert.throws(() => validateProfileV9(profile), (error) => error instanceof ProfileError && error.code === "PROFILE_V10_WORK_MIX_INVALID");
});

test("rejects a profile carrying a live credential", async (t) => {
  await t.test("flags an API key before anything is parsed", () => {
    const poisoned = fixtureHtml.replace(
      "Riley Okafor",
      "Riley Okafor sk-proj-Ab3dEfGh1jKlMn0pQrStUvWxYz123456",
    );
    assert.throws(
      () => assertNoSecrets(poisoned),
      (error) => {
        assert.equal(error.code, "PROFILE_SECRET_DETECTED");
        assert.equal(error.status, 422);
        assert.match(error.error, /API key/);
        return true;
      },
    );
  });

  await t.test("accepts the untouched fixture", () => {
    assert.doesNotThrow(() => assertNoSecrets(fixtureHtml));
  });
});

test("rejects badge-map violations", async (t) => {
  // Sanitization drops a tag that does not belong to its pillar, so a real
  // duplicate has to be pushed into the family that already owns it.
  await t.test("duplicate badge tag", () => {
    expectRejection("PROFILE_BADGE_INFLATION", (profile) => {
      profile.badges.technical_chops.push({ ...profile.badges.technical_chops[0] });
    });
  });

  await t.test("incomplete badge map", () => {
    expectRejection("PROFILE_BADGE_MAP_INCOMPLETE", (profile) => {
      profile.badge_audit.not_awarded.pop();
    });
  });

  await t.test("missing not-awarded audit", () => {
    expectRejection("PROFILE_BADGE_AUDIT_MISSING", (profile) => {
      delete profile.badge_audit;
    });
  });

  await t.test("awarded badge without a structured proof basis", () => {
    expectRejection("PROFILE_BADGE_BASIS_MISSING", (profile) => {
      delete profile.badges.technical_chops[0].proof_basis;
    });
  });

  await t.test("sub-three-star badge without a next-star requirement", () => {
    expectRejection("PROFILE_BADGE_BASIS_MISSING", (profile) => {
      const badge = Object.values(profile.badges)
        .flat()
        .find((item) => Number(item.proof_stars) < 3);
      assert.ok(badge, "fixture should contain a badge below three stars");
      badge.next_star_evidence = "";
    });
  });
});

test("rejects a file with no embedded profile data", () => {
  assert.throws(
    () => parseProfileData("<html><body>no data here</body></html>"),
    (error) => {
      assert.ok(error instanceof ProfileError);
      assert.match(error.error, /No profile data block/);
      return true;
    },
  );
});
