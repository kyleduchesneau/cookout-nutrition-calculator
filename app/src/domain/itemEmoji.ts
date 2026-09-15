import type { MenuItem } from "../types/nutrition";

interface KeywordRule {
  test: RegExp;
  emoji: string;
}

// Checked in order, most specific first, against the lowercased item name.
// Shared across categories (e.g. "orange" also catches Fanta Orange, "cherry"
// also catches Cheerwine) since a flavor word means the same thing anywhere
// it shows up on the menu.
const FLAVOR_RULES: KeywordRule[] = [
  { test: /float/, emoji: "🍨" },
  { test: /peanut butter banana/, emoji: "🥜" },
  { test: /strawberry/, emoji: "🍓" },
  { test: /banana/, emoji: "🍌" },
  { test: /blueberry/, emoji: "🫐" },
  { test: /watermelon/, emoji: "🍉" },
  { test: /pineapple/, emoji: "🍍" },
  { test: /peach/, emoji: "🍑" },
  { test: /cherry/, emoji: "🍒" },
  { test: /orange/, emoji: "🍊" },
  { test: /lemonade/, emoji: "🍋" },
  { test: /\btea\b/, emoji: "🍵" },
  { test: /nut/, emoji: "🥜" },
  { test: /punch/, emoji: "🧃" },
  { test: /oreo|wafer/, emoji: "🍪" },
  { test: /mint/, emoji: "🌿" },
  { test: /cheesecake/, emoji: "🍰" },
  { test: /cappuccino|mocha|coffee/, emoji: "☕" },
  { test: /caramel/, emoji: "🍮" },
  { test: /malt/, emoji: "🥛" },
  { test: /m&m/, emoji: "🍬" },
  { test: /snickers|reese|heath|toffee|chocolate|fudge/, emoji: "🍫" },
  { test: /cheerwine/, emoji: "🍒" },
  { test: /vanilla/, emoji: "🍦" },
];

// "Style" add-ons get their own emoji instead of inheriting the parent
// category's (a burger topping shouldn't just repeat the burger emoji).
const ADDON_RULES: KeywordRule[] = [
  { test: /everything/, emoji: "😍" },
  { test: /cook out/, emoji: "🔥" },
  { test: /out west/, emoji: "🤠" },
  { test: /steak/, emoji: "🥩" },
  { test: /cheddar|cheese/, emoji: "🧀" },
  { test: /orginal|original/, emoji: "⭐" },
  { test: /barbeque|bbq/, emoji: "🍯" },
  { test: /cajun/, emoji: "🌶️" },
  { test: /club/, emoji: "🥓" },
];

// Name-based rules for sides that aren't otherwise covered by a category
// override or a flavor word.
const SIDE_RULES: KeywordRule[] = [
  { test: /wrap/, emoji: "🌯" },
  { test: /blt/, emoji: "🥪" },
  { test: /onion ring/, emoji: "🧅" },
  { test: /nugget/, emoji: "🍗" },
  { test: /corn dog|hot dog|cheese dog/, emoji: "🌭" },
  { test: /chili/, emoji: "🌶️" },
  { test: /slaw/, emoji: "🥬" },
  { test: /hushpuppi/, emoji: "🌽" },
  { test: /fries/, emoji: "🍟" },
  { test: /okra/, emoji: "🫛" },
  { test: /rounds/, emoji: "🥔" },
  { test: /cheese curds/, emoji: "🧀" },
];

/**
 * Picks a visual emoji for a menu item. Burgers and chicken sandwiches/strips
 * lead with their protein (per the menu's own category grouping); milkshakes
 * and anything else with a flavor word in its name get that flavor; sides
 * fall back to a shape/ingredient cue; everything else gets a neutral default.
 */
export function getItemEmoji(item: Pick<MenuItem, "name" | "category" | "is_addon">): string {
  const name = item.name.toLowerCase();

  if (item.is_addon) {
    for (const rule of ADDON_RULES) {
      if (rule.test.test(name)) return rule.emoji;
    }
  }

  switch (item.category) {
    case "Fresh Homemade Char-Grilled Hamburgers":
      return "🍔";
    case "Char-Grilled Chicken Breast":
    case "Hot Crispy Spicy Chicken Breast Fillet":
    case "Homemade Style Chicken Strips":
      return "🍗";
    case "Chopped Pork Barbeque":
      return "🍖";
    case "Char-Grilled Hot Dogs":
      return "🌭";
    case "Crispy Chicken Wraps":
      return "🌯";
    case "Quesadillas":
      if (name === "chicken") return "🍗";
      if (name === "beef") return "🥩";
      return "🧀";
  }

  for (const rule of FLAVOR_RULES) {
    if (rule.test.test(name)) return rule.emoji;
  }

  for (const rule of SIDE_RULES) {
    if (rule.test.test(name)) return rule.emoji;
  }

  if (item.category === "Beverages" || item.category === "Fancy Milkshakes") {
    return "🥤";
  }

  return "🍽️";
}
