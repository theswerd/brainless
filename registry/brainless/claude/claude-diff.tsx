import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ClaudeDiff — Claude Code's inline edit hunk (the ⏺ Update / ⎿ summary + the
 * +/- lines). Added/removed rows carry semantic tinted backgrounds and an
 * off-screen "added"/"removed" label so the diff is legible without color.
 */
export type DiffLine = {
  type: "add" | "del" | "ctx";
  n?: number;
  text: string;
};

const GREEN = "#4ea96f";

export function ClaudeDiff({
  file,
  summary,
  lines,
  className,
}: {
  file: string;
  summary?: string;
  lines: DiffLine[];
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 font-mono text-[13px] leading-[1.55]", className)}>
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
        <span aria-hidden className="shrink-0" style={{ color: GREEN }}>
          ⏺
        </span>
        <span className="text-[#c0caf5]">Update</span>
        <span className="min-w-0 break-all">
          <span className="text-[#565f89]">(</span>
          <span className="text-[#7dcfff]">{file}</span>
          <span className="text-[#565f89]">)</span>
        </span>
      </div>
      {summary ? (
        <div className="flex min-w-0 items-baseline gap-2 text-[#8b8fa3]">
          {/* invisible status glyph spacer: aligns ⎿ under "Update" */}
          <span aria-hidden className="invisible shrink-0">
            ⏺
          </span>
          <span aria-hidden className="shrink-0" style={{ color: "#565f89" }}>
            ⎿
          </span>
          <span className="min-w-0 break-words">{summary}</span>
        </div>
      ) : null}

      <pre className="mt-1 min-w-0 overflow-x-auto rounded-none border border-[#202022] bg-[#101010] py-1.5 pl-2 pr-3">
        {lines.map((l, i) => {
          const bg =
            l.type === "add"
              ? "rgba(78, 169, 111,.10)"
              : l.type === "del"
                ? "rgba(247,118,142,.12)"
                : "transparent";
          const mark = l.type === "add" ? "+" : l.type === "del" ? "-" : " ";
          const markColor =
            l.type === "add" ? GREEN : l.type === "del" ? "#f7768e" : "#565f89";
          return (
            <div key={i} className="flex min-w-0" style={{ background: bg }}>
              <span
                className="w-9 shrink-0 select-none pr-2 text-right"
                style={{ color: "#3b3f52" }}
              >
                {l.n ?? ""}
              </span>
              <span className="w-3 shrink-0 select-none" style={{ color: markColor }}>
                {mark}
              </span>
              <span
                className="min-w-0 break-all"
                style={{
                  color: l.type === "ctx" ? "#8b8fa3" : "#c0caf5",
                }}
              >
                {l.type !== "ctx" ? (
                  <span className="sr-only">
                    {l.type === "add" ? "added: " : "removed: "}
                  </span>
                ) : null}
                {l.text}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
