import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GrokStatus — Grok CLI's top status bar.
 *
 * Captured grammar (v0.2.93): branch glyph + cwd on the left; optional MCP
 * spinner (`⠴ MCP (2/3)`), context usage (`16K / 500K`), and turn progress
 * (`│ 2/3 ✓`) on the right.
 */
const FG = "#e1e1e1";
const MUTED = "#8b8b90";
const DIM = "#808080"; // 38;5;8 — MCP spinner
const OK = "#00ff00"; // 38;5;10 — turn ✓

export function GrokStatus({
  branch = "main",
  directory = "~/dev/brainless",
  contextUsed = "16K",
  contextLimit = "500K",
  turn,
  turnTotal,
  mcp,
  mcpTotal,
  className,
}: {
  branch?: string;
  directory?: string;
  contextUsed?: string;
  contextLimit?: string;
  /** Completed steps in the current turn, e.g. 2 of 3. */
  turn?: number;
  turnTotal?: number;
  /** Connected MCP servers so far (shows spinner while loading). */
  mcp?: number;
  mcpTotal?: number;
  className?: string;
}) {
  const showTurn =
    typeof turn === "number" && typeof turnTotal === "number" && turnTotal > 0;
  const showMcp =
    typeof mcp === "number" && typeof mcpTotal === "number" && mcpTotal > 0;

  return (
    <div
      className={cn(
        "flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-[12px]",
        className,
      )}
      role="status"
      aria-label="Session status"
    >
      <div className="min-w-0 max-w-full truncate" style={{ color: MUTED }}>
        <span aria-hidden style={{ color: FG }}>
          {" "}
        </span>
        <span style={{ color: FG }}>{branch}</span>
        <span style={{ color: DIM }}> </span>
        <span>{directory}</span>
      </div>

      <div
        className="flex min-w-0 flex-wrap items-baseline gap-x-2 tabular-nums"
        style={{ color: MUTED }}
      >
        {showMcp ? (
          <span style={{ color: DIM }}>
            <span aria-hidden>⠴ </span>
            MCP ({mcp}/{mcpTotal})
          </span>
        ) : null}
        <span>
          {contextUsed}
          <span style={{ color: DIM }}> / </span>
          {contextLimit}
        </span>
        {showTurn ? (
          <>
            <span style={{ color: DIM }}>│</span>
            <span>
              {turn}/{turnTotal}
            </span>{" "}
            <span aria-hidden style={{ color: OK }}>
              ✓
            </span>
            <span className="sr-only"> steps complete</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
