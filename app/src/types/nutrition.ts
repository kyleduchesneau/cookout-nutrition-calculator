export const NUTRIENT_FIELDS = [
  "calories",
  "total_fat_g",
  "saturated_fat_g",
  "trans_fat_g",
  "cholesterol_mg",
  "sodium_mg",
  "carbohydrates_g",
  "dietary_fiber_g",
  "sugar_g",
  "protein_g",
  "vitamin_a_pct_dv",
  "vitamin_c_pct_dv",
  "calcium_pct_dv",
  "iron_pct_dv",
] as const;

export type NutrientField = (typeof NUTRIENT_FIELDS)[number];

export const NUTRIENT_LABELS: Record<NutrientField, string> = {
  calories: "Calories",
  total_fat_g: "Total Fat",
  saturated_fat_g: "Saturated Fat",
  trans_fat_g: "Trans Fat",
  cholesterol_mg: "Cholesterol",
  sodium_mg: "Sodium",
  carbohydrates_g: "Carbohydrates",
  dietary_fiber_g: "Dietary Fiber",
  sugar_g: "Sugar",
  protein_g: "Protein",
  vitamin_a_pct_dv: "Vitamin A",
  vitamin_c_pct_dv: "Vitamin C",
  calcium_pct_dv: "Calcium",
  iron_pct_dv: "Iron",
};

export const NUTRIENT_UNITS: Record<NutrientField, string> = {
  calories: "cal",
  total_fat_g: "g",
  saturated_fat_g: "g",
  trans_fat_g: "g",
  cholesterol_mg: "mg",
  sodium_mg: "mg",
  carbohydrates_g: "g",
  dietary_fiber_g: "g",
  sugar_g: "g",
  protein_g: "g",
  vitamin_a_pct_dv: "%DV",
  vitamin_c_pct_dv: "%DV",
  calcium_pct_dv: "%DV",
  iron_pct_dv: "%DV",
};

export type NutrientValues = Record<NutrientField, number>;

export interface NutritionItem extends NutrientValues {
  name: string;
  serving_size: string;
  is_addon: boolean;
}

export interface NutritionCategory {
  category: string;
  items: NutritionItem[];
}

export interface NutritionMeta {
  source_file: string;
  restaurant: string;
  parsed_date: string;
  total_items: number;
  field_units: Record<string, string>;
  notes: string[];
}

export interface NutritionData {
  meta: NutritionMeta;
  categories: NutritionCategory[];
}

/** A NutritionItem flattened out of its category, with a stable derived id. */
export interface MenuItem extends NutritionItem {
  id: string;
  category: string;
}
