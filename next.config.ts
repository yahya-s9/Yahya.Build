import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Devpost project thumbnails: the projects page asks /_next/image for 750px versions of the
  // full-size originals (Devpost itself only offers 333px or full size).
  images: {
    remotePatterns: [new URL("https://d112y698adiu2z.cloudfront.net/photos/production/software_thumbnail_photos/**")],
  },
  // The 3D library, the prayer-cycle homepage and the projects grid are plain pages built outside
  // Next, kept in public/library, public/prayer and public/projects. The bookshelf lives at /bookshelf.
  // yahya.build/cordoba opens the library at the Library of Cordoba.
  async redirects() {
    return [{ source: "/cordoba", destination: "/library#cordoba", permanent: false }];
  },
  async rewrites() {
    return [
      { source: "/", destination: "/prayer/index.html" },
      { source: "/library", destination: "/library/index.html" },
      { source: "/projects", destination: "/projects/index.html" },
    ];
  },
};
export default nextConfig;
