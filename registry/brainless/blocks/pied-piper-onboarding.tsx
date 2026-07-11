"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ClaudeMessage } from "@/registry/brainless/claude/claude-message";
import { ClaudeThinking } from "@/registry/brainless/claude/claude-thinking";
import { ClaudePrompt } from "@/registry/brainless/claude/claude-prompt";
import { ClaudeTodoList, type Todo } from "@/registry/brainless/claude/claude-todo-list";

/**
 * PiedPiperOnboarding — an interactive sign-up flow built from brainless
 * components. A Claude-style header with a terminal Pied Piper logo, typed
 * assistant lines, thinking between turns, and the real ❯ composer for input.
 */

const GREEN = "#39b54a";
const GREEN_DIM = "#2a8a38";
const GRAY = "#949494";
const FG = "#c0caf5";

// Side-view flute / pipe — Silicon Valley Pied Piper, as a 1-bit terminal sprite.
const LOGO_BITS = [
  "000000001111000000",
  "000000111111110000",
  "000011111111111100",
  "001111010101011110",
  "011111111111111111",
  "001111010101011110",
  "000011111111111100",
  "000000111111110000",
  "000000001111000000",
];

function PiedPiperLogo({
  scale = 3.5,
  color = GREEN,
  className,
}: {
  scale?: number;
  color?: string;
  className?: string;
}) {
  const w = LOGO_BITS[0].length;
  const h = LOGO_BITS.length;
  const PH = 2.2;
  const rects: React.ReactElement[] = [];
  LOGO_BITS.forEach((row, y) => {
    let x = 0;
    while (x < w) {
      if (row[x] === "1") {
        let end = x;
        while (end < w && row[end] === "1") end += 1;
        rects.push(
          <rect key={`${x}-${y}`} x={x} y={y * PH} width={end - x} height={PH} />,
        );
        x = end;
      } else {
        x += 1;
      }
    }
  });
  return (
    <svg
      aria-hidden
      width={w * scale}
      height={h * PH * scale}
      viewBox={`0 0 ${w} ${h * PH}`}
      shapeRendering="crispEdges"
      fill={color}
      className={className}
    >
      {rects}
    </svg>
  );
}

function PiedPiperHeader({ className }: { className?: string }) {
  return (
    <fieldset
      className={cn(
        "rounded-[6px] border px-4 pb-3.5 pt-1 font-mono text-[13px] leading-[1.5]",
        className,
      )}
      style={{ borderColor: GREEN, color: FG }}
    >
      <legend className="px-2" style={{ color: GREEN }}>
        Pied Piper <span style={{ color: GRAY }}>v3.1.4</span>
      </legend>

      <div className="grid gap-4 sm:grid-cols-[1fr_1px_1.1fr]">
        <div className="flex flex-col items-center gap-2 py-1 text-center">
          <div className="font-semibold">Welcome to Pied Piper</div>
          <PiedPiperLogo className="my-1.5" />
          <div className="space-y-0.5" style={{ color: GRAY }}>
            <div>compression · middle-out</div>
            <div>onboarding · new account</div>
          </div>
        </div>

        <div
          aria-hidden
          className="hidden sm:block"
          style={{ background: `${GREEN}55` }}
        />

        <div className="min-w-0 space-y-1">
          <div className="font-semibold" style={{ color: GREEN }}>
            Tips for getting started
          </div>
          <div className="truncate">Tell us your name</div>
          <div className="truncate">Say what you&apos;re looking for</div>
          <div className="my-1.5 h-px" style={{ background: GREEN }} />
          <div className="font-semibold" style={{ color: GREEN }}>
            What&apos;s new
          </div>
          <div className="truncate">Middle-out compression is live</div>
          <div className="truncate">Sign-up now fits in one turn</div>
          <div className="truncate italic" style={{ color: GRAY }}>
            /release-notes for more
          </div>
        </div>
      </div>
    </fieldset>
  );
}

type Phase =
  | "greeting"
  | "await-name"
  | "think-name"
  | "ask-looking"
  | "await-looking"
  | "think-looking"
  | "done"
  | "complete";

type ChatLine =
  | { kind: "assistant"; text: string; typing?: boolean }
  | { kind: "user"; text: string };

function useTypewriter(
  text: string,
  active: boolean,
  ms = 22,
): { displayed: string; done: boolean } {
  const [displayed, setDisplayed] = React.useState("");
  const prefersReduced = usePrefersReducedMotion();

  React.useEffect(() => {
    if (!active) return;
    if (prefersReduced) {
      setDisplayed(text);
      return;
    }
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, ms);
    return () => clearInterval(id);
  }, [text, active, ms, prefersReduced]);

  const done = active && displayed.length >= text.length;
  return { displayed, done };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function todosFor(phase: Phase, name: string): Todo[] {
  const named = name.trim() || "your name";
  const askName: Todo["status"] =
    phase === "greeting" || phase === "await-name"
      ? "active"
      : "done";
  const askLooking: Todo["status"] =
    phase === "ask-looking" || phase === "await-looking" || phase === "think-name"
      ? "active"
      : phase === "greeting" || phase === "await-name"
        ? "todo"
        : "done";
  const finish: Todo["status"] =
    phase === "think-looking" || phase === "done"
      ? "active"
      : phase === "complete"
        ? "done"
        : "todo";

  return [
    { label: `Collect ${named === "your name" ? "a name" : named}`, status: askName },
    { label: "Learn what they're looking for", status: askLooking },
    { label: "Create the account", status: finish },
  ];
}

/**
 * PiedPiperOnboarding — interactive demo block.
 */
export function PiedPiperOnboarding() {
  const [phase, setPhase] = React.useState<Phase>("greeting");
  const [lines, setLines] = React.useState<ChatLine[]>([]);
  const [name, setName] = React.useState("");
  const [lookingFor, setLookingFor] = React.useState("");
  const [draft, setDraft] = React.useState("");
  const rootRef = React.useRef<HTMLDivElement>(null);

  const greeting = "Hey — what's your name?";
  const followUp = React.useMemo(() => {
    const first = name.trim().split(/\s+/)[0] || "friend";
    return `Nice to meet you, ${first}. And what are you looking for?`;
  }, [name]);
  const finale = React.useMemo(() => {
    const first = name.trim().split(/\s+/)[0] || "friend";
    const want = lookingFor.trim() || "something great";
    return `You're in, ${first}. We've got you down for "${want}". Welcome to Pied Piper — compression so good, it feels illegal.`;
  }, [name, lookingFor]);

  const typingText =
    phase === "greeting"
      ? greeting
      : phase === "ask-looking"
        ? followUp
        : phase === "done"
          ? finale
          : "";

  const { displayed, done: typed } = useTypewriter(
    typingText,
    phase === "greeting" || phase === "ask-looking" || phase === "done",
  );

  // Commit typed lines into the transcript, then wait for input / finish.
  React.useEffect(() => {
    if (!typed) return;

    const commit = (text: string, next: Phase) => {
      setLines((prev) => {
        const last = prev[prev.length - 1];
        if (last?.kind === "assistant" && last.text === text) return prev;
        return [...prev, { kind: "assistant", text }];
      });
      setPhase(next);
    };

    if (phase === "greeting") commit(greeting, "await-name");
    else if (phase === "ask-looking") commit(followUp, "await-looking");
    else if (phase === "done") commit(finale, "complete");
  }, [typed, phase, greeting, followUp, finale]);

  // Thinking delays.
  React.useEffect(() => {
    if (phase !== "think-name" && phase !== "think-looking") return;
    const ms = 1400 + Math.random() * 600;
    const id = setTimeout(() => {
      if (phase === "think-name") setPhase("ask-looking");
      else setPhase("done");
    }, ms);
    return () => clearTimeout(id);
  }, [phase]);

  // Focus the composer when waiting for input — never scroll the page.
  React.useEffect(() => {
    if (phase !== "await-name" && phase !== "await-looking" && phase !== "complete") {
      return;
    }
    const input = rootRef.current?.querySelector<HTMLInputElement>(
      'input[aria-label="Prompt"]',
    );
    input?.focus({ preventScroll: true });
  }, [phase]);

  function submit() {
    const value = draft.trim();
    if (!value && phase !== "complete") return;

    if (phase === "await-name") {
      setName(value);
      setLines((prev) => [...prev, { kind: "user", text: value }]);
      setDraft("");
      setPhase("think-name");
      return;
    }

    if (phase === "await-looking") {
      setLookingFor(value);
      setLines((prev) => [...prev, { kind: "user", text: value }]);
      setDraft("");
      setPhase("think-looking");
      return;
    }

    if (phase === "complete") {
      setPhase("greeting");
      setLines([]);
      setName("");
      setLookingFor("");
      setDraft("");
    }
  }

  const waiting =
    phase === "await-name" || phase === "await-looking" || phase === "complete";
  const thinking = phase === "think-name" || phase === "think-looking";
  const showTyping =
    phase === "greeting" || phase === "ask-looking" || phase === "done";

  const placeholder =
    phase === "await-name"
      ? "your name"
      : phase === "await-looking"
        ? "e.g. lossless video compression"
        : phase === "complete"
          ? "press enter to restart"
          : "";

  return (
    <div
      ref={rootRef}
      className="space-y-3 font-mono text-[13px] leading-[1.6]"
      style={{ color: FG }}
    >
      <PiedPiperHeader />

      <ClaudeTodoList todos={todosFor(phase, name)} />

      <div className="space-y-3 pt-1">
        {lines.map((line, i) =>
          line.kind === "user" ? (
            <ClaudeMessage key={i} role="user">
              {line.text}
            </ClaudeMessage>
          ) : (
            <ClaudeMessage key={i}>{line.text}</ClaudeMessage>
          ),
        )}

        {showTyping ? (
          <ClaudeMessage>
            {displayed}
            {!typed ? (
              <span
                aria-hidden
                className="ml-0.5 inline-block w-[0.55ch] animate-pulse"
                style={{
                  background: GREEN,
                  height: "1.1em",
                  verticalAlign: "text-bottom",
                }}
              />
            ) : null}
          </ClaudeMessage>
        ) : null}

        {thinking ? (
          <ClaudeThinking
            verbs={
              phase === "think-name"
                ? ["Remembering", "Indexing", "Noodling"]
                : ["Compressing", "Provisioning", "Conjuring"]
            }
            showTokens={false}
          />
        ) : null}
      </div>

      <div className="pt-2">
        <ClaudePrompt
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (waiting) submit();
            }
          }}
          placeholder={placeholder}
          mode="auto"
          effort={false}
          className={cn(!waiting && "pointer-events-none opacity-50")}
        />
      </div>

      {phase === "complete" ? (
        <div className="pt-1 text-[12px]" style={{ color: GREEN_DIM }}>
          ✓ account created · press enter to run it again
        </div>
      ) : null}
    </div>
  );
}
