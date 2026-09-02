import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      /* The new posts link to /quality/batch-12-results, which has never
         existed the write-up lives at /blog/batch-12-results. The brief
         was not to change the link targets, so the route is made to resolve
         instead of the copy being rewritten. Permanent, so the redirect is
         cached and search engines consolidate on the real URL.

         If /quality is ever restructured to host batch write-ups directly,
         delete this and the links keep working. */
      {
        source: "/quality/batch-12-results",
        destination: "/blog/batch-12-results",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
