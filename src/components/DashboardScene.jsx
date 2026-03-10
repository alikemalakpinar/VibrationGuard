import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, Environment, Grid, Html } from '@react-three/drei';
import * as THREE from 'three';

// --- Global Theme Constants ---
const GLOW_GREEN = '#2de25b';
const GLOW_ORANGE = '#f29c38';
const MACHINE_MATERIAL = { color: '#1a1a1a', roughness: 0.8, metalness: 0.2 };

// --- Glassmorphic Floating UI Label ---
const MachineLabel = ({ id, health, status }) => {
  const isWarning = status === 'warning';
  const color = isWarning ? 'var(--accent-orange)' : 'var(--accent-green)';
  const glow = isWarning ? 'rgba(242, 156, 56, 0.6)' : 'rgba(45, 226, 91, 0.6)';
  
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
        <span style={{ color: color, filter: `drop-shadow(0 0 4px ${glow})` }}>{health}%</span>
      </div>
    </Html>
  );
};

// --- Complex Animated Robot Machine ---
function RobotMachine({ position, id, health, status, rotationOffset = 0, timeScale = 1 }) {
  const baseRef = useRef();
  const lowerArmRef = useRef();
  const upperArmRef = useRef();
  const headRef = useRef();
  
  const isWarning = status === 'warning';
  const glowColor = isWarning ? GLOW_ORANGE : GLOW_GREEN;
  const targetIntensity = isWarning ? 3 : 1.5;

  // Assembly Animation Loop
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
    <group position={position}>
      {/* 1. Floor Glowing Base Plate */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.5, 4.5]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent 
          opacity={0.15} 
          side={THREE.DoubleSide} 
          depthWrite={false}
        />
      </mesh>
      
      {/* 2. Base Bounding Structure */}
      <mesh position={[0, 0.05, 0]}>
         <boxGeometry args={[3.5, 0.1, 3.5]} />
         <meshStandardMaterial color="#111" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Base Edge Highlight */}
      <lineSegments position={[0, 0.05, 0]}>
         <edgesGeometry args={[new THREE.BoxGeometry(3.5, 0.1, 3.5)]} />
         <lineBasicMaterial color={glowColor} transparent opacity={0.4} />
      </lineSegments>

      {/* 3. Machine Base Pedestal */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.9, 1.3, 1, 32]} />
        <meshStandardMaterial {...MACHINE_MATERIAL} />
      </mesh>

      {/* 4. Revolving Base Joint */}
      <group position={[0, 1.0, 0]} ref={baseRef}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.4, 0.8, 1.4]} />
          <meshStandardMaterial {...MACHINE_MATERIAL} />
        </mesh>

        {/* 5. Lower Arm Pivot & Arm */}
        <group position={[0, 0.8, 0]} ref={lowerArmRef}>
          {/* Pivot Cylinder */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 1.8, 32]} />
            <meshStandardMaterial color="#222" roughness={0.6} metalness={0.5} />
            <lineSegments>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.6, 0.6, 1.8, 32)]} />
              <lineBasicMaterial color={glowColor} transparent opacity={0.15} />
            </lineSegments>
          </mesh>
          
          {/* Lower Arm Body */}
          <mesh position={[0, 1.4, 0]}>
            <boxGeometry args={[0.7, 2.8, 0.7]} />
            <meshStandardMaterial {...MACHINE_MATERIAL} />
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.7, 2.8, 0.7)]} />
              <lineBasicMaterial color={glowColor} transparent opacity={0.1} />
            </lineSegments>
          </mesh>

          {/* 6. Upper Arm Pivot & Arm */}
          <group position={[0, 2.8, 0]} ref={upperArmRef}>
            {/* Pivot Cylinder */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 1.4, 32]} />
              <meshStandardMaterial color="#222" roughness={0.6} metalness={0.5} />
            </mesh>
            
            {/* Upper Arm Body */}
            <mesh position={[0, 1.2, 0]}>
              <boxGeometry args={[0.5, 2.4, 0.5]} />
              <meshStandardMaterial {...MACHINE_MATERIAL} />
            </mesh>

            {/* 7. Precision Effector Head */}
            <group position={[0, 2.4, 0]}>
               {/* Head Unit */}
               <mesh ref={headRef}>
                 <cylinderGeometry args={[0.4, 0.4, 1.0, 16]} />
                 <meshStandardMaterial {...MACHINE_MATERIAL} />
               </mesh>
               
               {/* Emissive Laser/Welding Tip */}
               <mesh position={[0, -0.6, 0]}>
                  <cylinderGeometry args={[0.15, 0.05, 0.3, 16]} />
                  <meshStandardMaterial color="#ffffff" emissive={glowColor} emissiveIntensity={targetIntensity} toneMapped={false} />
               </mesh>
               
               {/* Dynamic Local Point Light */}
               <pointLight color={glowColor} intensity={targetIntensity} distance={6} decay={2} position={[0, -0.8, 0]} />
            </group>
          </group>
        </group>
      </group>

      {/* Callout Label positioned above the machine */}
      <MachineLabel id={id} health={health} status={status} />
    </group>
  );
}

// --- Factory Floor Manager ---
function FactoryFloor() {
  // Generate a strict isometric layout of machines
  const factoryItems = useMemo(() => {
    const data = [];
    const rows = 3;
    const cols = 3;
    const spacingX = 8.5;
    const spacingZ = 8.5;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (r - (rows - 1) / 2) * spacingX;
        const z = (c - (cols - 1) / 2) * spacingZ;
        
        // Setup realistic dynamic data matching typical dashboards
        const isWarning = (r === 1 && c === 0) || (r === 0 && c === 2);
        const healthVal = isWarning ? Math.floor(Math.random() * 25) + 20 : Math.floor(Math.random() * 25) + 75;
        
        data.push({
          position: [x, 0, z],
          id: `Z-${r}${c}X`,
          health: healthVal,
          status: isWarning ? 'warning' : 'active',
          rotationOffset: Math.random() * Math.PI * 2,
          timeScale: 0.6 + Math.random() * 0.6
        });
      }
    }
    return data;
  }, []);

  return (
    <group>
      {/* Central Architecture Lines / Conveyors linking the floor */}
      {[0, -8.5, 8.5].map((zPos, idx) => (
        <group key={`conv-${idx}`} position={[0, 0.2, zPos]}>
          <mesh>
            <boxGeometry args={[30, 0.4, 1.5]} />
            <meshStandardMaterial color="#111111" roughness={0.9} />
          </mesh>
          <lineSegments position={[0, 0.21, 0]}>
             <edgesGeometry args={[new THREE.BoxGeometry(30, 0.01, 1.5)]} />
             <lineBasicMaterial color={GLOW_GREEN} transparent opacity={0.15} />
          </lineSegments>
        </group>
      ))}

      {/* Render All Complex Robot Arms */}
      {factoryItems.map((mac, idx) => (
        <RobotMachine key={idx} {...mac} />
      ))}
    </group>
  );
}

// --- Exact Scene Shell Engine ---
export default function DashboardScene() {
  return (
    <Canvas gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}>
      {/* Strict Isometric Camera setup aiming at the center */}
      <OrthographicCamera 
        makeDefault 
        position={[40, 40, 40]}
        zoom={22}
        near={-100}
        far={1000}
        rotation={[-Math.PI / 4, Math.PI / 4, 0]} // Precise isometric rotation offset
        lookAt={[0, 0, 0]}
      />
      
      {/* Subtle Global & Directional Lighting */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[20, 40, 20]} intensity={1.8} color="#ffffff" castShadow />
      
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

      <FactoryFloor />

      {/* Integration Fog for smooth fading at the viewport edges */}
      <fog attach="fog" args={['#050808', 40, 80]} />
    </Canvas>
  );
}
