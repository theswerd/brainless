import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.description}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Shared Open Graph / Twitter card art. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#ededed",
          padding: 72,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "#ededed",
            }}
          />
          <div
            style={{
              fontSize: 28,
              letterSpacing: "-0.02em",
              fontWeight: 600,
            }}
          >
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              fontWeight: 600,
              maxWidth: 980,
            }}
          >
            Claude Code, Codex, and Grok interfaces as shadcn components.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#a1a1aa",
              letterSpacing: "-0.01em",
            }}
          >
            Install with shadcn · paste a prompt to your agent
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#71717a",
            fontSize: 22,
          }}
        >
          <div>{siteConfig.url.replace(/^https?:\/\//, "")}</div>
          <div>shadcn registry</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
