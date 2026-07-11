"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GrokWorking — Grok's in-turn status line (not the idle braille spinner).
 *
 * Captured grammar (v0.2.93):
 *   `⠹ Waiting for response… 0.1s          1.5s ⇣16.6k [stop]`
 *   `◆ Write permission probe… 1m17s       1m19s ⇣16.0k [↓][stop]`
 */
const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const FG = "#ffffff"; // 38;5;15 — spinner + label
const MUTED = "#c0c0c0"; // 38;5;7 — elapsed / tokens
const DIM = "#808080";
const GREEN = "#00ff00"; // active tool ◆ line

function formatElapsed(secs: number) {
  if (secs < 60) return `${secs.toFixed(secs < 10 ? 1 : 0)}s`;
  const m = Math.floor(secs / 60);
  const s = Math.round(secs % 60);
  return `${m}m${String(s).padStart(2, "0")}s`;
}

export function GrokWorking({
  label = "Waiting for response…",
  tokens = "16.6k",
  running = true,
  diamond = false,
  showScrollHint = false,
  className,
}: {
  label?: string;
  tokens?: string;
  running?: boolean;
  /** Use ◆ instead of the braille spinner (active tool line). */
  diamond?: boolean;
  showScrollHint?: boolean;
  className?: string;
}) {
  const [f, setF] = React.useState(0);
  const [secs, setSecs] = React.useState(0.1);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setF((n) => (n + 1) % FRAMES.length), 90);
    return () => clearInterval(id);
  }, [running]);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs((s) => s + 0.1), 100);
    return () => clearInterval(id);
  }, [running]);

  if (!running) return null;

  const elapsed = formatElapsed(secs);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-[13px]",
        className,
      )}
    >
      <div className="flex min-w-0 items-baseline gap-2">
        <span
          aria-hidden
          className="inline-block w-[2ch] shrink-0"
          style={{ color: diamond ? GREEN : FG }}
        >
          {diamond ? "◆" : FRAMES[f]}
        </span>
        <span style={{ color: diamond ? MUTED : FG }}>{label}</span>
        <span style={{ color: MUTED }}>{elapsed}</span>
      </div>

      <div className="shrink-0 tabular-nums" style={{ color: MUTED }}>
        <span>{elapsed}</span>
        <span style={{ color: DIM }}> </span>
        <span aria-hidden>⇣</span>
        {tokens}
        <span style={{ color: DIM }}> </span>
        {showScrollHint ? (
          <span style={{ color: DIM }}>
            [<span style={{ color: FG }}>↓</span>]
          </span>
        ) : null}
        <span style={{ color: DIM }}>
          [<span style={{ color: FG }}>stop</span>]
        </span>
      </div>
    </div>
  );
}
