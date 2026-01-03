// src/lib/scoring.ts
import type { Guide, OnTargetScore } from "../types";
import { clamp01, hasPolyT, isSelfComplementary, isSimpleRepeat, maxHomopolymer } from "./sequence";

export type CustomWeightsModel = {
  name: "custom_weights_v1";
  guideLength: 20;
  // simple linear model over features; you can extend later
  weights: Record<string, number>;
  bias: number;
};

export function computeGuideFeatures(protospacer: string) {
  const s = protospacer.toUpperCase();
  const gc = (s.match(/[GC]/g)?.length ?? 0) / s.length;

  const seed12 = s.slice(8, 20); // SpCas9 seed near PAM (PAM-proximal)
  const polyT = hasPolyT(s, 4);
  const hp = maxHomopolymer(s);
  const rep = isSimpleRepeat(s);
  const selfC = isSelfComplementary(s);
  const hasN = s.includes("N");

  return {
    gcFrac: gc,
    hasPolyT: polyT,
    homopolymerMax: hp,
    simpleRepeat: rep,
    selfComplementary: selfC,
    hasN,
    seed12,
  };
}

/**
 * Heuristic 0..100 score that correlates with “reasonable” guides:
 * - GC around 0.45–0.65 good
 * - penalize polyT, long homopolymers, repeats, Ns, self-complementarity
 * This is honest and stable offline.
 */
export function scoreHeuristic(protospacer: string): OnTargetScore {
  const f = computeGuideFeatures(protospacer);

  // GC bell-ish curve
  const gcTarget = 0.55;
  const gcPenalty = Math.abs(f.gcFrac - gcTarget) / 0.45; // ~0..1
  let score = 100 * (1 - clamp01(gcPenalty));

  // penalties
  if (f.hasN) score -= 50;
  if (f.hasPolyT) score -= 18;
  if (f.homopolymerMax >= 6) score -= 20;
  else if (f.homopolymerMax === 5) score -= 10;

  if (f.simpleRepeat) score -= 12;
  if (f.selfComplementary) score -= 10;

  score = Math.max(0, Math.min(100, score));

  return {
    model: "heuristic_v1",
    score,
    details: {
      gcFrac: Number(f.gcFrac.toFixed(3)),
      seed12: f.seed12,
      hasPolyT: f.hasPolyT,
      homopolymerMax: f.homopolymerMax,
      simpleRepeat: f.simpleRepeat,
      selfComplementary: f.selfComplementary,
      hasN: f.hasN,
    },
  };
}

/**
 * Optional: run a user-supplied linear model (weights JSON you provide).
 * You can paste real published coefficients here later without changing the app.
 */
export function scoreWithCustomWeights(protospacer: string, model: CustomWeightsModel): OnTargetScore {
  const f = computeGuideFeatures(protospacer);

  // feature vector
  const feats: Record<string, number> = {
    gcFrac: f.gcFrac,
    hasPolyT: f.hasPolyT ? 1 : 0,
    homopolymerMax: f.homopolymerMax,
    simpleRepeat: f.simpleRepeat ? 1 : 0,
    selfComplementary: f.selfComplementary ? 1 : 0,
    hasN: f.hasN ? 1 : 0,
  };

  let z = model.bias;
  for (const [k, w] of Object.entries(model.weights)) {
    z += (feats[k] ?? 0) * w;
  }

  // squash to 0..100
  const sig = 1 / (1 + Math.exp(-z));
  const score = 100 * sig;

  return {
    model: "custom_weights_v1",
    score: Number(score.toFixed(2)),
    details: { ...feats, z: Number(z.toFixed(3)) },
  };
}

export function attachScores(g: Omit<Guide, "features" | "onTarget" | "warnings"> & { warnings: Guide["warnings"] }): Guide {
  const features = computeGuideFeatures(g.protospacer);
  const onTarget = scoreHeuristic(g.protospacer);
  return { ...g, features, onTarget };
}
