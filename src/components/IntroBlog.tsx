import { useLang } from "../lib/LangContext";
import { UI } from "../lib/translations";

export default function IntroBlog() {
  const { lang } = useLang();
  const T = UI[lang];

  return (
    <div className="intro-blog-flow">
      {/* SECTION 1: THE "WHAT" - Visual Hook */}
      <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #368cff' }}>
        <div className="card-header">
          <div className="kicker" style={{ color: '#368cff', fontWeight: 'bold', fontSize: '0.7rem' }}>{T.introKicker}</div>
          <h2 style={{ marginTop: '0.2rem', fontSize: '1.4rem' }}>{T.introTitle}</h2>
        </div>
        <div className="card-body">
          <p className="muted" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
            {T.introParagraph}
          </p>

          <div className="how-it-works-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '1.5rem', textAlign: 'center' }}>
            <div className="step">
              <div style={{ fontSize: '1.2rem' }}>🔍</div>
              <div className="small bold">{T.step1Label}</div>
              <p className="extra-small muted">{T.step1Body}</p>
            </div>
            <div className="step">
              <div style={{ fontSize: '1.2rem' }}>✂️</div>
              <div className="small bold">{T.step2Label}</div>
              <p className="extra-small muted">{T.step2Body}</p>
            </div>
            <div className="step">
              <div style={{ fontSize: '1.2rem' }}>🧬</div>
              <div className="small bold">{T.step3Label}</div>
              <p className="extra-small muted">{T.step3Body}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: MINI GLOSSARY */}
      <div style={{ marginTop: '1.5rem', padding: '0 10px' }}>
        <h4 className="small muted" style={{ borderBottom: '1px solid #333', paddingBottom: '5px' }}>{T.introGlossary}</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          <div className="tag-alt" title="Guide RNA"><strong>gRNA:</strong> {T.introGrna}</div>
          <div className="tag-alt" title="The Protein Scissors"><strong>Cas9:</strong> {T.introCas9}</div>
          <div className="tag-alt" title="Protospacer Adjacent Motif"><strong>PAM:</strong> {T.introPam}</div>
        </div>
      </div>

      {/* 3D Simulation hint */}
      <div style={{ marginTop: '1.2rem', padding: '10px 14px', background: 'rgba(54,140,255,0.07)', border: '1px solid rgba(54,140,255,0.18)', borderRadius: '8px' }}>
        <p className="extra-small muted" style={{ margin: 0, lineHeight: 1.55 }}>
          <strong style={{ color: '#368cff' }}>👁 3D Simulation →</strong> The live animation on the right shows the CRISPR process in real time. Once you select two guide RNAs in the Designer below, it will animate gRNA binding, Cas9 cutting, and DNA repair for your exact pair.
        </p>
      </div>
    </div>
  );
}
