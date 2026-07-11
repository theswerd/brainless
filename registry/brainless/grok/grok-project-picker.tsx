"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GrokProjectPicker — "Run Grok Build in a project directory?" chooser.
 *
 * Captured from a fresh launch outside a trusted project: left-border card
 * with `(○)` radios for recent dirs plus a free-text `z` option.
 */
const BORDER = "#808080";
const FG = "#e1e1e1";
const MUTED = "#8b8b90";
const DIM = "#6c6c6c";

export type GrokProject = {
  id: string;
  name: string;
  path: string;
  meta?: string;
};

const DEFAULT_PROJECTS: GrokProject[] = [
  {
    id: "current",
    name: "brainless",
    path: "~/dev/brainless",
    meta: "current",
  },
  {
    id: "cloudstate",
    name: "freestyle-cloudstate",
    path: "~/Documents/GitHub/freestyle-cloudstate",
    meta: "5h ago",
  },
  {
    id: "conduit",
    name: "Conduit",
    path: "~/Documents/Conduit",
    meta: "5h ago",
  },
];

export function GrokProjectPicker({
  title = "Run Grok Build in a project directory?",
  description = "This gives Grok Build full context of your codebase for better results.",
  projects = DEFAULT_PROJECTS,
  defaultSelected = 0,
  onChoose,
  className,
}: {
  title?: string;
  description?: string;
  projects?: GrokProject[];
  defaultSelected?: number;
  onChoose?: (index: number | "custom") => void;
  className?: string;
}) {
  const [sel, setSel] = React.useState(defaultSelected);
  const customIndex = projects.length;

  const options = [
    ...projects.map((p, i) => ({
      key: p.id,
      index: i,
      label: (
        <>
          <span style={{ color: FG }}>{p.name}</span>
          {p.meta === "current" ? (
            <span style={{ color: DIM }}> (current)</span>
          ) : null}
          <span style={{ color: DIM }}>  {p.path}</span>
          {p.meta && p.meta !== "current" ? (
            <span style={{ color: DIM }}>  ({p.meta})</span>
          ) : null}
        </>
      ),
    })),
    {
      key: "custom",
      index: customIndex,
      label: <span style={{ color: MUTED }}>Type your answer here</span>,
    },
  ];

  function onKey(e: React.KeyboardEvent, i: number) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next =
        e.key === "ArrowDown"
          ? (i + 1) % options.length
          : (i - 1 + options.length) % options.length;
      setSel(next);
      (e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSel(i);
      onChoose?.(i === customIndex ? "custom" : i);
    }
  }

  return (
    <div
      className={cn(
        "border-l-2 pl-3 font-mono text-[13px] leading-[1.55]",
        className,
      )}
      style={{ borderColor: BORDER }}
    >
      <div className="mb-1 font-semibold" style={{ color: FG }}>
        {title}
      </div>
      <p className="mb-2 max-w-prose" style={{ color: MUTED }}>
        {description}
      </p>

      <div role="radiogroup" aria-label={title} className="space-y-0.5">
        {options.map((opt) => {
          const active = sel === opt.index;
          const prefix = opt.index === customIndex ? "z" : String(opt.index + 1);
          return (
            <div
              key={opt.key}
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onKeyDown={(e) => onKey(e, opt.index)}
              onClick={() => {
                setSel(opt.index);
                onChoose?.(
                  opt.index === customIndex ? "custom" : opt.index,
                );
              }}
              className={cn(
                "flex cursor-pointer items-baseline gap-2 outline-none focus-visible:ring-1 focus-visible:ring-white/30",
                active && "font-semibold",
              )}
              style={{ color: active ? FG : MUTED }}
            >
              <span aria-hidden className="shrink-0 tabular-nums">
                {prefix}{" "}
                <span style={{ color: active ? FG : DIM }}>
                    {active ? "(●)" : "(○)"}
                  </span>
              </span>
              <span className="min-w-0 truncate">{opt.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-2 text-[12px]" style={{ color: DIM }}>
        ↑/↓ navigate · Enter:submit
      </div>
    </div>
  );
}
