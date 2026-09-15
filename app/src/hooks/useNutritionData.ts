import { useEffect, useState } from "react";
import { flattenMenu } from "../domain/menu";
import type { MenuItem, NutritionData } from "../types/nutrition";

export type NutritionDataState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; menu: MenuItem[]; meta: NutritionData["meta"] };

const DATA_URL = `${import.meta.env.BASE_URL}data/cookout_nutrition.json`;

export function useNutritionData(): NutritionDataState {
  const [state, setState] = useState<NutritionDataState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch(DATA_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json() as Promise<NutritionData>;
      })
      .then((data) => {
        if (cancelled) return;
        setState({ status: "ready", menu: flattenMenu(data), meta: data.meta });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Unknown error";
        setState({ status: "error", message: `Could not load nutrition data: ${message}` });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
