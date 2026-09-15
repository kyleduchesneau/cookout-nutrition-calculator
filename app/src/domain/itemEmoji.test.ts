import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { NutritionData } from "../types/nutrition";
import { getItemEmoji } from "./itemEmoji";
import { flattenMenu } from "./menu";

function item(name: string, category: string, isAddon = false) {
  return { name, category, is_addon: isAddon };
}

describe("getItemEmoji", () => {
  it("leads burgers with the burger emoji", () => {
    const category = "Fresh Homemade Char-Grilled Hamburgers";
    expect(getItemEmoji(item("Small 1/8 lb", category))).toBe("🍔");
    expect(getItemEmoji(item("Cheddar Style", category))).toBe("🍔");
  });

  it("leads chicken sandwiches and strips with the drumstick emoji", () => {
    expect(getItemEmoji(item("Char-Grilled Chicken Breast", "Char-Grilled Chicken Breast"))).toBe(
      "🍗"
    );
    expect(
      getItemEmoji(item("Spicy Chicken Breast", "Hot Crispy Spicy Chicken Breast Fillet"))
    ).toBe("🍗");
    expect(getItemEmoji(item("Chicken Strips (3)", "Homemade Style Chicken Strips"))).toBe("🍗");
  });

  it("gives pork barbeque and hot dogs their own emoji", () => {
    expect(getItemEmoji(item("BBQ Plate", "Chopped Pork Barbeque"))).toBe("🍖");
    expect(getItemEmoji(item("Hot Dog", "Char-Grilled Hot Dogs"))).toBe("🌭");
  });

  it("differentiates quesadillas by filling", () => {
    expect(getItemEmoji(item("Cheese", "Quesadillas"))).toBe("🧀");
    expect(getItemEmoji(item("Chicken", "Quesadillas"))).toBe("🍗");
    expect(getItemEmoji(item("Beef", "Quesadillas"))).toBe("🥩");
  });

  it("matches milkshakes to their flavor", () => {
    const category = "Fancy Milkshakes";
    expect(getItemEmoji(item("Strawberry", category))).toBe("🍓");
    expect(getItemEmoji(item("Vanilla", category))).toBe("🍦");
    expect(getItemEmoji(item("Hershey's® Chocolate", category))).toBe("🍫");
    expect(getItemEmoji(item("Chocolate Cherry", category))).toBe("🍒");
    expect(getItemEmoji(item("Banana Nut", category))).toBe("🍌");
    expect(getItemEmoji(item("Peanut Butter Banana", category))).toBe("🥜");
    expect(getItemEmoji(item("Oreo® Mint", category))).toBe("🍪");
    expect(getItemEmoji(item("M&M®", category))).toBe("🍬");
    expect(getItemEmoji(item("Malted Milk", category))).toBe("🥛");
    expect(getItemEmoji(item("Cherry Cheesecake", category))).toBe("🍒");
    expect(getItemEmoji(item("Philadelphia® Cheesecake", category))).toBe("🍰");
  });

  it("matches beverage flavor words even outside the milkshake category", () => {
    expect(getItemEmoji(item("Fanta Orange® (Regular)", "Beverages"))).toBe("🍊");
    expect(getItemEmoji(item("Cheerwine® (Regular)", "Beverages"))).toBe("🍒");
    expect(getItemEmoji(item("Cheerwine® Float", "Beverages"))).toBe("🍨");
    expect(getItemEmoji(item("Fresh Brewed Sweet Tea (Regular)", "Beverages"))).toBe("🍵");
    expect(getItemEmoji(item("Hi-C® Poppin' Pink Lemonade (Regular)", "Beverages"))).toBe("🍋");
    expect(getItemEmoji(item("Hi-C® Fruit Punch (Regular)", "Beverages"))).toBe("🧃");
  });

  it("falls back to a generic soda cup for unflavored beverages", () => {
    expect(getItemEmoji(item("Diet Coke® (Regular)", "Beverages"))).toBe("🥤");
  });

  it("matches sides by name keyword", () => {
    const category = "Sides/Other Menu Items";
    expect(getItemEmoji(item("Onion Rings", category))).toBe("🧅");
    expect(getItemEmoji(item("Chicken Nuggets", category))).toBe("🍗");
    expect(getItemEmoji(item("BLT Sandwich", category))).toBe("🥪");
    expect(getItemEmoji(item("Bacon Ranch Wrap", category))).toBe("🌯");
    expect(getItemEmoji(item("Large Fries", category))).toBe("🍟");
    expect(getItemEmoji(item("Side of Chili", category))).toBe("🌶️");
    expect(getItemEmoji(item("Cheese Curds", category))).toBe("🧀");
  });

  it("gives 'style' add-ons their own emoji instead of the parent category's", () => {
    const burgers = "Fresh Homemade Char-Grilled Hamburgers";
    expect(getItemEmoji(item("Everything", burgers, true))).toBe("😍");
    expect(getItemEmoji(item("Cook Out® Style", burgers, true))).toBe("🔥");
    expect(getItemEmoji(item("Out West Style", burgers, true))).toBe("🤠");
    expect(getItemEmoji(item("Steak Style", burgers, true))).toBe("🥩");
    expect(getItemEmoji(item("Cheddar Style", burgers, true))).toBe("🧀");

    const chicken = "Char-Grilled Chicken Breast";
    expect(getItemEmoji(item("Orginal Style", chicken, true))).toBe("⭐");
    expect(getItemEmoji(item("Barbeque Style", chicken, true))).toBe("🍯");
    expect(getItemEmoji(item("Cajun Style", chicken, true))).toBe("🌶️");
    expect(getItemEmoji(item("Club Style", chicken, true))).toBe("🥓");
  });

  it("returns a plate emoji for anything unrecognized", () => {
    expect(getItemEmoji(item("Mystery Item", "Some New Category"))).toBe("🍽️");
  });

  it("resolves every real menu item without throwing", () => {
    const repoRoot = dirname(dirname(dirname(dirname(fileURLToPath(import.meta.url)))));
    const raw = readFileSync(join(repoRoot, "data", "cookout_nutrition.json"), "utf-8");
    const data = JSON.parse(raw) as NutritionData;
    const menu = flattenMenu(data);

    for (const menuItem of menu) {
      expect(typeof getItemEmoji(menuItem)).toBe("string");
      expect(getItemEmoji(menuItem).length).toBeGreaterThan(0);
    }
  });
});
