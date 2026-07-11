"""ANSI (SGR) -> HTML / plain-text converter.

The capture harness grabs the *composited* terminal screen from tmux with
`capture-pane -e`, which emits printable text + SGR color/style escapes only
(no cursor motion). This module turns that into:

  * faithful HTML (a <pre> of styled <span> runs) for the reference gallery
  * plain text (ANSI stripped) for accessible alt-text / diffing

It intentionally handles just the SGR subset tmux produces.
"""
from __future__ import annotations

import html
import re

# 16 base colors — a calm dark theme close to what these TUIs render against.
BASE_16 = [
    "#1a1b26", "#f7768e", "#9ece6a", "#e0af68",
    "#7aa2f7", "#bb9af7", "#7dcfff", "#a9b1d6",
    "#414868", "#ff899d", "#b9f27c", "#ff9e64",
    "#8db0ff", "#d0aaff", "#a4daff", "#c0caf5",
]


def _xterm256(n: int) -> str:
    """Map an xterm 256-color index to an #rrggbb hex string."""
    if n < 16:
        return BASE_16[n]
    if n < 232:
        n -= 16
        r, g, b = n // 36, (n % 36) // 6, n % 6
        conv = lambda v: 0 if v == 0 else 55 + v * 40
        return f"#{conv(r):02x}{conv(g):02x}{conv(b):02x}"
    # 232-255: grayscale ramp
    v = 8 + (n - 232) * 10
    return f"#{v:02x}{v:02x}{v:02x}"


_SGR_RE = re.compile(r"\x1b\[([0-9;]*)m")
_CSI_RE = re.compile(r"\x1b\[[0-9;?]*[A-Za-z]")  # any other CSI, to strip
_OSC_RE = re.compile(r"\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)")  # OSC strings


class _State:
    __slots__ = (
        "fg", "bg", "bold", "dim", "italic", "underline", "strikethrough", "inverse",
    )

    def __init__(self):
        self.reset()

    def reset(self):
        self.fg = None
        self.bg = None
        self.bold = False
        self.dim = False
        self.italic = False
        self.underline = False
        self.strikethrough = False
        self.inverse = False

    def key(self):
        return (self.fg, self.bg, self.bold, self.dim,
                self.italic, self.underline, self.strikethrough, self.inverse)

    def style(self) -> str:
        fg, bg = self.fg, self.bg
        if self.inverse:
            fg, bg = (bg or "#c0caf5"), (fg or "#1a1b26")
        parts = []
        if fg:
            parts.append(f"color:{fg}")
        if bg:
            parts.append(f"background:{bg}")
        if self.bold:
            parts.append("font-weight:600")
        if self.dim:
            parts.append("opacity:.55")
        if self.italic:
            parts.append("font-style:italic")
        deco = []
        if self.underline:
            deco.append("underline")
        if self.strikethrough:
            deco.append("line-through")
        if deco:
            parts.append(f"text-decoration:{' '.join(deco)}")
        return ";".join(parts)


def _apply_sgr(state: _State, params: str):
    codes = [int(p) if p else 0 for p in params.split(";")] if params else [0]
    i = 0
    while i < len(codes):
        c = codes[i]
        if c == 0:
            state.reset()
        elif c == 1:
            state.bold = True
        elif c == 2:
            state.dim = True
        elif c == 3:
            state.italic = True
        elif c == 4:
            state.underline = True
        elif c == 7:
            state.inverse = True
        elif c == 9:
            state.strikethrough = True
        elif c == 22:
            state.bold = state.dim = False
        elif c == 23:
            state.italic = False
        elif c == 24:
            state.underline = False
        elif c == 29:
            state.strikethrough = False
        elif c == 27:
            state.inverse = False
        elif 30 <= c <= 37:
            state.fg = BASE_16[c - 30]
        elif c == 39:
            state.fg = None
        elif 40 <= c <= 47:
            state.bg = BASE_16[c - 40]
        elif c == 49:
            state.bg = None
        elif 90 <= c <= 97:
            state.fg = BASE_16[c - 90 + 8]
        elif 100 <= c <= 107:
            state.bg = BASE_16[c - 100 + 8]
        elif c in (38, 48):
            target = "fg" if c == 38 else "bg"
            mode = codes[i + 1] if i + 1 < len(codes) else 0
            if mode == 5 and i + 2 < len(codes):
                setattr(state, target, _xterm256(codes[i + 2]))
                i += 2
            elif mode == 2 and i + 4 < len(codes):
                r, g, b = codes[i + 2], codes[i + 3], codes[i + 4]
                setattr(state, target, f"#{r:02x}{g:02x}{b:02x}")
                i += 4
        i += 1


def strip(text: str) -> str:
    """Remove all ANSI/escape sequences, returning plain text."""
    text = _OSC_RE.sub("", text)
    text = _SGR_RE.sub("", text)
    text = _CSI_RE.sub("", text)
    return text.replace("\x1b", "")


def to_html(text: str) -> str:
    """Convert SGR-colored terminal text to an HTML fragment of <span> runs."""
    text = _OSC_RE.sub("", text)
    state = _State()
    out: list[str] = []
    open_span = False
    pos = 0
    for m in _SGR_RE.finditer(text):
        chunk = text[pos:m.start()]
        if chunk:
            chunk = _CSI_RE.sub("", chunk).replace("\x1b", "")
            style = state.style()
            if style:
                out.append(f'<span style="{style}">{html.escape(chunk)}</span>')
                open_span = True
            else:
                out.append(html.escape(chunk))
        _apply_sgr(state, m.group(1))
        pos = m.end()
    tail = text[pos:]
    if tail:
        tail = _CSI_RE.sub("", tail).replace("\x1b", "")
        style = state.style()
        if style:
            out.append(f'<span style="{style}">{html.escape(tail)}</span>')
        else:
            out.append(html.escape(tail))
    _ = open_span
    return "".join(out)
