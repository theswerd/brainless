import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GrokMessage — a Grok turn. User prompts carry the ❯ marker; the assistant
 * reply is plain text. Optional wall-clock `time` (e.g. `4:38 PM`) pins to the
 * right, matching the live CLI transcript.
 */
export function GrokMessage({
  role = "assistant",
  time,
  className,
  children,
}: {
  role?: "user" | "assistant";
  time?: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (role === "user") {
    return (
      <div
        className={cn(
          "flex min-w-0 gap-2 font-mono text-[13px] leading-[1.6] text-[#e8e8e8]",
          className,
        )}
      >
        <span aria-hidden className="shrink-0">
          ❯
        </span>
        <span className="min-w-0 flex-1 break-words">{children}</span>
        {time ? (
          <span className="shrink-0 tabular-nums text-[#6c6c6c]">{time}</span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-w-0 gap-2 font-mono text-[13px] leading-[1.6] text-[#cfcfd2]",
        className,
      )}
    >
      <span className="min-w-0 flex-1 break-words">{children}</span>
      {time ? (
        <span className="shrink-0 tabular-nums text-[#6c6c6c]">{time}</span>
      ) : null}
    </div>
  );
}
