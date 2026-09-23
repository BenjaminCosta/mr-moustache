"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@/components/ui/Icons";
import type { WorkVideo } from "@/types";

type WorkVideoCardProps = {
  video: WorkVideo;
  fallbackHref: string;
};

const playButtonClasses =
  "btn-sweep btn-sweep--fill-light group grid size-[3.2rem] place-items-center rounded-full border-[1.5px] border-white bg-black/55 text-white backdrop-blur-[2px]";

export function WorkVideoCard({ video, fallbackHref }: WorkVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlayback = () => {
    const element = videoRef.current;
    if (!element) return;
    if (element.paused) {
      void element.play();
    } else {
      element.pause();
    }
  };

  return (
    <figure className="relative isolate h-[25.5rem] overflow-hidden rounded-[0.5rem] border border-white/20 bg-[#101010]">
      {video.src ? (
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster ?? undefined}
          playsInline
          preload="metadata"
          className="absolute inset-0 -z-10 size-full object-cover"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
      ) : video.poster ? (
        <Image
          src={video.poster}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_65%_35%,#2b2b2b_0%,#151515_55%,#0b0b0b_100%)]"
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"
      />

      <div className="absolute inset-0 grid place-items-center">
        {video.src ? (
          <button
            type="button"
            className={`${playButtonClasses} ${playing ? "opacity-0 hover:opacity-100 focus-visible:opacity-100" : ""}`}
            aria-label={playing ? "Pause video" : `Play video: ${video.title}`}
            onClick={togglePlayback}
          >
            {playing ? (
              <PauseIcon className="size-[1.2rem]" />
            ) : (
              <PlayIcon className="ml-[0.2rem] size-[1.35rem] transition-transform duration-300 ease-out group-hover:scale-110" />
            )}
          </button>
        ) : (
          <a
            href={fallbackHref}
            target="_blank"
            rel="noopener noreferrer"
            className={playButtonClasses}
            aria-label={`Watch ${video.title} on Instagram (opens in a new tab)`}
          >
            <PlayIcon className="ml-[0.2rem] size-[1.35rem] transition-transform duration-300 ease-out group-hover:scale-110" />
          </a>
        )}
      </div>

      <figcaption className="pointer-events-none absolute inset-x-[1.05rem] bottom-[0.75rem] flex items-end justify-between text-foreground">
        <span>
          <span aria-hidden="true" className="mb-[0.85rem] block h-px w-full bg-gradient-to-r from-white/45 via-white/15 to-white/10" />
          <span className="block text-[0.5rem] uppercase leading-none tracking-[0.24em]">
            {video.title}
          </span>
          <span className="mt-[0.6rem] block text-[0.43rem] uppercase leading-none tracking-[0.28em] text-foreground/85">
            {video.location}
          </span>
        </span>
        <span className="mb-[0.3rem] text-[0.62rem] leading-none tracking-[0.04em]">
          {video.duration}
        </span>
      </figcaption>
    </figure>
  );
}
