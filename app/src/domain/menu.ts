import type { MenuItem, NutritionData } from "../types/nutrition";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Flattens categorized nutrition data into a single list of menu items with
 * stable, derived ids (category + name + serving size). Ids are computed
 * rather than stored, so the source JSON is never mutated.
 */
export function flattenMenu(data: NutritionData): MenuItem[] {
  const seen = new Map<string, number>();

  return data.categories.flatMap((category) =>
    category.items.map((item) => {
      const base = slugify(`${category.category}-${item.name}-${item.serving_size}`);
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count}`;

      return {
        ...item,
        category: category.category,
        id,
      };
    })
  );
}

export function groupByCategory(items: MenuItem[]): { category: string; items: MenuItem[] }[] {
  const order: string[] = [];
  const byCategory = new Map<string, MenuItem[]>();

  for (const item of items) {
    if (!byCategory.has(item.category)) {
      byCategory.set(item.category, []);
      order.push(item.category);
    }
    byCategory.get(item.category)!.push(item);
  }

  return order.map((category) => ({ category, items: byCategory.get(category)! }));
}

// Categories listed here are pinned to the front of the menu, in this order;
// everything else keeps its natural (source-data) order behind them.
const FEATURED_CATEGORIES = ["Fancy Milkshakes"];

export function orderCategories<T extends { category: string }>(groups: T[]): T[] {
  return [...groups].sort((a, b) => {
    const aIndex = FEATURED_CATEGORIES.indexOf(a.category);
    const bIndex = FEATURED_CATEGORIES.indexOf(b.category);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export function filterMenu(items: MenuItem[], query: string): MenuItem[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return items;
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(trimmed) || item.category.toLowerCase().includes(trimmed)
  );
}
