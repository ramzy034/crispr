import type { Guide, PairInfo } from "../types";

export function buildPairInfo(g1: Guide, g2: Guide, seqLength: number): PairInfo {
  const cutLeft = Math.min(g1.cut, g2.cut);
  const cutRight = Math.max(g1.cut, g2.cut);
  const deletionBp = Math.max(0, cutRight - cutLeft);

  const orientation: PairInfo["orientation"] =
    g1.strand === g2.strand ? "parallel" : "opposed";

  const notes: string[] = [];
  if (deletionBp < 30) notes.push("Very small deletion — may behave more like a short indel.");
  if (deletionBp > seqLength) notes.push("Cut span exceeds sequence length (check coordinate logic).");
  if (orientation === "opposed") notes.push("Opposed strands can reduce ideal paired-cut geometry in some designs.");

  return { g1, g2, deletionBp, cutLeft, cutRight, orientation, notes };
}
