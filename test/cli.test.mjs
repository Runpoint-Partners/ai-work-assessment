import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CLI = join(ROOT, "bin", "cli.mjs");
const FIXTURE = join(ROOT, "fixtures", "profile-v6.html");

function run(args, options = {}) {
  return execFileSync(process.execPath, [CLI, ...args], { encoding: "utf8", ...options });
}

function runExpectingFailure(args) {
  try {
    run(args);
    assert.fail("expected the CLI to exit non-zero");
  } catch (error) {
    return { status: error.status, stderr: String(error.stderr || "") };
  }
}

test("render writes a complete report", async (t) => {
  const workdir = mkdtempSync(join(tmpdir(), "awa-cli-"));
  const outPath = join(workdir, "profile.html");
  const stdout = run(["render", FIXTURE, "--out", outPath]);
  const html = readFileSync(outPath, "utf8");

  await t.test("reports where it wrote the file", () => {
    assert.match(stdout, /Riley Okafor/);
    assert.match(stdout, new RegExp(outPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });

  await t.test("contains the canonical section headings", () => {
    for (const heading of [
      "Work profile",
      "Delivery evidence",
      "Activity coverage",
      "Interaction profile",
      "How you work",
      "Agent toolkit",
      "Subject matter",
      "Project fit",
      "Sources and limits",
    ]) {
      assert.ok(html.includes(heading), `missing section heading: ${heading}`);
    }
  });

  await t.test("contains the full badge map", () => {
    assert.ok(html.includes('id="badge-map"'), "missing the not-awarded badge map");
    assert.match(html, /Operator Engineer/);
    // Every rated badge from the fixture renders as a credential card.
    for (const label of ["Production", "Shipper", "Verification", "First", "Workflow", "Architect"]) {
      assert.ok(html.includes(`<span>${label}</span>`), `missing badge label: ${label}`);
    }
    // The three unawarded badges appear with a reason and next proof.
    assert.match(html, /Why not/);
    assert.match(html, /Next proof/);
    assert.match(html, /3 of 14 not awarded or unrated/);
  });

  await t.test("re-embeds the machine-readable profile", () => {
    const match = html.match(/<script type="application\/json" id="profile-data">([\s\S]*?)<\/script>/);
    assert.ok(match, "missing the embedded profile-data block");
    const profile = JSON.parse(match[1]);
    assert.equal(profile.schema_version, 8);
    assert.equal(profile.name, "Riley Okafor");
  });

  await t.test("makes no network request and names no host", () => {
    const urls = html.match(/https?:\/\/[^\s"'<>)]+/g) || [];
    // The SVG namespace is a bare identifier, never fetched.
    assert.deepEqual([...new Set(urls)], ["http://www.w3.org/2000/svg"]);
    assert.doesNotMatch(html, /fetch\s*\(/);
    assert.doesNotMatch(html, /XMLHttpRequest/);
    assert.doesNotMatch(html, /overflowbuilders/i);
  });

  await t.test("says nothing about a cohort by default", () => {
    assert.doesNotMatch(html, /cohort/i);
    assert.doesNotMatch(html, /percentile/i);
  });
});

test("render is idempotent", () => {
  const workdir = mkdtempSync(join(tmpdir(), "awa-cli-"));
  const first = join(workdir, "one.html");
  const second = join(workdir, "two.html");
  run(["render", FIXTURE, "--out", first]);
  run(["render", first, "--out", second]);
  // Re-rendering a rendered report strips the previous artifacts and rebuilds
  // them, so the output is stable rather than doubled.
  assert.equal(readFileSync(first, "utf8"), readFileSync(second, "utf8"));
});

test("validate prints a field-level report", () => {
  const stdout = run(["validate", FIXTURE]);
  assert.match(stdout, /name\s+Riley Okafor/);
  assert.match(stdout, /prompt \/ schema\s+v6 \/ schema 8/);
  assert.match(stdout, /badge map complete\s+yes \(14\/14\)/);
  assert.match(stdout, /work arcs\s+6/);
  assert.match(stdout, /Valid: the profile satisfies the schema-8 rules\./);
});

test("rejects a report containing a live credential", () => {
  const workdir = mkdtempSync(join(tmpdir(), "awa-cli-"));
  const poisoned = join(workdir, "poisoned.html");
  writeFileSync(
    poisoned,
    readFileSync(FIXTURE, "utf8").replace("Riley Okafor", "sk-proj-Ab3dEfGh1jKlMn0pQrStUvWxYz123456"),
  );
  const { status, stderr } = runExpectingFailure(["render", poisoned]);
  assert.equal(status, 2);
  assert.match(stderr, /API key/);
});

test("--store is opt-in and keyed by slug", () => {
  const workdir = mkdtempSync(join(tmpdir(), "awa-cli-"));
  const storePath = join(workdir, "store.json");
  const outPath = join(workdir, "out.html");

  run(["render", FIXTURE, "--out", outPath]);
  assert.throws(() => readFileSync(storePath, "utf8"), /ENOENT/, "no store without --store");

  run(["render", FIXTURE, "--out", outPath, "--store", storePath]);
  run(["render", FIXTURE, "--out", outPath, "--store", storePath]);
  const store = JSON.parse(readFileSync(storePath, "utf8"));
  assert.equal(store.profiles.length, 1, "re-rendering the same person replaces their row");
  assert.equal(store.profiles[0].slug, "riley-okafor");
  assert.equal(store.profiles[0].schema_version, 8);
});

test("--config rebrands the report", () => {
  const workdir = mkdtempSync(join(tmpdir(), "awa-cli-"));
  const configPath = join(workdir, "config.json");
  const outPath = join(workdir, "branded.html");
  writeFileSync(
    configPath,
    JSON.stringify({ siteName: "Example Collective", siteUrl: "https://example.test/", accentColor: "#0055ff" }),
  );
  run(["render", FIXTURE, "--out", outPath, "--config", configPath]);
  const html = readFileSync(outPath, "utf8");
  assert.match(html, /Example Collective/);
  assert.match(html, /href="https:\/\/example\.test\/"/);
  assert.match(html, /--hot:#0055ff/);
});
