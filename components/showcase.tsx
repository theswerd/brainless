import { getRegistryItem, itemSource } from "@/lib/registry";
import { highlight } from "@/lib/highlight";
import { getCatalogItem } from "@/lib/catalog";
import { installCommands } from "@/lib/install";
import { usageFor } from "@/lib/usage";
import { ComponentPreview } from "@/components/component-preview";

/**
 * Showcase — server wrapper: pulls registry source, builds usage + install
 * variants, highlights both, and hands everything to the preview viewer.
 */
export async function Showcase({
  name,
  usage,
  previewClassName,
  children,
}: {
  name: string;
  usage?: string;
  previewClassName?: string;
  children: React.ReactNode;
}) {
  const item = await getRegistryItem(name);
  const catalog = getCatalogItem(name);
  const title = item?.title ?? catalog?.title ?? name;
  const description = item?.description ?? "";

  const code = item ? itemSource(item) : "// not built yet — run `bunx shadcn build`";
  const usageCode = catalog
    ? usageFor(catalog, usage)
    : `// unknown component: ${name}`;

  const [codeHtml, usageHtml] = await Promise.all([
    highlight(code, "tsx"),
    highlight(usageCode, "tsx"),
  ]);

  const installs = installCommands(name);

  return (
    <div>
      {description ? (
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      <ComponentPreview
        name={name}
        title={title}
        code={code}
        codeHtml={codeHtml}
        usage={usageCode}
        usageHtml={usageHtml}
        installs={installs}
        previewClassName={previewClassName}
      >
        {children}
      </ComponentPreview>
    </div>
  );
}
