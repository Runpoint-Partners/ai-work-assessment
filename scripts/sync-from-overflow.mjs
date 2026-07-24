#!/usr/bin/env node
// Deterministic vendoring of the four shared modules from the Overflow site.
//
// SOURCE-OF-TRUTH POLICY
// ----------------------
// The Overflow repository (../overflow-atx by default) is upstream for
// validate, render, artifacts, and curves. Those four files in src/ are
// generated, not authored: fix bugs upstream, then re-run this script. Anything
// else in src/ (config.js, storage.js) is authored here and never touched.
//
// De-branding is expressed below as an ordered list of exact literal or regex
// replacements with a required occurrence count. If upstream edits a line a
// transform depends on, the count stops matching and the sync fails loudly
// instead of silently shipping a half-de-branded file.
//
//   node scripts/sync-from-overflow.mjs            # rewrite src/ + SYNC-MANIFEST.json
//   node scripts/sync-from-overflow.mjs --check    # exit 1 on drift, write nothing
//   node scripts/sync-from-overflow.mjs --source /path/to/overflow-atx

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = join(REPO_ROOT, "SYNC-MANIFEST.json");

const BANNER = (source) => `// Vendored from the Overflow site: ${source}
// GENERATED FILE — do not edit by hand. Fix it upstream, then run:
//   node scripts/sync-from-overflow.mjs
// De-branding transforms and integrity hashes live in SYNC-MANIFEST.json.
`;

const CONFIG_IMPORT = `import { config } from "./config.js";\n`;

const MODULES = [
  {
    target: "src/validate.js",
    source: "functions/api/_assessment_validate.js",
    // Only change: the one import is inlined so the validator has zero deps.
    transforms: [
      {
        note: "inline the clean() helper from _db.js",
        find: 'import { clean } from "./_db.js";',
        replace: `// Inlined from upstream functions/api/_db.js so this module has no imports.
function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}`,
        count: 1,
      },
    ],
  },
  {
    target: "src/render.js",
    source: "functions/api/_profile_document.js",
    transforms: [
      {
        note: "route the hardcoded site URL through config",
        find: 'const SITE_URL = "https://austin.overflowbuilders.com";',
        replace: CONFIG_IMPORT.trim(),
        count: 1,
      },
      {
        note: "generic fallback display name",
        find: 'const name = text(safeProfile.name) || "Overflow member";',
        replace: 'const name = text(safeProfile.name) || "Unnamed practitioner";',
        count: 1,
      },
      {
        note: "configurable document title",
        find: '<title>${escapeHtml(name)} — Overflow profile</title>',
        replace: '<title>${escapeHtml(name)} — ${escapeHtml(config.siteName)} profile</title>',
        count: 1,
      },
      {
        note: "replace the Overflow wordmark header with a configurable brand block",
        find: '  <a class="brand" href="${SITE_URL}/"><span>O</span> Overflow / Austin</a>',
        replace: "  ${brandMark()}",
        count: 1,
      },
      {
        note: "attestation copy names no operator",
        find: "Structured profile submitted by its owner. Overflow validates and normalizes the payload, but does not independently verify claims derived from local source history.",
        replace: "Structured profile submitted by its owner. The payload is validated and normalized; claims derived from local source history are not independently verified.",
        count: 1,
      },
      {
        note: "cohort placeholder becomes opt-in",
        find: "  ${COHORT_GATE}",
        replace: "  ${cohortGate()}",
        count: 1,
      },
      {
        note: "configurable footer",
        find: '<footer><span><b>O</b>VERFLOW / AUSTIN</span><a href="${SITE_URL}/profile/">Manage profile</a></footer>',
        replace: "${footer()}",
        count: 1,
      },
      {
        note: "accent color comes from config",
        find: "--hot:#ff4d00;color-scheme:dark",
        replace: "--hot:${config.accentColor};color-scheme:dark",
        count: 1,
      },
      {
        note: "STYLES must interpolate config, so make it a getter",
        find: "const STYLES = `\n:root{",
        replace: "const styles = () => `\n:root{",
        count: 1,
      },
      {
        note: "use the STYLES getter",
        find: "<style>${STYLES}</style>",
        replace: "<style>${styles()}</style>",
        count: 1,
      },
      {
        note: "replace the Overflow cohort gate with a configurable, opt-in block",
        find: /const COHORT_GATE = `<!-- overflow-cohort-gate:start -->[\s\S]*?<!-- overflow-cohort-gate:end -->`;/,
        replace: `// Rendered only when a deployment actually adds an aggregate, unnamed cohort
// comparison after submission. A purely local run never mentions a cohort.
function cohortGate() {
  if (!config.cohortComparison) return "";
  return \`<!-- assessment-cohort-gate:start -->
<section class="section" id="cohort-gate" data-assessment-cohort-gate>
  <div class="section-head"><span>After submission</span><h2>Aggregate cohort comparison is loading.</h2></div>
</section>
<!-- assessment-cohort-gate:end -->\`;
}

function brandMark() {
  const name = escapeHtml(config.siteName);
  const initial = escapeHtml(config.siteName.trim().charAt(0).toUpperCase() || "A");
  const mark = \`<span>\${initial}</span> \${name}\`;
  return config.siteUrl
    ? \`<a class="brand" href="\${escapeHtml(config.siteUrl)}">\${mark}</a>\`
    : \`<span class="brand">\${mark}</span>\`;
}

function footer() {
  const links = (Array.isArray(config.footerLinks) ? config.footerLinks : [])
    .filter((link) => link && link.href && link.label)
    .map((link) => \`<a href="\${escapeHtml(link.href)}">\${escapeHtml(link.label)}</a>\`)
    .join("");
  return \`<footer><span>\${escapeHtml(config.siteName.toUpperCase())}</span>\${links}</footer>\`;
}`,
        count: 1,
      },
    ],
  },
  {
    target: "src/artifacts.js",
    source: "functions/api/_profile_artifacts.js",
    transforms: [
      // Upstream strips an operator-specific alternate viewer lens from uploaded
      // HTML. A v6 profile carries a single community lens, so the standalone
      // tool drops that vendor-specific handling and keeps the generic lens
      // stripping. These transforms match the upstream identifiers structurally
      // so no operator name is reproduced here.
      {
        note: "drop the vendor-specific lens-block regex",
        find: /const [A-Z]+_LENS_BLOCK_RE = .*\n/,
        replace: "",
        count: 1,
      },
      {
        note: "drop the vendor-specific lens-block strip",
        find: /\s*\.replace\([A-Z]+_LENS_BLOCK_RE, ""\)\n/,
        replace: "\n",
        count: 1,
      },
      {
        note: "drop the vendor-specific lens label scrub",
        find: /\s*\.replace\(\/[A-Za-z]+ staffing lens\/gi, ""\)\n/,
        replace: "\n",
        count: 1,
      },
      {
        note: "rename the lens-removal helper",
        find: /remove[A-Z][a-z]+Lens\b/g,
        replace: "removeAlternateLenses",
        count: 2,
      },
      {
        note: "namespace the injected markup",
        find: /ovf-/g,
        replace: "awa-",
        count: 0, // count 0 means "at least one"; the prefix appears throughout
      },
      {
        note: "rename the injected style block id",
        find: /overflow-operator-profile-styles/g,
        replace: "assessment-profile-styles",
        count: 2,
      },
      {
        note: "match the cohort-gate marker emitted by the generic prompt",
        find: /overflow-cohort-gate/g,
        replace: "assessment-cohort-gate",
        count: 2,
      },
      {
        note: "share-card eyebrow uses the configured name",
        find: ">OVERFLOW / AI WORK PROFILE</text>",
        replace: ">${escapeHtml(config.siteName.toUpperCase())} / AI WORK PROFILE</text>",
        count: 1,
      },
      {
        note: "share-card footer uses the configured line",
        find: ">OVERFLOWBUILDERS.COM</text>",
        replace: ">${escapeHtml(config.shareCardFooter)}</text>",
        count: 1,
      },
      {
        note: "share-card title drops the brand",
        find: "} — Overflow evidence-backed AI work profile</title>",
        replace: "} — evidence-backed AI work profile</title>",
        count: 1,
      },
      {
        note: "badge definitions link is optional",
        find: '<a href="/badges/">Definitions &amp; thresholds →</a>',
        replace: "${badgeDocsLink()}",
        count: 1,
      },
      {
        note: "generic download filenames",
        find: "-overflow-proof-card.png",
        replace: "-proof-card.png",
        count: 1,
      },
      {
        note: "generic default download filename",
        find: "'overflow-operator-engineer.png'",
        replace: "'ai-work-assessment-proof-card.png'",
        count: 1,
      },
      {
        note: "import config and add the optional-link helper",
        find: "export function injectOperatorProfileArtifacts(",
        replace: `function badgeDocsLink() {
  return config.badgesUrl
    ? \`<a href="\${escapeHtml(config.badgesUrl)}">Definitions &amp; thresholds →</a>\`
    : "";
}

export function injectOperatorProfileArtifacts(`,
        count: 1,
      },
      { note: "config import", find: "PREPEND_CONFIG_IMPORT", replace: "", count: 0, prepend: CONFIG_IMPORT },
    ],
  },
  {
    target: "src/curves.js",
    source: "functions/api/_public_benchmark_curves.js",
    transforms: [
      {
        note: "document the minimum-coverage floor",
        find: "const MIN_PUBLIC_COVERAGE = 8;",
        replace: `// Minimum-coverage floor. A metric is published as a density shape only once at
// least this many schema-compatible profiles report it; below the floor it is
// listed under \`pending\` with no shape, no count, and no extrema. This is what
// keeps a small cohort from being re-identifiable, so do not lower it.
const MIN_PUBLIC_COVERAGE = 8;`,
        count: 1,
      },
      {
        note: "placement guidance names no operator",
        find: 'placement: "Map the local value onto the fixed domain using the declared scale; never send the local value to Overflow.",',
        replace: 'placement: "Map the local value onto the fixed domain using the declared scale; never send the local value upstream.",',
        count: 1,
      },
      {
        note: "generic schema identifier",
        find: 'schema: "overflow-public-benchmark-curves",',
        replace: 'schema: "ai-work-assessment-benchmark-curves",',
        count: 1,
      },
      {
        note: "state plainly that this is an aggregate, unnamed comparison",
        find: 'disclosure: "Empirical density shapes',
        replace: 'disclosure: "An aggregate, unnamed cohort comparison. Empirical density shapes',
        count: 1,
      },
    ],
  },
];

function applyTransforms(source, transforms, label) {
  let output = source;
  let prefix = "";
  for (const transform of transforms) {
    if (transform.prepend) {
      prefix += transform.prepend;
      continue;
    }
    const before = output;
    if (transform.find instanceof RegExp) {
      const matches = output.match(transform.find);
      const found = matches ? (transform.find.flags.includes("g") ? matches.length : 1) : 0;
      assertCount(found, transform, label);
      output = output.replace(transform.find, transform.replace);
    } else {
      const found = output.split(transform.find).length - 1;
      assertCount(found, transform, label);
      output = output.split(transform.find).join(transform.replace);
    }
    if (output === before && transform.replace !== "") {
      throw new Error(`${label}: transform "${transform.note}" changed nothing`);
    }
  }
  return prefix + output;
}

function assertCount(found, transform, label) {
  const expected = transform.count;
  if (expected === 0 ? found < 1 : found !== expected) {
    throw new Error(
      `${label}: transform "${transform.note}" matched ${found} time(s), expected ${expected === 0 ? "at least 1" : expected}.\n` +
        "Upstream probably changed. Update the transform in scripts/sync-from-overflow.mjs.",
    );
  }
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function sourceRevision(sourceRoot) {
  try {
    return execFileSync("git", ["-C", sourceRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function build(sourceRoot) {
  return MODULES.map((module) => {
    const raw = readFileSync(join(sourceRoot, module.source), "utf8");
    const transformed = applyTransforms(raw, module.transforms, module.target);
    const content = BANNER(module.source) + "\n" + transformed;
    return {
      target: module.target,
      source: module.source,
      transforms: module.transforms.filter((item) => item.note !== "config import").map((item) => item.note),
      source_sha256: sha256(raw),
      sha256: sha256(content),
      content,
    };
  });
}

function main() {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const sourceIndex = args.indexOf("--source");
  const sourceRoot = resolve(
    sourceIndex === -1 ? join(REPO_ROOT, "..", "overflow-atx") : args[sourceIndex + 1],
  );

  const built = build(sourceRoot);
  const revision = sourceRevision(sourceRoot);

  if (!check) {
    for (const file of built) writeFileSync(join(REPO_ROOT, file.target), file.content);
    const manifest = {
      note: "Generated by scripts/sync-from-overflow.mjs. The Overflow repo is upstream for these files; edit them there, not here.",
      generated_at: new Date().toISOString().slice(0, 10),
      source_repo: "overflow-atx",
      source_revision: revision,
      files: built.map(({ content, ...rest }) => rest),
    };
    writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`Synced ${built.length} modules from ${sourceRoot} @ ${revision.slice(0, 8)}`);
    for (const file of built) console.log(`  ${file.target}  ${file.sha256.slice(0, 12)}`);
    return;
  }

  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
  const recorded = new Map(manifest.files.map((file) => [file.target, file]));
  const problems = [];
  for (const file of built) {
    const previous = recorded.get(file.target);
    if (!previous) {
      problems.push(`${file.target}: missing from SYNC-MANIFEST.json`);
      continue;
    }
    if (previous.sha256 !== file.sha256) {
      problems.push(`${file.target}: upstream produces different output than the manifest records`);
    }
    const onDisk = sha256(readFileSync(join(REPO_ROOT, file.target), "utf8"));
    if (onDisk !== file.sha256) {
      problems.push(`${file.target}: the vendored file on disk was hand-edited or is stale`);
    }
  }
  if (manifest.source_revision !== revision) {
    console.log(`Note: upstream is at ${revision.slice(0, 8)}, manifest records ${String(manifest.source_revision).slice(0, 8)}.`);
  }
  if (problems.length) {
    console.error("Drift detected:");
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }
  console.log(`No drift: ${built.length} vendored modules match upstream and the manifest.`);
}

main();
