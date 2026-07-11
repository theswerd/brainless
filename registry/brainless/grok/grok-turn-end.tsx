import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GrokTurnEnd — the post-turn footer Grok prints after `◆ stop`.
 *
 * Captured: `Turn completed in 8.0s.`
 */
const MUTED = "#8b8b90";

export function GrokTurnEnd({
  elapsed = "8.0s",
  className,
}: {
  elapsed?: string;
  className?: string;
}) {
  return (
    <p
      className={cn("font-mono text-[13px] leading-[1.55]", className)}
      style={{ color: MUTED }}
      role="status"
    >
      Turn completed in {elapsed}.
    </p>
  );
}
