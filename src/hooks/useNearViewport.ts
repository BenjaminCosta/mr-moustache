"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True once `ref`'s element comes within `margin` of the viewport (and stays
 * true). Used to start below-the-fold downloads (a video, a web font) only
 * when the visitor is about to see them.
 */
export function useNearViewport(ref: RefObject<Element | null>, margin = "600px") {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: `${margin} 0px` },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, margin]);

  return near;
}
