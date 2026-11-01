import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // The 3D library is a plain page built outside Next, kept in public/library.
  async rewrites() {
    return [{ source: "/library", destination: "/library/index.html" }];
  },
};
export default nextConfig;
