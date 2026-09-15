import { describe, expect, it } from "vitest";
import type { MenuItem } from "../types/nutrition";
import {
  MAX_QUANTITY,
  calculateMealTotals,
  isMealEmpty,
  mealLines,
  normalizeQuantity,
} from "./mealCalculator";

function makeItem(overrides: Partial<MenuItem> = {}): MenuItem {
  return {
    id: "burger-small",
    category: "Hamburgers",
    name: "Small Burger",
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
    ...overrides,
  };
}

describe("normalizeQuantity", () => {
  it("clamps negative values to 0", () => {
    expect(normalizeQuantity(-3)).toBe(0);
  });

  it("clamps values above the max", () => {
    expect(normalizeQuantity(MAX_QUANTITY + 50)).toBe(MAX_QUANTITY);
  });

  it("rounds fractional values to the nearest integer", () => {
    expect(normalizeQuantity(2.4)).toBe(2);
    expect(normalizeQuantity(2.6)).toBe(3);
  });

  it("normalizes non-finite input to 0", () => {
    expect(normalizeQuantity(Number.NaN)).toBe(0);
    expect(normalizeQuantity(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("calculateMealTotals", () => {
  const menu = [makeItem()];

  it("returns all-zero totals for an empty meal", () => {
    const totals = calculateMealTotals({}, menu);
    expect(totals.calories).toBe(0);
    expect(totals.protein_g).toBe(0);
  });

  it("ignores unknown item ids rather than throwing", () => {
    const totals = calculateMealTotals({ "does-not-exist": 2 }, menu);
    expect(totals.calories).toBe(0);
  });

  it("ignores zero and negative quantities", () => {
    expect(calculateMealTotals({ "burger-small": 0 }, menu).calories).toBe(0);
    expect(calculateMealTotals({ "burger-small": -1 }, menu).calories).toBe(0);
  });

  it("multiplies nutrient values by quantity", () => {
    const totals = calculateMealTotals({ "burger-small": 3 }, menu);
    expect(totals.calories).toBe(735);
    expect(totals.protein_g).toBe(42);
    expect(totals.sodium_mg).toBe(927);
  });

  it("sums totals across multiple distinct items", () => {
    const twoItemMenu = [
      makeItem({ id: "a", calories: 100, protein_g: 5 }),
      makeItem({ id: "b", calories: 200, protein_g: 10 }),
    ];
    const totals = calculateMealTotals({ a: 1, b: 2 }, twoItemMenu);
    expect(totals.calories).toBe(500);
    expect(totals.protein_g).toBe(25);
  });

  it("clamps a quantity above the max before totaling", () => {
    const totals = calculateMealTotals({ "burger-small": MAX_QUANTITY + 100 }, menu);
    expect(totals.calories).toBe(245 * MAX_QUANTITY);
  });

  it("preserves fractional source values without floating point drift", () => {
    const fractional = [makeItem({ id: "powerade", carbohydrates_g: 40.5 })];
    const totals = calculateMealTotals({ powerade: 3 }, fractional);
    expect(totals.carbohydrates_g).toBe(121.5);
  });
});

describe("mealLines", () => {
  it("drops unknown ids and non-positive quantities, sorts by name", () => {
    const menu = [
      makeItem({ id: "b", name: "Banana Shake" }),
      makeItem({ id: "a", name: "Apple Pie" }),
    ];
    const lines = mealLines({ b: 1, a: 2, missing: 5, zero: 0 }, menu);
    expect(lines.map((l) => l.item.id)).toEqual(["a", "b"]);
    expect(lines[0].quantity).toBe(2);
  });
});

describe("isMealEmpty", () => {
  it("is true for an empty object and all-zero quantities", () => {
    expect(isMealEmpty({})).toBe(true);
    expect(isMealEmpty({ a: 0, b: -1 })).toBe(true);
  });

  it("is false when at least one item has a positive quantity", () => {
    expect(isMealEmpty({ a: 0, b: 1 })).toBe(false);
  });
});
