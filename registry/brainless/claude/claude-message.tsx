import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ClaudeMessage — a conversation turn. User turns render as Claude Code's
 * full-width prompt row (`❯` + one cell of space, dark background across the
 * row, white text); assistant turns are plain text.
 */
export function ClaudeMessage({
  role = "assistant",
  className,
  children,
}: {
  role?: "user" | "assistant";
  className?: string;
  children: React.ReactNode;
}) {
  if (role === "user") {
    return (
      <div
        className={cn(
          "flex w-full min-w-0 items-baseline font-mono text-[13px] leading-[1.55]",
          className,
        )}
        style={{ background: "#3a3a3a" }}
      >
        <span aria-hidden className="shrink-0" style={{ color: "#4e4e4e" }}>
          ❯
        </span>
        {/* one terminal cell between caret and text — a trailing space inside
            a flex child collapses, so use an explicit width */}
        <span aria-hidden className="shrink-0" style={{ display: "inline-block", width: "1ch" }} />
        <span className="min-w-0 flex-1 break-words" style={{ color: "#ffffff" }}>
          {children}
        </span>
      </div>
    );
  }
  return (
    <div
      className={cn("font-mono text-[13px] leading-[1.6] text-[#c0caf5]", className)}
    >
      {children}
    </div>
  );
}
