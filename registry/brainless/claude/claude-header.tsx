import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ClaudeHeader — Claude Code's welcome box.
 *
 * The title-in-the-border is a real <fieldset>/<legend>, so it stays semantic
 * and inherits whatever background it sits on. The logo is Claude Code's own
 * pixel sprite, but drawn as a crisp SVG grid instead of quadrant-block glyphs
 * — no font seams, scales cleanly.
 */
const ROSE = "#cd694a";
const GRAY = "#949494";

// Claude's launch sprite as a 1-bit bitmap (decoded from the terminal glyphs).
const LOGO_BITS = [
  "000111111111111000",
  "000110111111011000",
  "011111111111111110",
  "000111111111111000",
  "000010100001010000",
];

export function ClaudeLogo({
  scale = 4,
  color = ROSE,
  className,
}: {
  scale?: number;
  color?: string;
  className?: string;
}) {
  const w = LOGO_BITS[0].length;
  const h = LOGO_BITS.length;
  // Terminal char cells are taller than wide, so each sprite pixel is stretched
  // vertically (PH) to keep the logo's proportions instead of looking squat.
  const PH = 2.4;
  const rects: React.ReactElement[] = [];
  LOGO_BITS.forEach((row, y) => {
    let x = 0;
    while (x < w) {
      if (row[x] === "1") {
        let end = x;
        while (end < w && row[end] === "1") end += 1;
        rects.push(
          <rect key={`${x}-${y}`} x={x} y={y * PH} width={end - x} height={PH} />,
        );
        x = end;
      } else {
        x += 1;
      }
    }
  });
  return (
    <svg
      aria-hidden
      width={w * scale}
      height={h * PH * scale}
      viewBox={`0 0 ${w} ${h * PH}`}
      shapeRendering="crispEdges"
      fill={color}
      className={className}
    >
      {rects}
    </svg>
  );
}

export function ClaudeHeader({
  version = "v2.1.206",
  user = "Ben",
  model = "Fable 5 with xhigh effort · Claude Max",
  org = "ben@freestyle.sh's Organization",
  cwd = "~/dev/brainless",
  tips = ["Ask Claude to create a new app or clone a repo"],
  whatsNew = [
    "Added directory path suggestions to /cd",
    "Added a /doctor check that proposes trims",
  ],
  className,
}: {
  version?: string;
  user?: string;
  model?: string;
  org?: string;
  cwd?: string;
  tips?: string[];
  whatsNew?: string[];
  className?: string;
}) {
  return (
    <fieldset
      className={cn(
        "min-w-0 rounded-[6px] border px-3 pb-3.5 pt-1 font-mono text-[13px] leading-[1.5] text-[#c0caf5] sm:px-4",
        className,
      )}
      style={{ borderColor: ROSE }}
    >
      <legend className="max-w-full truncate px-2" style={{ color: ROSE }}>
        Claude Code <span style={{ color: GRAY }}>{version}</span>
      </legend>

      <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_1px_minmax(0,1.1fr)]">
        {/* left: identity */}
        <div className="flex min-w-0 flex-col items-center gap-2 py-1 text-center">
          <div className="font-semibold">Welcome back {user}!</div>
          <ClaudeLogo className="my-1.5" />
          <div className="min-w-0 space-y-0.5 break-words" style={{ color: GRAY }}>
            <div>{model}</div>
            <div>{org}</div>
            <div>{cwd}</div>
          </div>
        </div>

        <div aria-hidden className="hidden sm:block" style={{ background: `${ROSE}55` }} />

        {/* right: tips + what's new */}
        <div className="min-w-0 space-y-1">
          <div className="font-semibold" style={{ color: ROSE }}>
            Tips for getting started
          </div>
          {tips.map((t) => (
            <div key={t} className="truncate">
              {t}
            </div>
          ))}
          <div className="my-1.5 h-px" style={{ background: ROSE }} />
          <div className="font-semibold" style={{ color: ROSE }}>
            What&apos;s new
          </div>
          {whatsNew.map((t) => (
            <div key={t} className="truncate">
              {t}
            </div>
          ))}
          <div className="truncate italic" style={{ color: GRAY }}>
            /release-notes for more
          </div>
        </div>
      </div>
    </fieldset>
  );
}
