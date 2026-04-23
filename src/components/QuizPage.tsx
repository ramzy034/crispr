import { useState } from "react";

type Difficulty = "easy" | "medium" | "hard";
type Phase = "select" | "quiz" | "results";
type QType = "mcq" | "tf";

interface RawQ {
  q: string;
  type: QType;
  options: string[]; // options[0] is always correct
  explanation: string;
}
interface LiveQ {
  q: string;
  type: QType;
  opts: string[];
  correctIdx: number;
  explanation: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeLive(raw: RawQ): LiveQ {
  if (raw.type === "tf") {
    return { q: raw.q, type: "tf", opts: ["True", "False"], correctIdx: raw.options[0] === "True" ? 0 : 1, explanation: raw.explanation };
  }
  const correct = raw.options[0];
  const opts = shuffle(raw.options);
  return { q: raw.q, type: "mcq", opts, correctIdx: opts.indexOf(correct), explanation: raw.explanation };
}

const HS_KEYS: Record<Difficulty, string> = { easy: "crispr-quiz-hs-easy", medium: "crispr-quiz-hs-medium", hard: "crispr-quiz-hs-hard" };
function loadHS(): Record<Difficulty, number> {
  try { return { easy: parseInt(localStorage.getItem(HS_KEYS.easy) ?? "0") || 0, medium: parseInt(localStorage.getItem(HS_KEYS.medium) ?? "0") || 0, hard: parseInt(localStorage.getItem(HS_KEYS.hard) ?? "0") || 0 }; }
  catch { return { easy: 0, medium: 0, hard: 0 }; }
}
function saveHS(diff: Difficulty, score: number) { try { localStorage.setItem(HS_KEYS[diff], String(score)); } catch { /* ignore */ } }

const DIFF_CONFIG = {
  easy:   { label: "Beginner",     color: "#4ade80", bg: "rgba(74,222,128,0.07)",   border: "rgba(74,222,128,0.28)",   icon: "🌱", desc: "Core CRISPR concepts, history, and basic terminology. Perfect for students just starting out.", topic: "Fundamentals" },
  medium: { label: "Intermediate", color: "#fbbf24", bg: "rgba(251,191,36,0.07)",   border: "rgba(251,191,36,0.28)",   icon: "⚗️", desc: "Repair mechanisms, guide RNA design, delivery, and experimental considerations.", topic: "Mechanisms & Design" },
  hard:   { label: "Expert",       color: "#f87171", bg: "rgba(248,113,113,0.07)",  border: "rgba(248,113,113,0.28)",  icon: "🔬", desc: "Advanced editors, molecular mechanisms, computational tools, and clinical challenges.", topic: "Advanced Science" },
} as const;

// ── Question Banks ─────────────────────────────────────────────────────────────

const EASY: RawQ[] = [
  { q: "What does CRISPR stand for?", type: "mcq",
    options: ["Clustered Regularly Interspaced Short Palindromic Repeats", "Cytosine RNA Integration System for Protein Repair", "Cell-Responsive Insertion Sequence for Protein Replacement", "Chromosomal Recombination Integration System for Plasmid Replication"],
    explanation: "CRISPR stands for Clustered Regularly Interspaced Short Palindromic Repeats — the bacterial DNA sequences that inspired the gene-editing tool." },
  { q: "Which protein acts as the 'molecular scissors' in the CRISPR-Cas9 system?", type: "mcq",
    options: ["Cas9", "Cas12", "Cas13", "Cas3"],
    explanation: "Cas9 (CRISPR-associated protein 9) is the endonuclease that cuts both strands of DNA at the location directed by the guide RNA." },
  { q: "What is the role of the guide RNA (gRNA) in CRISPR-Cas9?", type: "mcq",
    options: ["It directs Cas9 to the specific DNA target sequence", "It cuts the DNA directly", "It repairs the broken DNA after cutting", "It provides the donor template for insertion"],
    explanation: "The gRNA contains a 20-nucleotide spacer complementary to the target, steering Cas9 to the right genomic location." },
  { q: "What is the PAM sequence required by the most widely used CRISPR system (SpCas9)?", type: "mcq",
    options: ["NGG", "ATG", "TAA", "CCC"],
    explanation: "SpCas9 requires a 5'-NGG-3' PAM (Protospacer Adjacent Motif) immediately 3' of the target site on the non-template strand." },
  { q: "What repair pathway produces small insertions/deletions (indels) after a CRISPR cut, disrupting a gene?", type: "mcq",
    options: ["NHEJ (Non-Homologous End Joining)", "HDR (Homology-Directed Repair)", "BER (Base Excision Repair)", "MMR (Mismatch Repair)"],
    explanation: "NHEJ ligates broken ends without a template, often introducing indels that cause frameshifts and knock out gene function." },
  { q: "CRISPR-Cas systems were originally discovered as part of what biological system in bacteria?", type: "mcq",
    options: ["A natural adaptive immune system against bacteriophages (viruses)", "A DNA replication proofreading mechanism", "A protein synthesis regulatory system", "A gene expression activator"],
    explanation: "Bacteria use CRISPR arrays to store memories of past phage infections, enabling targeted destruction of returning viruses." },
  { q: "Who won the 2020 Nobel Prize in Chemistry for developing CRISPR-Cas9 as a genome editing tool?", type: "mcq",
    options: ["Jennifer Doudna and Emmanuelle Charpentier", "James Watson and Francis Crick", "Feng Zhang and George Church", "Craig Venter and Harold Varmus"],
    explanation: "Doudna and Charpentier were awarded the Nobel Prize for their landmark 2012 paper showing Cas9 could be programmed with a single guide RNA." },
  { q: "What is the typical length of the spacer (targeting) sequence in a CRISPR guide RNA?", type: "mcq",
    options: ["20 nucleotides", "5 nucleotides", "10 nucleotides", "50 nucleotides"],
    explanation: "The spacer is 20 nucleotides long — sufficient for specificity and easy to synthesise." },
  { q: "What does a Knock-Out (KO) CRISPR experiment aim to achieve?", type: "mcq",
    options: ["Disrupt or inactivate a gene", "Insert a new therapeutic gene", "Activate a silenced gene", "Correct a single point mutation"],
    explanation: "KO editing exploits NHEJ to introduce indels at the cut site, causing a frameshift that silences the gene." },
  { q: "True or False: CRISPR-Cas9 can only be used to edit human DNA.", type: "tf",
    options: ["False"],
    explanation: "CRISPR works in virtually every organism — bacteria, yeast, plants, insects, fish, mice, and humans — because the genetic code is universal." },
  { q: "What does DSB stand for in the context of gene editing?", type: "mcq",
    options: ["Double-Strand Break", "Deoxyribose Strand Binding", "Directed Sequence Base-pairing", "Dual-Strand Blocking"],
    explanation: "A DSB (Double-Strand Break) is when both strands of the DNA helix are severed. Cas9 creates a blunt DSB 3 bp upstream of the PAM." },
  { q: "What is the name of the first FDA-approved CRISPR-based therapy (approved December 2023)?", type: "mcq",
    options: ["Casgevy (exagamglogene autotemcel)", "Luxturna", "Zolgensma", "Kymriah"],
    explanation: "Casgevy, developed by Vertex Pharmaceuticals and CRISPR Therapeutics, was the first CRISPR therapy approved by the FDA." },
  { q: "Which disease(s) was Casgevy approved to treat?", type: "mcq",
    options: ["Sickle cell disease and transfusion-dependent beta-thalassemia", "Cystic fibrosis", "Huntington's disease", "Duchenne muscular dystrophy"],
    explanation: "Casgevy reactivates fetal haemoglobin in patients' stem cells, compensating for defective adult haemoglobin in both conditions." },
  { q: "What is a Knock-In (KI) CRISPR experiment?", type: "mcq",
    options: ["Inserting or correcting a specific DNA sequence at a target site", "Removing an entire chromosome", "Silencing a gene using RNA interference", "Duplicating a gene to another chromosome"],
    explanation: "KI editing uses HDR with a donor template to install a precise DNA sequence — a corrected gene, reporter tag, or therapeutic payload." },
  { q: "True or False: The PAM sequence (NGG for SpCas9) must be present in the genome immediately adjacent to the target site for Cas9 to cut.", type: "tf",
    options: ["True"],
    explanation: "PAM recognition is a prerequisite for Cas9 binding. Without NGG adjacent to the protospacer, Cas9 cannot interrogate the DNA." },
  { q: "What type of molecule is the guide RNA (gRNA)?", type: "mcq",
    options: ["RNA (ribonucleic acid)", "DNA", "Protein", "Lipid"],
    explanation: "Guide RNAs are RNA molecules — they can be chemically synthesised or transcribed in cells from a DNA template." },
  { q: "Which organism's Cas9 is most commonly used in CRISPR experiments?", type: "mcq",
    options: ["Streptococcus pyogenes (SpCas9)", "Escherichia coli", "Staphylococcus aureus", "Bacillus subtilis"],
    explanation: "SpCas9 was the first Cas9 characterised for genome editing and remains the most widely used due to its efficiency and available toolkits." },
  { q: "What kind of break does wild-type SpCas9 make in double-stranded DNA?", type: "mcq",
    options: ["A blunt double-strand break (DSB)", "A 3' overhang cut", "A 5' overhang cut", "A single-strand nick only"],
    explanation: "SpCas9 creates a blunt-ended DSB 3 bp upstream of the PAM by cleaving both strands at the same position." },
  { q: "True or False: CRISPRa and CRISPRi can activate or repress genes without cutting DNA, using a catalytically dead Cas9 (dCas9) fused to transcriptional effectors.", type: "tf",
    options: ["True"],
    explanation: "dCas9 (D10A + H840A mutations) retains DNA binding but loses cutting ability. Fused to activators or repressors, it can strongly regulate target genes." },
  { q: "What does the 'N' in the NGG PAM sequence represent?", type: "mcq",
    options: ["Any nucleotide (A, T, C, or G)", "Only nitrogen-containing purines (A or G)", "Specifically adenine (A)", "No nucleotide — a spacer gap"],
    explanation: "In IUPAC notation, N = any base. So SpCas9 requires ANY base followed by two guanines (GG) at the PAM position." },
  { q: "What does GC content of a guide RNA refer to?", type: "mcq",
    options: ["The percentage of nucleotides that are Guanine (G) or Cytosine (C)", "The total length of the guide RNA", "The number of mismatches to the target", "The folding energy of the guide structure"],
    explanation: "GC content = fraction of bases that are G or C. For guide RNAs, 40–60% GC is considered optimal for efficient Cas9 activity." },
  { q: "True or False: CRISPR editing efficiency is the same in all cell types.", type: "tf",
    options: ["False"],
    explanation: "Editing efficiency varies greatly by cell type, delivery method, chromatin state, and cell cycle phase. Stem cells and post-mitotic neurons present very different challenges." },
  { q: "In which kingdom of life was CRISPR first discovered?", type: "mcq",
    options: ["Bacteria and Archaea (Prokaryotes)", "Animals", "Plants", "Fungi"],
    explanation: "CRISPR was discovered in bacteria and archaea in the late 1980s–2000s as part of their adaptive immune system against bacteriophages." },
  { q: "What repair pathway is primarily used in Knock-In (KI) experiments to insert a precise sequence?", type: "mcq",
    options: ["HDR (Homology-Directed Repair)", "NHEJ (Non-Homologous End Joining)", "BER (Base Excision Repair)", "Translesion Synthesis"],
    explanation: "HDR uses a donor template with homology arms flanking the edit to precisely insert or correct a DNA sequence at the cut site." },
  { q: "True or False: A guide RNA with sequence perfectly matching a genomic site will always result in 100% cutting efficiency.", type: "tf",
    options: ["False"],
    explanation: "Efficiency depends on GC content, secondary structure, chromatin accessibility, PAM context, and positional features. Perfect-match guides can still perform poorly." },
];

const MEDIUM: RawQ[] = [
  { q: "In HDR, what provides the precise template for DNA repair after a Cas9 cut?", type: "mcq",
    options: ["A supplied donor DNA template with homologous sequences flanking the edit", "The broken DNA ends via exonuclease activity", "The ribosome's translation machinery", "The cell's methylation pattern at the target locus"],
    explanation: "HDR uses an exogenous donor (ssODN, plasmid, or AAV) with homology arms flanking the edit. The cell's HDR machinery copies the donor sequence into the break." },
  { q: "What is the approximate HDR efficiency in most somatic human cells?", type: "mcq",
    options: ["1–5%", "30–50%", "60–80%", "90–99%"],
    explanation: "HDR is generally 1–5% in somatic cells because it requires S/G2 phase and competes with the dominant NHEJ pathway." },
  { q: "Which GC content range is considered optimal for CRISPR guide RNA design?", type: "mcq",
    options: ["40–60%", "10–30%", "70–90%", "0–20%"],
    explanation: "40–60% GC ensures adequate thermodynamic stability without the secondary structures that form with very high GC content." },
  { q: "What is the primary cause of off-target effects in CRISPR-Cas9 experiments?", type: "mcq",
    options: ["Cas9 cuts at genomic sites with sufficient sequence similarity to the guide, even with some mismatches", "The donor template binds non-specifically across the genome", "NHEJ inserts random sequences at multiple sites simultaneously", "The gRNA degrades into fragments that guide Cas9 to multiple sites"],
    explanation: "Cas9 tolerates mismatches — especially in the PAM-distal region — and will cut at sites with high identity to the guide, creating unintended DSBs." },
  { q: "True or False: Poly-T stretches (≥4 consecutive thymines) in a gRNA spacer sequence reduce editing efficiency because they cause RNA polymerase III transcription termination.", type: "tf",
    options: ["True"],
    explanation: "RNA Pol III — used to express gRNAs from U6 promoters — terminates at a run of four or more thymines (T4+), producing truncated, non-functional guides." },
  { q: "The sgRNA used in most CRISPR experiments is an artificial fusion of which two naturally occurring RNA molecules?", type: "mcq",
    options: ["crRNA (CRISPR RNA) and tracrRNA (trans-activating crRNA)", "mRNA and tRNA", "snRNA and rRNA", "miRNA and siRNA"],
    explanation: "In the native bacterial system, crRNA (spacer) and tracrRNA (scaffold) are separate. Doudna/Charpentier fused them into a single chimeric sgRNA." },
  { q: "What structural feature of Cas9 directly recognises and binds the PAM sequence?", type: "mcq",
    options: ["The PAM-interacting (PI) domain in the C-terminal region", "The HNH nuclease domain", "The RuvC nuclease domain", "The REC1 recognition lobe"],
    explanation: "The PI domain makes base-specific contacts with the NGG PAM. Mutations here are how PAM-relaxed variants (SpRY, xCas9) were engineered." },
  { q: "True or False: HDR is most active during the S and G2 phases of the cell cycle because the sister chromatid is available as a repair template.", type: "tf",
    options: ["True"],
    explanation: "During S/G2, the replicated sister chromatid is physically nearby and serves as HDR template. In G0/G1, HDR is largely suppressed." },
  { q: "What is a homology arm in a donor template used for HDR?", type: "mcq",
    options: ["A sequence in the donor homologous to the region flanking the cut, directing precise insertion", "An antibody domain that delivers the donor to the nucleus", "A stem-loop that protects the donor from nuclease degradation", "A region of the donor that base-pairs directly with the guide RNA"],
    explanation: "Homology arms (typically 50–1000 bp) flank the payload and base-pair with genomic sequence around the DSB, directing HDR machinery to copy the insert." },
  { q: "Why is it important to mutate the PAM sequence in a donor template used for HDR?", type: "mcq",
    options: ["To prevent Cas9 from re-cutting the successfully edited allele", "To improve binding between homology arms and genomic DNA", "To allow the donor RNA to bind the guide RNA scaffold", "To increase HDR efficiency by reducing NHEJ competition"],
    explanation: "Once HDR installs the edit, Cas9 would re-cut if it still recognises the PAM + protospacer. Mutating the PAM in the donor prevents this destructive cycle." },
  { q: "Which DNA repair pathway predominates in non-dividing, post-mitotic cells such as neurons?", type: "mcq",
    options: ["NHEJ (Non-Homologous End Joining)", "HDR (Homology-Directed Repair)", "BER (Base Excision Repair)", "NER (Nucleotide Excision Repair)"],
    explanation: "NHEJ operates throughout the cell cycle and is the dominant DSB repair pathway in post-mitotic cells, making precise HDR very difficult in tissues like brain and heart." },
  { q: "What does the on-target score estimate in CRISPR guide RNA design tools?", type: "mcq",
    options: ["The predicted likelihood that the guide will direct efficient Cas9 cleavage at the intended site", "The probability of off-target cleavage at other genomic loci", "The GC content of the guide RNA", "The distance between two selected guides"],
    explanation: "On-target scores (e.g., Doench Rule Set 2, DeepCRISPR) predict cutting efficiency based on GC content, nucleotide composition, and positional features." },
  { q: "In KO design, why is targeting early exons of a gene generally preferred?", type: "mcq",
    options: ["Indels in early exons cause frameshifts that truncate the entire protein, ensuring complete loss of function", "Early exons always contain NGG PAM sites", "Early exons are in open chromatin and always accessible", "Early exons are always on the forward strand"],
    explanation: "A frameshift early in the coding sequence prevents any functional protein domain from being translated. Targeting late exons may leave a functional N-terminal fragment." },
  { q: "True or False: A Cas9 nickase (nCas9) creates a single-strand nick rather than a double-strand break.", type: "tf",
    options: ["True"],
    explanation: "Nickase versions (D10A inactivates RuvC; H840A inactivates HNH) cut only one strand. Two paired nickases create a staggered DSB with lower off-target risk." },
  { q: "What is the 'seed region' of a CRISPR guide RNA?", type: "mcq",
    options: ["The ~8–12 nt PAM-proximal region of the spacer; mismatches here strongly impair Cas9 cutting", "The entire 20-nt spacer sequence", "The tracrRNA scaffold loop region", "The 5' end far from the PAM"],
    explanation: "R-loop formation initiates at the PAM-proximal end. Mismatches in this seed region prevent the conformational changes needed for DNA cleavage." },
  { q: "In which cell-cycle phases is NHEJ repair active?", type: "mcq",
    options: ["Throughout the entire cell cycle (G0, G1, S, G2, and M)", "Only in S phase", "Only in G1 phase", "Only in M phase during mitosis"],
    explanation: "NHEJ machinery is present and active throughout the entire cell cycle, including in quiescent G0 cells, making it the dominant repair pathway in most tissues." },
  { q: "What is the function of the tracrRNA in the CRISPR-Cas9 system?", type: "mcq",
    options: ["To form the structural scaffold of the guide RNA and mediate interaction with Cas9", "To carry the spacer sequence targeting the DNA", "To bind the PAM sequence directly", "To recruit DNA repair machinery to the break site"],
    explanation: "The tracrRNA base-pairs with the repeat region of the crRNA and folds into the specific secondary structure that Cas9 recognises and binds." },
  { q: "True or False: A guide RNA with 85% GC content would be considered optimal for SpCas9 editing.", type: "tf",
    options: ["False"],
    explanation: "Very high GC content (>65%) predisposes the guide to secondary structure formation. The optimal range is 40–60%." },
  { q: "What delivery method is most commonly used to introduce CRISPR components into primary human cells for therapeutic editing?", type: "mcq",
    options: ["Electroporation of Cas9 RNP complexes, or lipid nanoparticles for in vivo delivery", "Oral tablets dissolved in the bloodstream", "Passive diffusion through the cell membrane", "Direct microinjection of plasmid DNA into every cell nucleus"],
    explanation: "Electroporation of pre-formed Cas9/gRNA RNPs is the gold standard for primary cells (high efficiency, transient expression). LNPs are used for in vivo delivery (e.g., liver)." },
  { q: "Which of the following would NOT be a design warning flag for a CRISPR guide RNA?", type: "mcq",
    options: ["GC content of 50%", "Poly-T run (TTTT) in the spacer", "Self-complementarity forming a hairpin", "Multiple perfect matches elsewhere in the genome"],
    explanation: "50% GC is ideal. Poly-T runs, hairpins, and multi-site matches are all red flags — but 50% GC is actually the sweet spot for efficiency." },
  { q: "What is a major advantage of using an ssODN (single-stranded oligodeoxynucleotide) donor over a plasmid donor for small HDR edits?", type: "mcq",
    options: ["ssODNs are cheaper, easier to prepare, less immunogenic, and have lower random integration risk for small edits (<200 bp)", "ssODNs can carry larger inserts (>10 kb)", "ssODNs activate HDR in G1-phase cells", "ssODNs do not require homology arms"],
    explanation: "For small edits, ssODNs are the preferred donor: cost-effective, high purity, and plasmids carry significant random integration risk in therapeutic applications." },
  { q: "True or False: Self-complementarity (hairpin formation) in the 5' region of a guide RNA spacer generally improves editing efficiency.", type: "tf",
    options: ["False"],
    explanation: "Hairpin structures compete with hybridisation to the genomic target DNA, reducing R-loop formation and cutting efficiency." },
  { q: "Which statement best describes NHEJ-induced indels?", type: "mcq",
    options: ["Unpredictable small insertions or deletions at the cut site that can disrupt the reading frame", "Always precisely 1-bp deletions", "Copies of a donor template sequence", "Occur only on the antisense strand"],
    explanation: "NHEJ is error-prone; indels vary in type and size (1–20+ bp). A non-multiple-of-3 indel causes a frameshift, truncating or altering the protein." },
  { q: "What is the approximate optimal distance between two guide RNA cut sites when designing a defined gene deletion (KO)?", type: "mcq",
    options: ["Several hundred bp to a few kilobases, flanking the target exon", "Exactly 3 base pairs (one codon)", "More than 100 kb apart", "Both guides must target the same nucleotide position"],
    explanation: "Paired guides flanking a target exon create a defined deletion. Guides are placed a few hundred bp to a few kb apart, covering the exon(s) to be excised." },
];

const HARD: RawQ[] = [
  { q: "What is the molecular mechanism by which PAM binding triggers R-loop formation in Cas9?", type: "mcq",
    options: [
      "PAM recognition by the PI domain causes a conformational change that unwinds the DNA locally, enabling guide RNA strand invasion from the PAM-proximal end",
      "The PAM is directly cleaved by RuvC before the guide RNA binds",
      "The tracrRNA scaffold binds the PAM, freeing the spacer to search for complementary sequences",
      "Cas9's NTD methylates the PAM site, which recruits the guide RNA",
    ],
    explanation: "PAM binding 'licences' Cas9 to open the DNA duplex and allow the guide spacer to interrogate one strand for complementarity, forming a stable R-loop." },
  { q: "What are the two catalytic domains of SpCas9, and what does each cleave?", type: "mcq",
    options: [
      "RuvC cleaves the non-complementary strand; HNH cleaves the complementary (template) strand",
      "HNH cleaves the non-complementary strand; RuvC cleaves the complementary strand",
      "PI domain cleaves one strand; REC1 lobe cleaves the other",
      "RuvC and HNH both cleave the same strand in tandem",
    ],
    explanation: "SpCas9's HNH domain cuts the strand complementary to the guide, while RuvC cuts the other. Inactivating one gives a nickase; inactivating both gives dCas9." },
  { q: "Cytosine base editors (CBEs) convert C•G to what product without a DSB?", type: "mcq",
    options: ["T•A (via C→U deamination, then replication replaces U with T)", "G•C (transversion)", "A•T (transversion)", "They require a DSB to function"],
    explanation: "CBE uses a cytidine deaminase (e.g., APOBEC) to convert C to U, which is read as T during replication, giving a net C•G→T•A transition." },
  { q: "What is the typical editing window (protospacer positions) for CBE3 (BE3)?", type: "mcq",
    options: [
      "Positions 4–8 counting from the PAM-distal (5') end of the spacer",
      "Positions 1–5 from the PAM-proximal end",
      "Positions 1–20 (entire protospacer uniformly)",
      "Positions 14–20 immediately adjacent to the PAM",
    ],
    explanation: "BE3's cytidine deaminase accesses Cs roughly at positions 4–8 from the PAM-distal end. Newer variants (AncBE4max) have shifted or widened windows." },
  { q: "Prime editing (PE2/PE3) uses which combination of enzymatic activities?", type: "mcq",
    options: [
      "A Cas9 nickase (H840A) fused to an engineered reverse transcriptase, directed by a pegRNA",
      "Wild-type Cas9 plus a DNA polymerase fused to the gRNA scaffold",
      "dCas9 plus an adenine deaminase",
      "Cas12a plus a separately expressed reverse transcriptase",
    ],
    explanation: "PE2 uses nCas9-H840A (nicks the non-template strand) fused to M-MLV reverse transcriptase. The pegRNA encodes both the targeting spacer and the RT template for the desired edit." },
  { q: "What information does a pegRNA contain that a standard sgRNA does not?", type: "mcq",
    options: [
      "A primer binding site (PBS) and reverse transcriptase template (RTT) that encode the desired edit",
      "Two spacer sequences for dual targeting",
      "A phosphorylation site for nuclear import",
      "A self-cleaving ribozyme to generate defined 3' ends",
    ],
    explanation: "The pegRNA extends the sgRNA 3' end with an RT template (encoding the edit) and a PBS (priming the nicked strand for reverse transcription), directing the fused RT to copy the edit." },
  { q: "The Doench et al. (2016) Azimuth / Rule Set 2 model was trained on which experimental data?", type: "mcq",
    options: [
      "Genome-scale pooled CRISPR knockout screens measuring guide depletion across essential genes",
      "In vitro biochemical cleavage assays with purified Cas9",
      "Single-cell RNA-seq measuring transcriptional changes after editing",
      "X-ray crystal structures of Cas9 bound to different guide sequences",
    ],
    explanation: "Azimuth used data from large-scale dropout screens where guide depletion at essential-gene loci served as a proxy for cutting efficiency." },
  { q: "True or False: Cas12a (Cpf1) generates 5' overhangs (staggered cuts) and recognises a T-rich PAM (TTTN) on the 5' side of the protospacer, unlike SpCas9.", type: "tf",
    options: ["True"],
    explanation: "Cas12a creates a staggered DSB with 5-nt 5' overhangs, uses TTTN PAM on the 5' side, processes its own crRNA, and does not require tracrRNA." },
  { q: "What makes the SpRY variant of SpCas9 (Walton et al. 2020) especially powerful?", type: "mcq",
    options: [
      "SpRY recognises NRN and NYN PAMs, providing near-PAMless activity that makes ~99% of the genome targetable",
      "SpRY edits RNA instead of DNA",
      "SpRY creates only nicks, eliminating DSB-related toxicity",
      "SpRY is 10× smaller than standard Cas9, fitting in a single AAV",
    ],
    explanation: "SpRY's PI domain was extensively mutated to relax PAM recognition — it works with NRN (preferred) and NYN PAMs, dramatically expanding the addressable genome." },
  { q: "What is the PAM requirement for SaCas9 (Staphylococcus aureus Cas9), enabling dual-component AAV delivery?", type: "mcq",
    options: ["NNGRRT", "NGG", "TTTN", "NG"],
    explanation: "SaCas9 requires 5'-NNGRRT-3' (R = purine). It's ~1 kb smaller than SpCas9, enabling it to fit alongside its sgRNA in a single AAV vector." },
  { q: "What fundamentally distinguishes Cas13 from Cas9 as a molecular tool?", type: "mcq",
    options: [
      "Cas9 cleaves DNA; Cas13 cleaves RNA — enabling transcriptomic manipulation and diagnostics",
      "Cas13 cleaves DNA; Cas9 cleaves RNA",
      "Both cleave DNA but require different PAM sequences",
      "Cas13 modifies the epigenome; Cas9 edits the DNA sequence",
    ],
    explanation: "Cas13 is a type VI CRISPR effector that targets single-stranded RNA. It is used for RNA knockdown, RNA base editing, and diagnostics (e.g., SHERLOCK)." },
  { q: "In prime editing, on which strand does nCas9 (H840A) make its nick?", type: "mcq",
    options: [
      "The non-template (non-complementary) strand, 3 bp upstream of the PAM",
      "The template (complementary) strand",
      "Both strands simultaneously (creating a DSB)",
      "Whichever strand the PBS anneals to",
    ],
    explanation: "H840A inactivates HNH (template strand), leaving only RuvC active to nick the non-template strand. This exposes a 3'-OH that primes RT-templated editing." },
  { q: "What is 'bystander editing' in the context of cytosine base editing (CBE)?", type: "mcq",
    options: [
      "Unintended C→T conversion of cytosines near the target C within the editor's activity window",
      "Off-target editing at distant non-homologous genomic sites",
      "Indel formation due to residual nicking activity",
      "Editing of endogenous RNA by the cytidine deaminase",
    ],
    explanation: "Because the deaminase acts on any accessible ssDNA C within the ~5-nt window, nearby cytosines can be co-edited even when only one C is the therapeutic target." },
  { q: "What effective homology arm length is recommended for ssODN donors in HDR experiments?", type: "mcq",
    options: ["~50–100 bp per arm (each side of the cut)", "5–10 bp per arm", "20–30 bp per arm", "500–1000 bp per arm (same as plasmid donors)"],
    explanation: "For ssODN-mediated HDR, 50–100 bp arms are generally optimal. Arms below 30 bp show sharp efficiency drops; arms above 200 bp give diminishing returns for small edits." },
  { q: "How does the anti-CRISPR protein AcrIIA4 inhibit SpCas9?", type: "mcq",
    options: [
      "It mimics dsDNA with an NGG PAM, occupying the PAM-interacting domain and blocking DNA substrate binding",
      "It degrades the guide RNA via an endoribonuclease activity",
      "It methylates the protospacer DNA, preventing Cas9 recognition",
      "It covalently modifies the HNH active site, inactivating cleavage",
    ],
    explanation: "AcrIIA4 acts as a molecular PAM-DNA decoy, competing for the same PI domain binding site on Cas9, preventing the enzyme from engaging genomic DNA." },
  { q: "What is 'collateral cleavage' exhibited by activated Cas12 and Cas13 proteins?", type: "mcq",
    options: [
      "Non-specific degradation of any ssDNA (Cas12) or ssRNA (Cas13) in solution once activated by a matched target",
      "Cleavage of the PAM-adjacent strand before R-loop completion",
      "Off-target cutting at distant loci with partial complementarity",
      "Re-cutting of already-edited loci after HDR",
    ],
    explanation: "Upon target recognition, Cas12/Cas13 enter a hyper-activated state with promiscuous nuclease activity. This is harnessed in diagnostics (DETECTR, SHERLOCK) to amplify signal." },
  { q: "True or False: Adenine base editors (ABEs) convert A•T to G•C by deaminating adenine to inosine via an evolved tRNA adenosine deaminase (TadA), which DNA polymerase reads as guanine.", type: "tf",
    options: ["True"],
    explanation: "David Liu's lab evolved TadA to work on ssDNA within the R-loop. A→I is read as G, and replication resolves A•T→G•C. ABE8e is the most widely used current variant." },
  { q: "In the PE3b strategy of prime editing, why is a second nicking sgRNA included?", type: "mcq",
    options: [
      "To nick the unedited complementary strand, biasing mismatch repair toward incorporating the prime-edited sequence",
      "To create a DSB that improves template integration",
      "To extend the editing window beyond 20 bp",
      "To prevent the edited strand from being re-nicked by the pegRNA-directed nCas9",
    ],
    explanation: "PE3b's second nick on the non-edited strand signals MMR machinery to use the edited strand as template, increasing efficiency ~2–4-fold." },
  { q: "Why are mismatches in the PAM-proximal seed region (~12 nt) far more disruptive than those in the PAM-distal region?", type: "mcq",
    options: [
      "R-loop formation initiates PAM-proximally; mismatches here arrest the conformational checkpoint required for HNH activation and cleavage",
      "The RuvC domain binds directly to the seed region, so mismatches physically block enzyme binding",
      "Mismatches anywhere in the guide are equally disruptive — the seed region effect is a myth",
      "The seed region is protected by the tracrRNA scaffold, preventing R-loop initiation from the distal end",
    ],
    explanation: "Cas9 interrogates the target sequentially from the PAM inward. Seed-region mismatches prevent HNH from adopting its catalytically active conformation, blocking cleavage." },
  { q: "What distinguishes the range of edits achievable by base editors (CBE/ABE) versus prime editing?", type: "mcq",
    options: [
      "Base editors can only install transitions (C→T or A→G); prime editing can install all 12 substitution types, small indels, and multi-nucleotide edits",
      "Base editors can make any substitution; prime editing is limited to transitions only",
      "Both have identical edit range — prime editing is just more efficient",
      "Prime editing can only correct single-base deletions, not substitutions",
    ],
    explanation: "CBEs give C→T, ABEs give A→G. Prime editing uses a custom RT template that can encode any sequence change including transversions, indels, and combinations." },
  { q: "What is the primary technical barrier to efficient CRISPR-HDR in haematopoietic stem cells (HSCs) for therapeutic applications?", type: "mcq",
    options: [
      "Most HSCs are quiescent (G0), severely limiting HDR; electroporation stress also reduces viability and stem-cell potential",
      "HSCs lack the nuclear import machinery needed for Cas9 RNP uptake",
      "The donor template is degraded by lysosomal nucleases before nuclear entry",
      "HSCs constitutively express anti-CRISPR proteins",
    ],
    explanation: "Achieving the ~80% editing needed clinically (as in Casgevy) required extensive optimisation of electroporation conditions, RNP dosing, and AAV6 donor delivery in quiescent HSCs." },
  { q: "What is the significance of 'truncated guide' strategies (17-nt spacers) for improving CRISPR specificity?", type: "mcq",
    options: [
      "Truncated guides reduce off-target effects because lower binding energy disproportionately penalises partially-matched off-target sites relative to fully-matched on-target sites",
      "Truncated guides always improve on-target efficiency by stabilising the Cas9 complex",
      "Guides shorter than 20 nt are completely inactive and used only as negative controls",
      "Truncation removes the seed region entirely, abolishing sequence specificity",
    ],
    explanation: "Fu et al. (2014) showed that 17–18 nt guides retain on-target activity while significantly reducing off-target cutting, because full-length guides provide 'excess' energy that tolerates mismatches." },
  { q: "Which computational off-target scoring approach (Hsu et al. 2013) weighs mismatch positions non-uniformly?", type: "mcq",
    options: [
      "An aggregate mismatch score that penalises PAM-proximal mismatches more heavily and penalises clustered mismatches more than dispersed ones",
      "Simple Hamming distance with all positions weighted equally",
      "The Doench Rule Set 2 on-target score applied in reverse",
      "GC content percentage of the off-target site only",
    ],
    explanation: "The MIT/Zhang-lab specificity score uses empirical weights where PAM-proximal positions are ~5× more penalising than PAM-distal, and clusters of mismatches near the PAM are scored most harshly." },
  { q: "True or False: Prime editing requires a double-strand break (DSB) to install edits, similar to HDR.", type: "tf",
    options: ["False"],
    explanation: "Prime editing uses only a single-strand nick (not a DSB). The nicked strand is reverse-transcribed using the pegRNA RT template, and cellular repair machinery resolves the flap, avoiding DSB-associated toxicity and large indels." },
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const [phase, setPhase] = useState<Phase>("select");
  const [diff, setDiff]   = useState<Difficulty>("easy");
  const [questions, setQuestions] = useState<LiveQ[]>([]);
  const [idx, setIdx]     = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);
  const [hs, setHsState]  = useState<Record<Difficulty, number>>(loadHS);

  const cfg = DIFF_CONFIG[diff];
  const q   = questions[idx];
  const currentAnswer = answers[idx];
  const isAnswered     = currentAnswer !== undefined;
  const isCorrect      = isAnswered && currentAnswer === q?.correctIdx;
  const progressPct    = questions.length > 0 ? ((idx + (isAnswered ? 1 : 0)) / questions.length) * 100 : 0;
  const sessionScore   = answers.filter((a, i) => a !== undefined && a === questions[i]?.correctIdx).length;

  function startQuiz(d: Difficulty) {
    const bank = d === "easy" ? EASY : d === "medium" ? MEDIUM : HARD;
    const picked = shuffle([...bank]).slice(0, 20).map(makeLive);
    setDiff(d);
    setQuestions(picked);
    setIdx(0);
    setAnswers(new Array(20).fill(undefined));
    setPhase("quiz");
  }

  function submitAnswer(optIdx: number) {
    if (isAnswered) return;
    setAnswers(prev => { const next = [...prev]; next[idx] = optIdx; return next; });
  }

  function nextQuestion() {
    if (idx + 1 >= questions.length) {
      const final = answers.map((a, i) => a !== undefined ? a : -1)
        .filter((a, i) => a === questions[i]?.correctIdx).length;
      // Also count current if just answered
      const currentCorrect = currentAnswer === q.correctIdx ? 1 : 0;
      const allAnswered = answers.filter(a => a !== undefined).length;
      const finalScore = allAnswered === questions.length ? sessionScore : sessionScore + currentCorrect;
      if (finalScore > hs[diff]) {
        const newHs = { ...hs, [diff]: finalScore };
        setHsState(newHs);
        saveHS(diff, finalScore);
      }
      setPhase("results");
    } else {
      setIdx(i => i + 1);
    }
  }

  // ── Tier helper ─────────────────────────────────────────────────
  function getTier(score: number, total: number) {
    const pct = score / total;
    if (pct >= 0.95) return { label: "Master",     color: "#a78bfa", badge: "🏆", note: "Near-perfect score. You could teach this!" };
    if (pct >= 0.85) return { label: "Expert",      color: "#4ade80", badge: "⭐", note: "Excellent! You clearly know your CRISPR science." };
    if (pct >= 0.70) return { label: "Proficient",  color: "#60a5fa", badge: "✔",  note: "Well done! A solid grasp of the material." };
    if (pct >= 0.50) return { label: "Learner",     color: "#fbbf24", badge: "📚", note: "Good start. Review the modules and try again!" };
    return                  { label: "Novice",      color: "#f87171", badge: "🌱", note: "Keep studying — the Learn section is a great place to start." };
  }

  // ── Styles ──────────────────────────────────────────────────────
  const page: React.CSSProperties = {
    minHeight: "calc(100vh - 64px)",
    padding: "40px 20px 80px",
    maxWidth: 820,
    margin: "0 auto",
  };

  // ── Render: Level Selection ──────────────────────────────────────
  if (phase === "select") {
    return (
      <div style={page}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(54,140,255,0.12)", border: "1px solid rgba(54,140,255,0.28)", borderRadius: 99, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: 14 }}>🧬</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#368cff", textTransform: "uppercase" }}>Knowledge Quiz</span>
          </div>
          <h1 style={{ margin: "0 0 10px", fontSize: 28, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.2 }}>
            Test Your CRISPR Knowledge
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.55)", maxWidth: 480, marginInline: "auto", lineHeight: 1.6 }}>
            20 questions per session drawn from a large question bank. Your highest score is saved for each level.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {(["easy", "medium", "hard"] as Difficulty[]).map(d => {
            const c = DIFF_CONFIG[d];
            const best = hs[d];
            return (
              <div key={d} style={{ background: "linear-gradient(150deg, #0e1829 0%, #0b1120 100%)", border: `1px solid ${c.border}`, borderRadius: 16, padding: "24px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 28 }}>{c.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: c.color, background: `${c.color}18`, border: `1px solid ${c.color}44`, borderRadius: 6, padding: "2px 8px" }}>
                    {c.label.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{c.topic}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.52)", lineHeight: 1.55 }}>{c.desc}</div>
                </div>
                <div style={{ padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginBottom: 4 }}>BEST SCORE</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 26, fontWeight: 800, color: best > 0 ? c.color : "rgba(255,255,255,0.18)", fontFamily: "monospace" }}>{best}</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>/&nbsp;20</span>
                  </div>
                  {best > 0 && (
                    <div style={{ fontSize: 11, color: c.color, marginTop: 2 }}>
                      {getTier(best, 20).badge} {getTier(best, 20).label}
                    </div>
                  )}
                  {best === 0 && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>Not attempted yet</div>}
                </div>
                <button
                  onClick={() => startQuiz(d)}
                  style={{
                    background: `linear-gradient(135deg, ${c.color}33 0%, ${c.color}18 100%)`,
                    border: `1px solid ${c.color}55`,
                    borderRadius: 10, padding: "10px 0",
                    fontSize: 13, fontWeight: 700, color: c.color,
                    cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.04em",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${c.color}30`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(135deg, ${c.color}33 0%, ${c.color}18 100%)`; }}
                >
                  Start Quiz →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Render: Results ──────────────────────────────────────────────
  if (phase === "results") {
    const finalScore = answers.filter((a, i) => a !== undefined && a === questions[i]?.correctIdx).length;
    const tier = getTier(finalScore, questions.length);
    const isNewHS = finalScore >= hs[diff] && finalScore > 0;

    return (
      <div style={page}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          {isNewHS && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.35)", borderRadius: 99, padding: "5px 14px", marginBottom: 16, animation: "tourCardIn 0.3s ease" }}>
              <span>🎉</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#a78bfa" }}>NEW HIGH SCORE!</span>
            </div>
          )}

          <div style={{ background: "linear-gradient(150deg, #0e1829 0%, #0b1120 100%)", border: "1px solid rgba(54,140,255,0.25)", borderRadius: 20, padding: "36px 32px", marginBottom: 20 }}>
            <div style={{ fontSize: 56, fontWeight: 900, color: tier.color, fontFamily: "monospace", lineHeight: 1, marginBottom: 4 }}>
              {finalScore}<span style={{ fontSize: 24, color: "rgba(255,255,255,0.3)" }}>/{questions.length}</span>
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>
              {Math.round((finalScore / questions.length) * 100)}% correct
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${tier.color}18`, border: `1px solid ${tier.color}44`, borderRadius: 10, padding: "8px 18px", marginBottom: 16 }}>
              <span style={{ fontSize: 18 }}>{tier.badge}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: tier.color }}>{tier.label}</span>
            </div>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.55 }}>{tier.note}</p>

            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-around", marginBottom: 8 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#4ade80" }}>{finalScore}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>CORRECT</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#f87171" }}>{questions.length - finalScore}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>INCORRECT</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: cfg.color }}>{hs[diff]}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>BEST SCORE</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={() => startQuiz(diff)}
              style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #368cff 100%)", border: "none", borderRadius: 10, padding: "11px 24px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 18px rgba(54,140,255,0.35)" }}
            >
              Try Again
            </button>
            <button
              onClick={() => setPhase("select")}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, padding: "11px 24px", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.65)", cursor: "pointer", fontFamily: "inherit" }}
            >
              Change Level
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Quiz ─────────────────────────────────────────────────
  return (
    <div style={page}>
      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}44`, borderRadius: 6, padding: "3px 9px" }}>
            {cfg.icon} {cfg.label.toUpperCase()}
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Question {idx + 1} / {questions.length}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 700 }}>✓ {sessionScore} correct</span>
          <button
            onClick={() => setPhase("select")}
            style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 7, padding: "4px 10px", fontSize: 11, color: "rgba(255,255,255,0.35)", cursor: "pointer", fontFamily: "inherit" }}
          >
            Quit
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 4, marginBottom: 28, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progressPct}%`, background: `linear-gradient(90deg, #368cff, ${cfg.color})`, borderRadius: 4, transition: "width 0.4s ease" }} />
      </div>

      {/* Question card */}
      {q && (
        <div style={{ background: "linear-gradient(150deg, #0e1829 0%, #0b1120 100%)", border: "1px solid rgba(54,140,255,0.22)", borderRadius: 16, padding: "28px 28px 24px", marginBottom: 12, animation: "tourCardIn 0.18s ease" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: "rgba(54,140,255,0.7)", marginBottom: 12 }}>
            {q.type === "tf" ? "TRUE / FALSE" : "MULTIPLE CHOICE"}
          </div>
          <p style={{ margin: "0 0 24px", fontSize: 15.5, fontWeight: 600, color: "#f1f5f9", lineHeight: 1.55 }}>{q.q}</p>

          {/* Answer options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {q.opts.map((opt, i) => {
              let bg = "rgba(255,255,255,0.04)";
              let border = "rgba(255,255,255,0.10)";
              let color = "rgba(255,255,255,0.72)";
              let iconEl: React.ReactNode = null;

              if (isAnswered) {
                if (i === q.correctIdx) {
                  bg = "rgba(74,222,128,0.10)"; border = "rgba(74,222,128,0.45)"; color = "#4ade80";
                  iconEl = <span style={{ color: "#4ade80", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>✓</span>;
                } else if (i === currentAnswer) {
                  bg = "rgba(248,113,113,0.10)"; border = "rgba(248,113,113,0.45)"; color = "#f87171";
                  iconEl = <span style={{ color: "#f87171", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>✗</span>;
                } else {
                  color = "rgba(255,255,255,0.28)"; border = "rgba(255,255,255,0.06)";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => submitAnswer(i)}
                  disabled={isAnswered}
                  style={{
                    background: bg, border: `1px solid ${border}`, borderRadius: 10,
                    padding: "12px 16px", textAlign: "left", cursor: isAnswered ? "default" : "pointer",
                    fontSize: 13.5, color, fontFamily: "inherit", fontWeight: 500, lineHeight: 1.4,
                    display: "flex", alignItems: "center", gap: 10, transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (!isAnswered) (e.currentTarget as HTMLButtonElement).style.background = "rgba(54,140,255,0.12)"; }}
                  onMouseLeave={e => { if (!isAnswered) (e.currentTarget as HTMLButtonElement).style.background = bg; }}
                >
                  <span style={{ width: 22, height: 22, borderRadius: 6, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: isAnswered && i === q.correctIdx ? "#4ade80" : "rgba(255,255,255,0.3)", flexShrink: 0 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                  {iconEl}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div style={{ marginTop: 18, padding: "12px 16px", background: isCorrect ? "rgba(74,222,128,0.07)" : "rgba(54,140,255,0.07)", border: `1px solid ${isCorrect ? "rgba(74,222,128,0.25)" : "rgba(54,140,255,0.22)"}`, borderRadius: 10, animation: "tourCardIn 0.2s ease" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: isCorrect ? "#4ade80" : "#368cff", marginBottom: 5 }}>
                {isCorrect ? "✓ CORRECT" : "✗ INCORRECT"} — EXPLANATION
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.62)", lineHeight: 1.6 }}>{q.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <div style={{ display: "flex", justifyContent: "flex-end", animation: "tourCardIn 0.18s ease" }}>
          <button
            onClick={nextQuestion}
            style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #368cff 100%)", border: "none", borderRadius: 10, padding: "11px 28px", fontSize: 13, fontWeight: 800, color: "#fff", cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.04em", boxShadow: "0 4px 18px rgba(54,140,255,0.38)" }}
          >
            {idx + 1 >= questions.length ? "See Results →" : "Next Question →"}
          </button>
        </div>
      )}
    </div>
  );
}
