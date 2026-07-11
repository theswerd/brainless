"use client";

import * as React from "react";
import { CodexPrompt } from "@/registry/brainless/codex/codex-prompt";
import { cn } from "@/lib/utils";

/**
 * CodexSlashMenu — Codex CLI's slash-command palette.
 *
 * Flat list under the `›` composer: padded command name + description.
 * Type after `/` to filter; arrow keys move the active row.
 */
export type CodexSlashCommand = { name: string; description: string };

const DEFAULT: CodexSlashCommand[] = [
  { name: "/model", description: "choose what model and reasoning effort to use" },
  { name: "/permissions", description: "choose what Codex is allowed to do" },
  { name: "/diff", description: "show the unified diff for this session" },
  { name: "/review", description: "review a pull request or local changes" },
  { name: "/status", description: "show model, limits, and session info" },
  { name: "/compact", description: "summarize the conversation to save context" },
];

const ACTIVE = "#ededed";
const INACTIVE = "#7a7a7a";
const NAME_COLS = 16;

export function CodexSlashMenu({
  commands = DEFAULT,
  className,
}: {
  commands?: CodexSlashCommand[];
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
    <div className={cn("font-mono text-[13px] leading-[1.6]", className)}>
      <CodexPrompt
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        placeholder=""
        mode="default"
      />

      <ul
        role="listbox"
        aria-label="Slash commands"
        aria-activedescendant={
          list.length ? `codex-slash-${clampedActive}` : undefined
        }
        className="mt-2 space-y-0.5 pl-[2ch]"
      >
        {list.map((c, i) => {
          const activeRow = i === clampedActive;
          return (
            <li
              key={c.name}
              id={`codex-slash-${i}`}
              role="option"
              aria-selected={activeRow}
              onMouseEnter={() => setActive(i)}
              className="cursor-pointer truncate"
              style={{ color: activeRow ? ACTIVE : INACTIVE }}
            >
              <span
                className="inline-block"
                style={{ width: `${NAME_COLS}ch` }}
              >
                {c.name}
              </span>
              {c.description}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
