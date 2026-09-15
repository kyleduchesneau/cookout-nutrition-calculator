import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import type { NutritionData } from "./types/nutrition";

function makeItem(overrides: Partial<NutritionData["categories"][number]["items"][number]> = {}) {
  return {
    name: "Small Burger",
    serving_size: "3.2 oz (90.4 g)",
    is_addon: false,
    calories: 245,
    total_fat_g: 8,
    saturated_fat_g: 3,
    trans_fat_g: 1,
    cholesterol_mg: 37,
    sodium_mg: 309,
    carbohydrates_g: 27,
    dietary_fiber_g: 0,
    sugar_g: 4,
    protein_g: 14,
    vitamin_a_pct_dv: 0,
    vitamin_c_pct_dv: 0,
    calcium_pct_dv: 11,
    iron_pct_dv: 15,
    ...overrides,
  };
}

function mockNutritionData(): NutritionData {
  return {
    meta: {
      source_file: "test.pdf",
      restaurant: "Cook Out",
      parsed_date: "2026-01-01",
      total_items: 1,
      field_units: {},
      notes: [],
    },
    categories: [{ category: "Hamburgers", items: [makeItem()] }],
  };
}

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockNutritionData()),
        } as Response)
      )
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows a loading state, then the menu once data resolves", async () => {
    render(<App />);
    expect(screen.getByRole("status")).toHaveTextContent(/loading/i);

    await waitFor(() => expect(screen.getByText("Small Burger")).toBeInTheDocument());
    expect(screen.getByText(/your meal is empty/i)).toBeInTheDocument();
  });

  it("adding an item updates the meal summary and nutrition totals", async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText("Small Burger");
    await user.click(screen.getByRole("button", { name: /increase quantity of small burger/i }));

    const summary = screen.getByRole("region", { name: /your meal/i });
    expect(within(summary).getByText(/1 × small burger/i)).toBeInTheDocument();
    expect(within(summary).getByText("245 cal")).toBeInTheDocument();
  });

  it("opens and closes the about modal", async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText("Small Burger");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /about this app/i }));
    const dialog = await screen.findByRole("dialog", { name: /about this app/i });
    expect(within(dialog).getByText(/what is this\?/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/what is cook out\?/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^close$/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the about modal on Escape", async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText("Small Burger");
    await user.click(screen.getByRole("button", { name: /about this app/i }));
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows an error state when the data request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: false, status: 500 } as Response))
    );

    render(<App />);
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not load nutrition data/i);
  });
});
