// Deterministic look for a spine: the same title always gives the same book.
const FAMILIES = [
  ["#8a2f35", "#a8484d", "#5e1d23", "#d9a3a6"],
  ["#2f4a7a", "#4a679a", "#1f3358", "#a9b9d6"],
  ["#2f6b52", "#4a8a6f", "#1d4a38", "#a8cdbb"],
  ["#b07a2a", "#cf9a45", "#7d5316", "#ecd09c"],
  ["#6a3a62", "#8a587f", "#472541", "#cfaec9"],
  ["#2f7378", "#4a9298", "#1d5156", "#a7d0d3"],
  ["#b5532f", "#d17247", "#823721", "#ecb99f"],
  ["#4e5a66", "#6b7886", "#34404b", "#bcc5cf"],
];
const STYLES = ["bands", "label", "foil", "bands", "label", "foil"] as const;
export type SpineStyle = (typeof STYLES)[number];

export function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed: number) {
  let a = seed || 1;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export type Look = { color: string; fg: string; light: boolean; style: SpineStyle; w: number; h: number };

export function lookOf(key: string, big = false, override?: string): Look {
  const r = rng(hash(key));
  const fam = FAMILIES[Math.floor(r() * FAMILIES.length)];
  const p = r();
  const color = override ?? fam[p < 0.38 ? 0 : p < 0.7 ? 2 : p < 0.88 ? 1 : 3];
  const light = luminance(color) > 0.3;
  const style = STYLES[Math.floor(r() * STYLES.length)];
  const w = big ? 72 : Math.round(38 + r() * 28);
  const h = Math.round(214 + r() * 58);
  return { color, fg: light ? "#2a2520" : "#f6efe2", light, style, w, h };
}

/** Title font size that fits the spine. */
export function titleSize(text: string, w: number, h: number, style: SpineStyle, arabic = true) {
  const room = h - (style === "label" ? 150 : 112);
  const n = Math.max(text.length, 1);
  return arabic
    ? Math.max(10, Math.min(19, w * 0.34, room / (n * 0.56)))
    : Math.max(9, Math.min(14, w * 0.26, room / (n * 0.8)));
}

// ---- the cover is derived from the spine's cloth, so the book is the same book on the shelf and in your hands ----
const mixHex = (hex: string, to: string, t: number) => {
  const a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16);
  const ch = (sh: number) => Math.round(((a >> sh) & 255) * (1 - t) + ((b >> sh) & 255) * t);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
};

export type CoverTheme = { base: string; deep: string; spine: [string, string, string]; gold: string; hi: string; shape: "arch" | "stepped" | "oval"; light: boolean };

export function coverTheme(look: Look): CoverTheme {
  const c = look.color;
  return {
    base: c,
    deep: mixHex(c, "#000000", 0.66),
    spine: [mixHex(c, "#000000", 0.72), mixHex(c, "#000000", 0.28), mixHex(c, "#000000", 0.78)],
    gold: "#e0bd62",
    hi: "#fff0c4",
    shape: look.style === "label" ? "stepped" : look.style === "foil" ? "oval" : "arch",
    light: look.light,
  };
}
