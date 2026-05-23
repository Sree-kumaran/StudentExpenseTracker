/**
 * formatCurrency
 * - Formats a number into currency using Intl.NumberFormat
 * - Default: USD (you can change to your preference later)
 */
export default function formatCurrency(amount, currency = "USD") {
  const value = Number(amount) || 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}
