"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ClaudePrompt — Claude Code's input composer.
 *
 * Dual CSS rules around a real text input (❯ prefix), effort chip above, and a
 * mode line below. Mode colors/glyphs match shift+tab captures:
 *   auto          ⏵⏵ gold
 *   manual        ⏸  gray
 *   accept-edits  ⏵⏵ lavender
 *   plan          ⏸  teal
 *
 * Effort chips match `/effort` captures (glyph fills as effort rises):
 *   low ○ · medium ◐ · high ● · xhigh ◉ · max ◈ · ultracode ✦
 * Ultracode also paints the prompt rules as a rainbow cycle.
 */
export type ClaudeMode = "auto" | "manual" | "accept-edits" | "plan";

export type ClaudeEffort =
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "max"
  | "ultracode";

const FG = "#c0caf5";
const GRAY = "#949494";
const RULE = "#808080"; // 38;5;244

/** Ultracode prompt-rule cycle from live captures (38;5;146→182→210→216→222→151). */
const ULTRACODE_RAINBOW =
  "linear-gradient(90deg,#afafd7,#d7afd7,#ff87af,#ffaf87,#ffd787,#afd787,#afafd7)";

const MODES: Record<
  ClaudeMode,
  { glyph: string; label: string; color: string; hint: string }
> = {
  auto: {
    glyph: "⏵⏵",
    label: "auto mode on",
    color: "#ffd700", // 38;5;220
    hint: "(shift+tab to cycle) · ← for agents",
  },
  manual: {
    glyph: "⏸",
    label: "manual mode on",
    color: GRAY,
    hint: "· ? for shortcuts · ← for agents",
  },
  "accept-edits": {
    glyph: "⏵⏵",
    label: "accept edits on",
    color: "#afafd7", // 38;5;147
    hint: "(shift+tab to cycle) · ← for agents",
  },
  plan: {
    glyph: "⏸",
    label: "plan mode on",
    color: "#5fafaf", // 38;5;73
    hint: "(shift+tab to cycle) · ← for agents",
  },
};

const EFFORTS: Record<
  ClaudeEffort,
  { glyph: string; label: string; rainbow?: boolean }
> = {
  low: { glyph: "○", label: "low · /effort" },
  medium: { glyph: "◐", label: "medium · /effort" },
  high: { glyph: "●", label: "high · /effort" },
  xhigh: { glyph: "◉", label: "xhigh · /effort" },
  max: { glyph: "◈", label: "max · /effort" },
  ultracode: {
    glyph: "✦",
    label: "ultracode · xhigh effort + dynamic workflows for maximum thoroughness",
    rainbow: true,
  },
};

export function ClaudePrompt({
  value,
  defaultValue = "",
  onChange,
  onKeyDown,
  placeholder = "",
  mode = "auto",
  effort = "xhigh",
  className,
  inputClassName,
}: {
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  mode?: ClaudeMode;
  /** Effort chip above the prompt. Pass `false` to hide. */
  effort?: ClaudeEffort | false;
  className?: string;
  inputClassName?: string;
}) {
  const m = MODES[mode];
  const e = effort === false ? null : EFFORTS[effort];
  const controlled = value !== undefined;
  const rainbow = Boolean(e?.rainbow);

  return (
    <div className={cn("min-w-0 font-mono text-[13px] leading-[1.6]", className)}>
      {e ? (
        <div
          className="flex justify-end px-1 pb-1 text-[12px]"
          style={{ color: GRAY }}
        >
          <span className="min-w-0 break-words text-right">
            <span aria-hidden>{e.glyph}</span> {e.label}
          </span>
        </div>
      ) : null}

      <div
        className="flex min-w-0 items-center gap-0 border-y py-0.5"
        style={
          rainbow
            ? {
                borderImageSource: ULTRACODE_RAINBOW,
                borderImageSlice: 1,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderTopStyle: "solid",
                borderBottomStyle: "solid",
              }
            : { borderColor: RULE }
        }
      >
        <span aria-hidden className="shrink-0 pl-0 pr-0" style={{ color: FG }}>
          ❯
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
            "term-input min-w-0 flex-1 bg-transparent py-0.5 pl-[1ch] outline-none placeholder:text-[#565f89]",
            inputClassName,
          )}
          style={{ color: FG, caretColor: FG, caretShape: "block" } as React.CSSProperties}
        />
      </div>

      <div className="mt-1.5 min-w-0 break-words px-1 text-[12px]">
        <span style={{ color: m.color }}>
          <span aria-hidden>{m.glyph} </span>
          {m.label}
        </span>
        {m.hint ? <span style={{ color: GRAY }}> {m.hint}</span> : null}
      </div>
    </div>
  );
}
