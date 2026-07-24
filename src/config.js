// Single de-branding seam for the vendored rendering modules.
//
// The upstream Overflow modules hardcode a site name, URL, accent color, and
// footer links. Everything brand-specific was routed through this file so a
// self-hoster can rename the tool without touching vendored code. Defaults are
// generic on purpose: the standalone tool is not affiliated with any site.

export const defaultConfig = {
  // Shown in the report header, document title, and share card.
  siteName: "AI Work Assessment",
  // Absolute URL for the header brand link. Empty renders plain text instead of
  // a link, which is what a local file:// report should do by default.
  siteUrl: "",
  // Single accent used by the report stylesheet and the share card.
  accentColor: "#ff4d00",
  // Small caps line printed at the bottom-left of the share card.
  shareCardFooter: "AI WORK ASSESSMENT",
  // Link target for the badge definitions. Null omits the link entirely; a
  // self-hoster serving docs/badges.md can point at their published copy.
  badgesUrl: null,
  // Footer links rendered as {label, href} pairs. Empty by default.
  footerLinks: [],
  // Whether this deployment adds an aggregate, unnamed cohort comparison after
  // the profile is submitted somewhere. Off means the report never mentions a
  // cohort, which is the correct default for a purely local run.
  cohortComparison: false,
};

export const config = { ...defaultConfig };

// Mutates the shared config in place so already-imported modules observe the
// change. Call this once at startup, before rendering.
export function configure(overrides = {}) {
  for (const key of Object.keys(defaultConfig)) {
    if (overrides[key] !== undefined) config[key] = overrides[key];
  }
  return config;
}
