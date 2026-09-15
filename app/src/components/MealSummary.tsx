import { calculateMealTotals, mealLines, type MealState } from "../domain/mealCalculator";
import { getItemEmoji } from "../domain/itemEmoji";
import type { MenuItem } from "../types/nutrition";
import { MacroBarChart } from "./MacroBarChart";
import { NutritionTotals } from "./NutritionTotals";

interface MealSummaryProps {
  meal: MealState;
  menu: MenuItem[];
  onRemove: (itemId: string) => void;
  onClear: () => void;
}

export function MealSummary({ meal, menu, onRemove, onClear }: MealSummaryProps) {
  const lines = mealLines(meal, menu);
  const totals = calculateMealTotals(meal, menu);

  return (
    <section aria-labelledby="meal-heading" className="meal-summary">
      <div className="meal-summary__header">
        <h2 id="meal-heading">Your Meal</h2>
        {lines.length > 0 && (
          <button type="button" className="meal-summary__clear" onClick={onClear}>
            Clear meal
          </button>
        )}
      </div>

      {lines.length === 0 ? (
        <p className="meal-summary__empty">
          Your meal is empty. Add items from the menu to see nutrition totals.
        </p>
      ) : (
        <ul className="meal-summary__lines">
          {lines.map(({ item, quantity }) => (
            <li key={item.id}>
              <span>
                {quantity} &times; <span aria-hidden="true">{getItemEmoji(item)}</span> {item.name}
              </span>
              <button
                type="button"
                className="meal-summary__remove"
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.name} from meal`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {lines.length > 0 && (
        <>
          <h3>Macro breakdown</h3>
          <MacroBarChart totals={totals} />
        </>
      )}

      <h3>Estimated totals</h3>
      <NutritionTotals totals={totals} />
      <p className="meal-summary__disclaimer">
        Totals are calculated from Cook Out&rsquo;s published nutrition data and are estimates,
        not medical or dietary advice.
      </p>
    </section>
  );
}
