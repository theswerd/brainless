"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GrokHeader — Grok CLI's launch card.
 *
 * The logo is Grok's braille mark, decoded to a 1-bit sprite and drawn as a
 * crisp SVG so there are no font seams. Grok's resting animation is a grayscale
 * shimmer sweeping across the mark — reproduced here with a masked gradient
 * that translates on a loop (and holds still under prefers-reduced-motion).
 */
const LOGO_BITS = [
  "00000000000000000000000001",
  "00000000000111110000000010",
  "00000000111111111110000100",
  "00000001111111111110001000",
  "00000011111000000000011000",
  "00000111100000000000110000",
  "00001111000000000001111000",
  "00001110000000000011111000",
  "00011100000000000110111000",
  "00011100000000001100011100",
  "00011100000000010000011100",
  "00011100000000100000011100",
  "00011100000001000000011100",
  "00011100000000000000011100",
  "00011100000000000000011000",
  "00001110000000000000111000",
  "00001110000000000001111000",
  "00001110000000000011110000",
  "00001100000000000111100000",
  "00011000011111111111000000",
  "00010000111111111110000000",
  "00100000001111111000000000",
  "01000000000000000000000000",
  "10000000000000000000000000",
];

const AMBER = "#e0af68";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function GrokLogo({
  scale = 4,
  className,
}: {
  scale?: number;
  className?: string;
}) {
  const uid = React.useId().replace(/[^a-z0-9]/gi, "");
  const reduced = usePrefersReducedMotion();
  const cols = LOGO_BITS[0].length;
  const rows = LOGO_BITS.length;

  // Grok renders each braille dot as a separate spaced dot, not filled strokes.
  const CELL = 10;
  const DOT = 5.2; // ~half the pitch, matching the real dot/gap ratio
  const off = (CELL - DOT) / 2;
  const W = cols * CELL;
  const H = rows * CELL;
  const dots: React.ReactElement[] = [];
  LOGO_BITS.forEach((row, y) => {
    for (let x = 0; x < cols; x += 1) {
      if (row[x] === "1") {
        dots.push(
          <rect
            key={`${x}-${y}`}
            x={x * CELL + off}
            y={y * CELL + off}
            width={DOT}
            height={DOT}
            rx={0.9}
          />,
        );
      }
    }
  });

  return (
    <svg
      aria-hidden
      width={cols * scale}
      height={rows * scale}
      viewBox={`0 0 ${W} ${H}`}
      className={className}
    >
      <defs>
        <mask id={`m${uid}`}>
          <g fill="#fff">{dots}</g>
        </mask>
        <linearGradient
          id={`g${uid}`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={W * 0.42}
          y2={H * 0.18}
          spreadMethod="reflect"
        >
          <stop offset="0" stopColor="#616161" />
          <stop offset="1" stopColor="#d4d4d4" />
          {reduced ? null : (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="0 0"
              to={`${W * 0.84} ${H * 0.36}`}
              dur="2.8s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#g${uid})`} mask={`url(#m${uid})`} />
    </svg>
  );
}

const MENU: { label: string; key?: string }[] = [
  { label: "New worktree", key: "ctrl+w" },
  { label: "Resume session", key: "ctrl+s" },
  { label: "Changelog" },
  { label: "Quit", key: "ctrl+q" },
];

export function GrokHeader({
  version = "0.2.93",
  headline = "Grok 4.5 is here!",
  subhead = "Grok 4.5 is now available. Try it out in the /model picker.",
  className,
}: {
  version?: string;
  headline?: string;
  subhead?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[6px] border border-[#2f2f33] px-4 py-4 font-mono text-[13px] leading-[1.5] text-[#e8e8e8]",
        className,
      )}
    >
      <div className="flex items-center gap-5">
        <GrokLogo className="hidden shrink-0 sm:block" />
        <div className="min-w-0 flex-1">
          <div>
            <span className="font-semibold">Grok Build Beta</span>{" "}
            <span className="text-[#7a7a7a]">{version}</span>
          </div>
          <div className="mt-2 font-semibold" style={{ color: AMBER }}>
            {headline}
          </div>
          <div className="truncate text-[#8b8b90]">{subhead}</div>

          <ul className="mt-2.5 space-y-0.5">
            {MENU.map((m) => (
              <li key={m.label}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 rounded px-1 py-0.5 text-left hover:bg-white/5"
                >
                  <span>{m.label}</span>
                  {m.key ? <span className="text-[#6a6a6a]">{m.key}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
