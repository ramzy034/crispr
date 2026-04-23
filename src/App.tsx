// src/App.tsx
import { useMemo, useState, useRef, useEffect, type CSSProperties } from "react";
import "./App.css";
import { LangContext, type Lang } from "./lib/LangContext";
import { UI } from "./lib/translations";

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
import GlossaryPage from "./components/GlossaryPage";
import MethodologyPage from "./components/MethodologyPage";
import ReferencesPage from "./components/ReferencesPage";
import SearchModal from "./components/SearchModal";
import LabScenarioPanel, { WARNING_MESSAGES } from "./components/LabScenarioPanel";
import type { ScenarioWarning } from "./components/LabScenarioPanel";
import GuidedTour from "./components/GuidedTour";

const DEMO = `>Demo sequence
ATGCGTACGTTACCGGATCCGATCGATCGATCGGGGTTTACCGGCGTACGATGCGGATCCGGTAGGCTAGCGGATC`;

type ActivePage = "learn" | "lab" | "glossary" | "methodology" | "references";

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    try { return (localStorage.getItem("crispr-lang") as Lang) || "en"; }
    catch { return "en"; }
  });
  const setLangPersisted = (l: Lang) => {
    localStorage.setItem("crispr-lang", l);
    setLang(l);
  };
  const T = UI[lang];
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const [rawInput, setRawInput] = useState(DEMO);
  const [strandFilter, setStrandFilter] = useState<"both" | "+" | "-">("both");
  const [gcMin, setGcMin] = useState(0.30);
  const [gcMax, setGcMax] = useState(0.80);
  const [hideWarn, setHideWarn] = useState(false);

  const [sel1, setSel1] = useState<string | null>(null);
  const [sel2, setSel2] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>("learn");
  const [strategyMode, setStrategyMode] = useState<"ko" | "ki">("ko");
  const [donorTemplate, setDonorTemplate] = useState("");
  const [scenarioAlert, setScenarioAlert] = useState<ScenarioWarning | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Auto-trigger tour on first visit to the lab page
  useEffect(() => {
    if (activePage === "lab") {
      try {
        if (!localStorage.getItem("crispr-tour-done")) {
          const t = setTimeout(() => setShowTour(true), 350);
          return () => clearTimeout(t);
        }
      } catch { /* ignore */ }
    }
  }, [activePage]);

  const handleTourDone = () => {
    setShowTour(false);
    try { localStorage.setItem("crispr-tour-done", "1"); } catch { /* ignore */ }
  };

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
    <LangContext.Provider value={{ lang, setLang: setLangPersisted }}>
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
              {T.navLearn}
            </button>
            <button
              className={`navBtn ${activePage === "lab" ? "navBtnActive" : ""}`}
              onClick={() => setActivePage("lab")}
            >
              {T.navLab}
            </button>
            <button
              className={`navBtn ${activePage === "glossary" ? "navBtnActive" : ""}`}
              onClick={() => setActivePage("glossary")}
            >
              {T.navGlossary}
            </button>
            <button
              className={`navBtn ${activePage === "methodology" ? "navBtnActive" : ""}`}
              onClick={() => setActivePage("methodology")}
            >
              {T.navMethodology}
            </button>
            <button
              className={`navBtn ${activePage === "references" ? "navBtnActive" : ""}`}
              onClick={() => setActivePage("references")}
            >
              {T.navReferences}
            </button>
            <a href="#export">{T.navExport}</a>
          </nav>
          <div className="topControls">
            {/* Language switcher */}
            <div className="ctrlBox lang-switcher" ref={langRef} onClick={() => setShowLangMenu(v => !v)}>
              {lang.toUpperCase()} ▾
              {showLangMenu && (
                <div className="lang-menu">
                  {(["en", "tr"] as Lang[]).map(l => (
                    <button
                      key={l}
                      className={`lang-option ${lang === l ? "lang-option-active" : ""}`}
                      onClick={(e) => { e.stopPropagation(); setLangPersisted(l); setShowLangMenu(false); }}
                    >
                      {l === "en" ? "🇺🇸 English" : "🇹🇷 Türkçe"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="ctrlBox search-ctrl" onClick={() => setShowSearch(true)} title="Search (Ctrl+K)">
              ⌕ <span className="search-kbd">⌘K</span>
            </div>
            {activePage === "lab" && (
              <button
                className="ds-tour-btn"
                style={{ fontSize: 11, padding: "5px 12px" }}
                onClick={() => {
                  try { localStorage.removeItem("crispr-tour-done"); } catch { /* ignore */ }
                  setShowTour(true);
                }}
                title="Restart the guided tour"
              >
                ▶ Tour
              </button>
            )}
          </div>
        </div>
      </header>

      {activePage === "learn" ? (
        <LearningPage onEnterLab={() => setActivePage("lab")} />
      ) : activePage === "glossary" ? (
        <GlossaryPage />
      ) : activePage === "methodology" ? (
        <MethodologyPage />
      ) : activePage === "references" ? (
        <ReferencesPage />
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
                {T.heroKicker}
              </div>
              <h1 className="ds-hero-title">
                {T.heroTitle1}<br />
                <span className="ds-title-accent">{T.heroTitle2}</span>
              </h1>
              <p className="ds-hero-sub">{T.heroSub}</p>
              <div className="ds-hero-steps">
                {[T.heroStep1, T.heroStep2, T.heroStep3].map((s, i) => (
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
                <span className="ds-subnav-num">01</span> {T.subnavBiology}
              </a>
              <span className="ds-subnav-sep">›</span>
              <a href="#designer" className="ds-subnav-link">
                <span className="ds-subnav-num">02</span> {T.subnavDesigner}
              </a>
              <span className="ds-subnav-sep">›</span>
              <a href="#export" className="ds-subnav-link">
                <span className="ds-subnav-num">03</span> {T.subnavResults}
              </a>
            </div>
          </nav>

          <main className="container ds-main">

            {/* ── 01 BIOLOGY ──────────────────────────────────── */}
            <section className="ds-section" id="learnSection">
              <div className="ds-section-header">
                <span className="ds-section-tag">01</span>
                <h2 className="ds-section-title">{T.sectionBiology}</h2>
              </div>

              <div className="ds-biology-grid">
                <div className="ds-card">
                  <IntroBlog />
                </div>

                <div id="tour-3d-sim" className="ds-card ds-card-scene">
                  <div className="ds-card-header">
                    <span className="ds-card-label">{T.simLabel}</span>
                    <span className="ds-badge ds-badge-live">● {T.simLive}</span>
                  </div>
                  <div className="ds-scene-frame">
                    <CrisprScene3D pair={pair} seqLength={cleaned.cleaned.length} strategyMode={strategyMode} />
                  </div>
                  <div className="ds-scene-hint">
                    <span className="ds-hint-icon">💡</span>
                    {T.simHint}
                  </div>
                </div>
              </div>
            </section>

            {/* ── 02 DESIGNER ─────────────────────────────────── */}
            <section className="ds-section" id="designer">
              <div className="ds-section-header">
                <span className="ds-section-tag">02</span>
                <h2 className="ds-section-title">{T.sectionDesigner}</h2>
                <span className="ds-badge">{T.sectionDesignerBadge}</span>
                <button className="ds-help-btn" onClick={() => setShowHelp(true)}>
                  ? How it works
                </button>
                <button className="ds-tour-btn" onClick={() => {
                  try { localStorage.removeItem("crispr-tour-done"); } catch { /* ignore */ }
                  setShowTour(true);
                }}>
                  ▶ Take a tour
                </button>
              </div>

              {/* ── Lab Scenarios ──────────────────────────────── */}
              <div id="tour-scenarios">
              <LabScenarioPanel
                onLoad={(seq, mode, donor, warning) => {
                  handleSequenceSelect(seq);
                  setStrategyMode(mode);
                  if (donor !== undefined) setDonorTemplate(donor);
                  setScenarioAlert(warning ?? null);
                }}
              />
              </div>

              {/* ── Scenario warning banner ─────────────────── */}
              {scenarioAlert && (() => {
                const w = WARNING_MESSAGES[scenarioAlert];
                return (
                  <div className="ds-scenario-alert" style={{ borderColor: w.color, background: `${w.color}12` }}>
                    <div className="ds-alert-title" style={{ color: w.color }}>{w.title}</div>
                    <div className="ds-alert-body">{w.body}</div>
                    <button className="ds-alert-dismiss" onClick={() => setScenarioAlert(null)}>✕</button>
                  </div>
                );
              })()}

              {/* ── Strategy Mode Toggle ─────────────────────── */}
              <div id="tour-strategy" className="ds-strategy-bar">
                <span className="ds-strategy-label">Strategy:</span>
                <button
                  className={`ds-strategy-btn ${strategyMode === "ko" ? "ds-strategy-active-ko" : ""}`}
                  onClick={() => setStrategyMode("ko")}
                >
                  ✂ Knock-Out (NHEJ)
                </button>
                <button
                  className={`ds-strategy-btn ${strategyMode === "ki" ? "ds-strategy-active-ki" : ""}`}
                  onClick={() => setStrategyMode("ki")}
                >
                  ✎ Knock-In (HDR)
                </button>
                <span className="ds-strategy-hint">
                  {strategyMode === "ko"
                    ? "NHEJ — cuts both strands; cell repairs by error-prone ligation → indels or deletion"
                    : "HDR — requires donor template; high-fidelity insertion; works best in dividing cells (~1–5% efficiency)"}
                </span>
              </div>

              {/* ── KI Donor Template Panel ──────────────────── */}
              {strategyMode === "ki" && (
                <div className="ds-card ds-ki-panel">
                  <div className="ds-ki-header">
                    <span className="ds-ki-badge">HDR</span>
                    <p className="ds-card-label" style={{ margin: 0 }}>Donor Template</p>
                  </div>
                  <p className="ds-card-hint" style={{ marginBottom: 10 }}>
                    Paste your ssDNA or dsDNA donor sequence. Homology arms (~50–200 bp flanking each cut site) improve HDR efficiency. The payload (corrected sequence, tag, or transgene) goes between the arms.
                  </p>
                  <textarea
                    className="input ds-seq-input ds-donor-input"
                    placeholder={"5'—[Left homology arm ~80 bp]—[Payload]—[Right homology arm ~80 bp]—3'"}
                    value={donorTemplate}
                    onChange={(e) => setDonorTemplate(e.target.value)}
                  />
                  <div className="ds-ki-tips">
                    <div className="ds-ki-tip"><span className="ds-ki-tip-icon">⚡</span>Use ssDNA (ssODN) for small corrections (&lt;100 bp payload)</div>
                    <div className="ds-ki-tip"><span className="ds-ki-tip-icon">🎯</span>Cut site should be within 10 bp of your desired insertion point</div>
                    <div className="ds-ki-tip"><span className="ds-ki-tip-icon">⚠</span>Mutate the PAM in your donor to prevent re-cutting after HDR</div>
                    <div className="ds-ki-tip"><span className="ds-ki-tip-icon">🔬</span>Efficiency in HSCs: ~1–5% (Cas9) vs ~40–60% (base editor) for SNPs</div>
                  </div>
                </div>
              )}

              <div className="ds-two-col">
                <div id="tour-sequence-input" className="ds-card">
                  <p className="ds-card-label" style={{ marginBottom: 12 }}>{T.seqInputLabel}</p>
                  <p className="ds-card-hint">{T.seqInputHint}</p>
                  <textarea
                    className="input ds-seq-input"
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                  />
                  <div className="ds-seq-stats">
                    <span>{T.seqRawChars} <b>{cleaned.stats.rawChars}</b></span>
                    <span>{T.seqCleaned} <b>{cleaned.stats.cleanedLength} bp</b></span>
                  </div>
                  <div className="ds-btn-row">
                    <button className="btn btnPrimary" onClick={loadDemo}>{T.btnResetDemo}</button>
                    <button className="btn" onClick={clearSelection}>{T.btnClearSel}</button>
                  </div>
                </div>

                <div className="ds-card">
                  <p className="ds-card-label" style={{ marginBottom: 12 }}>{T.filtersLabel}</p>
                  <p className="ds-card-hint">{T.filtersHint}</p>

                  <div className="ds-filter-group">
                    <span className="ds-filter-label">{T.strandLabel}</span>
                    <div className="ds-btn-row">
                      {(["both", "+", "-"] as const).map((v) => (
                        <button
                          key={v}
                          className={`btn btn-sm ${strandFilter === v ? "btn-active" : ""}`}
                          onClick={() => setStrandFilter(v)}
                        >
                          {v === "both" ? T.strandBoth : v === "+" ? T.strandFwd : T.strandRev}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="ds-filter-group">
                    <span className="ds-filter-label">{T.gcLabel} <span className="ds-filter-hint">{T.gcOptimal}</span></span>
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
                    <span>{T.hideWarnLabel}</span>
                  </label>
                </div>
              </div>

              <div className="ds-card ds-card-full" style={{ marginTop: 20 }}>
                <p className="ds-card-label" style={{ marginBottom: 14 }}>{T.genomeMapLabel}</p>
                <SequenceTrack
                  seqLength={cleaned.cleaned.length}
                  guides={guides}
                  selectedIds={selectedIds}
                  onSelectGuide={selectGuide}
                  pair={pair}
                />
              </div>

              {/* Off-target heatmap */}
              {guides.length > 0 && (
                <div id="tour-heatmap" className="ds-card ds-card-full" style={{ marginTop: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <p className="ds-card-label" style={{ margin: 0 }}>Guide Quality Heatmap</p>
                    <span className="ds-heuristic-tag">{T.heuristicBadge}</span>
                  </div>
                  <p className="ds-card-hint" style={{ marginBottom: 14 }}>On-target score per candidate guide (heuristic approximation). Color indicates predicted relative efficiency. Click to select.</p>
                  <div className="ot-heatmap">
                    {guides.slice(0, 40).map((g) => {
                      const score = g.onTarget?.score ?? 50;
                      const color = score >= 70 ? "#69f0ae" : score >= 45 ? "#ffca28" : "#ef5350";
                      const isSel = selectedIds.includes(g.id);
                      return (
                        <div
                          key={g.id}
                          className={`ot-cell ${isSel ? "ot-cell-selected" : ""}`}
                          style={{ background: `${color}${isSel ? "ff" : "55"}`, borderColor: isSel ? color : "transparent" }}
                          title={`${g.id} — Score: ${score.toFixed(0)} | GC: ${(g.gcFrac * 100).toFixed(0)}% | ${g.strand === "+" ? "Forward" : "Reverse"} | Warnings: ${g.warnings.length}`}
                          onClick={() => selectGuide(g.id)}
                        >
                          <span className="ot-cell-id">{g.id}</span>
                          <span className="ot-cell-score" style={{ color }}>{score.toFixed(0)}</span>
                          {g.warnings.length > 0 && <span className="ot-warn-flag">⚠</span>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="ot-legend">
                    <span className="ot-leg-item"><span className="ot-leg-dot" style={{ background: "#69f0ae" }} /> High ≥70</span>
                    <span className="ot-leg-item"><span className="ot-leg-dot" style={{ background: "#ffca28" }} /> Medium 45–69</span>
                    <span className="ot-leg-item"><span className="ot-leg-dot" style={{ background: "#ef5350" }} /> Low &lt;45</span>
                    <span className="ot-leg-item"><span style={{ opacity: 0.7 }}>⚠</span> Has design warnings</span>
                  </div>
                </div>
              )}

              <div id="tour-guide-table" className="ds-two-col" style={{ marginTop: 20 }}>
                <div className="ds-card">
                  <p className="ds-card-label" style={{ marginBottom: 14 }}>{T.guidesLabel}</p>
                  <GuideTable
                    guides={guides}
                    selectedIds={selectedIds}
                    onSelectGuide={selectGuide}
                    hideWarnings={hideWarn}
                  />
                </div>

                <div className={`ds-card ds-card-outcome ${pair ? "ds-card-outcome-active" : ""}`}>
                  <p className="ds-card-label" style={{ marginBottom: 14 }}>{T.outcomeLabel}</p>

                  {feasibility !== null ? (
                    <div className="ds-feasibility">
                      <div className="ds-feasibility-header">
                        <span className="ds-feasibility-label">{T.designScoreLabel}</span>
                        <span className="ds-feasibility-value" style={{ color: feasColor }}>
                          {feasibility}
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
                        {feasibility > 70 ? T.effHigh
                          : feasibility > 40 ? T.effMed
                          : T.effLow}
                      </div>
                      <div className="ds-feasibility-note">{T.designScoreNote}</div>
                    </div>
                  ) : (
                    <div className="ds-outcome-empty">
                      <span className="ds-outcome-empty-icon">⬡</span>
                      <span>{T.selectGuides}</span>
                    </div>
                  )}

                  <PairInspector pair={pair} seqLength={cleaned.cleaned.length} feasibility={feasibility} />
                </div>
              </div>
            </section>

            {/* ── 03 EXPORT ───────────────────────────────────── */}
            <section className="ds-section" id="export">
              <div className="ds-section-header">
                <span className="ds-section-tag">03</span>
                <h2 className="ds-section-title">{T.sectionExport}</h2>
              </div>

              <div id="tour-export" className="ds-card ds-export-card">
                <div className="ds-export-body">
                  <div>
                    <p className="ds-card-label" style={{ marginBottom: 8 }}>{T.exportTitle}</p>
                    <p className="ds-card-hint">{T.exportHint}</p>
                  </div>
                  <div className="ds-btn-row">
                    <button className="btn" onClick={() => exportCandidatesCSV(guides)}>
                      {T.btnExportCSV}
                    </button>
                    <button
                      className="btn btnPrimary"
                      disabled={!pair}
                      onClick={() => pair && exportSelectedPairPDF(pair, cleaned.cleaned, strategyMode, donorTemplate)}
                    >
                      {T.btnExportPDF}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div style={{ height: 60 }} />
          </main>

          {/* ── Guided Tour ──────────────────────────────── */}
          {showTour && <GuidedTour onDone={handleTourDone} />}

          {/* ── Designer Help Modal ──────────────────────── */}
          {showHelp && (
            <div className="help-overlay" onClick={() => setShowHelp(false)}>
              <div className="help-modal" onClick={e => e.stopPropagation()}>
                <div className="help-modal-header">
                  <h2 className="help-modal-title">Designer Tool — Quick Guide</h2>
                  <button className="help-modal-close" onClick={() => setShowHelp(false)}>✕</button>
                </div>
                <div className="help-modal-body">

                  <div className="help-section">
                    <div className="help-section-title">🧬 What is this tool?</div>
                    <p className="help-section-text">
                      The Designer Tool lets you design real CRISPR-Cas9 guide RNA pairs for any DNA sequence.
                      It finds all valid gRNA candidates (NGG PAM sites), scores them for on-target efficiency,
                      and visualises the full CRISPR process in 3D — from gRNA binding to DNA repair.
                    </p>
                  </div>

                  <div className="help-section">
                    <div className="help-section-title">🗺 The 3 Sections</div>
                    <div className="help-steps">
                      {[
                        { n: "01", title: "Biology — The 3D Simulation", body: "Shows a live 3D DNA double helix. Once you select two guide RNAs below, it animates the full CRISPR process: gRNA search → Cas9 binding → DNA cleavage → repair. The simulation changes based on KO vs KI strategy." },
                        { n: "02", title: "Designer Console — Your Workspace", body: "Load a scenario card or paste your own DNA sequence. Choose KO or KI strategy. The tool scans for all NGG PAM sites and scores each candidate gRNA. Click two guides in the table or heatmap to define your deletion/insertion pair." },
                        { n: "03", title: "Results — Export", body: "Download a PDF lab report with guide sequences, scores, deletion size, clinical context, and beginner explanations. Or export all candidates as a CSV spreadsheet." },
                      ].map(s => (
                        <div className="help-step" key={s.n}>
                          <span className="help-step-num">{s.n}</span>
                          <div>
                            <div className="help-step-title">{s.title}</div>
                            <div className="help-step-body">{s.body}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="help-section">
                    <div className="help-section-title">✂ KO vs KI — What's the difference?</div>
                    <div className="help-ko-ki">
                      <div className="help-ko">
                        <div className="help-mode-badge" style={{ background: "#1e3a5f" }}>KO — Knock-Out</div>
                        <div className="help-mode-title">NHEJ Repair</div>
                        <div className="help-mode-body">
                          Cas9 makes two cuts. The cell repairs with NHEJ — an error-prone process creating small indels (insertions/deletions) that disrupt the gene. The 3D sim shows the cut segment being excised and ends snapping back together. Used to disable a gene.
                        </div>
                      </div>
                      <div className="help-ki">
                        <div className="help-mode-badge" style={{ background: "#064e3b" }}>KI — Knock-In</div>
                        <div className="help-mode-title">HDR Repair</div>
                        <div className="help-mode-body">
                          Cas9 creates a DSB. A donor template is used as a precise repair blueprint (HDR). The 3D sim shows the gap staying open, then a <strong style={{ color: "#4ade80" }}>green donor helix</strong> materialising and integrating. Efficiency: ~1–5% in most cell types.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="help-section">
                    <div className="help-section-title">🎯 How to select guides</div>
                    <p className="help-section-text">
                      Click any <strong>scenario card</strong> to auto-load a real clinical target (sequence, strategy, donor pre-filled).
                      Or paste your own FASTA/plain DNA sequence. Then click <strong>two rows</strong> in the Guide Table or two cells in the Heatmap — first click = Guide 1, second click = Guide 2. Their positions define the cut pair.
                    </p>
                  </div>

                  <div className="help-section">
                    <div className="help-section-title">📊 What do the scores mean?</div>
                    <p className="help-section-text">
                      The <strong>on-target score (0–100)</strong> is a heuristic estimate of guide efficiency. Higher is better. Ideal guides have 40–60% GC content, no self-complementarity, no poly-T runs, and target early exons (for KO). The <strong>Design Score</strong> combines both guides. Scores ≥70 = High, 45–69 = Medium, &lt;45 = Low.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── FOOTER ── */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brandDot" style={{ width: 7, height: 7 }} />
            <span className="footer-brand-name">CRISPR LAB v2.0</span>
          </div>
          <p className="footer-tagline">{T.footerTagline}</p>
          <div className="footer-links">
            <span className="footer-links-label">{T.footerSources}:</span>
            <a href="https://www.genome.gov/about-genomics/fact-sheets/Genomics-and-Medicine" target="_blank" rel="noreferrer">NIH Genome</a>
            <a href="https://www.broadinstitute.org/what-broad/areas-focus/project-spotlight/questions-and-answers-about-crispr" target="_blank" rel="noreferrer">Broad Institute</a>
            <a href="https://www.who.int/health-topics/human-genome-editing" target="_blank" rel="noreferrer">WHO</a>
            <a href="https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/casgevy-exagamglogene-autotemcel" target="_blank" rel="noreferrer">FDA — Casgevy</a>
          </div>
          <p className="footer-disclaimer">{T.footerDisclaimer}</p>
          <p className="footer-made">{T.footerMade}</p>
        </div>
      </footer>
    </div>

    {/* Search modal — rendered outside pageWrap for clean overlay */}
    {showSearch && (
      <SearchModal
        onClose={() => setShowSearch(false)}
        onNavigate={(page) => setActivePage(page as ActivePage)}
      />
    )}
    </LangContext.Provider>
  );
}
