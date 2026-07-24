#!/usr/bin/env node
// ai-work-assessment — validate and re-render an assessment report.
//
// This CLI makes no network requests. It reads a file you already have, checks
// it against the schema-8 rules, and writes HTML back to your disk.

import { readFileSync, writeFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { configure } from "../src/config.js";
import {
  MAX_BYTES,
  ProfileError,
  assertNoSecrets,
  parseProfileData,
  sanitizeProfile,
  validateBadgeScarcity,
} from "../src/validate.js";
import { renderProfileDocument } from "../src/render.js";
import { injectOperatorProfileArtifacts } from "../src/artifacts.js";
import { openJsonFileStore, slugify } from "../src/storage.js";

const USAGE = `ai-work-assessment — evidence-based AI work profiles

Usage:
  ai-work-assessment render <report.html|profile.json> [options]
  ai-work-assessment validate <report.html|profile.json> [options]

Options:
  --out <path>       Where to write the rendered HTML (render only).
                     Defaults to <input-basename>.rendered.html
  --store <path>     Also record the profile in a JSON file store. Off by
                     default; without it nothing is persisted anywhere.
  --config <path>    JSON file of branding overrides (siteName, siteUrl,
                     accentColor, shareCardFooter, badgesUrl, footerLinks).
  -h, --help         Show this message.

No subcommand contacts the network.`;

function parseArgs(argv) {
  const options = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "-h" || arg === "--help") options.help = true;
    else if (arg.startsWith("--")) options[arg.slice(2)] = argv[++index];
    else options._.push(arg);
  }
  return options;
}

// Accepts either a generated report (profile JSON embedded in a script block)
// or a bare profile JSON file.
function loadProfile(inputPath) {
  const raw = readFileSync(inputPath, "utf8");
  if (Buffer.byteLength(raw) > MAX_BYTES) {
    throw new ProfileError(`The file is larger than the ${Math.round(MAX_BYTES / 1024 / 1024)}MB limit.`);
  }
  assertNoSecrets(raw);
  if (extname(inputPath).toLowerCase() === ".json") {
    let profile;
    try {
      profile = JSON.parse(raw);
    } catch {
      throw new ProfileError("The file is not valid JSON.");
    }
    if (!Array.isArray(profile.skills) || profile.skills.length === 0) {
      throw new ProfileError("The profile has no skills data — re-run the assessment.");
    }
    return profile;
  }
  return parseProfileData(raw);
}

function normalize(profile) {
  sanitizeProfile(profile);
  validateBadgeScarcity(profile);
  return profile;
}

function applyConfigFile(path) {
  if (!path) return;
  configure(JSON.parse(readFileSync(resolve(path), "utf8")));
}

function count(value) {
  return Array.isArray(value) ? value.length : 0;
}

function daysSince(value) {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.floor((Date.now() - parsed) / 86_400_000);
}

export function freshness(profile) {
  const days = daysSince(profile?.cadence?.last_session || profile?.generated_at);
  if (days == null) return { label: "unknown", detail: "no dated last session" };
  if (days <= 45) return { label: "current", detail: `last session ${days} day(s) ago` };
  if (days <= 180) return { label: "aging", detail: `last session ${days} day(s) ago` };
  return { label: "stale", detail: `last session ${days} day(s) ago` };
}

function fieldReport(profile) {
  const badges = profile.badges || {};
  const awarded = ["technical_chops", "business_know_how", "good_judgment"].flatMap((family) =>
    (badges[family] || []).map((badge) => `${badge.tag} ${"★".repeat(badge.proof_stars)}`),
  );
  const notAwarded = (profile.badge_audit?.not_awarded || []).map((item) => item.tag);
  const fresh = freshness(profile);

  const lines = [
    `name                  ${profile.name || "(none)"}`,
    `prompt / schema       v${profile.prompt_version} / schema ${profile.schema_version}`,
    `generated             ${profile.generated_at || "(none)"} by ${profile.generated_by?.agent || "unknown"}`,
    `freshness             ${fresh.label} (${fresh.detail})`,
    "",
    `work arcs             ${count(profile.work_arcs)}`,
    `skills                ${count(profile.skills)}`,
    `tools                 ${count(profile.tools)}`,
    `domains               ${count(profile.domains)}`,
    `comparisons           ${count(profile.comparisons)}`,
    `limits                ${count(profile.limits)}`,
    "",
    `badges rated          ${awarded.length}  ${awarded.join(", ") || "(none)"}`,
    `badges not awarded    ${notAwarded.length}  ${notAwarded.join(", ") || "(none)"}`,
    `badge map complete    ${awarded.length + notAwarded.length === 14 ? "yes (14/14)" : `NO (${awarded.length + notAwarded.length}/14)`}`,
    "",
    `activity analysis     ${profile.activity_analysis ? "present" : "absent"}`,
    `interaction profile   ${count(profile.interaction_profile?.dimensions)} dimension(s)`,
    `agent practice        ${profile.agent_practice ? "present" : "absent"}`,
    `domain stamps         ${count(profile.domain_stamps?.functions)} function(s), ${count(profile.domain_stamps?.industries)} industry(ies)`,
    `career context        ${profile.career?.status || profile.subject_matter?.career_context_exposure ? "present" : "absent"}`,
  ];
  return lines.join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const [command, input] = options._;

  if (options.help || !command) {
    console.log(USAGE);
    process.exit(options.help ? 0 : 1);
  }
  if (!["render", "validate"].includes(command)) {
    console.error(`Unknown command "${command}".\n\n${USAGE}`);
    process.exit(1);
  }
  if (!input) {
    console.error(`${command} needs an input file.\n\n${USAGE}`);
    process.exit(1);
  }

  applyConfigFile(options.config);
  const inputPath = resolve(input);
  const profile = normalize(loadProfile(inputPath));

  if (command === "validate") {
    console.log(fieldReport(profile));
    console.log("\nValid: the profile satisfies the schema-8 rules.");
    return;
  }

  const html = injectOperatorProfileArtifacts(renderProfileDocument(profile));
  const outPath = resolve(
    options.out || `${basename(inputPath, extname(inputPath))}.rendered.html`,
  );
  writeFileSync(outPath, html);
  console.log(`Rendered ${profile.name || slugify(profile.name)} → ${outPath}`);

  if (options.store) {
    const store = openJsonFileStore(resolve(options.store));
    const row = store.upsert(profile);
    console.log(`Stored as "${row.slug}" in ${store.path} (${store.getAll().length} profile(s)).`);
  }
}

// Only run when invoked directly, so the tests can import the helpers above.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    if (error instanceof ProfileError) {
      console.error(`Rejected: ${error.error}`);
      process.exit(2);
    }
    console.error(error?.message || String(error));
    process.exit(1);
  }
}
