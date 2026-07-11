import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CodexDiff — Codex CLI's full-screen `/diff` pager.
 *
 * Captured grammar (v0.132): a spaced `D I F F` title bar padded with `/`,
 * unified git diff body, vim-style `~` fillers, a percentage footer, and
 * scroll / quit hints.
 */
export type CodexDiffLine = {
  type: "meta" | "hunk" | "add" | "del" | "ctx" | "fill";
  text: string;
};

const FG = "#ededed";
const DIM = "#7a7a7a";
const GREEN = "#abdfa7";
const RED = "#f2a0a0";
const META = "#f6e2b7";

const DEFAULT_LINES: CodexDiffLine[] = [
  { type: "meta", text: "diff --git a/scratch.txt b/scratch.txt" },
  { type: "meta", text: "index e382994..401fe17 100644" },
  { type: "meta", text: "--- a/scratch.txt" },
  { type: "meta", text: "+++ b/scratch.txt" },
  { type: "hunk", text: "@@ -1 +1 @@" },
  { type: "del", text: "-hello scratch" },
  { type: "add", text: "+hello scratch edited" },
  { type: "meta", text: "diff --git a/other.txt b/other.txt" },
  { type: "meta", text: "new file mode 100644" },
  { type: "meta", text: "index 0000000..fa49b07" },
  { type: "meta", text: "--- /dev/null" },
  { type: "meta", text: "+++ b/other.txt" },
  { type: "hunk", text: "@@ -0,0 +1 @@" },
  { type: "add", text: "+new file" },
];

function titleBar(cols = 80) {
  const label = "D I F F";
  const inner = `/ ${label} ${"/ ".repeat(40)}`.trimEnd();
  return (inner + " /".repeat(cols)).slice(0, cols);
}

function lineColor(type: CodexDiffLine["type"]) {
  switch (type) {
    case "add":
      return GREEN;
    case "del":
      return RED;
    case "hunk":
      return META;
    case "fill":
      return DIM;
    default:
      return FG;
  }
}

export function CodexDiff({
  lines = DEFAULT_LINES,
  percent = 100,
  fillRows = 8,
  className,
}: {
  lines?: CodexDiffLine[];
  percent?: number;
  fillRows?: number;
  className?: string;
}) {
  const body = [
    ...lines,
    ...Array.from({ length: fillRows }, () => ({
      type: "fill" as const,
      text: "~",
    })),
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-none border border-[#2a2a2a] bg-[#1a1a1a] font-mono text-[13px] leading-[1.45]",
        className,
      )}
      role="region"
      aria-label="Diff pager"
    >
      <div
        className="truncate px-2 py-1 text-[12px] tracking-wide"
        style={{ color: DIM, background: "#121212" }}
      >
        {titleBar(88)}
      </div>

      <pre className="overflow-x-auto px-2 py-1.5">
        {body.map((l, i) => (
          <div key={i} style={{ color: lineColor(l.type) }}>
            {l.type === "add" ? (
              <span className="sr-only">added: </span>
            ) : l.type === "del" ? (
              <span className="sr-only">removed: </span>
            ) : null}
            {l.text}
          </div>
        ))}
      </pre>

      <div
        className="border-t px-2 py-1 text-[12px]"
        style={{ borderColor: "#2a2a2a", color: DIM }}
      >
        <div className="flex items-center justify-end">
          <span>{percent}%</span>
        </div>
        <div className="mt-0.5">↑/↓ to scroll · pgup/pgdn to page · home/end to jump</div>
        <div>
          <kbd className="font-semibold" style={{ color: FG }}>
            q
          </kbd>{" "}
          to quit
        </div>
      </div>
    </div>
  );
}
