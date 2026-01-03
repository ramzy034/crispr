import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Text } from "@react-three/drei";
import * as THREE from "three";
import type { PairInfo } from "../types";

/**
 * CrisprScene3D (enhanced readability + more DNA-like proportions)
 * - Less “spring” / less compact: taller helix + fewer turns
 * - Better readability: labels moved to a side legend + outlined text
 * - Simpler explanation: step-by-step legend + “what gets deleted” label
 */
export default function CrisprScene3D(props: { pair: PairInfo | null; seqLength: number }) {
  const { pair, seqLength } = props;

  const cuts = useMemo(() => {
    if (!pair || seqLength <= 0) return null;
    const a = Math.min(pair.cutLeft, pair.cutRight);
    const b = Math.max(pair.cutLeft, pair.cutRight);
    const t1 = THREE.MathUtils.clamp(a / seqLength, 0, 1);
    const t2 = THREE.MathUtils.clamp(b / seqLength, 0, 1);
    return { t1, t2, a, b };
  }, [pair, seqLength]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0.3, 1.9, 9.6], fov: 38, near: 0.1, far: 200 }}
      >
        <color attach="background" args={["#05060A"]} />

        {/* Lighting */}
        <ambientLight intensity={0.32} />
        <directionalLight position={[8, 10, 6]} intensity={1.05} />
        <pointLight position={[-7, 3.5, 4]} intensity={0.75} />
        <pointLight position={[0, -4, -8]} intensity={0.35} />

        <Environment preset="city" />

        <GroupCrisprScene cuts={cuts} />

        <OrbitControls
          enablePan={false}
          minDistance={5.4}
          maxDistance={14}
          maxPolarAngle={Math.PI * 0.62}
          minPolarAngle={Math.PI * 0.16}
        />
      </Canvas>
    </div>
  );
}

function GroupCrisprScene(props: { cuts: null | { t1: number; t2: number; a: number; b: number } }) {
  const { cuts } = props;

  // idle → target → bind → cut → delete → ligate
  const [phase, setPhase] = useState<"idle" | "target" | "bind" | "cut" | "delete" | "ligate">("idle");

  const tRef = useRef(0);
  const midScale = useRef(1);
  const flash = useRef(0);
  const snap = useRef(0);
  const guideIn = useRef(0);
  const cas9In = useRef(0);

  const lastKey = useRef<string>("none");
  const key = cuts ? `${cuts.t1.toFixed(4)}-${cuts.t2.toFixed(4)}` : "none";

  useEffect(() => {
    if (key === lastKey.current) return;
    lastKey.current = key;

    tRef.current = 0;
    midScale.current = 1;
    flash.current = 0;
    snap.current = 0;
    guideIn.current = 0;
    cas9In.current = 0;

    setPhase(cuts ? "target" : "idle");
  }, [key, cuts]);

  useFrame((_, dt) => {
    tRef.current += dt;

    if (phase === "idle") {
      flash.current = 0;
      midScale.current = 1;
      snap.current = 0;
      guideIn.current = 0;
      cas9In.current = 0;
      return;
    }

    if (phase === "target") {
      guideIn.current = Math.min(1, guideIn.current + dt * 1.1);
      if (tRef.current > 0.95) {
        tRef.current = 0;
        setPhase("bind");
      }
      return;
    }

    if (phase === "bind") {
      cas9In.current = Math.min(1, cas9In.current + dt * 1.2);
      if (tRef.current > 0.95) {
        tRef.current = 0;
        setPhase("cut");
      }
      return;
    }

    if (phase === "cut") {
      flash.current = Math.min(1, flash.current + dt * 4.4);
      if (tRef.current > 0.48) {
        tRef.current = 0;
        setPhase("delete");
      }
      return;
    }

    if (phase === "delete") {
      flash.current = Math.max(0, flash.current - dt * 3.1);
      midScale.current = Math.max(0, midScale.current - dt * 1.65);
      if (midScale.current <= 0.03) {
        tRef.current = 0;
        setPhase("ligate");
      }
      return;
    }

    if (phase === "ligate") {
      snap.current = Math.min(1, snap.current + dt * 1.25);
      flash.current = Math.max(0, flash.current - dt * 2.3);
      return;
    }
  });

  /** DNA proportions (less compact, more “textbook DNA”) */
  const H = 9.2;            // taller
  const turns = 6.2;        // fewer turns → less “spring”
  const radius = 1.2;      // slightly wider
  const backboneR = 0.06;   // slimmer backbone
  const rungR = 0.032;      // slim base pairs
  const rungCount = 86;     // more rungs across longer DNA

  // Cuts to y positions
  const y1 = cuts ? lerp(-H / 2, H / 2, cuts.t1) : 0;
  const y2 = cuts ? lerp(-H / 2, H / 2, cuts.t2) : 0;
  const yMin = Math.min(y1, y2);
  const yMax = Math.max(y1, y2);
  const yMid = cuts ? (y1 + y2) / 2 : 0;

  // Snap ends after deletion
  const gap = cuts ? (yMax - yMin) : 0;
  const topShift = snap.current * (gap / 2);
  const botShift = snap.current * (gap / 2);

  // Split into segments
  const topRange: [number, number] = cuts ? [yMax, H / 2] : [-H / 2, H / 2];
  const midRange: [number, number] = cuts ? [yMin, yMax] : [0, 0];
  const botRange: [number, number] = cuts ? [-H / 2, yMin] : [0, 0];

  // Approach from side so it doesn’t cover the DNA
  const guideZ = THREE.MathUtils.lerp(2.9, 1.0, guideIn.current);
  const cas9Z = THREE.MathUtils.lerp(3.4, 1.55, cas9In.current);

  const showCuts = Boolean(cuts);

  return (
    <group position={[0, 0.05, 0]}>
      {/* Premium backdrop panel */}
      <mesh position={[0, 0, -1.95]}>
        <planeGeometry args={[13.5, 9.0]} />
        <meshStandardMaterial
          color="#0B1022"
          transparent
          opacity={0.28}
          metalness={0.12}
          roughness={0.7}
        />
      </mesh>

      {/* Faint axis */}
      <mesh>
        <cylinderGeometry args={[0.01, 0.01, H * 1.06, 10]} />
        <meshStandardMaterial color="#2A3350" transparent opacity={0.22} roughness={1} />
      </mesh>

      {/* DNA */}
      <group position={[0, 0, 0]}>
        {/* Top */}
        <group position={[0, -topShift, 0]}>
          <DNAHelixSegment
            height={H}
            turns={turns}
            radius={radius}
            yFrom={topRange[0]}
            yTo={topRange[1]}
            backboneR={backboneR}
            rungR={rungR}
            rungCount={rungCount}
          />
        </group>

        {/* Middle (deleted) */}
        {cuts && (
          <group scale={[1, midScale.current, 1]}>
            <DNAHelixSegment
              height={H}
              turns={turns}
              radius={radius}
              yFrom={midRange[0]}
              yTo={midRange[1]}
              backboneR={backboneR}
              rungR={rungR}
              rungCount={Math.max(18, Math.floor(rungCount * 0.35))}
              accent
            />
            <DeletionGlow yMin={yMin} yMax={yMax} flash={flash.current} />

            {/* “Deleted segment” label (only when cuts exist) */}
            <OutlinedText
              pos={[0, (yMin + yMax) / 2, 2.1]}
              size={0.16}
              color="#E9D5FF"
              text="Deleted segment"
              anchor="center"
            />
          </group>
        )}

        {/* Bottom */}
        {cuts && (
          <group position={[0, botShift, 0]}>
            <DNAHelixSegment
              height={H}
              turns={turns}
              radius={radius}
              yFrom={botRange[0]}
              yTo={botRange[1]}
              backboneR={backboneR}
              rungR={rungR}
              rungCount={rungCount}
            />
          </group>
        )}
      </group>

      {/* Cut markers */}
      {showCuts && (
        <>
          <CutMarker y={y1} flash={flash.current} label="Cut 1" side={1} />
          <CutMarker y={y2} flash={flash.current} label="Cut 2" side={1} />
          <PAMHint y={y1} flash={flash.current} text="PAM (NGG)" side={-1} />
          <PAMHint y={y2} flash={flash.current} text="PAM (NGG)" side={-1} />
        </>
      )}

      {/* gRNA */}
      {cuts && phase !== "idle" && (
        <GuideRNA
          yTarget={yMid}
          zIn={guideZ}
          xFrom={-4.0}
          xTo={-1.2}
          intensity={phase === "target" ? 1 : 0.7}
        />
      )}

      {/* Cas9 */}
      {cuts && phase !== "idle" && (
        <Cas9Clamp
          yTarget={yMid}
          zIn={cas9Z}
          flash={flash.current}
          engaged={phase !== "target"}
          x={2.25}
        />
      )}

      {/* 5' / 3' labels moved outward + outlined */}
      <OutlinedText pos={[-2.9, H / 2 + 0.5, 0]} size={0.14} color="#DCE6FF" text="5′" anchor="left" />
      <OutlinedText pos={[2.7, -H / 2 - 0.55, 0]} size={0.14} color="#DCE6FF" text="3′" anchor="left" />

      {/* Side legend (readable, not overlapping DNA) */}
      <LegendPanel
        phase={phase}
        hasPair={Boolean(cuts)}
        cuts={cuts ? { a: cuts.a, b: cuts.b } : null}
      />
    </group>
  );
}

/** =========
 * Legend UI
 * ========= */
function LegendPanel(props: {
  phase: "idle" | "target" | "bind" | "cut" | "delete" | "ligate";
  hasPair: boolean;
  cuts: null | { a: number; b: number };
}) {
  const { phase, hasPair, cuts } = props;

  const lines = useMemo(() => {
    if (!hasPair) {
      return [
        "How to use:",
        "1) Pick any 2 guides",
        "2) Watch the deletion animation",
        "3) Export if you want",
        "",
        "Concept:",
        "Two cuts → middle removed → ends join",
      ];
    }
    return [
      "CRISPR deletion steps:",
      phaseLine(phase, 1),
      phaseLine(phase, 2),
      phaseLine(phase, 3),
      phaseLine(phase, 4),
      phaseLine(phase, 5),
      "",
      cuts ? `Cuts: ${cuts.a} bp → ${cuts.b} bp` : "",
      cuts ? `Deleted: ${Math.abs(cuts.b - cuts.a)} bp` : "",
    ].filter(Boolean);
  }, [phase, hasPair, cuts]);

  return (
    <group position={[-4.75, 1.6, -0.3]}>
      {/* panel */}
      <mesh>
        <planeGeometry args={[3.55, 3.15]} />
        <meshStandardMaterial color="#0A1026" transparent opacity={0.5} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Title */}
      <OutlinedText pos={[-1.63, 1.35, 0.02]} size={0.16} color="#EAF0FF" text="Legend" anchor="left" />

      {/* Lines */}
      {lines.map((t, i) => (
        <OutlinedText
          key={i}
          pos={[-1.63, 1.05 - i * 0.24, 0.02]}
          size={0.125}
          color={i === 0 ? "#C7D2FE" : "#DCE6FF"}
          text={t}
          anchor="left"
        />
      ))}
    </group>
  );
}

function phaseLine(phase: string, n: number) {
  const on = (target: string) => {
    const order = ["target", "bind", "cut", "delete", "ligate"];
    const idx = order.indexOf(phase);
    const tidx = order.indexOf(target);
    return idx >= tidx && idx !== -1;
  };

  if (n === 1) return `${on("target") ? "✓" : "•"} gRNA targets DNA near PAM`;
  if (n === 2) return `${on("bind") ? "✓" : "•"} Cas9 binds (complex forms)`;
  if (n === 3) return `${on("cut") ? "✓" : "•"} Double-strand break (cut)`;
  if (n === 4) return `${on("delete") ? "✓" : "•"} Segment between cuts removed`;
  return `${on("ligate") ? "✓" : "•"} Ends ligate by NHEJ (deletion)`;
}

/** =========================
 * DNA segment + base pairs
 * ========================= */
function DNAHelixSegment(props: {
  height: number;
  turns: number;
  radius: number;
  yFrom: number;
  yTo: number;
  backboneR: number;
  rungR: number;
  rungCount: number;
  accent?: boolean;
}) {
  const { height: H, turns, radius, yFrom, yTo, backboneR, rungR, rungCount, accent } = props;

  // Slight “flattening” of the helix depth makes it look more like classic drawings
  const zScale = 0.85;

  const curveA = useMemo(
    () => makeHelixCurve(H, turns, radius, yFrom, yTo, 0, zScale),
    [H, turns, radius, yFrom, yTo, zScale]
  );
  const curveB = useMemo(
    () => makeHelixCurve(H, turns, radius, yFrom, yTo, Math.PI, zScale),
    [H, turns, radius, yFrom, yTo, zScale]
  );

  const backboneAColor = accent ? "#7DD3FC" : "#5AAEFF";
  const backboneBColor = accent ? "#FB7185" : "#FF4D6D";

  return (
    <group>
      {/* Backbones */}
      <mesh>
        <tubeGeometry args={[curveA, 360, backboneR, 12, false]} />
        <meshStandardMaterial color={backboneAColor} metalness={0.18} roughness={0.22} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curveB, 360, backboneR, 12, false]} />
        <meshStandardMaterial color={backboneBColor} metalness={0.18} roughness={0.22} />
      </mesh>

      {/* Base pairs */}
      <BasePairs
        height={H}
        turns={turns}
        radius={radius}
        yFrom={yFrom}
        yTo={yTo}
        count={rungCount}
        rungR={rungR}
        zScale={zScale}
      />
    </group>
  );
}

function BasePairs(props: {
  height: number;
  turns: number;
  radius: number;
  yFrom: number;
  yTo: number;
  count: number;
  rungR: number;
  zScale: number;
}) {
  const { height: H, turns, radius, yFrom, yTo, count, rungR, zScale } = props;

  const rungs = useMemo(() => {
    const arr: Array<{
      pos: THREE.Vector3;
      quat: THREE.Quaternion;
      len: number;
      color: string;
      opacity: number;
    }> = [];

    const up = new THREE.Vector3(0, 1, 0);

    // subtle palette to suggest base-pair variety
    const palette = ["#C7D2FE", "#E9D5FF", "#BFDBFE", "#FBCFE8", "#BAE6FD", "#DDD6FE"];

    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const y = lerp(yFrom, yTo, t);

      const u = (y + H / 2) / H;
      const ang = u * turns * Math.PI * 2;

      const pA = new THREE.Vector3(Math.cos(ang) * radius, y, Math.sin(ang) * radius * zScale);
      const pB = new THREE.Vector3(Math.cos(ang + Math.PI) * radius, y, Math.sin(ang + Math.PI) * radius * zScale);

      const mid = pA.clone().add(pB).multiplyScalar(0.5);
      const dir = pB.clone().sub(pA);
      const len = dir.length();

      const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());

      // Make rungs slightly more opaque so DNA reads better
      const opacity = 0.62;

      arr.push({
        pos: mid,
        quat,
        len,
        color: palette[i % palette.length],
        opacity,
      });
    }
    return arr;
  }, [H, turns, radius, yFrom, yTo, count, zScale]);

  return (
    <group>
      {rungs.map((r, idx) => (
        <mesh key={idx} position={r.pos} quaternion={r.quat}>
          <cylinderGeometry args={[rungR, rungR, r.len, 10]} />
          <meshStandardMaterial color={r.color} transparent opacity={r.opacity} roughness={0.78} />
        </mesh>
      ))}
    </group>
  );
}

/** =================
 * CRISPR components
 * ================= */
function GuideRNA(props: {
  yTarget: number;
  zIn: number;
  xFrom: number;
  xTo: number;
  intensity: number;
}) {
  const { yTarget, zIn, xFrom, xTo, intensity } = props;

  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const z0 = zIn;
    for (let i = 0; i <= 44; i++) {
      const t = i / 44;
      const tt = smoothstep(t);
      const y = THREE.MathUtils.lerp(yTarget + 1.2, yTarget + 0.15, tt);
      const x = THREE.MathUtils.lerp(xFrom, xTo, tt);
      const z = THREE.MathUtils.lerp(z0, 0.95, tt);
      pts.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.7);
  }, [yTarget, zIn, xFrom, xTo]);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 160, 0.035, 10, false]} />
        <meshStandardMaterial
          color="#A7F3D0"
          emissive="#A7F3D0"
          emissiveIntensity={0.25 * intensity}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      <OutlinedText
        pos={[xFrom + 0.1, yTarget + 0.7, 1.65]}
        size={0.12}
        color="#BFFFE6"
        text="guide RNA"
        anchor="left"
      />
    </group>
  );
}

function Cas9Clamp(props: { yTarget: number; zIn: number; flash: number; engaged: boolean; x: number }) {
  const { yTarget, zIn, flash, engaged, x } = props;

  const glow = engaged ? (0.14 + flash * 0.9) : 0.08;

  return (
    <group position={[x, yTarget - 0.1, zIn]}>
      {/* Outer clamp */}
      <mesh rotation={[Math.PI / 2, 0.15, 0]}>
        <torusGeometry args={[0.55, 0.11, 18, 64]} />
        <meshStandardMaterial
          color={flash > 0.2 ? "#FFD86B" : "#8EA0FF"}
          emissive={flash > 0.2 ? "#FFD86B" : "#8EA0FF"}
          emissiveIntensity={glow}
          roughness={0.28}
          metalness={0.15}
        />
      </mesh>

      {/* Inner body */}
      <mesh>
        <icosahedronGeometry args={[0.30, 1]} />
        <meshStandardMaterial
          color="#E7ECFF"
          emissive="#98A6FF"
          emissiveIntensity={0.12 * (engaged ? 1 : 0.4) + 0.35 * flash}
          roughness={0.38}
          metalness={0.08}
          transparent
          opacity={0.93}
        />
      </mesh>

      <OutlinedText pos={[0.72, 0.12, 0]} size={0.12} color="#EAF0FF" text="Cas9" anchor="left" />
    </group>
  );
}

/** ===========
 * Cut visuals
 * =========== */
function CutMarker(props: { y: number; flash: number; label: string; side: 1 | -1 }) {
  const { y, flash, label, side } = props;
  const glow = 0.22 + flash * 0.95;

  return (
    <group position={[0, y, 0]}>
      <mesh>
        <torusGeometry args={[1.42, 0.03, 14, 96]} />
        <meshStandardMaterial
          color="#FFD86B"
          emissive="#FFD86B"
          emissiveIntensity={glow}
          roughness={0.3}
          metalness={0.08}
        />
      </mesh>

      <OutlinedText
        pos={[side * 1.95, 0.14, 0]}
        size={0.13}
        color="#FFE9B0"
        text={label}
        anchor={side === 1 ? "left" : "right"}
      />
    </group>
  );
}

function PAMHint(props: { y: number; flash: number; text: string; side: 1 | -1 }) {
  const { y, flash, text, side } = props;
  const emiss = 0.12 + flash * 0.6;

  return (
    <group position={[side * 1.7, y + 0.05, 0.0]}>
      <mesh>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial
          color="#FFE08A"
          emissive="#FFE08A"
          emissiveIntensity={emiss}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>
      <OutlinedText
        pos={[side * 0.18, 0.18, 0]}
        size={0.11}
        color="#FFE9B0"
        text={text}
        anchor={side === 1 ? "left" : "right"}
      />
    </group>
  );
}

function DeletionGlow(props: { yMin: number; yMax: number; flash: number }) {
  const { yMin, yMax, flash } = props;
  const h = Math.max(0.08, yMax - yMin);
  const opacity = 0.05 + flash * 0.16;

  return (
    <mesh position={[0, (yMin + yMax) / 2, 0]}>
      <cylinderGeometry args={[1.72, 1.72, h, 64, 1, true]} />
      <meshStandardMaterial
        color="#7C3AED"
        emissive="#7C3AED"
        emissiveIntensity={0.08 + flash * 0.22}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        roughness={0.85}
      />
    </mesh>
  );
}

/** ======================
 * Outlined text helper
 * ====================== */
function OutlinedText(props: {
  pos: [number, number, number];
  size: number;
  color: string;
  text: string;
  anchor: "left" | "center" | "right";
}) {
  const { pos, size, color, text, anchor } = props;
  return (
    <Text
      position={pos}
      fontSize={size}
      color={color}
      anchorX={anchor}
      anchorY="middle"
      outlineWidth={0.015}
      outlineColor="#05060A"
    >
      {text}
    </Text>
  );
}

/** =========================
 * Helix curve helper (zScale)
 * ========================= */
function makeHelixCurve(
  H: number,
  turns: number,
  radius: number,
  yFrom: number,
  yTo: number,
  phase: number,
  zScale: number
) {
  const pts: THREE.Vector3[] = [];
  const N = 260;

  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const y = lerp(yFrom, yTo, t);

    const u = (y + H / 2) / H;
    const ang = u * turns * Math.PI * 2 + phase;

    const x = Math.cos(ang) * radius;
    const z = Math.sin(ang) * radius * zScale;

    pts.push(new THREE.Vector3(x, y, z));
  }

  return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.62);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}
