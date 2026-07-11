import { siteConfig } from "@/lib/site";

export type AgentPromptInput = {
  name: string;
  title: string;
};

export type AgentPromptParts = {
  text: string;
  llmsUrl: string;
  title: string;
  name: string;
};

/** Short prompt: read the component llms.txt, then add it. */
export function agentPromptParts({
  name,
  title,
}: AgentPromptInput): AgentPromptParts {
  const llmsUrl = `${siteConfig.url}/llms/${name}.txt`;
  return {
    llmsUrl,
    title,
    name,
    text: `Read ${llmsUrl} and add the brainless "${title}" component (\`${name}\`) to this project.`,
  };
}

export function agentPrompt(input: AgentPromptInput): string {
  return agentPromptParts(input).text;
}

export function claudeCodeDeepLink(prompt: string): string {
  return `claude-cli://open?q=${encodeURIComponent(prompt)}`;
}

export function codexDeepLink(prompt: string): string {
  return `codex://threads/new?prompt=${encodeURIComponent(prompt)}`;
}
