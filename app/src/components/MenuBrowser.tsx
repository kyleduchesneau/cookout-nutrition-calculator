import { useMemo, useState } from "react";
import { filterMenu, groupByCategory, orderCategories } from "../domain/menu";
import type { MealState } from "../domain/mealCalculator";
import type { MenuItem } from "../types/nutrition";
import { ItemAddons } from "./ItemAddons";
import { ItemCard } from "./ItemCard";

interface MenuBrowserProps {
  menu: MenuItem[];
  meal: MealState;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

export function MenuBrowser({ menu, meal, onQuantityChange }: MenuBrowserProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => filterMenu(menu, query), [menu, query]);
  const grouped = useMemo(() => orderCategories(groupByCategory(filtered)), [filtered]);
  const isSearching = query.trim().length > 0;

  return (
    <section aria-labelledby="menu-heading" className="menu-browser">
      <h2 id="menu-heading">Menu</h2>
      <div className="menu-browser__search">
        <label htmlFor="menu-search">Search items</label>
        <input
          id="menu-search"
          type="search"
          placeholder="e.g. hot dog, milkshake, fries"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {grouped.length === 0 && (
        <p className="menu-browser__empty" role="status">
          No items match &ldquo;{query}&rdquo;.
        </p>
      )}

      {grouped.map(({ category, items }) => {
        const baseItems = items.filter((item) => !item.is_addon);
        const addonItems = items.filter((item) => item.is_addon);
        // While searching, keep the flat list so a search for an add-on
        // style (e.g. "steak") still finds it even if its base item doesn't
        // match. Otherwise, styles stay tucked away until their base item is
        // added, to keep the default list short.
        const renderFlat = isSearching || addonItems.length === 0;

        return (
          <details key={category} className="menu-category" open={isSearching}>
            <summary>
              {category} <span className="menu-category__count">({items.length})</span>
            </summary>
            <ul className="item-list">
              {(renderFlat ? items : baseItems).map((item) => {
                const quantity = meal[item.id] ?? 0;
                const showAddons = !renderFlat && quantity > 0 && addonItems.length > 0;
                return (
                  <ItemCard
                    key={item.id}
                    item={item}
                    quantity={quantity}
                    onChange={(nextQuantity) => onQuantityChange(item.id, nextQuantity)}
                    addons={
                      showAddons ? (
                        <ItemAddons
                          addons={addonItems}
                          meal={meal}
                          onQuantityChange={onQuantityChange}
                        />
                      ) : undefined
                    }
                  />
                );
              })}
            </ul>
          </details>
        );
      })}
    </section>
  );
}
