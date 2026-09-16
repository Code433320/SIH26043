import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';

// ── Color tokens matching Citizen Dashboard palette ─────────────
const COLOR_PAPER = '#F8FAFC';
const COLOR_NAVY = '#003F66';
const COLOR_PRIMARY = '#006199';
const COLOR_ORANGE = '#FFD444';
const COLOR_LINE = '#CBD5E1';

// ── 1. 3D Government Logo (Classical Pediment, Columns & Emblem) ──
function GovtLogo3D({ opacity = 0.9, desaturate = false }) {
  const color = desaturate ? COLOR_LINE : COLOR_NAVY;
  return (
    <group scale={0.85}>
      {/* Stepped Base / Plinth */}
      <mesh position={[0, -0.26, 0]}>
        <boxGeometry args={[0.58, 0.05, 0.26]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.3} />
      </mesh>
      {/* 4 Classical Pillars */}
      {[-0.21, -0.07, 0.07, 0.21].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.46, 12]} />
          <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.25} />
        </mesh>
      ))}
      {/* Architrave */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.58, 0.05, 0.26]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.3} />
      </mesh>
      {/* Triangular Pediment Roof */}
      <mesh position={[0, 0.38, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.42, 0.22, 4]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.3} />
      </mesh>
      {/* Central Official Emblem Disc */}
      <mesh position={[0, 0.02, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.03, 24]} />
        <meshStandardMaterial
          color={desaturate ? COLOR_LINE : '#FFD444'}
          emissive={desaturate ? COLOR_LINE : '#FFD444'}
          emissiveIntensity={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Outer Halo Ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.52, 0.015, 12, 32]} />
        <meshStandardMaterial color={color} transparent opacity={opacity * 0.4} />
      </mesh>
    </group>
  );
}

// ── 2. 3D Student Logo (Mortarboard & Diploma Scroll) ─────────────
function StudentLogo3D({ opacity = 0.9, desaturate = false }) {
  const color = desaturate ? COLOR_LINE : '#0284C7';
  return (
    <group scale={0.9}>
      {/* Skull Cap Base */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 0.16, 24]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.3} />
      </mesh>
      {/* Mortarboard Diamond Board */}
      <mesh position={[0, 0.13, 0]} rotation={[0.08, Math.PI / 4, 0]}>
        <boxGeometry args={[0.64, 0.03, 0.64]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Center Tassel Button */}
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color={desaturate ? COLOR_LINE : '#FFD444'}
          emissive={desaturate ? COLOR_LINE : '#FFD444'}
          emissiveIntensity={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Hanging Tassel */}
      <mesh position={[0.24, 0.05, 0.24]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.015, 0.028, 0.24, 8]} />
        <meshStandardMaterial color={desaturate ? COLOR_LINE : '#FFD444'} transparent opacity={opacity} />
      </mesh>
      {/* Rolled Diploma Scroll beneath */}
      <mesh position={[0, -0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.065, 0.065, 0.5, 16]} />
        <meshStandardMaterial color={desaturate ? COLOR_LINE : '#F7F6F2'} transparent opacity={opacity} roughness={0.4} />
      </mesh>
      {/* Diploma Ribbon Ring */}
      <mesh position={[0, -0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, 0.1, 16]} />
        <meshStandardMaterial
          color={desaturate ? COLOR_LINE : COLOR_ORANGE}
          emissive={desaturate ? COLOR_LINE : COLOR_ORANGE}
          emissiveIntensity={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}

// ── 3. 3D University Logo (Academic Shield & Open Book) ───────────
function UniversityLogo3D({ opacity = 0.9, desaturate = false }) {
  const color = desaturate ? COLOR_LINE : '#7C3AED';
  return (
    <group scale={0.85}>
      {/* Hexagonal Heraldic Shield Base */}
      <mesh position={[0, 0, -0.02]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.4, 0.35, 0.06, 6]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color={color} transparent opacity={opacity * 0.45} roughness={0.3} />
      </mesh>
      {/* Open Book Left Page */}
      <mesh position={[-0.15, 0, 0.04]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[0.26, 0.34, 0.025]} />
        <meshStandardMaterial color={desaturate ? COLOR_LINE : '#F7F6F2'} transparent opacity={opacity} roughness={0.4} />
      </mesh>
      {/* Open Book Right Page */}
      <mesh position={[0.15, 0, 0.04]} rotation={[0, -0.35, 0]}>
        <boxGeometry args={[0.26, 0.34, 0.025]} />
        <meshStandardMaterial color={desaturate ? COLOR_LINE : '#F7F6F2'} transparent opacity={opacity} roughness={0.4} />
      </mesh>
      {/* Book Spine */}
      <mesh position={[0, 0, 0.02]}>
        <cylinderGeometry args={[0.03, 0.03, 0.35, 12]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>
      {/* Academic Torch / Flame on top */}
      <mesh position={[0, 0.36, 0]}>
        <coneGeometry args={[0.1, 0.24, 12]} />
        <meshStandardMaterial
          color={desaturate ? COLOR_LINE : COLOR_ORANGE}
          emissive={desaturate ? COLOR_LINE : COLOR_ORANGE}
          emissiveIntensity={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Laurel Laurel Ring */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[0.52, 0.02, 12, 32]} />
        <meshStandardMaterial color={color} transparent opacity={opacity * 0.45} />
      </mesh>
    </group>
  );
}

// ── 4. 3D Citizen Logo (Community Figures & Shield) ───────────────
function CitizenLogo3D({ opacity = 0.9, desaturate = false }) {
  const color = desaturate ? COLOR_LINE : '#006199';
  return (
    <group scale={0.85}>
      {/* Central Citizen Head */}
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Central Citizen Torso */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.18, 0.34, 0.3, 20]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.3} />
      </mesh>
      {/* Flanking Community Companion Left */}
      <mesh position={[-0.28, -0.02, -0.06]} scale={0.75}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={opacity * 0.65} />
      </mesh>
      <mesh position={[-0.28, -0.22, -0.06]} scale={0.75}>
        <cylinderGeometry args={[0.15, 0.28, 0.24, 16]} />
        <meshStandardMaterial color={color} transparent opacity={opacity * 0.65} />
      </mesh>
      {/* Flanking Community Companion Right */}
      <mesh position={[0.28, -0.02, -0.06]} scale={0.75}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={opacity * 0.65} />
      </mesh>
      <mesh position={[0.28, -0.22, -0.06]} scale={0.75}>
        <cylinderGeometry args={[0.15, 0.28, 0.24, 16]} />
        <meshStandardMaterial color={color} transparent opacity={opacity * 0.65} />
      </mesh>
      {/* Civic Trust Protective Ring */}
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[0.52, 0.022, 16, 36]} />
        <meshStandardMaterial color={desaturate ? COLOR_LINE : '#006199'} transparent opacity={opacity * 0.5} />
      </mesh>
    </group>
  );
}

// ── 5. 3D NGO & Startup Logo (Rocket & Interlocking Trust Rings) ──
function NgoStartupLogo3D({ opacity = 0.9, desaturate = false }) {
  const color = desaturate ? COLOR_LINE : '#DC2626';
  return (
    <group scale={0.85} rotation={[0, 0, -0.2]}>
      {/* Rocket Aerodynamic Nose */}
      <mesh position={[0, 0.3, 0]}>
        <coneGeometry args={[0.14, 0.34, 20]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.2} metalness={0.2} />
      </mesh>
      {/* Rocket Fuselage */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.34, 20]} />
        <meshStandardMaterial color={desaturate ? COLOR_LINE : '#F7F6F2'} transparent opacity={opacity} roughness={0.3} />
      </mesh>
      {/* Porthole Window */}
      <mesh position={[0, 0.08, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.048, 0.048, 0.02, 16]} />
        <meshStandardMaterial
          color={desaturate ? COLOR_LINE : '#0284C7'}
          emissive={desaturate ? COLOR_LINE : '#0284C7'}
          emissiveIntensity={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* 3 Delta Stabilizer Fins */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.18, -0.1, Math.sin(angle) * 0.18]} rotation={[0, -angle, 0.2]}>
          <boxGeometry args={[0.14, 0.18, 0.02]} />
          <meshStandardMaterial color={color} transparent opacity={opacity} />
        </mesh>
      ))}
      {/* Interlocking Heart / Partnership Ring */}
      <mesh position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.035, 16, 32]} />
        <meshStandardMaterial
          color={desaturate ? COLOR_LINE : COLOR_ORANGE}
          emissive={desaturate ? COLOR_LINE : COLOR_ORANGE}
          emissiveIntensity={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}

// ── Floating Glass Insignia Label Pill ────────────────────────────
function LogoInsignia({ label, color, sublabel }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '5px 12px',
        borderRadius: '16px',
        background: 'rgba(248, 250, 252, 0.88)',
        border: `1.5px solid ${color}66`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 4px 18px rgba(0, 63, 102, 0.08)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        userSelect: 'none',
        marginTop: 48,
      }}
    >
      <span
        style={{
          fontSize: '10px',
          fontWeight: 900,
          color,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontFamily: 'Archivo, sans-serif',
        }}
      >
        {label}
      </span>
      {sublabel && (
        <span
          style={{
            fontSize: '8px',
            fontWeight: 600,
            color: '#003F66',
            opacity: 0.65,
            marginTop: '-1px',
          }}
        >
          {sublabel}
        </span>
      )}
    </div>
  );
}

// ── 5 Nodes for Stage 3 Spline (How it works lifecycle) ───────────
const NODES_5 = [
  new THREE.Vector3(-2.6, 1.0, 0),     // 1. Citizen report
  new THREE.Vector3(-1.3, -0.4, 0.5),  // 2. AI Categorization
  new THREE.Vector3(0.0, 0.8, -0.2),   // 3. Gov Validation
  new THREE.Vector3(1.3, -0.4, 0.5),   // 4. University + Industry
  new THREE.Vector3(2.6, 1.0, 0),      // 5. Verified Resolution
];

const splineCurve = new THREE.CatmullRomCurve3(NODES_5);
const splinePoints = splineCurve.getPoints(60);
const splineGeometry = new THREE.BufferGeometry().setFromPoints(splinePoints);

function ContinuousStoryScene() {
  const scroll = useScrollProgress(); // 0 to 1
  const coreRef = useRef();
  const haloRef = useRef();
  const shadowRef = useRef();
  const orbitGroupRef = useRef();
  const scatterGroupRef = useRef();
  const nodesGroupRef = useRef();
  const stakeholderHighlightRef = useRef();

  // 5 3D Logo containers
  const logoRefs = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = Math.max(0, Math.min(1, scroll));

    // ── 1. Central "Problem" Particle Breathing & Motion ──
    if (coreRef.current && haloRef.current) {
      const breathe = 1 + Math.sin(t * 1.8) * 0.08;

      if (p < 0.18) {
        // Stage 1: Hero — subtle soft particle settling in the gap between subhead and CTAs
        coreRef.current.position.set(0, -0.45 + Math.sin(t * 1.2) * 0.08, 0);
        coreRef.current.scale.setScalar(breathe * 0.24);
        coreRef.current.material.color.set(COLOR_ORANGE);
        coreRef.current.material.emissive.set(COLOR_ORANGE);
        coreRef.current.material.emissiveIntensity = 0.8;
        haloRef.current.position.set(0, -0.45, 0);
        haloRef.current.scale.setScalar(breathe * 0.5);
        haloRef.current.material.opacity = 0.12;
      } else if (p < 0.38) {
        // Stage 2: The Problem — descends into muted desaturation / chaos
        const p2 = (p - 0.18) / 0.20;
        const targetColor = new THREE.Color(COLOR_ORANGE).lerp(new THREE.Color(COLOR_LINE), p2 * 0.75);
        coreRef.current.position.set(Math.sin(t * 2.5) * 0.18, -p2 * 0.8, 0);
        coreRef.current.scale.setScalar(breathe * (0.38 - p2 * 0.08));
        coreRef.current.material.color.copy(targetColor);
        coreRef.current.material.emissive.copy(targetColor);
        coreRef.current.material.emissiveIntensity = 0.95 * (1 - p2 * 0.6);
        haloRef.current.scale.setScalar(breathe * 0.5);
        haloRef.current.material.opacity = 0.14 * (1 - p2 * 0.7);
      } else if (p < 0.65) {
        // Stage 3: How It Works — travels along the 5-node 3D spline
        const p3 = (p - 0.38) / 0.27;
        const pointOnPath = splineCurve.getPointAt(Math.min(0.999, Math.max(0.001, p3)));
        coreRef.current.position.copy(pointOnPath);
        coreRef.current.scale.setScalar(breathe * 0.34);
        coreRef.current.material.color.set(COLOR_ORANGE);
        coreRef.current.material.emissive.set(COLOR_ORANGE);
        coreRef.current.material.emissiveIntensity = 1.0;
        haloRef.current.position.copy(pointOnPath);
        haloRef.current.scale.setScalar(breathe * 0.65);
        haloRef.current.material.opacity = 0.22;
      } else if (p < 0.85) {
        // Stage 4: Who Benefits — morphs into stakeholder focus
        coreRef.current.position.set(0, Math.sin(t * 1.5) * 0.15, 0);
        coreRef.current.scale.setScalar(breathe * 0.42);
        coreRef.current.material.color.set(COLOR_ORANGE);
        coreRef.current.material.emissive.set(COLOR_ORANGE);
        coreRef.current.material.emissiveIntensity = 1.05;
        haloRef.current.position.set(0, 0, 0);
        haloRef.current.scale.setScalar(breathe * 0.8);
        haloRef.current.material.opacity = 0.25;
      } else {
        // Stage 5 & 6: Impact Counter & Final CTA — full convergence, supreme radiance
        const p6 = Math.min(1, (p - 0.85) / 0.15);
        coreRef.current.position.set(0, Math.sin(t * 1.4) * 0.1, 0);
        coreRef.current.scale.setScalar(breathe * (0.42 + p6 * 0.08));
        coreRef.current.material.color.set(COLOR_ORANGE);
        coreRef.current.material.emissive.set(COLOR_ORANGE);
        coreRef.current.material.emissiveIntensity = 1.3;
        haloRef.current.position.set(0, 0, 0);
        haloRef.current.scale.setScalar(breathe * 0.95);
        haloRef.current.material.opacity = 0.32;
      }
    }

    // Ground shadow follows particle x, z
    if (shadowRef.current && coreRef.current) {
      shadowRef.current.position.x = coreRef.current.position.x;
      shadowRef.current.position.z = coreRef.current.position.z;
      shadowRef.current.scale.setScalar(1 + (coreRef.current.position.y * 0.15));
    }

    // ── 2. The 5 3D Logos: Hero Orbit & Final CTA Convergence ──
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y = t * 0.22;

      if (p < 0.20) {
        // Hero: 5 3D Logos revolving on outer periphery (wide radius) so headline text is crystal clear
        orbitGroupRef.current.visible = true;
        const pull = p / 0.20;
        const radius = 4.2 * (1 - pull * 0.28);

        logoRefs.current.forEach((group, idx) => {
          if (!group) return;
          const angle = (idx / 5) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius * 0.65 - 0.6; // pushed back in Z
          const y = Math.sin(angle * 2 + t) * 0.22;
          group.position.set(x, y, z);
          group.scale.setScalar(0.68);
          group.rotation.y = -orbitGroupRef.current.rotation.y + Math.sin(t + idx) * 0.15;
        });
      } else if (p > 0.85) {
        // Final CTA: All 5 3D Logos reconverged in a radiant synchronized orbit
        orbitGroupRef.current.visible = true;
        const ctaProgress = (p - 0.85) / 0.15;
        const radius = 2.5;

        logoRefs.current.forEach((group, idx) => {
          if (!group) return;
          const angle = (idx / 5) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius * 0.85;
          const y = Math.sin(angle * 2 + t * 1.5) * 0.2;
          group.position.set(x, y, z);
          group.scale.setScalar(0.85);
          group.rotation.y = -orbitGroupRef.current.rotation.y;
        });
      } else {
        orbitGroupRef.current.visible = false;
      }
    }

    // ── 3. Stage 2 Problem Fragmentation Particles ──
    if (scatterGroupRef.current) {
      if (p >= 0.16 && p <= 0.40) {
        scatterGroupRef.current.visible = true;
        const scatterProg = (p - 0.16) / 0.24;
        scatterGroupRef.current.children.forEach((child, i) => {
          child.position.x = Math.sin(i * 1.5 + t) * (1.2 + scatterProg * 2.4);
          child.position.y = -scatterProg * (1.2 + (i % 3) * 0.6);
          child.position.z = Math.cos(i * 1.2) * (1.0 + scatterProg * 2.0);
          child.rotation.x = t * (i % 2 === 0 ? 1 : -1);
          child.rotation.y = t * 0.8;
          if (child.material) {
            child.material.opacity = Math.max(0, 0.45 - scatterProg * 0.4);
          }
        });
      } else {
        scatterGroupRef.current.visible = false;
      }
    }

    // ── 4. Stage 3 Path & 5 Morphing Nodes ──
    if (nodesGroupRef.current) {
      if (p >= 0.35 && p <= 0.68) {
        nodesGroupRef.current.visible = true;
        const pathProg = (p - 0.38) / 0.27;
        nodesGroupRef.current.children.forEach((node, i) => {
          if (i === 0) return; // skip primitive line
          const nodeIndex = i - 1;
          const nodeRatio = nodeIndex / 4;
          const isCurrent = Math.abs(pathProg - nodeRatio) < 0.12;
          const isPassed = pathProg >= nodeRatio;

          if (isCurrent) {
            node.scale.setScalar(1.35 + Math.sin(t * 6) * 0.15);
            node.material.color.set(COLOR_ORANGE);
            node.material.opacity = 0.95;
          } else if (isPassed) {
            node.scale.setScalar(1.1);
            node.material.color.set(COLOR_NAVY);
            node.material.opacity = 0.7;
          } else {
            node.scale.setScalar(0.9);
            node.material.color.set(COLOR_LINE);
            node.material.opacity = 0.35;
          }
        });
      } else {
        nodesGroupRef.current.visible = false;
      }
    }

    // ── 5. Stage 4: Stakeholder Spotlight Morph ──
    if (stakeholderHighlightRef.current) {
      if (p >= 0.64 && p <= 0.86) {
        stakeholderHighlightRef.current.visible = true;
        const subP = ((p - 0.64) / 0.22) * 4;
        const activeIdx = Math.min(3, Math.floor(subP));

        stakeholderHighlightRef.current.children.forEach((child, idx) => {
          if (idx === activeIdx) {
            child.visible = true;
            child.rotation.y = t * 0.6;
            child.scale.setScalar(1.2 + Math.sin(t * 2) * 0.06);
          } else {
            child.visible = false;
          }
        });
      } else {
        stakeholderHighlightRef.current.visible = false;
      }
    }
  });

  const fragments = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      scale: 0.05 + Math.random() * 0.08,
      key: i,
    }));
  }, []);

  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[5, 8, 5]} intensity={0.95} color="#FFFFFF" />
      <pointLight position={[0, 2, 4]} intensity={0.65} color="#FFF5EB" />

      {/* ── Soft Ambient Shadow beneath the particle (Grounding in light space) ── */}
      <mesh ref={shadowRef} position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 1.5, 32]} />
        <meshBasicMaterial color="#003F66" transparent opacity={0.06} />
      </mesh>

      {/* ── Central Problem Particle (Signal Orange, breathes) ── */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={COLOR_ORANGE}
          emissive={COLOR_ORANGE}
          emissiveIntensity={0.95}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* ── Soft Halo around Problem Particle ── */}
      <mesh ref={haloRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={COLOR_ORANGE}
          transparent
          opacity={0.18}
          side={THREE.BackSide}
        />
      </mesh>

      {/* ── 5 Orbiting 3D Stakeholder Logos (Govt, Student, University, Citizen, NGO/Startup) ── */}
      <group ref={orbitGroupRef}>
        {/* 1. Citizen Logo 3D */}
        <group ref={(el) => (logoRefs.current[0] = el)}>
          <CitizenLogo3D opacity={scroll < 0.20 ? 0.32 : 0.9} />
          {scroll > 0.82 && (
            <Html center distanceFactor={8} zIndexRange={[0, 0]}>
              <LogoInsignia label="Citizen" color="#006199" sublabel="Problem Reporter" />
            </Html>
          )}
        </group>

        {/* 2. Government Logo 3D */}
        <group ref={(el) => (logoRefs.current[1] = el)}>
          <GovtLogo3D opacity={scroll < 0.20 ? 0.32 : 0.9} />
          {scroll > 0.82 && (
            <Html center distanceFactor={8} zIndexRange={[0, 0]}>
              <LogoInsignia label="Government" color="#14213D" sublabel="SLA Validation" />
            </Html>
          )}
        </group>

        {/* 3. Student Logo 3D */}
        <group ref={(el) => (logoRefs.current[2] = el)}>
          <StudentLogo3D opacity={scroll < 0.20 ? 0.32 : 0.9} />
          {scroll > 0.82 && (
            <Html center distanceFactor={8} zIndexRange={[0, 0]}>
              <LogoInsignia label="Students" color="#0284C7" sublabel="Capstone Builders" />
            </Html>
          )}
        </group>

        {/* 4. University Logo 3D */}
        <group ref={(el) => (logoRefs.current[3] = el)}>
          <UniversityLogo3D opacity={scroll < 0.20 ? 0.32 : 0.9} />
          {scroll > 0.82 && (
            <Html center distanceFactor={8} zIndexRange={[0, 0]}>
              <LogoInsignia label="University" color="#7C3AED" sublabel="R&D Faculty" />
            </Html>
          )}
        </group>

        {/* 5. NGO & Startup Logo 3D */}
        <group ref={(el) => (logoRefs.current[4] = el)}>
          <NgoStartupLogo3D opacity={scroll < 0.20 ? 0.32 : 0.9} />
          {scroll > 0.82 && (
            <Html center distanceFactor={8} zIndexRange={[0, 0]}>
              <LogoInsignia label="NGO / Startup" color="#DC2626" sublabel="CSR & Deployment" />
            </Html>
          )}
        </group>
      </group>

      {/* ── Stage 2 Scatter Fragments ── */}
      <group ref={scatterGroupRef} visible={false}>
        {fragments.map((f) => (
          <mesh key={f.key} scale={f.scale}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={COLOR_LINE}
              transparent
              opacity={0.4}
              roughness={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* ── Stage 3: 3D Spline Path & 5 Morphing Lifecycle Nodes ── */}
      <group ref={nodesGroupRef} visible={false}>
        <primitive
          object={
            new THREE.Line(
              splineGeometry,
              new THREE.LineDashedMaterial({
                color: COLOR_NAVY,
                dashSize: 0.1,
                gapSize: 0.05,
                transparent: true,
                opacity: 0.28,
              })
            )
          }
        />
        {NODES_5.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            {idx === 0 && <sphereGeometry args={[0.18, 16, 16]} />}
            {idx === 1 && <octahedronGeometry args={[0.2, 0]} />}
            {idx === 2 && <cylinderGeometry args={[0.18, 0.18, 0.26, 6]} />}
            {idx === 3 && <torusGeometry args={[0.16, 0.04, 12, 24]} />}
            {idx === 4 && <boxGeometry args={[0.24, 0.24, 0.24]} />}
            <meshStandardMaterial color={COLOR_NAVY} transparent opacity={0.65} />
          </mesh>
        ))}
      </group>

      {/* ── Stage 4: Stakeholder Spotlight 3D Logos (Citizens, Gov, University, Industry/NGO) ── */}
      <group ref={stakeholderHighlightRef} visible={false} position={[0, 0, 0]}>
        {/* 1. Citizens spotlight */}
        <group>
          <CitizenLogo3D opacity={1} />
        </group>

        {/* 2. Government spotlight */}
        <group>
          <GovtLogo3D opacity={1} />
        </group>

        {/* 3. University & Students spotlight */}
        <group>
          <UniversityLogo3D opacity={1} />
        </group>

        {/* 4. NGOs & Industry spotlight */}
        <group>
          <NgoStartupLogo3D opacity={1} />
        </group>
      </group>
    </>
  );
}

// ── Root Canvas Component — Fixed full-page continuous 3D canvas ──
export default function CivicParticleScene() {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 46 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ContinuousStoryScene />
      </Canvas>
    </div>
  );
}
