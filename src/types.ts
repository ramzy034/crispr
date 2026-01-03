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
  | "BAD_SEED";

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
};

export type OnTargetScore = {
  model: "heuristic_v1" | "custom_weights_v1";
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
  cfdLike?: number;
};

export type SpecificityScore = {
  method: "local_mismatch_sum_v1";
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

  pcr?: {
    suggestedAmpliconBp: number;
    leftPrimerHint: { start: number; end: number };
    rightPrimerHint: { start: number; end: number };
  };
};
