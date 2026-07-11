#!/usr/bin/env python3
"""Brainless capture harness.

Drives real coding-agent CLIs (claude / codex / grok) inside fixed-size tmux
sessions and snapshots their composited screen — with color — into a reference
library under references/captures/. Static states get one frame; animated
states (idle "resting" loops, thinking spinners) get a burst of frames.

Each frame is written three ways:
  frame-NN.ansi   raw SGR text (source of truth)
  frame-NN.txt    ANSI stripped (accessible / diffable)
  frame-NN.html   rendered <pre> fragment for the web gallery

A manifest.json ties it all together for the Next.js showcase to read.

Usage:
  python3 tools/capture/capture.py            # all agents, all scenarios
  python3 tools/capture/capture.py claude     # just one agent
  python3 tools/capture/capture.py claude:slash-menu   # one scenario
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

import ansi

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "references" / "captures"
COLS, ROWS = 100, 30
WORKDIR = "/tmp/brainless-capture-workdir"


# ---------------------------------------------------------------------------
# tmux plumbing
# ---------------------------------------------------------------------------

def tmux(*args: str, check: bool = True) -> str:
    r = subprocess.run(["tmux", *args], capture_output=True, text=True)
    if check and r.returncode != 0:
        raise RuntimeError(f"tmux {' '.join(args)} failed: {r.stderr.strip()}")
    return r.stdout


def new_session(name: str, cmd: str) -> None:
    kill_session(name)
    # Launch the agent as the session command with an explicit color TERM.
    # Non-interactive runners often leave TERM=dumb and NO_COLOR=1; Claude Code
    # (and others) then paint a colorless UI that capture-pane -e records
    # without SGR. Force a color-capable environment into the session.
    tmux(
        "new-session",
        "-d",
        "-s",
        name,
        "-x",
        str(COLS),
        "-y",
        str(ROWS),
        "-e",
        "TERM=tmux-256color",
        "-e",
        "COLORTERM=truecolor",
        "-e",
        "FORCE_COLOR=1",
        "-e",
        "NO_COLOR=",
        f"cd {WORKDIR} && unset NO_COLOR && clear && {cmd}",
    )


def kill_session(name: str) -> None:
    tmux("kill-session", "-t", name, check=False)


def send_text(name: str, text: str) -> None:
    tmux("send-keys", "-t", name, "-l", text)


def send_key(name: str, key: str) -> None:
    tmux("send-keys", "-t", name, key)


def grab(name: str) -> str:
    """Return the current pane contents with SGR color escapes."""
    return tmux("capture-pane", "-t", name, "-e", "-p")


def wait_stable(name: str, settle: float = 0.6, timeout: float = 12.0) -> str:
    """Poll until the screen stops changing (two identical grabs), or timeout."""
    deadline = time.time() + timeout
    prev, prev_t = grab(name), time.time()
    while time.time() < deadline:
        time.sleep(0.25)
        cur = grab(name)
        if cur == prev:
            if time.time() - prev_t >= settle:
                return cur
        else:
            prev, prev_t = cur, time.time()
    return grab(name)


# ---------------------------------------------------------------------------
# frame writing
# ---------------------------------------------------------------------------

def write_frame(agent: str, scenario: str, idx: int, raw: str) -> dict:
    d = OUT / agent / scenario
    d.mkdir(parents=True, exist_ok=True)
    stem = f"frame-{idx:02d}"
    (d / f"{stem}.ansi").write_text(raw)
    plain = ansi.strip(raw)
    (d / f"{stem}.txt").write_text(plain)
    (d / f"{stem}.html").write_text(ansi.to_html(raw))
    return {
        "index": idx,
        "ansi": f"{agent}/{scenario}/{stem}.ansi",
        "txt": f"{agent}/{scenario}/{stem}.txt",
        "html": f"{agent}/{scenario}/{stem}.html",
        "lines": plain.count("\n") + 1,
    }


# ---------------------------------------------------------------------------
# scenario runner
# ---------------------------------------------------------------------------

def run_scenario(agent: str, cfg: dict, scn: dict) -> dict | None:
    name = scn["name"]
    session = f"cap_{agent}_{name}".replace("-", "_")
    print(f"  · {agent}:{name} …", end="", flush=True)
    frames: list[dict] = []
    state = {"idx": 0, "last": None}

    def snap() -> None:
        """Capture a frame, skipping it only if byte-identical to the last.

        Deduping on the raw ANSI (not the stripped text) is deliberate: some
        agents animate purely with color — e.g. Grok's resting shimmer sweeps
        grayscale over the same glyphs — and a text-only key would collapse
        that motion into a single static frame.
        """
        raw = grab(session)
        key = raw.rstrip()
        if key == state["last"]:
            return
        state["last"] = key
        frames.append(write_frame(agent, name, state["idx"], raw))
        state["idx"] += 1

    def run_steps(steps: list) -> None:
        for step in steps:
            kind = step[0]
            if kind == "wait":
                time.sleep(step[1])
            elif kind == "text":
                send_text(session, step[1])
                time.sleep(step[2] if len(step) > 2 else 0.5)
            elif kind == "key":
                send_key(session, step[1])
                time.sleep(step[2] if len(step) > 2 else 0.5)
            elif kind == "stable":
                wait_stable(session)
            elif kind == "snap":
                snap()
            elif kind == "animate":
                count, interval = step[1], step[2]
                for _ in range(count):
                    snap()
                    time.sleep(interval)

    try:
        # Start from a clean scenario dir so stale frames never linger.
        shutil.rmtree(OUT / agent / name, ignore_errors=True)
        new_session(session, cfg["cmd"])
        if scn.get("no_settle"):
            # Boot-animation capture: start grabbing frames right away.
            time.sleep(0.4)
        else:
            time.sleep(cfg.get("boot", 3.0))
            wait_stable(session, timeout=cfg.get("boot_timeout", 12.0))
            run_steps(cfg.get("preamble", []))  # dismiss update/onboarding
        run_steps(scn["steps"])
        print(f" {len(frames)} frame(s)")
    except Exception as e:  # noqa: BLE001 — keep going across scenarios
        print(f" FAILED: {e}")
        return None
    finally:
        kill_session(session)
    if not frames:
        return None
    return {"name": name, "title": scn["title"], "note": scn.get("note", ""),
            "frames": frames}


# ---------------------------------------------------------------------------
# what to capture
# ---------------------------------------------------------------------------
# Steps are tuples: ("wait", s) ("text", s[, pause]) ("key", k[, pause])
#                   ("stable",) ("snap",) ("animate", count, interval)

WELCOME = {"name": "welcome", "title": "Welcome / header",
           "note": "Initial screen after launch.",
           "steps": [("stable",), ("snap",)]}
SLASH = {"name": "slash-menu", "title": "Slash-command menu",
         "note": "The command palette opened by typing '/'.",
         "steps": [("stable",), ("text", "/"), ("wait", 0.8), ("stable",),
                   ("snap",)]}
THINKING = {"name": "thinking", "title": "Thinking / working animation",
            "note": "Spinner frames after a trivial prompt; interrupted "
                    "immediately.",
            "steps": [("stable",), ("text", "hi"), ("key", "Enter", 0.3),
                      ("animate", 20, 0.11), ("key", "Escape"), ("key", "Escape")]}
INTRO = {"name": "intro", "title": "Boot / logo animation",
         "note": "Frames from the first moments of launch — catches the "
                 "logo drawing in.", "no_settle": True,
         "steps": [("wait", 0.1), ("animate", 26, 0.09)]}

# Shift+Tab (tmux BTab) cycles permission / plan modes. Snap each distinct
# footer state. Count is one more than the known cycle so we land back on the
# start mode and prove the loop.
def modes_scenario(tabs: int, note: str) -> dict:
    steps: list = [("stable",), ("snap",)]
    for _ in range(tabs):
        steps += [("key", "BTab", 0.7), ("stable",), ("snap",)]
    return {
        "name": "modes",
        "title": "Composer + mode cycle",
        "note": note,
        "steps": steps,
    }

CLAUDE_MODES = modes_scenario(
    4,
    "Claude Code permission modes via shift+tab: auto → manual → accept edits "
    "→ plan → auto. Composer is the dual-rule ❯ field.",
)

# Force TaskCreate/TaskUpdate with mixed statuses, then expand the task
# list (ctrl+t). TodoWrite is gated off in current Claude builds that use
# the Task* tools instead.
CLAUDE_TODOS = {
    "name": "todos",
    "title": "Task list (todos)",
    "note": "TaskCreate + TaskUpdate with completed / in_progress / pending "
            "items, then ctrl+t to expand the task list panel.",
    "steps": [
        ("stable",),
        ("text",
         "Create exactly three tasks with TaskCreate, then update their "
         "statuses with TaskUpdate, then stop. Do not read files. "
         "Tasks: "
         "(1) subject='Read the settings page' → status completed; "
         "(2) subject='Add the dark-mode toggle' → status in_progress; "
         "(3) subject='Run the test suite' → status pending. "
         "After creating/updating, press nothing else — just finish."),
        ("key", "Enter", 0.5),
        ("wait", 25.0),
        ("stable",),
        ("snap",),
        ("key", "C-t", 0.8),
        ("stable",),
        ("snap",),
        ("key", "C-t", 0.8),
        ("stable",),
        ("snap",),
    ],
}

# Enter plan mode via shift+tab, ask for a tiny plan, capture the plan card.
CLAUDE_PLAN = {
    "name": "plan",
    "title": "Plan mode / exit-plan prompt",
    "note": "Shift+tab into plan mode, request a short plan, capture the "
            "plan presentation / exit-plan UI.",
    "steps": [
        ("stable",),
        # auto → manual → accept → plan (3 tabs from default auto)
        ("key", "BTab", 0.7),
        ("key", "BTab", 0.7),
        ("key", "BTab", 0.7),
        ("stable",),
        ("snap",),
        ("text",
         "Write a one-paragraph plan for adding a dark-mode toggle to a "
         "settings page. Do not implement. When the plan is ready, call "
         "ExitPlanMode."),
        ("key", "Enter", 0.5),
        ("wait", 20.0),
        ("stable",),
        ("snap",),
        ("wait", 15.0),
        ("stable",),
        ("snap",),
    ],
}
CODEX_MODES = modes_scenario(
    2,
    "Codex Default ↔ Plan mode via shift+tab. Composer is the › field with "
    "model/cwd status line.",
)

# Static /permissions chooser (no agent turn required).
CODEX_PERMISSIONS = {
    "name": "permissions",
    "title": "Permissions chooser",
    "note": "/permissions numbered radio list for Default / Auto-review / "
            "Full Access.",
    "steps": [
        ("stable",),
        ("text", "/permissions"),
        ("key", "Enter", 0.5),
        ("wait", 1.0),
        ("stable",),
        ("snap",),
    ],
}

# /diff pager — needs a dirty git worktree in WORKDIR.
CODEX_DIFF = {
    "name": "diff",
    "title": "Diff pager",
    "note": "Full-screen /diff unified git diff with spaced DIFF title bar "
            "and quit footer.",
    "steps": [
        ("stable",),
        ("text", "/diff"),
        ("key", "Enter", 0.5),
        ("wait", 1.0),
        ("stable",),
        ("snap",),
        ("key", "q", 0.4),
    ],
}

GROK_MODES = modes_scenario(
    4,
    "Grok modes via shift+tab: normal → plan → auto → always-approve → normal. "
    "Composer is the rounded box with model · mode in the bottom-right legend.",
)

# Force a shell permission prompt in normal mode (not always-approve).
GROK_PERMISSION = {
    "name": "permission",
    "title": "Permission / approval",
    "note": "Left-border approval card with (●)/(○) radios and 1/3:select "
            "hint bar.",
    "steps": [
        ("stable",),
        # land on normal (not always-approve) — cycle until footer has no mode
        ("key", "BTab", 0.7),
        ("key", "BTab", 0.7),
        ("key", "BTab", 0.7),
        ("stable",),
        ("text",
         "Run this exact shell command and nothing else: "
         "echo permission-probe-ok > /tmp/brainless-capture-workdir/probe-out.txt"),
        ("key", "Enter", 0.5),
        ("wait", 20.0),
        ("stable",),
        ("snap",),
    ],
}

# Plan mode → plan.md approval card.
GROK_PLAN = {
    "name": "plan",
    "title": "Plan approval",
    "note": "plan.md framed viewer with a/s/c/q actions and Waiting on plan "
            "approval.",
    "steps": [
        ("stable",),
        ("key", "BTab", 0.7),  # → plan
        ("stable",),
        ("text",
         "Write a brief plan to create an empty planned.txt in the workspace "
         "root. Do not implement — produce the plan for approval."),
        ("key", "Enter", 0.5),
        ("wait", 35.0),
        ("stable",),
        ("snap",),
    ],
}

AGENTS = {
    "claude": {"cmd": "claude", "boot": 4.0,
               "scenarios": [WELCOME, SLASH, THINKING, CLAUDE_MODES,
                             CLAUDE_TODOS, CLAUDE_PLAN]},
    # Codex greets first-run with an "Update available" chooser (default =
    # "Update now") then a trust prompt. Skip the update, accept trust.
    "codex":  {"cmd": "codex",  "boot": 4.0,
               "scenarios": [WELCOME, SLASH, THINKING, CODEX_MODES,
                             CODEX_PERMISSIONS, CODEX_DIFF],
               "preamble": [("key", "Down", 0.4), ("key", "Enter", 1.0),
                            ("stable",), ("key", "Enter", 1.0), ("stable",)]},
    "grok":   {"cmd": "grok",   "boot": 4.0,
               "scenarios": [INTRO, WELCOME, SLASH, THINKING, GROK_MODES,
                             GROK_PERMISSION, GROK_PLAN]},
}

LABELS = {"claude": "Claude Code", "codex": "Codex CLI", "grok": "Grok CLI"}


def main(argv: list[str]) -> int:
    os.makedirs(WORKDIR, exist_ok=True)
    if not shutil.which("tmux"):
        print("tmux is required", file=sys.stderr)
        return 1

    # Parse selectors: "claude", "claude:slash-menu", or nothing (=all).
    selectors = argv[1:]
    plan: list[tuple[str, str | None]] = []
    if not selectors:
        plan = [(a, None) for a in AGENTS]
    else:
        for sel in selectors:
            if ":" in sel:
                a, s = sel.split(":", 1)
                plan.append((a, s))
            else:
                plan.append((sel, None))

    manifest_agents = []
    for agent, only in plan:
        cfg = AGENTS.get(agent)
        if not cfg:
            print(f"unknown agent: {agent}", file=sys.stderr)
            continue
        if not shutil.which(cfg["cmd"]):
            print(f"skip {agent}: '{cfg['cmd']}' not on PATH")
            continue
        print(f"▸ {LABELS[agent]}")
        scenarios = [s for s in cfg["scenarios"] if only is None or s["name"] == only]
        results = []
        for scn in scenarios:
            r = run_scenario(agent, cfg, scn)
            if r and r["frames"]:
                results.append(r)
        if results:
            manifest_agents.append({
                "id": agent, "label": LABELS[agent],
                "cmd": cfg["cmd"], "cols": COLS, "rows": ROWS,
                "scenarios": results,
            })

    # Merge into an existing manifest so partial re-runs don't wipe prior work.
    # Merge per-scenario within each agent (not whole-agent replace).
    OUT.mkdir(parents=True, exist_ok=True)
    manifest_path = OUT / "manifest.json"
    existing: dict[str, dict] = {}
    if manifest_path.exists():
        try:
            for a in json.loads(manifest_path.read_text()).get("agents", []):
                existing[a["id"]] = a
        except Exception:  # noqa: BLE001
            pass
    for a in manifest_agents:
        prev = existing.get(a["id"])
        if not prev:
            existing[a["id"]] = a
            continue
        by_name = {s["name"]: s for s in prev.get("scenarios", [])}
        for s in a["scenarios"]:
            by_name[s["name"]] = s
        # Keep a stable order: prior order, then any newly added names.
        order = [s["name"] for s in prev.get("scenarios", [])]
        for s in a["scenarios"]:
            if s["name"] not in order:
                order.append(s["name"])
        existing[a["id"]] = {
            **prev,
            **{k: a[k] for k in ("label", "cmd", "cols", "rows") if k in a},
            "scenarios": [by_name[n] for n in order if n in by_name],
        }
    manifest = {"cols": COLS, "rows": ROWS,
                "agents": [existing[k] for k in sorted(existing)]}
    manifest_path.write_text(json.dumps(manifest, indent=2))
    print(f"\n✓ manifest → {manifest_path.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
