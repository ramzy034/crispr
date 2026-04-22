import { motion } from "framer-motion";
import { FlaskConical, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useLang } from "../lib/LangContext";
import { UI } from "../lib/translations";

export default function MethodologyPage() {
  const { lang } = useLang();
  const T = UI[lang];

  return (
    <div className="mp-root">
      <div className="lp-orb lp-orb-1" style={{ top: "5%", left: "70%" }} />
      <div className="lp-orb lp-orb-2" style={{ top: "45%", left: "8%" }} />

      {/* Hero */}
      <section className="mp-hero">
        <motion.div
          className="mp-hero-inner"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mp-hero-badge">
            <FlaskConical size={13} />
            {T.mpBadge}
          </div>
          <h1 className="mp-title">{T.mpTitle}</h1>
          <p className="mp-sub">{T.mpSub}</p>
        </motion.div>
      </section>

      <div className="mp-content">

        {/* ── ON-TARGET SCORING ── */}
        <motion.div
          className="mp-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          <div className="mp-card-header">
            <CheckCircle size={17} color="#69f0ae" />
            <h2 className="mp-card-title">{T.mpOnTargetTitle}</h2>
            <span className="mp-heuristic-badge">{T.heuristicBadge}</span>
          </div>
          <p className="mp-card-body">{T.mpOnTargetBody}</p>

          <div className="mp-formula-box">
            <div className="mp-formula-title">{T.mpFormula}</div>
            <div className="mp-formula-items">
              <div className="mp-formula-row mp-formula-base">
                <span className="mp-formula-term">Base score</span>
                <span className="mp-formula-val mp-val-pos">100 pts</span>
              </div>
              <div className="mp-formula-row">
                <span className="mp-formula-term">GC deviation from 0.50 <span className="mp-formula-aside">(|GC − 0.50| × 120)</span></span>
                <span className="mp-formula-val mp-val-neg">−0 to −60 pts</span>
              </div>
              <div className="mp-formula-row">
                <span className="mp-formula-term">Ambiguous base (N)</span>
                <span className="mp-formula-val mp-val-neg">−40 pts</span>
              </div>
              <div className="mp-formula-row">
                <span className="mp-formula-term">PolyT run ≥ 4 nt <span className="mp-formula-aside">(U6 promoter termination risk)</span></span>
                <span className="mp-formula-val mp-val-neg">−12 pts</span>
              </div>
              <div className="mp-formula-row">
                <span className="mp-formula-term">Homopolymer ≥ 4 bp <span className="mp-formula-aside">(−6 pts per extra bp above 3)</span></span>
                <span className="mp-formula-val mp-val-neg">−6+ pts</span>
              </div>
              <div className="mp-formula-row">
                <span className="mp-formula-term">Simple dinucleotide repeat</span>
                <span className="mp-formula-val mp-val-neg">−10 pts</span>
              </div>
              <div className="mp-formula-row">
                <span className="mp-formula-term">Self-complementarity <span className="mp-formula-aside">(6-mer appears in reverse complement)</span></span>
                <span className="mp-formula-val mp-val-neg">−12 pts</span>
              </div>
              <div className="mp-formula-row">
                <span className="mp-formula-term">Too close to sequence boundary</span>
                <span className="mp-formula-val mp-val-neg">−50 pts</span>
              </div>
            </div>
          </div>

          <div className="mp-note">
            <Info size={13} />
            <span>{T.mpOnTargetNote}</span>
          </div>
        </motion.div>

        {/* ── OFF-TARGET RISK ── */}
        <motion.div
          className="mp-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="mp-card-header">
            <AlertTriangle size={17} color="#ffb74d" />
            <h2 className="mp-card-title">{T.mpOffTargetTitle}</h2>
            <span className="mp-heuristic-badge">{T.heuristicBadge}</span>
          </div>
          <p className="mp-card-body">{T.mpOffTargetBody}</p>

          <div className="mp-comparison-grid">
            <div className="mp-compare-box mp-compare-does">
              <div className="mp-compare-label" style={{ color: "#69f0ae" }}>
                ✓ {T.mpWhatItDoes}
              </div>
              <ul className="mp-compare-list">
                <li>{T.mpOffDoes1}</li>
                <li>{T.mpOffDoes2}</li>
                <li>{T.mpOffDoes3}</li>
              </ul>
            </div>
            <div className="mp-compare-box mp-compare-doesnt">
              <div className="mp-compare-label" style={{ color: "#ef9a9a" }}>
                ✗ {T.mpWhatItDoesnt}
              </div>
              <ul className="mp-compare-list">
                <li>{T.mpOffDoesnt1}</li>
                <li>{T.mpOffDoesnt2}</li>
                <li>{T.mpOffDoesnt3}</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* ── KO vs KI ── */}
        <motion.div
          className="mp-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <div className="mp-card-header">
            <CheckCircle size={17} color="#4fc3f7" />
            <h2 className="mp-card-title">{T.mpKoKiTitle}</h2>
          </div>
          <p className="mp-card-body">{T.mpKoKiBody}</p>

          <div className="mp-comparison-grid">
            <div className="mp-compare-box" style={{ borderColor: "#ef535044" }}>
              <div className="mp-compare-label" style={{ color: "#ef9a9a" }}>
                Knockout (KO) — Gene Disruption
              </div>
              <ul className="mp-compare-list">
                <li>Uses NHEJ (error-prone) repair pathway</li>
                <li>Single or paired cuts → small indel or large deletion</li>
                <li>Frameshift mutation → premature stop codon</li>
                <li>No donor template required</li>
                <li>Works in both dividing and non-dividing cells</li>
                <li className="mp-compare-highlight">This tool is designed for KO / paired-deletion strategy</li>
              </ul>
            </div>
            <div className="mp-compare-box" style={{ borderColor: "#81c78444" }}>
              <div className="mp-compare-label" style={{ color: "#81c784" }}>
                Knock-in (KI) — Precise Correction
              </div>
              <ul className="mp-compare-list">
                <li>Uses HDR (high-fidelity) repair pathway</li>
                <li>Requires a DNA donor template (ssODN or plasmid)</li>
                <li>Introduces a specific, intended sequence change</li>
                <li>Low efficiency; primarily works in dividing cells</li>
                <li>Ideal for disease correction rather than disruption</li>
                <li className="mp-compare-highlight">Not modelled in this tool</li>
              </ul>
            </div>
          </div>

          <div className="mp-note">
            <Info size={13} />
            <span>{T.mpKoKiNote}</span>
          </div>
        </motion.div>

        {/* ── PAIR FEASIBILITY ── */}
        <motion.div
          className="mp-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="mp-card-header">
            <CheckCircle size={17} color="#ce93d8" />
            <h2 className="mp-card-title">{T.mpPairTitle}</h2>
            <span className="mp-heuristic-badge">{T.heuristicBadge}</span>
          </div>
          <p className="mp-card-body">{T.mpPairBody}</p>

          <div className="mp-formula-box">
            <div className="mp-formula-title">{T.mpFormula}</div>
            <div className="mp-formula-items">
              <div className="mp-formula-row mp-formula-base">
                <span className="mp-formula-term">Base score</span>
                <span className="mp-formula-val mp-val-pos">85 pts</span>
              </div>
              <div className="mp-formula-row">
                <span className="mp-formula-term">GC of either guide outside 40–60% <span className="mp-formula-aside">(per guide)</span></span>
                <span className="mp-formula-val mp-val-neg">−15 pts</span>
              </div>
              <div className="mp-formula-row">
                <span className="mp-formula-term">Predicted deletion &gt; 1000 bp</span>
                <span className="mp-formula-val mp-val-neg">−20 pts</span>
              </div>
              <div className="mp-formula-row">
                <span className="mp-formula-term">Minimum clamped score</span>
                <span className="mp-formula-val" style={{ color: "#4fc3f7" }}>10 pts</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── LIMITATIONS ── */}
        <motion.div
          className="mp-card mp-card-warning"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
        >
          <div className="mp-card-header">
            <AlertTriangle size={17} color="#ef9a9a" />
            <h2 className="mp-card-title" style={{ color: "#ef9a9a" }}>{T.mpLimTitle}</h2>
          </div>
          <ul className="mp-lim-list">
            <li>{T.mpLim1}</li>
            <li>{T.mpLim2}</li>
            <li>{T.mpLim3}</li>
            <li>{T.mpLim4}</li>
            <li>{T.mpLim5}</li>
            <li>{T.mpLim6}</li>
          </ul>
        </motion.div>

        {/* ── SCORE INTERPRETATION ── */}
        <motion.div
          className="mp-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="mp-card-header">
            <Info size={17} color="#4fc3f7" />
            <h2 className="mp-card-title">{T.mpInterpTitle}</h2>
          </div>

          <div className="mp-score-guide">
            <div className="mp-score-tier" style={{ borderColor: "#69f0ae33" }}>
              <span className="mp-score-range" style={{ color: "#69f0ae" }}>70–100</span>
              <div>
                <div className="mp-score-tier-label" style={{ color: "#69f0ae" }}>{T.mpScoreHigh}</div>
                <div className="mp-score-tier-body">{T.mpScoreHighNote}</div>
              </div>
            </div>
            <div className="mp-score-tier" style={{ borderColor: "#ffca2833" }}>
              <span className="mp-score-range" style={{ color: "#ffca28" }}>45–69</span>
              <div>
                <div className="mp-score-tier-label" style={{ color: "#ffca28" }}>{T.mpScoreMed}</div>
                <div className="mp-score-tier-body">{T.mpScoreMedNote}</div>
              </div>
            </div>
            <div className="mp-score-tier" style={{ borderColor: "#ef535033" }}>
              <span className="mp-score-range" style={{ color: "#ef5350" }}>0–44</span>
              <div>
                <div className="mp-score-tier-label" style={{ color: "#ef5350" }}>{T.mpScoreLow}</div>
                <div className="mp-score-tier-body">{T.mpScoreLowNote}</div>
              </div>
            </div>
          </div>

          <div className="mp-note" style={{ marginTop: 20 }}>
            <Info size={13} />
            <span>{T.mpInterpNote}</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
