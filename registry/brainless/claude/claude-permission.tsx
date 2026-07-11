"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ClaudePermission — Claude Code's "Do you want to proceed?" approval box.
 *
 * In the terminal it's a numbered list you drive with arrow keys; here it's a
 * real radiogroup — arrow keys move selection, Enter/Space choose, and each
 * option is a proper radio for assistive tech.
 */
const ROSE = "#cd694a";

export function ClaudePermission({
  title = "Bash command",
  command = "rm -rf node_modules",
  question = "Do you want to proceed?",
  options = [
    "Yes",
    "Yes, and don't ask again this session",
    "No, and tell Claude what to do (esc)",
  ],
  defaultSelected = 0,
  onChoose,
  className,
}: {
  title?: string;
  command?: string;
  question?: string;
  options?: string[];
  defaultSelected?: number;
  onChoose?: (index: number) => void;
  className?: string;
}) {
  const [sel, setSel] = React.useState(defaultSelected);

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
      onChoose?.(i);
    }
  }

  return (
    <fieldset
      className={cn(
        "rounded-none border px-3.5 py-2.5 font-mono text-[13px] leading-[1.6]",
        className,
      )}
      style={{ borderColor: ROSE }}
    >
      <legend className="px-2" style={{ color: ROSE }}>
        {title}
      </legend>
      <div className="text-[#c0caf5]">{command}</div>
      <div className="mb-1.5 mt-2 text-[#c0caf5]">{question}</div>
      <div role="radiogroup" aria-label={question}>
        {options.map((opt, i) => {
          const active = sel === i;
          return (
            <div
              key={i}
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onKeyDown={(e) => onKey(e, i)}
              onClick={() => {
                setSel(i);
                onChoose?.(i);
              }}
              className="flex cursor-pointer items-baseline gap-2 rounded px-1 py-0.5 outline-none focus-visible:ring-1 focus-visible:ring-[#7dcfff]/60"
              style={{ background: active ? `${ROSE}1f` : "transparent" }}
            >
              <span
                aria-hidden
                style={{ color: active ? ROSE : "transparent", width: "1ch" }}
              >
                ❯
              </span>
              <span
                style={{ color: active ? "#c0caf5" : "#8b8fa3" }}
                className={active ? "font-semibold" : undefined}
              >
                {i + 1}. {opt}
              </span>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
