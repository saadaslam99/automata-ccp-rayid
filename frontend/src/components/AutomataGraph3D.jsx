import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

function Node({ position, label, isActive, isSafe, isDanger, isWarning }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (isActive && meshRef.current) {
      meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      meshRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
    } else if (meshRef.current) {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  let color = '#FFFFFF';
  if (isActive) color = '#305C73';
  else if (isSafe) color = '#3C8D6E';
  else if (isWarning) color = '#D79A38';
  else if (isDanger) color = '#C85B4A';

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      <Text
        position={[0, position[1] >= 0 ? 0.6 : -0.6, 0]}
        fontSize={0.25}
        color="#182024"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

function Edge({ start, end, isActive }) {
  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end)
    ]);
  }, [start, end]);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={isActive ? '#305C73' : '#D8D2C4'} linewidth={2} />
    </line>
  );
}

export default function AutomataGraph3D({ activeStateName }) {
  const nodes = [
    { id: 'q0', label: 'q0 (Start)', pos: [-4, 0, 0] },
    { id: 'q1', label: 'q1', pos: [-2.5, 0, 0] },
    { id: 'q2', label: 'q2', pos: [-1, 0, 0] },
    { id: 'q3', label: 'q3', pos: [0.5, 0, 0] },
    { id: 'q4', label: 'q4', pos: [2, 0, 0] },
    { id: 'qsuspicious', label: 'qsuspicious', pos: [0.5, -1.5, 0], isWarning: true },
    { id: 'qsafe', label: 'qsafe', pos: [3.5, 0, 0], isSafe: true },
    { id: 'qinvalid', label: 'qinvalid', pos: [-1, -1.5, 0], isDanger: true }
  ];

  const edges = [
    { source: 'q0', target: 'q1' },
    { source: 'q1', target: 'q2' },
    { source: 'q2', target: 'q3' },
    { source: 'q2', target: 'qinvalid' },
    { source: 'q3', target: 'qsuspicious' },
    { source: 'q3', target: 'q4' },
    { source: 'q4', target: 'qsafe' }
  ];

  const getActiveId = () => {
    if (!activeStateName) return 'q0';
    const match = activeStateName.match(/^q[a-z0-9]+/i);
    return match ? match[0].toLowerCase() : 'q0';
  };

  const activeId = getActiveId();

  return (
    <div className="bg-ts-surface border border-ts-border rounded shadow-sm h-[320px] relative overflow-hidden flex flex-col mt-6">
      <div className="absolute top-5 left-6 z-10 pointer-events-none">
        <h3 className="text-sm font-semibold text-ts-text-main uppercase tracking-wider">DFA Model State</h3>
        <p className="text-xs text-ts-text-muted mt-1">Live 3D automata visualization</p>
      </div>
      
      <div className="flex-1 w-full h-full bg-ts-surface-soft/30 cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
          <ambientLight intensity={0.9} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          
          {edges.map((edge, idx) => {
            const start = nodes.find(n => n.id === edge.source).pos;
            const end = nodes.find(n => n.id === edge.target).pos;
            const isActiveEdge = edge.target === activeId || edge.source === activeId;
            return <Edge key={idx} start={start} end={end} isActive={isActiveEdge} />;
          })}

          {nodes.map(node => (
            <Node 
              key={node.id}
              position={node.pos}
              label={node.label}
              isActive={activeId === node.id}
              isSafe={node.isSafe && activeId === node.id}
              isWarning={node.isWarning && activeId === node.id}
              isDanger={node.isDanger && activeId === node.id}
            />
          ))}

          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            maxPolarAngle={Math.PI / 2 + 0.3} 
            minPolarAngle={Math.PI / 2 - 0.3}
            maxAzimuthAngle={0.3}
            minAzimuthAngle={-0.3}
          />
        </Canvas>
      </div>
    </div>
  );
}
