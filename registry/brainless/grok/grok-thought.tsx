import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GrokThought — a completed or streaming thought block.
 *
 * Captured forms:
 *   `◆ Thought for 0.2s`                         (one-liner)
 *   `❙  ◆ Thought for 0.1s`                      (gutter)
 *   `┃  ◆ Thinking…` + body                      (bordered stream)
 */
const BORDER = "#808080"; // 38;5;8
const FG = "#e1e1e1";
const MUTED = "#c0c0c0"; // 38;5;7
const SILVER = "#c0c0c0";

export function GrokThought({
  elapsed = "0.2s",
  streaming = false,
  gutter = false,
  className,
  children,
}: {
  elapsed?: string;
  streaming?: boolean;
  /** Use the `❙` gutter marker instead of a plain diamond line. */
  gutter?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const label = streaming ? "Thinking…" : `Thought for ${elapsed}`;

  if (children || streaming) {
    return (
      <div
        className={cn(
          "border-l-2 pl-3 font-mono text-[13px] leading-[1.55]",
          className,
        )}
        style={{ borderColor: BORDER }}
        role="status"
        aria-live={streaming ? "polite" : undefined}
      >
        <div className="flex items-baseline gap-2">
          <span aria-hidden style={{ color: BORDER }}>
            ◆
          </span>
          <span className="font-semibold" style={{ color: MUTED }}>
            {label}
          </span>
        </div>
        {children ? (
          <div className="mt-1 whitespace-pre-wrap" style={{ color: FG }}>
            {children}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-baseline gap-2 font-mono text-[13px] leading-[1.55]",
        className,
      )}
    >
      {gutter ? (
        <span aria-hidden style={{ color: BORDER }}>
          ❙
        </span>
      ) : null}
      <span aria-hidden style={{ color: SILVER }}>
        ◆
      </span>
      <span style={{ color: MUTED }}>{label}</span>
    </div>
  );
}
