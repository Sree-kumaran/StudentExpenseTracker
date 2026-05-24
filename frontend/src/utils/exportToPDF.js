import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Export expenses to a professional-looking PDF using jsPDF + autoTable.
 */
export default function exportToPDF(
  expenses,
  {
    filename = "expenses-report.pdf",
    appTitle = "Student Expense Tracker",
  } = {},
) {
  const safe = Array.isArray(expenses) ? expenses : [];

  const doc = new jsPDF();

  const now = new Date();
  const dateStr = now.toLocaleDateString();

  const total = safe.reduce((sum, e) => sum + Number(e?.amount || 0), 0);

  // Header
  doc.setFontSize(16);
  doc.text(appTitle, 14, 16);

  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(`Report Date: ${dateStr}`, 14, 22);
  doc.text(`Total Expenses: ${total.toFixed(2)}`, 14, 27);

  // Table
  const head = [["Title", "Amount", "Category", "Date"]];
  const body = safe.map((e) => [
    String(e?.title ?? ""),
    Number(e?.amount || 0).toFixed(2),
    String(e?.category ?? ""),
    String(e?.date ?? ""),
  ]);

  doc.autoTable({
    head,
    body,
    startY: 34,
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [15, 23, 42] }, // slate-900-ish
    columnStyles: {
      1: { halign: "right" }, // amount right aligned
    },
  });

  doc.save(filename);
}
