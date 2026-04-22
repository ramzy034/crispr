import type { Guide, GuideWarning } from "../types";

const WARNING_LABELS: Record<GuideWarning, string> = {
  LOW_GC: "GC < 30% — low melting stability",
  HIGH_GC: "GC > 80% — may fold on itself",
  HOMOPOLYMER: "Long homopolymer run — reduces specificity",
  SIMPLE_REPEAT: "Simple repeat sequence — reduces specificity",
  TOO_CLOSE_TO_END: "Too close to sequence boundary — may be unusable",
  POLY_T: "PolyT run — terminates U6/T7 transcription",
  HAS_N: "Contains ambiguous base N",
  SELF_COMPLEMENTARY: "Partial reverse-complement match — hairpin risk",
  BAD_SEED: "Problematic PAM-proximal seed region",
  HAIRPIN_POTENTIAL: "Potential gRNA hairpin structure",
  OFF_TARGET_RISK: "Elevated off-target risk flag",
};

function ScoreCell({ score }: { score: number }) {
  const color = score >= 70 ? "#69f0ae" : score >= 45 ? "#ffca28" : "#ef5350";
  return (
    <td>
      <span style={{ color, fontWeight: 600 }}>{Math.round(score)}</span>
    </td>
  );
}

function WarningsCell({ warnings }: { warnings: GuideWarning[] }) {
  if (warnings.length === 0) return <td style={{ color: "#69f0ae", opacity: 0.8 }}>—</td>;
  return (
    <td>
      <span
        className="gt-warn-cell"
        title={warnings.map(w => WARNING_LABELS[w] ?? w).join("\n")}
      >
        ⚠ {warnings.length}
      </span>
    </td>
  );
}

export default function GuideTable(props: {
  guides: Guide[];
  selectedIds: (string | null)[];
  onSelectGuide: (id: string) => void;
  hideWarnings: boolean;
}) {
  const { guides, selectedIds, onSelectGuide, hideWarnings } = props;

  const isSelected = (id: string) => selectedIds.includes(id);
  const shown = hideWarnings ? guides.filter((g) => g.warnings.length === 0) : guides;

  return (
    <div className="card">
      <h3>Candidate Guides</h3>
      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Strand</th>
              <th>Start</th>
              <th>Cut</th>
              <th>GC%</th>
              <th title="Heuristic on-target score (0–100). Higher = better predicted efficiency.">Score ℹ</th>
              <th>PAM</th>
              <th title="Hover over warning count for details.">Warn ℹ</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((g) => (
              <tr
                key={g.id}
                className={isSelected(g.id) ? "rowSelected" : ""}
                onClick={() => onSelectGuide(g.id)}
                title="Click to select (choose 2 guides for pair analysis)"
              >
                <td className="mono">{g.id}</td>
                <td style={{ color: g.strand === "+" ? "#4fc3f7" : "#f48fb1" }}>{g.strand}</td>
                <td>{g.start}</td>
                <td>{g.cut}</td>
                <td>{Math.round(g.gcFrac * 100)}</td>
                <ScoreCell score={g.onTarget?.score ?? 50} />
                <td className="mono">{g.pam}</td>
                <WarningsCell warnings={g.warnings} />
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={8} className="muted">
                  No guides match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="muted small">
        Select two guides to compute deletion size and pair feasibility. Score is a heuristic (0–100) — not a wet-lab validated prediction.
      </p>
    </div>
  );
}
