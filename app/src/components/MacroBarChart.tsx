import type { NutrientValues } from "../types/nutrition";

interface MacroBarChartProps {
  totals: NutrientValues;
}

function formatGrams(value: number): string {
  return `${value} g`;
}

export function MacroBarChart({ totals }: MacroBarChartProps) {
  const protein = totals.protein_g;
  const fat = totals.total_fat_g;
  const carbs = totals.carbohydrates_g;
  // Defensive clamp: source data shouldn't have fiber > carbs, but never let
  // net carbs go negative if it did.
  const fiber = Math.min(totals.dietary_fiber_g, carbs);
  const netCarbs = Math.max(carbs - fiber, 0);

  // One shared scale across all three bars so lengths stay comparable.
  const maxScale = Math.max(protein, fat, carbs, 1);
  const trackPct = (grams: number) => Math.min((grams / maxScale) * 100, 100);

  const summary =
    `Macro breakdown: protein ${protein} grams, fat ${fat} grams, ` +
    `carbohydrates ${carbs} grams (${netCarbs} net, ${fiber} fiber).`;

  return (
    <div className="macro-chart" role="img" aria-label={summary}>
      <div className="macro-chart__row">
        <span className="macro-chart__label">Protein</span>
        <span className="macro-chart__track">
          <span
            className="macro-chart__bar"
            title={`Protein: ${formatGrams(protein)}`}
            style={{ width: `${trackPct(protein)}%`, background: "var(--chart-protein)" }}
          />
        </span>
        <span className="macro-chart__value">{formatGrams(protein)}</span>
      </div>

      <div className="macro-chart__row">
        <span className="macro-chart__label">Fat</span>
        <span className="macro-chart__track">
          <span
            className="macro-chart__bar"
            title={`Fat: ${formatGrams(fat)}`}
            style={{ width: `${trackPct(fat)}%`, background: "var(--chart-fat)" }}
          />
        </span>
        <span className="macro-chart__value">{formatGrams(fat)}</span>
      </div>

      <div className="macro-chart__row">
        <span className="macro-chart__label">Carbs</span>
        <span className="macro-chart__track">
          <span
            className="macro-chart__bar macro-chart__bar--stacked"
            style={{ width: `${trackPct(carbs)}%` }}
          >
            <span
              className="macro-chart__segment"
              title={`Net carbs: ${formatGrams(netCarbs)}`}
              style={{
                flexBasis: `${(netCarbs / (netCarbs + fiber || 1)) * 100}%`,
                background: "var(--chart-carbs)",
              }}
            />
            {fiber > 0 && (
              <span
                className="macro-chart__segment"
                title={`Fiber: ${formatGrams(fiber)}`}
                style={{
                  flexBasis: `${(fiber / (netCarbs + fiber || 1)) * 100}%`,
                  background: "var(--chart-fiber)",
                }}
              />
            )}
          </span>
        </span>
        <span className="macro-chart__value">{formatGrams(carbs)}</span>
      </div>

      <ul className="macro-chart__legend">
        <li>
          <span className="macro-chart__swatch" style={{ background: "var(--chart-carbs)" }} />
          Net carbs {formatGrams(netCarbs)}
        </li>
        <li>
          <span className="macro-chart__swatch" style={{ background: "var(--chart-fiber)" }} />
          Fiber {formatGrams(fiber)}
        </li>
      </ul>
    </div>
  );
}
