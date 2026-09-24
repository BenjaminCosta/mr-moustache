"use client";

import { useEffect, useRef, useState } from "react";
import { SpeakerSimpleHighIcon } from "@phosphor-icons/react/dist/csr/SpeakerSimpleHigh";
import { SpeakerSimpleSlashIcon } from "@phosphor-icons/react/dist/csr/SpeakerSimpleSlash";
import type { WorkVideo } from "@/types";

type WorkVideoCardProps = {
  video: WorkVideo;
};

export function WorkVideoCard({ video }: WorkVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  // The clip and its poster only download once the card nears the viewport.
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const toggleMuted = () => {
    const element = videoRef.current;
    if (!element) return;

    element.muted = !element.muted;
    setMuted(element.muted);

    if (element.paused) void element.play();
  };

  return (
    <figure className="relative isolate h-[25.5rem] overflow-hidden rounded-[0.5rem] border border-white/20 bg-[#101010] lg:h-[38rem] lg:rounded-[0.75rem]">
      <video
        ref={videoRef}
        src={shouldLoad ? video.src : undefined}
        poster={shouldLoad ? (video.poster ?? undefined) : undefined}
        aria-label={video.label}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 -z-10 size-full object-cover"
        onCanPlay={(event) => {
          if (event.currentTarget.paused) void event.currentTarget.play();
        }}
        onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/45 to-transparent"
      />

      <button
        type="button"
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={!muted}
        onClick={toggleMuted}
        className="group absolute bottom-3 right-3 inline-flex h-9 items-center gap-2 rounded-[0.25rem] border border-white/25 bg-black/60 px-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-[background-color,border-color,color,transform] duration-300 ease-out hover:border-primary hover:bg-primary hover:text-black active:scale-[0.98] lg:bottom-5 lg:right-5 lg:h-10 lg:px-3.5"
      >
        {muted ? (
          <SpeakerSimpleSlashIcon className="size-4" weight="regular" />
        ) : (
          <SpeakerSimpleHighIcon className="size-4" weight="regular" />
        )}
        <span className="text-[0.55rem] font-semibold uppercase leading-none tracking-[0.2em] lg:text-[0.62rem]">
          {muted ? "Unmute" : "Mute"}
        </span>
      </button>
    </figure>
  );
}
