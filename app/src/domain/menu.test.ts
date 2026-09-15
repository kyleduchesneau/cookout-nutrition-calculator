import { describe, expect, it } from "vitest";
import type { NutritionData } from "../types/nutrition";
import { filterMenu, flattenMenu, groupByCategory, orderCategories } from "./menu";

function makeData(): NutritionData {
  return {
    meta: {
      source_file: "test.pdf",
      restaurant: "Cook Out",
      parsed_date: "2026-01-01",
      total_items: 3,
      field_units: {},
      notes: [],
    },
    categories: [
      {
        category: "Hamburgers",
        items: [
          {
            name: "Small",
            serving_size: "3.2 oz (90.4 g)",
            is_addon: false,
            calories: 245,
            total_fat_g: 8,
            saturated_fat_g: 3,
            trans_fat_g: 1,
            cholesterol_mg: 37,
            sodium_mg: 309,
            carbohydrates_g: 27,
            dietary_fiber_g: 0,
            sugar_g: 4,
            protein_g: 14,
            vitamin_a_pct_dv: 0,
            vitamin_c_pct_dv: 0,
            calcium_pct_dv: 11,
            iron_pct_dv: 15,
          },
        ],
      },
      {
        category: "Hot Dogs",
        items: [
          {
            name: "Hot Dog",
            serving_size: "2.9 oz (81 g)",
            is_addon: false,
            calories: 260,
            total_fat_g: 15,
            saturated_fat_g: 5,
            trans_fat_g: 0,
            cholesterol_mg: 25,
            sodium_mg: 600,
            carbohydrates_g: 22,
            dietary_fiber_g: 0,
            sugar_g: 3,
            protein_g: 8,
            vitamin_a_pct_dv: 0,
            vitamin_c_pct_dv: 5,
            calcium_pct_dv: 8,
            iron_pct_dv: 6,
          },
          {
            name: "Cheese Dog",
            serving_size: "2.3 oz (66 g)",
            is_addon: false,
            calories: 146,
            total_fat_g: 3,
            saturated_fat_g: 1,
            trans_fat_g: 0,
            cholesterol_mg: 2,
            sodium_mg: 410,
            carbohydrates_g: 25,
            dietary_fiber_g: 0,
            sugar_g: 3,
            protein_g: 3,
            vitamin_a_pct_dv: 0,
            vitamin_c_pct_dv: 0,
            calcium_pct_dv: 9,
            iron_pct_dv: 6,
          },
        ],
      },
    ],
  };
}

describe("flattenMenu", () => {
  it("produces one flattened entry per source item with unique ids", () => {
    const menu = flattenMenu(makeData());
    expect(menu).toHaveLength(3);
    const ids = new Set(menu.map((item) => item.id));
    expect(ids.size).toBe(3);
  });

  it("carries the owning category onto each item", () => {
    const menu = flattenMenu(makeData());
    expect(menu.find((item) => item.name === "Hot Dog")?.category).toBe("Hot Dogs");
  });

  it("disambiguates items that would otherwise collide", () => {
    const data = makeData();
    data.categories[1].items.push({ ...data.categories[1].items[0] });
    const menu = flattenMenu(data);
    const ids = menu.filter((item) => item.name === "Hot Dog").map((item) => item.id);
    expect(new Set(ids).size).toBe(2);
  });
});

describe("groupByCategory", () => {
  it("preserves first-seen category order", () => {
    const menu = flattenMenu(makeData());
    const grouped = groupByCategory(menu);
    expect(grouped.map((g) => g.category)).toEqual(["Hamburgers", "Hot Dogs"]);
    expect(grouped[1].items).toHaveLength(2);
  });
});

describe("orderCategories", () => {
  it("leaves order unchanged when no featured category is present", () => {
    const groups = [{ category: "Hamburgers" }, { category: "Hot Dogs" }];
    expect(orderCategories(groups).map((g) => g.category)).toEqual(["Hamburgers", "Hot Dogs"]);
  });

  it("pins a featured category to the front regardless of its original position", () => {
    const groups = [
      { category: "Hamburgers" },
      { category: "Hot Dogs" },
      { category: "Fancy Milkshakes" },
      { category: "Beverages" },
    ];
    expect(orderCategories(groups).map((g) => g.category)).toEqual([
      "Fancy Milkshakes",
      "Hamburgers",
      "Hot Dogs",
      "Beverages",
    ]);
  });
});

describe("filterMenu", () => {
  it("returns everything for a blank query", () => {
    const menu = flattenMenu(makeData());
    expect(filterMenu(menu, "  ")).toHaveLength(3);
  });

  it("matches case-insensitively on item name or category", () => {
    const menu = flattenMenu(makeData());
    expect(filterMenu(menu, "cheese")).toHaveLength(1);
    expect(filterMenu(menu, "HAMBURGERS")).toHaveLength(1);
    expect(filterMenu(menu, "nonexistent")).toHaveLength(0);
  });
});
