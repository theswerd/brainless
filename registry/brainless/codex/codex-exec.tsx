import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CodexExec — a Codex action/exec line: a command or edit with an optional
 * result count, and expandable output as a real <details> disclosure.
 */
type Status = "ok" | "error" | "run";

const DOT: Record<Status, string> = {
  ok: "#4ea96f",
  error: "#f7768e",
  run: "#e0af68",
};

export function CodexExec({
  command,
  result,
  status = "ok",
  defaultOpen = false,
  className,
  children,
}: {
  command: string;
  result?: string;
  status?: Status;
  defaultOpen?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const expandable = Boolean(children);
  return (
    <details
      open={defaultOpen}
      className={cn(
        "group font-mono text-[13px] leading-[1.55] [&_summary::-webkit-details-marker]:hidden",
        className,
      )}
    >
      <summary
        className={cn(
          "flex min-w-0 list-none items-baseline gap-2 outline-none",
          expandable ? "cursor-pointer" : "cursor-default",
          "focus-visible:ring-1 focus-visible:ring-[#5cc2e0]/60",
        )}
      >
        <span aria-hidden className="shrink-0" style={{ color: DOT[status] }}>
          •
        </span>
        <span className="min-w-0 break-words text-[#5cc2e0]">{command}</span>
        {result ? <span className="shrink-0 text-[#7a7a7a]">{result}</span> : null}
        {expandable ? (
          <span className="shrink-0 text-[#565656] group-open:hidden">▸</span>
        ) : null}
      </summary>
      {expandable ? (
        <pre className="mt-1 overflow-x-auto whitespace-pre-wrap pl-4 text-[#8a8a8a]">
          {children}
        </pre>
      ) : null}
    </details>
  );
}
