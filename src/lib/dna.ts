import type { GuideWarning } from "../types";

export function cleanFasta(input: string): {
  cleaned: string;
  stats: { rawChars: number; cleanedLength: number; removedNonACGTN: number };
  messages: string[];
} {
  const raw = input ?? "";
  const lines = raw.split(/\r?\n/);

  // remove FASTA headers + whitespace
  const noHeaders = lines.filter((l) => !l.trim().startsWith(">")).join("");
  const upper = noHeaders.toUpperCase();

  const rawChars = upper.length;
  let cleaned = "";
  let removed = 0;

  for (const ch of upper) {
    if (ch === "A" || ch === "C" || ch === "G" || ch === "T" || ch === "N") cleaned += ch;
    else if (ch.trim() === "") continue;
    else removed++;
  }

  const messages: string[] = [];
  if (cleaned.length === 0) messages.push("No DNA bases found. Paste A/C/G/T (optionally N) or a FASTA.");
  if (removed > 0) messages.push(`Removed ${removed} non-ACGTN characters (numbers, symbols, etc.).`);
  if (cleaned.length > 0 && cleaned.length < 30)
    messages.push("Sequence is very short. For meaningful deletions, use ~200–1000 bp around your region.");

  return {
    cleaned,
    stats: { rawChars, cleanedLength: cleaned.length, removedNonACGTN: removed },
    messages,
  };
}

export function revcomp(seq: string): string {
  const comp: Record<string, string> = { A: "T", T: "A", C: "G", G: "C", N: "N" };
  return seq
    .toUpperCase()
    .split("")
    .reverse()
    .map((b) => comp[b] ?? "N")
    .join("");
}

export function gcFrac(seq: string): number {
  const s = seq.toUpperCase();
  let gc = 0;
  let valid = 0;
  for (const ch of s) {
    if (ch === "G" || ch === "C") {
      gc++;
      valid++;
    } else if (ch === "A" || ch === "T") valid++;
  }
  return valid === 0 ? 0 : gc / valid;
}

export function hasHomopolymer(seq: string, runLen = 4): boolean {
  const s = seq.toUpperCase();
  let run = 1;
  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) run++;
    else run = 1;
    if (run >= runLen) return true;
  }
  return false;
}

export function hasSimpleRepeat(seq: string): boolean {
  const s = seq.toUpperCase();
  // crude: dinucleotide repeated >= 4 times (8bp)
  for (let i = 0; i + 8 <= s.length; i++) {
    const di = s.slice(i, i + 2);
    if (di.includes("N")) continue;
    const chunk = s.slice(i, i + 8);
    if (chunk === di.repeat(4)) return true;
  }
  return false;
}

export function warningsForGuide(
  guideSeq: string,
  start: number,
  end: number,
  seqLength: number,
  gcMin = 0.3,
  gcMax = 0.8
): GuideWarning[] {
  const warns: GuideWarning[] = [];

  if (start < 0 || end > seqLength) warns.push("TOO_CLOSE_TO_END");

  const gc = gcFrac(guideSeq);
  if (gc < gcMin) warns.push("LOW_GC");
  if (gc > gcMax) warns.push("HIGH_GC");

  if (hasHomopolymer(guideSeq, 4)) warns.push("HOMOPOLYMER");
  if (hasSimpleRepeat(guideSeq)) warns.push("SIMPLE_REPEAT");

  return warns;
}
