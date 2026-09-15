import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { NutritionData } from "../types/nutrition";
import { flattenMenu } from "./menu";

// Read the canonical dataset directly from the repo-root data/ directory
// (rather than a static import) so this file stays inside the app's
// TypeScript rootDir/build graph while still validating the real,
// non-fixture data end to end.
const repoRoot = dirname(dirname(dirname(dirname(fileURLToPath(import.meta.url)))));
const raw = readFileSync(join(repoRoot, "data", "cookout_nutrition.json"), "utf-8");
const data = JSON.parse(raw) as NutritionData;

describe("cookout_nutrition.json", () => {
  it("flattens into the item count recorded in its own metadata", () => {
    const menu = flattenMenu(data);
    expect(menu).toHaveLength(data.meta.total_items);
  });

  it("produces a unique id for every menu item", () => {
    const menu = flattenMenu(data);
    const ids = new Set(menu.map((item) => item.id));
    expect(ids.size).toBe(menu.length);
  });

  it("has no negative nutrient values", () => {
    const menu = flattenMenu(data);
    const negativeFields = menu.flatMap((item) =>
      Object.entries(item)
        .filter(([, value]) => typeof value === "number" && value < 0)
        .map(([key]) => `${item.id}:${key}`)
    );
    expect(negativeFields).toEqual([]);
  });
});
