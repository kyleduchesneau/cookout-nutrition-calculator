import { MAX_QUANTITY, MIN_QUANTITY, normalizeQuantity } from "../domain/mealCalculator";

interface QuantityStepperProps {
  id: string;
  label: string;
  quantity: number;
  onChange: (quantity: number) => void;
}

export function QuantityStepper({ id, label, quantity, onChange }: QuantityStepperProps) {
  const inputId = `qty-${id}`;

  return (
    <div className="quantity-stepper" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        className="quantity-stepper__button"
        onClick={() => onChange(normalizeQuantity(quantity - 1))}
        disabled={quantity <= MIN_QUANTITY}
        aria-label={`Decrease quantity of ${label}`}
      >
        −
      </button>
      <input
        id={inputId}
        className="quantity-stepper__input"
        type="number"
        inputMode="numeric"
        min={MIN_QUANTITY}
        max={MAX_QUANTITY}
        value={quantity}
        aria-label={`Quantity of ${label}`}
        onChange={(event) => onChange(normalizeQuantity(event.target.valueAsNumber))}
      />
      <button
        type="button"
        className="quantity-stepper__button"
        onClick={() => onChange(normalizeQuantity(quantity + 1))}
        disabled={quantity >= MAX_QUANTITY}
        aria-label={`Increase quantity of ${label}`}
      >
        +
      </button>
    </div>
  );
}
