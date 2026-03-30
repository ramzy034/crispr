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
        visual: "video",
        content: [
          {
            type: "video",
            url: "https://www.youtube.com/embed/Yzn9T9KDGzs",
            caption: "How CRISPR could cure Sickle Cell Disease — explained",
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
            url: "https://www.youtube.com/embed/OeHFBnGEoPk",
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
        visual: "video",
        content: [
          {
            type: "video",
            url: "https://www.youtube.com/embed/kqpERBe5OOM",
            caption: "CRISPR delivery methods — viral vectors vs lipid nanoparticles",
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
    ],
  },
];