/**
 * Yahya's visible Devpost projects, for the projects page (public/projects).
 *
 * Read from the public Devpost profile, which only lists projects that aren't hidden, so hiding a
 * project on Devpost removes it here too. Refreshed at most every 10 minutes. If Devpost can't be
 * reached this returns { projects: [] } and the page falls back to public/projects/projects.js.
 */

export const dynamic = "force-static";
export const revalidate = 600;

const PROFILE = "https://devpost.com/yahya-s9";
const MAX_PAGES = 5;

type Project = { slug: string; name: string; description: string; link: string; thumbnail?: string };

const decode = (s: string) =>
  s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
   .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
   .replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
   .replace(/\s+/g, " ").trim();

/** Each project on the profile is a "gallery-item" card linking to devpost.com/software/<slug>. */
function parse(html: string): Project[] {
  const cards = html.split(/<div class="[^"]*\bgallery-item\b[^"]*"/).slice(1);
  return cards.flatMap((card) => {
    const link = card.match(/href="(https:\/\/devpost\.com\/software\/([^"/?#]+))"/);
    const name = card.match(/<h5>([\s\S]*?)<\/h5>/);
    if (!link || !name) return [];
    const tagline = card.match(/<p class="[^"]*\btagline\b[^"]*">([\s\S]*?)<\/p>/);
    const img = card.match(/class="software_thumbnail_image[^"]*"[^>]*\bsrc="([^"]+)"/);
    const thumbnail = img && !/thumbnail-placeholder/.test(img[1]) ? decode(img[1]) : undefined;
    return [{ slug: link[2], name: decode(name[1]), description: tagline ? decode(tagline[1]) : "", link: link[1], thumbnail }];
  });
}

export async function GET() {
  const projects: Project[] = [];
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await fetch(page === 1 ? PROFILE : `${PROFILE}?page=${page}`, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; yahya.build)" },
        next: { revalidate },
      });
      if (!res.ok) throw new Error(`Devpost profile ${res.status}`);
      const html = await res.text();
      const found = parse(html).filter((p) => !projects.some((q) => q.slug === p.slug));
      projects.push(...found);
      if (!found.length || !html.includes(`?page=${page + 1}`)) break;
    }
  } catch (e) {
    console.error("Devpost projects fetch failed; the page will use projects.js:", e);
    return Response.json({ projects: [] });
  }
  return Response.json({ projects });
}
