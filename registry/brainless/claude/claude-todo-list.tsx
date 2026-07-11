import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ClaudeTodoList — Claude Code's task list (TaskCreate / TaskUpdate).
 *
 * Capture grammar (v2.1.207), with one intentional deviation: icons stay in a
 * single column. Real Claude puts `  ⎿\u00a0` before the first ✔ (space + nbsp),
 * which shoves that check a cell right of a natural `⎿ ` pairing — we use a
 * single space after ⎿ so ✔ / ◼ / ◻ line up.
 *
 *   ⎿ ✔ done     (green + strikethrough)
 *     ◼ active   (terracotta + bold)
 *     ◻ pending  (default foreground)
 */
export type Todo = {
  label: string;
  status: "done" | "active" | "todo";
};

const DONE = "#87d787"; // 38;5;114
const ACTIVE = "#d78787"; // 38;5;174 — Claude terracotta
const DIM = "#949494"; // 38;5;246

const ICON: Record<Todo["status"], string> = {
  done: "✔",
  active: "◼",
  todo: "◻",
};

export function ClaudeTodoList({
  todos,
  className,
}: {
  todos: Todo[];
  className?: string;
}) {
  return (
    <ol className={cn("font-mono text-[13px] leading-[1.6]", className)}>
      {todos.map((t, i) => {
        const iconColor =
          t.status === "done"
            ? DONE
            : t.status === "active"
              ? ACTIVE
              : undefined;

        return (
          <li key={i} className="whitespace-pre">
            {/*
              First row: "  ⎿ " then icon. Later rows: four spaces so the
              icon column lines up under ✔ (no capture-style nbsp jump).
            */}
            <span aria-hidden style={{ color: DIM }}>
              {i === 0 ? "  ⎿ " : "    "}
            </span>
            <span aria-hidden style={{ color: iconColor }}>
              {ICON[t.status]}{" "}
            </span>
            <span
              className={cn(
                t.status === "done" && "line-through",
                t.status === "active" && "font-semibold",
              )}
              style={{
                color: t.status === "done" ? DIM : undefined,
              }}
            >
              {t.label}
              <span className="sr-only">
                {" "}
                ({t.status === "done"
                  ? "completed"
                  : t.status === "active"
                    ? "in progress"
                    : "pending"})
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
