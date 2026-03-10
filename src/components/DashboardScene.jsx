import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Box, Cylinder } from '@react-three/drei';

function RobotArm({ position, color = '#f29c38', rotationOffset = 0 }) {
  const group = useRef();
  
  // Simple animation for the robot arm
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.5 + rotationOffset) * 0.5;
      group.current.children[1].rotation.z = Math.sin(t + rotationOffset) * 0.2 - 0.2;
    }
  });

  return (
    <group position={position} ref={group}>
      {/* Base */}
      <Cylinder args={[0.8, 1, 0.4, 32]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#333" />
      </Cylinder>
      
      {/* Lower Arm Pivot */}
      <group position={[0, 0.4, 0]}>
        {/* Lower Arm */}
        <Box args={[0.4, 2, 0.4]} position={[0, 1, 0]}>
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
        </Box>
        
        {/* Upper Arm Pivot */}
        <group position={[0, 2, 0]}>
          {/* Upper Arm */}
          <Box args={[0.3, 1.5, 0.3]} position={[0, 0.6, 0.2]} rotation={[0.4, 0, 0]}>
             <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
          </Box>
          {/* Effector */}
          <Cylinder args={[0.2, 0.2, 0.5, 16]} position={[0, 1.4, 0.5]} rotation={[0.4, 0, 0]}>
            <meshStandardMaterial color="#fff" emissive="#2de25b" emissiveIntensity={2} />
          </Cylinder>
        </group>
      </group>
    </group>
  );
}

function AssemblyLine() {
  return (
    <group>
      {/* Belt */}
      <Box args={[12, 0.2, 2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#222" />
      </Box>
      {/* Items on belt */}
      {[-4, 0, 4].map((x, i) => (
        <Box key={i} args={[0.8, 0.4, 1]} position={[x, 0.3, 0]}>
          <meshStandardMaterial color="#aaa" metalness={0.5} roughness={0.2} />
        </Box>
      ))}
      {/* Main Robot */}
      <RobotArm position={[0, 0, -2]} />
      {/* Secondary Robots */}
      <RobotArm position={[-4, 0, -2]} color="#8a9b96" rotationOffset={1} />
      <RobotArm position={[4, 0, -2]} color="#8a9b96" rotationOffset={2} />
    </group>
  );
}

export default function DashboardScene() {
  return (
    <Canvas 
      camera={{ position: [10, 8, 10], fov: 40 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#0b1111']} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#fff" />
      <pointLight position={[0, 2, 0]} intensity={2} color="#2de25b" distance={10} />
      
      <Grid 
        position={[0, -0.1, 0]} 
        args={[20, 20]} 
        cellSize={1} 
        cellThickness={1} 
        cellColor="#1a2622" 
        sectionSize={4} 
        sectionThickness={1.5} 
        sectionColor="#2de25b" 
        fadeDistance={25} 
      />

      <AssemblyLine />
      
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 3}
        minDistance={10}
        maxDistance={25}
      />
      
      <Environment preset="city" />
    </Canvas>
  );
}
