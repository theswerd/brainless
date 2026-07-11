import { GrokThought } from "@/registry/brainless/grok/grok-thought";

/**
 * Homepage credit — a Grok thought that names who built brainless.
 */
export function SiteCredit() {
  return (
    <section className="border-t border-border bg-[#1a1b26]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <GrokThought elapsed="0.4s">
          Built by{" "}
          <a
            href="https://x.com/benswerd"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-white/25 underline-offset-2 transition-colors hover:decoration-white/60"
          >
            @benswerd
          </a>{" "}
          and the{" "}
          <a
            href="https://freestyle.sh"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-white/25 underline-offset-2 transition-colors hover:decoration-white/60"
          >
            freestyle
          </a>{" "}
          team.
        </GrokThought>
      </div>
    </section>
  );
}
