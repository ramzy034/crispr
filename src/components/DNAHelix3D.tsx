import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Helix() {
  // Two spirals + “rungs” using simple meshes (fast + stable)
  const pointsA: THREE.Vector3[] = [];
  const pointsB: THREE.Vector3[] = [];
  const turns = 6;
  const steps = 260;
  const radius = 1;
  const height = 5.0;

  for (let i = 0; i < steps; i++) {
    const t = (i / (steps - 1)) * turns * Math.PI * 2;
    const y = (i / (steps - 1)) * height - height / 2;
    pointsA.push(new THREE.Vector3(Math.cos(t) * radius, y, Math.sin(t) * radius));
    pointsB.push(new THREE.Vector3(Math.cos(t + Math.PI) * radius, y, Math.sin(t + Math.PI) * radius));
  }

  const curveA = new THREE.CatmullRomCurve3(pointsA);
  const curveB = new THREE.CatmullRomCurve3(pointsB);

  const geomA = new THREE.TubeGeometry(curveA, 500, 0.06, 10, false);
  const geomB = new THREE.TubeGeometry(curveB, 500, 0.06, 10, false);

  const rungCount = 26;
  const rungs = [];
  for (let i = 0; i < rungCount; i++) {
    const idx = Math.floor((i / (rungCount - 1)) * (steps - 1));
    const a = pointsA[idx];
    const b = pointsB[idx];
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();

    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(1, 0, 0),
      dir.clone().normalize()
    );

    rungs.push(
      <mesh key={i} position={[mid.x, mid.y, mid.z]} quaternion={quat}>
        <cylinderGeometry args={[0.03, 0.03, len, 10]} />
        <meshStandardMaterial color={"#e8e8e8"} roughness={0.6} metalness={0.2} />
      </mesh>
    );
  }

  return (
    <group>
      <mesh geometry={geomA}>
        <meshStandardMaterial color={"#ff2d55"} roughness={0.35} metalness={0.25} />
      </mesh>
      <mesh geometry={geomB}>
        <meshStandardMaterial color={"#2dd4ff"} roughness={0.35} metalness={0.25} />
      </mesh>
      {rungs}
    </group>
  );
}

export default function DNAHelix3D() {
  return (
    <div className="helix3d">
      <Canvas camera={{ position: [0, 0.2, 7], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.2} />
        <Helix />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
      <div className="helixCaption">Interactive DNA helix (drag to rotate)</div>
    </div>
  );
}
