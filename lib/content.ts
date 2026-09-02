import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/* The content layer.
 *
 * Every helper here runs at build time only - the pages that use them are
 * statically generated, so nothing in this file ships to the browser.
 *
 * Validation is deliberately fatal. A transparency post with a malformed
 * date or a missing batch reference is worse than no post at all, because
 * the whole point of this section is that the dates and report numbers can
 * be trusted. So a bad frontmatter block fails the build rather than
 * rendering something plausible-looking. */

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

/* An ISO date that is also a real date. z.iso.datetime() would reject the
   plain "2026-08-11" form, and a bare string would accept "2026-13-45", so
   the check is explicit. */
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}(T[\d:.]+Z?)?$/, "must be an ISO date")
  .refine((v) => !Number.isNaN(Date.parse(v)), "must be a real date");

export const frontmatterSchema = z
  .object({
    title: z.string().min(1),
    slug: z
      .string()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "must be a lowercase kebab-case slug",
      ),
    description: z.string().min(1),
    publishedAt: isoDate,
    updatedAt: isoDate.optional(),
    track: z.enum(["transparency", "product"]),
    batch: z.string().optional(),
    labReport: z
      .string()
      .startsWith("/reports/", "must be a path under /public/reports/")
      .optional(),
    tags: z.array(z.string()).default([]),
  })
  .strict() // an unrecognised key is a typo, and typos here are silent bugs
  .refine((fm) => !fm.updatedAt || fm.updatedAt >= fm.publishedAt, {
    message: "updatedAt cannot be earlier than publishedAt",
    path: ["updatedAt"],
  });

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export type Post = Frontmatter & {
  /** Raw MDX body, ready to hand to <MDXRemote>. */
  content: string;
  /** The file it came from, for error messages. */
  file: string;
};

function readAll(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const parsed = frontmatterSchema.safeParse(data);

    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      throw new Error(
        `Invalid frontmatter in content/blog/${file}:\n${issues}`,
      );
    }

    // The filename is the canonical identity; a slug that disagrees with it
    // means two different URLs are implied by one file.
    const expected = file.replace(/\.mdx$/, "");
    if (parsed.data.slug !== expected) {
      throw new Error(
        `Slug mismatch in content/blog/${file}: frontmatter says "${parsed.data.slug}", filename says "${expected}".`,
      );
    }

    return { ...parsed.data, content, file };
  });

  const seen = new Set<string>();
  for (const p of posts) {
    if (seen.has(p.slug)) throw new Error(`Duplicate slug: ${p.slug}`);
    seen.add(p.slug);
  }

  // Newest first, everywhere. Transparency content is read as a sequence.
  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getAllPosts(): Post[] {
  return readAll();
}

export function getPostBySlug(slug: string): Post | undefined {
  return readAll().find((p) => p.slug === slug);
}

export function getPostsByTrack(track: Frontmatter["track"]): Post[] {
  return readAll().filter((p) => p.track === track);
}

/* ---- batches ---------------------------------------------------------- */

export type BatchStatus = "published" | "pending";

export type BatchRow = {
  batch: string;
  status: BatchStatus;
  labReport?: string;
  postSlug: string;
  postTitle: string;
  publishedAt: string;
};

/* Derived from the posts rather than kept in a second list, so a batch can
   never appear in the table without a post explaining it. A batch with no
   labReport is reported as pending - never as clear. */
export function getBatches(): BatchRow[] {
  const rows = getAllPosts()
    .filter((p): p is Post & { batch: string } => Boolean(p.batch))
    .map((p) => ({
      batch: p.batch,
      status: (p.labReport ? "published" : "pending") as BatchStatus,
      labReport: p.labReport,
      postSlug: p.slug,
      postTitle: p.title,
      publishedAt: p.publishedAt,
    }));

  // Highest batch number first, falling back to string order.
  return rows.sort((a, b) => {
    const na = Number(a.batch.replace(/\D/g, ""));
    const nb = Number(b.batch.replace(/\D/g, ""));
    if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return nb - na;
    return b.batch.localeCompare(a.batch);
  });
}

/* ---- formatting ------------------------------------------------------- */

/** ISO in, human out. Fixed locale so the server and the build agree. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/* The origin every canonical, OG tag, sitemap entry and feed link is built
   from. Resolution order:
   1. NEXT_PUBLIC_SITE_URL - set this to the real domain in Vercel's project
      settings. It is the only one that survives a custom domain.
   2. VERCEL_PROJECT_PRODUCTION_URL - the project's stable production host,
      set by Vercel on every deployment including previews, so a preview
      build still points canonicals at production rather than at itself.
   3. VERCEL_URL - the per-deployment host. Last resort.
   4. localhost, for local development.

   Without 1, a custom domain will still emit *.vercel.app URLs, so set it. */
/* Normalises whatever was typed into an env var into an absolute origin.
   "newfasttea.com", "www.newfasttea.com/" and "https://newfasttea.com/"
   all resolve to the same thing - a bare hostname with no scheme is the
   easy mistake to make in a Vercel settings field, and it throws an
   opaque ERR_INVALID_URL from `new URL()` at module evaluation if it
   reaches metadataBase unchecked. */
function normaliseOrigin(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, "");
  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  // Fail loudly and specifically rather than at the point of use.
  try {
    return new URL(withScheme).origin;
  } catch {
    throw new Error(
      `Invalid site URL: ${JSON.stringify(value)}. Set NEXT_PUBLIC_SITE_URL to a hostname or full URL, e.g. "https://newfasttea.com".`,
    );
  }
}

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return normaliseOrigin(explicit);

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return normaliseOrigin(vercel);

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "New Fast Tea";

/* One share image for the whole site. 1376x768 clears the 1200x630 minimum
   and sits close to the 1.91:1 crop both Facebook and X use.
   TODO: a purpose-made OG card would beat a product photo - this one has no
   wordmark on it, so a shared link is not self-identifying. */
export const OG_IMAGE = {
  url: "/new-fast-tea-leaves.png",
  width: 1376,
  height: 768,
  alt: "Assam tea leaves with cardamom, star anise and cinnamon",
};
