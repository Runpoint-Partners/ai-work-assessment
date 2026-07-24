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
} from "../src/validate.js";
import { freshness } from "../bin/cli.mjs";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures", "profile-v6.html");
const fixtureHtml = readFileSync(FIXTURE, "utf8");

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
