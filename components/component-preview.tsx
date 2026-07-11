"use client";

import * as React from "react";
import { CopyButton } from "@/components/copy-button";
import { AgentActions } from "@/components/agent-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PACKAGE_MANAGERS,
  type PackageManager,
} from "@/lib/install";
import { cn } from "@/lib/utils";

/**
 * ComponentPreview — Preview / Usage / Code, package-manager install,
 * and first-class agent actions (Copy prompt / Claude Code / Codex).
 */
export function ComponentPreview({
  name,
  title,
  code,
  codeHtml,
  usage,
  usageHtml,
  installs,
  previewClassName,
  children,
}: {
  name: string;
  title: string;
  code: string;
  codeHtml: string;
  usage: string;
  usageHtml: string;
  installs: Record<PackageManager, string>;
  previewClassName?: string;
  children: React.ReactNode;
}) {
  const [pm, setPm] = React.useState<PackageManager>("bun");

  return (
    <div id={name} className="scroll-mt-24">
      <div className="mb-3 min-w-0">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <p className="mt-0.5 font-mono text-[12px] text-muted-foreground">
          {name}
        </p>
      </div>

      <Tabs defaultValue="preview" className="gap-0">
        <div className="flex items-center justify-between gap-3 border border-b-0 border-border/70 bg-card/20 px-1 py-1">
          <TabsList
            variant="line"
            className="h-8 rounded-none bg-transparent p-0"
          >
            <TabsTrigger
              value="preview"
              className="rounded-none px-3 font-mono text-xs capitalize"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="usage"
              className="rounded-none px-3 font-mono text-xs capitalize"
            >
              Usage
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="rounded-none px-3 font-mono text-xs capitalize"
            >
              Code
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preview" className="mt-0">
          <div
            className={cn(
              "overflow-x-auto border border-border/70 bg-[var(--term-bg)] p-5 text-[var(--term-fg)]",
              previewClassName,
            )}
          >
            {children}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="mt-0">
          <CodePane html={usageHtml} copyValue={usage} label="Copy usage" />
        </TabsContent>

        <TabsContent value="code" className="mt-0">
          <CodePane html={codeHtml} copyValue={code} label="Copy source" />
        </TabsContent>
      </Tabs>

      <div className="mt-3 grid gap-3">
        <div className="border border-border/60 bg-card/20">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              Installation
            </span>
            <div
              role="tablist"
              aria-label="Package manager"
              className="flex rounded-none border border-border/70 p-0.5 font-mono text-[11px]"
            >
              {PACKAGE_MANAGERS.map((manager) => (
                <button
                  key={manager.id}
                  type="button"
                  role="tab"
                  aria-selected={pm === manager.id}
                  onClick={() => setPm(manager.id)}
                  className={cn(
                    "rounded-none px-2 py-1 transition-colors",
                    pm === manager.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {manager.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto px-3 py-2 font-mono text-xs text-muted-foreground">
            <span className="select-none text-foreground/70">$</span>
            <span className="whitespace-nowrap text-foreground/85">
              {installs[pm]}
            </span>
            <CopyButton
              value={installs[pm]}
              label="Copy install command"
              className="ml-auto inline-flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground"
            />
          </div>
        </div>

        <AgentActions item={{ name, title }} />
      </div>
    </div>
  );
}

function CodePane({
  html,
  copyValue,
  label,
}: {
  html: string;
  copyValue: string;
  label: string;
}) {
  return (
    <div className="relative border border-border/70">
      <div className="absolute right-2.5 top-2.5 z-10">
        <CopyButton
          value={copyValue}
          label={label}
          className="inline-flex size-7 items-center justify-center rounded-none border border-border/60 bg-background/80 text-muted-foreground backdrop-blur hover:text-foreground"
        />
      </div>
      <div
        className="code-scroll max-h-[460px] overflow-auto text-[13px] [&_pre]:m-0 [&_pre]:!bg-[var(--term-bg)] [&_pre]:p-4 [&_pre]:leading-[1.55]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
