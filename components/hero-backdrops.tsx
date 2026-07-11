/**
 * Blank mind — near-white empty-channel field with heavy (frozen) TV static.
 * Bright backdrop for contrast against the dark terminal.
 */

type BackdropProps = { className?: string };

function EdgeFade() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
    </>
  );
}

export function BlankMind({ className = "" }: BackdropProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {/* base wash — blown-out white */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 110% 90% at 58% 40%, #ffffff 0%, #ffffff 40%, #f0f0f0 65%, #d8d8d8 100%)",
        }}
      />
      {/* hot core glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 60% 38%, #ffffff 0%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.4) 55%, transparent 75%)",
        }}
      />

      {/* frozen TV snow — denser, crunchier */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="static-fine" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="2.8 3.0"
              numOctaves="2"
              seed="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 0 0.4 0.75 1" />
            </feComponentTransfer>
          </filter>

          <filter id="static-fine-2" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="3.4 3.1"
              numOctaves="1"
              seed="23"
              stitchTiles="stitch"
            />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.95 0" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 1" />
            </feComponentTransfer>
          </filter>

          <filter id="static-mid" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.0 1.15"
              numOctaves="3"
              seed="11"
              stitchTiles="stitch"
            />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.85 0" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 0 0.55 1" />
            </feComponentTransfer>
          </filter>

          <filter id="static-coarse" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.2 0.24"
              numOctaves="4"
              seed="7"
              stitchTiles="stitch"
            />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.65 0" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 0 0 1" />
            </feComponentTransfer>
          </filter>

          <filter id="static-streak" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.4 3.2"
              numOctaves="1"
              seed="19"
              stitchTiles="stitch"
            />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 1" />
            </feComponentTransfer>
          </filter>
        </defs>

        <rect width="100%" height="100%" filter="url(#static-fine)" opacity="0.72" style={{ mixBlendMode: "multiply" }} />
        <rect width="100%" height="100%" filter="url(#static-fine-2)" opacity="0.45" style={{ mixBlendMode: "multiply" }} />
        <rect width="100%" height="100%" filter="url(#static-mid)" opacity="0.55" style={{ mixBlendMode: "multiply" }} />
        <rect width="100%" height="100%" filter="url(#static-coarse)" opacity="0.38" style={{ mixBlendMode: "multiply" }} />
        <rect width="100%" height="100%" filter="url(#static-streak)" opacity="0.32" style={{ mixBlendMode: "soft-light" }} />
      </svg>

      {/* punch white back through the static */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 42% at 60% 38%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.25) 40%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 58% 40%, transparent 0%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      <EdgeFade />
    </div>
  );
}
