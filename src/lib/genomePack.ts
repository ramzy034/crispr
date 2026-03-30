// src/lib/genomePack.ts

export type TissueTarget = {
  id: string;
  organ: string;
  geneName: string;
  sequence: string;
  isEditable: boolean;
  deliveryMethod?: string;
  difficulty?: "Low" | "Medium" | "High" | "Impossible";
  warning?: string;
  strategy?: string; // New: Explain the goal of the edit
  description?: string; // New: Educational context
};

export type LoadedGenomePack = {
  meta: { id: string; [key: string]: unknown };
  seqs: Array<{ name: string; seq: string }>;
};

export const GENOME_TARGETS: TissueTarget[] = [
  {
    id: "hbb-blood",
    organ: "Blood (Bone Marrow)",
    geneName: "HBB (Sickle Cell)",
    sequence: "ACATTTGCTTCTGACACAACTGTGTTCACTAGCAACCTCAAACAGACACCATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAG",
    isEditable: true,
    deliveryMethod: "Ex-vivo (Electroporation)",
    difficulty: "Low",
    strategy: "Fetal Hemoglobin Induction",
    description: "By deleting the BCL11A enhancer, we can restart 'fetal' hemoglobin production to cure Sickle Cell Disease."
  },
  {
    id: "pcsk9-liver",
    organ: "Liver (Hepatocytes)",
    geneName: "PCSK9 (Cholesterol)",
    sequence: "CAGCCGCAGCCGGCAGAGCCCGAGCCCGAGCCCGAGCCCGGAGCCCGGAGCCCGGAGCCCGGAGCCCGGAGCCCGGAGCCCGGAGCCCGGAGCCCG",
    isEditable: true,
    deliveryMethod: "In-vivo (Lipid Nanoparticles)",
    difficulty: "Low",
    strategy: "Gene Silencing",
    description: "Deleting a portion of the PCSK9 gene permanently lowers LDL (bad) cholesterol levels."
  },
  {
    id: "hiv-excision",
    organ: "T-Cells (Immune)",
    geneName: "HIV-1 (Provirus)",
    sequence: "TGGAAGGGCTAATTCACTCCCAACGAAGACAAGATATCCTTGATCTGTGGATCTACCACACACAAGGCTACTTCCCTGATTGGCAGAACTACACACCAGGGCCAGGGATCAGATATCCACTGACCTTTGGATGGTGCTTCAA",
    isEditable: true,
    deliveryMethod: "Viral Vector (AAV)",
    difficulty: "Medium",
    strategy: "Viral Excision",
    description: "A two-guide strategy is used here to literally 'cut out' the HIV viral DNA that has hidden inside the human genome."
  },
  {
    id: "cftr-lung",
    organ: "Lung Epithelium",
    geneName: "CFTR (Cystic Fibrosis)",
    sequence: "GATTATGCCTGGCACCATTAAAGAAAATATCATCTTTGGTGTTTCCTATGATGAATATAGATACAGAAGCGTCATCAAAGCATGCCAACTAGAAGAG",
    isEditable: true,
    deliveryMethod: "Inhaled Nanoparticles",
    difficulty: "High",
    strategy: "Exon Correction",
    description: "The lung is coated in thick mucus, making it very hard for CRISPR tools to actually reach the target cells."
  },
  {
    id: "pdx1-pancreas",
    organ: "Pancreas (Beta Cells)",
    geneName: "Pdx1 (Diabetes)",
    sequence: "GAATAGTGGAACAGCGAGTTCGAGAGCCAGCGAGCGAGCGAGCGAGCGAGCGAGCGAGCGAGCGAGCGAGCGAGCGAGCGAGCGAGCGAGCGAGCGAG",
    isEditable: false,
    deliveryMethod: "Endoscopic Retrograde Injection",
    difficulty: "Impossible",
    strategy: "Beta Cell Regeneration",
    warning: "Extreme risk of Pancreatitis. The pancreas is highly sensitive to physical trauma; delivering CRISPR components can trigger a 'self-digestion' response by digestive enzymes.",
    description: "While theoretically possible to treat Diabetes, the risk of organ failure during delivery currently outweighs the benefits."
  },
  {
    id: "hbb-brain",
    organ: "Brain (Neurons)",
    geneName: "HBB (Non-Target)",
    sequence: "ACATTTGCTTCTGACACAACTGTGTTCACTAGCAACCTCAAACAGACACCATG...",
    isEditable: false,
    difficulty: "Impossible",
    strategy: "N/A",
    warning: "The Blood-Brain Barrier (BBB) blocks CRISPR delivery. Additionally, HBB is not active in neurons, making this a poor therapeutic target.",
    description: "Cas9 is too large to pass from the blood into the brain without invasive surgery."
  }
  
];