import { getBookcase } from "@/lib/library";

export const dynamic = "force-static";
export const revalidate = 60;

const unescape = (s = "") => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

/** The shelves, flattened for the 3D library in public/library. */
export async function GET() {
  const shelves = await getBookcase();
  const books = Object.entries(shelves).flatMap(([shelf, s]) =>
    [...s.books, ...(s.stack ?? [])].map((b) => ({
      shelf,
      title: unescape(b.info?.title ?? b.tip[0]),
      ar: b.info?.ar,
      author: b.info?.author,
      subject: b.info?.subject,
      link: b.info?.link,
      colors: [b.grad[1], b.edge, "titleColor" in b ? b.titleColor : b.labelColor],
      contents: (b.info?.toc ?? []).map((e) => ({ n: e.n, title: e.title, href: e.href, pages: [] })),
    })),
  );
  return Response.json(books);
}
