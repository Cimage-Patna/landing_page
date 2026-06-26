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

/** jsPDF's built-in Helvetica has no rupee glyph (₹ = U+20B9) and renders it as
 *  garbage, which also corrupts autotable's width measurement. Use "Rs." so the
 *  amounts print cleanly and columns size correctly. */
const money = (s: string) => s.replace(/₹\s?/g, "Rs. ");

/** Load a same-origin image and return it as a PNG data URL (jsPDF can't embed
 *  webp directly). Resolves null if it fails so the header falls back to text. */
function loadLogoPng(
  src: string,
): Promise<{ data: string; w: number; h: number } | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(null);
    const img = new window.Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve({ data: canvas.toDataURL("image/png"), w: img.naturalWidth, h: img.naturalHeight });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

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

export async function generateAllFeesPdf(studentName?: string): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const contentW = W - M * 2;
  const plans = Object.values(FEE_PLANS);

  // ── Header — brand strip + logo + title ──────────────────────────────────
  const logo = await loadLogoPng("/cimage-logo.webp");
  doc.setFillColor(...RED);
  doc.rect(0, 0, W, 6, "F"); // top brand accent

  if (logo) {
    const h = 42;
    const w = (h * logo.w) / logo.h;
    doc.addImage(logo.data, "PNG", M, 26, w, h);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(...RED);
    doc.text("CIMAGE", M, 56);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...INK);
  doc.text("Fee Structure", W - M, 42, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTE);
  doc.text("All Courses · Session 2026–2029", W - M, 58, { align: "right" });
  if (studentName) {
    doc.text(`Prepared for: ${studentName}`, W - M, 72, { align: "right" });
  }

  doc.setDrawColor(...RED);
  doc.setLineWidth(1.4);
  doc.line(M, 86, W - M, 86);

  // ── Main table — regular fee plan ────────────────────────────────────────
  let y = sectionHeading(doc, "Course-wise Fee Structure (Regular Plan)", 124);
  autoTable(doc, {
    startY: y + 12,
    head: [["Course", "Duration", "Total Fee", "At Admission", "Annual (Yr 2+)"]],
    body: plans.map((p) => [
      p.course,
      p.duration,
      money(p.totals.regular),
      money(p.atAdmission),
      money(p.annual),
    ]),
    theme: "grid",
    styles: baseStyles,
    headStyles,
    alternateRowStyles: { fillColor: ZEBRA },
    columnStyles: {
      0: { cellWidth: 168, fontStyle: "bold" },
      1: { halign: "center", cellWidth: 62 },
      2: { halign: "right", cellWidth: 93, fontStyle: "bold" },
      3: { halign: "right", cellWidth: 93 },
      4: { halign: "right", cellWidth: 91 },
    },
    margin: { left: M, right: M },
  });

  // ── One-time charges ─────────────────────────────────────────────────────
  y = sectionHeading(doc, "One-Time Charges (All Courses)", lastY(doc) + 32);
  autoTable(doc, {
    startY: y + 12,
    head: [["Charge", "Amount"]],
    body: ONE_TIME_CHARGES.map((c) => [c.label, money(c.amount)]),
    theme: "grid",
    styles: baseStyles,
    headStyles,
    alternateRowStyles: { fillColor: ZEBRA },
    columnStyles: { 0: { cellWidth: 230 }, 1: { halign: "right", cellWidth: 150 } },
    tableWidth: 380,
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
    "This fee is provisional. For detailed and accurate fees, please contact the admission department. Figures shown are the Regular fee plan — a lower one-time (complete) payment and easy down-payment plans are also available. University registration/exam fees and applicable taxes are payable separately. Fees are indicative for the 2026–2029 session and confirmed at the time of admission.",
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
