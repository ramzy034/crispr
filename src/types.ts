// src/types.ts
export type Strand = "+" | "-";

export type GuideWarning =
  | "LOW_GC"
  | "HIGH_GC"
  | "HOMOPOLYMER"
  | "SIMPLE_REPEAT"
  | "TOO_CLOSE_TO_END"
  | "POLY_T"
  | "HAS_N"
  | "SELF_COMPLEMENTARY"
  | "BAD_SEED"
  | "HAIRPIN_POTENTIAL" // Enhanced: Warns if gRNA folds on itself
  | "OFF_TARGET_RISK";   // Enhanced: Visual flag for low specificity

export type Nuclease =
  | "SpCas9_NGG"
  | "SpCas9_NAG"
  | "SaCas9_NNGRRT"
  | "AsCas12a_TTTN";

export type EditingGoal =
  | "knockout"
  | "deletion_pair"
  | "knockin_hdr"
  | "crispra"
  | "crispri";

export type GuideFeatures = {
  gcFrac: number;
  hasPolyT: boolean;
  hasN: boolean;
  homopolymerMax: number;
  simpleRepeat: boolean;
  selfComplementary: boolean;
  seed12: string; // PAM-proximal seed
  tm?: number;    // Enhanced: Melting temperature for annealing
};

export type OnTargetScore = {
  model: "heuristic_v1" | "custom_weights_v1" | "azimuth_v2_approx";
  score: number; // 0..100
  details: Record<string, number | string | boolean>;
};

export type OffTargetHit = {
  locus: string;
  mismatches: number;
  bulge?: "dna" | "rna" | null;
  alignment: {
    guide: string;
    target: string;
    pam: string;
    matchLine: string;
  };
  cut: number;
  cfdScore?: number; // Enhanced: Industry standard CFD scoring (0..1)
};

export type SpecificityScore = {
  /** * ✅ FIXED: Added "seed_weighted_local_v2" to resolve the TS error 
   */
  method: "local_mismatch_sum_v1" | "seed_weighted_local_v2" | "cfd_sum_v1";
  score: number; // 0..100
  hitCount: number;
  worstHit?: OffTargetHit | null;
};

export type Guide = {
  id: string;
  nuclease: Nuclease;
  strand: Strand;
  start: number;
  end: number;
  pam: string;
  protospacer: string;
  cut: number;

  warnings: GuideWarning[];

  /** ✅ Backwards-compatible field (your UI currently uses g.gcFrac everywhere) */
  gcFrac: number;

  /** CHOPCHOP-style structured features */
  features: GuideFeatures;

  onTarget: OnTargetScore;
  specificity?: SpecificityScore;

  offTargets?: OffTargetHit[];
  rank?: number;
};

export type PairInfo = {
  g1: Guide;
  g2: Guide;

  deletionBp: number;
  cutLeft: number;
  cutRight: number;
  orientation: "parallel" | "opposed";

  notes: string[];

  // Enhanced: More detailed PCR validation types
  pcr?: {
    suggestedAmpliconBp: number;
    wtAmpliconBp: number; // The size of the DNA before deletion
    leftPrimerHint: { start: number; end: number; seq: string; tm: number };
    rightPrimerHint: { start: number; end: number; seq: string; tm: number };
  };
};