import type { CatalogItem } from "@/lib/catalog";
import { DocsMobileNav, DocsSidebar } from "@/components/docs/docs-sidebar";

export function DocsShell({
  title,
  description,
  basePath,
  items,
  children,
}: {
  title: string;
  description: React.ReactNode;
  basePath: "/components" | "/blocks";
  items: CatalogItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:py-12">
      <DocsSidebar items={items} basePath={basePath} />
      <div className="min-w-0 flex-1">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            {description}
          </p>
        </header>
        <DocsMobileNav items={items} basePath={basePath} />
        <div className="mt-10 space-y-16 lg:mt-12">{children}</div>
      </div>
    </div>
  );
}

export function DocsSection({
  id,
  title,
  color,
  children,
}: {
  id: string;
  title: string;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2
        className="mb-6 text-xl font-semibold tracking-tight"
        style={color ? { color } : undefined}
      >
        {title}
      </h2>
      <div className="space-y-14">{children}</div>
    </section>
  );
}
