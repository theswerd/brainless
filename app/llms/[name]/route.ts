import { itemLlmsTxt } from "@/lib/llms";

export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;
  const slug = name.replace(/\.txt$/i, "");
  const body = itemLlmsTxt(slug);

  if (!body) {
    return new Response(`Unknown brainless item: ${slug}\n`, {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(body + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
