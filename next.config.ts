import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // The 3D library and the prayer-cycle homepage are plain pages built outside Next,
  // kept in public/library and public/prayer. The bookshelf lives at /bookshelf.
  // yahya.build/cordoba opens the library at the Library of Cordoba.
  async redirects() {
    return [{ source: "/cordoba", destination: "/library#cordoba", permanent: false }];
  },
  async rewrites() {
    return [
      { source: "/", destination: "/prayer/index.html" },
      { source: "/library", destination: "/library/index.html" },
    ];
  },
};
export default nextConfig;
