import { CURRENCY_SYMBOLS } from '../../../utils/formatters.js';

/**
 * Displays formatted price with currency symbol.
 * Open/Closed: extend via currency map if new currencies added.
 */
export default function PriceDisplay({ amount, currency = 'USD' }) {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  return (
    <span>
      {symbol} {(Number(amount) || 0).toFixed(2)}
    </span>
  );
}
