import type { TocEntry } from "@/data/bookcase";

/** https://github.com/o/r/tree/branch/some/dir  ->  { owner, repo, branch, dir } */
export function parseTreeUrl(url: string) {
  const m = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/(.+?)\/?$/);
  return m ? { owner: m[1], repo: m[2], branch: m[3], dir: decodeURIComponent(m[4]) } : null;
}

const cells = (line: string) =>
  line.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/).map((c) => c.trim());

const strip = (s: string) => s.replace(/`/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_]/g, "").trim();

/** A markdown link in a cell: [label](<a b.pdf>) or [label](a.pdf) -> the target. */
const linkIn = (cell: string) => cell.match(/\]\(<?([^)>]+)>?\)/)?.[1];

/**
 * Reads the first markdown table of a README as a table of contents.
 * Understands "Episode | Title | Notes" tables and "File | Chapter" tables of PDF names.
 * `fileUrl(name)` turns a file name in the notes folder into a link.
 */
export function parseToc(markdown: string, fileUrl: (name: string) => string): TocEntry[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex((l) => l.trim().startsWith("|"));
  if (start < 0) return [];
  const header = cells(lines[start]).map((h) => h.toLowerCase());
  const titleCol = header.findIndex((h) => h.includes("title"));
  const out: TocEntry[] = [];

  for (const line of lines.slice(start + 1)) {
    if (!line.trim().startsWith("|")) break;
    if (/^\|?\s*:?-{2,}/.test(line.trim())) continue;
    const c = cells(line);
    if (titleCol >= 0) {
      const title = strip(c[titleCol] ?? "");
      if (!title) continue;
      const file = c.slice(titleCol + 1).map(linkIn).find((l) => l && /\.pdf$/i.test(decodeURIComponent(l)));
      out.push({ n: strip(c[0] ?? ""), title, href: file ? fileUrl(decodeURIComponent(file)) : undefined });
    } else {
      const raw = strip(c[0] ?? "");
      if (!raw) continue;
      const isFile = /\.pdf$/i.test(raw);
      const base = raw.replace(/\.pdf$/i, "");
      const prefix = base.match(/^(\d+(?:-\d+)?)\s*-\s*/);
      const title = base.replace(/^\d+(?:-\d+)?\s*-\s*/, "").trim();
      const n = strip(c[1] ?? "") || (prefix ? prefix[1].split("-").map((x) => String(+x)).join("–") : "");
      out.push({ n, title: title || base, href: isFile ? fileUrl(raw) : undefined });
    }
  }
  return out;
}
