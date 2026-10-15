// Reads a note PDF from GitHub in the browser and turns its pages into images, one at a time.
// pdf.js lives in /public/pdfjs (same origin, so its worker loads); nothing is bundled.

/* eslint-disable @typescript-eslint/no-explicit-any */
let lib: Promise<any> | null = null;
const PDFJS_URL: string = "/pdfjs/pdf.min.mjs";

function pdfjs() {
  lib ??= (import(/* webpackIgnore: true */ /* turbopackIgnore: true */ PDFJS_URL) as Promise<any>).then((m) => {
    m.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
    return m;
  });
  return lib;
}

/** https://github.com/o/r/blob/branch/dir/file.pdf  ->  the raw file (which allows cross-origin reads). */
export const rawUrl = (blobUrl: string) =>
  blobUrl.replace(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\//, "https://raw.githubusercontent.com/$1/$2/");

export type NotesDoc = { pages: number; render: (n: number) => Promise<string> };

export async function openNotes(blobUrl: string): Promise<NotesDoc> {
  const [m, res] = await Promise.all([pdfjs(), fetch(rawUrl(blobUrl))]);
  if (!res.ok) throw new Error(`PDF ${res.status}`);
  const pdf = await m.getDocument({ data: new Uint8Array(await res.arrayBuffer()) }).promise;
  const cache = new Map<number, Promise<string>>();
  return {
    pages: pdf.numPages as number,
    render(n: number) {
      let hit = cache.get(n);
      if (!hit) {
        hit = (async () => {
          const page = await pdf.getPage(n);
          const viewport = page.getViewport({ scale: 1.7 });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
          return canvas.toDataURL("image/jpeg", 0.86);
        })();
        cache.set(n, hit);
      }
      return hit;
    },
  };
}
