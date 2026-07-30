import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("assessment, schema, and helper versions stay explicit and synchronized", async () => {
  const contract = JSON.parse(await readFile(new URL("assessment-contract.json", root), "utf8"));
  const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  const prompt = await readFile(new URL("prompt.md", root), "utf8");
  const readme = await readFile(new URL("README.md", root), "utf8");

  assert.equal(pkg.version, contract.helperVersion);
  assert.equal(Number(pkg.version.split(".")[0]), contract.assessmentPromptVersion);
  assert.match(prompt, new RegExp(`prompt version ${contract.assessmentPromptVersion}, profile schema version ${contract.profileSchemaVersion}`));
  assert.ok(prompt.includes(`v${contract.assessmentPromptVersion}/schema-v${contract.profileSchemaVersion} contract`));
  assert.ok(prompt.includes(`"prompt_version": ${contract.assessmentPromptVersion}`));
  assert.ok(prompt.includes(`"schema_version": ${contract.profileSchemaVersion}`));
  assert.ok(!prompt.includes(`v${contract.minimumCompatiblePromptVersion}/schema-v${contract.profileSchemaVersion} contract`));
  assert.ok(readme.includes(`Assessment v${contract.assessmentPromptVersion}`));
  assert.ok(readme.includes(`helper release is **v${contract.helperVersion}**`));
  assert.ok(readme.includes(`prompt-v${contract.minimumCompatiblePromptVersion}/schema-v${contract.profileSchemaVersion} profiles remain compatible`));
});
