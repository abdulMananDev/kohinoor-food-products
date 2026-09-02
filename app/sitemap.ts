import type { MetadataRoute } from "next";
import { getAllPosts, SITE_URL } from "@/lib/content";

/* Generated from the content layer, so a new .mdx file is in the sitemap
   without anyone remembering to add it. Served at /sitemap.xml. */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: "yearly" as const,
    priority: p.track === "transparency" ? 0.8 : 0.6,
  }));

  const routes = [
    { path: "", priority: 1 },
    { path: "/transparency", priority: 0.9 },
    { path: "/quality", priority: 0.9 },
    { path: "/blog", priority: 0.7 },
    { path: "/products", priority: 0.7 },
    { path: "/about", priority: 0.5 },
  ].map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));

  return [...routes, ...posts];
}
