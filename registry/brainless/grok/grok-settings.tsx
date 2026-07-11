"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GrokSettings — Grok CLI's Settings modal (F2 / Ctrl+,).
 *
 * Captured grammar (v0.2.93): section headers (`Appearance`, `Mouse`), rows
 * with a `▸` marker, current value on the right (`on` / `off` / theme name ›).
 */
const BORDER = "#505058";
const FG = "#e1e1e1";
const MUTED = "#8b8b90";
const DIM = "#6c6c6c";

export type GrokSettingValue = string | boolean;

export type GrokSetting = {
  id: string;
  label: string;
  value: GrokSettingValue;
  /** Show a › affordance (nested picker). */
  expandable?: boolean;
};

export type GrokSettingSection = {
  id: string;
  label: string;
  items: GrokSetting[];
};

const DEFAULT_SECTIONS: GrokSettingSection[] = [
  {
    id: "appearance",
    label: "Appearance",
    items: [
      { id: "compact", label: "Compact mode", value: false },
      { id: "timestamps", label: "Show timestamps", value: true },
      { id: "vim-input", label: "Disable vim input mode", value: true },
      { id: "vim-scroll", label: "Vim scrollback navigation", value: false },
      { id: "theme", label: "Theme", value: "Grok Night", expandable: true },
      {
        id: "auto-dark",
        label: "Auto dark theme",
        value: "Grok Night",
        expandable: true,
      },
      {
        id: "auto-light",
        label: "Auto light theme",
        value: "Grok Day",
        expandable: true,
      },
      {
        id: "mermaid",
        label: "Render Mermaid diagrams",
        value: "Auto",
        expandable: true,
      },
      { id: "thoughts-width", label: "Max thoughts width", value: "120" },
      { id: "thinking-blocks", label: "Show thinking blocks", value: true },
      { id: "manual-folds", label: "Respect manual folds", value: false },
      { id: "group-tools", label: "Group tool calls", value: true },
    ],
  },
  {
    id: "mouse",
    label: "Mouse",
    items: [
      { id: "mouse-support", label: "Enable mouse support", value: true },
    ],
  },
];

function formatValue(v: GrokSettingValue) {
  if (typeof v === "boolean") return v ? "on" : "off";
  return v;
}

export function GrokSettings({
  sections = DEFAULT_SECTIONS,
  defaultActive = "timestamps",
  onClose,
  onToggle,
  className,
}: {
  sections?: GrokSettingSection[];
  defaultActive?: string;
  onClose?: () => void;
  onToggle?: (id: string) => void;
  className?: string;
}) {
  const flat = sections.flatMap((s) => s.items);
  const [active, setActive] = React.useState(defaultActive);
  const [values, setValues] = React.useState<Record<string, GrokSettingValue>>(
    () => Object.fromEntries(flat.map((i) => [i.id, i.value])),
  );

  function activate(id: string) {
    setActive(id);
  }

  function toggle(id: string) {
    setValues((prev) => {
      const cur = prev[id];
      if (typeof cur === "boolean") {
        const next = !cur;
        onToggle?.(id);
        return { ...prev, [id]: next };
      }
      onToggle?.(id);
      return prev;
    });
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-sm border font-mono text-[13px] leading-[1.5]",
        className,
      )}
      style={{ borderColor: BORDER, background: "#1a1a1a" }}
      role="dialog"
      aria-label="Settings"
    >
      <div
        className="flex items-center justify-between border-b px-3 py-1.5"
        style={{ borderColor: BORDER, color: MUTED }}
      >
        <span style={{ color: FG }}>Settings</span>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="rounded-none px-1 outline-none hover:text-white focus-visible:ring-1 focus-visible:ring-white/40"
          style={{ color: DIM }}
        >
          [✗]
        </button>
      </div>

      <div className="px-3 py-2 text-[12px]" style={{ color: DIM }}>
        / to search
      </div>

      <div className="max-h-[24rem] overflow-auto pb-2">
        {sections.map((section) => (
          <div key={section.id} className="mt-1">
            <div
              className="px-3 py-1 text-[12px]"
              style={{ color: DIM }}
            >
              {section.label}{" "}
              <span aria-hidden>{"─".repeat(12)}</span>
            </div>
            <ul>
              {section.items.map((item) => {
                const isActive = active === item.id;
                const display = formatValue(values[item.id] ?? item.value);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        activate(item.id);
                        if (typeof (values[item.id] ?? item.value) === "boolean") {
                          toggle(item.id);
                        }
                      }}
                      onFocus={() => activate(item.id)}
                      className="flex w-full items-baseline justify-between gap-4 px-3 py-0.5 text-left outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/30"
                      style={{
                        background: isActive ? "rgba(255,255,255,0.06)" : undefined,
                        color: FG,
                      }}
                    >
                      <span className="flex min-w-0 items-baseline gap-2">
                        <span
                          aria-hidden
                          className="inline-block w-[2ch] shrink-0"
                          style={{ color: isActive ? FG : "transparent" }}
                        >
                          ▸
                        </span>
                        <span className="truncate" style={{ color: MUTED }}>
                          {item.label}
                        </span>
                      </span>
                      <span
                        className="shrink-0 tabular-nums"
                        style={{ color: FG }}
                      >
                        {display}
                        {item.expandable ? (
                          <span style={{ color: DIM }}>  ›</span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="border-t px-3 py-2 text-center text-[12px]"
        style={{ borderColor: BORDER, color: DIM }}
      >
        Tip · Ask Grok to change a setting
      </div>
      <div
        className="border-t px-3 py-1.5 text-[11px]"
        style={{ borderColor: BORDER, color: DIM }}
      >
        ↑/↓ nav · Space toggle · → expand · F2/Esc close
      </div>
    </div>
  );
}
