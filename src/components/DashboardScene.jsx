import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, Environment, Grid, Html } from '@react-three/drei';
import * as THREE from 'three';

// --- Global Theme Constants ---
const GLOW_GREEN = '#2de25b';
const GLOW_ORANGE = '#f29c38';
const GLOW_CRITICAL = '#ef4444';
const MACHINE_MATERIAL = { color: '#111111', roughness: 0.8, metalness: 0.3 };
const ACCENT_MATERIAL = { color: '#222222', roughness: 0.6, metalness: 0.5 };

// --- Glassmorphic Floating UI Label (AICO Spec) ---
const MachineLabel = ({ id, health, status }) => {
  let color = 'var(--accent-green)';
  let glow = 'rgba(45, 226, 91, 0.6)';
  if (status === 'warning') {
    color = 'var(--accent-orange)';
    glow = 'rgba(242, 156, 56, 0.6)';
  } else if (status === 'critical') {
    color = 'var(--accent-critical)';
    glow = 'rgba(239, 68, 68, 0.6)';
  }
  
  return (
    <Html 
      position={[0, 6.5, 0]} 
      center 
      zIndexRange={[100, 0]}
      style={{ pointerEvents: 'none', transition: 'all 0.3s ease' }}
    >
      <div style={{
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(45, 226, 91, 0.15)',
        boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.02)`,
        borderRadius: '8px',
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: 'Inter',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        transform: 'translate3d(0,0,0)'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 8px ${glow}`,
        }} />
        <span style={{ color: 'var(--text-secondary)' }}>{id}</span>
        <span className="tabular-data" style={{ color: color, filter: `drop-shadow(0 0 4px ${glow})` }}>{health}%</span>
      </div>
    </Html>
  );
};

// --- Base Floor Plate for Machines ---
const GlowingBase = ({ color, isHovered }) => {
  const opacity = isHovered ? 0.4 : 0.15;
  const lineOpacity = isHovered ? 0.8 : 0.4;
  return (
    <group>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[4, 0.1, 4]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      <lineSegments position={[0, 0.05, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(4, 0.1, 4)]} />
        <lineBasicMaterial color={color} transparent opacity={lineOpacity} />
      </lineSegments>
    </group>
  );
};

// --- 1. Robot Arm Machine ---
function RobotArmMachine({ position, id, health, status, timeScale = 1, rotationOffset = 0, onClick, isHovered, setHovered }) {
  const baseRef = useRef();
  const lowerArmRef = useRef();
  const upperArmRef = useRef();
  const headRef = useRef();
  
  const glowColor = status === 'critical' ? GLOW_CRITICAL : status === 'warning' ? GLOW_ORANGE : GLOW_GREEN;
  const targetIntensity = (status !== 'active' ? 3 : 1.5) + (isHovered ? 1.5 : 0);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * timeScale + rotationOffset;
    if (baseRef.current && lowerArmRef.current && upperArmRef.current && headRef.current) {
      baseRef.current.rotation.y = Math.sin(t * 0.5) * 1.2;
      lowerArmRef.current.rotation.z = Math.sin(t * 0.8) * 0.6 - 0.2;
      upperArmRef.current.rotation.z = Math.cos(t * 0.8) * 0.8 + 0.4;
      headRef.current.rotation.x = t * 2;
    }
  });

  return (
    <group 
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(id); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; setHovered(id); }}
      onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; setHovered(null); }}
    >
      <GlowingBase color={glowColor} isHovered={isHovered} />
      
      {/* Pedestal */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.9, 1.3, 1, 32]} />
        <meshStandardMaterial {...MACHINE_MATERIAL} />
      </mesh>

      <group position={[0, 1.0, 0]} ref={baseRef}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.4, 0.8, 1.4]} />
          <meshStandardMaterial {...MACHINE_MATERIAL} />
        </mesh>

        <group position={[0, 0.8, 0]} ref={lowerArmRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 1.8, 32]} />
            <meshStandardMaterial {...ACCENT_MATERIAL} />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <boxGeometry args={[0.7, 2.8, 0.7]} />
            <meshStandardMaterial {...MACHINE_MATERIAL} />
          </mesh>

          <group position={[0, 2.8, 0]} ref={upperArmRef}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 1.4, 32]} />
              <meshStandardMaterial {...ACCENT_MATERIAL} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <boxGeometry args={[0.5, 2.4, 0.5]} />
              <meshStandardMaterial {...MACHINE_MATERIAL} />
            </mesh>

            <group position={[0, 2.4, 0]}>
               <mesh ref={headRef}>
                 <cylinderGeometry args={[0.4, 0.4, 1.0, 16]} />
                 <meshStandardMaterial {...MACHINE_MATERIAL} />
               </mesh>
               <mesh position={[0, -0.6, 0]}>
                  <cylinderGeometry args={[0.15, 0.05, 0.3, 16]} />
                  <meshStandardMaterial color="#ffffff" emissive={glowColor} emissiveIntensity={targetIntensity} toneMapped={false} />
               </mesh>
               <pointLight color={glowColor} intensity={targetIntensity} distance={6} decay={2} position={[0, -0.8, 0]} />
            </group>
          </group>
        </group>
      </group>
      <MachineLabel id={id} health={health} status={status} />
    </group>
  );
}

// --- 2. CNC Milling Machine ---
function CNCMachine({ position, id, health, status, timeScale = 1, rotationOffset = 0, onClick, isHovered, setHovered }) {
  const spindleRef = useRef();
  const glowColor = status === 'critical' ? GLOW_CRITICAL : status === 'warning' ? GLOW_ORANGE : GLOW_GREEN;

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * timeScale * 2 + rotationOffset;
    if (spindleRef.current) {
      spindleRef.current.position.x = Math.sin(t) * 0.8;
      spindleRef.current.position.z = Math.cos(t * 0.5) * 0.5;
    }
  });

  return (
    <group 
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(id); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; setHovered(id); }}
      onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; setHovered(null); }}
    >
      <GlowingBase color={glowColor} isHovered={isHovered} />
      
      {/* Main Enclosure */}
      <mesh position={[0, 1.8, -0.5]}>
        <boxGeometry args={[3.2, 3.4, 2]} />
        <meshStandardMaterial {...MACHINE_MATERIAL} />
      </mesh>

      {/* Glass Window */}
      <mesh position={[0, 1.8, 0.55]}>
        <boxGeometry args={[2.8, 2, 0.1]} />
        <meshStandardMaterial color="#0b1111" transparent opacity={0.6} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Emissive Inside Bed Light */}
      <rectAreaLight width={3} height={2} color="#ffffff" intensity={isHovered ? 4 : 2} position={[0, 3, 0]} rotation={[-Math.PI / 2, 0, 0]} />

      {/* Moving Spindle Inside */}
      <group position={[0, 2.5, 0]} ref={spindleRef}>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
          <meshStandardMaterial {...ACCENT_MATERIAL} />
        </mesh>
        <mesh position={[0, -1.1, 0]}>
          <cylinderGeometry args={[0.05, 0.01, 0.4, 8]} />
          <meshStandardMaterial color="#ffffff" emissive={glowColor} emissiveIntensity={isHovered ? 3 : 1.5} toneMapped={false} />
        </mesh>
        <pointLight color={glowColor} intensity={isHovered ? 1 : 0.5} distance={3} position={[0, -1.2, 0]} />
      </group>

      <MachineLabel id={id} health={health} status={status} />
    </group>
  );
}

// --- 3. Conveyor Belt Motor System ---
function ConveyorBelt({ position, id, health, status, timeScale = 1, onClick, isHovered, setHovered }) {
  const rollerRef1 = useRef();
  const rollerRef2 = useRef();
  const rollerRef3 = useRef();
  const glowColor = status === 'critical' ? GLOW_CRITICAL : status === 'warning' ? GLOW_ORANGE : GLOW_GREEN;

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * timeScale * 5;
    if (rollerRef1.current) rollerRef1.current.rotation.z = t;
    if (rollerRef2.current) rollerRef2.current.rotation.z = t;
    if (rollerRef3.current) rollerRef3.current.rotation.z = t;
  });

  return (
    <group 
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(id); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; setHovered(id); }}
      onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; setHovered(null); }}
    >
      <GlowingBase color={glowColor} isHovered={isHovered} />
      
      {/* Conveyor Legs */}
      <mesh position={[-1.5, 0.6, 0]}>
        <boxGeometry args={[0.2, 1.2, 1.5]} />
        <meshStandardMaterial {...MACHINE_MATERIAL} />
      </mesh>
      <mesh position={[1.5, 0.6, 0]}>
        <boxGeometry args={[0.2, 1.2, 1.5]} />
        <meshStandardMaterial {...MACHINE_MATERIAL} />
      </mesh>

      {/* Main Belt Surface */}
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[4, 0.1, 1.6]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      <lineSegments position={[0, 1.25, 0]}>
         <edgesGeometry args={[new THREE.BoxGeometry(4, 0.1, 1.6)]} />
         <lineBasicMaterial color={glowColor} transparent opacity={isHovered ? 0.6 : 0.3} />
      </lineSegments>

      {/* Rollers under Belt */}
      <group position={[0, 1.1, 0]}>
        <mesh position={[-1.8, 0, 0]} rotation={[Math.PI / 2, 0, 0]} ref={rollerRef1}>
          <cylinderGeometry args={[0.15, 0.15, 1.7, 16]} />
          <meshStandardMaterial {...ACCENT_MATERIAL} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} ref={rollerRef2}>
          <cylinderGeometry args={[0.15, 0.15, 1.7, 16]} />
          <meshStandardMaterial {...ACCENT_MATERIAL} />
        </mesh>
        <mesh position={[1.8, 0, 0]} rotation={[Math.PI / 2, 0, 0]} ref={rollerRef3}>
          <cylinderGeometry args={[0.15, 0.15, 1.7, 16]} />
          <meshStandardMaterial {...ACCENT_MATERIAL} />
        </mesh>
      </group>

      {/* AICO Sensor Module Attached */}
      <mesh position={[0, 1.4, 0.85]}>
         <boxGeometry args={[0.4, 0.3, 0.2]} />
         <meshStandardMaterial color="#ffffff" emissive={glowColor} emissiveIntensity={isHovered ? 2 : 1} />
      </mesh>

      <MachineLabel id={id} health={health} status={status} />
    </group>
  );
}


// --- Factory Floor Manager ---
function FactoryFloor({ factoryData, onMachineClick }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <group>
      {factoryData?.map((mac, idx) => {
        const props = {
          ...mac,
          onClick: onMachineClick,
          isHovered: hoveredNode === mac.id,
          setHovered: setHoveredNode
        };
        if (mac.type === 'robot') return <RobotArmMachine key={idx} {...props} />;
        if (mac.type === 'cnc') return <CNCMachine key={idx} {...props} />;
        if (mac.type === 'conveyor') return <ConveyorBelt key={idx} {...props} />;
        return null;
      })}
    </group>
  );
}

// --- Exact Scene Shell Engine ---
export default function DashboardScene({ factoryData, onMachineClick }) {
  return (
    <Canvas gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}>
      {/* Strict Isometric Camera setup aiming at the center */}
      <OrthographicCamera 
        makeDefault 
        position={[40, 40, 40]}
        zoom={22}
        near={-100}
        far={1000}
        rotation={[-Math.PI / 4, Math.PI / 4, 0]} 
        lookAt={[0, 0, 0]}
      />
      
      {/* Subtle Global & Directional Lighting */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[20, 40, 20]} intensity={1.5} color="#ffffff" castShadow />
      
      {/* High-end real-world reflections on the metals */}
      <Environment preset="city" />

      {/* The precise Grid layout based on specs */}
      <Grid 
        position={[0, -0.01, 0]} 
        args={[150, 150]} 
        cellSize={1.5} 
        cellThickness={1} 
        cellColor="#1a2622" 
        sectionSize={7.5} 
        sectionThickness={1.5} 
        sectionColor="#2de25b" 
        fadeDistance={55}
        fadeStrength={1}
      />

      <FactoryFloor factoryData={factoryData} onMachineClick={onMachineClick} />

      {/* Integration Fog for smooth fading at the viewport edges */}
      <fog attach="fog" args={['#050808', 40, 80]} />
    </Canvas>
  );
}
