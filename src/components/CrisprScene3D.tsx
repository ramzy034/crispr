import  { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Float, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import type { PairInfo } from "../types";

/**
 * DNA_CONFIG: Centrally defined constants to fix scope errors (e.g., 'radius' not found)
 * and ensure consistent proportions across all sub-components.
 */
const DNA_CONFIG = {
  H: 10.5,            // Increased height for a "bigger" feel
  turns: 6.8,         // More turns to fill the vertical space
  radius: 1.45,       // Thicker DNA for better visibility
  backboneR: 0.1,     // Chunky, premium-looking backbones
  rungR: 0.04,        
  rungCount: 96,      // Denser rungs for detail
  zScale: 0.82        // Subtle flattening for a "textbook" look
};

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
    /* CONTAINER SIZE: Set to 750px height to dominate the section */
    <div style={{ width: "100%", height: "750px", position: "relative", background: "#05060A", borderRadius: "12px", overflow: "hidden" }}>
      <Canvas dpr={[1, 2]} shadows>
        <color attach="background" args={["#030407"]} />
        
        {/* Adjusted Camera for a wider, more dramatic perspective */}
        <PerspectiveCamera makeDefault position={[0, 0, 8.5]} fov={45} />

        {/* Cinematic Studio Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.25} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-8, -5, 5]} color="#FF2D55" intensity={1.5} />
        <pointLight position={[8, 5, 5]} color="#007AFF" intensity={1.5} />

        <Environment preset="night" />

        <GroupCrisprScene cuts={cuts} />

        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI * 0.6}
          minPolarAngle={Math.PI * 0.3}
        />
        
        <ContactShadows opacity={0.5} scale={25} blur={2} far={10} resolution={256} color="#000000" />
      </Canvas>
    </div>
  );
}

function GroupCrisprScene(props: { cuts: null | { t1: number; t2: number; a: number; b: number } }) {
  const { cuts } = props;
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
    if (phase === "idle") return;
    tRef.current += dt;

    if (phase === "target") {
      guideIn.current = Math.min(1, guideIn.current + dt * 1.1);
      if (tRef.current > 1.2) { tRef.current = 0; setPhase("bind"); }
    } else if (phase === "bind") {
      cas9In.current = Math.min(1, cas9In.current + dt * 1.3);
      if (tRef.current > 1.0) { tRef.current = 0; setPhase("cut"); }
    } else if (phase === "cut") {
      flash.current = Math.min(1, flash.current + dt * 6.0);
      if (tRef.current > 0.4) { tRef.current = 0; setPhase("delete"); }
    } else if (phase === "delete") {
      flash.current = Math.max(0, flash.current - dt * 2.5);
      midScale.current = Math.max(0, midScale.current - dt * 2.0);
      if (midScale.current <= 0.01) { tRef.current = 0; setPhase("ligate"); }
    } else if (phase === "ligate") {
      snap.current = Math.min(1, snap.current + dt * 1.5);
    }
  });

  const y1 = cuts ? lerp(-DNA_CONFIG.H / 2, DNA_CONFIG.H / 2, cuts.t1) : 0;
  const y2 = cuts ? lerp(-DNA_CONFIG.H / 2, DNA_CONFIG.H / 2, cuts.t2) : 0;
  const yMin = Math.min(y1, y2);
  const yMax = Math.max(y1, y2);
  const gap = cuts ? (yMax - yMin) : 0;
  const shift = snap.current * (gap / 2);

  return (
    <group>
      {/* Centered DNA Group with extra space for tools */}
      <group position={[1.4, 0, 0]}>
        
        {/* TOP SEGMENT */}
        <group position={[0, -shift, 0]}>
          <DNAHelixSegment yFrom={yMax} yTo={DNA_CONFIG.H / 2} />
        </group>

        {/* MIDDLE DELETION SEGMENT */}
        {cuts && (
          <group scale={[1, midScale.current, 1]}>
            <DNAHelixSegment yFrom={yMin} yTo={yMax} accent />
            <DeletionGlow yMin={yMin} yMax={yMax} flash={flash.current} />
            <OutlinedText pos={[0, (yMin + yMax) / 2, 2.3]} size={0.18} color="#E9D5FF" text="Excising Segment..." anchor="center" />
          </group>
        )}

        {/* BOTTOM SEGMENT */}
        <group position={[0, shift, 0]}>
          <DNAHelixSegment yFrom={-DNA_CONFIG.H / 2} yTo={cuts ? yMin : DNA_CONFIG.H / 2} />
        </group>

        {/* Visual Annotations (using fixed radius scoping) */}
        {cuts && (
          <>
            <CutMarker y={y1} flash={flash.current} label="Site A" side={1} />
            <CutMarker y={y2} flash={flash.current} label="Site B" side={1} />
            <PAMHint y={y1} text="PAM" side={-1} />
            <PAMHint y={y2} text="PAM" side={-1} />
          </>
        )}
      </group>

      {/* Interactive CRISPR Machinery */}
      {cuts && phase !== "idle" && (
        <>
          <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.4}>
            <GuideRNA yTarget={(y1 + y2) / 2} zIn={THREE.MathUtils.lerp(3.5, 1.2, guideIn.current)} xFrom={-3.5} xTo={-0.6} intensity={phase === "target" ? 1 : 0.6} />
          </Float>
          <Cas9Clamp yTarget={(y1 + y2) / 2} zIn={THREE.MathUtils.lerp(4.0, 1.7, cas9In.current)} flash={flash.current} x={3.4} />
        </>
      )}

      {/* Interactive Legend Box */}
      <LegendPanel phase={phase} hasPair={Boolean(cuts)} cuts={cuts} />
    </group>
  );
}

/** * HELPER SUB-COMPONENTS
 * These are restored to full complexity and fixed to use DNA_CONFIG constants.
 */

function DNAHelixSegment({ yFrom, yTo, accent }: { yFrom: number; yTo: number; accent?: boolean }) {
  const curveA = useMemo(() => makeHelixCurve(yFrom, yTo, 0), [yFrom, yTo]);
  const curveB = useMemo(() => makeHelixCurve(yFrom, yTo, Math.PI), [yFrom, yTo]);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curveA, 160, DNA_CONFIG.backboneR, 12, false]} />
        <meshStandardMaterial color={accent ? "#38BDF8" : "#0EA5E9"} metalness={0.7} roughness={0.2} emissive={accent ? "#0EA5E9" : "#000000"} emissiveIntensity={0.5} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curveB, 160, DNA_CONFIG.backboneR, 12, false]} />
        <meshStandardMaterial color={accent ? "#FB7185" : "#E11D48"} metalness={0.7} roughness={0.2} emissive={accent ? "#E11D48" : "#000000"} emissiveIntensity={0.5} />
      </mesh>
      <BasePairs yFrom={yFrom} yTo={yTo} accent={accent} />
    </group>
  );
}

function BasePairs({ yFrom, yTo, accent }: any) {
  const count = Math.max(2, Math.floor(Math.abs(yTo - yFrom) * 8.5));
  const rungs = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1 || 1);
      const y = lerp(yFrom, yTo, t);
      const u = (y + DNA_CONFIG.H / 2) / DNA_CONFIG.H;
      const ang = u * DNA_CONFIG.turns * Math.PI * 2;
      const pA = new THREE.Vector3(Math.cos(ang) * DNA_CONFIG.radius, y, Math.sin(ang) * DNA_CONFIG.radius * DNA_CONFIG.zScale);
      const pB = new THREE.Vector3(Math.cos(ang + Math.PI) * DNA_CONFIG.radius, y, Math.sin(ang + Math.PI) * DNA_CONFIG.radius * DNA_CONFIG.zScale);
      arr.push({ pos: pA.clone().add(pB).multiplyScalar(0.5), quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), pB.clone().sub(pA).normalize()), len: pB.distanceTo(pA) });
    }
    return arr;
  }, [yFrom, yTo, count]);

  return (
    <group>
      {rungs.map((r, i) => (
        <mesh key={i} position={r.pos} quaternion={r.quat}>
          <cylinderGeometry args={[DNA_CONFIG.rungR, DNA_CONFIG.rungR, r.len, 8]} />
          <meshStandardMaterial color={accent ? "#FFFFFF" : "#E2E8F0"} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function LegendPanel({ phase, hasPair, cuts }: any) {
  const statusItems = [
    { id: "target", label: "gRNA Search" },
    { id: "bind", label: "Cas9 Binding" },
    { id: "cut", label: "DNA Cleavage" },
    { id: "delete", label: "Excision" },
    { id: "ligate", label: "Repair (NHEJ)" }
  ];

  return (
    <group position={[-4.5, 2.0, 0]}>
      <mesh position={[1.2, -1.0, -0.2]}>
        <planeGeometry args={[3.8, 3.5]} />
        <meshStandardMaterial color="#05060A" transparent opacity={0.7} />
      </mesh>
      <OutlinedText pos={[0, 0.4, 0]} size={0.24} color="#FFFFFF" text="SIMULATION LOG" anchor="left" />
      {statusItems.map((item, i) => {
        const active = hasPair && checkPhase(phase, item.id);
        return (
          <OutlinedText key={item.id} pos={[0, -0.2 - i * 0.4, 0]} size={0.16} color={active ? "#4ADE80" : "#475569"} text={`${active ? "✓" : "○"} ${item.label}`} anchor="left" />
        );
      })}
      {cuts && (
        <OutlinedText pos={[0, -2.4, 0]} size={0.14} color="#FBBF24" text={`Sequence Span: ${Math.abs(cuts.b - cuts.a)} bp`} anchor="left" />
      )}
    </group>
  );
}

/** Visual markers using shared constants **/
function CutMarker({ y, flash, label, side }: any) {
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[DNA_CONFIG.radius * 1.35, 0.03, 16, 64]} />
        <meshBasicMaterial color={flash > 0.5 ? "#FFFFFF" : "#FBBF24"} />
      </mesh>
      <OutlinedText pos={[side * 2.4, 0.2, 0]} size={0.14} color="#FBBF24" text={label} anchor="left" />
    </group>
  );
}

function PAMHint({ y, side }: any) {
  return (
    <group position={[side * (DNA_CONFIG.radius + 0.6), y, 0]}>
      <mesh><boxGeometry args={[0.2, 0.2, 0.2]} /><meshStandardMaterial color="#FBBF24" emissive="#FBBF24" emissiveIntensity={0.5} /></mesh>
      <OutlinedText pos={[side * 0.3, 0.2, 0]} size={0.12} color="#FDE68A" text="PAM" anchor={side > 0 ? "left" : "right"} />
    </group>
  );
}

function DeletionGlow({ yMin, yMax, flash }: any) {
  return (
    <mesh position={[0, (yMin + yMax) / 2, 0]}>
      <cylinderGeometry args={[DNA_CONFIG.radius * 1.7, DNA_CONFIG.radius * 1.7, Math.abs(yMax - yMin) + 0.1, 32, 1, true]} />
      <meshBasicMaterial color="#7C3AED" transparent opacity={0.15 + flash * 0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

function GuideRNA({ yTarget, zIn, xFrom, xTo, intensity }: any) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3([new THREE.Vector3(xFrom, yTarget + 1.5, zIn), new THREE.Vector3(xFrom + 1.5, yTarget + 0.5, zIn - 1), new THREE.Vector3(xTo, yTarget, 0.9)]), [yTarget, zIn, xFrom, xTo]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.06, 12, false]} />
      <meshStandardMaterial color="#34D399" emissive="#34D399" emissiveIntensity={intensity} />
    </mesh>
  );
}

function Cas9Clamp({ yTarget, zIn, flash, x }: any) {
  return (
    <group position={[x, yTarget, zIn]}>
      <mesh><torusGeometry args={[0.75, 0.18, 16, 48]} /><meshStandardMaterial color={flash > 0.3 ? "#FFD86B" : "#6366F1"} metalness={0.9} roughness={0.1} /></mesh>
      <mesh><sphereGeometry args={[0.45, 32, 32]} /><meshStandardMaterial color="#E0E7FF" transparent opacity={0.9} /></mesh>
      <OutlinedText pos={[1.0, 0, 0]} size={0.18} color="#FFFFFF" text="Cas9" anchor="left" />
    </group>
  );
}

function OutlinedText({ pos, size, color, text, anchor }: any) {
  return <Text position={pos} fontSize={size} color={color} anchorX={anchor} outlineWidth={0.02} outlineColor="#000000">{text}</Text>;
}

function makeHelixCurve(yFrom: number, yTo: number, phase: number) {
  const pts = [];
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const y = lerp(yFrom, yTo, t);
    const u = (y + DNA_CONFIG.H / 2) / DNA_CONFIG.H;
    const ang = u * DNA_CONFIG.turns * Math.PI * 2 + phase;
    pts.push(new THREE.Vector3(Math.cos(ang) * DNA_CONFIG.radius, y, Math.sin(ang) * DNA_CONFIG.radius * DNA_CONFIG.zScale));
  }
  return new THREE.CatmullRomCurve3(pts);
}

function checkPhase(current: string, target: string) {
  const order = ["target", "bind", "cut", "delete", "ligate"];
  return order.indexOf(current) >= order.indexOf(target);
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }