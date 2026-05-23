/**
 * Dummy initial expenses (used only when localStorage is empty).
 * Dates are stored as ISO strings "YYYY-MM-DD".
 */
const dummyExpenses = [
  {
    id: "e1",
    title: "Cafeteria lunch",
    amount: 8.5,
    category: "Food",
    date: "2026-05-20",
  },
  {
    id: "e2",
    title: "Bus pass",
    amount: 25,
    category: "Transport",
    date: "2026-05-01",
  },
  {
    id: "e3",
    title: "Online shopping (stationery)",
    amount: 15.99,
    category: "Shopping",
    date: "2026-05-12",
  },
  {
    id: "e4",
    title: "Movie night",
    amount: 12,
    category: "Entertainment",
    date: "2026-05-18",
  },
  {
    id: "e5",
    title: "Mobile bill",
    amount: 19.99,
    category: "Bills",
    date: "2026-05-05",
  },
];

export default dummyExpenses;
