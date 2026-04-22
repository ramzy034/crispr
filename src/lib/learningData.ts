export type VisualType =
  | "dna-animation"
  | "cas9-diagram"
  | "grna-diagram"
  | "nhej-diagram"
  | "delivery-diagram"
  | "video";

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "highlight"; text: string; color?: string }
  | { type: "fact-grid"; facts: { label: string; value: string; color: string }[] }
  | { type: "steps"; steps: { icon: string; title: string; body: string }[] }
  | { type: "comparison"; left: { title: string; items: string[]; color: string }; right: { title: string; items: string[]; color: string } }
  | { type: "video"; url: string; caption: string };

export type Section = {
  heading: string;
  visual: VisualType;
  content: ContentBlock[];
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type Chapter = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  accentDark: string;
  estimatedMinutes: number;
  sections: Section[];
  quiz: QuizQuestion[];
};

export const CHAPTERS: Chapter[] = [
  {
    id: "what-is-crispr",
    title: "What is CRISPR?",
    subtitle: "The molecular scissors explained",
    emoji: "✂️",
    color: "#4fc3f7",
    accentDark: "#0d2a3a",
    estimatedMinutes: 5,
    sections: [
      {
        heading: "DNA — The Book of Life",
        visual: "dna-animation",
        content: [
          {
            type: "paragraph",
            text: "Every single cell in your body contains roughly 3 billion base pairs of DNA — a complete, microscopic instruction manual for building and operating you. This manual is organized into about 20,000 genes, each responsible for a specific protein or function.",
          },
          {
            type: "highlight",
            text: "A single 'typo' in one gene — a mutation affecting just one base pair out of 3 billion — can cause devastating diseases like Sickle Cell Anemia, Huntington's Disease, or Cystic Fibrosis.",
            color: "#4fc3f7",
          },
          {
            type: "fact-grid",
            facts: [
              { label: "Base pairs in human genome", value: "3.2 Billion", color: "#4fc3f7" },
              { label: "Protein-coding genes", value: "~20,000", color: "#81c784" },
              { label: "DNA in each cell", value: "~2 meters", color: "#ffb74d" },
              { label: "Cells in human body", value: "37 Trillion", color: "#ce93d8" },
            ],
          },
        ],
      },
      {
        heading: "Enter CRISPR-Cas9",
        visual: "cas9-diagram",
        content: [
          {
            type: "paragraph",
            text: "CRISPR (Clustered Regularly Interspaced Short Palindromic Repeats) was originally discovered as part of the bacterial immune system. Bacteria use it to recognize and destroy viral DNA that has infected them before. Scientists repurposed this natural system into one of the most powerful gene-editing tools ever created.",
          },
          {
            type: "steps",
            steps: [
              {
                icon: "🔍",
                title: "Search",
                body: "A custom guide RNA (gRNA) — a short, synthetic piece of RNA — is programmed with a sequence matching your exact DNA target. It scans billions of base pairs to find its match.",
              },
              {
                icon: "✂️",
                title: "Cut",
                body: "The Cas9 protein, guided to the target site, acts as molecular scissors. It makes a precise double-strand break — cutting through both strands of the DNA helix.",
              },
              {
                icon: "🔧",
                title: "Edit",
                body: "The cell detects the break and activates its repair machinery. Scientists can exploit this repair process to delete, disrupt, or replace specific genetic sequences.",
              },
            ],
          },
          {
            type: "highlight",
            text: "Nobel Prize 2020: Jennifer Doudna and Emmanuelle Charpentier were awarded the Nobel Prize in Chemistry for developing CRISPR-Cas9 as a gene-editing tool.",
            color: "#ffd54f",
          },
        ],
      },
      {
        heading: "Why CRISPR Changed Everything",
        visual: "video",
        content: [
          {
            type: "video",
            url: "https://www.youtube.com/embed/2pp17E4E-O8",
            caption: "How CRISPR lets us edit our DNA — TED Talk by Jennifer Doudna",
          },
          {
            type: "paragraph",
            text: "Before CRISPR, gene editing tools like ZFNs and TALENs existed but were incredibly expensive, slow to design, and inconsistent. CRISPR democratized gene editing — it's faster to design (days vs months), cheaper (hundreds vs tens of thousands of dollars), and works in virtually any organism.",
          },
          {
            type: "comparison",
            left: {
              title: "Before CRISPR",
              color: "#ef9a9a",
              items: [
                "Months to design editing tools",
                "$10,000–$50,000 per experiment",
                "Low specificity",
                "Limited to few organisms",
                "Highly specialized expertise required",
              ],
            },
            right: {
              title: "With CRISPR",
              color: "#81c784",
              items: [
                "Days to design guide RNAs",
                "Under $100 per experiment",
                "High precision targeting",
                "Works in any organism",
                "Accessible to most biology labs",
              ],
            },
          },
        ],
      },
    ],
    quiz: [
      {
        question: "What is the role of the guide RNA (gRNA) in CRISPR-Cas9?",
        options: [
          "It physically cuts the DNA double helix",
          "It acts as a GPS — guiding Cas9 to the exact DNA target sequence",
          "It repairs the DNA break after Cas9 cuts",
          "It delivers the Cas9 protein into the cell nucleus",
        ],
        correct: 1,
        explanation: "The gRNA base-pairs with the complementary DNA sequence at the target site, acting as a molecular GPS. Cas9 follows the gRNA and makes the cut at that precise location.",
      },
      {
        question: "Where does CRISPR-Cas9 originally come from?",
        options: [
          "It was designed from scratch by scientists in the lab",
          "It was derived from a fungal defense mechanism",
          "It is part of the natural immune system of bacteria",
          "It was found in the human genome",
        ],
        correct: 2,
        explanation: "Bacteria use CRISPR as an adaptive immune system — they store fragments of viral DNA and use Cas9 to recognize and cut that viral DNA if the virus attacks again. Scientists repurposed this natural system.",
      },
      {
        question: "Who won the 2020 Nobel Prize in Chemistry for CRISPR?",
        options: [
          "Francis Crick and James Watson",
          "Jennifer Doudna and Emmanuelle Charpentier",
          "David Baltimore and Howard Temin",
          "Craig Venter and George Church",
        ],
        correct: 1,
        explanation: "Jennifer Doudna (UC Berkeley) and Emmanuelle Charpentier (Max Planck Institute) jointly received the 2020 Nobel Prize in Chemistry for developing CRISPR-Cas9 into a precise gene-editing tool.",
      },
      {
        question: "What does the PAM sequence (e.g. NGG for SpCas9) do?",
        options: [
          "It is the 20 nt sequence the gRNA binds to",
          "It is a short motif adjacent to the target that Cas9 must recognise before cutting",
          "It encodes the Cas9 protein's catalytic domain",
          "It is the sequence left behind after the DNA is repaired",
        ],
        correct: 1,
        explanation: "PAM (Protospacer Adjacent Motif) is a short sequence (5'-NGG-3' for SpCas9) directly next to the target site on the non-template strand. Cas9 will not cut without recognising the PAM — it acts as a 'landing pad' check that prevents Cas9 from cutting its own genome.",
      },
      {
        question: "A CRISPR guide RNA targeting 'ATGCGTACGATCGGCTATGG' will cut DNA where?",
        options: [
          "Anywhere in the genome that has a similar sequence",
          "Only at the exact 20 nt match followed by an NGG PAM",
          "Only inside the nucleus of non-dividing cells",
          "At random sites chosen by Cas9",
        ],
        correct: 1,
        explanation: "The guide RNA must exactly base-pair with its 20 nt target, AND that target must be followed by an NGG PAM. Any mismatch — especially in the 'seed' region (12 nt near the PAM) — dramatically reduces or eliminates cutting efficiency.",
      },
      {
        question: "Why is CRISPR-Cas9 considered more accessible than older editing tools like ZFNs?",
        options: [
          "It requires no guide RNA and works automatically",
          "It is protein-based and avoids DNA entirely",
          "The targeting is programmed by a cheap synthetic RNA, not by expensive protein engineering",
          "CRISPR only works in plant and yeast cells, which are easier to culture",
        ],
        correct: 2,
        explanation: "Zinc finger nucleases (ZFNs) and TALENs require custom protein engineering for each new target — months of work costing tens of thousands of dollars. CRISPR replaces that protein engineering with a simple 20 nt RNA oligo that can be ordered and delivered in days for under $100.",
      },
    ],
  },
  {
    id: "paired-deletions",
    title: "Paired Deletions",
    subtitle: "Using two guide RNAs to excise a DNA segment",
    emoji: "🔬",
    color: "#81c784",
    accentDark: "#0a1f0a",
    estimatedMinutes: 6,
    sections: [
      {
        heading: "The Problem With One Cut",
        visual: "nhej-diagram",
        content: [
          {
            type: "paragraph",
            text: "When a single CRISPR cut is made, the cell's repair machinery (NHEJ) rapidly seals the break — often within hours. The result is a small random insertion or deletion (indel) right at the cut site. While this can disrupt a gene, it doesn't remove a large regulatory region.",
          },
          {
            type: "highlight",
            text: "To delete an entire segment of DNA — like a disease-causing enhancer or a viral genome integrated into host DNA — you need two cuts flanking the region you want to remove.",
            color: "#81c784",
          },
          {
            type: "paragraph",
            text: "This strategy is called a paired deletion or CRISPR excision. Two guide RNAs target sequences on either side of the region to be deleted. Both Cas9 complexes cut simultaneously, and the cell repairs the two free ends by joining them together — dropping the segment between them entirely.",
          },
        ],
      },
      {
        heading: "The Mechanics of Excision",
        visual: "grna-diagram",
        content: [
          {
            type: "steps",
            steps: [
              {
                icon: "1️⃣",
                title: "Design Two gRNAs",
                body: "Guide RNA 1 targets a sequence just upstream (5') of the region to delete. Guide RNA 2 targets a sequence just downstream (3'). Together they flank the target.",
              },
              {
                icon: "2️⃣",
                title: "Simultaneous Dual Cleavage",
                body: "Both gRNA-Cas9 complexes bind and cut at the same time, creating two double-strand breaks — one at each flank of the deletion target.",
              },
              {
                icon: "3️⃣",
                title: "NHEJ Joins the Ends",
                body: "The cell's Non-Homologous End Joining (NHEJ) pathway detects the two free DNA ends left after the middle segment is released and ligates them together.",
              },
              {
                icon: "4️⃣",
                title: "Segment is Excised",
                body: "The DNA segment between the two cut sites — which could be anywhere from 50 bp to several kilobases — is permanently removed from the genome.",
              },
            ],
          },
          {
            type: "fact-grid",
            facts: [
              { label: "Typical deletion size", value: "50 bp – 10 kb", color: "#81c784" },
              { label: "Excision efficiency", value: "10–60%", color: "#4fc3f7" },
              { label: "Time for NHEJ repair", value: "Hours", color: "#ffb74d" },
              { label: "Off-target risk", value: "Low with quality gRNAs", color: "#ce93d8" },
            ],
          },
        ],
      },
      {
        heading: "Real-World Application: Sickle Cell Disease",
        visual: "dna-animation",
        content: [
          {
            type: "highlight",
            text: "Victoria Gray was the first person treated with CRISPR gene editing for sickle cell disease in 2019. By 2023, the FDA approved Casgevy — the first CRISPR therapy ever approved — using the exact BCL11A enhancer deletion strategy described above. Gray reported: 'The therapy has really transformed my life more than I could have ever imagined.'",
            color: "#81c784",
          },
          {
            type: "paragraph",
            text: "Sickle Cell Disease is caused by a mutation in the HBB gene that makes red blood cells rigid and crescent-shaped. One breakthrough strategy doesn't fix the HBB mutation directly — instead, it deletes a small enhancer region in the BCL11A gene.",
          },
          {
            type: "highlight",
            text: "BCL11A normally suppresses fetal hemoglobin (HbF) production after birth. By deleting its enhancer with paired gRNAs, scientists can reactivate HbF production — which compensates for the faulty adult hemoglobin. This is the strategy behind Casgevy, the first CRISPR therapy approved by the FDA (December 2023).",
            color: "#81c784",
          },
        ],
      },
    ],
    quiz: [
      {
        question: "Why do deletion strategies use TWO guide RNAs instead of one?",
        options: [
          "Two gRNAs increase delivery efficiency into the cell",
          "One gRNA is never specific enough to find a target",
          "Two flanking cuts allow the cell to excise the entire segment between them",
          "Two gRNAs reduce the immune response to Cas9",
        ],
        correct: 2,
        explanation: "A single cut is repaired by NHEJ, causing a small indel. Two cuts flanking a region cause the cell to join the outer ends together, dropping the middle segment — creating a defined deletion.",
      },
      {
        question: "What repair mechanism joins the DNA ends after a paired deletion?",
        options: [
          "Homology-Directed Repair (HDR)",
          "Base Excision Repair (BER)",
          "Mismatch Repair (MMR)",
          "Non-Homologous End Joining (NHEJ)",
        ],
        correct: 3,
        explanation: "NHEJ is the predominant repair pathway for double-strand breaks. It joins the two free ends left after the intervening segment is excised, completing the deletion.",
      },
      {
        question: "What is the BCL11A enhancer deletion strategy targeting in Sickle Cell Disease?",
        options: [
          "It corrects the HBB point mutation directly",
          "It deletes the entire HBB gene",
          "It reactivates fetal hemoglobin by removing a suppressor enhancer",
          "It prevents red blood cells from becoming crescent-shaped",
        ],
        correct: 2,
        explanation: "BCL11A suppresses fetal hemoglobin (HbF) after birth. Deleting its erythroid enhancer de-represses HbF, which compensates for faulty adult hemoglobin — a complete functional cure strategy.",
      },
      {
        question: "You want to delete a 500 bp enhancer. Why should you place your guide RNAs at the EDGES of the enhancer, not inside it?",
        options: [
          "Guides inside the enhancer would have worse GC content",
          "Guides at the edges flank the target — both cuts release the segment between them",
          "Guides inside would cut too many times and destroy the whole chromosome",
          "The PAM sequence is never found inside enhancers",
        ],
        correct: 1,
        explanation: "Paired deletion requires two DSBs flanking the region to be removed. Guide 1 cuts just upstream (5') of the enhancer, Guide 2 cuts just downstream (3'). NHEJ then joins the two free ends, dropping the enhancer. Guides inside the enhancer would create internal cuts but leave the flanking sequence intact.",
      },
      {
        question: "How do you verify a successful paired deletion by PCR?",
        options: [
          "The PCR product disappears entirely when the deletion works",
          "A primer pair flanking the deletion site produces a shorter band in edited cells vs. a longer band in wild-type",
          "You use qPCR to measure gene expression",
          "The deletion causes cells to glow under UV light",
        ],
        correct: 1,
        explanation: "Design primers that sit outside both cut sites. In wild-type cells the PCR amplifies the full region (longer band). In successfully deleted cells the region between the cuts is gone, so the PCR product is shorter. Comparing both bands on a gel confirms editing efficiency.",
      },
      {
        question: "What is a likely consequence of targeting a late exon (e.g. exon 50 of 54) for a knockout?",
        options: [
          "The protein is completely destroyed",
          "The cell cannot repair the cut at all",
          "Exon skipping by the ribosome may produce a truncated but still partially functional protein",
          "Late exons are impossible to target with CRISPR",
        ],
        correct: 2,
        explanation: "Targeting a late exon risks creating a 'hypomorphic' allele — the cell's splicing machinery skips the damaged exon and produces a truncated protein that retains partial function. For a clean knockout, target early coding exons (exon 1 or 2) or splice donor/acceptor sites to force a frameshift.",
      },
    ],
  },
  {
    id: "repair-mechanisms",
    title: "DNA Repair",
    subtitle: "NHEJ vs HDR — what happens after the cut",
    emoji: "🔧",
    color: "#ffb74d",
    accentDark: "#1f1000",
    estimatedMinutes: 5,
    sections: [
      {
        heading: "The Cell's Emergency Response",
        visual: "nhej-diagram",
        content: [
          {
            type: "paragraph",
            text: "Double-strand DNA breaks are one of the most dangerous forms of DNA damage a cell can experience. Left unrepaired, they cause chromosomal instability and cell death. The cell has evolved two major pathways to respond — and scientists exploit both strategically in CRISPR editing.",
          },
          {
            type: "comparison",
            left: {
              title: "NHEJ — Fast & Imprecise",
              color: "#ef9a9a",
              items: [
                "Active in all cell cycle phases",
                "No template required",
                "Rapid (minutes to hours)",
                "Often causes small indels",
                "Used for gene disruption",
                "Dominant pathway in most cells",
              ],
            },
            right: {
              title: "HDR — Slow & Precise",
              color: "#81c784",
              items: [
                "Only active in S/G2 phase",
                "Requires a DNA template",
                "Slower (hours to days)",
                "Can make exact changes",
                "Used for precise corrections",
                "Efficient mainly in dividing cells",
              ],
            },
          },
        ],
      },
      {
        heading: "NHEJ in Detail",
        visual: "nhej-diagram",
        content: [
          {
            type: "paragraph",
            text: "Non-Homologous End Joining grabs the two broken DNA ends and ligates them back together without a template. The enzymes involved (Ku70/Ku80, DNA-PKcs, Ligase IV) can add or remove a few nucleotides in the process — creating small insertions or deletions (indels) at the cut site.",
          },
          {
            type: "highlight",
            text: "For gene knockout experiments, NHEJ is actually desirable — the random indels often shift the reading frame, creating a premature stop codon and disabling the protein entirely.",
            color: "#ffb74d",
          },
          {
            type: "steps",
            steps: [
              { icon: "💥", title: "Break Detected", body: "Ku70/Ku80 heterodimer rapidly binds both broken ends within seconds, preventing degradation." },
              { icon: "🔍", title: "End Processing", body: "DNA-PKcs and Artemis trim or fill in the ends — sometimes adding random nucleotides." },
              { icon: "🔗", title: "Ligation", body: "Ligase IV/XRCC4/XLF complex joins the two ends together, regardless of sequence compatibility." },
            ],
          },
        ],
      },
      {
        heading: "HDR — Precision Editing",
        visual: "cas9-diagram",
        content: [
          {
            type: "paragraph",
            text: "Homology-Directed Repair uses a provided DNA template (donor) to make an exact change at the cut site. The template contains the desired sequence flanked by 'homology arms' — sequences matching the genomic DNA on each side of the cut. The cell uses these arms to copy the template precisely into the genome.",
          },
          {
            type: "video",
            url: "https://www.youtube.com/embed/jAhjPd4MD-E",
            caption: "NHEJ vs HDR: DNA repair pathways explained",
          },
          {
            type: "fact-grid",
            facts: [
              { label: "HDR efficiency in non-dividing cells", value: "<1%", color: "#ef9a9a" },
              { label: "HDR efficiency in dividing cells", value: "1–10%", color: "#ffb74d" },
              { label: "HDR with optimized protocols", value: "Up to 60%", color: "#81c784" },
              { label: "Homology arm length needed", value: "50–1000 bp", color: "#4fc3f7" },
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        question: "Which repair pathway requires a DNA template to make precise edits?",
        options: ["NHEJ", "HDR", "Both require a template", "Neither uses a template"],
        correct: 1,
        explanation: "HDR (Homology-Directed Repair) requires a donor DNA template with homology arms matching the target region. NHEJ operates without any template, joining ends directly.",
      },
      {
        question: "Why is NHEJ useful for gene knockout experiments?",
        options: [
          "It makes precise corrections to the target gene",
          "It always inserts a new gene sequence",
          "Its random indels can frameshift the gene, creating a premature stop codon",
          "It activates gene expression rather than disrupting it",
        ],
        correct: 2,
        explanation: "NHEJ-induced indels often cause frameshift mutations — shifting the reading frame so the ribosome reads incorrect codons. This typically creates a premature stop codon, truncating and disabling the protein.",
      },
      {
        question: "Why is HDR less efficient in neurons, muscle cells, and other non-dividing cells?",
        options: [
          "These cells have stronger CRISPR immune responses",
          "HDR is only active during S/G2 phase of the cell cycle",
          "Non-dividing cells have stronger NHEJ machinery",
          "Cas9 cannot enter non-dividing cells",
        ],
        correct: 1,
        explanation: "HDR relies on cellular machinery that is only available during DNA replication (S phase) and the subsequent G2 phase. Post-mitotic cells (neurons, cardiomyocytes) are permanently in G0/G1, making HDR essentially unavailable.",
      },
      {
        question: "After Cas9 cuts DNA using NHEJ repair, what is the most common molecular outcome?",
        options: [
          "A perfect copy of the original sequence is restored",
          "A large chromosomal deletion always occurs",
          "Small random insertions or deletions (indels) at the cut site",
          "The two chromosome ends remain permanently unjoined",
        ],
        correct: 2,
        explanation: "NHEJ is error-prone. Before ligating the two ends, exonucleases may chew back a few bases, or polymerases add random bases. The result is small indels (1–20 bp) at the cut site. If the indel shifts the reading frame by +1 or +2 nt, it creates a premature stop codon and effectively knocks out the gene.",
      },
      {
        question: "A researcher delivers Cas9 + a 150 bp ssODN donor. What repair pathway are they trying to use?",
        options: [
          "NHEJ — the ssODN acts as a backup if NHEJ fails",
          "HDR — the ssODN is used as a template to copy the desired sequence into the cut site",
          "BER (Base Excision Repair) — the ssODN replaces damaged bases",
          "MMEJ — the microhomology ends of the ssODN drive deletion",
        ],
        correct: 1,
        explanation: "Short single-stranded oligodeoxynucleotides (ssODNs) with ~75 bp homology arms flanking the cut site serve as HDR donor templates. The cell's homology-directed repair copies the sequence between the arms into the genome, installing the desired point mutation or short insertion.",
      },
      {
        question: "What percentage of cells typically undergo successful HDR in primary human stem cells?",
        options: [
          "~80–95%",
          "~50–70%",
          "~1–10%",
          "0% — HDR never occurs in human cells",
        ],
        correct: 2,
        explanation: "HDR efficiency in primary human cells (HSCs, iPSCs) is typically 1–10% with standard Cas9 + ssODN. This is why base editing and prime editing are preferred for therapeutic SNP corrections — they achieve 40–60% efficiency without requiring a DSB or donor template.",
      },
    ],
  },
  {
    id: "delivery-methods",
    title: "Delivery Methods",
    subtitle: "Getting CRISPR into the right cells",
    emoji: "🚀",
    color: "#ce93d8",
    accentDark: "#1a0a1f",
    estimatedMinutes: 6,
    sections: [
      {
        heading: "The Delivery Problem",
        visual: "delivery-diagram",
        content: [
          {
            type: "paragraph",
            text: "Having a functional CRISPR system is only half the battle. The Cas9 protein and guide RNA must be physically delivered into the nucleus of the right cell type — in the right tissue — at sufficient concentrations to edit a meaningful fraction of cells. This is one of the hardest unsolved problems in gene therapy.",
          },
          {
            type: "highlight",
            text: "The ideal delivery vehicle is: non-toxic, non-immunogenic, tissue-specific, efficient, and able to carry a large genetic payload. No current technology perfectly meets all these criteria.",
            color: "#ce93d8",
          },
          {
            type: "fact-grid",
            facts: [
              { label: "Cas9 protein size", value: "~160 kDa", color: "#ce93d8" },
              { label: "SpCas9 gene size", value: "~4.2 kb", color: "#4fc3f7" },
              { label: "AAV capacity limit", value: "~4.7 kb", color: "#ffb74d" },
              { label: "LNP delivery efficiency", value: "Up to 80%", color: "#81c784" },
            ],
          },
        ],
      },
      {
        heading: "Ex-vivo vs In-vivo",
        visual: "delivery-diagram",
        content: [
          {
            type: "comparison",
            left: {
              title: "Ex-vivo Editing",
              color: "#4fc3f7",
              items: [
                "Cells removed from patient",
                "Edited in controlled lab environment",
                "Quality-checked before reinfusion",
                "Works for blood & immune cells",
                "Higher editing efficiency",
                "Example: Casgevy (Sickle Cell)",
              ],
            },
            right: {
              title: "In-vivo Editing",
              color: "#ce93d8",
              items: [
                "CRISPR delivered directly into body",
                "Targets non-removable tissues",
                "Liver, eye, muscle, brain",
                "Uses viral or lipid nanoparticle vectors",
                "More complex, less controlled",
                "Example: NTLA-2001 (TTR Amyloidosis)",
              ],
            },
          },
          {
            type: "paragraph",
            text: "Ex-vivo editing — removing cells, editing them outside the body, and returning them — gives maximum control and is currently the most clinically successful approach. In-vivo delivery aims to edit cells directly inside the patient's body, which is essential for diseases affecting organs that can't be removed.",
          },
        ],
      },
      {
        heading: "Delivery Vehicles",
        visual: "delivery-diagram",
        content: [
          {
            type: "fact-grid",
            facts: [
              { label: "Electroporation efficiency", value: ">80%", color: "#ffb74d" },
              { label: "AAV max payload", value: "4.7 kb", color: "#4fc3f7" },
              { label: "LNP particle size", value: "50–120 nm", color: "#ce93d8" },
              { label: "LNP liver targeting", value: "Up to 80%", color: "#81c784" },
            ],
          },
          {
            type: "steps",
            steps: [
              {
                icon: "⚡",
                title: "Electroporation",
                body: "A brief electrical pulse opens temporary pores in the cell membrane, allowing Cas9 RNP (ribonucleoprotein) complexes to enter. Highly efficient for blood cells — used in all current ex-vivo clinical trials including Casgevy.",
              },
              {
                icon: "🧬",
                title: "Adeno-Associated Virus (AAV)",
                body: "Engineered viruses carry the CRISPR components as DNA. Different AAV serotypes target different tissues (AAV9 → CNS, AAV8 → liver). Limitation: 4.7 kb capacity is tight for SpCas9 + gRNA.",
              },
              {
                icon: "💊",
                title: "Lipid Nanoparticles (LNPs)",
                body: "Synthetic fat droplets encapsulate Cas9 mRNA and gRNA. Highly efficient for liver targeting. Used in NTLA-2001, the first in-vivo CRISPR therapy to show clinical results. mRNA is transient — Cas9 is expressed temporarily, reducing off-target risk.",
              },
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        question: "What does 'ex-vivo' gene editing mean?",
        options: [
          "Editing DNA inside a living organism using injections",
          "Editing cells after removing them from the body, then returning them",
          "Using a virus to deliver CRISPR components",
          "Editing embryonic cells before implantation",
        ],
        correct: 1,
        explanation: "Ex-vivo editing removes cells (e.g., hematopoietic stem cells) from the patient, edits them in a controlled lab environment, performs quality checks, then reinfuses them. This approach is used in Casgevy for Sickle Cell Disease.",
      },
      {
        question: "Why is AAV's 4.7 kb size limit a challenge for CRISPR delivery?",
        options: [
          "It makes AAV too expensive to manufacture",
          "SpCas9 gene alone is ~4.2 kb, leaving almost no room for the gRNA and promoters",
          "AAV cannot enter the cell nucleus",
          "The 4.7 kb limit causes immune reactions",
        ],
        correct: 1,
        explanation: "SpCas9 is ~4.2 kb, which nearly fills AAV's entire capacity. Fitting a gRNA expression cassette, promoters, and regulatory elements becomes a major engineering challenge. Smaller Cas variants (SaCas9, CjCas9) or split-intein strategies are used to work around this.",
      },
      {
        question: "What is the key advantage of delivering Cas9 as mRNA via lipid nanoparticles?",
        options: [
          "mRNA integrates permanently into the genome for long-term expression",
          "mRNA is translated once and degraded, limiting Cas9 activity and reducing off-target editing",
          "mRNA delivery targets all tissue types equally",
          "mRNA requires no immune suppression",
        ],
        correct: 1,
        explanation: "mRNA is inherently transient — it is translated into protein and then degraded within hours to days. This means Cas9 is only active briefly, which reduces the window for off-target cuts compared to DNA-based delivery that leads to sustained Cas9 expression.",
      },
      {
        question: "Why can't standard SpCas9 edit mitochondrial DNA (mtDNA)?",
        options: [
          "mtDNA is circular and CRISPR only cuts linear DNA",
          "There is no NGG PAM sequence in mitochondria",
          "Neither Cas9 protein nor gRNA can cross the mitochondrial double membrane",
          "Mitochondria destroy all foreign proteins immediately",
        ],
        correct: 2,
        explanation: "SpCas9 and its gRNA are synthesized in the cytoplasm. No known mechanism imports large proteins or RNA into the mitochondrial matrix in human cells. The inner mitochondrial membrane is highly restrictive. DdCBE (2020) and mitoTALENs work around this differently — they are engineered to have mitochondrial targeting sequences.",
      },
      {
        question: "A clinical trial uses ex-vivo CRISPR: cells are taken from the patient, edited in a dish, then re-infused. Which delivery method is MOST practical for this approach?",
        options: [
          "Intravenous injection of AAV",
          "Lipid nanoparticles injected directly into the liver",
          "Electroporation of Cas9 RNP (ribonucleoprotein) into isolated cells",
          "Oral tablet containing CRISPR components",
        ],
        correct: 2,
        explanation: "Ex-vivo editing uses cells outside the body. Electroporation — applying brief electrical pulses — creates transient pores in cell membranes, allowing Cas9 RNP (Cas9 protein pre-loaded with gRNA) to enter directly. This is highly efficient (>80%), avoids viral vectors, and the Cas9 is cleared quickly. Casgevy uses electroporation of HSCs.",
      },
      {
        question: "What is the maximum DNA payload that AAV can carry, and why is this a problem for CRISPR?",
        options: [
          "~4.7 kb — SpCas9 alone is ~4.2 kb, leaving almost no room for promoters, gRNA, and regulatory sequences",
          "~50 kb — more than enough for any CRISPR component",
          "~1 kb — too small even for the gRNA alone",
          "AAV has no size limit; this is a myth",
        ],
        correct: 0,
        explanation: "AAV's packaging limit is ~4.7 kb. SpCas9 coding sequence is ~4.2 kb alone. Adding a promoter (~500 bp), gRNA scaffold, and polyA signal pushes beyond the limit. Solutions include split-intein Cas9 (delivered in two AAVs) or using smaller Cas9 variants like SaCas9 (~3.2 kb).",
      },
    ],
  },
  {
    id: "ethics-future",
    title: "Ethics & Future",
    subtitle: "Responsibility, equity, and the road ahead",
    emoji: "⚖️",
    color: "#f06292",
    accentDark: "#1a0512",
    estimatedMinutes: 7,
    sections: [
      {
        heading: "The Germline Editing Debate",
        visual: "cas9-diagram",
        content: [
          {
            type: "paragraph",
            text: "Most CRISPR therapies target somatic cells — non-reproductive cells in a living patient. Changes are not inherited. Germline editing targets eggs, sperm, or early embryos, meaning changes are heritable — passed to all future generations. This distinction is at the center of the most important bioethical debate of our time.",
          },
          {
            type: "highlight",
            text: "In November 2018, Chinese scientist He Jiankui announced the birth of twin girls with CRISPR-edited CCR5 genes — the first heritable human genome edits. The global scientific community condemned this as premature and unethical. He was sentenced to three years in prison.",
            color: "#f06292",
          },
          {
            type: "comparison",
            left: {
              title: "Somatic Editing ✓",
              color: "#81c784",
              items: [
                "Treats living patients only",
                "Changes are not inherited",
                "Regulated by FDA/EMA",
                "Casgevy is an example",
                "Broadly accepted ethically",
              ],
            },
            right: {
              title: "Germline Editing ⚠",
              color: "#ef9a9a",
              items: [
                "Changes all future generations",
                "Cannot be reversed after birth",
                "Raises 'designer baby' concerns",
                "Banned in most countries",
                "No clinical use justified yet",
              ],
            },
          },
        ],
      },
      {
        heading: "Who Gets Access?",
        visual: "delivery-diagram",
        content: [
          {
            type: "paragraph",
            text: "Casgevy — the first FDA-approved CRISPR therapy — costs approximately $2.2 million per patient. While transformative, at this price it is accessible only in the wealthiest healthcare systems. This creates a profound equity challenge: gene editing that can cure disease should not be a privilege of the wealthy.",
          },
          {
            type: "fact-grid",
            facts: [
              { label: "Casgevy list price (US)", value: "$2.2M", color: "#f06292" },
              { label: "Sickle cell patients globally", value: "~300,000", color: "#4fc3f7" },
              { label: "Living in low-income countries", value: ">70%", color: "#ffb74d" },
              { label: "Countries with access today", value: "~5", color: "#ef9a9a" },
            ],
          },
          {
            type: "highlight",
            text: "The WHO's Human Genome Editing initiative calls for a global registry of all heritable human genome editing research and equitable access frameworks. The technology is advancing faster than the governance systems meant to guide it.",
            color: "#ffb74d",
          },
        ],
      },
      {
        heading: "The Future of CRISPR",
        visual: "dna-animation",
        content: [
          {
            type: "paragraph",
            text: "CRISPR is not standing still. Beyond cutting DNA, next-generation tools are expanding what's possible — from single-letter corrections to RNA editing without touching the genome at all.",
          },
          {
            type: "steps",
            steps: [
              {
                icon: "🔤",
                title: "Base Editing",
                body: "Converts a single DNA base (A→G or C→T) without creating a double-strand break. Developed by David Liu at Harvard. More precise for correcting single-point mutations.",
              },
              {
                icon: "✏️",
                title: "Prime Editing",
                body: "A 'search and replace' tool using a modified Cas9 (nickase) + pegRNA. Can write any of the 12 possible point mutations, plus small insertions/deletions, without a donor template.",
              },
              {
                icon: "🧬",
                title: "Cas13 — RNA Editing",
                body: "Targets RNA instead of DNA. Can silence or edit gene expression without permanent genome changes. Explored for antiviral therapies and transient gene modulation.",
              },
              {
                icon: "🌱",
                title: "Crops & Agriculture",
                body: "CRISPR is creating disease-resistant wheat, drought-tolerant corn, and allergen-free peanuts. USDA-approved CRISPR crops need no special labeling if no foreign DNA is introduced.",
              },
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        question: "What is the key ethical distinction between somatic and germline CRISPR editing?",
        options: [
          "Somatic editing is more expensive than germline editing",
          "Germline edits are heritable — passed to all future generations",
          "Somatic editing uses Cas9 while germline editing uses Cas12a",
          "Germline editing requires a different PAM sequence",
        ],
        correct: 1,
        explanation: "Somatic cell edits affect only the treated patient and cannot be inherited. Germline edits (in eggs, sperm, or embryos) change the heritable genome — affecting all future descendants. This is why germline editing is banned or tightly restricted in most countries.",
      },
      {
        question: "Approximately how much does the first approved CRISPR therapy (Casgevy) cost per patient?",
        options: ["$50,000", "$500,000", "$2.2 million", "$10 million"],
        correct: 2,
        explanation: "Casgevy's list price is approximately $2.2 million per patient. This raises serious equity concerns since the majority of sickle cell patients live in lower-income countries that cannot afford this treatment.",
      },
      {
        question: "What makes 'Prime Editing' different from standard CRISPR-Cas9?",
        options: [
          "Prime Editing uses a longer guide RNA",
          "Prime Editing can only delete DNA, not insert it",
          "Prime Editing uses a Cas9 nickase + pegRNA to write precise edits without double-strand breaks",
          "Prime Editing only works in plant cells",
        ],
        correct: 2,
        explanation: "Prime Editing uses a Cas9 'nickase' (cuts one strand only) fused to a reverse transcriptase, guided by a pegRNA. It can install any of the 12 point mutations plus small insertions/deletions without a double-strand break or separate donor template — far more precise than standard CRISPR.",
      },
      {
        question: "He Jiankui edited embryos to make babies resistant to HIV by disrupting CCR5. What is the core ethical problem?",
        options: [
          "CCR5 disruption is technically impossible",
          "Germline edits are heritable — the change passes to all future descendants without their consent",
          "He used the wrong Cas9 variant for embryo editing",
          "The editing was not approved because HIV is not serious enough to justify CRISPR",
        ],
        correct: 1,
        explanation: "Germline editing (changing embryos' DNA) creates heritable modifications that affect all future generations. Those individuals — and their children — never consented. This is the fundamental ethical line: somatic editing affects only one person, germline editing affects an entire lineage and is currently banned in most countries.",
      },
      {
        question: "Casgevy costs ~$2.2 million per patient. Which ethical principle does this most directly challenge?",
        options: [
          "Non-maleficence (do no harm)",
          "Justice / equity — life-saving cures should not only be accessible to the wealthy",
          "Autonomy — patients cannot choose their own treatment",
          "Beneficence — the therapy provides no benefit",
        ],
        correct: 1,
        explanation: "Justice in medical ethics demands fair distribution of benefits and burdens. A therapy that cures sickle cell disease — which disproportionately affects people of African descent in lower-income settings — but costs $2.2M creates a profound equity problem: those who need it most are least able to access it.",
      },
      {
        question: "What is 'off-target editing' and why does it matter for clinical CRISPR?",
        options: [
          "Editing the wrong patient's cells by mistake",
          "Cas9 cutting at unintended genomic sites with partial sequence similarity to the guide",
          "Using the wrong PAM sequence in the guide RNA",
          "Editing only 50% of cells instead of 100%",
        ],
        correct: 1,
        explanation: "Off-target edits occur when Cas9 tolerates mismatches between the gRNA and non-target sites, creating cuts in unintended genes. If an off-target site falls in a tumour suppressor gene, it could contribute to cancer. Clinical CRISPR programs use whole-genome sequencing to screen for off-target events — a major regulatory requirement.",
      },
    ],
  },
];