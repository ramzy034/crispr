// src/lib/offtargets.ts
import type { Guide, OffTargetHit, SpecificityScore } from "../types";
import { revComp } from "./sequence";

/**
 * BIOLOGICAL PRINCIPLE: The "Seed" Region.
 * Mismatches in the 10-12bp closest to the PAM (the 3' end) 
 * are much more disruptive to Cas9 binding than mismatches 
 * at the 5' end.
 */
type SearchSpace = {
  name: string;
  seq: string; // sequence in + orientation
};

export type OffTargetOptions = {
  maxMismatches: number;
  includeReverseStrand: boolean;
  maxHitsPerGuide: number;
};

export function findOffTargetsLocal(
  guide: Guide,
  spaces: SearchSpace[],
  opts: OffTargetOptions
): OffTargetHit[] {
  const g = guide.protospacer.toUpperCase();
  const hits: OffTargetHit[] = [];

  for (const sp of spaces) {
    const plus = sp.seq.toUpperCase();
    hits.push(...scanOneSpace(g, sp.name, plus, "+", opts));

    if (opts.includeReverseStrand) {
      const minusSeq = revComp(plus);
      hits.push(...scanOneSpace(g, sp.name, minusSeq, "-", opts));
    }

    if (hits.length >= opts.maxHitsPerGuide) break;
  }

  // Filter out the exact on-target hit so we only report "off-targets"
  return hits
    .filter(h => h.mismatches > 0) 
    .slice(0, opts.maxHitsPerGuide);
}

function scanOneSpace(
  guideSeq: string,
  spaceName: string,
  seq: string,
  strand: "+" | "-",
  opts: OffTargetOptions
): OffTargetHit[] {
  const hits: OffTargetHit[] = [];
  const L = guideSeq.length;

  const pamOk = (pam: string) => pam.length === 3 && pam[1] === "G" && pam[2] === "G";

  for (let i = 0; i <= seq.length - (L + 3); i++) {
    const prot = seq.slice(i, i + L);
    const pam = seq.slice(i + L, i + L + 3);

    if (!pamOk(pam)) continue;

    const mismatches = getMismatchData(guideSeq, prot);
    
    if (mismatches.count > opts.maxMismatches) continue;

    hits.push({
      locus: `${spaceName}:${i}-${i + L}(${strand})`,
      mismatches: mismatches.count,
      alignment: { 
        guide: guideSeq, 
        target: prot, 
        pam, 
        matchLine: mismatches.line 
      },
      cut: i + 17,
    });

    if (hits.length >= opts.maxHitsPerGuide) break;
  }

  return hits;
}

/**
 * Returns detailed mismatch info including a "match line" 
 * and identifies where the mismatches occur.
 */
function getMismatchData(a: string, b: string) {
  let count = 0;
  let line = "";
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      count++;
      line += "x"; // mismatch
    } else {
      line += "|"; // match
    }
  }
  return { count, line };
}

/**
 * ADVANCED SCORING: 
 * Instead of a flat penalty, we weight based on mismatch position.
 * Mismatches at the end of the guide (near PAM) are "better" because
 * they reduce the risk of accidental off-target cutting.
 */
export function computeSpecificity(hits: OffTargetHit[]): SpecificityScore {
  let totalPenalty = 0;
  let worst: OffTargetHit | null = null;

  for (const h of hits) {
    let hitPenalty = 0;
    const { guide, target } = h.alignment;

    for (let i = 0; i < guide.length; i++) {
      if (guide[i] !== target[i]) continue;

      // Penalize more if the target is identical to the guide.
      // Index 0 is far from PAM, Index 19 is adjacent to PAM.
      const weight = (i / guide.length); // 0.0 to 1.0
      hitPenalty += weight;
    }

    // A 0-mismatch hit (on-target) would be very high penalty
    // A 3-mismatch hit far from PAM is a medium penalty
    totalPenalty += (1 / (h.mismatches + 0.5)) * 10;

    if (!worst || h.mismatches < worst.mismatches) worst = h;
  }

  const finalScore = Math.max(0, 100 - totalPenalty);

  return {
    method: "seed_weighted_local_v2",
    score: Number(finalScore.toFixed(1)),
    hitCount: hits.length,
    worstHit: worst,
  };
}