# Bookshelf

Every **folder** is a **shelf**. Put one Markdown file in it (`books.md`, `index.md`, `README.md` or `shelf.md` — otherwise the first `.md` alphabetically). The website at https://yahya-bookshelf.vercel.app re-reads this repo about once a minute, so a push shows up on the site without redeploying.

- Folders sort by name; a numeric prefix sets the order and is hidden: `01-Poetry`, `02-Philosophy`.
- The shelf title is the folder name (`Machine-Learning` → "Machine Learning") unless the file sets `title:`.
- Top-level files and folders starting with `.` are ignored.

## Shelf file

```md
---
title: Diwan & Poetry        # optional, overrides the folder name
arabic: دیوان و ادب          # optional, script label on the shelf
plinth: Rukn al-Adab         # optional, plaque on the shelf edge
bookend: brass               # optional: brass | wood (default wood)
---

## Divan of Hafez
- author: Khwaja Hafez Shirazi
- subtitle: The Celebrated Lyric Ghazals
- cover: cinnabar

Free text under a heading becomes the book's "Subject" in the popup.
```

Each `## Heading` is one book. **Only the heading is required**; everything else is optional and auto-filled (spine colour, size and cover style are picked from the title).

| Field | Meaning |
|---|---|
| `author` | Author (popup + tooltip) |
| `subtitle` | Tooltip/popup subtitle |
| `arabic` | Arabic/Persian title shown big on the cover |
| `authorArabic` | Arabic/Persian author name |
| `subject` | Subject line (or just write a paragraph) |
| `school`, `date`, `edition` | Small details row |
| `link` | `https://…` URL. Clicking the cover in the popup opens it in a new tab (e.g. your notes) |
| `binding` | "Bound in …" footer |
| `cover` | Colour: `cinnabar` `lapis` `malachite` `saffron` `onyx` `plum` `terracotta` `teal` `umber` `dual` |
| `spine` | Text printed on the spine (default: the title, shortened) |
| `size` | `big` for a large tome |
| `format` | `flat` lays the book horizontally in a pile at the right end of the shelf |

If this repo is empty or unreachable the site shows its built-in sample shelves.
