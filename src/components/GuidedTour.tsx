import { useState, useEffect, useCallback } from "react";

// ── Tour step definitions ─────────────────────────────────────────
const PAD     = 12;   // spotlight padding around target
const TIP_W   = 330;  // tooltip width
const OFFSET  = 18;   // gap between spotlight edge and tooltip

type Side = "top" | "bottom" | "left" | "right" | "center";

type TourStep = {
  id: string;
  selector?: string;
  title: string;
  body: string;
  side?: Side;
};

const STEPS: TourStep[] = [
  {
    id: "welcome",
    side: "center",
    title: "Welcome to the Designer Tool! 🧬",
    body: "This is your virtual CRISPR lab. We'll walk through each section one by one — it takes about 60 seconds. Press Next or click anywhere on the dark overlay to continue.",
  },
  {
    id: "sim",
    selector: "#tour-3d-sim",
    side: "left",
    title: "Live 3D DNA Simulation",
    body: "A real-time 3D model of the DNA double helix. Once you select two guide RNAs below, it animates the full CRISPR process: gRNA search → Cas9 binding → DNA cleavage → repair. KO and KI look completely different — KI shows a green donor helix growing in!",
  },
  {
    id: "scenarios",
    selector: "#tour-scenarios",
    side: "bottom",
    title: "Interactive Lab Scenarios",
    body: "Real clinical CRISPR experiments — one click loads a full sequence, strategy, and donor template. Try PCSK9 KO to start (easy). Red 'Impossible' cards explain why some targets — like mitochondrial DNA — can't be edited with standard Cas9.",
  },
  {
    id: "strategy",
    selector: "#tour-strategy",
    side: "bottom",
    title: "Choose Your Strategy",
    body: "Knock-Out (KO) uses error-prone NHEJ repair to disrupt a gene — fast, easy, but imprecise. Knock-In (KI) uses HDR with a donor template for exact sequence insertion — powerful but requires a donor and ~1–5% efficiency. Your choice updates the 3D simulation and PDF report.",
  },
  {
    id: "sequence",
    selector: "#tour-sequence-input",
    side: "right",
    title: "DNA Sequence Input",
    body: "Paste any DNA sequence here — plain bases or FASTA format. The tool scans every 23-nt window for NGG PAM sites and scores each gRNA candidate. A demo sequence is pre-loaded so you can explore right away.",
  },
  {
    id: "heatmap",
    selector: "#tour-heatmap",
    side: "top",
    title: "Guide Quality Heatmap",
    body: "Each square is a candidate gRNA coloured by predicted on-target efficiency. Green (≥70) is ideal. Click any square to select it as Guide 1 or Guide 2. Aim for two high-scoring guides that flank your target region.",
  },
  {
    id: "table",
    selector: "#tour-guide-table",
    side: "top",
    title: "Candidate Guide Table",
    body: "Full details for every guide: sequence (5'→3'), genomic position, strand, GC%, on-target score, and design warnings. Click a row to select it. You need exactly two guides — they define the DNA segment to cut or correct.",
  },
  {
    id: "export",
    selector: "#tour-export",
    side: "top",
    title: "Export Your Results",
    body: "Once two guides are selected, download a professional PDF lab report with guide sequences, scores, deletion size, KO/KI strategy details, and beginner-friendly explanations. Share with your teacher or lab partner!",
  },
];

// ── Component ─────────────────────────────────────────────────────
export default function GuidedTour({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast  = step === STEPS.length - 1;

  const updateRect = useCallback(() => {
    if (!current.selector) { setRect(null); return; }
    const el = document.querySelector(current.selector);
    if (!el) { setRect(null); return; }
    setRect(el.getBoundingClientRect());
  }, [current.selector]);

  // When step changes: scroll to target, then measure
  useEffect(() => {
    if (!current.selector) { setRect(null); return; }
    const el = document.querySelector(current.selector);
    if (!el) { setRect(null); return; }
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(updateRect, 560);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Keep rect fresh during scroll/resize
  useEffect(() => {
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [updateRect]);

  const goNext = () => (isLast ? onDone() : setStep(s => s + 1));
  const goPrev = () => { if (!isFirst) setStep(s => s - 1); };

  // ── Compute spotlight dimensions (clamp tall elements) ───────────
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  // If the element is taller than 48 % of the viewport, only spotlight
  // its top portion (the header / first visible strip) and center the tooltip
  // so the user never needs to scroll to click Next.
  const MAX_SPOT_H = Math.round(vh * 0.48);
  const spotH      = rect ? Math.min(rect.height, MAX_SPOT_H) : 0;
  const isClipped  = Boolean(rect && rect.height > MAX_SPOT_H);

  // ── Compute tooltip position ────────────────────────────────────
  let tipStyle: React.CSSProperties = { position: "fixed", zIndex: 9004, width: TIP_W };
  let arrowSide: Side | null = null;

  // Always center when: no rect, welcome step, or element taller than viewport slice
  if (!rect || current.side === "center" || isClipped) {
    tipStyle = { ...tipStyle, top: "50%", left: "50%", transform: "translate(-50%,-50%)" };
  } else {
    const side = current.side ?? "bottom";
    if (side === "bottom") {
      tipStyle.top  = rect.bottom + PAD + OFFSET;
      tipStyle.left = clamp(rect.left + rect.width / 2 - TIP_W / 2, 12, vw - TIP_W - 12);
      arrowSide = "top";
    } else if (side === "top") {
      tipStyle.bottom = vh - (rect.top - PAD - OFFSET);
      tipStyle.left   = clamp(rect.left + rect.width / 2 - TIP_W / 2, 12, vw - TIP_W - 12);
      arrowSide = "bottom";
    } else if (side === "right") {
      const lx = rect.right + PAD + OFFSET;
      if (lx + TIP_W < vw - 12) {
        tipStyle.left = lx;
        arrowSide = "left";
      } else {
        tipStyle.right = vw - (rect.left - PAD - OFFSET);
        arrowSide = "right";
      }
      tipStyle.top = clamp(rect.top + rect.height / 2 - 110, 12, vh - 280);
    } else {
      tipStyle.right = vw - (rect.left - PAD - OFFSET);
      tipStyle.top   = clamp(rect.top + rect.height / 2 - 110, 12, vh - 280);
      arrowSide = "right";
    }
  }

  // Arrow — a small rotated square showing which way the tooltip points
  const arrowBase: React.CSSProperties = {
    position: "absolute", width: 11, height: 11, background: "#0d1628",
  };
  const bdr = "1px solid rgba(54,140,255,0.38)";
  const arrowStyle: React.CSSProperties = (() => {
    if (arrowSide === "top")    return { ...arrowBase, top: -7,  left: "50%", transform: "translateX(-50%) rotate(45deg)", borderTop: bdr, borderLeft: bdr };
    if (arrowSide === "bottom") return { ...arrowBase, bottom: -7, left: "50%", transform: "translateX(-50%) rotate(45deg)", borderBottom: bdr, borderRight: bdr };
    if (arrowSide === "left")   return { ...arrowBase, left: -7, top: 90, transform: "translateY(-50%) rotate(45deg)", borderBottom: bdr, borderLeft: bdr };
    if (arrowSide === "right")  return { ...arrowBase, right: -7, top: 90, transform: "translateY(-50%) rotate(45deg)", borderTop: bdr, borderRight: bdr };
    return { display: "none" };
  })();

  return (
    <>
      {/* ── SVG overlay with spotlight punch-through ────────────── */}
      <svg style={{
        position: "fixed", inset: 0, zIndex: 9000,
        width: "100vw", height: "100vh", pointerEvents: "none",
      }}>
        <defs>
          <mask id="tour-spot-mask">
            <rect width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.left - PAD} y={rect.top - PAD}
                width={rect.width + PAD * 2} height={spotH + PAD * 2}
                rx={10} ry={10} fill="black"
              />
            )}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(2,5,18,0.84)" mask="url(#tour-spot-mask)" />
      </svg>

      {/* ── Click backdrop to advance ─────────────────────────────── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 9001, cursor: "pointer" }} onClick={goNext} />

      {/* ── Spotlight glow border ─────────────────────────────────── */}
      {rect && (
        <div style={{
          position: "fixed",
          left: rect.left - PAD, top: rect.top - PAD,
          width: rect.width + PAD * 2, height: spotH + PAD * 2,
          borderRadius: 12,
          border: "2px solid rgba(54,140,255,0.85)",
          boxShadow: "0 0 0 4px rgba(54,140,255,0.15), 0 0 48px rgba(54,140,255,0.22)",
          zIndex: 9002, pointerEvents: "none",
          transition: "left .32s ease, top .32s ease, width .32s ease, height .32s ease",
        }} />
      )}

      {/* ── Progress dots ─────────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
        zIndex: 9005, display: "flex", gap: 5, alignItems: "center",
        background: "rgba(4,7,20,0.80)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.10)", borderRadius: 99, padding: "5px 11px",
      }}>
        {STEPS.map((_, i) => (
          <div
            key={i}
            onClick={e => { e.stopPropagation(); setStep(i); }}
            style={{
              width: i === step ? 20 : 7, height: 7, borderRadius: 4,
              background: i === step ? "#368cff" : i < step ? "rgba(54,140,255,0.42)" : "rgba(255,255,255,0.16)",
              cursor: "pointer", transition: "all 0.25s",
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* ── Tooltip card ──────────────────────────────────────────── */}
      <div
        style={{
          ...tipStyle,
          background: "linear-gradient(150deg, #0e1829 0%, #0b1120 100%)",
          border: "1px solid rgba(54,140,255,0.38)",
          borderRadius: 14, padding: "18px 20px 16px",
          boxShadow: "0 28px 80px rgba(0,0,0,0.70), 0 0 0 1px rgba(54,140,255,0.08)",
          animation: "tourCardIn .20s ease",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Arrow nub */}
        <div style={arrowStyle} />

        {/* Top row: step counter + skip */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{
            fontSize: 9, fontWeight: 900, letterSpacing: "0.18em",
            color: "#368cff", fontFamily: "monospace",
            background: "rgba(54,140,255,0.13)", border: "1px solid rgba(54,140,255,0.28)",
            borderRadius: 5, padding: "2px 7px",
          }}>
            STEP {step + 1} / {STEPS.length}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onDone(); }}
            style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.25)",
              cursor: "pointer", fontSize: 11, padding: "2px 4px",
              fontFamily: "inherit", lineHeight: 1,
            }}
          >
            Skip ✕
          </button>
        </div>

        {/* Title */}
        <h3 style={{ margin: "0 0 8px", fontSize: 14.5, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.35 }}>
          {current.title}
        </h3>

        {/* Body */}
        <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "rgba(255,255,255,0.63)", lineHeight: 1.65 }}>
          {current.body}
        </p>

        {/* Nav buttons */}
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          <button
            onClick={e => { e.stopPropagation(); goPrev(); }}
            disabled={isFirst}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700,
              color: isFirst ? "rgba(255,255,255,0.17)" : "rgba(255,255,255,0.58)",
              cursor: isFirst ? "not-allowed" : "pointer", fontFamily: "inherit",
            }}
          >
            ← Back
          </button>
          <button
            onClick={e => { e.stopPropagation(); goNext(); }}
            style={{
              background: "linear-gradient(135deg, #1d4ed8 0%, #368cff 100%)",
              border: "none", borderRadius: 8, padding: "7px 22px",
              fontSize: 12, fontWeight: 800, color: "#fff",
              cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.04em",
              boxShadow: "0 4px 18px rgba(54,140,255,0.42)",
            }}
          >
            {isLast ? "Start Designing 🚀" : "Next →"}
          </button>
        </div>
      </div>
    </>
  );
}
