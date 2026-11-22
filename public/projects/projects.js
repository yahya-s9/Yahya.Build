/*
 * The projects page (yahya.build/projects) lists your Devpost projects automatically: it reads your
 * public profile, devpost.com/yahya-s9, at most every 10 minutes (app/projects/devpost/route.ts).
 *   - New Devpost project       -> appears on its own.
 *   - Hidden on Devpost          -> disappears on its own.
 *   - Name, tagline, thumbnail   -> taken from Devpost; edit them there.
 *
 * This file is only for adjustments, plus a backup list.
 */

/*
 * PROJECT_OVERRIDES: change how a Devpost project appears on the site only, without touching Devpost.
 * Key = the end of its Devpost link (devpost.com/software/<this>). Any field can be overridden:
 *   name, description, link, thumbnail (e.g. "/projects/images/x.jpg"), or hidden: true to leave it off.
 */
window.PROJECT_OVERRIDES = {
  // Its Devpost tagline is three sentences; the site shows one.
  "dotprompt-supercharge-your-gpt-workflows": {
    description: "dotPrompt allows anyone to make dynamic, reusable, and shareable prompts."
  }
};

/*
 * PROJECTS: the backup list, shown only if Devpost can't be reached. Kept in step with the visible
 * Devpost projects; thumbnails are local copies in site/public/projects/images/.
 */
window.PROJECTS = [
  {
    name: "Yahya's Library",
    description: "A walkable 3D library that holds my deen and math notes from my iPad.",
    link: "https://devpost.com/software/project-vxj9smkr0qwa",
    thumbnail: "/projects/images/library.jpg"
  },
  {
    name: "SnapLens",
    description: "Frictionless AI-powered translation for social good.",
    link: "https://devpost.com/software/smartglasses",
    thumbnail: "/projects/images/snaplens.jpg"
  },
  {
    name: "Financial Document Analyzer",
    description: "Multi-document OCR pipeline for retrieval-augmented generation with an LLM.",
    link: "https://devpost.com/software/financial-document-rag-system",
    thumbnail: "/projects/images/financial-document-analyzer.jpg"
  },
  {
    name: "nodeClip",
    description: "n8n automated AI video editor.",
    link: "https://devpost.com/software/nodeclip",
    thumbnail: "/projects/images/nodeclip.jpg"
  },
  {
    name: "dotPrompt: Prompt engineering for everyone.",
    description: "dotPrompt allows anyone to make dynamic, reusable, and shareable prompts.",
    link: "https://devpost.com/software/dotprompt-supercharge-your-gpt-workflows",
    thumbnail: "/projects/images/dotprompt.jpg"
  }
];
