import type { PairInfo } from "../types";

export default function PairInspector(props: { pair: PairInfo | null; seqLength: number }) {
  const { pair, seqLength } = props;

  if (!pair) {
    return (
      <div className="card">
        <h3>Selected Guide Pair</h3>
        <p className="muted">Select two guides to see the predicted deletion.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Selected Guide Pair</h3>

      <p>
        <b>Predicted deletion:</b> {pair.deletionBp} bp
      </p>
      <p>
        <b>Orientation:</b> {pair.orientation}
      </p>
      <p>
        <b>Sequence length:</b> {seqLength} bp
      </p>

      <div className="pairCards">
        <div className="subcard">
          <h4>Guide 1 — {pair.g1.id}</h4>
          <ul>
            <li>Strand: {pair.g1.strand}</li>
            <li>Start: {pair.g1.start}</li>
            <li>Cut: {pair.g1.cut}</li>
            <li>GC%: {Math.round(pair.g1.gcFrac * 100)}%</li>
            <li>Warnings: {pair.g1.warnings.length ? pair.g1.warnings.join(", ") : "None"}</li>
          </ul>
        </div>

        <div className="subcard">
          <h4>Guide 2 — {pair.g2.id}</h4>
          <ul>
            <li>Strand: {pair.g2.strand}</li>
            <li>Start: {pair.g2.start}</li>
            <li>Cut: {pair.g2.cut}</li>
            <li>GC%: {Math.round(pair.g2.gcFrac * 100)}%</li>
            <li>Warnings: {pair.g2.warnings.length ? pair.g2.warnings.join(", ") : "None"}</li>
          </ul>
        </div>
      </div>

      <div className="muted small">
        <p><b>How to read this:</b> We approximate SpCas9 cut at ~3 bp upstream of the PAM on the + strand.</p>
        {pair.notes.length > 0 && (
          <>
            <p><b>Notes:</b></p>
            <ul>
              {pair.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
