import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // The 3D library is a plain page built outside Next, kept in public/library.
  // yahya.build/cordoba opens the library at the Library of Cordoba.
  async redirects() {
    return [{ source: "/cordoba", destination: "/library#cordoba", permanent: false }];
  },
  async rewrites() {
    return [{ source: "/library", destination: "/library/index.html" }];
  },
};
export default nextConfig;
