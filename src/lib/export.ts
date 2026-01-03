import Papa from "papaparse";
import jsPDF from "jspdf";
import type { Guide, PairInfo } from "../types";

export function exportCandidatesCSV(guides: Guide[], filename = "cdpd_candidates.csv") {
  const rows = guides.map((g) => ({
    id: g.id,
    strand: g.strand,
    start: g.start,
    end: g.end,
    cut: g.cut,
    pam: g.pam,
    protospacer: g.protospacer,
    gcFrac: g.gcFrac,
    warnings: g.warnings.join("|"),
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

export function exportSelectedPairPDF(pair: PairInfo, seq: string, filename = "cdpd_selected_pair.pdf") {
  const doc = new jsPDF();
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text("CRISPR Deletion Pair Designer — Selected Pair", 14, 18);

  doc.setFont("times", "normal");
  doc.setFontSize(11);

  const lines = [
    `Guide 1: ${pair.g1.id}  strand ${pair.g1.strand}  start ${pair.g1.start}  cut ${pair.g1.cut}  GC ${(pair.g1.gcFrac * 100).toFixed(0)}%`,
    `Guide 2: ${pair.g2.id}  strand ${pair.g2.strand}  start ${pair.g2.start}  cut ${pair.g2.cut}  GC ${(pair.g2.gcFrac * 100).toFixed(0)}%`,
    `Predicted deletion: ${pair.deletionBp} bp (cuts ${pair.cutLeft} → ${pair.cutRight})`,
    `Orientation: ${pair.orientation}`,
    `Warnings:`,
    ` - ${pair.g1.id}: ${pair.g1.warnings.length ? pair.g1.warnings.join(", ") : "None"}`,
    ` - ${pair.g2.id}: ${pair.g2.warnings.length ? pair.g2.warnings.join(", ") : "None"}`,
    ``,
    `Sequence length: ${seq.length} bp`,
  ];

  let y = 30;
  for (const l of lines) {
    doc.text(l, 14, y);
    y += 6;
  }

  if (pair.notes.length) {
    y += 4;
    doc.setFont("times", "bold");
    doc.text("Notes", 14, y);
    y += 6;
    doc.setFont("times", "normal");
    pair.notes.forEach((n) => {
      doc.text(`• ${n}`, 14, y);
      y += 6;
    });
  }

  doc.save(filename);
}
