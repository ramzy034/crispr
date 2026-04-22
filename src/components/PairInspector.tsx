import type { PairInfo } from "../types";
import type { GuideWarning } from "../types";

const WARNING_SHORT: Record<GuideWarning, string> = {
  LOW_GC: "Low GC",
  HIGH_GC: "High GC",
  HOMOPOLYMER: "Homopolymer",
  SIMPLE_REPEAT: "Simple repeat",
  TOO_CLOSE_TO_END: "Near boundary",
  POLY_T: "PolyT run",
  HAS_N: "Ambiguous N",
  SELF_COMPLEMENTARY: "Self-complementary",
  BAD_SEED: "Bad seed region",
  HAIRPIN_POTENTIAL: "Hairpin risk",
  OFF_TARGET_RISK: "Off-target risk",
};

export default function PairInspector(props: { pair: PairInfo | null; seqLength: number; feasibility: number | null }) {
  const { pair, seqLength, feasibility } = props;

  if (!pair) {
    return (
      <div className="card empty-state">
        <h3>Selected Guide Pair</h3>
        <p className="muted">Select two guides from the table or sequence view to calculate deletion feasibility.</p>
      </div>
    );
  }

  const statusColor = feasibility == null ? "#4fc3f7"
    : feasibility > 70 ? "#69f0ae"
    : feasibility > 40 ? "#ffca28"
    : "#ef5350";

  return (
    <div className="card inspector-card">
      <div className="inspector-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <h3 style={{ margin: 0 }}>Strategy Analysis</h3>
          <span className="badge" style={{ background: `${statusColor}22`, color: statusColor, fontSize: "12px", padding: "4px 8px", borderRadius: "4px", border: `1px solid ${statusColor}` }}>
            {pair.orientation.toUpperCase()} ORIENTATION
          </span>
        </div>
        {feasibility !== null && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", opacity: 0.5 }}>HEURISTIC DESIGN SCORE</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: statusColor }}>{feasibility}</div>
            <div style={{ fontSize: "0.65rem", opacity: 0.4, maxWidth: 110, textAlign: "right" }}>educational approximation</div>
          </div>
        )}
      </div>

      {/* Primary Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "#111827", padding: "1rem", borderRadius: "8px", border: "1px solid #374151" }}>
          <div style={{ fontSize: "10px", opacity: 0.5, letterSpacing: "0.05em" }}>PREDICTED DELETION</div>
          <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>{pair.deletionBp} <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>bp</span></div>
        </div>
        <div style={{ background: "#111827", padding: "1rem", borderRadius: "8px", border: "1px solid #374151" }}>
          <div style={{ fontSize: "10px", opacity: 0.5, letterSpacing: "0.05em" }}>GENOMIC CONTEXT</div>
          <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>{seqLength} <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>bp total</span></div>
        </div>
      </div>

      {/* Guide cards */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <GuideDetail guide={pair.g1} label="Guide 1 (Upstream)" />
        <GuideDetail guide={pair.g2} label="Guide 2 (Downstream)" />
      </div>

      {/* Notes */}
      <div style={{ borderTop: "1px solid #374151", paddingTop: "1rem" }}>
        <div className="muted small">
          <p style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#E5E7EB" }}>Biological Interpretation: </strong>
            {pair.deletionBp < 30
              ? "Very small deletion — may behave like a short indel during NHEJ repair."
              : pair.deletionBp > 500
              ? "Large fragment excision — requires high simultaneous efficiency from both guides."
              : "This span is suitable for PCR screening and gel electrophoresis verification."}
          </p>
          {pair.notes.length > 0 && (
            <ul style={{ paddingLeft: "1.2rem", color: "#FBBF24" }}>
              {pair.notes.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function GuideDetail({ guide, label }: { guide: NonNullable<PairInfo["g1"]>; label: string }) {
  const gc = Math.round(guide.gcFrac * 100);
  const gcColor = gc < 40 || gc > 60 ? "#FBBF24" : "#4ADE80";
  const score = guide.onTarget?.score ?? null;
  const scoreColor = score == null ? "#9CA3AF" : score >= 70 ? "#69f0ae" : score >= 45 ? "#ffca28" : "#ef5350";

  return (
    <div style={{ flex: 1, background: "#1F2937", padding: "1rem", borderRadius: "8px" }}>
      <h4 style={{ margin: "0 0 0.8rem 0", fontSize: "0.9rem", color: "#9CA3AF" }}>{label}</h4>
      <div style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{guide.id}</div>

      <div style={{ fontSize: "0.85rem", lineHeight: "1.7" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ opacity: 0.6 }}>Strand:</span>
          <span style={{ color: guide.strand === "+" ? "#60A5FA" : "#F87171" }}>
            {guide.strand === "+" ? "Sense (+)" : "Antisense (−)"}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ opacity: 0.6 }}>Cut position:</span>
          <span>{guide.cut} bp</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ opacity: 0.6 }}>GC content:</span>
          <span style={{ color: gcColor }}>{gc}%</span>
        </div>
        {score !== null && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ opacity: 0.6 }}>Design score:</span>
            <span style={{ color: scoreColor }}>{Math.round(score)}/100</span>
          </div>
        )}
        {guide.warnings.length > 0 ? (
          <div style={{ marginTop: "0.5rem", color: "#FCA5A5", fontSize: "0.75rem", padding: "4px 6px", background: "#451a1a", borderRadius: "4px" }}>
            ⚠ {guide.warnings.map(w => WARNING_SHORT[w] ?? w).join(", ")}
          </div>
        ) : (
          <div style={{ marginTop: "0.5rem", color: "#4ADE80", fontSize: "0.75rem" }}>
            ✓ No design warnings
          </div>
        )}
      </div>
    </div>
  );
}
