/**
 * Export expenses to CSV and trigger a download.
 * Columns: Title, Amount, Category, Date
 */
export default function exportToCSV(
  expenses,
  filename = "expenses-report.csv",
) {
  const safe = Array.isArray(expenses) ? expenses : [];

  const headers = ["Title", "Amount", "Category", "Date"];

  // Escape CSV values safely (quotes, commas, new lines)
  function csvEscape(value) {
    const str = String(value ?? "");
    const needsQuotes = /[",\n]/.test(str);
    const escaped = str.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  }

  const rows = safe.map((e) => [
    csvEscape(e?.title),
    csvEscape(Number(e?.amount || 0)),
    csvEscape(e?.category),
    csvEscape(e?.date),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}
