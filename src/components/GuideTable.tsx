import type { Guide } from "../types";

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
              <th>PAM</th>
              <th>Warnings</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((g) => (
              <tr
                key={g.id}
                className={isSelected(g.id) ? "rowSelected" : ""}
                onClick={() => onSelectGuide(g.id)}
                title="Click to select (choose 2 guides)"
              >
                <td className="mono">{g.id}</td>
                <td>{g.strand}</td>
                <td>{g.start}</td>
                <td>{g.cut}</td>
                <td>{Math.round(g.gcFrac * 100)}</td>
                <td className="mono">{g.pam}</td>
                <td className="mono">{g.warnings.length ? g.warnings.join(", ") : "—"}</td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={7} className="muted">
                  No guides match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="muted small">
        Tip: select any two guides to compute the predicted deletion (distance between cut sites).
      </p>
    </div>
  );
}
