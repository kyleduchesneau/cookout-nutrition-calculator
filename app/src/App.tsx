import { useCallback, useState } from "react";
import "./App.css";
import { MealSummary } from "./components/MealSummary";
import { MenuBrowser } from "./components/MenuBrowser";
import type { MealState } from "./domain/mealCalculator";
import { useNutritionData } from "./hooks/useNutritionData";

function App() {
  const data = useNutritionData();
  const [meal, setMeal] = useState<MealState>({});

  const handleQuantityChange = useCallback((itemId: string, quantity: number) => {
    setMeal((prev) => {
      if (quantity <= 0) {
        if (!(itemId in prev)) return prev;
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return { ...prev, [itemId]: quantity };
    });
  }, []);

  const handleRemove = useCallback((itemId: string) => {
    setMeal((prev) => {
      if (!(itemId in prev)) return prev;
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  }, []);

  const handleClear = useCallback(() => setMeal({}), []);

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-inner">
          <img
            className="app__logo"
            src={`${import.meta.env.BASE_URL}cookout-logo.svg`}
            alt="Cook Out"
          />
          <div className="app__header-text">
            <h1>Nutrition Calculator</h1>
            <p>Build a meal from Cook Out&rsquo;s menu and see estimated nutrition totals.</p>
            <p className="app__disclaimer">
              Not affiliated with Cook Out, Inc. Based on a PDF retrieved in September 2026.{" "}
              <a href="https://github.com/kyleduchesneau/cookout-nutrition-calculator" target="_blank" rel="noreferrer">
                View this project on GitHub.
              </a>
            </p>
          </div>
        </div>
      </header>

      <main className="app__main">
        {data.status === "loading" && (
          <p role="status" className="app__status">
            Loading menu data&hellip;
          </p>
        )}

        {data.status === "error" && (
          <p role="alert" className="app__status app__status--error">
            {data.message}
          </p>
        )}

        {data.status === "ready" && (
          <div className="app__layout">
            <MenuBrowser menu={data.menu} meal={meal} onQuantityChange={handleQuantityChange} />
            <MealSummary meal={meal} menu={data.menu} onRemove={handleRemove} onClear={handleClear} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
