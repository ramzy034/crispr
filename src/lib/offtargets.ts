// src/lib/offtargets.ts
import type { Guide, OffTargetHit, SpecificityScore } from "../types";
import { revComp } from "./sequence";

type SearchSpace = {
  name: string;          // "input" or "pack:hg38:chr1"
  seq: string;           // sequence in + orientation
};

export type OffTargetOptions = {
  maxMismatches: number;         // e.g. 3
  includeReverseStrand: boolean; // true
  maxHitsPerGuide: number;       // e.g. 50
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
    hits.push(...scanOneSpace(g, guide, sp.name, plus, "+", opts));

    if (opts.includeReverseStrand) {
      const minusSeq = revComp(plus);
      hits.push(...scanOneSpace(g, guide, sp.name, minusSeq, "-", opts));
    }

    if (hits.length >= opts.maxHitsPerGuide) break;
  }

  // remove perfect on-target if it's inside "input" and at same start (optional)
  // keep all for transparency, but you can filter in UI.

  return hits.slice(0, opts.maxHitsPerGuide);
}

function scanOneSpace(
  guideSeq: string,
  guide: Guide,
  spaceName: string,
  seq: string,
  strand: "+" | "-",
  opts: OffTargetOptions
): OffTargetHit[] {
  const hits: OffTargetHit[] = [];
  const L = guideSeq.length;

  // For SpCas9 NGG: we expect PAM adjacent to protospacer on target.
  // In your app, you already know PAM from scan; for off-target we’ll accept NGG only.
  const pamOk = (pam: string) => pam.length === 3 && pam[1] === "G" && pam[2] === "G";

  for (let i = 0; i <= seq.length - (L + 3); i++) {
    const prot = seq.slice(i, i + L);
    const pam = seq.slice(i + L, i + L + 3);

    if (!pamOk(pam)) continue;

    const mm = countMismatches(guideSeq, prot);
    if (mm > opts.maxMismatches) continue;

    const matchLine = buildMatchLine(guideSeq, prot);
    const cut = estimateSpCas9Cut(i, strand); // approx: +3 bp upstream of PAM on target strand

    hits.push({
      locus: `${spaceName}:${i}-${i + L}(${strand})`,
      mismatches: mm,
      alignment: { guide: guideSeq, target: prot, pam, matchLine },
      cut,
    });

    if (hits.length >= opts.maxHitsPerGuide) break;
  }

  return hits;
}

function estimateSpCas9Cut(start: number, strand: "+" | "-") {
  // This is schematic; your main pair logic uses reference coords.
  // For local off-target display, keep it simple:
  // cut site ~ start + 17 (3bp upstream of PAM on the target strand)
  // For the reverse strand space we still report local index.
  return start + 17;
}

function countMismatches(a: string, b: string) {
  let mm = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) mm++;
  return mm;
}

function buildMatchLine(a: string, b: string) {
  let out = "";
  for (let i = 0; i < a.length; i++) out += a[i] === b[i] ? "|" : "x";
  return out;
}

export function computeSpecificity(hits: OffTargetHit[], maxMm: number): SpecificityScore {
  // Simple “mismatch-weighted sum”: fewer hits and higher mismatches => higher specificity.
  // Not claiming to be CFD. It’s honest offline.
  let penalty = 0;
  let worst: OffTargetHit | null = null;

  for (const h of hits) {
    const w = (maxMm + 1 - h.mismatches); // mm=0 -> big penalty, mm=maxMm -> small
    penalty += w * w;
    if (!worst || h.mismatches < worst.mismatches) worst = h;
  }

  // map penalty to 0..100
  const score = Math.max(0, 100 - Math.min(100, penalty));

  return {
    method: "local_mismatch_sum_v1",
    score: Number(score.toFixed(1)),
    hitCount: hits.length,
    worstHit: worst,
  };
}
