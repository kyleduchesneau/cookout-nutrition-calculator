import { NUTRIENT_FIELDS, type MenuItem, type NutrientValues } from "../types/nutrition";

/** Selected meal state: menu item id -> quantity. Absent or 0 means not selected. */
export type MealState = Record<string, number>;

export const MIN_QUANTITY = 0;
export const MAX_QUANTITY = 20;

/**
 * Clamps and rounds a raw quantity to a safe integer range. Non-finite input
 * (NaN, Infinity from a stray text-field value) normalizes to 0 rather than
 * throwing, since this sits at a UI/domain boundary that must not trust
 * arbitrary input.
 */
export function normalizeQuantity(raw: number): number {
  if (!Number.isFinite(raw)) return MIN_QUANTITY;
  const rounded = Math.round(raw);
  return Math.max(MIN_QUANTITY, Math.min(rounded, MAX_QUANTITY));
}

function zeroTotals(): NutrientValues {
  return Object.fromEntries(NUTRIENT_FIELDS.map((field) => [field, 0])) as NutrientValues;
}

/**
 * Computes nutrition totals for a meal. Unknown item ids (e.g. stale
 * selection after a data change) are skipped rather than trusted, and every
 * quantity is renormalized here regardless of what produced the MealState -
 * this is the one place callers can rely on for a correct total.
 */
export function calculateMealTotals(meal: MealState, menu: MenuItem[]): NutrientValues {
  const byId = new Map(menu.map((item) => [item.id, item]));
  const totals = zeroTotals();

  for (const [itemId, rawQuantity] of Object.entries(meal)) {
    const item = byId.get(itemId);
    if (!item) continue;

    const quantity = normalizeQuantity(rawQuantity);
    if (quantity <= 0) continue;

    for (const field of NUTRIENT_FIELDS) {
      totals[field] += item[field] * quantity;
    }
  }

  for (const field of NUTRIENT_FIELDS) {
    // Round to 1 decimal place to absorb float noise while keeping
    // fractional source values (e.g. Powerade's 40.5g carbs) visible.
    totals[field] = Math.round(totals[field] * 10) / 10;
  }

  return totals;
}

export interface MealLine {
  item: MenuItem;
  quantity: number;
}

/** Resolves a MealState into displayable line items, dropping unknown/zero entries. */
export function mealLines(meal: MealState, menu: MenuItem[]): MealLine[] {
  const byId = new Map(menu.map((item) => [item.id, item]));
  const lines: MealLine[] = [];

  for (const [itemId, rawQuantity] of Object.entries(meal)) {
    const item = byId.get(itemId);
    if (!item) continue;
    const quantity = normalizeQuantity(rawQuantity);
    if (quantity <= 0) continue;
    lines.push({ item, quantity });
  }

  return lines.sort((a, b) => a.item.name.localeCompare(b.item.name));
}

export function isMealEmpty(meal: MealState): boolean {
  return Object.values(meal).every((quantity) => normalizeQuantity(quantity) <= 0);
}
