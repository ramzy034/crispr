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

  // Keep a consistent full-page background (prevents “half blue / half gray”)
  const pageBg: CSSProperties = {
    minHeight: "100vh",
    background:
      "radial-gradient(900px 650px at 18% 8%, rgba(54,140,255,.18), rgba(0,0,0,0) 60%)," +
      "radial-gradient(900px 650px at 82% 18%, rgba(40,210,190,.14), rgba(0,0,0,0) 60%)," +
      "linear-gradient(180deg, #05060a 0%, #070912 55%, #05060a 100%)",
  };

  return (
    <div className="pageWrap" style={pageBg}>
      {/* TOP BAR */}
      <header className="topbar">
        <div className="container topbarInner">
          <div className="brand">
            <span className="brandDot" />
            <span>CRISPR DELETION PAIR DESIGNER</span>
          </div>

          <nav className="nav">
            <a href="#learn">About</a>
            <a href="#designer">Designer</a>
            <a href="#export">Resources</a>
          </nav>

          <div className="topControls">
            <div className="ctrlBox">EN ▾</div>
            <div className="ctrlBox">⌕</div>
          </div>
        </div>
      </header>

      {/* HERO (background image comes from App.css --hero-bg) */}
      <section className="hero" id="learn">
        <div className="container heroInner">
          <div className="kicker">A brief introduction to CRISPR genome editing</div>
          <h1 className="title">What is CRISPR?</h1>
          <div className="subtitle">
            Learn paired-guide deletions with an interactive 3D simulation and a transparent
            guide-selection workflow.
          </div>
        </div>
      </section>

      {/* WHITE SUBNAV */}
      <div className="subnav">
        <div className="container subnavInner">
          <a href="#learnSection">CRISPR 101</a>
          <a href="#learnSection">DIVE DEEPER</a>
          <a href="#learnSection">GUIDE RNA</a>
          <a href="#learnSection">CAS9 + PAM</a>
          <a href="#designer">DESIGNER</a>
          <a href="#export">EXPORT</a>
        </div>
      </div>

      <main className="container">
        {/* LEARN SECTION (optional background image slot via App.css --learn-bg) */}
        <section className="section learn hasBg" id="learnSection">
          <div className="sectionOverlay" />
          <div className="sectionContent">
            <div className="grid2">
              <div className="card">
                <IntroBlog />
              </div>

              <div className="card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div className="sectionTitle" style={{ margin: 0 }}>
                    3D concept view
                  </div>
                  <div className="muted" style={{ whiteSpace: "nowrap" }}>
                    DNA • guides • deletion
                  </div>
                </div>

                <div className="canvasFrame" style={{ marginTop: 14 }}>
                  <CrisprScene3D pair={pair} seqLength={cleaned.cleaned.length} />
                </div>

                <hr className="sep" />
                <p className="muted" style={{ margin: 0 }}>
                  Select two guides to simulate a deletion between cut sites (repair via NHEJ).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DESIGNER SECTION (optional background image slot via App.css --designer-bg) */}
        <section className="section designer hasBg" id="designer">
          <div className="sectionOverlay" />
          <div className="sectionContent">
            <div className="sectionTitle">Designer</div>

            {/* INPUT + FILTERS */}
            <section className="grid2">
              <div className="card">
                <div className="muted" style={{ marginBottom: 10 }}>
                  Paste a genomic region (raw or FASTA). We clean non-ACGTN and scan SpCas9 NGG sites.
                </div>

                <textarea
                  className="input"
                  style={{ minHeight: 180 }}
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                />

                <div className="muted" style={{ marginTop: 10 }}>
                  Raw chars: <b>{cleaned.stats.rawChars}</b> • Cleaned length:{" "}
                  <b>{cleaned.stats.cleanedLength}</b> bp • Removed non-ACGTN:{" "}
                  <b>{cleaned.stats.removedNonACGTN}</b>
                </div>

                <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="btn btnPrimary" onClick={loadDemo}>
                    Load Demo
                  </button>
                  <button className="btn" onClick={clearSelection}>
                    Clear selection
                  </button>
                </div>
              </div>

              <div className="card">
                <div className="sectionTitle" style={{ marginTop: 0 }}>
                  Filters
                </div>

                <div className="muted" style={{ marginBottom: 10 }}>
                  Candidates after filters: <b>{guides.length}</b>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <span className="muted">Strand</span>
                  <button className="btn" onClick={() => setStrandFilter("both")}>
                    Both
                  </button>
                  <button className="btn" onClick={() => setStrandFilter("+")}>
                    +
                  </button>
                  <button className="btn" onClick={() => setStrandFilter("-")}>
                    -
                  </button>
                </div>

                <div style={{ marginTop: 14 }}>
                  <div className="muted">GC range</div>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      marginTop: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <input
                      className="input"
                      style={{ width: 120 }}
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      value={gcMin}
                      onChange={(e) => setGcMin(Number(e.target.value))}
                    />
                    <span className="muted">to</span>
                    <input
                      className="input"
                      style={{ width: 120 }}
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      value={gcMax}
                      onChange={(e) => setGcMax(Number(e.target.value))}
                    />
                  </div>
                </div>

                <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14 }}>
                  <input
                    type="checkbox"
                    checked={hideWarn}
                    onChange={(e) => setHideWarn(e.target.checked)}
                  />
                  <span className="muted">Hide guides with warnings</span>
                </label>

                <hr className="sep" />

                <div className="muted">
                  Selected: <b>{selectedIds.length}</b>/2{" "}
                  {selectedIds.length > 0 ? `(${selectedIds.join(", ")})` : ""}
                </div>
              </div>
            </section>

            {/* SEQUENCE VIEW */}
            <section className="card" style={{ marginTop: 22 }}>
              <div className="sectionTitle" style={{ marginTop: 0 }}>
                Sequence View
              </div>

              <SequenceTrack
                seqLength={cleaned.cleaned.length}
                guides={guides}
                selectedIds={selectedIds}
                onSelectGuide={selectGuide}
                pair={pair}
              />
            </section>

            {/* GUIDES + PAIR */}
            <section className="grid2" style={{ marginTop: 22 }}>
              <div className="card">
                <div className="sectionTitle" style={{ marginTop: 0 }}>
                  Candidate Guides
                </div>
                <GuideTable
                  guides={guides}
                  selectedIds={selectedIds}
                  onSelectGuide={selectGuide}
                  hideWarnings={hideWarn}
                />
              </div>

              <div className="card">
                <div className="sectionTitle" style={{ marginTop: 0 }}>
                  Selected Pair
                </div>
                <PairInspector pair={pair} seqLength={cleaned.cleaned.length} />
              </div>
            </section>
          </div>
        </section>

        {/* EXPORT */}
        <section className="section" id="export">
          <div className="sectionTitle">Resources & Export</div>

          <section className="card">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "space-between" }}>
              <div className="muted" style={{ maxWidth: 760 }}>
                Export candidates for offline analysis (CSV), or generate a short PDF summary of the selected pair.
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn btnPrimary" onClick={() => exportCandidatesCSV(guides)}>
                  Export All Candidates (CSV)
                </button>
                <button
                  className="btn"
                  disabled={!pair}
                  onClick={() => pair && exportSelectedPairPDF(pair, cleaned.cleaned)}
                  title={!pair ? "Select two guides first" : "Export selected pair PDF"}
                >
                  Export Selected Pair (PDF)
                </button>
              </div>
            </div>
          </section>
        </section>

        <div style={{ height: 40 }} />
      </main>
    </div>
  );
}
