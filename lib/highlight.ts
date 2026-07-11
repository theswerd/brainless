import "server-only";
import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark-default"],
      langs: ["tsx", "bash", "json"],
    });
  }
  return highlighterPromise;
}

export async function highlight(code: string, lang = "tsx"): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code.trimEnd(), {
    lang,
    theme: "github-dark-default",
  });
}
