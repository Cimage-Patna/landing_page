/**
 * Client-side, CIMAGE-branded fee-structure PDF — rendered as proper bordered
 * tables (jspdf-autotable) so it reads like the source fee page. Pure type +
 * fills for branding (no image assets). One combined PDF covering every course.
 */
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FEE_PLANS, ONE_TIME_CHARGES } from "./fees";

const RED: [number, number, number] = [231, 0, 11]; // #e7000b
const INK: [number, number, number] = [24, 24, 27];
const MUTE: [number, number, number] = [113, 113, 122];
const LINE: [number, number, number] = [228, 228, 231];
const ZEBRA: [number, number, number] = [249, 250, 251];

const M = 44;

/** finalY of the most recently drawn autotable. */
function lastY(doc: jsPDF): number {
  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
}

function sectionHeading(doc: jsPDF, label: string, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(...INK);
  doc.text(label, M, y);
  doc.setDrawColor(...RED);
  doc.setLineWidth(1.6);
  doc.line(M, y + 6, M + 34, y + 6);
  return y + 6;
}

const baseStyles = {
  font: "helvetica" as const,
  fontSize: 10,
  cellPadding: 7,
  textColor: INK,
  lineColor: LINE,
  lineWidth: 0.5,
  valign: "middle" as const,
};

const headStyles = {
  fillColor: RED,
  textColor: [255, 255, 255] as [number, number, number],
  fontStyle: "bold" as const,
  fontSize: 10,
  cellPadding: 7,
};

export function generateAllFeesPdf(studentName?: string): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const contentW = W - M * 2;
  const plans = Object.values(FEE_PLANS);

  // ── Header band ───────────────────────────────────────────────────────────
  doc.setFillColor(...RED);
  doc.rect(0, 0, W, 96, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.text("CIMAGE", M, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text("Group of Institutions   ·   Patna", M, 71);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Fee Structure", W - M, 44, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text("All Courses · Session 2026–2029", W - M, 62, { align: "right" });
  if (studentName) {
    doc.setFontSize(9.5);
    doc.text(`Prepared for: ${studentName}`, W - M, 78, { align: "right" });
  }

  // ── Main table — fee + payment milestones (no down/regular columns) ───────
  let y = sectionHeading(doc, "Course-wise Fee Structure", 132);
  autoTable(doc, {
    startY: y + 12,
    head: [["Course", "Duration", "Total Fee", "At Admission", "Annual (Yr 2+)"]],
    body: plans.map((p) => [p.course, p.duration, p.totals.complete, p.atAdmission, p.annual]),
    theme: "grid",
    styles: baseStyles,
    headStyles,
    alternateRowStyles: { fillColor: ZEBRA },
    columnStyles: {
      0: { cellWidth: 188, fontStyle: "bold" },
      1: { halign: "center", cellWidth: 52 },
      2: { halign: "right", fontStyle: "bold" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
    margin: { left: M, right: M },
  });

  // ── One-time charges ─────────────────────────────────────────────────────
  y = sectionHeading(doc, "One-Time Charges (All Courses)", lastY(doc) + 32);
  autoTable(doc, {
    startY: y + 12,
    head: [["Charge", "Amount"]],
    body: ONE_TIME_CHARGES.map((c) => [c.label, c.amount]),
    theme: "grid",
    styles: baseStyles,
    headStyles,
    alternateRowStyles: { fillColor: ZEBRA },
    columnStyles: { 1: { halign: "right", cellWidth: 150 } },
    tableWidth: 340,
    margin: { left: M, right: M },
  });

  // ── Notes / disclaimer ───────────────────────────────────────────────────
  y = lastY(doc) + 24;
  if (y > H - 92) {
    doc.addPage();
    y = M + 10;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  doc.text("Note", M, y);
  y += 13;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTE);
  const note = doc.splitTextToSize(
    "Total Fee shown is the complete one-time payment. Convenient down-payment and easy-installment plans are also available — please ask the admissions office. Indicative fees for the 2026–2029 session; GST/taxes and university/exam-board charges (where applicable) are extra. Final fees are confirmed at the time of admission.",
    contentW,
  );
  doc.text(note, M, y);

  // ── Footer on every page ─────────────────────────────────────────────────
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    const fy = H - 48;
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.8);
    doc.line(M, fy, W - M, fy);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    doc.text("CIMAGE Tower, Patliputra Industrial Area, Patna", M, fy + 16);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTE);
    doc.setFontSize(9);
    doc.text("Admissions: 7250 767 676   ·   cimage.in", M, fy + 29);
    doc.text(`Page ${p} of ${pages}`, W - M, fy + 29, { align: "right" });
  }

  doc.save("CIMAGE-Fee-Structure-2026.pdf");
}
