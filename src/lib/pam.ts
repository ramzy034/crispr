// src/lib/pam.ts
import type {
  Guide,
  GuideWarning,
  Strand,
  GuideFeatures,
  OnTargetScore,
  Nuclease,
} from "../types";

function gcFrac(seq: string) {
  if (!seq.length) return 0;
  let gc = 0;
  for (const c of seq) if (c === "G" || c === "C") gc++;
  return gc / seq.length;
}

function revComp(dna: string) {
  const comp: Record<string, string> = { A: "T", T: "A", C: "G", G: "C", N: "N" };
  return dna
    .split("")
    .reverse()
    .map((b) => comp[b] ?? "N")
    .join("");
}

function maxHomopolymerRun(seq: string) {
  let best = 1;
  let run = 1;
  for (let i = 1; i < seq.length; i++) {
    if (seq[i] === seq[i - 1]) run++;
    else run = 1;
    if (run > best) best = run;
  }
  return seq.length ? best : 0;
}

function isSimpleRepeat(seq: string) {
  // very basic repeat heuristics (offline-friendly)
  if (/^(AT)+/.test(seq) || /^(TA)+/.test(seq) || /^(CG)+/.test(seq) || /^(GC)+/.test(seq)) return true;

  // repeated 2-mer across most of the guide (e.g., ACACAC...)
  const two = seq.slice(0, 2);
  if (two.length === 2) {
    const built = two.repeat(Math.ceil(seq.length / 2)).slice(0, seq.length);
    if (built === seq) return true;
  }

  // repeated 3-mer (e.g., GTCGTC...)
  const three = seq.slice(0, 3);
  if (three.length === 3) {
    const built = three.repeat(Math.ceil(seq.length / 3)).slice(0, seq.length);
    if (built === seq) return true;
  }

  return false;
}

function isSelfComplementary(seq: string) {
  // simple hairpin risk proxy: any 6-mer appears in the reverse complement
  const rc = revComp(seq);
  const k = 6;
  const seen = new Set<string>();
  for (let i = 0; i <= seq.length - k; i++) seen.add(seq.slice(i, i + k));
  for (let i = 0; i <= rc.length - k; i++) {
    if (seen.has(rc.slice(i, i + k))) return true;
  }
  // also flag perfect palindromic 4-mers
  for (let i = 0; i <= seq.length - 4; i++) {
    const kmer = seq.slice(i, i + 4);
    if (revComp(kmer) === kmer) return true;
  }
  return false;
}

// SpCas9: PAM-proximal seed is typically the last 10–12 nt of the protospacer (3' end).
function seed12(protospacer: string) {
  return protospacer.length >= 12 ? protospacer.slice(protospacer.length - 12) : protospacer;
}

function buildFeatures(protospacer: string): GuideFeatures {
  const gc = gcFrac(protospacer);
  const hasPolyT = /T{4,}/.test(protospacer);
  const hasN = /N/.test(protospacer);
  const homopolymerMax = maxHomopolymerRun(protospacer);
  const simpleRepeat = isSimpleRepeat(protospacer);
  const selfComplementary = isSelfComplementary(protospacer);
  return {
    gcFrac: gc,
    hasPolyT,
    hasN,
    homopolymerMax,
    simpleRepeat,
    selfComplementary,
    seed12: seed12(protospacer),
  };
}

function addWarnings(
  protospacer: string,
  features: GuideFeatures,
  start: number,
  seqLen: number
): GuideWarning[] {
  const w: GuideWarning[] = [];

  if (features.gcFrac < 0.30) w.push("LOW_GC");
  if (features.gcFrac > 0.80) w.push("HIGH_GC");

  if (features.homopolymerMax >= 4) w.push("HOMOPOLYMER");
  if (features.simpleRepeat) w.push("SIMPLE_REPEAT");

  // too close to ends (need 20 + PAM)
  if (start < 0 || start + 23 > seqLen) w.push("TOO_CLOSE_TO_END");

  if (features.hasPolyT) w.push("POLY_T"); // can terminate Pol III (U6/T7) transcription
  if (features.hasN) w.push("HAS_N");
  if (features.selfComplementary) w.push("SELF_COMPLEMENTARY");

  // crude “bad seed” proxy: ambiguous base in seed or extreme homopolymer near PAM
  if (features.seed12.includes("N") || /A{5,}|T{5,}|C{5,}|G{5,}/.test(features.seed12)) {
    w.push("BAD_SEED");
  }

  return w;
}

function scoreOnTarget(protospacer: string, features: GuideFeatures, warnings: GuideWarning[]): OnTargetScore {
  // Offline-friendly heuristic score (NOT a full CHOPCHOP/Doench model)
  // Goal: a stable, interpretable 0..100 ranking for teaching + light filtering.

  let score = 100;

  // GC close to ~0.5 tends to be good; penalize distance
  const gcPenalty = Math.abs(features.gcFrac - 0.5) * 120; // 0..60ish
  score -= gcPenalty;

  // Penalize risks
  if (features.hasN) score -= 40;
  if (features.hasPolyT) score -= 12;
  if (features.simpleRepeat) score -= 10;
  if (features.selfComplementary) score -= 12;

  // Homopolymers: scale penalty
  if (features.homopolymerMax >= 4) score -= (features.homopolymerMax - 3) * 6;

  // If flagged too close to ends, make it basically unusable
  if (warnings.includes("TOO_CLOSE_TO_END")) score -= 50;

  // clamp
  score = Math.max(0, Math.min(100, score));

  return {
    model: "heuristic_v1",
    score,
    details: {
      gcFrac: Number(features.gcFrac.toFixed(3)),
      gcPenalty: Number(gcPenalty.toFixed(1)),
      hasPolyT: features.hasPolyT,
      hasN: features.hasN,
      homopolymerMax: features.homopolymerMax,
      simpleRepeat: features.simpleRepeat,
      selfComplementary: features.selfComplementary,
    },
  };
}

// SpCas9 cuts ~3 bp upstream of PAM on the target strand.
function cutSite(strand: Strand, start: number, pamStartOnPlus: number) {
  // + strand: protospacer [start..start+19], PAM [start+20..start+22], cut at start+17
  // - strand: we see CCN on +, PAM on - is NGG; cut maps to + as pamStart+3
  return strand === "+" ? start + 17 : pamStartOnPlus + 3;
}

export function findSpCas9NGG(seq: string): Guide[] {
  const s = seq.toUpperCase();
  const guides: Guide[] = [];
  let idCounter = 1;

  const nuclease: Nuclease = "SpCas9_NGG";

  // + strand: look for NGG at i..i+2, protospacer is i-20..i-1
  for (let i = 0; i <= s.length - 3; i++) {
    const pam = s.slice(i, i + 3);
    if (pam[1] === "G" && pam[2] === "G") {
      const start = i - 20;
      if (start < 0) continue;

      const protospacer = s.slice(start, i);
      const features = buildFeatures(protospacer);
      const warnings = addWarnings(protospacer, features, start, s.length);
      const onTarget = scoreOnTarget(protospacer, features, warnings);

      const g: Guide = {
        id: `g+${idCounter++}`,
        nuclease,
        strand: "+" as const,
        start,
        end: start + 20,
        pam,
        protospacer,
        cut: cutSite("+", start, i),

        warnings,

        // ✅ keep BOTH (so your existing UI works)
        gcFrac: features.gcFrac,
        features,

        onTarget,
      };

      guides.push(g);
    }
  }

  // - strand: on + reference we see CCN, corresponding PAM on - is NGG
  for (let i = 0; i <= s.length - 3; i++) {
    const trip = s.slice(i, i + 3);
    if (trip[0] === "C" && trip[1] === "C") {
      const pamOnMinus = revComp(trip); // becomes NGG-like

      // protospacer is downstream on +: i+3..i+23, reverse-complement gives guide 5'->3'
      const start = i + 3;
      const end = i + 23;
      if (end > s.length) continue;

      const protospacerPlus = s.slice(start, end);
      const protospacer = revComp(protospacerPlus);

      const features = buildFeatures(protospacer);
      const warnings = addWarnings(protospacer, features, start, s.length);
      const onTarget = scoreOnTarget(protospacer, features, warnings);

      const g: Guide = {
        id: `g-${idCounter++}`,
        nuclease,
        strand: "-" as const,
        start,
        end: start + 20,
        pam: pamOnMinus,
        protospacer,
        cut: cutSite("-", start, i),

        warnings,

        // ✅ keep BOTH
        gcFrac: features.gcFrac,
        features,

        onTarget,
      };

      guides.push(g);
    }
  }

  return guides;
}
