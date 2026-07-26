import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/content/load";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/desk-site", "/api/desk"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
