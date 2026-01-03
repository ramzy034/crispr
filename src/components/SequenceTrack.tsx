import type { Guide, PairInfo } from "../types";

export default function SequenceTrack(props: {
  seqLength: number;
  guides: Guide[];
  selectedIds: (string | null)[];
  onSelectGuide: (id: string) => void;
  pair: PairInfo | null;
}) {
  const { seqLength, guides, selectedIds, onSelectGuide, pair } = props;
  const W = 820;
  const H = 120;
  const pad = 40;

  const xFor = (pos: number) => {
    if (seqLength <= 1) return pad;
    const t = pos / (seqLength - 1);
    return pad + t * (W - 2 * pad);
  };

  const selected = (id: string) => selectedIds.includes(id);

  return (
    <div className="card">
      <h3>Sequence View</h3>

      <div className="trackWrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="trackSvg" role="img" aria-label="Guide positions on sequence">
          {/* baseline */}
          <line x1={pad} y1={H / 2} x2={W - pad} y2={H / 2} stroke="currentColor" strokeOpacity={0.35} strokeWidth="2" />

          {/* ticks */}
          {[0, Math.floor(seqLength * 0.25), Math.floor(seqLength * 0.5), Math.floor(seqLength * 0.75), seqLength - 1]
            .filter((v, idx, arr) => arr.indexOf(v) === idx && v >= 0)
            .map((v) => (
              <g key={v}>
                <line x1={xFor(v)} y1={H / 2 - 16} x2={xFor(v)} y2={H / 2 - 6} stroke="currentColor" strokeOpacity={0.35} />
                <text x={xFor(v)} y={H / 2 - 22} textAnchor="middle" fontSize="10" fill="currentColor" opacity={0.6}>
                  {v}
                </text>
              </g>
            ))}

          {/* deletion region */}
          {pair && (
            <rect
              x={xFor(pair.cutLeft)}
              y={H / 2 - 10}
              width={Math.max(2, xFor(pair.cutRight) - xFor(pair.cutLeft))}
              height={20}
              fill="currentColor"
              opacity={0.12}
              rx={6}
            />
          )}

          {/* guides */}
          {guides.map((g) => {
            const x = xFor(g.cut);
            const r = selected(g.id) ? 7 : 5;
            const y = g.strand === "+" ? H / 2 - 14 : H / 2 + 14;

            return (
              <g key={g.id} onClick={() => onSelectGuide(g.id)} style={{ cursor: "pointer" }}>
                <circle cx={x} cy={y} r={r} fill="currentColor" opacity={selected(g.id) ? 0.9 : 0.55} />
                {selected(g.id) && (
                  <text x={x} y={y + (g.strand === "+" ? -10 : 20)} textAnchor="middle" fontSize="10" fill="currentColor" opacity={0.8}>
                    {g.id}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <p className="muted small">
        Click dots to select guides. Shaded region = predicted deletion between cut sites.
      </p>
    </div>
  );
}
