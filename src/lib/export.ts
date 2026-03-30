import Papa from "papaparse";
import jsPDF from "jspdf";
import type { Guide, PairInfo } from "../types";

/**
 * Exports all candidate guides to a clean CSV.
 * Researchers often use this to run additional batch scripts or local off-target checks.
 */
export function exportCandidatesCSV(guides: Guide[], filename = "cdpd_candidates.csv") {
  const rows = guides.map((g) => ({
    ID: g.id,
    Strand: g.strand,
    Start_Pos: g.start,
    End_Pos: g.end,
    Cut_Pos: g.cut,
    PAM: g.pam,
    Protospacer_20bp: g.protospacer,
    GC_Percent: (g.gcFrac * 100).toFixed(1),
    Warnings: g.warnings.join(" | "),
  }));

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Generates a structured PDF Lab Report.
 * Designed to be easy to read for students and authoritative for research records.
 */
export function exportSelectedPairPDF(pair: PairInfo, seq: string, filename = "CRISPR_Deletion_Report.pdf") {
  const doc = new jsPDF();
  const primaryColor = [10, 20, 50]; // Navy Blue

  // --- HEADER SECTION ---
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("CRISPR Deletion Report", 14, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on ${new Date().toLocaleDateString()} | CDPD-v1 Research Export`, 14, 28);

  // --- SUMMARY BOX ---
  let y = 55;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Deletion Summary", 14, y);
  
  y += 8;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, 196, y);
  
  y += 10;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Predicted Deletion Size:`, 14, y);
  doc.setFont("helvetica", "bold");
  doc.text(`${pair.deletionBp} bp`, 60, y);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Orientation:`, 110, y);
  doc.setFont("helvetica", "bold");
  doc.text(pair.orientation.toUpperCase(), 140, y);

  // --- GUIDE TECHNICAL DETAILS ---
  y += 20;
  drawGuideTable(doc, "Guide A (Upstream)", pair.g1, y);
  y += 55;
  drawGuideTable(doc, "Guide B (Downstream)", pair.g2, y);

  // --- SEQUENCE CONTEXT ---
  y += 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Genomic Context", 14, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Reference Sequence Length: ${seq.length} bp`, 14, y);
  doc.text(`Cut Range: ${pair.cutLeft} to ${pair.cutRight} (relative to start)`, 14, y + 5);

  // --- NOTES & WARNINGS ---
  if (pair.notes.length || pair.g1.warnings.length || pair.g2.warnings.length) {
    y += 20;
    doc.setFillColor(245, 245, 245);
    doc.rect(14, y, 182, 35, "F");
    
    y += 8;
    doc.setTextColor(150, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Technical Alerts & Notes", 20, y);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(9);
    
    const combinedNotes = [
      ...pair.g1.warnings.map(w => `Guide 1 Warning: ${w}`),
      ...pair.g2.warnings.map(w => `Guide 2 Warning: ${w}`),
      ...pair.notes
    ];

    combinedNotes.slice(0, 4).forEach((note, i) => {
      doc.text(`• ${note}`, 20, y + 6 + (i * 5));
    });
  }

  // Footer Branding
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("CRISPR Deletion Pair Designer - For Research and Educational Purposes Only", 105, 285, { align: "center" });

  doc.save(filename);
}

/**
 * Internal helper to draw a clean data block for each guide
 */
function drawGuideTable(doc: jsPDF, title: string, g: Guide, y: number) {
  doc.setFillColor(240, 244, 248);
  doc.rect(14, y, 182, 45, "F");
  
  doc.setTextColor(10, 20, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(title, 20, y + 8);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`ID: ${g.id}`, 20, y + 16);
  doc.text(`Strand: ${g.strand === '+' ? 'Sense (+)' : 'Antisense (-)'}`, 20, y + 22);
  doc.text(`GC Content: ${(g.gcFrac * 100).toFixed(1)}%`, 20, y + 28);
  
  doc.setFont("courier", "bold"); // Monospace for DNA sequence
  doc.text(`Spacer: ${g.protospacer}`, 80, y + 16);
  doc.text(`PAM:    ${g.pam}`, 80, y + 22);
  doc.text(`Cut:    bp ${g.cut}`, 80, y + 28);
}