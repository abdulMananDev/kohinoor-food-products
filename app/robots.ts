import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

/* Served at /robots.txt. The PDFs under /reports/ are deliberately
   crawlable — they are the evidence this site exists to publish. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
