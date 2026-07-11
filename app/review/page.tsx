import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PlanTodosReview } from "@/components/plan-todos-review";

export const metadata: Metadata = {
  title: "Plan + todos review",
  description:
    "Side-by-side: captured Claude plan / task-list UI vs React components.",
};

async function readCrop(name: string) {
  return readFile(
    path.join(process.cwd(), "references/captures/_plan_todos_crops", `${name}.html`),
    "utf8",
  );
}

export default async function ReviewPage() {
  const captures = {
    todosMixed: await readCrop("todos-mixed"),
    todosPending: await readCrop("todos-pending"),
    planReady: await readCrop("plan-ready"),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PlanTodosReview captures={captures} />
    </div>
  );
}
