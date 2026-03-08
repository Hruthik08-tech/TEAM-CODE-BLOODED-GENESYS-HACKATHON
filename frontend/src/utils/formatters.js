/**
 * Shared formatters - Single place for display logic.
 */
export const CURRENCY_SYMBOLS = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
};

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
];

export const QUANTITY_UNIT_OPTIONS = [
  { value: '', label: 'Select unit...' },
  { value: 'kg', label: 'kg - Kilograms' },
  { value: 'g', label: 'g - Grams' },
  { value: 'pieces', label: 'Pieces' },
  { value: 'litres', label: 'Litres' },
  { value: 'ml', label: 'ml - Millilitres' },
  { value: 'units', label: 'Units' },
  { value: 'boxes', label: 'Boxes' },
  { value: 'crates', label: 'Crates' },
  { value: 'kits', label: 'Kits' },
];

export function formatPrice(amount, currency = 'USD') {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  return `${symbol} ${(Number(amount) || 0).toFixed(2)}`;
}
