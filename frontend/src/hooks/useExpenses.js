import { useContext } from "react";
import { ExpenseContext } from "../context/ExpenseContext";

/**
 * useExpenses
 * - Small helper hook so components don't import useContext + ExpenseContext every time
 */
export default function useExpenses() {
  const ctx = useContext(ExpenseContext);

  if (!ctx) {
    throw new Error("useExpenses must be used inside an <ExpenseProvider>.");
  }

  return ctx;
}
