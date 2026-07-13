import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GrokTool — a Grok action line.
 *
 * Two captured forms:
 *   1. Compact: `read app/page.tsx` (dim verb, blue path)
 *   2. Card:    `┃  ◆ Run Write …  [hooks: 3]` (left gutter + diamond)
 */
const GREEN = "#00ff00"; // 38;5;10 — active Run tool cards
const MUTED = "#8b8b90";
const DIM = "#6c6c6c";
const BLUE = "#8db0ff";
const SILVER = "#c0c0c0";

export function GrokTool({
  verb,
  path,
  meta,
  variant = "line",
  title,
  hooks,
  className,
  children,
}: {
  verb?: string;
  path?: string;
  meta?: string;
  variant?: "line" | "card";
  /** Card title, e.g. "Run Write permission probe output file". */
  title?: string;
  hooks?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  if (variant === "card") {
    const heading = title ?? [verb, path].filter(Boolean).join(" ");
    return (
      <div
        className={cn(
          "min-w-0 border-l-2 pl-3 font-mono text-[13px] leading-[1.55]",
          className,
        )}
        style={{ borderColor: GREEN }}
      >
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
          <span aria-hidden className="shrink-0" style={{ color: GREEN }}>
            ◆
          </span>
          <span className="min-w-0 break-words font-semibold" style={{ color: SILVER }}>
            {heading}
          </span>
          {hooks != null ? (
            <span className="shrink-0" style={{ color: DIM }}>
              [hooks: <span style={{ color: GREEN }}>{hooks}</span>]
            </span>
          ) : null}
        </div>
        {children ? (
          <div className="mt-1 min-w-0 break-words" style={{ color: MUTED }}>
            {children}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-w-0 flex-wrap items-baseline gap-2 font-mono text-[13px] leading-[1.6] text-[#8b8b90]",
        className,
      )}
    >
      {verb ? <span className="shrink-0">{verb}</span> : null}
      {path ? (
        <span className="min-w-0 break-all" style={{ color: BLUE }}>
          {path}
        </span>
      ) : null}
      {meta ? <span className="text-[#6a6a6a]">{meta}</span> : null}
      {children}
    </div>
  );
}
