/**
 * Determines budget status based on monthly spending and budget.
 *
 * Rules:
 * - exceeded: spending > budget
 * - warning: spending >= 80% of budget
 * - safe: otherwise
 *
 * Returns:
 * { level: "safe"|"warning"|"exceeded", message, percentUsed, exceededAmount }
 */
export default function getBudgetStatus(budget, monthlySpending) {
  const b = Number(budget || 0);
  const s = Number(monthlySpending || 0);

  const percentUsed = b > 0 ? (s / b) * 100 : 0;

  if (b > 0 && s > b) {
    const exceededAmount = s - b;
    return {
      level: "exceeded",
      message: `Warning: You exceeded your budget by ₹${Math.round(exceededAmount)}`,
      percentUsed,
      exceededAmount,
    };
  }

  if (b > 0 && percentUsed >= 80) {
    return {
      level: "warning",
      message: `Caution: You have used ${Math.round(percentUsed)}% of your budget`,
      percentUsed,
      exceededAmount: 0,
    };
  }

  return {
    level: "safe",
    message: `Safe: You have used ${Math.round(percentUsed)}% of your budget`,
    percentUsed,
    exceededAmount: 0,
  };
}
