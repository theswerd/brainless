import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ComposerModesReview } from "@/components/composer-modes-review";

export const metadata: Metadata = {
  title: "Composer + modes review",
  description:
    "Side-by-side: captured Claude / Codex / Grok composers and shift+tab modes vs React components.",
};

async function readCrop(name: string) {
  return readFile(
    path.join(process.cwd(), "references/captures/_composer_crops", `${name}.html`),
    "utf8",
  );
}

export default async function ComposersReviewPage() {
  const captures = {
    claude: {
      auto: await readCrop("claude-auto"),
      manual: await readCrop("claude-manual"),
      accept: await readCrop("claude-accept"),
      plan: await readCrop("claude-plan"),
    },
    codex: {
      default: await readCrop("codex-default"),
      plan: await readCrop("codex-plan"),
    },
    grok: {
      always: await readCrop("grok-always"),
      normal: await readCrop("grok-normal"),
      plan: await readCrop("grok-plan"),
      auto: await readCrop("grok-auto"),
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <ComposerModesReview captures={captures} />
    </div>
  );
}
