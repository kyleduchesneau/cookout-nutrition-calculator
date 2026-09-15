import { NUTRIENT_FIELDS, NUTRIENT_LABELS, NUTRIENT_UNITS } from "../types/nutrition";
import type { NutrientValues } from "../types/nutrition";

const HEADLINE_FIELDS = new Set(["calories", "protein_g", "sodium_mg", "sugar_g"]);

export function NutritionTotals({ totals }: { totals: NutrientValues }) {
  return (
    <table className="nutrition-totals">
      <caption className="sr-only">Estimated meal nutrition totals</caption>
      <thead>
        <tr>
          <th scope="col">Nutrient</th>
          <th scope="col">Amount</th>
        </tr>
      </thead>
      <tbody>
        {NUTRIENT_FIELDS.map((field) => (
          <tr key={field} className={HEADLINE_FIELDS.has(field) ? "nutrition-totals__headline" : undefined}>
            <th scope="row">{NUTRIENT_LABELS[field]}</th>
            <td>
              {totals[field]} {NUTRIENT_UNITS[field]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
