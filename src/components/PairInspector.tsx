import type { PairInfo } from "../types";

/**
 * Calculates a "Feasibility Score" based on biological best practices:
 * - Ideal GC content (40-60%)
 * - Lack of warnings (Self-complementarity, poly-T, etc.)
 * - Optimal deletion size (Not too small, not too large)
 */
function calculateFeasibility(pair: PairInfo) {
  let score = 100;
  
  // GC Content Penalties
  [pair.g1, pair.g2].forEach(g => {
    const gc = g.gcFrac * 100;
    if (gc < 30 || gc > 75) score -= 15;
    else if (gc < 40 || gc > 60) score -= 5;
    
    // Warning Penalties
    score -= (g.warnings.length * 10);
  });

  // Deletion Size Heuristics
  if (pair.deletionBp < 10) score -= 20; // Too small for standard detection
  if (pair.deletionBp > 1000) score -= 10; // Large deletions have lower efficiency

  return Math.max(0, score);
}

export default function PairInspector(props: { pair: PairInfo | null; seqLength: number }) {
  const { pair, seqLength } = props;

  if (!pair) {
    return (
      <div className="card empty-state">
        <h3>Selected Guide Pair</h3>
        <p className="muted">Select two guides from the table or sequence view to calculate deletion feasibility.</p>
      </div>
    );
  }

  const feasibility = calculateFeasibility(pair);
  const statusColor = feasibility > 70 ? "#4ADE80" : feasibility > 40 ? "#FBBF24" : "#F87171";

  return (
    <div className="card inspector-card">
      <div className="inspector-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ margin: 0 }}>Strategy Analysis</h3>
          <span className="badge" style={{ background: `${statusColor}22`, color: statusColor, fontSize: '12px', padding: '4px 8px', borderRadius: '4px', border: `1px solid ${statusColor}` }}>
            {pair.orientation.toUpperCase()} ORIENTATION
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>FEASIBILITY SCORE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: statusColor }}>{feasibility}%</div>
        </div>
      </div>

      {/* Primary Metrics Bar */}
      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="metric-box" style={{ background: '#111827', padding: '1rem', borderRadius: '8px', border: '1px solid #374151' }}>
          <div className="small-label" style={{ fontSize: '10px', opacity: 0.5, letterSpacing: '0.05em' }}>PREDICTED DELETION</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{pair.deletionBp} <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>bp</span></div>
        </div>
        <div className="metric-box" style={{ background: '#111827', padding: '1rem', borderRadius: '8px', border: '1px solid #374151' }}>
          <div className="small-label" style={{ fontSize: '10px', opacity: 0.5, letterSpacing: '0.05em' }}>GENOMIC CONTEXT</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{seqLength} <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>bp total</span></div>
        </div>
      </div>

      <div className="pair-comparison" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <GuideDetail guide={pair.g1} label="Guide 1 (Upstream)" />
        <GuideDetail guide={pair.g2} label="Guide 2 (Downstream)" />
      </div>

      {/* Technical Notes & Biological Context */}
      <div className="inspector-footer" style={{ borderTop: '1px solid #374151', paddingTop: '1rem' }}>
        <div className="muted small">
          <p style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#E5E7EB' }}>Biological Interpretation:</strong> 
            {pair.deletionBp < 30 ? " This is a very small deletion and may behave like a short indel during NHEJ repair." : 
             pair.deletionBp > 500 ? " Large fragment excision requires high efficiency from both guides simultaneously." : 
             " This span is ideal for standard PCR screening and gel electrophoresis verification."}
          </p>
          
          {pair.notes.length > 0 && (
            <ul style={{ paddingLeft: '1.2rem', color: '#FBBF24' }}>
              {pair.notes.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function GuideDetail({ guide, label }: { guide: any, label: string }) {
  const gc = Math.round(guide.gcFrac * 100);
  const gcColor = (gc < 40 || gc > 60) ? "#FBBF24" : "#4ADE80";

  return (
    <div className="subcard" style={{ flex: 1, background: '#1F2937', padding: '1rem', borderRadius: '8px' }}>
      <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.9rem', color: '#9CA3AF' }}>{label}</h4>
      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>ID: {guide.id}</div>
      
      <div className="guide-stats" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ opacity: 0.6 }}>Strand:</span>
          <span style={{ color: guide.strand === '+' ? '#60A5FA' : '#F87171' }}>{guide.strand === '+' ? 'Sense (+)' : 'Antisense (-)'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ opacity: 0.6 }}>Cut Position:</span>
          <span>{guide.cut} bp</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ opacity: 0.6 }}>GC Content:</span>
          <span style={{ color: gcColor }}>{gc}%</span>
        </div>
        
        {guide.warnings.length > 0 ? (
          <div style={{ marginTop: '0.5rem', color: '#FCA5A5', fontSize: '0.75rem', padding: '4px', background: '#451a1a', borderRadius: '4px' }}>
            ⚠️ {guide.warnings.join(", ")}
          </div>
        ) : (
          <div style={{ marginTop: '0.5rem', color: '#4ADE80', fontSize: '0.75rem' }}>
            ✓ No design warnings
          </div>
        )}
      </div>
    </div>
  );
}