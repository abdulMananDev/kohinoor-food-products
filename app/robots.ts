import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

/* Served at /robots.txt. The PDFs under /reports/ are deliberately
   crawlable — they are the evidence this site exists to publish. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /* Next's build output, and nothing else. Answer-engine crawlers
           (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) are
           deliberately NOT blocked: a site whose purpose is to be quoted
           accurately about a contamination claim gains nothing by being
           unquotable. */
        disallow: ["/_next/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
