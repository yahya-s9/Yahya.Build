import { COVERS, type BookInfo, type CoverKey, type FlatBook, type Shelf, type SpineBook } from "@/data/bookcase";

// ---------- helpers ----------
const COVER_KEYS = Object.keys(COVERS) as CoverKey[];
const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const hash = (s: string) => [...s].reduce((h, c) => (h * 33 + c.charCodeAt(0)) >>> 0, 5381);
const pick = <T,>(list: readonly T[], seed: string, salt = 0) => list[(hash(seed) + salt) % list.length];

const SPINE_SIZES = [
  "w-9 md:w-12 h-[220px] md:h-[250px]",
  "w-10 md:w-13 h-[230px] md:h-[260px]",
  "w-11 md:w-14 h-[240px] md:h-[268px]",
  "w-12 md:w-16 h-[255px] md:h-[285px]",
  "w-10 md:w-14 h-[225px] md:h-[255px]",
];
const BIG_SIZE = "w-14 md:w-20 h-[270px] md:h-[305px]";
const FLAT_SIZES = ["w-36 h-8", "w-40 h-9", "w-44 h-11"];

// ---------- minimal markdown parsing ----------
type Fields = Record<string, string>;

const ALIASES: Record<string, string> = {
  arabic: "ar", arabictitle: "ar", authorarabic: "authorAr", authorar: "authorAr",
  color: "cover", colour: "cover", theme: "cover", url: "link", notes: "link", href: "link", spinetext: "spine", shortname: "spine",
};
const normKey = (k: string) => {
  const n = k.toLowerCase().replace(/[^a-z]/g, "");
  return ALIASES[n] ?? n;
};

/** Splits optional `---` front matter from the body. */
function frontMatter(md: string): { meta: Fields; body: string } {
  const text = md.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: text };
  const meta: Fields = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^\s*([^:#]+?)\s*:\s*(.+?)\s*$/);
    if (kv) meta[normKey(kv[1])] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { meta, body: m[2] };
}

/** `## Title` sections: `- key: value` bullets + free text (used as the subject). */
function sections(body: string) {
  const out: { title: string; fields: Fields; text: string }[] = [];
  let cur: { title: string; fields: Fields; text: string[] } | null = null;
  const flush = () => cur && out.push({ title: cur.title, fields: cur.fields, text: cur.text.join(" ").trim() });
  for (const line of body.split("\n")) {
    const h = line.match(/^##\s+(.+?)\s*#*\s*$/);
    if (h) { flush(); cur = { title: h[1].replace(/[*_`]/g, ""), fields: {}, text: [] }; continue; }
    if (!cur) continue;
    const kv = line.match(/^\s*[-*]\s+([^:]+?)\s*:\s*(.+?)\s*$/);
    if (kv) cur.fields[normKey(kv[1])] = kv[2];
    else if (line.trim() && !/^\s*[-*]\s/.test(line)) cur.text.push(line.trim());
  }
  flush();
  return out;
}

// ---------- book builders ----------
function infoFor(title: string, f: Fields, text: string): BookInfo {
  return {
    title: escapeHtml(title),
    ar: f.ar, subtitle: f.subtitle, author: f.author, authorAr: f.authorAr,
    subject: f.subject ?? (text || undefined),
    school: f.school, date: f.date, edition: f.edition, binding: f.binding,
    link: /^https?:\/\//i.test(f.link ?? "") ? f.link : undefined,
  };
}

function spineBook(title: string, f: Fields, text: string): SpineBook {
  const cover = (COVER_KEYS.includes(f.cover as CoverKey) ? f.cover : pick(COVER_KEYS, title)) as CoverKey;
  const t = COVERS[cover];
  const big = f.size?.toLowerCase() === "big";
  const spineText = f.spine ?? f.ar ?? (title.length > 16 ? title.split(/\s+/).filter((w) => !/^(of|the|and|a|an|to|al-)$/i.test(w)).slice(0, 2).join(" ") : title);
  const author = f.author?.split(/\s+/).slice(-1)[0]?.toUpperCase();
  return {
    size: big ? BIG_SIZE : pick(SPINE_SIZES, title, 1),
    grad: [t.spine[0], t.base, t.spine[2]],
    edge: t.gold, band: t.gold, bandH: big ? "h-1.5" : "h-1",
    title: spineText, titleColor: t.hi,
    ...(author && { author, authorColor: t.gold }),
    ...(big && { big: true }),
    tip: [escapeHtml(title), escapeHtml(f.subtitle ?? f.author ?? "")],
    cover, info: infoFor(title, f, text),
  };
}

function flatBook(title: string, f: Fields, text: string, i: number): FlatBook {
  const cover = (COVER_KEYS.includes(f.cover as CoverKey) ? f.cover : pick(COVER_KEYS, title)) as CoverKey;
  const t = COVERS[cover];
  return {
    size: pick(FLAT_SIZES, title, i),
    grad: [t.spine[1], t.base, t.spine[2]], edge: t.gold,
    label: f.spine ?? f.ar ?? (f.author ? `${title} • ${f.author.split(/\s+/).slice(-1)[0]}` : title),
    labelColor: t.hi, glyph: "❖", glyphColor: t.gold, overlap: i > 0,
    tip: [escapeHtml(title), escapeHtml(f.subtitle ?? f.author ?? "")],
    cover, info: infoFor(title, f, text),
  };
}

/** Folder name -> display title: "02-Machine-Learning" => "Machine Learning". */
export const folderTitle = (folder: string) =>
  folder.replace(/^\d+[-_.\s]+/, "").replace(/[-_]+/g, " ").trim();

export function parseShelf(folder: string, md: string): [string, Shelf] {
  const { meta, body } = frontMatter(md);
  const items = sections(body);
  const spines: SpineBook[] = [];
  const flats: FlatBook[] = [];
  for (const it of items) {
    if (it.fields.format?.toLowerCase() === "flat") flats.push(flatBook(it.title, it.fields, it.text, flats.length));
    else spines.push(spineBook(it.title, it.fields, it.text));
  }
  return [
    meta.title ?? folderTitle(folder),
    {
      arabic: meta.ar, plinth: meta.plinth, sec: meta.sec,
      bookend: meta.bookend === "brass" ? "brass" : "wood",
      books: spines, ...(flats.length && { stack: flats }),
    },
  ];
}
