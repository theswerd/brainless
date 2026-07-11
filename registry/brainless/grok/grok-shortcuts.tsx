"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GrokShortcuts — Grok CLI's Keyboard Shortcuts modal (Ctrl+x).
 *
 * Nested categories with ◆ rows for expanded sections and › for collapsed
 * ones. Arrow keys / e expand; Esc closes.
 */
const BORDER = "#808080";
const FG = "#e1e1e1";
const MUTED = "#8b8b90";
const DIM = "#6c6c6c";
const MARK = "#808080"; // 38;5;8 — ◆ / › markers

export type GrokShortcut = { action: string; keys: string };
export type GrokShortcutGroup = {
  id: string;
  label: string;
  items: GrokShortcut[];
  /** Display count when collapsed; defaults to items.length. */
  count?: number;
};

const DEFAULT_GROUPS: GrokShortcutGroup[] = [
  {
    id: "essentials",
    label: "Essentials",
    items: [
      { action: "Send", keys: "Enter" },
      { action: "Focus scrollback", keys: "Tab" },
      { action: "Cancel turn", keys: "Ctrl+c" },
      { action: "Cycle mode (Normal / Plan / Always-approve)", keys: "Shift+Tab" },
      { action: "Quit", keys: "Ctrl+q / Ctrl+d" },
      { action: "Command palette", keys: "Ctrl+p / ?" },
      { action: "Keyboard shortcuts", keys: "Ctrl+x / Ctrl+." },
      { action: "Open the settings modal", keys: "F2 / Ctrl+, / Cmd+," },
    ],
  },
  {
    id: "input",
    label: "Input",
    items: [
      {
        action: "Send now while running (interject)",
        keys: "Ctrl+Enter / Ctrl+i",
      },
      {
        action: "Voice dictation (Ctrl+Space / F8)",
        keys: "Ctrl+Space / F8",
      },
      { action: "Search prompt history", keys: "Ctrl+r" },
      { action: "Toggle multiline", keys: "Ctrl+m" },
      {
        action: "Shell mode (type ! on empty prompt)",
        keys: "!",
      },
    ],
  },
  // Counts confirmed live; item lists need a re-auth pass (probe hit /logout).
  { id: "nav", label: "Conversation Navigation", count: 10, items: [] },
  { id: "actions", label: "Conversation Actions", count: 4, items: [] },
  { id: "panels", label: "Panels", count: 6, items: [] },
  {
    id: "session",
    label: "Session",
    items: [
      { action: "New session", keys: "Ctrl+n" },
      { action: "Resume session", keys: "Ctrl+s" },
      { action: "New worktree", keys: "Ctrl+w" },
    ],
  },
  { id: "dashboard", label: "Dashboard", count: 17, items: [] },
];

export function GrokShortcuts({
  groups = DEFAULT_GROUPS,
  defaultExpanded = "essentials",
  onClose,
  className,
}: {
  groups?: GrokShortcutGroup[];
  defaultExpanded?: string | null;
  onClose?: () => void;
  className?: string;
}) {
  const [expanded, setExpanded] = React.useState<string | null>(defaultExpanded);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-sm border font-mono text-[13px] leading-[1.5]",
        className,
      )}
      style={{ borderColor: BORDER, background: "#1a1a1a" }}
      role="dialog"
      aria-label="Keyboard Shortcuts"
    >
      <div
        className="flex items-center justify-between border-b px-3 py-1.5"
        style={{ borderColor: BORDER, color: MUTED }}
      >
        <span style={{ color: FG }}>Keyboard Shortcuts</span>
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

      <div className="border-t" style={{ borderColor: BORDER }} />

      <ul className="max-h-[22rem] overflow-auto py-1.5">
        {groups.map((g) => {
          const open = expanded === g.id;
          const count = g.count ?? g.items.length;
          return (
            <li key={g.id}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setExpanded(open ? null : g.id)}
                className="flex w-full items-baseline gap-2 px-3 py-0.5 text-left outline-none hover:bg-white/5 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/30"
                style={{ color: FG }}
              >
                <span
                  aria-hidden
                  className="inline-block w-[2ch] shrink-0"
                  style={{ color: open ? FG : MARK }}
                >
                  {open ? "◆" : "›"}
                </span>
                <span>
                  {g.label}
                  {!open ? (
                    <span style={{ color: DIM }}> ({count})</span>
                  ) : null}
                </span>
              </button>

              {open ? (
                g.items.length ? (
                  <ul className="pb-1">
                    {g.items.map((item) => (
                      <li
                        key={item.action}
                        className="flex items-baseline justify-between gap-4 py-0.5 pr-3 pl-7"
                      >
                        <span className="flex min-w-0 items-baseline gap-2">
                          <span aria-hidden style={{ color: MARK }}>
                            ◆
                          </span>
                          <span style={{ color: MUTED }}>{item.action}</span>
                        </span>
                        <span
                          className="shrink-0 tabular-nums"
                          style={{ color: FG }}
                        >
                          {item.keys}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    className="px-3 pb-1 pl-7 text-[12px]"
                    style={{ color: DIM }}
                  >
                    {count} shortcuts — expand details after re-auth capture
                  </p>
                )
              ) : null}
            </li>
          );
        })}
      </ul>

      <div
        className="border-t px-3 py-1.5 text-[11px]"
        style={{ borderColor: BORDER, color: DIM }}
      >
        ↑/↓ nav · e/Space/→ expand · ← collapse · Esc close
      </div>
    </div>
  );
}
