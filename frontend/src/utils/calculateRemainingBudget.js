/**
 * Remaining Budget = Budget - Monthly Spending
 * Kept as a separate function so it can be reused elsewhere later.
 */
export default function calculateRemainingBudget(
  monthlyBudget,
  monthlySpending,
) {
  return Number(monthlyBudget || 0) - Number(monthlySpending || 0);
}
