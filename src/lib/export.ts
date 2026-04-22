import Papa from "papaparse";
import jsPDF from "jspdf";
import type { Guide, PairInfo } from "../types";

// ── Readable warning descriptions ────────────────────────────────
const WARN_TEXT: Record<string, string> = {
  LOW_GC:             "GC < 30% — reduced melting stability",
  HIGH_GC:            "GC > 80% — may self-fold",
  HOMOPOLYMER:        "Long homopolymer run — reduces specificity",
  SIMPLE_REPEAT:      "Simple repeat — reduces specificity",
  TOO_CLOSE_TO_END:   "Too close to sequence boundary",
  POLY_T:             "PolyT run — terminates U6/T7 transcription",
  HAS_N:              "Contains ambiguous base N",
  SELF_COMPLEMENTARY: "Partial hairpin — may mis-fold",
  BAD_SEED:           "Problematic PAM-proximal seed region",
  HAIRPIN_POTENTIAL:  "Predicted gRNA hairpin",
  OFF_TARGET_RISK:    "Elevated off-target risk",
};

// ── CSV export ────────────────────────────────────────────────────
export function exportCandidatesCSV(guides: Guide[], filename = "cdpd_candidates.csv") {
  const rows = guides.map((g) => ({
    ID:               g.id,
    Strand:           g.strand,
    Start_Pos:        g.start,
    End_Pos:          g.end,
    Cut_Pos:          g.cut,
    PAM:              g.pam,
    Protospacer_20bp: g.protospacer,
    GC_Percent:       (g.gcFrac * 100).toFixed(1),
    OnTarget_Score:   g.onTarget?.score?.toFixed(0) ?? "—",
    Warnings:         g.warnings.map(w => WARN_TEXT[w] ?? w).join(" | "),
  }));

  const csv  = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── PDF helpers ───────────────────────────────────────────────────
const PAGE_W = 210;
const MARGIN  = 16;
const COL_W   = PAGE_W - MARGIN * 2;

function scoreColor(score: number): [number, number, number] {
  if (score >= 70) return [105, 240, 174];  // green
  if (score >= 45) return [255, 202, 40];   // amber
  return [239, 83, 80];                     // red
}

function row(
  doc: jsPDF,
  label: string,
  value: string,
  y: number,
  x = MARGIN,
  colW = COL_W,
  labelRatio = 0.45,
) {
  const lw = colW * labelRatio;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(130, 140, 160);
  doc.text(label, x, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 35, 50);
  doc.text(value, x + lw, y);
  return y + 5.5;
}

function sectionTitle(doc: jsPDF, title: string, y: number, color: [number,number,number] = [10,20,55]) {
  doc.setFillColor(...color);
  doc.rect(MARGIN, y, COL_W, 7.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text(title, MARGIN + 4, y + 5.2);
  return y + 12;
}

function divider(doc: jsPDF, y: number) {
  doc.setDrawColor(220, 225, 235);
  doc.line(MARGIN, y, MARGIN + COL_W, y);
  return y + 4;
}

function scoreBar(doc: jsPDF, score: number, y: number, x = MARGIN, w = COL_W) {
  const [r, g, b] = scoreColor(score);
  // Track
  doc.setFillColor(235, 237, 242);
  doc.roundedRect(x, y, w, 4, 1, 1, "F");
  // Fill
  doc.setFillColor(r, g, b);
  doc.roundedRect(x, y, (score / 100) * w, 4, 1, 1, "F");
}

// ── Main PDF export ───────────────────────────────────────────────
export function exportSelectedPairPDF(
  pair: PairInfo,
  seq: string,
  strategyMode: "ko" | "ki" = "ko",
  donorTemplate = "",
  filename = "CRISPR_Lab_Report.pdf",
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 0;

  // ── HEADER ────────────────────────────────────────────────────
  doc.setFillColor(8, 16, 40);
  doc.rect(0, 0, PAGE_W, 36, "F");

  // accent bar
  doc.setFillColor(79, 195, 247);
  doc.rect(0, 0, 4, 36, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("CRISPR Lab Report", MARGIN + 2, 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(160, 180, 210);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}`, MARGIN + 2, 22);
  doc.text("CRISPR-CDPD v2.0  ·  Educational approximation — not clinically validated", MARGIN + 2, 28);

  // strategy badge
  const isKI = strategyMode === "ki";
  doc.setFillColor(isKI ? 106 : 79, isKI ? 27 : 195, isKI ? 154 : 247);
  doc.roundedRect(PAGE_W - 50, 10, 34, 12, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(isKI ? "HDR / Knock-In" : "NHEJ / Knock-Out", PAGE_W - 33, 17.5, { align: "center" });

  y = 42;

  // ── OVERVIEW ──────────────────────────────────────────────────
  y = sectionTitle(doc, "01  Experiment Overview", y);

  const feasScore = (() => {
    let s = 85;
    if (pair.g1.gcFrac < 0.4 || pair.g1.gcFrac > 0.6) s -= 15;
    if (pair.g2.gcFrac < 0.4 || pair.g2.gcFrac > 0.6) s -= 15;
    if (pair.deletionBp > 1000) s -= 20;
    return Math.max(s, 10);
  })();
  const [fr, fg, fb] = scoreColor(feasScore);

  // Two-column summary
  const half = COL_W / 2 - 3;
  // Left box
  doc.setFillColor(245, 247, 252);
  doc.roundedRect(MARGIN, y, half, 30, 2, 2, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(22);
  doc.setTextColor(fr, fg, fb);
  doc.text(String(feasScore), MARGIN + 6, y + 16);
  doc.setFontSize(8); doc.setTextColor(100, 110, 130);
  doc.text("HEURISTIC DESIGN SCORE  /100", MARGIN + 6, y + 22);
  doc.text("(educational approximation)", MARGIN + 6, y + 27);
  scoreBar(doc, feasScore, y + 4, MARGIN + 4, half - 8);

  // Right box
  const rx = MARGIN + half + 6;
  doc.setFillColor(245, 247, 252);
  doc.roundedRect(rx, y, half, 30, 2, 2, "F");
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(80, 90, 110);
  doc.text("Predicted Span", rx + 5, y + 9);
  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(30, 35, 50);
  doc.text(`${pair.deletionBp} bp`, rx + 5, y + 18);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(80, 90, 110);
  doc.text(`Orientation: ${pair.orientation.toUpperCase()}`, rx + 5, y + 25);

  y += 35;
  y = row(doc, "Reference sequence length:", `${seq.length} bp`, y);
  y = row(doc, "Cut-site range:", `bp ${pair.cutLeft} — ${pair.cutRight}`, y);
  y = row(doc, "Strategy:", isKI ? "Knock-In (HDR) — requires donor template + dividing cells" : "Knock-Out (NHEJ) — error-prone repair → indels / deletion", y);
  if (isKI) {
    y = row(doc, "HDR efficiency note:", "~1–5% in primary cells; ~40–60% with base editors for SNPs", y);
  }
  y = divider(doc, y + 2);

  // ── GUIDE DETAILS ─────────────────────────────────────────────
  y = sectionTitle(doc, "02  Guide RNA Details", y, [30, 40, 80]);

  for (const [idx, g] of [[0, pair.g1], [1, pair.g2]] as [number, Guide][]) {
    const score   = g.onTarget?.score ?? 50;
    const [gr, gg, gb] = scoreColor(score);
    const gcPct   = (g.gcFrac * 100).toFixed(0);
    const gcOk    = g.gcFrac >= 0.4 && g.gcFrac <= 0.6;

    // Guide header bar
    doc.setFillColor(idx === 0 ? 240 : 232, idx === 0 ? 248 : 240, idx === 0 ? 255 : 255);
    doc.roundedRect(MARGIN, y, COL_W, 8, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.setTextColor(gr, gg, gb);
    doc.text(`Guide ${idx + 1}  (${idx === 0 ? "Upstream" : "Downstream"})  —  ${g.id}`, MARGIN + 4, y + 5.5);
    // Score badge
    doc.setFillColor(gr, gg, gb);
    doc.roundedRect(PAGE_W - MARGIN - 28, y + 1.5, 27, 5.5, 1, 1, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(20, 20, 20);
    doc.text(`Score: ${Math.round(score)}/100`, PAGE_W - MARGIN - 14.5, y + 5.3, { align: "center" });
    y += 12;

    // Sequence in monospace box
    doc.setFillColor(30, 35, 50);
    doc.roundedRect(MARGIN, y, COL_W, 9, 1.5, 1.5, "F");
    doc.setFont("courier", "bold"); doc.setFontSize(9.5);
    doc.setTextColor(105, 240, 174);
    doc.text(`5'  ${g.protospacer}  ${g.pam}  3'`, MARGIN + 5, y + 6);
    doc.setFont("courier", "normal"); doc.setFontSize(7);
    doc.setTextColor(120, 180, 150);
    doc.text("        ← 20 nt spacer →          PAM", MARGIN + 5, y + 9.5);
    y += 13;

    // Properties grid
    const lx = MARGIN, rx2 = MARGIN + COL_W / 2 + 2;
    y = row(doc, "Strand:", g.strand === "+" ? "Sense (+) — coding strand" : "Antisense (−) — template strand", y, lx, COL_W / 2 - 2);
    const rowY = y - 5.5;
    row(doc, "Cut position:", `bp ${g.cut}`, rowY, rx2, COL_W / 2 - 2);
    y = row(doc, "GC content:", `${gcPct}%  ${gcOk ? "✓ optimal (40–60%)" : "⚠ outside optimal range"}`, y, lx, COL_W / 2 - 2);
    row(doc, "PAM:", g.pam, rowY + 5.5, rx2, COL_W / 2 - 2);

    // Warnings
    if (g.warnings.length > 0) {
      doc.setFillColor(255, 243, 224);
      doc.roundedRect(MARGIN, y, COL_W, 5 + g.warnings.length * 5, 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(180, 80, 0);
      doc.text("⚠  Design Warnings", MARGIN + 4, y + 4.5);
      y += 7;
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(100, 60, 0);
      g.warnings.forEach(w => {
        doc.text(`•  ${WARN_TEXT[w] ?? w}`, MARGIN + 6, y);
        y += 5;
      });
      y += 1;
    } else {
      doc.setFillColor(232, 255, 240);
      doc.roundedRect(MARGIN, y, COL_W, 7, 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(30, 130, 60);
      doc.text("✓  No design warnings", MARGIN + 4, y + 4.8);
      y += 10;
    }

    if (idx === 0) { y = divider(doc, y + 1); }
  }
  y = divider(doc, y + 2);

  // ── KI DONOR SECTION ──────────────────────────────────────────
  if (isKI) {
    y = sectionTitle(doc, "03  Knock-In Donor Template", y, [20, 80, 60]);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(50, 60, 80);
    const kiLines = [
      "HDR requires co-delivery of a donor template alongside the Cas9/gRNA.",
      "For point corrections: use a single-stranded oligodeoxynucleotide (ssODN) with ~75 bp homology arms.",
      "For larger inserts (e.g. CAR cassette): use a dsDNA donor (plasmid or linear dsDNA with long arms).",
      "Mutate the PAM in the donor sequence to prevent re-cutting after successful HDR.",
    ];
    kiLines.forEach(l => { doc.text(`•  ${l}`, MARGIN + 3, y); y += 5.5; });

    if (donorTemplate.trim()) {
      y += 2;
      doc.setFillColor(28, 38, 52);
      doc.roundedRect(MARGIN, y, COL_W, 22, 2, 2, "F");
      doc.setFont("courier", "normal"); doc.setFontSize(7.5);
      doc.setTextColor(105, 240, 174);
      const lines = doc.splitTextToSize(donorTemplate.replace(/^;[^\n]*\n/gm, "").trim(), COL_W - 8);
      lines.slice(0, 4).forEach((l: string, i: number) => {
        doc.text(l, MARGIN + 4, y + 6 + i * 4);
      });
      if (lines.length > 4) {
        doc.setTextColor(100, 130, 110);
        doc.text(`… (${lines.length - 4} more lines)`, MARGIN + 4, y + 22);
      }
      y += 26;
    }
    y = divider(doc, y + 1);
  }

  // ── INTERPRETATION ────────────────────────────────────────────
  const interpTitle = isKI ? (isKI && y > 230 ? null : "04  Beginner Interpretation") : "03  Beginner Interpretation";
  if (interpTitle && y < 240) {
    y = sectionTitle(doc, interpTitle, y, [50, 50, 100]);
    const scoreLabel = feasScore > 70 ? "HIGH — good candidate for wet-lab follow-up" :
                       feasScore > 40 ? "MODERATE — optimise GC content or try alternative sites" :
                                        "LOW — consider a different guide pair";
    y = row(doc, "Design score interpretation:", `${feasScore}/100 → ${scoreLabel}`, y);

    const delInterp = pair.deletionBp < 30  ? "Very small span — behaves like a short indel; may be hard to screen by gel."
                    : pair.deletionBp > 500 ? "Large fragment — requires high simultaneous efficiency from both guides."
                    :                          "Good size for PCR + gel electrophoresis screening.";
    y = row(doc, "Predicted span interpretation:", delInterp, y);

    if (!isKI) {
      y = row(doc, "What happens in the cell:", "Cas9 makes two double-strand breaks. NHEJ repairs them error-prone, creating indels or deleting the segment between cuts.", y);
      y = row(doc, "Verification method:", "PCR across the deletion site. Wild-type band shifts to a smaller size (or disappears).", y);
    } else {
      y = row(doc, "What happens in the cell:", "Cas9 creates a DSB. HDR uses the donor template to insert the correct sequence. Only works efficiently in dividing cells.", y);
      y = row(doc, "Verification method:", "Sanger sequencing or allele-specific PCR to confirm donor integration.", y);
    }
  }

  // ── NOTES ─────────────────────────────────────────────────────
  const allNotes = [...pair.notes];
  if (allNotes.length > 0 && y < 255) {
    y += 3;
    doc.setFillColor(255, 249, 230);
    doc.roundedRect(MARGIN, y, COL_W, 6 + allNotes.length * 5.5, 2, 2, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(160, 100, 0);
    doc.text("ℹ  Pair Notes", MARGIN + 4, y + 4.5);
    y += 7;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(100, 70, 0);
    allNotes.forEach(n => { doc.text(`•  ${n}`, MARGIN + 5, y); y += 5.5; });
  }

  // ── FOOTER ────────────────────────────────────────────────────
  doc.setFillColor(235, 238, 248);
  doc.rect(0, 284, PAGE_W, 13, "F");
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(100, 110, 140);
  doc.text("CRISPR Lab Designer v2.0  ·  All scores are heuristic approximations — not clinically validated predictions.", PAGE_W / 2, 291, { align: "center" });

  doc.save(filename);
}
