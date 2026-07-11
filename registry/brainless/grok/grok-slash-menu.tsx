"use client";

import * as React from "react";
import { GrokPrompt } from "@/registry/brainless/grok/grok-prompt";
import { cn } from "@/lib/utils";

/**
 * GrokSlashMenu — Grok CLI's slash-command palette.
 *
 * Overlay above the rounded composer: active row marked with `❯`, inactive
 * rows indented. Type after `/` to filter; arrow keys move selection.
 */
export type GrokSlashCommand = { name: string; description: string };

const DEFAULT: GrokSlashCommand[] = [
  { name: "/quit", description: "Quit the application" },
  { name: "/help", description: "Browse commands and keyboard shortcuts" },
  { name: "/docs", description: "Open How-to Guides or online Build docs" },
  { name: "/home", description: "Return to the welcome screen" },
  { name: "/new", description: "Start a new session" },
  { name: "/fork", description: "Branch the current session into a peer agent" },
];

const ACTIVE = "#e1e1e1";
const INACTIVE = "#8b8b90";
const RULE = "#505058";
const NAME_COLS = 16;

export function GrokSlashMenu({
  commands = DEFAULT,
  className,
}: {
  commands?: GrokSlashCommand[];
  className?: string;
}) {
  const [value, setValue] = React.useState("/");
  const [active, setActive] = React.useState(0);

  const query = value.startsWith("/") ? value.slice(1) : value;
  const list = commands.filter((c) =>
    c.name.slice(1).toLowerCase().startsWith(query.toLowerCase()),
  );
  const clampedActive = list.length ? Math.min(active, list.length - 1) : 0;

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!list.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % list.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + list.length) % list.length);
    }
  }

  return (
    <div className={cn("font-mono text-[13px] leading-[1.55]", className)}>
      <div
        className="mb-2 border-y py-1.5"
        style={{ borderColor: RULE }}
        role="listbox"
        aria-label="Slash commands"
        aria-activedescendant={
          list.length ? `grok-slash-${clampedActive}` : undefined
        }
      >
        <ul className="space-y-0.5">
          {list.map((c, i) => {
            const activeRow = i === clampedActive;
            return (
              <li
                key={c.name}
                id={`grok-slash-${i}`}
                role="option"
                aria-selected={activeRow}
                onMouseEnter={() => setActive(i)}
                className="flex cursor-pointer items-baseline gap-2 truncate px-1"
                style={{ color: activeRow ? ACTIVE : INACTIVE }}
              >
                <span
                  aria-hidden
                  className="inline-block w-[2ch] shrink-0"
                  style={{ color: activeRow ? ACTIVE : "transparent" }}
                >
                  ❯
                </span>
                <span
                  className="inline-block shrink-0"
                  style={{ width: `${NAME_COLS}ch` }}
                >
                  {c.name}
                </span>
                <span className="min-w-0 truncate">{c.description}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <GrokPrompt
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        mode="always-approve"
        showShortcuts={false}
      />
    </div>
  );
}
