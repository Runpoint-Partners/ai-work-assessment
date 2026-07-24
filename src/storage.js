// Optional persistence. The tool is stateless by default: `render` reads a
// report, validates it, and writes an HTML file. Nothing is kept.
//
// A store only exists if the caller passes `--store <path>`, and the only
// implementation is a JSON file on the caller's own disk. Rows use the same
// shape the cohort-curve builder in curves.js expects, so a self-hoster who
// collects enough profiles can feed the store straight into it.

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const EMPTY = { version: 1, profiles: [] };

export function openJsonFileStore(path) {
  const read = () => {
    if (!existsSync(path)) return { ...EMPTY, profiles: [] };
    try {
      const parsed = JSON.parse(readFileSync(path, "utf8"));
      return Array.isArray(parsed?.profiles) ? parsed : { ...EMPTY, profiles: [] };
    } catch {
      throw new Error(`${path} exists but is not a readable profile store.`);
    }
  };
  const write = (state) => writeFileSync(path, `${JSON.stringify(state, null, 2)}\n`);

  return {
    path,

    getAll() {
      return read().profiles;
    },

    getBySlug(slug) {
      return read().profiles.find((row) => row.slug === slug) || null;
    },

    // Keyed by slug: re-rendering the same person replaces their row rather
    // than accumulating near-duplicates.
    upsert(profile) {
      const state = read();
      const row = toRow(profile);
      const index = state.profiles.findIndex((item) => item.slug === row.slug);
      if (index === -1) state.profiles.push(row);
      else state.profiles[index] = { ...state.profiles[index], ...row };
      write(state);
      return row;
    },
  };
}

export function toRow(profile) {
  return {
    slug: slugify(profile?.name),
    name: String(profile?.name || "").trim(),
    prompt_version: Number(profile?.prompt_version) || null,
    schema_version: Number(profile?.schema_version) || null,
    updated_at: new Date().toISOString(),
    data_json: JSON.stringify(profile),
  };
}

export function slugify(value) {
  return (
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "profile"
  );
}
