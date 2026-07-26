import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
  // MDX packages that touch Node APIs
  serverExternalPackages: ["shiki", "mermaid"],
};

export default nextConfig;
