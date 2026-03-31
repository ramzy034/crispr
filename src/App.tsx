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
  const [activePage, setActivePage] = useState<"lab" | "learn">("learn");

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

  const feasColor =
    feasibility == null ? "#4fc3f7"
    : feasibility > 70 ? "#69f0ae"
    : feasibility > 40 ? "#ffca28"
    : "#ef5350";

  return (
    <div className="pageWrap" style={pageBg}>
      {/* ── TOPBAR ─────────────────────────────────────────── */}
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
          {/* ── DESIGNER HERO ───────────────────────────────── */}
          <section className="ds-hero">
            <div className="ds-hero-grid">
              <div className="ds-hero-bg-line ds-hero-bg-line-1" />
              <div className="ds-hero-bg-line ds-hero-bg-line-2" />
            </div>
            <div className="container ds-hero-inner">
              <div className="ds-kicker">
                <span className="ds-kicker-dot" />
                VIRTUAL GENETIC ENGINEERING
              </div>
              <h1 className="ds-hero-title">
                CRISPR Paired-Guide<br />
                <span className="ds-title-accent">Designer Tool</span>
              </h1>
              <p className="ds-hero-sub">
                Design, visualise, and test paired-guide RNA candidates.
                Explore clinical disease models and simulate how molecular scissors edit the code of life.
              </p>
              <div className="ds-hero-steps">
                {["Select a clinical target", "Choose two guide RNAs", "Inspect the 3-D excision"].map((s, i) => (
                  <div className="ds-hero-step" key={i}>
                    <span className="ds-hero-step-num">{i + 1}</span>
                    <span className="ds-hero-step-label">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── SUBNAV ──────────────────────────────────────── */}
          <nav className="ds-subnav">
            <div className="container ds-subnav-inner">
              <a href="#learnSection" className="ds-subnav-link">
                <span className="ds-subnav-num">01</span> Biology
              </a>
              <span className="ds-subnav-sep">›</span>
              <a href="#designer" className="ds-subnav-link">
                <span className="ds-subnav-num">02</span> Designer
              </a>
              <span className="ds-subnav-sep">›</span>
              <a href="#export" className="ds-subnav-link">
                <span className="ds-subnav-num">03</span> Results
              </a>
            </div>
          </nav>

          <main className="container ds-main">

            {/* ── 01 BIOLOGY ──────────────────────────────────── */}
            <section className="ds-section" id="learnSection">
              <div className="ds-section-header">
                <span className="ds-section-tag">01</span>
                <h2 className="ds-section-title">The Biology</h2>
              </div>

              <div className="ds-biology-grid">
                {/* Left: IntroBlog */}
                <div className="ds-card">
                  <IntroBlog onSequenceSelect={handleSequenceSelect} />
                </div>

                {/* Right: 3-D simulation */}
                <div className="ds-card ds-card-scene">
                  <div className="ds-card-header">
                    <span className="ds-card-label">Real-time 3D Simulation</span>
                    <span className="ds-badge ds-badge-live">● LIVE</span>
                  </div>
                  <div className="ds-scene-frame">
                    <CrisprScene3D pair={pair} seqLength={cleaned.cleaned.length} />
                  </div>
                  <div className="ds-scene-hint">
                    <span className="ds-hint-icon">💡</span>
                    Select two guides from the table below — the 3-D model will animate the deletion.
                  </div>
                </div>
              </div>
            </section>

            {/* ── 02 DESIGNER ─────────────────────────────────── */}
            <section className="ds-section" id="designer">
              <div className="ds-section-header">
                <span className="ds-section-tag">02</span>
                <h2 className="ds-section-title">Designer Console</h2>
                <span className="ds-badge">STUDENT WORKSPACE</span>
              </div>

              {/* Row A: Sequence input + Filters */}
              <div className="ds-two-col">
                {/* Sequence input */}
                <div className="ds-card">
                  <p className="ds-card-label" style={{ marginBottom: 12 }}>Sequence Input</p>
                  <p className="ds-card-hint">Paste a genomic FASTA sequence or use the demo below.</p>
                  <textarea
                    className="input ds-seq-input"
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                  />
                  <div className="ds-seq-stats">
                    <span>Raw chars: <b>{cleaned.stats.rawChars}</b></span>
                    <span>Cleaned: <b>{cleaned.stats.cleanedLength} bp</b></span>
                  </div>
                  <div className="ds-btn-row">
                    <button className="btn btnPrimary" onClick={loadDemo}>Reset to Demo</button>
                    <button className="btn" onClick={clearSelection}>Clear Selection</button>
                  </div>
                </div>

                {/* Filters */}
                <div className="ds-card">
                  <p className="ds-card-label" style={{ marginBottom: 12 }}>Guide Quality Filters</p>
                  <p className="ds-card-hint">Narrow candidates by biochemical properties.</p>

                  <div className="ds-filter-group">
                    <span className="ds-filter-label">DNA Strand</span>
                    <div className="ds-btn-row">
                      {(["both", "+", "-"] as const).map((v) => (
                        <button
                          key={v}
                          className={`btn btn-sm ${strandFilter === v ? "btn-active" : ""}`}
                          onClick={() => setStrandFilter(v)}
                        >
                          {v === "both" ? "Both" : v === "+" ? "Forward +" : "Reverse −"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="ds-filter-group">
                    <span className="ds-filter-label">GC Content Range <span className="ds-filter-hint">(optimal 0.40–0.60)</span></span>
                    <div className="ds-range-row">
                      <input className="input ds-range-input" type="number" min={0} max={1} step={0.01}
                        value={gcMin} onChange={(e) => setGcMin(Number(e.target.value))} />
                      <span className="ds-range-sep">→</span>
                      <input className="input ds-range-input" type="number" min={0} max={1} step={0.01}
                        value={gcMax} onChange={(e) => setGcMax(Number(e.target.value))} />
                    </div>
                  </div>

                  <label className="ds-checkbox-row">
                    <input type="checkbox" checked={hideWarn} onChange={(e) => setHideWarn(e.target.checked)} />
                    <span>Hide low-efficiency guides automatically</span>
                  </label>
                </div>
              </div>

              {/* Row B: Genome Map */}
              <div className="ds-card ds-card-full" style={{ marginTop: 20 }}>
                <p className="ds-card-label" style={{ marginBottom: 14 }}>Genome Mapping</p>
                <SequenceTrack
                  seqLength={cleaned.cleaned.length}
                  guides={guides}
                  selectedIds={selectedIds}
                  onSelectGuide={selectGuide}
                  pair={pair}
                />
              </div>

              {/* Row C: Guide table + Outcome */}
              <div className="ds-two-col" style={{ marginTop: 20 }}>
                {/* Guide table */}
                <div className="ds-card">
                  <p className="ds-card-label" style={{ marginBottom: 14 }}>Candidate Guide Library</p>
                  <GuideTable
                    guides={guides}
                    selectedIds={selectedIds}
                    onSelectGuide={selectGuide}
                    hideWarnings={hideWarn}
                  />
                </div>

                {/* Experimental outcome */}
                <div className={`ds-card ds-card-outcome ${pair ? "ds-card-outcome-active" : ""}`}>
                  <p className="ds-card-label" style={{ marginBottom: 14 }}>Experimental Outcome</p>

                  {feasibility !== null ? (
                    <div className="ds-feasibility">
                      <div className="ds-feasibility-header">
                        <span className="ds-feasibility-label">EXCISION SUCCESS RATE</span>
                        <span className="ds-feasibility-value" style={{ color: feasColor }}>
                          {feasibility}%
                        </span>
                      </div>
                      <div className="ds-feasibility-track">
                        <div
                          className="ds-feasibility-fill"
                          style={{
                            width: `${feasibility}%`,
                            background: `linear-gradient(90deg, #368cff, ${feasColor})`,
                          }}
                        />
                      </div>
                      <div className="ds-feasibility-tier" style={{ color: feasColor }}>
                        {feasibility > 70 ? "High efficiency predicted"
                          : feasibility > 40 ? "Moderate efficiency — consider optimising GC content"
                          : "Low efficiency — review guide selection"}
                      </div>
                    </div>
                  ) : (
                    <div className="ds-outcome-empty">
                      <span className="ds-outcome-empty-icon">⬡</span>
                      <span>Select two guides to compute outcome metrics</span>
                    </div>
                  )}

                  <PairInspector pair={pair} seqLength={cleaned.cleaned.length} />
                </div>
              </div>
            </section>

            {/* ── 03 EXPORT ───────────────────────────────────── */}
            <section className="ds-section" id="export">
              <div className="ds-section-header">
                <span className="ds-section-tag">03</span>
                <h2 className="ds-section-title">Lab Report & Export</h2>
              </div>

              <div className="ds-card ds-export-card">
                <div className="ds-export-body">
                  <div>
                    <p className="ds-card-label" style={{ marginBottom: 8 }}>Download Your Results</p>
                    <p className="ds-card-hint">
                      Export all candidate guides as CSV for spreadsheet analysis,
                      or generate a formal PDF summary of the selected CRISPR pair.
                    </p>
                  </div>
                  <div className="ds-btn-row">
                    <button className="btn" onClick={() => exportCandidatesCSV(guides)}>
                      ↓ Export CSV
                    </button>
                    <button
                      className="btn btnPrimary"
                      disabled={!pair}
                      onClick={() => pair && exportSelectedPairPDF(pair, cleaned.cleaned)}
                    >
                      ↓ Generate PDF Report
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div style={{ height: 60 }} />
          </main>
        </>
      )}
    </div>
  );
}
