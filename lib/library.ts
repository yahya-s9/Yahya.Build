import { BOOKCASE, type ScrollItem, type Shelf } from "@/data/bookcase";
import { parseShelf, scrollFromNote } from "./parse";
import { parseToc, parseTreeUrl } from "./toc";

const REPO = process.env.BOOKSHELF_REPO ?? "yahya-s9/Bookshelf";
const REVALIDATE = 60; // seconds: how stale the live site may be after you push

const ghHeaders = (): HeadersInit => ({
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
});

const PREFERRED = /^(index|readme|books|shelf)\.md$/i;

// ---------- presented papers -> scrolls ----------
// Every note in this folder becomes a scroll in the scroll box, so presenting a new paper only means
// adding its notes there. A `format: scroll` entry in the Bookshelf repo whose `link` points at a note
// overrides it (title, author, ...). Notes with the same title count once (e.g. two notes on one paper).
const PAPERS_REPO = "yahya-s9/Yahyas-Machine-Learning-Notes";
const PAPERS_DIR = "ML Paper Reading + Reflections/presented_papers";
const PAPERS_REVALIDATE = 600; // the GitHub API allows 60 calls an hour without a token: list every 10 minutes
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// encodeURIComponent leaves ' ( ) * ! alone, and github.com errors on a raw apostrophe in a path
const encPart = (s: string) => encodeURIComponent(s).replace(/['()*!]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
const enc = (p: string) => p.split("/").map(encPart).join("/");
const sameTitle = (t: string) => t.toLowerCase().replace(/&amp;/g, "&").replace(/[^a-z0-9]+/g, "");

/** "01-29-2026; ReSim, Reliable Simulation for Autonomous Vehicles.md" -> title, "January 2026". */
function noteName(file: string) {
  const m = file.match(/^(\d{1,2})-(\d{1,2})(?:-(\d{4}))?\s*[;,]\s*(.+?)\.md$/i);
  if (!m) return { title: file.replace(/\.md$/i, ""), date: undefined };
  const title = m[4].replace(/\s*;\s*/, ": ").trim(); // file names can't hold ":", so ";" stands in for it
  const month = MONTHS[+m[1] - 1];
  return { title, date: month && m[3] ? `${month} ${m[3]}` : month };
}

async function addPresentedPapers(shelves: Record<string, Shelf>) {
  const res = await fetch(`https://api.github.com/repos/${PAPERS_REPO}/contents/${enc(PAPERS_DIR)}`, {
    headers: ghHeaders(), next: { revalidate: PAPERS_REVALIDATE },
  });
  if (!res.ok) throw new Error(`presented papers ${res.status}`);
  const files = ((await res.json()) as { name: string; type: string }[])
    .filter((f) => f.type === "file" && /\.md$/i.test(f.name))
    .map((f) => ({ ...noteName(f.name), link: `https://github.com/${PAPERS_REPO}/blob/main/${enc(`${PAPERS_DIR}/${f.name}`)}` }));

  const all = Object.values(shelves);
  const existing = all.flatMap((s) => s.scrolls ?? []);
  const seenLinks = new Set(existing.map((s) => s.info?.link));
  const seenTitles = new Set(existing.map((s) => sameTitle(s.tip[0])));
  const added: ScrollItem[] = [];
  for (const f of files) {
    if (seenLinks.has(f.link) || seenTitles.has(sameTitle(f.title))) continue;
    seenTitles.add(sameTitle(f.title));
    added.push(scrollFromNote(f.title, f.date, f.link));
  }
  if (!added.length) return;
  // they join the shelf that already holds scrolls (or the Machine Learning shelf)
  const home = all.find((s) => s.scrolls?.length) ?? shelves["Machine Learning"] ?? all[0];
  if (home) home.scrolls = [...(home.scrolls ?? []), ...added];
}

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

  const shelves = Object.fromEntries(parsed);
  await addContents(shelves);
  try {
    await addPresentedPapers(shelves);
  } catch (e) {
    console.error("Presented papers listing failed; showing the Bookshelf scrolls only:", e);
  }
  return shelves;
}

/** For books whose `link` is a GitHub folder, read that folder's README table as a table of contents. */
async function addContents(shelves: Record<string, Shelf>) {
  const books = Object.values(shelves).flatMap((s) => [...s.books, ...(s.stack ?? []), ...(s.scrolls ?? [])]);
  await Promise.all(
    books.map(async (b) => {
      const t = b.info?.link ? parseTreeUrl(b.info.link) : null;
      if (!t || !b.info) return;
      try {
        const enc = (p: string) => p.split("/").map(encodeURIComponent).join("/");
        const res = await fetch(`https://raw.githubusercontent.com/${t.owner}/${t.repo}/${t.branch}/${enc(t.dir)}/README.md`, { next: { revalidate: REVALIDATE } });
        if (!res.ok) return;
        const fileUrl = (name: string) => `https://github.com/${t.owner}/${t.repo}/blob/${t.branch}/${enc(t.dir)}/${encodeURIComponent(name)}`;
        const toc = parseToc(await res.text(), fileUrl);
        if (toc.length) b.info.toc = toc;
      } catch {
        // no contents; the book still opens
      }
    }),
  );
}

/** Live shelves from the GitHub repo; falls back to the bundled shelves if the repo is empty or unreachable. */
export async function getBookcase(): Promise<Record<string, Shelf>> {
  try {
    const shelves = await fetchFromGitHub();
    if (Object.values(shelves).some((s) => s.books.length || s.stack?.length || s.scrolls?.length)) return shelves;
  } catch (e) {
    console.error("Bookshelf repo fetch failed, using bundled data:", e);
  }
  return BOOKCASE;
}
