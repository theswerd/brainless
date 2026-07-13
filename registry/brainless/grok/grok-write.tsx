import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GrokWrite — Grok CLI's inline write/edit chrome.
 *
 * Captured grammar (v0.2.93): a `┃` gutter with line-numbered before/after
 * rows, a `───` rule, then optional hook sections with ✓ / ✗ results.
 */
export type GrokWriteLine = {
  n?: number;
  text: string;
  kind?: "before" | "after";
};

export type GrokHookResult = {
  label: string;
  ok: boolean;
  detail?: string;
  ms?: number;
};

const BORDER = "#808080";
const FG = "#e1e1e1";
const MUTED = "#8b8b90";
const DIM = "#6c6c6c";
const OK = "#00ff00"; // 38;5;10
const BAD = "#ff0000"; // 38;5;9

export function GrokWrite({
  before = [{ n: 1, text: "hello" }],
  after = [{ n: 1, text: "world" }],
  hooks,
  className,
}: {
  before?: GrokWriteLine[];
  after?: GrokWriteLine[];
  hooks?: { pre?: GrokHookResult[]; post?: GrokHookResult[] };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 border-l-2 pl-3 font-mono text-[13px] leading-[1.55]",
        className,
      )}
      style={{ borderColor: BORDER }}
      role="region"
      aria-label="Write preview"
    >
      <div className="min-w-0 space-y-0.5" style={{ color: MUTED }}>
        {before.map((l, i) => (
          <div key={`b-${i}`} className="flex min-w-0 gap-2">
            <span
              aria-hidden
              className="w-4 shrink-0 select-none text-right tabular-nums"
              style={{ color: DIM }}
            >
              {l.n ?? ""}
            </span>
            <span className="sr-only">before: </span>
            <span className="min-w-0 break-all" style={{ color: FG }}>
              {l.text}
            </span>
          </div>
        ))}
        {after.map((l, i) => (
          <div key={`a-${i}`} className="flex min-w-0 gap-2">
            <span
              aria-hidden
              className="w-4 shrink-0 select-none text-right tabular-nums"
              style={{ color: DIM }}
            >
              {l.n ?? ""}
            </span>
            <span className="sr-only">after: </span>
            <span className="min-w-0 break-all" style={{ color: FG }}>
              {l.text}
            </span>
          </div>
        ))}
      </div>

      {hooks ? (
        <div className="mt-2 space-y-1" style={{ color: MUTED }}>
          <div aria-hidden style={{ color: DIM }}>
            ───
          </div>
          {hooks.pre?.length ? (
            <HookBlock title="pre_tool_use" results={hooks.pre} />
          ) : null}
          {hooks.post?.length ? (
            <HookBlock title="post_tool_use" results={hooks.post} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function HookBlock({
  title,
  results,
}: {
  title: string;
  results: GrokHookResult[];
}) {
  return (
    <div>
      <div style={{ color: DIM }}>{title}</div>
      <ul className="mt-0.5 space-y-0.5 pl-2">
        {results.map((r, i) => (
          <li key={i}>
            <span style={{ color: r.ok ? OK : BAD }} aria-hidden>
              {r.ok ? "✓" : "✗"}
            </span>{" "}
            <span style={{ color: MUTED }}>{r.label}</span>
            {r.ms != null ? (
              <span style={{ color: DIM }}> ({r.ms}ms)</span>
            ) : null}
            {r.detail ? (
              <div className="pl-4 text-[12px]" style={{ color: DIM }}>
                {r.detail}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
