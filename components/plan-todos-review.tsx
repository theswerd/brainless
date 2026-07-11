"use client";

import * as React from "react";
import { ClaudeTodoList } from "@/registry/brainless/claude/claude-todo-list";
import { cn } from "@/lib/utils";

type Captures = {
  todosMixed: string;
  todosPending: string;
  planReady: string;
};

type Tone = "wrong" | "right" | "note";

const CalloutCtx = React.createContext(true);

function Callout({
  tone,
  label,
  className,
  children,
}: {
  tone: Tone;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const show = React.useContext(CalloutCtx);
  if (!show) return <>{children}</>;
  const wrong = tone === "wrong";
  const right = tone === "right";
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "pointer-events-none absolute -inset-1 rounded-sm border-2 border-dashed",
          wrong && "border-red-400/80",
          right && "border-emerald-400/80",
          tone === "note" && "border-amber-400/70",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "absolute -top-2.5 left-2 z-10 max-w-[min(100%,28rem)] truncate rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none",
          wrong && "bg-red-500/90 text-white",
          right && "bg-emerald-500/90 text-white",
          tone === "note" && "bg-amber-500/90 text-black",
        )}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function Panel({
  side,
  title,
  children,
}: {
  side: "capture" | "component";
  title: string;
  children: React.ReactNode;
}) {
  const capture = side === "capture";
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            "rounded px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider",
            capture
              ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40"
              : "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/40",
          )}
        >
          {capture ? "Capture" : "Component"}
        </span>
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="term-window">
        <div className="term-titlebar">
          <span className="term-dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="term-title">{title}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function CapturePane({ html }: { html: string }) {
  return (
    <pre
      className="term-screen overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Exact column layout from claude/todos frame-01 (byte positions). */
function CaptureExactTodos() {
  return (
    <pre className="overflow-x-auto font-mono text-[13px] leading-[1.6] text-[#c0caf5]">
      <div>
        <span style={{ color: "#d78787" }}>✢</span>
        {" "}
        <span className="font-semibold" style={{ color: "#ffaf87" }}>
          Add the dark-mode toggle…
        </span>{" "}
        <span style={{ color: "#949494" }}>(50s · ↓ 566 tokens)</span>
      </div>
      <div>
        <span style={{ color: "#949494" }}>
          {"  ⎿ \u00a0"}
        </span>
        <span style={{ color: "#87d787" }}>✔ </span>
        <span
          className="line-through"
          style={{ color: "#949494" }}
        >
          Read the settings page
        </span>
      </div>
      <div>
        {"     "}
        <span style={{ color: "#d78787" }}>◼ </span>
        <span className="font-semibold">Add the dark-mode toggle</span>
      </div>
      <div>
        {"     "}
        ◻ Run the test suite
      </div>
    </pre>
  );
}

/** Column ruler matching capture icon column at index 5. */
function ColumnRuler() {
  return (
    <pre
      aria-hidden
      className="mb-2 overflow-x-auto font-mono text-[11px] leading-none text-muted-foreground"
    >
      <div>{"012345678901234567890123456789"}</div>
      <div>
        {"  "}
        <span className="text-amber-300">⎿</span>
        {"  "}
        <span className="text-emerald-300">✔</span>
        <span className="text-muted-foreground"> ← icons land on col 5</span>
      </div>
      <div>
        {"     "}
        <span className="text-emerald-300">◼</span>
      </div>
    </pre>
  );
}

const SAMPLE = [
  { label: "Read the settings page", status: "done" as const },
  { label: "Add the dark-mode toggle", status: "active" as const },
  { label: "Run the test suite", status: "todo" as const },
];

const DIFFS = [
  {
    id: "gap",
    title: "1. Extra gap between rows",
    wrong:
      "ClaudeTodoList uses space-y-1 (4px) between <li>s.",
    right:
      "Capture is tight terminal lines — only line-height 1.6, no extra row gap.",
  },
  {
    id: "prefix",
    title: "2. ⎿ + icon are flex boxes, not one string",
    wrong:
      "pl-[2ch] + w-[2ch] ⎿ cell + w-[2ch] icon cell. ⎿ sits in its own box (can look “centered” in that cell).",
    right:
      "Capture is a single mono run: \"  ⎿\\u00a0\" then \"✔ \" then label. Icons all start at column 5; ⎿ is at column 2.",
  },
  {
    id: "gap-l-check",
    title: "3. Space between ⎿ and ✔",
    wrong:
      "Adjacent 2ch columns → ⎿ and ✔ are neighbors with whatever leftover space the glyphs leave in their boxes.",
    right:
      "Capture has a space + nbsp between ⎿ and ✔ (prefix length 5 before the icon). Later rows use five spaces so ◼/◻ share column 5.",
  },
  {
    id: "pending-color",
    title: "4. Pending label is recolored",
    wrong: "Pending text forced to #8b8fa3.",
    right:
      "Capture leaves pending ◻ + label on the default terminal foreground (no extra gray).",
  },
  {
    id: "icon-space",
    title: "5. Trailing space after the icon",
    wrong: "Icon glyph alone in a 2ch box; label follows in the next flex item.",
    right:
      "Capture colors \"✔ \" / \"◼ \" including the space after the glyph, then the label.",
  },
  {
    id: "standalone",
    title: "6. Missing thinking parent (context)",
    wrong:
      "Showcase often renders ClaudeTodoList alone, so ⎿ has nothing to hang under.",
    right:
      "In the CLI the list is always under the working line (activeForm as the verb + token count).",
  },
];

function CaptureFaithfulPlan() {
  return (
    <div className="font-mono text-[13px] leading-[1.55] text-[#c0caf5]">
      <div className="font-semibold" style={{ color: "#afd7ff" }}>
        Ready to code?
      </div>
      <div className="mt-2">Here is Claude&apos;s plan:</div>
      <div className="mt-1" style={{ color: "#4e4e4e" }}>
        {"╌".repeat(48)}
      </div>
      <div className="mt-1 font-semibold italic underline">
        Plan: Dark-Mode Toggle on Settings Page
      </div>
      <p className="mt-2 max-w-prose text-[#c0caf5]/90">
        Add a dark-mode toggle… (plan body truncated — see capture for full
        paragraph.)
      </p>
      <div className="mt-2" style={{ color: "#4e4e4e" }}>
        {"─".repeat(48)}
      </div>
      <p className="mt-2" style={{ color: "#949494" }}>
        Claude has written up a plan and is ready to execute. Would you like to
        proceed?
      </p>
      <ol className="mt-2 space-y-0.5">
        <li>
          <span className="font-semibold">❯ 1. </span>Yes, and use auto mode
        </li>
        <li style={{ color: "#949494" }}>
          {"  "}2. Yes, manually approve edits
        </li>
        <li style={{ color: "#949494" }}>
          {"  "}3. No, refine with Ultraplan on Claude Code on the web
        </li>
        <li>{"  "}4. Tell Claude what to change</li>
      </ol>
      <p className="mt-2" style={{ color: "#949494" }}>
        ctrl+g to edit in Vim · ~/.claude/plans/…
      </p>
    </div>
  );
}

export function PlanTodosReview({ captures }: { captures: Captures }) {
  const [showCallouts, setShowCallouts] = React.useState(true);

  return (
    <CalloutCtx.Provider value={showCallouts}>
      <div>
        <header className="max-w-3xl">
          <p className="font-mono text-[12px] text-muted-foreground">
            fidelity review · Claude task list diffs
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Todos — difference callouts
          </h1>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            Capture-backed diffs for{" "}
            <code className="text-foreground">ClaudeTodoList</code>. Shipped
            component now matches capture glyphs/colors/tight lines, but keeps
            icons in one column (skips Claude&apos;s extra nbsp indent that
            jumps the first ✔ forward).
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCallouts((v) => !v)}
              className="rounded border border-border px-3 py-1.5 font-mono text-[12px] hover:bg-accent"
            >
              {showCallouts ? "Hide callouts" : "Show callouts"}
            </button>
            <a
              href="/review/composers"
              className="font-mono text-[12px] text-muted-foreground underline underline-offset-2"
            >
              /review/composers
            </a>
          </div>
        </header>

        <nav className="sticky top-14 z-30 mt-8 -mx-4 border-y border-border/70 bg-background/85 px-4 py-2 backdrop-blur sm:mx-0 sm:border">
          <ol className="flex gap-1 overflow-x-auto font-mono text-[11px]">
            {[
              { id: "overview", label: "Overview" },
              ...DIFFS.map((d) => ({ id: d.id, label: d.title.split(". ")[0]! })),
              { id: "plan", label: "Plan" },
            ].map((t) => (
              <li key={t.id} className="shrink-0">
                <a
                  href={`#${t.id}`}
                  className="block rounded px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  {t.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="overview" className="scroll-mt-28 mt-10">
          <h2 className="text-xl font-semibold tracking-tight">
            Side-by-side overview
          </h2>
          <p className="mt-1 max-w-2xl font-mono text-[12px] text-muted-foreground">
            Left = real capture crop. Right = shipped ClaudeTodoList. Column
            ruler shows where ⎿ (col 2) and icons (col 5) sit in the capture.
          </p>
          <div className="mt-4 rounded-md border border-border/70 bg-muted/30 p-3">
            <ColumnRuler />
            <p className="font-mono text-[11px] text-muted-foreground">
              Capture bytes (row 1):{" "}
              <code className="text-foreground">
                {"\"  ⎿ \\u00a0✔ Read…\""}
              </code>
              {" · "}
              later rows:{" "}
              <code className="text-foreground">{"\"     ◼ …\""}</code>
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Panel side="capture" title="claude/todos frame-01 crop">
              <CapturePane html={captures.todosMixed} />
            </Panel>
            <Panel side="component" title="ClaudeTodoList (shipped)">
              <div className="bg-[var(--term-bg)] p-4">
                <Callout
                  tone="wrong"
                  label="#1 space-y-1 gap · #2 flex boxes · #4 pending gray"
                >
                  <ClaudeTodoList todos={SAMPLE} />
                </Callout>
              </div>
            </Panel>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Panel side="capture" title="exact mono reconstruction">
              <div className="bg-[var(--term-bg)] p-4">
                <Callout tone="right" label="byte-faithful columns">
                  <CaptureExactTodos />
                </Callout>
              </div>
            </Panel>
            <Panel side="component" title="shipped again (for compare)">
              <div className="bg-[var(--term-bg)] p-4">
                <ClaudeTodoList todos={SAMPLE} />
              </div>
            </Panel>
          </div>
        </section>

        <div className="mt-14 space-y-10">
          {DIFFS.map((d) => (
            <section
              key={d.id}
              id={d.id}
              className="scroll-mt-28 border-t border-border/60 pt-8"
            >
              <h3 className="text-base font-semibold tracking-tight">
                {d.title}
              </h3>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-md border border-red-500/30 bg-red-500/5 p-4">
                  <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-red-300">
                    Wrong / shipped
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {d.wrong}
                  </p>
                </div>
                <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4">
                  <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                    Right / capture
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {d.right}
                  </p>
                </div>
              </div>

              {d.id === "gap" ? (
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <Panel side="component" title="space-y-1 (shipped)">
                    <div className="bg-[var(--term-bg)] p-4">
                      <Callout tone="wrong" label="extra 4px between rows">
                        <ClaudeTodoList todos={SAMPLE} />
                      </Callout>
                    </div>
                  </Panel>
                  <Panel side="capture" title="tight lines (capture)">
                    <div className="bg-[var(--term-bg)] p-4">
                      <Callout tone="right" label="no space-y">
                        <CaptureExactTodos />
                      </Callout>
                    </div>
                  </Panel>
                </div>
              ) : null}

              {d.id === "prefix" || d.id === "gap-l-check" ? (
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <Panel side="component" title="flex ⎿ | icon cells">
                    <div className="bg-[var(--term-bg)] p-4 font-mono text-[13px] leading-[1.6]">
                      <Callout
                        tone="wrong"
                        label="⎿ in its own 2ch box — not col-2 of a string"
                      >
                        <div className="flex items-baseline pl-[2ch]">
                          <span
                            className="inline-block w-[2ch] bg-red-500/20"
                            style={{ color: "#949494" }}
                          >
                            ⎿
                          </span>
                          <span
                            className="inline-block w-[2ch] bg-sky-500/20"
                            style={{ color: "#87d787" }}
                          >
                            ✔
                          </span>
                          <span style={{ color: "#949494" }}>
                            Read the settings page
                          </span>
                        </div>
                      </Callout>
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        Red = ⎿ cell · blue = icon cell (how shipped lays out)
                      </p>
                    </div>
                  </Panel>
                  <Panel side="capture" title="string columns">
                    <div className="bg-[var(--term-bg)] p-4 font-mono text-[13px] leading-[1.6]">
                      <Callout
                        tone="right"
                        label="col 0–1 pad · col 2 ⎿ · col 3 space · col 4 nbsp · col 5 ✔"
                      >
                        <div>
                          <span className="bg-amber-500/20">{"  "}</span>
                          <span
                            className="bg-red-500/20"
                            style={{ color: "#949494" }}
                          >
                            ⎿
                          </span>
                          <span className="bg-amber-500/20">{" \u00a0"}</span>
                          <span
                            className="bg-sky-500/20"
                            style={{ color: "#87d787" }}
                          >
                            ✔{" "}
                          </span>
                          <span
                            className="line-through"
                            style={{ color: "#949494" }}
                          >
                            Read the settings page
                          </span>
                        </div>
                        <div>
                          <span className="bg-amber-500/20">{"     "}</span>
                          <span
                            className="bg-sky-500/20"
                            style={{ color: "#d78787" }}
                          >
                            ◼{" "}
                          </span>
                          <span className="font-semibold">
                            Add the dark-mode toggle
                          </span>
                        </div>
                      </Callout>
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        Amber = pad/nbsp · red = ⎿ · blue = icon (capture)
                      </p>
                    </div>
                  </Panel>
                </div>
              ) : null}

              {d.id === "pending-color" ? (
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <Panel side="component" title="pending #8b8fa3">
                    <div className="bg-[var(--term-bg)] p-4">
                      <Callout tone="wrong" label="forced muted pending text">
                        <div className="font-mono text-[13px]">
                          {"     "}◻{" "}
                          <span style={{ color: "#8b8fa3" }}>
                            Run the test suite
                          </span>
                        </div>
                      </Callout>
                    </div>
                  </Panel>
                  <Panel side="capture" title="default fg">
                    <div className="bg-[var(--term-bg)] p-4">
                      <Callout tone="right" label="no color override">
                        <div className="font-mono text-[13px] text-[#c0caf5]">
                          {"     "}◻ Run the test suite
                        </div>
                      </Callout>
                    </div>
                  </Panel>
                </div>
              ) : null}
            </section>
          ))}
        </div>

        <section id="plan" className="scroll-mt-28 mt-14 border-t border-border/60 pt-8">
          <h2
            className="text-xl font-semibold tracking-tight"
            style={{ color: "var(--agent-claude)" }}
          >
            Plan / ready to code
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Still no registry component — capture vs sketch only.
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Panel side="capture" title="claude/plan frame-01">
              <CapturePane html={captures.planReady} />
            </Panel>
            <Panel side="component" title="sketch (not shipped)">
              <div className="bg-[var(--term-bg)] p-4">
                <CaptureFaithfulPlan />
              </div>
            </Panel>
          </div>
        </section>
      </div>
    </CalloutCtx.Provider>
  );
}
