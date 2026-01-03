// src/lib/offtargetRunner.ts
import type { Guide } from "../types";
import { findOffTargetsLocal, computeSpecificity } from "./offtargets";
import type { LoadedGenomePack } from "./genomePack";

export async function enrichGuidesWithOffTargets(params: {
  guides: Guide[];
  inputSeq: string;
  pack?: LoadedGenomePack | null;
  maxMismatches?: number;
  maxHitsPerGuide?: number;
}): Promise<Guide[]> {
  const {
    guides,
    inputSeq,
    pack,
    maxMismatches = 3,
    maxHitsPerGuide = 50,
  } = params;

  const spaces = [
    { name: "input", seq: inputSeq },
    ...(pack
      ? pack.seqs.map((s) => ({ name: `pack:${pack.meta.id}:${s.name}`, seq: s.seq }))
      : []),
  ];

  return guides.map((g) => {
    const hits = findOffTargetsLocal(g, spaces, {
      maxMismatches,
      includeReverseStrand: true,
      maxHitsPerGuide,
    });

    const spec = computeSpecificity(hits, maxMismatches);

    return {
      ...g,
      offTargets: hits,
      specificity: spec,
    };
  });
}
