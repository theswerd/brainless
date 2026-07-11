import type { Metadata } from "next";
import Link from "next/link";
import { Showcase } from "@/components/showcase";
import { DocsShell } from "@/components/docs/docs-shell";
import { BLOCKS } from "@/lib/catalog";
import { ClaudeSession } from "@/registry/brainless/blocks/claude-session";
import { CodexSession } from "@/registry/brainless/blocks/codex-session";
import { GrokSession } from "@/registry/brainless/blocks/grok-session";
import { GrokSessionActive } from "@/registry/brainless/blocks/grok-session-active";
import { PiedPiperOnboarding } from "@/registry/brainless/blocks/pied-piper-onboarding";

export const metadata: Metadata = {
  title: "Blocks",
  description:
    "Full compositions — complete agent screens assembled from brainless components.",
};

const DEMOS = [
  {
    name: "claude-session",
    blurb: "A complete Claude Code turn",
    color: "var(--agent-claude)",
    node: <ClaudeSession />,
  },
  {
    name: "codex-session",
    blurb: "A complete Codex CLI turn",
    color: "var(--agent-codex)",
    node: <CodexSession />,
  },
  {
    name: "grok-session",
    blurb: "A complete Grok CLI turn",
    color: "var(--agent-grok)",
    node: <GrokSession />,
  },
  {
    name: "grok-session-active",
    blurb: "Grok mid-turn — thinking, write, working footer",
    color: "var(--agent-grok)",
    node: <GrokSessionActive />,
  },
  {
    name: "pied-piper-onboarding",
    blurb: "Interactive sign-up — typed lines, thinking, real composer",
    color: "#39b54a",
    node: <PiedPiperOnboarding />,
  },
] as const;

export default function BlocksPage() {
  return (
    <DocsShell
      title="Blocks"
      basePath="/blocks"
      items={BLOCKS}
      description={
        <>
          Whole screens, assembled from the{" "}
          <Link
            href="/components"
            className="text-foreground underline-offset-4 hover:underline"
          >
            components
          </Link>
          . One install drops in the entire composition.
        </>
      }
    >
      {DEMOS.map((block) => (
        <section key={block.name} className="space-y-3">
          <p
            className="font-mono text-xs uppercase tracking-[0.08em]"
            style={{ color: block.color }}
          >
            {block.blurb}
          </p>
          <Showcase name={block.name}>{block.node}</Showcase>
        </section>
      ))}
    </DocsShell>
  );
}
