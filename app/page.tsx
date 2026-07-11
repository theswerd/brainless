import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroTerminal } from "@/components/hero-terminal";
import { BlankMind } from "@/components/hero-backdrops";
import { GetStarted } from "@/components/get-started";

export default function Home() {
  return (
    <div>
      <section className="relative isolate min-h-[calc(100svh-3.5rem)] overflow-hidden">
        <div className="opacity-30 dark:opacity-100">
          <BlankMind />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.15fr] lg:gap-16 lg:py-0 lg:min-h-[calc(100svh-3.5rem)]">
          <div className="flex flex-col items-start gap-5 hero-reveal">
            <h1 className="font-mono text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              brainless
            </h1>

            <p className="max-w-sm text-pretty text-lg leading-snug text-muted-foreground sm:text-xl">
              Claude Code, Codex, and Grok interfaces as shadcn components.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/components"
                className="group inline-flex items-center gap-2 bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Browse components
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/blocks"
                className="inline-flex items-center gap-2 border border-border bg-background/40 px-4 py-2.5 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-accent"
              >
                View blocks
              </Link>
            </div>
          </div>

          <div className="hero-reveal hero-reveal-delay">
            <HeroTerminal />
          </div>
        </div>
      </section>

      <GetStarted />
    </div>
  );
}
