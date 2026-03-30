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
  const H = 140; // Increased height for clearer strand separation
  const pad = 40;

  const xFor = (pos: number) => {
    if (seqLength <= 1) return pad;
    const t = pos / (seqLength - 1);
    return pad + t * (W - 2 * pad);
  };

  const selected = (id: string) => selectedIds.includes(id);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Sequence View</h3>
        <div style={{ display: 'flex', gap: '15px', fontSize: '11px', opacity: 0.7 }}>
          <span><span style={{ color: '#60A5FA' }}>●</span> Forward Strand (+)</span>
          <span><span style={{ color: '#F87171' }}>●</span> Reverse Strand (-)</span>
        </div>
      </div>

      <div className="trackWrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="trackSvg" role="img" aria-label="Guide positions on sequence">
          {/* Subtle Background Strands */}
          <line x1={pad} y1={H / 2 - 14} x2={W - pad} y2={H / 2 - 14} stroke="#60A5FA" strokeOpacity={0.1} strokeWidth="1" />
          <line x1={pad} y1={H / 2 + 14} x2={W - pad} y2={H / 2 + 14} stroke="#F87171" strokeOpacity={0.1} strokeWidth="1" />

          {/* Central Baseline */}
          <line x1={pad} y1={H / 2} x2={W - pad} y2={H / 2} stroke="currentColor" strokeOpacity={0.2} strokeWidth="1" />

          {/* Scale Ticks */}
          {[0, Math.floor(seqLength * 0.25), Math.floor(seqLength * 0.5), Math.floor(seqLength * 0.75), seqLength - 1]
            .filter((v, idx, arr) => arr.indexOf(v) === idx && v >= 0)
            .map((v) => (
              <g key={v}>
                <line x1={xFor(v)} y1={H / 2 - 5} x2={xFor(v)} y2={H / 2 + 5} stroke="currentColor" strokeOpacity={0.3} />
                <text x={xFor(v)} y={H / 2 + 35} textAnchor="middle" fontSize="10" fill="currentColor" opacity={0.5} style={{ fontFamily: 'monospace' }}>
                  {v}bp
                </text>
              </g>
            ))}

          {/* DELETION REGION: Animated Glow for better visualization */}
          {pair && (
            <g>
              <rect
                x={xFor(pair.cutLeft)}
                y={H / 2 - 25}
                width={Math.max(2, xFor(pair.cutRight) - xFor(pair.cutLeft))}
                height={50}
                fill="#7C3AED"
                opacity={0.15}
                rx={4}
              />
              <line 
                x1={xFor(pair.cutLeft)} y1={H / 2 - 25} x2={xFor(pair.cutLeft)} y2={H / 2 + 25} 
                stroke="#A78BFA" strokeWidth="2" strokeDasharray="4 2"
              />
              <line 
                x1={xFor(pair.cutRight)} y1={H / 2 - 25} x2={xFor(pair.cutRight)} y2={H / 2 + 25} 
                stroke="#A78BFA" strokeWidth="2" strokeDasharray="4 2"
              />
            </g>
          )}

          {/* GUIDES: Interactive dots with strand coloring */}
          {guides.map((g) => {
            const x = xFor(g.cut);
            const isSel = selected(g.id);
            const r = isSel ? 8 : 5;
            const y = g.strand === "+" ? H / 2 - 14 : H / 2 + 14;
            const color = g.strand === "+" ? "#60A5FA" : "#F87171";
            
            // Researchers want to see "problematic" guides immediately
            const hasWarnings = g.warnings && g.warnings.length > 0;

            return (
              <g key={g.id} onClick={() => onSelectGuide(g.id)} style={{ cursor: "pointer" }}>
                {/* Warning Halo */}
                {hasWarnings && !isSel && (
                  <circle cx={x} cy={y} r={r + 3} fill="#FBBF24" opacity={0.2} />
                )}
                
                {/* Main Guide Dot */}
                <circle 
                  cx={x} cy={y} r={r} 
                  fill={isSel ? "#FFF" : color} 
                  stroke={isSel ? color : "none"}
                  strokeWidth={2}
                  opacity={isSel ? 1 : 0.7} 
                />
                
                {isSel && (
                  <g>
                    <text x={x} y={y + (g.strand === "+" ? -12 : 22)} textAnchor="middle" fontSize="11" fontWeight="bold" fill={color}>
                      {g.id}
                    </text>
                    {/* Visual indicator of the cut direction */}
                    <path 
                      d={g.strand === "+" ? `M ${x} ${y} L ${x-5} ${y-10}` : `M ${x} ${y} L ${x+5} ${y+10}`} 
                      stroke={color} strokeWidth="1.5" opacity={0.5}
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ marginTop: '10px', display: 'flex', gap: '20px' }}>
        <p className="muted small" style={{ margin: 0 }}>
          <span style={{ color: '#FBBF24' }}>●</span> Halo indicates design warnings (Self-complementarity, etc).
        </p>
        <p className="muted small" style={{ margin: 0 }}>
          Distance between {selectedIds[0] || '?'} and {selectedIds[1] || '?'} is <strong>{pair ? pair.cutRight - pair.cutLeft : 0} bp</strong>.
        </p>
      </div>
    </div>
  );
}