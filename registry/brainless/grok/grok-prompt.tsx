"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GrokPrompt — Grok CLI's rounded composer box.
 *
 * CSS border (no box-drawing glyphs) around a real text input. The model · mode
 * legend sits on the bottom edge like a fieldset legend. Plan mode tints the ❯
 * yellow; legend mode text stays muted gray.
 */
export type GrokMode =
  | "normal"
  | "plan"
  | "auto"
  | "always-approve"
  | "plan-approval";

const BORDER = "#505058";
const FG = "#e1e1e1";
const MUTED = "#6c6c6c";
const SEP = "#585858";
const PLAN = "#ffff00"; // 38;5;11 — plan caret only
const SURFACE = "#1a1a1a"; // matches --term-bg so the legend punches the border

const MODE_LABEL: Record<GrokMode, string | null> = {
  normal: null,
  plan: "plan",
  auto: "auto",
  "always-approve": "always-approve",
  "plan-approval": "plan approval",
};

export function GrokPrompt({
  value,
  defaultValue = "",
  onChange,
  onKeyDown,
  placeholder = "",
  mode = "always-approve",
  model = "Grok 4.5 (xhigh)",
  showShortcuts = true,
  busy = false,
  className,
  inputClassName,
}: {
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  mode?: GrokMode;
  model?: string;
  showShortcuts?: boolean;
  /** Mid-turn: insert Ctrl+c:cancel into the shortcut hint row. */
  busy?: boolean;
  className?: string;
  inputClassName?: string;
}) {
  const controlled = value !== undefined;
  const modeLabel = MODE_LABEL[mode];
  const caretColor = mode === "plan" || mode === "plan-approval" ? PLAN : FG;
  const legend = modeLabel ? `${model} · ${modeLabel}` : model;

  return (
    <div className={cn("font-mono text-[13px] leading-[1.5]", className)}>
      <div
        className="relative rounded-sm border px-2 py-1.5"
        style={{ borderColor: BORDER, background: SURFACE }}
      >
        <div className="flex items-center gap-0">
          <span
            aria-hidden
            className="shrink-0"
            style={{ color: caretColor }}
          >
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
              "term-input min-w-0 flex-1 bg-transparent py-0.5 pl-[1ch] outline-none placeholder:text-[#6c6c6c]",
              inputClassName,
            )}
            style={
              {
                color: FG,
                caretColor,
                caretShape: "block",
              } as React.CSSProperties
            }
          />
        </div>

        {/* legend punched into the bottom border */}
        <span
          className="absolute -bottom-2.5 right-3 max-w-[min(100%,28rem)] truncate px-1 text-[12px]"
          style={{ background: SURFACE, color: MUTED }}
          title={legend}
        >
          <span>{model}</span>
          {modeLabel ? (
            <>
              <span style={{ color: SEP }}> · </span>
              <span>{modeLabel}</span>
            </>
          ) : null}
        </span>
      </div>

      {showShortcuts ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]" style={{ color: MUTED }}>
          <span>
            <span className="font-semibold" style={{ color: FG }}>
              Shift+Tab
            </span>
            :mode
          </span>
          {busy ? (
            <>
              <span
                aria-hidden
                className="inline-block h-3 w-px"
                style={{ background: SEP }}
              />
              <span>
                <span className="font-semibold" style={{ color: FG }}>
                  Ctrl+c
                </span>
                :cancel
              </span>
            </>
          ) : null}
          <span
            aria-hidden
            className="inline-block h-3 w-px"
            style={{ background: SEP }}
          />
          <span>
            <span className="font-semibold" style={{ color: FG }}>
              Ctrl+x
            </span>
            :shortcuts
          </span>
        </div>
      ) : null}
    </div>
  );
}
