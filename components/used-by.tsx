import { cn } from "@/lib/utils";

/** xulux brand orange — matches https://xulux.ai nav accent */
const XULUX_ORANGE = "#f97316";

/**
 * xulux mark — official dark square; arrow muted gray (not full cream).
 * https://xulux.ai/favicon.svg
 */
function XuluxMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="28" height="28" rx="7" fill="#0A0A0A" />
      <path
        d="M8 16h16M16 8l8 8-8 8"
        stroke="#8a8a8a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

const USED_BY = [
  {
    name: "xulux",
    href: "https://xulux.ai",
    Mark: XuluxMark,
  },
] as const;

/**
 * Quiet “used by” strip — brand marks only, no marketing chrome.
 */
export function UsedBy({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
        Used by
      </p>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {USED_BY.map(({ name, href, Mark }) => (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 transition-opacity hover:opacity-80"
              aria-label={`${name}.ai (opens in a new tab)`}
            >
              <Mark className="size-5 shrink-0" />
              <span className="font-mono text-sm font-medium tracking-tight text-foreground">
                {name}
                <span style={{ color: XULUX_ORANGE }}>.ai</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
