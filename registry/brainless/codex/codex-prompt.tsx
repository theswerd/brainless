"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CodexPrompt — Codex CLI's input composer.
 *
 * The input sits on a full-width gray surface (Codex `user_message_bg`: white
 * blended at 12% over the terminal background — `#353535` on `--term-bg`
 * `#1a1a1a`). No top/bottom rules. One blank row of that surface pads above
 * and below the `›` line; the status row sits outside it.
 */
export type CodexMode = "default" | "plan";

const MODEL = "#f6e2b7"; // 38;2;246;226;183
const CWD = "#abdfa7"; // 38;2;171;223;167
const PLAN = "#bb9af7"; // 38;5;5 → tokyo magenta (not hot pink)
const DIM = "#7a7a7a";
const FG = "#ededed";
/** Codex `user_message_bg` for `--term-bg` #1a1a1a (white @ 12%). */
const INPUT_BG = "#353535";

export function CodexPrompt({
  value,
  defaultValue = "",
  onChange,
  onKeyDown,
  placeholder = "Use /skills to list available skills",
  mode = "default",
  model = "gpt-5.6-sol low",
  directory = "~/dev/brainless",
  className,
  inputClassName,
}: {
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  mode?: CodexMode;
  model?: string;
  directory?: string;
  className?: string;
  inputClassName?: string;
}) {
  const controlled = value !== undefined;
  const displayModel =
    mode === "plan" && model.includes(" low")
      ? model.replace(" low", " medium")
      : model;

  return (
    <div className={cn("font-mono text-[13px] leading-[1.6]", className)}>
      <div
        className="py-[1lh] pr-[1ch]"
        style={{ background: INPUT_BG, color: FG }}
      >
        <div className="flex items-center">
          <span aria-hidden className="inline-block w-[2ch] shrink-0 font-bold">
            ›
          </span>
          <input
            type="text"
            aria-label="Prompt"
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            {...(controlled
              ? { value, onChange }
              : { defaultValue, onChange })}
            className={cn(
              "term-input min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#7a7a7a]",
              inputClassName,
            )}
            style={
              {
                color: FG,
                caretColor: FG,
                caretShape: "block",
              } as React.CSSProperties
            }
          />
        </div>
      </div>

      <div className="flex flex-wrap items-baseline gap-x-3 pl-[2ch] text-[12px]">
        <span>
          <span style={{ color: MODEL }}>{displayModel}</span>
          <span style={{ color: DIM }}> · </span>
          <span style={{ color: CWD }}>{directory}</span>
        </span>
        {mode === "plan" ? (
          <span className="ml-auto" style={{ color: PLAN }}>
            Plan mode (shift+tab to cycle)
          </span>
        ) : null}
      </div>
    </div>
  );
}
