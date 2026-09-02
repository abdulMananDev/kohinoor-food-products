"use client";

import { useEffect, useState } from "react";

/* Ambient hero motion. Decorative only, so it is aria-hidden and carries no
   controls. Three things this handles deliberately:
   - The poster renders on the server and before hydration, so there is never
     a blank flash and nothing about the video is on the critical path.
   - The <video> is only mounted once the browser is idle, so it cannot
     compete with the headline and CTA for load priority.
   - prefers-reduced-motion keeps the poster and never mounts the video, so
     autoplay simply does not happen. Same rule as the hero type stagger. */
export default function HeroVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const idle =
      window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 400));
    const id = idle(() => setPlay(true));

    // If the preference flips while the page is open, stop honouring motion.
    const onChange = () => setPlay(!mq.matches);
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      if (typeof id === "number") clearTimeout(id);
    };
  }, []);

  if (!play) {
    return (
      <img src={poster} alt="" aria-hidden className={className} />
    );
  }

  return (
    <video
      className={className}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      /* Not "none": that tells the browser not to fetch, which contradicts
         autoPlay and leaves the element sitting at readyState 0. Deferring
         the mount to idle is what keeps this off the critical path — the
         element does not exist until then, so preload has nothing to
         compete with by the time it is set. */
      preload="auto"
      aria-hidden
      tabIndex={-1}
      /* React sets `muted` as a property but not as an attribute, and some
         browsers consult the attribute when applying the autoplay policy.
         Setting it on the node directly covers both. */
      ref={(el) => {
        if (el) el.muted = true;
      }}
    />
  );
}
