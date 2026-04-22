import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, FlaskConical, Dna } from "lucide-react";

type ScenarioCategory = "knockout" | "knockin" | "impossible";
type StrategyMode = "ko" | "ki";

export type ScenarioWarning = "essential_gene" | "mitochondrial" | "repetitive_target" | "rna_virus";

export interface LabScenario {
  id: string;
  name: string;
  gene: string;
  disease: string;
  category: ScenarioCategory;
  mode: StrategyMode;
  difficulty: "easy" | "medium" | "hard" | "impossible";
  description: string;
  clinicalNote?: string;
  impossibleReason?: string;
  whyImpossible?: { title: string; points: string[] };
  /** Fired as an in-designer alert when the scenario is loaded */
  scenarioWarning?: ScenarioWarning;
  sequence?: string;
  donorExample?: string;
  color: string;
  emoji: string;
}

export const WARNING_MESSAGES: Record<ScenarioWarning, { title: string; body: string; color: string }> = {
  essential_gene: {
    title: "⚠ Essential Gene — Likely Lethal",
    body: "This gene is essential for cell survival. Knocking it out typically causes cell death. Use conditional knockouts (Cre-lox) or CRISPRi (transcriptional repression) instead of a permanent KO.",
    color: "#ef9a9a",
  },
  mitochondrial: {
    title: "⚠ Mitochondrial DNA — SpCas9 Cannot Reach This Target",
    body: "Standard SpCas9 + gRNA cannot cross the mitochondrial double membrane, and no RNA import system exists in human mitochondria. Use DdCBE (David Liu lab, 2020) for C→T edits, or MitoTALENs for DSBs.",
    color: "#ef9a9a",
  },
  repetitive_target: {
    title: "⚠ Highly Repetitive Target — Genome-Wide Off-Target Risk",
    body: "The guide RNA targets a sequence present in many places across the genome. This leads to massive off-target cleavage and is not suitable for therapeutic use without SNP-based allele-specific targeting.",
    color: "#ffca28",
  },
  rna_virus: {
    title: "⚠ RNA Virus — SpCas9 Has No Activity on RNA",
    body: "SpCas9 is a DNA endonuclease. It cannot cleave RNA genomes. Use Cas13 (e.g. CasRx) for RNA targeting, or design antivirals against the viral DNA integration step where applicable.",
    color: "#ef9a9a",
  },
};

const SCENARIOS: LabScenario[] = [
  {
    id: "pcsk9-ko",
    name: "PCSK9 KO",
    gene: "PCSK9",
    disease: "Hypercholesterolemia",
    category: "knockout",
    mode: "ko",
    difficulty: "easy",
    description: "Knock out PCSK9 to reduce LDL cholesterol. Loss-of-function naturally occurs in ~2% of people with no adverse effects — making this a low-risk KO target.",
    clinicalNote: "Inclisiran (siRNA) and evolocumab (mAb) already target PCSK9. A CRISPR KO could be a single lifetime dose.",
    sequence: ">PCSK9 Region (Educational Model)\nATGGCCCCTGCCCGGGGCCTGCTGGAGACCCGGGCCCCACTGCTGCAGCCGCTGCTGCTGCTACTGCTCCTGGCCCAGCCGGCAGTGGAGCTGGAGCAGCAGCTGGCTGGCAACCGGCAGACCTTCATCTCCTCCAAGGCCTTCCTGCAGGAGCTCACCCTGGGCATCGGGGAGAAGATGGCTGTGGACCTGGGCTTCCAGGACGTGGACTCAGAGCAGCGGCTGGCCAGGATCACCAACCAGGTGACCCAGGGCTCCCTGGAGGAGCTGGCCAGCCTGGCCCAGGGCACCCAGCAGAACAGCAACCCCTTTGCCATCATCAATGGCAGCAGCAGCTGCAACAAC",
    color: "#4fc3f7",
    emoji: "🫀",
  },
  {
    id: "bcl11a-ko",
    name: "BCL11A Enhancer KO",
    gene: "BCL11A",
    disease: "Sickle Cell / β-Thalassemia",
    category: "knockout",
    mode: "ko",
    difficulty: "medium",
    description: "Casgevy (FDA Dec 2023) knocks out the BCL11A erythroid enhancer, reactivating fetal hemoglobin (HbF) to compensate for defective adult hemoglobin.",
    clinicalNote: "First CRISPR therapy approved by FDA. One-time treatment. >90% efficacy in clinical trials.",
    sequence: ">BCL11A Enhancer Region (Educational Model)\nATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGTTGGTATCAAGGTTACAAGACAGGTTTAAGGAGACCAATAGAAACTGGGCATGTGGAGACAGAGAAGACTCTTGGGTTTCTGATAGGCACTGACTCTCTCTGCCTATTGGTCTATTTTCCCACCCTTAGGCTGCTGGTGGTCTACCCTTGGACCCAGAGGTTCTTTGAGTCCTTTGGGGATCTGTCCACTCCTGATGCTGTTATGGGCAACCCTAAGGTGAAGGCTCATGGCAAGAAAGTGCTCGGT",
    color: "#81c784",
    emoji: "🩸",
  },
  {
    id: "dmd-skip",
    name: "DMD Exon 51 Skip",
    gene: "DMD",
    disease: "Duchenne Muscular Dystrophy",
    category: "knockout",
    mode: "ko",
    difficulty: "hard",
    description: "Delete exon 51 of the dystrophin gene to restore the reading frame. Converts a severe Duchenne phenotype into a milder Becker phenotype.",
    clinicalNote: "Exon skipping therapy targets ~13% of DMD patients. Dual-guide CRISPR deletion under study in muscle progenitor cells.",
    sequence: ">DMD Exon 51 Region (Educational Model)\nATGCTTTGGTGGGAAGAAGTAGAGGACTGTTATTTCCAAAATAAAGTTTGGTGTTGAAAGCTGTAAAGTTAAGAGTTACAAGGAGAGAATGAGAAAAGACATGATTGAAAATGAAATGAAGAAAGAAGTGAAGAATGAAATGAAAAATAAGAAAGATGACAGAAGAAAATAAAAATGAATATAAGAAAGACAGAAATAAAAATGAAGAGAAAAAGATAATGAAAAATAAGAAAGAACATAAAGAAGATGACAAAAAAGAAAATAAAGAAAAAGAAGAAAAA",
    color: "#ffb74d",
    emoji: "💪",
  },
  {
    id: "hbb-ki",
    name: "HBB E6V Correction",
    gene: "HBB",
    disease: "Sickle Cell Anemia",
    category: "knockin",
    mode: "ki",
    difficulty: "hard",
    description: "Correct the E6V point mutation (GAG→GTG) using HDR with a ssDNA donor template. Requires delivery of both gRNA/Cas9 and the donor oligo into HSCs.",
    clinicalNote: "HDR efficiency in HSCs is ~1–5%. Base editing (ABE8e) has largely superseded this for point mutation correction with ~50% efficiency.",
    sequence: ">HBB Sickle Mutation Region (Educational Model)\nATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCCTATCAAGGTTACAAGACAGGTTTAAGGAGACCAATAGAAACTGGGCATGTGGAGACAGAGAAGACTCTTGGGTTTCTGATAGGCACTGACTCTCTCTGCCTATTGGTCTATTTTCCCACCCTTAGGCTGCTGGTGGTCTACCCTTGGACCCAGAGGTT",
    donorExample: "; HBB E6V Correction ssODN (Educational Model)\n; [75 bp Left Homology Arm] + [Corrected codon GAG = Glu, wild-type] + [PAM-disrupting silent CGT->CGC] + [75 bp Right Homology Arm]\n; Sickle disease allele: codon 6 = GTG (Val). This donor restores GAG (Glu).\nATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCCATCAAGGTTACAAGACAGGTTTAAGGAGACCAATAGAAACTGGGCATGTGGAGACAGAGAAGACTCTTGGGTTTCTGATAGGCACTGACTCTCTCTGCCTATTG",
    color: "#ffb74d",
    emoji: "✏️",
  },
  {
    id: "cart-ki",
    name: "CAR-T Cell Engineering",
    gene: "TRAC / B2M",
    disease: "B-Cell Malignancies (ALL, DLBCL)",
    category: "knockin",
    mode: "ki",
    difficulty: "hard",
    description: "Knock-in a chimeric antigen receptor (CAR) at the TRAC locus while simultaneously knocking out endogenous TCR. Enables off-the-shelf allogeneic CAR-T cells.",
    clinicalNote: "ALLO-501A allogeneic CRISPR CAR-T in Phase I/II trials. Eliminates need for autologous cell collection from each patient.",
    sequence: ">TRAC Locus (Educational Model)\nATGATCCTGGAGGAGGATCTGGGCTCGGCCATGCTGGCCACCCTGTGCCTGCTGTTCCTGCCCCACGCCACCATGGGCGTGCCCATCAGCTCCCAGCCCCAGCCCCCACCAGCACCCCCGAGGATCTGCCCGATGGGCCCGGCGCGGGCATGGCCGAGAACCTGGCCATGTGGAGCCTGGCCCTGCTGCTGGTGGCCCTGGTCATCGGCCTGCTGGCCGTGGCCGTGCTGCGGCGGCGGATCAGCATCATGCTGGAGCTGATGCTGGCCTTGGGCCTGCTGCTGGTGGCC",
    donorExample: "; CAR-T Knock-In Donor at TRAC Exon 1 (Educational Stub)\n; [50 bp Left TRAC Arm] + [P2A self-cleaving peptide] + [CD19-CAR scFv stub] + [50 bp Right TRAC Arm]\n; P2A disrupts TCR expression while expressing the CAR from the endogenous TRAC promoter.\nATGATCCTGGAGGAGGATCTGGGCTCGGCCATGCTGGCCACCCTG\nGGCAGCGAGAACCTGAACAAGTCCGGCGCCACCAACTTCAGCCTGAGCAAGGGCGAGGACCTTGTATCACAAATG\nATGATCCTGGAGGAGGATCTGGGCTCGGCCATGCTGGCCACCCTGTGCCTGCTG",
    color: "#ce93d8",
    emoji: "🧬",
  },
  {
    id: "mito-impossible",
    scenarioWarning: "mitochondrial" as const,
    name: "Mitochondrial DNA",
    gene: "mtDNA (ND4, ATP6…)",
    disease: "MELAS / Leber's Optic Neuropathy",
    category: "impossible",
    mode: "ko",
    difficulty: "impossible",
    description: "Edit the mitochondrial genome with standard SpCas9 to correct a pathogenic mutation causing MELAS or Leber's optic neuropathy.",
    clinicalNote: "DddA-derived cytosine base editors (DdCBEs, 2020) can edit mtDNA C→T. Standard Cas9 cannot. Still largely pre-clinical.",
    impossibleReason: "SpCas9 cannot cross the mitochondrial membrane",
    whyImpossible: {
      title: "Why Standard SpCas9 Cannot Edit Mitochondrial DNA",
      points: [
        "Cas9 + gRNA are synthesized in the cytoplasm and cannot cross the double mitochondrial membrane by any known transport mechanism.",
        "gRNA is RNA — no known system imports RNA into mitochondria in mammalian cells.",
        "The mitochondrial genetic code differs from the nuclear code (TGA = Trp, not Stop) — standard gRNAs cannot function inside mitochondria.",
        "Mitochondria lack HDR machinery, so Cas9-induced DSBs lead to mtDNA degradation, not correction.",
        "Alternative: DdCBE (David Liu lab, 2020) splits a deaminase across two halves that can reach mitochondria — edits C→T without a DSB. Still experimental.",
      ],
    },
    color: "#ef9a9a",
    emoji: "⚡",
  },
  {
    id: "rna-virus-impossible",
    scenarioWarning: "rna_virus" as const,
    name: "SARS-CoV-2 / RNA Virus",
    gene: "Spike RNA Genome",
    disease: "COVID-19",
    category: "impossible",
    mode: "ko",
    difficulty: "impossible",
    description: "Target the SARS-CoV-2 spike protein gene directly with SpCas9 to prevent viral replication.",
    impossibleReason: "SpCas9 targets DNA — coronaviruses have RNA genomes",
    whyImpossible: {
      title: "Why SpCas9 Cannot Target RNA Viruses",
      points: [
        "SpCas9 is a DNA endonuclease. It has no enzymatic activity on RNA and requires a dsDNA template.",
        "SARS-CoV-2 is a +ssRNA virus. Its genome is single-stranded RNA, not DNA — there is no dsDNA target at any life stage.",
        "Viral RNA exists transiently and would be replicated faster than any editing could occur.",
        "Alternative: Cas13 proteins (HEPN domain) cleave single-stranded RNA. CasRx and LwaCas13a have been demonstrated against SARS-CoV-2 in cell culture.",
        "Alternative: PAC-MAN strategy uses Cas13d to cleave conserved SARS-CoV-2 sequences. Phase 0 research stage.",
      ],
    },
    color: "#ef9a9a",
    emoji: "🦠",
  },
  {
    id: "huntington-impossible",
    scenarioWarning: "repetitive_target" as const,
    name: "Huntington CAG Repeat",
    gene: "HTT Exon 1",
    disease: "Huntington's Disease",
    category: "impossible",
    mode: "ko",
    difficulty: "impossible",
    description: "Target the expanded CAG repeat (≥36 repeats) in HTT Exon 1 to reduce mutant huntingtin expression or delete the repeat expansion.",
    impossibleReason: "Repetitive target causes massive genome-wide off-target cutting",
    whyImpossible: {
      title: "Why Huntington CAG Repeats Are Extremely Challenging",
      points: [
        "The CAG repeat sequence is found in 9 other polyglutamine disease genes (ATXN1, ATXN2, ATXN3, CACNA1A, etc.) — a gRNA will cut all of them.",
        "Normal HTT (≤35 repeats) and mutant HTT (≥36) differ only in repeat count — there is no unique sequence to target within the repeat itself.",
        "The guide RNA itself anneals inside a repetitive region, dramatically increasing off-target binding across the genome.",
        "Allele-specific SNP-based approaches are being explored (~17 kb from the repeat), but require perfect patient genotyping and are still in research stage.",
        "Alternative: ASOs (antisense oligonucleotides) to reduce HTT mRNA — tominersen and Wave ASO are in clinical trials targeting the RNA, not the DNA.",
      ],
    },
    color: "#ef9a9a",
    emoji: "🧠",
  },
  // ── New clinical + cell-line scenarios ─────────────────────────
  {
    id: "ttr-ko-invivo",
    name: "TTR Knock-Out (In Vivo)",
    gene: "TTR",
    disease: "Transthyretin Amyloidosis (ATTR)",
    category: "knockout",
    mode: "ko",
    difficulty: "hard",
    description: "Knock out transthyretin (TTR) in the liver to halt production of the misfolded amyloid protein. The liver is the target — delivery uses lipid nanoparticles (LNPs) injected intravenously.",
    clinicalNote: "NTLA-2001 (Intellia) achieved >90% TTR reduction in Phase 1 (2021) — first in-vivo CRISPR therapy. FDA approved patisiran/vutrisiran (siRNA) for same target.",
    sequence: ">TTR Exon 2 Region (Educational Model)\nATGGCTTCACTGAGGATGGCAACACTGGCTGGTGGAGGGCTGTGGCTGCCGGTGCCTGAGGTGCCCACCCCTCAGGTGGAGGAGATCGAGGAGTGGGTGACCCGGCAGGACATGCTGGGGCTGGACATGGACAGCAAGCCCTGGGCAGACCCTGGGACCTGTGAAGCCACCTGGGGCAAGCCCTGCTGGCCCAGGTCACGGAGCAGTTCACTGATGGCATGGCTGTGGCAGTGACCACC",
    color: "#4fc3f7",
    emoji: "🫀",
  },
  {
    id: "cftr-ki",
    name: "CFTR ΔF508 Correction",
    gene: "CFTR",
    disease: "Cystic Fibrosis",
    category: "knockin",
    mode: "ki",
    difficulty: "hard",
    description: "Correct the most common CF mutation (deletion of phenylalanine 508) using HDR. Requires delivery to airway epithelial cells — one of the hardest targets for in-vivo CRISPR due to lung delivery barriers.",
    clinicalNote: "Small molecule correctors (Trikafta) work for ΔF508. CRISPR could offer a one-time cure but lung delivery remains a major hurdle. Base editing approaches under active research.",
    sequence: ">CFTR Exon 11 ΔF508 Region (Educational Model)\nATGCAGAGGCGCCTTCTCCTGCAGATCGAGGAGAATGACTTGGAGAAGGTGAGTGAAATGACCTATGTGCTGAGGATGCTGGAGAAGTCAGACAAGATGAGGAAGCGGATAGAGGAGCTGATCCAGGAAATGATGAATC\nGGCAGCCACGGCTCATGCCATCATTTTCCTTGGATTCTTCTTCATCAGTGTGATGATGCGTGTCCCGTTGGCACGACCATCATCTTCTGGAGC",
    donorExample: "; CFTR ΔF508 Correction ssODN (Educational Model)\n; Restores the 3 deleted nucleotides (CTT = Phe-508) between codons 507 and 509\n; [60 bp Left Arm] + [restored CTT codon] + [PAM-disrupted silent change] + [60 bp Right Arm]\nATGCAGAGGCGCCTTCTCCTGCAGATCGAGGAGAATGACTTGGAGAAGGTGAGTGAAATGACCTATGTGCTGAGGATGCTGGAGAAGTCAGACAAGATGAGGAAGCGGATAGAGGAGCTGATCCAGGAAATGATGAATC",
    color: "#ce93d8",
    emoji: "🫁",
  },
  {
    id: "h2ax-impossible",
    name: "H2AX Knockout",
    gene: "H2AFX (H2AX)",
    disease: "Hypothetical — Essential Histone",
    category: "impossible",
    mode: "ko",
    difficulty: "impossible",
    scenarioWarning: "essential_gene" as const,
    description: "Attempt to knock out H2AX, a histone variant essential for the DNA damage response. Knocking it out disrupts genome stability and leads to cell lethality.",
    impossibleReason: "Essential gene — knockout causes genome instability and cell death",
    whyImpossible: {
      title: "Why You Cannot Simply Knock Out H2AX",
      points: [
        "H2AX (encoded by H2AFX) is a histone variant recruited immediately to double-strand breaks. It is required for DNA damage signalling and repair.",
        "Complete H2AX KO in dividing cells leads to massive genome instability, chromosome missegregation, and apoptosis — the cell kills itself.",
        "H2AX is encoded by multiple histone gene copies in a tightly packed cluster — guide RNAs would hit all copies simultaneously.",
        "This applies broadly to other essential histones: H2A, H2B, H3, H4. Any core histone KO is lethal.",
        "Alternative: use CRISPRi (dCas9-KRAB) to transiently repress H2AFX transcription for mechanistic studies without creating a permanent lethal KO.",
        "Key principle: always check if your gene is essential (DepMap database) before designing a knockout experiment.",
      ],
    },
    clinicalNote: "H2AX is actually a tumour suppressor — its loss is seen in some cancers. But therapeutic H2AX KO would accelerate genome instability, not treat disease.",
    color: "#ef9a9a",
    emoji: "☠️",
  },
  {
    id: "mda-mb231-ko",
    name: "MDA-MB-231 PDL1 KO",
    gene: "CD274 (PD-L1)",
    disease: "Triple-Negative Breast Cancer (TNBC)",
    category: "knockout",
    mode: "ko",
    difficulty: "medium",
    description: "Knock out PD-L1 in MDA-MB-231 cells (TNBC cell line) to sensitise tumour cells to T-cell mediated killing. Models immune checkpoint blockade in a hard-to-treat breast cancer subtype.",
    clinicalNote: "MDA-MB-231 is a widely used TNBC cell line. PD-L1 KO is commonly done in cancer immunology labs as a model for anti-tumour immunity. Transfection is straightforward by lipofection or electroporation.",
    sequence: ">CD274 (PD-L1) Exon 3 Region (Educational Model — MDA-MB-231)\nATGAGGATATTTGCTGAATTTGAATTTGCTTGTCCATCATGAGATATTTTCATGATAAAATGAATCTGAATCCAGATCCCATGTTGCCACATAGATGCATTACATTCACTATGTGATGGATAAGGAAGATGAGCTTCACGGAATTGATGAAAAGGCACTGTGGGTGCACTGCCCAACATCAGATGGGCTACAGGGATGCAGCTGCGATGCTACCCATGGTCTCCATCATTCTGGTCAGTGGTCATGCCGCGGGAAACGGA",
    color: "#81c784",
    emoji: "🧫",
  },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "#69f0ae",
  medium: "#ffca28",
  hard: "#ef9a9a",
  impossible: "#9e9e9e",
};

const CATEGORY_LABELS: Record<ScenarioCategory, string> = {
  knockout: "KO",
  knockin: "KI",
  impossible: "⚠ Impossible",
};

type Props = {
  onLoad: (seq: string, mode: StrategyMode, donor?: string, warning?: ScenarioWarning) => void;
};

export default function LabScenarioPanel({ onLoad }: Props) {
  const [filter, setFilter] = useState<"all" | ScenarioCategory>("all");
  const [impossibleModal, setImpossibleModal] = useState<LabScenario | null>(null);

  const shown = filter === "all" ? SCENARIOS : SCENARIOS.filter((s) => s.category === filter);

  return (
    <div className="lsp-root">
      <div className="lsp-header">
        <div>
          <div className="lsp-title">
            <FlaskConical size={15} />
            Interactive Lab Scenarios
          </div>
          <p className="lsp-sub">Click a scenario to load its sequence. Includes real clinical targets, KI examples, and why some edits are impossible.</p>
        </div>
        <div className="lsp-filters">
          {(["all", "knockout", "knockin", "impossible"] as const).map((f) => (
            <button
              key={f}
              className={`lsp-filter-btn ${filter === f ? "lsp-filter-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "knockout" ? "KO" : f === "knockin" ? "KI" : "⚠ Impossible"}
            </button>
          ))}
        </div>
      </div>

      <div className="lsp-grid">
        {shown.map((s) => (
          <motion.div
            key={s.id}
            className={`lsp-card lsp-card-${s.category}`}
            style={{ "--sc-color": s.color } as React.CSSProperties}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            onClick={() => {
              if (s.category === "impossible") {
                setImpossibleModal(s);
              } else if (s.sequence) {
                onLoad(s.sequence, s.mode, s.donorExample, s.scenarioWarning);
              }
            }}
          >
            <div className="lsp-card-top">
              <span className="lsp-card-emoji">{s.emoji}</span>
              <div className="lsp-card-badges">
                <span
                  className="lsp-badge"
                  style={{
                    background: `${s.category === "impossible" ? "#757575" : s.mode === "ko" ? "#1565c0" : "#6a1b9a"}22`,
                    color: s.category === "impossible" ? "#9e9e9e" : s.mode === "ko" ? "#64b5f6" : "#ce93d8",
                    borderColor: s.category === "impossible" ? "#75757544" : s.mode === "ko" ? "#64b5f644" : "#ce93d844",
                  }}
                >
                  {CATEGORY_LABELS[s.category]}
                </span>
                <span className="lsp-diff" style={{ color: DIFFICULTY_COLOR[s.difficulty] }}>
                  {s.difficulty}
                </span>
              </div>
            </div>

            <h4 className="lsp-card-name">{s.name}</h4>
            <div className="lsp-card-gene">
              <Dna size={11} />
              {s.gene} · {s.disease}
            </div>
            <p className="lsp-card-desc">{s.description}</p>

            {s.clinicalNote && (
              <div className="lsp-clinical-note">
                <span className="lsp-clinical-icon">🏥</span>
                {s.clinicalNote}
              </div>
            )}

            <div className="lsp-card-cta">
              {s.category === "impossible" ? (
                <span className="lsp-cta-impossible">
                  <AlertTriangle size={12} /> Why impossible? →
                </span>
              ) : (
                <span className="lsp-cta-load" style={{ color: s.color }}>
                  Load sequence →
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Impossible explanation modal */}
      <AnimatePresence>
        {impossibleModal && (
          <motion.div
            className="lsp-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setImpossibleModal(null)}
          >
            <motion.div
              className="lsp-modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lsp-modal-header">
                <span className="lsp-modal-emoji">{impossibleModal.emoji}</span>
                <div>
                  <h3 className="lsp-modal-title">{impossibleModal.name}</h3>
                  <span className="lsp-modal-reason">
                    <AlertTriangle size={12} />
                    {impossibleModal.impossibleReason}
                  </span>
                </div>
                <button className="lsp-modal-close" onClick={() => setImpossibleModal(null)}>
                  <X size={16} />
                </button>
              </div>

              {impossibleModal.whyImpossible && (
                <div className="lsp-modal-body">
                  <h4 className="lsp-modal-section-title">{impossibleModal.whyImpossible.title}</h4>
                  <ul className="lsp-modal-points">
                    {impossibleModal.whyImpossible.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {impossibleModal.clinicalNote && (
                <div className="lsp-modal-clinical">
                  <span>🏥</span>
                  <span>{impossibleModal.clinicalNote}</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
