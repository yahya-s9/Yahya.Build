import { BOOKCASE, type Shelf } from "@/data/bookcase";
import { parseShelf } from "./parse";

const REPO = process.env.BOOKSHELF_REPO ?? "yahya-s9/Bookshelf";
const REVALIDATE = 60; // seconds: how stale the live site may be after you push

const ghHeaders = (): HeadersInit => ({
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
});

const PREFERRED = /^(index|readme|books|shelf)\.md$/i;

async function fetchFromGitHub(): Promise<Record<string, Shelf>> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/git/trees/HEAD?recursive=1`, {
    headers: ghHeaders(), next: { revalidate: REVALIDATE },
  });
  if (!res.ok) throw new Error(`GitHub tree ${res.status}`);
  const { tree } = (await res.json()) as { tree: { path: string; type: string }[] };

  // folder -> its markdown file (prefer index/readme/books/shelf.md, else first alphabetically)
  const byFolder = new Map<string, string[]>();
  for (const n of tree) {
    const m = n.type === "blob" && n.path.match(/^([^/.][^/]*)\/([^/]+\.md)$/i);
    if (m) byFolder.set(m[1], [...(byFolder.get(m[1]) ?? []), n.path]);
  }
  const folders = [...byFolder.keys()].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const parsed = await Promise.all(
    folders.map(async (folder) => {
      const files = byFolder.get(folder)!.sort();
      const file = files.find((p) => PREFERRED.test(p.split("/")[1])) ?? files[0];
      const raw = await fetch(
        `https://raw.githubusercontent.com/${REPO}/HEAD/${file.split("/").map(encodeURIComponent).join("/")}`,
        { next: { revalidate: REVALIDATE } },
      );
      if (!raw.ok) throw new Error(`GitHub raw ${raw.status} for ${file}`);
      return parseShelf(folder, await raw.text());
    }),
  );

  // Auto "Sec." ranges for shelves that don't set one
  let n = 0;
  return Object.fromEntries(
    parsed.map(([name, shelf]) => {
      const start = n + 1;
      n += shelf.books.length + (shelf.stack?.length ?? 0);
      return [name, { ...shelf, sec: shelf.sec ?? (n >= start ? `Sec. ${String(start).padStart(2, "0")}–${String(n).padStart(2, "0")}` : undefined) }];
    }),
  );
}

/** Live shelves from the GitHub repo; falls back to the bundled shelves if the repo is empty or unreachable. */
export async function getBookcase(): Promise<Record<string, Shelf>> {
  try {
    const shelves = await fetchFromGitHub();
    if (Object.values(shelves).some((s) => s.books.length || s.stack?.length)) return shelves;
  } catch (e) {
    console.error("Bookshelf repo fetch failed, using bundled data:", e);
  }
  return BOOKCASE;
}
