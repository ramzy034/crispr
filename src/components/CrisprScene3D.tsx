import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Float, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import type { PairInfo } from "../types";

// ── B-form DNA parameters ─────────────────────────────────────────
// B-DNA: pitch ≈ 3.4 nm/turn, diameter ≈ 2 nm → pitch/diameter ≈ 1.7
// With radius=1.5 (diameter=3.0) and 3 turns → pitch = H/turns = 10/3 = 3.33
// Rung spacing = pitch / bpPerTurn = 3.33 / 9 = 0.37  (rung Ø=0.16 → no overlap ✓)
const DNA = {
  H: 10.0,
  turns: 3.0,      // 3 clean full turns — open grooves clearly visible
  radius: 1.52,    // diameter 3.04 → pitch/diameter = 1.10 (close to B-DNA)
  backboneR: 0.130, // slim but visible backbone
  rungR: 0.080,    // clean rungs with breathing room between them
};

// IUPAC base colors
const BASE_CLR: Record<string, string> = {
  A: "#4ade80",  // Adenine  — green
  T: "#f87171",  // Thymine  — red
  G: "#60a5fa",  // Guanine  — blue
  C: "#facc15",  // Cytosine — yellow
};

// Deterministic A/T/G/C sequence (A always pairs with T, G with C)
const BP_SEQ: [string, string][] = [
  ["A","T"],["G","C"],["T","A"],["C","G"],["A","T"],
  ["T","A"],["G","C"],["C","G"],["A","T"],["G","C"],
  ["T","A"],["A","T"],["C","G"],["G","C"],["T","A"],
  ["A","T"],["C","G"],["T","A"],["G","C"],["A","T"],
];
const getBP = (i: number): [string, string] => BP_SEQ[i % BP_SEQ.length];

// ── Helpers ───────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function easeOut3(t: number) { return 1 - Math.pow(1 - Math.min(1, t), 3); }

function makeHelixCurve(yFrom: number, yTo: number, phaseOff: number) {
  const N = 200;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= N; i++) {
    const t   = i / N;
    const y   = lerp(yFrom, yTo, t);
    const u   = (y + DNA.H / 2) / DNA.H;
    const ang = u * DNA.turns * Math.PI * 2 + phaseOff;
    pts.push(new THREE.Vector3(Math.cos(ang) * DNA.radius, y, Math.sin(ang) * DNA.radius));
  }
  return new THREE.CatmullRomCurve3(pts);
}

function checkPhase(current: string, target: string) {
  const order = ["target","bind","cut","delete","ligate","done"];
  return order.indexOf(current) >= order.indexOf(target);
}

// ── Shared button ─────────────────────────────────────────────────
const simBtnBase: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 7,
  padding: "8px 16px", borderRadius: 10, fontSize: 12,
  fontWeight: 700, fontFamily: "inherit", letterSpacing: "0.06em",
  cursor: "pointer", border: "1px solid", backdropFilter: "blur(12px)",
  transition: "background 0.2s, border-color 0.2s, opacity 0.2s",
  userSelect: "none", lineHeight: 1,
};

function SimButton({ icon, label, onClick, active, color = "#4fc3f7", disabled }: {
  icon: string; label: string; onClick: () => void;
  active?: boolean; color?: string; disabled?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...simBtnBase,
      background: active
        ? `rgba(${color === "#4fc3f7" ? "79,195,247" : color === "#69f0ae" ? "105,240,174" : "255,107,107"},0.18)`
        : "rgba(8,14,28,0.82)",
      borderColor: active ? color : disabled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.18)",
      color: disabled ? "rgba(255,255,255,0.25)" : color,
      cursor: disabled ? "not-allowed" : "pointer",
    }}>
      <span style={{ fontSize: 11 }}>{icon}</span>
      {label}
    </button>
  );
}

// ── Public component ──────────────────────────────────────────────
export default function CrisprScene3D(props: { pair: PairInfo | null; seqLength: number }) {
  const { pair, seqLength } = props;
  const [paused, setPaused]         = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [phase, setPhaseOut]        = useState<string>("idle");

  const cuts = useMemo(() => {
    if (!pair || seqLength <= 0) return null;
    const a  = Math.min(pair.cutLeft, pair.cutRight);
    const b  = Math.max(pair.cutLeft, pair.cutRight);
    const t1 = THREE.MathUtils.clamp(a / seqLength, 0, 1);
    const t2 = THREE.MathUtils.clamp(b / seqLength, 0, 1);
    return { t1, t2, a, b };
  }, [pair, seqLength]);

  const hasPair   = Boolean(cuts);
  const isRunning = hasPair && !paused;
  const isStopped = hasPair && paused;

  return (
    <div style={{
      width: "100%", height: "750px", position: "relative",
      background: "#05060A", borderRadius: "12px", overflow: "hidden",
    }}>
      <Canvas dpr={[1, 2]} shadows>
        <color attach="background" args={["#030407"]} />
        <PerspectiveCamera makeDefault position={[0, 0, 13]} fov={46} />

        <ambientLight intensity={0.70} />
        <spotLight position={[8, 14, 8]} angle={0.30} penumbra={0.8} intensity={1.8} castShadow />
        <pointLight position={[-6, 4, 6]}  color="#f97316" intensity={1.2} />
        <pointLight position={[6, -4, 6]}  color="#38bdf8" intensity={1.2} />
        <pointLight position={[0, 8, 4]}   color="#ffffff" intensity={0.6} />

        <Environment preset="night" />

        <GroupCrisprScene cuts={cuts} paused={paused} resetToken={resetToken} onPhaseChange={setPhaseOut} />

        <OrbitControls enablePan={false} minDistance={7} maxDistance={20}
          maxPolarAngle={Math.PI * 0.65} minPolarAngle={Math.PI * 0.28} />
        <ContactShadows opacity={0.5} scale={25} blur={2} far={10} resolution={256} color="#000000" />
      </Canvas>

      {/* ── Simulation controls ──────────────────────────────────── */}
      <div style={{
        position: "absolute", bottom: 16, left: "50%",
        transform: "translateX(-50%)", display: "flex", gap: 8, alignItems: "center",
      }}>
        <div style={{
          padding: "5px 12px", borderRadius: 99,
          background: "rgba(8,14,28,0.82)",
          border: "1px solid rgba(255,255,255,0.10)",
          backdropFilter: "blur(12px)", fontSize: 10, fontWeight: 700,
          letterSpacing: "0.12em",
          color: !hasPair ? "rgba(255,255,255,0.3)"
            : phase === "idle"  ? "rgba(255,255,255,0.4)"
            : phase === "done"  ? "#69f0ae"
            : paused            ? "#ffca28"
            : "#4fc3f7",
          fontFamily: "var(--font-mono, monospace)",
          minWidth: 110, textAlign: "center",
        }}>
          {!hasPair        ? "NO PAIR"
           : phase === "idle"   ? "IDLE"
           : phase === "target" ? "SEARCHING"
           : phase === "bind"   ? "BINDING"
           : phase === "cut"    ? "CUTTING"
           : phase === "delete" ? "EXCISING"
           : phase === "ligate" ? "REPAIRING"
           : phase === "done"   ? "COMPLETE ✓"
           : "—"}
          {paused && hasPair && phase !== "done" ? " ·· PAUSED" : ""}
        </div>

        <SimButton icon="▶" label="START"  onClick={() => setPaused(false)} active={isRunning}
          color="#4fc3f7" disabled={!hasPair || isRunning} />
        <SimButton icon="⏹" label="STOP"   onClick={() => setPaused(true)} color="#ffca28"
          disabled={!hasPair || isStopped} />
        <SimButton icon="↺" label="REPEAT" onClick={() => { setPaused(false); setResetToken(t => t+1); }}
          color="#69f0ae" disabled={!hasPair} />
      </div>

      {/* ── Base pair color legend ───────────────────────────────── */}
      <div style={{
        position: "absolute", top: 14, right: 14,
        background: "rgba(8,14,28,0.80)", border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(12px)", borderRadius: 10, padding: "10px 14px",
        display: "flex", flexDirection: "column", gap: 4,
      }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.35)", marginBottom: 2, fontFamily: "monospace" }}>
          BASE PAIRS
        </div>
        {[["A","T","#4ade80","#f87171"],["G","C","#60a5fa","#facc15"]].map(([b1,b2,c1,c2]) => (
          <div key={b1} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: c1, display: "inline-block" }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: c1, fontFamily: "monospace" }}>{b1}</span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>─</span>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: c2, display: "inline-block" }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: c2, fontFamily: "monospace" }}>{b2}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Inner scene group ─────────────────────────────────────────────
type Phase = "idle" | "target" | "bind" | "cut" | "delete" | "ligate" | "done";

function GroupCrisprScene(props: {
  cuts: null | { t1: number; t2: number; a: number; b: number };
  paused: boolean; resetToken: number; onPhaseChange: (p: string) => void;
}) {
  const { cuts, paused, resetToken, onPhaseChange } = props;
  const [phase, setPhase] = useState<Phase>("idle");

  const tRef      = useRef(0);
  const midScale  = useRef(1);
  const flash     = useRef(0);
  const snap      = useRef(0);
  const healRef   = useRef(0);   // 0→1 as DNA seals in ligate phase
  const doneT     = useRef(0);   // time elapsed in done phase
  const guideIn   = useRef(0);
  const cas9In    = useRef(0);
  const lastKey   = useRef("none");

  const key = cuts ? `${cuts.t1.toFixed(4)}-${cuts.t2.toFixed(4)}` : "none";

  function doReset(hasCuts: boolean) {
    tRef.current = 0; midScale.current = 1; flash.current = 0;
    snap.current = 0; healRef.current = 0; doneT.current = 0;
    guideIn.current = 0; cas9In.current = 0;
    const next: Phase = hasCuts ? "target" : "idle";
    setPhase(next); onPhaseChange(next);
  }

  useEffect(() => {
    if (key === lastKey.current) return;
    lastKey.current = key; doReset(Boolean(cuts));
  }, [key]);

  const prevReset = useRef(resetToken);
  useEffect(() => {
    if (prevReset.current === resetToken) return;
    prevReset.current = resetToken; doReset(Boolean(cuts));
  }, [resetToken]);

  useEffect(() => { onPhaseChange(phase); }, [phase]);

  useFrame((_, dt) => {
    if (paused || phase === "idle") return;
    tRef.current += dt;

    if (phase === "target") {
      guideIn.current = Math.min(1, guideIn.current + dt * 0.9);
      if (tRef.current > 1.5) { tRef.current = 0; setPhase("bind"); }
    } else if (phase === "bind") {
      cas9In.current = Math.min(1, cas9In.current + dt * 1.1);
      if (tRef.current > 1.2) { tRef.current = 0; setPhase("cut"); }
    } else if (phase === "cut") {
      flash.current = Math.min(1, flash.current + dt * 5.0);
      if (tRef.current > 0.5) { tRef.current = 0; setPhase("delete"); }
    } else if (phase === "delete") {
      flash.current = Math.max(0, flash.current - dt * 2.0);
      midScale.current = Math.max(0, midScale.current - dt * 1.8);
      if (midScale.current <= 0.01) { tRef.current = 0; setPhase("ligate"); }
    } else if (phase === "ligate") {
      snap.current = Math.min(1, snap.current + dt * 0.85);
      if (snap.current > 0.75) {
        healRef.current = Math.min(1, healRef.current + dt * 2.2);
      }
      if (snap.current >= 0.999) { tRef.current = 0; setPhase("done"); }
    } else if (phase === "done") {
      doneT.current += dt;
    }
  });

  const y1     = cuts ? lerp(-DNA.H / 2, DNA.H / 2, cuts.t1) : 0;
  const y2     = cuts ? lerp(-DNA.H / 2, DNA.H / 2, cuts.t2) : 0;
  const yMin   = Math.min(y1, y2);
  const yMax   = Math.max(y1, y2);
  const gap    = cuts ? yMax - yMin : 0;
  const shift  = snap.current * (gap / 2);

  const isDone = phase === "done";

  return (
    <group>
      {/* ── DNA helix ──────────────────────────────────────── */}
      <group position={[1.4, 0, 0]}>
        {/* Top segment */}
        <group position={[0, -shift, 0]}>
          <DNAHelixSegment yFrom={yMax} yTo={DNA.H / 2} healed={isDone} />
        </group>

        {/* Excised middle segment */}
        {cuts && (
          <group scale={[1, midScale.current, 1]}>
            <DNAHelixSegment yFrom={yMin} yTo={yMax} accent />
            <DeletionGlow yMin={yMin} yMax={yMax} flash={flash.current} />
            {midScale.current > 0.15 && (
              <OutlinedText pos={[0, (yMin + yMax) / 2, 2.5]} size={0.17}
                color="#E9D5FF" text="Excising…" anchor="center" />
            )}
          </group>
        )}

        {/* Bottom segment */}
        <group position={[0, shift, 0]}>
          <DNAHelixSegment yFrom={-DNA.H / 2} yTo={cuts ? yMin : DNA.H / 2} healed={isDone} />
        </group>

        {/* Cut site markers */}
        {cuts && (
          <>
            <CutMarker y={y1} flash={flash.current} label="Site A" side={1} />
            <CutMarker y={y2} flash={flash.current} label="Site B" side={1} />
            <PAMHint y={y1} side={-1} />
            <PAMHint y={y2} side={-1} />
          </>
        )}

        {/* Healing seams in ligate + done phase */}
        {cuts && (phase === "ligate" || phase === "done") && (
          <>
            <HealingSeam y={yMax - shift} progress={healRef.current} done={isDone} />
            <HealingSeam y={yMin + shift} progress={healRef.current} done={isDone} />
          </>
        )}

        {/* Done: completion glow pulse */}
        {isDone && <DonePulse t={doneT.current} />}
      </group>

      {/* ── Enzymes ───────────────────────────────────────── */}
      {cuts && phase !== "idle" && (
        <>
          <Float speed={2.5} rotationIntensity={0.25} floatIntensity={0.35}>
            <GuideRNA
              yTarget={(y1 + y2) / 2}
              progress={guideIn.current}
              intensity={phase === "target" ? 1 : 0.5}
            />
          </Float>

          <Cas9Protein
            yTarget={(y1 + y2) / 2}
            progress={cas9In.current}
            flash={flash.current}
            phase={phase}
          />

          {/* Ligase enzymes appear in ligate phase */}
          {(phase === "ligate" || phase === "done") && (
            <>
              <LigaseEnzyme
                y={yMax - shift}
                progress={snap.current}
                healed={isDone}
              />
              <LigaseEnzyme
                y={yMin + shift}
                progress={snap.current}
                healed={isDone}
                flip
              />
            </>
          )}
        </>
      )}

      <LegendPanel phase={phase} hasPair={Boolean(cuts)} cuts={cuts} />
    </group>
  );
}

// ── DNAHelixSegment ───────────────────────────────────────────────
function DNAHelixSegment({ yFrom, yTo, accent, healed }: {
  yFrom: number; yTo: number; accent?: boolean; healed?: boolean;
}) {
  const curveA = useMemo(() => makeHelixCurve(yFrom, yTo, 0),       [yFrom, yTo]);
  const curveB = useMemo(() => makeHelixCurve(yFrom, yTo, Math.PI), [yFrom, yTo]);

  // Vivid orange + sky-blue like reference image; violet when healed
  const colA = accent ? "#60a5fa" : healed ? "#c4b5fd" : "#f97316";
  const colB = accent ? "#f472b6" : healed ? "#f9a8d4" : "#38bdf8";
  const emA  = accent ? "#1d4ed8" : healed ? "#6d28d9" : "#7c2d12";
  const emB  = accent ? "#be185d" : healed ? "#9d174d" : "#0c4a6e";
  const emI  = accent ? 0.55      : healed ? 0.50      : 0.25;

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curveA, 240, DNA.backboneR, 16, false]} />
        <meshStandardMaterial color={colA} metalness={0.05} roughness={0.18}
          emissive={emA} emissiveIntensity={emI} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curveB, 240, DNA.backboneR, 16, false]} />
        <meshStandardMaterial color={colB} metalness={0.05} roughness={0.18}
          emissive={emB} emissiveIntensity={emI} />
      </mesh>
      <BasePairs yFrom={yFrom} yTo={yTo} accent={accent} />
    </group>
  );
}

// ── BasePairs — two-colored A/T/G/C half-rungs (no labels, clean) ─
function BasePairs({ yFrom, yTo, accent }: any) {
  // 10 bp per turn (B-DNA), proportional to segment length
  // Full helix (H=10, turns=3): 3×10=30 rungs, spacing=3.33/10=0.33 >> rungØ=0.16 ✓
  const count = Math.max(2, Math.round(Math.abs(yTo - yFrom) / DNA.H * DNA.turns * 10));

  const rungs = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const t    = i / (count - 1 || 1);
      const y    = lerp(yFrom, yTo, t);
      const u    = (y + DNA.H / 2) / DNA.H;
      const ang  = u * DNA.turns * Math.PI * 2;
      const pA   = new THREE.Vector3(Math.cos(ang) * DNA.radius, y, Math.sin(ang) * DNA.radius);
      const pB   = new THREE.Vector3(Math.cos(ang + Math.PI) * DNA.radius, y, Math.sin(ang + Math.PI) * DNA.radius);
      const dir  = pB.clone().sub(pA).normalize();
      const len  = pB.distanceTo(pA);
      const half = len / 2;
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      // Each half-rung center sits at 25% / 75% of the full span
      const posHalfA = pA.clone().add(dir.clone().multiplyScalar(half * 0.5));
      const posHalfB = pB.clone().sub(dir.clone().multiplyScalar(half * 0.5));
      const [baseA, baseB] = getBP(i);
      arr.push({ posHalfA, posHalfB, quat, half, baseA, baseB, i });
    }
    return arr;
  }, [yFrom, yTo, count]);

  return (
    <group>
      {rungs.map((r) => (
        <group key={r.i}>
          <mesh position={r.posHalfA} quaternion={r.quat}>
            <cylinderGeometry args={[DNA.rungR, DNA.rungR, r.half, 10]} />
            <meshStandardMaterial
              color={accent ? "#e2e8f0" : BASE_CLR[r.baseA]}
              metalness={0.05} roughness={0.30}
              emissive={accent ? "#94a3b8" : BASE_CLR[r.baseA]}
              emissiveIntensity={accent ? 0.20 : 0.10}
            />
          </mesh>
          <mesh position={r.posHalfB} quaternion={r.quat}>
            <cylinderGeometry args={[DNA.rungR, DNA.rungR, r.half, 10]} />
            <meshStandardMaterial
              color={accent ? "#e2e8f0" : BASE_CLR[r.baseB]}
              metalness={0.05} roughness={0.30}
              emissive={accent ? "#94a3b8" : BASE_CLR[r.baseB]}
              emissiveIntensity={accent ? 0.20 : 0.10}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── HealingSeam — glowing ring that appears when DNA re-ligates ───
function HealingSeam({ y, progress, done }: { y: number; progress: number; done: boolean }) {
  const g = easeOut3(progress);
  if (g < 0.05) return null;
  const col  = done ? "#fbbf24" : (g > 0.6 ? "#fbbf24" : "#4ade80");
  const opac = done ? 0.55 : Math.min(0.85, g * 1.2);
  return (
    <group position={[0, y, 0]}>
      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[DNA.radius * 1.25, 0.045, 16, 72]} />
        <meshBasicMaterial color={col} transparent opacity={opac} />
      </mesh>
      {/* Inner glow disk */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[DNA.radius * 0.9, 48]} />
        <meshBasicMaterial color={col} transparent opacity={opac * 0.18} side={THREE.DoubleSide} />
      </mesh>
      {/* Vertical seam bar */}
      <mesh>
        <cylinderGeometry args={[DNA.radius * 1.05, DNA.radius * 1.05, 0.08, 40, 1, true]} />
        <meshBasicMaterial color={col} transparent opacity={opac * 0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ── DonePulse — gold wave traveling up healed DNA ─────────────────
function DonePulse({ t }: { t: number }) {
  const frac = (t * 0.5) % 1;
  const yPos = lerp(-DNA.H / 2, DNA.H / 2, frac);
  const opac = Math.sin(frac * Math.PI) * 0.5;
  return (
    <mesh position={[0, yPos, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[DNA.radius * 1.15, 0.04, 8, 52]} />
      <meshBasicMaterial color="#fbbf24" transparent opacity={opac} />
    </mesh>
  );
}

// ── CutMarker ─────────────────────────────────────────────────────
function CutMarker({ y, flash, label, side }: any) {
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[DNA.radius * 1.38, 0.035, 16, 64]} />
        <meshBasicMaterial color={flash > 0.5 ? "#FFFFFF" : "#FBBF24"} />
      </mesh>
      <OutlinedText pos={[side * 2.6, 0.22, 0]} size={0.14} color="#FBBF24" text={label} anchor="left" />
    </group>
  );
}

// ── PAMHint ───────────────────────────────────────────────────────
function PAMHint({ y, side }: any) {
  return (
    <group position={[side * (DNA.radius + 0.65), y, 0]}>
      <mesh>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshStandardMaterial color="#FBBF24" emissive="#FBBF24" emissiveIntensity={0.6} />
      </mesh>
      <OutlinedText pos={[side * 0.32, 0.22, 0]} size={0.12} color="#FDE68A" text="PAM"
        anchor={side > 0 ? "left" : "right"} />
    </group>
  );
}

// ── DeletionGlow ──────────────────────────────────────────────────
function DeletionGlow({ yMin, yMax, flash }: any) {
  return (
    <mesh position={[0, (yMin + yMax) / 2, 0]}>
      <cylinderGeometry args={[DNA.radius * 1.8, DNA.radius * 1.8, Math.abs(yMax - yMin) + 0.1, 36, 1, true]} />
      <meshBasicMaterial color="#7c3aed" transparent opacity={0.12 + flash * 0.42} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ── GuideRNA — RNA strand with pearl nodes ────────────────────────
function GuideRNA({ yTarget, progress, intensity }: any) {
  const ease = easeOut3(progress);
  const xFrom = -3.8, xTo = -0.55;
  const xCur = lerp(xFrom, xTo, ease);

  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(xFrom, yTarget + 1.6, 1.2),
    new THREE.Vector3(xFrom + 1.2, yTarget + 0.7, 0.8),
    new THREE.Vector3(xFrom + 2.4, yTarget + 0.2, 0.4),
    new THREE.Vector3(xTo, yTarget, 0.85),
  ]), [yTarget]);

  // Bead positions along RNA curve
  const beads = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const N = 12;
    for (let i = 0; i <= N; i++) pts.push(curve.getPoint(i / N));
    return pts;
  }, [curve]);

  return (
    <group>
      {/* Main RNA tube - only render up to current progress */}
      <mesh>
        <tubeGeometry args={[curve, 80, 0.05, 10, false]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={intensity}
          transparent opacity={ease} />
      </mesh>
      {/* RNA beads */}
      {beads.map((p, i) => (
        i / beads.length <= ease && (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.065, 8, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#34d399" : "#a7f3d0"}
              emissive="#34d399" emissiveIntensity={0.4} />
          </mesh>
        )
      ))}
      <OutlinedText pos={[xCur - 0.4, yTarget + 1.8, 1.2]} size={0.16}
        color="#6ee7b7" text="gRNA" anchor="center" />
    </group>
  );
}

// ── Cas9Protein — multi-lobe protein model ────────────────────────
function Cas9Protein({ yTarget, progress, flash }: any) {
  const ease  = easeOut3(progress);
  const x     = lerp(4.0, 2.8, ease);
  const zIn   = lerp(3.5, 1.6, ease);
  const isCut = flash > 0.25;
  const mainC = isCut ? "#fbbf24" : "#818cf8";
  const mainE = isCut ? "#fbbf24" : "#4f46e5";
  const hnhC  = isCut ? "#f87171" : "#a5b4fc";
  const ruvcC = isCut ? "#f87171" : "#7dd3fc";

  return (
    <group position={[x, yTarget, zIn]} scale={[ease, ease, ease]}>
      {/* Main recognition lobe */}
      <mesh>
        <sphereGeometry args={[0.58, 22, 22]} />
        <meshStandardMaterial color={mainC} metalness={0.75} roughness={0.2}
          emissive={mainE} emissiveIntensity={isCut ? 0.9 : 0.35}
          transparent opacity={0.93} />
      </mesh>
      {/* HNH domain — cuts one strand */}
      <mesh position={[-0.52, 0.32, 0.1]}>
        <sphereGeometry args={[0.33, 16, 16]} />
        <meshStandardMaterial color={hnhC} metalness={0.7} roughness={0.2}
          emissive={isCut ? "#f43f5e" : "#6366f1"} emissiveIntensity={isCut ? 1.1 : 0.3} />
      </mesh>
      {/* RuvC domain — cuts other strand */}
      <mesh position={[0.52, -0.28, -0.1]}>
        <sphereGeometry args={[0.29, 14, 14]} />
        <meshStandardMaterial color={ruvcC} metalness={0.7} roughness={0.2}
          emissive={isCut ? "#f43f5e" : "#0ea5e9"} emissiveIntensity={isCut ? 1.1 : 0.2} />
      </mesh>
      {/* DNA-clamping torus */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.075, 14, 52]} />
        <meshStandardMaterial color={mainC} metalness={0.9} roughness={0.1}
          emissive={mainE} emissiveIntensity={isCut ? 0.8 : 0.3} />
      </mesh>
      <OutlinedText pos={[1.15, 0.35, 0]} size={0.18} color="#e0e7ff" text="Cas9" anchor="left" />
      <OutlinedText pos={[1.15, 0.0, 0]} size={0.11} color="#a5b4fc" text="HNH / RuvC" anchor="left" />
      {isCut && (
        <OutlinedText pos={[1.15, -0.35, 0]} size={0.13} color="#fbbf24" text="⚡ Cleaving!" anchor="left" />
      )}
    </group>
  );
}

// ── LigaseEnzyme — DNA repair enzyme at cut sites ─────────────────
function LigaseEnzyme({ y, progress, healed, flip }: {
  y: number; progress: number; healed?: boolean; flip?: boolean;
}) {
  const ease = easeOut3(Math.min(1, progress * 1.6));
  const xOff = lerp(flip ? -3.2 : 3.2, flip ? -2.1 : 2.1, ease);
  const col  = healed ? "#fbbf24" : "#4ade80";
  const emC  = healed ? "#f59e0b" : "#16a34a";

  return (
    <group position={[1.4 + xOff, y, 0]} scale={[ease, ease, ease]}>
      {/* Main globular body */}
      <mesh>
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshStandardMaterial color={col} metalness={0.45} roughness={0.45}
          emissive={emC} emissiveIntensity={0.45} />
      </mesh>
      {/* Lobe A */}
      <mesh position={[0.28, 0.22, 0.1]}>
        <sphereGeometry args={[0.24, 12, 12]} />
        <meshStandardMaterial color={col} metalness={0.45} roughness={0.5}
          emissive={emC} emissiveIntensity={0.3} />
      </mesh>
      {/* Lobe B */}
      <mesh position={[-0.26, -0.2, -0.1]}>
        <sphereGeometry args={[0.21, 10, 10]} />
        <meshStandardMaterial color={col} metalness={0.45} roughness={0.5}
          emissive={emC} emissiveIntensity={0.3} />
      </mesh>
      <OutlinedText
        pos={[flip ? -0.8 : 0.8, 0.32, 0]}
        size={0.13}
        color={healed ? "#fde68a" : "#86efac"}
        text={healed ? "✓ Sealed" : "Ligase"}
        anchor={flip ? "right" : "left"}
      />
    </group>
  );
}

// ── LegendPanel ───────────────────────────────────────────────────
function LegendPanel({ phase, hasPair, cuts }: any) {
  const items = [
    { id: "target", label: "gRNA Search"   },
    { id: "bind",   label: "Cas9 Binding"  },
    { id: "cut",    label: "DNA Cleavage"  },
    { id: "delete", label: "Excision"      },
    { id: "ligate", label: "Ligation"      },
    { id: "done",   label: "NHEJ Complete" },
  ];
  return (
    <group position={[-4.6, 2.1, 0]}>
      <mesh position={[1.25, -1.15, -0.2]}>
        <planeGeometry args={[4.0, 4.0]} />
        <meshStandardMaterial color="#05060A" transparent opacity={0.72} />
      </mesh>
      <OutlinedText pos={[0, 0.4, 0]} size={0.23} color="#FFFFFF" text="SIMULATION LOG" anchor="left" />
      {items.map((item, i) => {
        const active = hasPair && checkPhase(phase, item.id);
        const isDoneItem = item.id === "done";
        return (
          <OutlinedText key={item.id} pos={[0, -0.18 - i * 0.42, 0]} size={0.155}
            color={isDoneItem && active ? "#fbbf24" : active ? "#4ade80" : "#475569"}
            text={`${active ? "✓" : "○"} ${item.label}`}
            anchor="left"
          />
        );
      })}
      {cuts && (
        <OutlinedText pos={[0, -2.72, 0]} size={0.135} color="#FBBF24"
          text={`Span: ${Math.abs(cuts.b - cuts.a)} bp`}
          anchor="left"
        />
      )}
    </group>
  );
}

// ── OutlinedText ──────────────────────────────────────────────────
function OutlinedText({ pos, size, color, text, anchor }: any) {
  return (
    <Text position={pos} fontSize={size} color={color}
      anchorX={anchor} outlineWidth={0.02} outlineColor="#000000">
      {text}
    </Text>
  );
}
