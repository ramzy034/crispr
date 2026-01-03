// src/lib/genomePack.ts
export type GenomePackMeta = {
  id: string;            // e.g. "ecoli_k12"
  label: string;         // "E. coli K-12 (MG1655)"
  version: string;
  sequences: Array<{ name: string; length: number; file: string }>;
};

export type LoadedGenomePack = {
  meta: GenomePackMeta;
  seqs: Array<{ name: string; seq: string }>;
};

export async function loadGenomePack(metaUrl: string): Promise<LoadedGenomePack> {
  const meta = (await (await fetch(metaUrl)).json()) as GenomePackMeta;
  const seqs = [];
  for (const s of meta.sequences) {
    const seq = await (await fetch(s.file)).text();
    seqs.push({ name: s.name, seq: seq.replace(/\s+/g, "").toUpperCase() });
  }
  return { meta, seqs };
}
