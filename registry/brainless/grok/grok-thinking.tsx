"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GrokThinking — Grok's working line: a braille spinner and a rotating verb in
 * Grok's amber, with a live elapsed hint. Polite live region for screen
 * readers.
 */
const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const VERBS = ["Thinking", "Reticulating", "Computing", "Pondering", "Percolating"];

const FG = "#ffffff"; // 38;5;15
const MUTED = "#c0c0c0"; // 38;5;7

export function GrokThinking({
  running = true,
  verbs = VERBS,
  className,
}: {
  running?: boolean;
  verbs?: string[];
  className?: string;
}) {
  const [f, setF] = React.useState(0);
  const [v, setV] = React.useState(0);
  const [secs, setSecs] = React.useState(0);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setF((n) => (n + 1) % FRAMES.length), 90);
    return () => clearInterval(id);
  }, [running]);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecs((s) => s + 1);
      if (secs % 5 === 4) setV((x) => (x + 1) % verbs.length);
    }, 1000);
    return () => clearInterval(id);
  }, [running, secs, verbs.length]);

  if (!running) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex items-center gap-2 font-mono text-[13px]", className)}
    >
      <span aria-hidden style={{ color: FG, width: "1ch" }}>
        {FRAMES[f]}
      </span>
      <span style={{ color: FG }}>{verbs[v % verbs.length]}…</span>
      <span style={{ color: MUTED }}>({secs}s)</span>
    </div>
  );
}
