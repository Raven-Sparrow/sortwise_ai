import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { soundManager } from '../lib/soundManager'

const BINS = [
  { key: 'recyclable', color: '#2FA8D9', label: 'Recycling', angle: 0, items: 'Plastic Bottles, Cans, Cardboard, Paper' },
  { key: 'compost', color: '#8CC63F', label: 'Compost', angle: Math.PI / 2, items: 'Food Scraps, Leaves, Tea Bags, Fruit Peels' },
  { key: 'hazardous', color: '#E0574F', label: 'E-Waste', angle: Math.PI, items: 'Batteries, Phones, Chargers, Bulbs, Syringes' },
  { key: 'landfill', color: '#B08968', label: 'Landfill', angle: (3 * Math.PI) / 2, items: 'Styrofoam, Wrappers, Diapers, Dirty Tissues' },
]

function InteractiveChamber({ bin, activeKey, setActiveKey, ...props }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const isSelected = activeKey === bin.key

  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    // Animate scale on hover/selection
    const targetScale = isSelected ? 1.25 : hovered ? 1.12 : 1.0
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1)
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1)
    
    // Slow self-rotation for selected bin
    if (isSelected) {
      meshRef.current.rotation.y += delta * 1.5
    } else {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1)
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    soundManager.playCoin()
    setActiveKey(isSelected ? null : bin.key)
  }

  const binColor = bin.color
  const glowIntensity = isSelected ? 0.8 : hovered ? 0.45 : 0.18

  return (
    <group
      {...props}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
    >
      <group ref={meshRef}>
        {/* Outer casing */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.24, 0.65, 20]} />
          <meshStandardMaterial color="#13241F" roughness={0.3} metalness={0.5} />
        </mesh>
        
        {/* Translucent colored shell */}
        <mesh>
          <cylinderGeometry args={[0.27, 0.21, 0.52, 20]} />
          <meshPhysicalMaterial 
            color={binColor} 
            roughness={0.15} 
            transmission={0.6} 
            thickness={0.2} 
            transparent 
            opacity={0.3} 
          />
        </mesh>

        {/* Top Rim collar */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.07, 20]} />
          <meshStandardMaterial
            color={binColor}
            roughness={0.2}
            metalness={0.4}
            emissive={binColor}
            emissiveIntensity={glowIntensity}
          />
        </mesh>

        {/* Center label indicator circle */}
        <mesh position={[0, 0, 0.28]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.08, 16]} />
          <meshStandardMaterial
            color={binColor}
            emissive={binColor}
            emissiveIntensity={isSelected ? 1.0 : 0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  )
}

function BinCluster({ activeKey, setActiveKey }) {
  const group = useRef()

  useFrame((state) => {
    if (!group.current) return
    const { pointer } = state
    
    // Slow rotation when nothing is selected, else focus on selected
    if (!activeKey) {
      group.current.rotation.y += 0.003
    }
    
    // Tilt slightly based on cursor
    group.current.rotation.y += pointer.x * 0.004
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.1, 0.05)
  })

  return (
    <group ref={group}>
      {BINS.map((bin) => {
        const x = Math.cos(bin.angle) * 1.15
        const z = Math.sin(bin.angle) * 1.15
        return (
          <InteractiveChamber
            key={bin.key}
            bin={bin}
            activeKey={activeKey}
            setActiveKey={setActiveKey}
            position={[x, 0, z]}
            rotation={[0, -bin.angle + Math.PI / 2, 0]}
          />
        )
      })}

      {/* Central digital grid base ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.36, 0]} receiveShadow>
        <ringGeometry args={[0.75, 0.85, 32]} />
        <meshStandardMaterial color="#8CC63F" emissive="#8CC63F" emissiveIntensity={0.2} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

export default function HeroBin() {
  const [activeKey, setActiveKey] = useState(null)
  const activeBin = BINS.find((b) => b.key === activeKey)

  return (
    <div className="relative w-full h-full group" aria-hidden="true">
      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Canvas
          shadows
          camera={{ position: [2.8, 1.6, 3.0], fov: 38 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[4, 5, 2]} intensity={1.4} castShadow />
            <pointLight position={[-4, 3, -1]} intensity={0.8} color="#2FA8D9" />
            <pointLight position={[3, -1, 3]} intensity={0.6} color="#8CC63F" />
            
            <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
              <BinCluster activeKey={activeKey} setActiveKey={setActiveKey} />
            </Float>
            <ContactShadows position={[0, -0.5, 0]} opacity={0.45} scale={5} blur={2.0} far={3.5} />
          </Suspense>
        </Canvas>
      </div>

      {/* Holographic HUD Overlay */}
      {activeBin && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 glass-card border border-pine-500/80 p-3 rounded-xl text-center shadow-2xl animate-fade-up hud-border z-10 select-none pointer-events-none">
          <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: activeBin.color }}>
            Chamber Locked
          </p>
          <h4 className="font-display font-bold text-sm text-paper mt-0.5">{activeBin.label}</h4>
          <p className="text-[10px] text-muted leading-snug mt-1.5">{activeBin.items}</p>
        </div>
      )}

      {/* Hint text */}
      {!activeBin && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 font-mono text-[9px] text-muted uppercase tracking-widest opacity-0 group-hover:opacity-80 transition-opacity pointer-events-none">
          Click bins to inspect
        </div>
      )}
    </div>
  )
}
