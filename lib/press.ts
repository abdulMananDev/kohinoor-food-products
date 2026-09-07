/* External coverage, newest first.
 *
 * Same shape as content/batches: data here, layout in the page, so a new
 * mention is one entry rather than a layout change.
 *
 * excerpt is OUR paraphrase, not the publication's words. Anything quoted
 * verbatim belongs in quotes with the source named, and stays short. */

export type Mention = {
  source: string;
  title: string;
  url: string;
  /** ISO date, omitted where the post carries none. */
  date?: string;
  excerpt: string;
};

export const mentions: Mention[] = [
  {
    source: "Tijarat Times",
    title: "Fast Tea focuses on taste and quality assurance",
    url: "https://www.facebook.com/TijaratTimes/posts/fast-tea-focuses-on-taste-and-quality-assurancesrinagar-fast-tea-marketed-by-ina/1368943575391267/",
    excerpt:
      "A Srinagar-datelined post covering New Fast Tea, marketed by INAAM Tea Agency, and the emphasis we place on taste and on quality assurance.",
  },
];

/* Sort at the point of use rather than trusting the literal above to stay
   ordered. Undated entries sort last — a mention with no date is not
   evidence of being recent. */
export const mentionsByDate = () =>
  [...mentions].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
