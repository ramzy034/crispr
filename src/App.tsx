// src/App.tsx
import { useMemo, useState, type CSSProperties } from "react";
import "./App.css";

import { cleanFasta } from "./lib/dna";
import { findSpCas9NGG } from "./lib/pam";
import { buildPairInfo } from "./lib/pairs";
import { exportCandidatesCSV, exportSelectedPairPDF } from "./lib/export";

import type { Guide } from "./types";

import IntroBlog from "./components/IntroBlog";
import GuideTable from "./components/GuideTable";
import PairInspector from "./components/PairInspector";
import SequenceTrack from "./components/SequenceTrack";
import CrisprScene3D from "./components/CrisprScene3D";
import LearningPage from "./components/learning/LearningPage";

const DEMO = `>Demo sequence
ATGCGTACGTTACCGGATCCGATCGATCGATCGGGGTTTACCGGCGTACGATGCGGATCCGGTAGGCTAGCGGATC`;

export default function App() {
  const [rawInput, setRawInput] = useState(DEMO);
  const [strandFilter, setStrandFilter] = useState<"both" | "+" | "-">("both");
  const [gcMin, setGcMin] = useState(0.30);
  const [gcMax, setGcMax] = useState(0.80);
  const [hideWarn, setHideWarn] = useState(false);

  const [sel1, setSel1] = useState<string | null>(null);
  const [sel2, setSel2] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<"lab" | "learn">("lab");

  const cleaned = useMemo(() => cleanFasta(rawInput), [rawInput]);

  const allGuides = useMemo(() => {
    const seq = cleaned.cleaned || "";
    if (seq.length < 30) return [];
    return findSpCas9NGG(seq);
  }, [cleaned.cleaned]);

  const guides = useMemo(() => {
    return allGuides.filter((g) => {
      if (strandFilter !== "both" && g.strand !== strandFilter) return false;
      if (g.gcFrac < gcMin || g.gcFrac > gcMax) return false;
      if (hideWarn && g.warnings.length > 0) return false;
      return true;
    });
  }, [allGuides, strandFilter, gcMin, gcMax, hideWarn]);

  const selectedIds = useMemo(
    () => [sel1, sel2].filter(Boolean) as string[],
    [sel1, sel2]
  );

  const selectedGuides = useMemo(() => {
    const map = new Map<string, Guide>();
    guides.forEach((g) => map.set(g.id, g));
    return {
      g1: sel1 ? map.get(sel1) ?? null : null,
      g2: sel2 ? map.get(sel2) ?? null : null,
    };
  }, [guides, sel1, sel2]);

  const pair = useMemo(() => {
    const seqLen = cleaned.cleaned.length;
    if (!selectedGuides.g1 || !selectedGuides.g2) return null;
    return buildPairInfo(selectedGuides.g1, selectedGuides.g2, seqLen);
  }, [selectedGuides.g1, selectedGuides.g2, cleaned.cleaned.length]);

  const feasibility = useMemo(() => {
    if (!pair) return null;
    let score = 85;
    if (pair.g1.gcFrac < 0.4 || pair.g1.gcFrac > 0.6) score -= 15;
    if (pair.g2.gcFrac < 0.4 || pair.g2.gcFrac > 0.6) score -= 15;
    if (pair.deletionBp > 1000) score -= 20;
    return Math.max(score, 10);
  }, [pair]);

  function selectGuide(id: string) {
    if (!sel1) return setSel1(id);
    if (!sel2) return setSel2(id);
    setSel1(id);
    setSel2(null);
  }

  function clearSelection() {
    setSel1(null);
    setSel2(null);
  }

  function loadDemo() {
    setRawInput(DEMO);
    clearSelection();
  }

  const handleSequenceSelect = (seq: string) => {
    setRawInput(seq);
    clearSelection();
  };

  const pageBg: CSSProperties = {
    minHeight: "100vh",
    background:
      "radial-gradient(900px 650px at 18% 8%, rgba(54,140,255,.18), rgba(0,0,0,0) 60%)," +
      "radial-gradient(900px 650px at 82% 18%, rgba(40,210,190,.14), rgba(0,0,0,0) 60%)," +
      "linear-gradient(180deg, #05060a 0%, #070912 55%, #05060a 100%)",
  };

  return (
    <div className="pageWrap" style={pageBg}>
      <header className="topbar">
        <div className="container topbarInner">
          <div className="brand">
            <span className="brandDot" />
            <span>CRISPR LAB <span className="muted" style={{ fontWeight: 300 }}>v2.0</span></span>
          </div>
          <nav className="nav">
            <button
              className={`navBtn ${activePage === "learn" ? "navBtnActive" : ""}`}
              onClick={() => setActivePage("learn")}
            >
              Learning Path
            </button>
            <button
              className={`navBtn ${activePage === "lab" ? "navBtnActive" : ""}`}
              onClick={() => setActivePage("lab")}
            >
              Designer Tool
            </button>
            <a href="#export">Export Data</a>
          </nav>
          <div className="topControls">
            <div className="ctrlBox">EN ▾</div>
            <div className="ctrlBox">⌕</div>
          </div>
        </div>
      </header>

      {activePage === "learn" ? (
        <LearningPage onEnterLab={() => setActivePage("lab")} />
      ) : (
        <>
          {/* ENHANCED HERO: Targeted at Students */}
          <section className="hero" id="learn">
            <div className="container heroInner" style={{ textAlign: 'center' }}>
              <div className="kicker" style={{ color: '#28d2be', letterSpacing: '2px' }}>VIRTUAL GENETIC ENGINEERING</div>
              <h1 className="title" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Mastering CRISPR Deletions</h1>
              <div className="subtitle" style={{ maxWidth: '800px', margin: '0 auto' }}>
                A professional workspace for students to design, visualize, and test
                paired-guide RNA candidates. Explore clinical disease models and simulate
                how molecular scissors edit the code of life.
              </div>
            </div>
          </section>

          <div className="subnav">
            <div className="container subnavInner">
              <a href="#learnSection">1. THE BIOLOGY</a>
              <a href="#designer">2. THE DESIGNER</a>
              <a href="#export">3. RESULTS</a>
            </div>
          </div>

          <main className="container">
            {/* ENHANCED LEARN SECTION: Frames the Lab environment */}
            <section className="section learn hasBg" id="learnSection">
              <div className="sectionOverlay" />
              <div className="sectionContent">
                <div className="grid2">
                  <div className="card">
                    <IntroBlog onSequenceSelect={handleSequenceSelect} />
                  </div>

                  <div className="card" style={{ border: '1px solid rgba(54,140,255,0.2)' }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div className="sectionTitle" style={{ margin: 0, fontSize: '0.9rem' }}>Real-time 3D Simulation</div>
                      <div className="muted small">ACTIVE VIEWPORT</div>
                    </div>

                    <div className="canvasFrame" style={{ marginTop: 14, background: '#000', borderRadius: '8px' }}>
                      <CrisprScene3D pair={pair} seqLength={cleaned.cleaned.length} />
                    </div>
                    <hr className="sep" />
                    <div style={{ padding: '10px' }}>
                      <h4 style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Instructions for Students:</h4>
                      <p className="muted small" style={{ margin: 0 }}>
                        1. Use the panel on the left to select a clinical target.<br />
                        2. Scroll down to select two "Candidate Guides" from the table.<br />
                        3. Observe the 3D model above to see the physical deletion area in blue.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* DESIGNER SECTION */}
            <section className="section designer hasBg" id="designer">
              <div className="sectionOverlay" />
              <div className="sectionContent">
                <div className="sectionTitle" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  Designer Console
                  <span style={{ fontSize: '0.7rem', background: '#333', padding: '4px 8px', borderRadius: '4px', verticalAlign: 'middle' }}>STUDENT WORKSPACE</span>
                </div>

                <section className="grid2">
                  <div className="card">
                    <div className="muted" style={{ marginBottom: 10, fontSize: '0.85rem' }}>
                      <strong>Sequence Input:</strong> The cleaned genomic data for your chosen disease model is loaded below.
                    </div>
                    <textarea
                      className="input"
                      style={{ minHeight: 180, fontFamily: 'monospace', fontSize: '0.8rem' }}
                      value={rawInput}
                      onChange={(e) => setRawInput(e.target.value)}
                    />
                    <div className="muted" style={{ marginTop: 10, fontSize: '0.75rem' }}>
                      Raw chars: <b>{cleaned.stats.rawChars}</b> • Cleaned length:{" "}
                      <b>{cleaned.stats.cleanedLength}</b> bp
                    </div>
                    <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button className="btn btnPrimary" onClick={loadDemo}>Reset to Demo</button>
                      <button className="btn" onClick={clearSelection}>Reset Pair</button>
                    </div>
                  </div>

                  <div className="card">
                    <div className="sectionTitle" style={{ marginTop: 0, fontSize: '1rem' }}>Guide Quality Filters</div>
                    <div className="muted" style={{ marginBottom: 10, fontSize: '0.85rem' }}>
                      Filter guides based on biochemical properties like GC content.
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <span className="muted small">DNA Strand:</span>
                      <button className="btn btn-sm" onClick={() => setStrandFilter("both")}>Both</button>
                      <button className="btn btn-sm" onClick={() => setStrandFilter("+")}>Forward</button>
                      <button className="btn btn-sm" onClick={() => setStrandFilter("-")}>Reverse</button>
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <div className="muted small">Ideal GC Range (0.4 - 0.6)</div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
                        <input
                          className="input"
                          style={{ width: 100 }}
                          type="number"
                          min={0} max={1} step={0.01}
                          value={gcMin}
                          onChange={(e) => setGcMin(Number(e.target.value))}
                        />
                        <span className="muted">to</span>
                        <input
                          className="input"
                          style={{ width: 100 }}
                          type="number"
                          min={0} max={1} step={0.01}
                          value={gcMax}
                          onChange={(e) => setGcMax(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14 }}>
                      <input type="checkbox" checked={hideWarn} onChange={(e) => setHideWarn(e.target.checked)} />
                      <span className="muted small">Automatically hide low-efficiency guides</span>
                    </label>
                  </div>
                </section>

                <section className="card" style={{ marginTop: 22 }}>
                  <div className="sectionTitle" style={{ marginTop: 0 }}>Genome Mapping</div>
                  <SequenceTrack
                    seqLength={cleaned.cleaned.length}
                    guides={guides}
                    selectedIds={selectedIds}
                    onSelectGuide={selectGuide}
                    pair={pair}
                  />
                </section>

                <section className="grid2" style={{ marginTop: 22 }}>
                  <div className="card">
                    <div className="sectionTitle" style={{ marginTop: 0 }}>Candidate Guide Library</div>
                    <GuideTable
                      guides={guides}
                      selectedIds={selectedIds}
                      onSelectGuide={selectGuide}
                      hideWarnings={hideWarn}
                    />
                  </div>

                  <div className="card" style={{ border: pair ? '1px solid #28d2be' : '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="sectionTitle" style={{ marginTop: 0 }}>Experimental Outcome</div>
                    {feasibility !== null && (
                      <div className="feasibility-meter" style={{
                        padding: '12px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.05)',
                        marginBottom: '16px',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span className="muted small">EXCISION SUCCESS RATE</span>
                          <span style={{
                            color: feasibility > 70 ? '#28d2be' : feasibility > 40 ? '#ffcc00' : '#ff4444',
                            fontWeight: 'bold'
                          }}>{feasibility}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${feasibility}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, #368cff, ${feasibility > 70 ? '#28d2be' : '#ffcc00'})`,
                            transition: 'width 0.5s ease-out'
                          }} />
                        </div>
                      </div>
                    )}
                    <PairInspector pair={pair} seqLength={cleaned.cleaned.length} />
                  </div>
                </section>
              </div>
            </section>

            <section className="section" id="export">
              <div className="sectionTitle">Lab Report & Export</div>
              <section className="card">
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "space-between" }}>
                  <div className="muted" style={{ maxWidth: 760, fontSize: '0.9rem' }}>
                    Students can export their design candidates as a CSV for spreadsheet analysis, or download a formal PDF summary of their selected CRISPR pair.
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="btn" onClick={() => exportCandidatesCSV(guides)}>
                      Export CSV
                    </button>
                    <button
                      className="btn btnPrimary"
                      disabled={!pair}
                      onClick={() => pair && exportSelectedPairPDF(pair, cleaned.cleaned)}
                    >
                      Generate PDF Lab Report
                    </button>
                  </div>
                </div>
              </section>
            </section>
            <div style={{ height: 40 }} />
          </main>
        </>
      )}
    </div>
  );
}
