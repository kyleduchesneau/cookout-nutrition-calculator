import type { ReactNode } from "react";
import { formatServingSize } from "../domain/menu";
import { getItemEmoji } from "../domain/itemEmoji";
import type { MenuItem } from "../types/nutrition";
import { QuantityStepper } from "./QuantityStepper";

interface ItemCardProps {
  item: MenuItem;
  quantity: number;
  onChange: (quantity: number) => void;
  addons?: ReactNode;
}

export function ItemCard({ item, quantity, onChange, addons }: ItemCardProps) {
  return (
    <li className={`item-card${quantity > 0 ? " item-card--selected" : ""}`}>
      <div className="item-card__row">
        <div className="item-card__info">
          <p className="item-card__name">
            <span aria-hidden="true">{getItemEmoji(item)}</span> {item.name}
            {item.is_addon && <span className="item-card__badge">Add-on</span>}
          </p>
          <p className="item-card__meta">
            {formatServingSize(item.serving_size)} &middot; {item.calories} cal
          </p>
        </div>
        <QuantityStepper
          id={item.id}
          label={`${item.name}, ${formatServingSize(item.serving_size)}`}
          quantity={quantity}
          onChange={onChange}
        />
      </div>
      {addons}
    </li>
  );
}
