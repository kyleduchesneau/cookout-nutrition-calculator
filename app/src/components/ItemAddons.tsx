import type { MealState } from "../domain/mealCalculator";
import type { MenuItem } from "../types/nutrition";
import { ItemCard } from "./ItemCard";

interface ItemAddonsProps {
  addons: MenuItem[];
  meal: MealState;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

/** Revealed under a base item once it's added to the meal (quantity > 0). */
export function ItemAddons({ addons, meal, onQuantityChange }: ItemAddonsProps) {
  return (
    <div className="item-card__addons">
      <p className="item-card__addons-label">Add a style</p>
      <ul className="item-list item-list--nested">
        {addons.map((addon) => (
          <ItemCard
            key={addon.id}
            item={addon}
            quantity={meal[addon.id] ?? 0}
            onChange={(quantity) => onQuantityChange(addon.id, quantity)}
          />
        ))}
      </ul>
    </div>
  );
}
