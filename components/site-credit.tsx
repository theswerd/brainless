import { cn } from "@/lib/utils";

/**
 * Homepage credit — Grok-thought one-liner, theme-aware for the page chrome.
 */
export function SiteCredit({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 font-mono text-[12px] leading-snug text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden className="text-muted-foreground/70">
        ◆
      </span>
      <span>
        <a
          href="https://x.com/benswerd"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-current/25 underline-offset-2 transition-colors hover:text-foreground hover:decoration-current/50"
        >
          @benswerd
        </a>
        <span className="text-muted-foreground/50"> · </span>
        <a
          href="https://freestyle.sh"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-current/25 underline-offset-2 transition-colors hover:text-foreground hover:decoration-current/50"
        >
          freestyle
        </a>
      </span>
    </p>
  );
}
