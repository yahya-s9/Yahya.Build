import type { NextConfig } from "next";
const nextConfig: NextConfig = {
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
