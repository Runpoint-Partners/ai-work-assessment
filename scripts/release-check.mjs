#!/usr/bin/env node
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("../", import.meta.url).pathname);
const upstream = resolve(process.env.OVERFLOW_ASSESSMENT_REPO || `${root}/../overflow-atx`);
const contract = await json(`${root}/assessment-contract.json`);
const pkg = await json(`${root}/package.json`);
const prompt = await text(`${root}/prompt.md`);
const sample = await json(`${root}/fixtures/profile-v9.sample.json`);
const changelog = await text(`${root}/CHANGELOG.md`);
const readme = await text(`${root}/README.md`);

check(pkg.version === contract.helperVersion, "package and helper versions match");
check(Number(pkg.version.split(".")[0]) === contract.assessmentPromptVersion, "helper major matches assessment prompt");
check(prompt.includes(`# Overflow AI Work Assessment v${contract.assessmentPromptVersion}`), "prompt heading is current");
check(prompt.includes(`profile schema ${contract.profileSchemaVersion} and prompt version ${contract.assessmentPromptVersion}`), "prompt contract is current");
check(sample.prompt_version === contract.assessmentPromptVersion && sample.schema_version === contract.profileSchemaVersion, "sample fixture is current");
check(changelog.includes(`Assessment v${contract.assessmentPromptVersion}`) && changelog.includes(`v${contract.helperVersion}`), "changelog records the release");
check(readme.includes(`Assessment v${contract.assessmentPromptVersion}`) && readme.includes(`helper release is **v${contract.helperVersion}**`), "README records the release");

if (!existsSync(upstream)) throw new Error(`Overflow upstream not found at ${upstream}. Set OVERFLOW_ASSESSMENT_REPO.`);
assert.deepEqual(contract, await json(`${upstream}/assessment-contract.json`), "upstream contract differs");
check(prompt === await text(`${upstream}/public/apply/prompt.md`), "prompt matches upstream byte for byte");

console.log(`Open-source release is ready: prompt v${contract.assessmentPromptVersion}, schema v${contract.profileSchemaVersion}, helper v${contract.helperVersion}.`);

function check(condition, label) {
  if (!condition) throw new Error(`Release check failed: ${label}.`);
  console.log(`✓ ${label}`);
}

async function text(path) {
  return readFile(path, "utf8");
}

async function json(path) {
  return JSON.parse(await text(path));
}
