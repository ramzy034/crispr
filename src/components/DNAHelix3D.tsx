import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ── B-DNA physical constants (1 unit = 1 nm) ──────────────────
const RADIUS      = 1.0;   // nm  (diameter = 2 nm)
const PITCH       = 3.4;   // nm  (one full helical turn)
// RISE = 0.34 nm per base pair (= PITCH / BP_PER_TURN, used implicitly via NUM_BP)
const BP_PER_TURN = 10;    // base pairs per turn

const NUM_TURNS  = 3;
const NUM_BP     = NUM_TURNS * BP_PER_TURN;          // 30
const TOTAL_H    = NUM_TURNS * PITCH;                // 10.2 nm
const SMOOTH     = NUM_BP * 20;                      // curve resolution
const BB_R       = 0.085;                            // backbone tube radius
const RUNG_R     = 0.048;                            // base-pair rung radius
const NODE_R     = BB_R * 1.55;                      // phosphate node sphere

// Alternating A·T / G·C pair colours
const PAIR_COLS  = ["#64b5f6", "#ef9a9a"] as const;  // blue AT, rose GC

// ── geometry builder (stable reference, computed once) ─────────
function buildGeometry() {
  const pA: THREE.Vector3[] = [];
  const pB: THREE.Vector3[] = [];

  for (let i = 0; i < SMOOTH; i++) {
    const t     = i / (SMOOTH - 1);
    const angle = t * NUM_TURNS * Math.PI * 2;
    const y     = t * TOTAL_H - TOTAL_H / 2;
    pA.push(new THREE.Vector3( Math.cos(angle) * RADIUS, y,  Math.sin(angle) * RADIUS));
    pB.push(new THREE.Vector3(-Math.cos(angle) * RADIUS, y, -Math.sin(angle) * RADIUS));
  }

  const geomA = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pA), SMOOTH * 2, BB_R, 12, false);
  const geomB = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pB), SMOOTH * 2, BB_R, 12, false);

  // Rung + node data at each base-pair step
  const rungs: {
    pos: [number, number, number];
    quat: THREE.Quaternion;
    len: number;
    color: string;
    nodeA: [number, number, number];
    nodeB: [number, number, number];
  }[] = [];

  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < NUM_BP; i++) {
    const t   = i / (NUM_BP - 1);
    const idx = Math.min(Math.floor(t * (SMOOTH - 1)), SMOOTH - 2);
    const a   = pA[idx];
    const b   = pB[idx];
    const dir = b.clone().sub(a);
    const len = dir.length();
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.normalize());

    rungs.push({
      pos:   mid.toArray() as [number, number, number],
      quat,
      len,
      color: PAIR_COLS[i % 2],
      nodeA: a.toArray() as [number, number, number],
      nodeB: b.toArray() as [number, number, number],
    });
  }

  return { geomA, geomB, rungs };
}

// ── The animated helix group ────────────────────────────────────
function HelixScene({ paused }: { paused: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (groupRef.current && !paused) {
      groupRef.current.rotation.y += dt * 0.38;
    }
  });

  const { geomA, geomB, rungs } = useMemo(buildGeometry, []);

  return (
    <group ref={groupRef}>
      {/* Strand A — cyan */}
      <mesh geometry={geomA}>
        <meshStandardMaterial
          color="#4fc3f7" roughness={0.18} metalness={0.55}
          emissive="#4fc3f7" emissiveIntensity={0.22}
        />
      </mesh>

      {/* Strand B — rose */}
      <mesh geometry={geomB}>
        <meshStandardMaterial
          color="#f06292" roughness={0.18} metalness={0.55}
          emissive="#f06292" emissiveIntensity={0.22}
        />
      </mesh>

      {/* Base-pair rungs + phosphate nodes */}
      {rungs.map((r, i) => (
        <group key={i}>
          {/* Rung cylinder */}
          <mesh position={r.pos} quaternion={r.quat}>
            <cylinderGeometry args={[RUNG_R, RUNG_R, r.len * 0.82, 8]} />
            <meshStandardMaterial
              color={r.color} roughness={0.22} metalness={0.45}
              emissive={r.color} emissiveIntensity={0.28}
            />
          </mesh>

          {/* Phosphate node — strand A */}
          <mesh position={r.nodeA}>
            <sphereGeometry args={[NODE_R, 10, 10]} />
            <meshStandardMaterial
              color="#4fc3f7" roughness={0.15} metalness={0.65}
              emissive="#4fc3f7" emissiveIntensity={0.4}
            />
          </mesh>

          {/* Phosphate node — strand B */}
          <mesh position={r.nodeB}>
            <sphereGeometry args={[NODE_R, 10, 10]} />
            <meshStandardMaterial
              color="#f06292" roughness={0.15} metalness={0.65}
              emissive="#f06292" emissiveIntensity={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── Public component ────────────────────────────────────────────
export default function DNAHelix3D() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="helix3d" style={{ position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 38 }}
        gl={{ antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.22} />
        <pointLight position={[5, 7, 5]}   intensity={2.2} color="#ffffff" />
        <pointLight position={[-4, -5, 3]}  intensity={1.4} color="#4fc3f7" />
        <pointLight position={[3, -3, -5]}  intensity={0.9} color="#f06292" />

        <HelixScene paused={paused} />

        <OrbitControls enablePan={false} enableZoom={true} minDistance={5} maxDistance={18} />
      </Canvas>

      {/* ── Play / Pause button ──────────────────────────── */}
      <button
        onClick={() => setPaused(p => !p)}
        style={{
          position: "absolute",
          bottom: 44,
          right: 14,
          display: "flex",
          alignItems: "center",
          gap: 7,
          background: paused
            ? "rgba(79,195,247,0.18)"
            : "rgba(15,22,40,0.82)",
          border: `1px solid ${paused ? "rgba(79,195,247,0.7)" : "rgba(79,195,247,0.35)"}`,
          borderRadius: 10,
          color: "#4fc3f7",
          padding: "7px 15px",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 700,
          fontFamily: "inherit",
          letterSpacing: "0.06em",
          backdropFilter: "blur(12px)",
          transition: "background 0.2s, border-color 0.2s",
          userSelect: "none",
        }}
      >
        <span style={{ fontSize: 10 }}>{paused ? "▶" : "⏸"}</span>
        {paused ? "PLAY" : "PAUSE"}
      </button>

      {/* ── Caption ─────────────────────────────────────── */}
      <div className="helixCaption">
        B-DNA&nbsp;&nbsp;·&nbsp;&nbsp;⌀ 2 nm&nbsp;&nbsp;·&nbsp;&nbsp;Pitch 3.4 nm&nbsp;&nbsp;·&nbsp;&nbsp;10 bp / turn&nbsp;&nbsp;·&nbsp;&nbsp;0.34 nm rise
      </div>
    </div>
  );
}
