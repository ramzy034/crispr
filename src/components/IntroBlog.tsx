export default function IntroBlog() {
  return (
    <section className="card hero">
      <div className="heroLeft">
        <h2>What is a two-guide CRISPR deletion?</h2>
        <p>
          In a classic CRISPR/Cas9 experiment, a single guide RNA tells Cas9 where to cut DNA.
          If we provide <b>two guides</b> in the same cell, Cas9 can make <b>two double-strand breaks</b>.
          During repair (often via NHEJ), the segment <b>between the two cut sites</b> can be removed
          as a single block — a <b>deletion</b>.
        </p>
        <p>
          This is useful for deleting an exon, removing a regulatory element, or creating a clean knockout that
          is easy to detect by PCR and gel electrophoresis.
        </p>
      </div>

      <div className="heroRight callout">
        <h3>What this website does</h3>
        <ul>
          <li>Scans your sequence for SpCas9 <b>NGG</b> sites on both strands</li>
          <li>Shows guide position, GC%, and simple quality flags</li>
          <li>Lets you choose two guides and predicts the deletion span</li>
          <li>Exports candidate tables (CSV) and selected pair summary (PDF)</li>
        </ul>
        <p className="muted">
          Think of it as an interactive figure: read the concept, then play with real sequences.
        </p>
      </div>
    </section>
  );
}
