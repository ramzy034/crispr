// src/lib/sequence.ts
export function revComp(seq: string): string {
  const map: Record<string, string> = { A: "T", T: "A", C: "G", G: "C", N: "N" };
  const s = seq.toUpperCase();
  let out = "";
  for (let i = s.length - 1; i >= 0; i--) out += map[s[i]] ?? "N";
  return out;
}

export function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

export function hasPolyT(seq: string, run = 4) {
  return /TTTT/.test(seq.toUpperCase()) || new RegExp(`T{${run},}`).test(seq.toUpperCase());
}

export function maxHomopolymer(seq: string): number {
  const s = seq.toUpperCase();
  let best = 1;
  let cur = 1;
  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) cur++;
    else cur = 1;
    best = Math.max(best, cur);
  }
  return best;
}

export function isSimpleRepeat(seq: string): boolean {
  const s = seq.toUpperCase();
  // lightweight “repeat-ish” detector: dinucleotide repeats or low complexity
  const dinucs = ["AT", "TA", "AC", "CA", "AG", "GA", "CT", "TC", "CG", "GC", "GT", "TG"];
  for (const d of dinucs) {
    if (s.includes(d.repeat(4))) return true;
  }
  // many of same base
  if (maxHomopolymer(s) >= 6) return true;
  return false;
}

// very lightweight self-complementarity check (not full folding)
export function isSelfComplementary(seq: string): boolean {
  const s = seq.toUpperCase();
  const rc = revComp(s);
  // if it contains a 6-mer that also appears in rc, it may form hairpins
  const k = 6;
  const set = new Set<string>();
  for (let i = 0; i <= s.length - k; i++) set.add(s.slice(i, i + k));
  for (let i = 0; i <= rc.length - k; i++) {
    if (set.has(rc.slice(i, i + k))) return true;
  }
  return false;
}
