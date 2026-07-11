"use client";

import * as React from "react";
import { ClaudePrompt } from "@/registry/brainless/claude/claude-prompt";
import { cn } from "@/lib/utils";

/**
 * ClaudeSlashMenu — Claude Code's slash-command palette.
 *
 * The command list sits above the real ClaudePrompt composer. Typing after
 * `/` in that input filters by command-name prefix; arrow keys move the
 * active option. Active rows are light blue; inactive rows are gray. Both
 * keep the same fixed-width name column so selection never shifts text.
 */
export type SlashCommand = { name: string; description: string };

const DEFAULT: SlashCommand[] = [
  { name: "/agents", description: "Manage subagents for specialized tasks" },
  { name: "/clear", description: "Clear conversation history and free up context" },
  { name: "/compact", description: "Summarize the conversation to save context" },
  { name: "/init", description: "Initialize a CLAUDE.md with codebase docs" },
  { name: "/model", description: "Change the model for this session" },
  { name: "/review", description: "Review a pull request" },
];

const ACTIVE = "#afd7ff"; // 38;5;153
const INACTIVE = "#949494"; // 38;5;246
const NAME_COLS = 37; // matches Claude Code's padded name column

export function ClaudeSlashMenu({
  commands = DEFAULT,
  className,
}: {
  commands?: SlashCommand[];
  className?: string;
}) {
  const [value, setValue] = React.useState("/");
  const [active, setActive] = React.useState(0);

  const query = value.startsWith("/") ? value.slice(1) : value;
  const list = commands.filter((c) =>
    c.name.slice(1).toLowerCase().startsWith(query.toLowerCase()),
  );
  const clampedActive = list.length
    ? Math.min(active, list.length - 1)
    : 0;

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
      <ul
        role="listbox"
        aria-label="Slash commands"
        aria-activedescendant={
          list.length ? `slash-${clampedActive}` : undefined
        }
        className="mb-2 space-y-0.5"
      >
        {list.map((c, i) => {
          const activeRow = i === clampedActive;
          return (
            <li
              key={c.name}
              id={`slash-${i}`}
              role="option"
              aria-selected={activeRow}
              onMouseEnter={() => setActive(i)}
              className="cursor-pointer truncate px-1 py-0.5"
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

      <ClaudePrompt
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        mode="auto"
      />
    </div>
  );
}
