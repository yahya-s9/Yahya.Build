// ============ BOOKCASE DATA ============
// Each key of BOOKCASE is a shelf (rendered top to bottom, in key order). Add a shelf = add a key.
//   arabic: script label | sec: range label | plinth: plaque on the shelf edge
//   bookend: "brass" | "wood" (optional) | books: spine books, left to right
//   stack: optional horizontal books piled at the right end of the shelf
// Add a book = add one line to books / stack.

export type BookInfo = {
  ar?: string; title?: string; subtitle?: string; author?: string; authorAr?: string;
  subject?: string; school?: string; date?: string; edition?: string; binding?: string; link?: string;
};

export type CoverKey = "cinnabar" | "lapis" | "malachite" | "saffron" | "onyx" | "plum" | "terracotta" | "teal" | "umber" | "dual";

type Common = { tip: [string, string]; cover?: CoverKey; info?: BookInfo };

export type SpineBook = Common & {
  size: string; grad: [string, string, string]; edge: string; band: string; bandH: string;
  title: string; titleColor: string; author?: string; authorColor?: string; ribbon?: string; big?: boolean;
};

export type FlatBook = Common & {
  size: string; grad: [string, string, string]; edge: string; label: string; labelColor: string;
  glyph: string; glyphColor: string; overlap?: boolean;
};

export type Shelf = {
  arabic?: string; sec?: string; plinth?: string; bookend?: "brass" | "wood";
  books: SpineBook[]; stack?: FlatBook[];
};

export type CoverTheme = { base: string; deep: string; spine: [string, string, string]; gold: string; hi: string; shape: "arch" | "stepped" | "oval" };
export const COVERS: Record<CoverKey, CoverTheme> = {
  cinnabar:   { base: '#4A151B', deep: '#1b0609', spine: ['#071710', '#103323', '#091f16'], gold: '#d4af37', hi: '#ffe8a3', shape: 'arch' },
  lapis:      { base: '#0c2b54', deep: '#02070e', spine: ['#07172e', '#0c2b54', '#051121'], gold: '#f5ca75', hi: '#ffe3a3', shape: 'stepped' },
  malachite:  { base: '#0d3822', deep: '#010804', spine: ['#03130a', '#0d3822', '#061c10'], gold: '#e3bd68', hi: '#fff0c4', shape: 'oval' },
  saffron:    { base: '#7a4613', deep: '#241101', spine: ['#3d1f04', '#7a4613', '#261202'], gold: '#f1c765', hi: '#fff0c0', shape: 'arch' },
  onyx:       { base: '#1c1c1c', deep: '#000000', spine: ['#0d0d0d', '#1c1c1c', '#080808'], gold: '#ffd700', hi: '#fff0a0', shape: 'stepped' },
  plum:       { base: '#3d1633', deep: '#0f020c', spine: ['#20081a', '#3d1633', '#170514'], gold: '#cca45b', hi: '#ebd4a4', shape: 'oval' },
  terracotta: { base: '#592212', deep: '#1c0702', spine: ['#361208', '#592212', '#240a04'], gold: '#d69f51', hi: '#f5c782', shape: 'arch' },
  teal:       { base: '#0d383b', deep: '#010d0e', spine: ['#062124', '#0d383b', '#041a1c'], gold: '#d4a953', hi: '#f5fffa', shape: 'stepped' },
  umber:      { base: '#382419', deep: '#0d0603', spine: ['#1f120a', '#382419', '#140b05'], gold: '#cca056', hi: '#fff5e3', shape: 'oval' },
  dual:       { base: '#4a1318', deep: '#1f0507', spine: ['#0a1a10', '#173024', '#11261a'], gold: '#e2b868', hi: '#e8c37d', shape: 'arch' },
};

export const BOOKCASE: Record<string, Shelf> = {
  "Diwan & Poetry": {
    arabic: "دیوان و ادب", sec: "Sec. 01–08", plinth: "Rukn al-Adab", bookend: "brass",
    books: [
  {"size": "w-12 md:w-16 h-[255px] md:h-[290px]", "grad": ["#112440", "#1a365d", "#0f213b"], "edge": "#2b4c7e", "band": "#d4af37", "bandH": "h-1", "title": "Masnavi", "titleColor": "#ffddb3", "author": "J. RUMI", "authorColor": "#e2ba64", "ribbon": "#b91c1c", "tip": ["Masnavi-i Ma'navi", "Lapis Lazuli Morocco • Persian 1258 CE"], "cover": "cinnabar", "info": {"ar": "مثنوی معنوی", "subtitle": "The Spiritual Couplets", "author": "Mawlana Jalal al-Din Rumi", "authorAr": "مولانا جلال‌الدین رومی", "subject": "Sufi Allegory, Parable & Divine Love", "school": "Konya School", "date": "672 A.H. / 1273 C.E.", "edition": "Six Daftars", "binding": "Lapis Lazuli Morocco"}},
  {"size": "w-11 md:w-14 h-[240px] md:h-[270px]", "grad": ["#4c0d0d", "#751a1a", "#3a0808"], "edge": "#962d2d", "band": "#e5b95a", "bandH": "h-1", "title": "Divan Hafez", "titleColor": "#ffe7b8", "tip": ["Divan of Hafez Shirazi", "Cinnabar Red Calfskin • Shiraz Gilding"], "cover": "cinnabar", "info": {"ar": "دیوانِ خواجه حافظ شیرازی", "subtitle": "The Celebrated Lyric Ghazals", "author": "Khwaja Shams-ud-Din Muhammad Hafez Shirazi", "authorAr": "خواجه شمس‌الدین محمد حافظ شیرازی", "subject": "Mystic Ghazals, Sufi Poetry & Classical Persian Lyricism", "school": "Shiraz School", "date": "792 A.H. / 1390 C.E.", "edition": "Codex Unicum", "binding": "Gilded Moroccan Leather"}},
  {"size": "w-14 md:w-20 h-[265px] md:h-[305px]", "grad": ["#0d2e20", "#144732", "#092418"], "edge": "#2d7354", "band": "#f3cb69", "bandH": "h-1.5", "title": "Shahnameh", "titleColor": "#ffebbe", "author": "FERDOWSI", "authorColor": "#e0b968", "ribbon": "#d97706", "big": true, "tip": ["Shahnameh (The Book of Kings)", "Malachite Leather • 72 Miniature Plates"], "cover": "onyx", "info": {"ar": "شاهنامه فردوسی", "subtitle": "The Epic of Kings", "author": "Abul-Qasim Ferdowsi", "authorAr": "ابوالقاسم فردوسی", "subject": "Heroic Epic of Persia's Kings & Legends", "school": "Tus Edition", "date": "400 A.H. / 1010 C.E.", "edition": "72 Miniature Plates", "binding": "Malachite Leather"}},
  {"size": "w-10 md:w-13 h-[230px] md:h-[260px]", "grad": ["#6e460d", "#945f14", "#573507"], "edge": "#bf8428", "band": "#ffd580", "bandH": "h-1", "title": "Gulistan", "titleColor": "#fff1cc", "author": "SA'DI", "authorColor": "#ffe29a", "tip": ["Gulistan of Sa'di", "Saffron-dyed Vellum • Rosewater Ink"], "cover": "lapis", "info": {"ar": "گلستانِ سعدی", "subtitle": "The Rose Garden", "author": "Sheikh Muslih-ud-Din Sa'di", "authorAr": "شیخ مصلح‌الدین سعدی", "subject": "Moral Tales, Aphorisms & Verse", "school": "Shiraz School", "date": "656 A.H. / 1258 C.E.", "edition": "Eight Chapters", "binding": "Saffron-dyed Vellum"}},
  {"size": "w-9 md:w-12 h-[220px] md:h-[250px]", "grad": ["#592314", "#7d321d", "#45190d"], "edge": "#ad4d31", "band": "#fcd385", "bandH": "h-0.5", "title": "Rubaiyat", "titleColor": "#fed7aa", "tip": ["Rubaiyat", "Omar Khayyam • Quatrains of Wine and Wonder"], "cover": "teal", "info": {"ar": "رباعیاتِ خیام", "subtitle": "Quatrains of Wine and Wonder", "author": "Omar Khayyam of Nishapur", "authorAr": "عمر خیام نیشابوری", "subject": "Metaphysical Quatrains", "school": "Khurasan School", "date": "c. 517 A.H. / 1123 C.E."}},
  {"size": "w-10 md:w-13 h-[245px] md:h-[275px]", "grad": ["#211812", "#33251c", "#18110b"], "edge": "#574030", "band": "#d4af37", "bandH": "h-1", "title": "Mantiq al-Tayr", "titleColor": "#f5ebd9", "author": "ATTAR", "authorColor": "#c7af85", "tip": ["Mantiq al-Tayr", "The Conference of the Birds • Farid ud-Din Attar"], "cover": "saffron", "info": {"ar": "منطق الطیر", "subtitle": "The Conference of the Birds", "author": "Farid ud-Din Attar", "authorAr": "فرید‌الدین عطار", "subject": "Allegorical Flight of the Soul", "school": "Nishapur School", "date": "573 A.H. / 1177 C.E."}},
  {"size": "w-9 md:w-12 h-[235px] md:h-[260px]", "grad": ["#3e1322", "#591b31", "#2c0b17"], "edge": "#7a2e4b", "band": "#e5b95a", "bandH": "h-0.5", "title": "Layla Majnun", "titleColor": "#fed7aa", "author": "NIZAMI", "authorColor": "#c7af85", "tip": ["Layla &amp; Majnun", "Crimson Moroccan Leather • Romance of Majnun"], "cover": "plum", "info": {"ar": "لیلی و مجنون", "subtitle": "Romance of Majnun", "author": "Nizami Ganjavi", "authorAr": "نظامی گنجوی", "subject": "Tragic Romance & Mystic Love", "school": "Ganja School", "date": "584 A.H. / 1188 C.E.", "binding": "Crimson Moroccan Leather"}},
  ],
    stack: [
  {"size": "w-36 h-8", "grad": ["#2b1f14", "#453221", "#1c130b"], "edge": "#674b33", "label": "Bustan • Sa'di", "labelColor": "#e8d5be", "glyph": "❖", "glyphColor": "#c5a059", "tip": ["Bustan", "The Orchard • Sa'di"], "cover": "umber", "info": {"ar": "بوستان", "subtitle": "The Orchard", "author": "Sheikh Muslih-ud-Din Sa'di", "authorAr": "شیخ مصلح‌الدین سعدی", "subject": "Ethics, Justice & Mercy in Verse", "school": "Shiraz School", "date": "655 A.H. / 1257 C.E."}},
  {"size": "w-40 h-9", "grad": ["#102a24", "#1a4037", "#0c1f1b"], "edge": "#2e6255", "label": "Khamseh • Nizami", "labelColor": "#a7f3d0", "glyph": "✦", "glyphColor": "#f59e0b", "overlap": true, "tip": ["Khamseh", "The Quintet • Nizami Ganjavi"], "cover": "malachite", "info": {"ar": "خمسه", "subtitle": "The Quintet", "author": "Nizami Ganjavi", "authorAr": "نظامی گنجوی", "subject": "Five Epic Poems", "school": "Ganja School", "date": "6th c. A.H. / 12th c. C.E.", "edition": "Five Masnavis"}},
  {"size": "w-44 h-11", "grad": ["#4a1515", "#6e2222", "#360e0e"], "edge": "#9e3a3a", "label": "Tuhfat al-Ahrar", "labelColor": "#fed7aa", "glyph": "۞", "glyphColor": "#fcd34d", "overlap": true, "tip": ["Tuhfat al-Ahrar", "Gift of the Noble • Jami"], "cover": "dual", "info": {"ar": "تحفة الأحرار", "subtitle": "Gift of the Noble", "author": "Nur ud-Din Abd al-Rahman Jami", "authorAr": "نورالدین عبدالرحمن جامی", "subject": "Ethical & Mystical Masnavi", "school": "Herat School", "date": "886 A.H. / 1481 C.E."}},
  ],
  },
  "Philosophy & Hikmah": {
    arabic: "حکمت و فلسفه", sec: "Sec. 09–16", plinth: "Rukn al-Hikmah",
    books: [
  {"size": "w-14 md:w-20 h-[270px] md:h-[305px]", "grad": ["#0d1f36", "#163054", "#0a1728"], "edge": "#2d5287", "band": "#ecc46c", "bandH": "h-1.5", "title": "Al-Qanun", "titleColor": "#ffddb3", "author": "IBN SINA", "authorColor": "#e2ba64", "ribbon": "#059669", "big": true, "tip": ["The Canon of Medicine", "Persian Calfskin • Gilded Anatomical Codices"], "cover": "plum", "info": {"ar": "القانون في الطب", "subtitle": "Canon of Medicine", "author": "Abu Ali Ibn Sina (Avicenna)", "authorAr": "أبو علي ابن سينا", "subject": "Unani Medicine & Anatomy", "school": "Hamadan School", "date": "c. 1025 C.E.", "edition": "Five Books", "binding": "Persian Calfskin"}},
  {"size": "w-12 md:w-16 h-[255px] md:h-[285px]", "grad": ["#42121e", "#631f2f", "#2f0c15"], "edge": "#8c3246", "band": "#ecc46c", "bandH": "h-1", "title": "Al-Shifa", "titleColor": "#fed7aa", "tip": ["Kitab al-Shifa", "The Book of Healing • Ibn Sina"], "cover": "cinnabar", "info": {"ar": "كتاب الشفاء", "subtitle": "The Book of Healing", "author": "Abu Ali Ibn Sina (Avicenna)", "authorAr": "أبو علي ابن سينا", "subject": "Logic, Natural Science & Metaphysics", "date": "c. 1027 C.E."}},
  {"size": "w-11 md:w-15 h-[245px] md:h-[275px]", "grad": ["#7a4e0c", "#a36914", "#5e3b07"], "edge": "#cc8b2d", "band": "#fff0be", "bandH": "h-1", "title": "Al-Ishraq", "titleColor": "#fff8e1", "author": "SUHRAWARDI", "authorColor": "#ffe699", "tip": ["Hikmat al-Ishraq", "Philosophy of Illumination • Suhrawardi"], "cover": "saffron", "info": {"ar": "حكمة الإشراق", "subtitle": "Philosophy of Illumination", "author": "Shihab al-Din Suhrawardi", "authorAr": "شهاب‌الدین سهروردی", "subject": "Illuminationist Philosophy", "date": "582 A.H. / 1186 C.E."}},
  {"size": "w-10 md:w-13 h-[230px] md:h-[260px]", "grad": ["#2c1d13", "#452f20", "#20150d"], "edge": "#694833", "band": "#d4af37", "bandH": "h-0.5", "title": "Tahafut", "titleColor": "#e2d9ca", "author": "AL-GHAZALI", "authorColor": "#bcaaa4", "tip": ["Tahafut al-Falasifa", "The Incoherence of the Philosophers • Al-Ghazali"], "cover": "umber", "info": {"ar": "تهافت الفلاسفة", "subtitle": "The Incoherence of the Philosophers", "author": "Abu Hamid al-Ghazali", "authorAr": "أبو حامد الغزالي", "subject": "Critique of Philosophy & Theology", "school": "Baghdad", "date": "c. 488 A.H. / 1095 C.E."}},
  {"size": "w-10 md:w-14 h-[225px] md:h-[255px]", "grad": ["#103426", "#1a4f3b", "#0c271c"], "edge": "#317d60", "band": "#ecc46c", "bandH": "h-1", "title": "Hayy Yaqzan", "titleColor": "#d1fae5", "author": "IBN TUFAYL", "authorColor": "#6ee7b7", "tip": ["Hayy Ibn Yaqzan", "Living, Son of Awake • Ibn Tufayl"], "cover": "malachite", "info": {"ar": "حي بن يقظان", "subtitle": "Living, Son of Awake", "author": "Ibn Tufayl", "authorAr": "ابن طفيل", "subject": "Philosophical Allegory of Reason", "school": "Andalusia", "date": "12th c. C.E."}},
  {"size": "w-13 md:w-18 h-[260px] md:h-[295px]", "grad": ["#6e2b18", "#943b22", "#541f11"], "edge": "#c25a3c", "band": "#fcd385", "bandH": "h-1.5", "title": "Muqaddimah", "titleColor": "#ffedd5", "author": "IBN KHALDUN", "authorColor": "#fcd34d", "ribbon": "#1e3a8a", "big": true, "tip": ["The Muqaddimah (Prolegomena)", "Tunis Calfskin • Historiographical Masterpiece"], "cover": "terracotta", "info": {"ar": "مقدمة ابن خلدون", "subtitle": "An Introduction to History", "author": "Abd al-Rahman Ibn Khaldun", "authorAr": "عبد الرحمن بن خلدون", "subject": "Philosophy of History & Society", "school": "Tunis & Cairo", "date": "779 A.H. / 1377 C.E."}},
  {"size": "w-11 md:w-14 h-[240px] md:h-[268px]", "grad": ["#17253a", "#243a5b", "#121c2d"], "edge": "#3b5b8c", "band": "#e5b95a", "bandH": "h-1", "title": "Fasl al-Maqal", "titleColor": "#e0e7ff", "author": "IBN RUSHD", "authorColor": "#a5b4fc", "tip": ["Fasl al-Maqal", "The Decisive Treatise • Ibn Rushd (Averroes)"], "cover": "lapis", "info": {"ar": "فصل المقال", "subtitle": "The Decisive Treatise", "author": "Ibn Rushd (Averroes)", "authorAr": "ابن رشد", "subject": "Harmony of Reason and Revelation", "school": "Cordoba", "date": "c. 1179 C.E."}},
    ],
  },
  "Machine Learning": {
    arabic: "تعلّم الآلة", sec: "Sec. 17–24", plinth: "Rukn al-Ta'allum",
    books: [
      {"size": "w-12 md:w-16 h-[250px] md:h-[280px]", "grad": ["#0d2e2e", "#145050", "#092424"], "edge": "#2d7373", "band": "#e5b95a", "bandH": "h-1", "title": "Train Your Model", "titleColor": "#d1fae5", "author": "J. AUSTIN", "authorColor": "#e2ba64", "tip": ["How to Train Your Model", "Jacob Austin"], "cover": "onyx", "info": {"subtitle": "A Practitioner's Guide", "author": "Jacob Austin", "subject": "Machine Learning"}},
    ],
  },
};
