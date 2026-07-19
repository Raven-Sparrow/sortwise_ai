import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, MeshDistortMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

const BIN_COLORS = {
  recyclable: '#2FA8D9',
  compost: '#8CC63F',
  hazardous: '#E0574F',
  landfill: '#B08968',
}

// Redesigned Futuristic Waste Chamber
function FloatingBin({ position, color, scale = 1, speed = 1 }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (!ref.current) return
    // Smooth floating and rotating
    ref.current.rotation.y = state.clock.elapsedTime * 0.25 * speed
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 * speed) * 0.05
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 * speed) * 0.12
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Outer Chamber body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.55, 0.45, 1.0, 24]} />
        <meshStandardMaterial color="#0f231e" roughness={0.25} metalness={0.4} />
      </mesh>
      
      {/* Glass Inner core */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.4, 0.8, 24]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.1} 
          transmission={0.65} 
          thickness={0.5} 
          transparent 
          opacity={0.35} 
        />
      </mesh>

      {/* Top Rim collar */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.08, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} emissive={color} emissiveIntensity={0.2} />
      </mesh>

      {/* Futuristic glowing indicator light dot */}
      <mesh position={[0, 0.28, 0.54]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Base ring */}
      <mesh position={[0, -0.52, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.06, 24]} />
        <meshStandardMaterial color="#091411" metalness={0.8} />
      </mesh>

      {/* Stylized metal handle brackets */}
      <mesh position={[-0.58, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.06, 0.3, 0.08]} />
        <meshStandardMaterial color="#2d423b" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.58, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.06, 0.3, 0.08]} />
        <meshStandardMaterial color="#2d423b" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function ParticleField() {
  const count = 160
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.012
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.05
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#8CD32B" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

function GlowingOrb({ position, color }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.3) * 0.1)
  })

  return (
    <Float speed={1.5} floatIntensity={0.5}>
      <Sphere ref={ref} args={[0.18, 16, 16]} position={position}>
        <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.5} distort={0.25} speed={1.8} transparent opacity={0.6} />
      </Sphere>
    </Float>
  )
}

// Parallax Group that responds to mouse movement
function ParallaxGroup({ children }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (!groupRef.current) return
    const { pointer } = state
    // Smoothly interpolate rotation to simulate 3D camera depth parallax
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.18, 0.05)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -pointer.y * 0.12, 0.05)
  })

  return <group ref={groupRef}>{children}</group>
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 8, 4]} intensity={1.0} color="#8CC63F" />
      <pointLight position={[-6, 4, -2]} intensity={0.8} color="#2FA8D9" />
      <pointLight position={[6, -2, 2]} intensity={0.5} color="#E0574F" />

      <Stars radius={60} depth={40} count={900} factor={4} saturation={0.3} fade speed={0.4} />
      <ParticleField />

      <ParallaxGroup>
        <FloatingBin position={[-3.2, 0.4, -1.2]} color={BIN_COLORS.recyclable} scale={0.8} speed={0.7} />
        <FloatingBin position={[3.0, -0.5, -0.8]} color={BIN_COLORS.compost} scale={1.0} speed={1.0} />
        <FloatingBin position={[-1.5, -1.1, -2.2]} color={BIN_COLORS.hazardous} scale={0.7} speed={1.2} />
        <FloatingBin position={[2.0, 0.8, -1.8]} color={BIN_COLORS.landfill} scale={0.8} speed={0.8} />

        <GlowingOrb position={[-4.2, 2.0, -2.5]} color="#2FA8D9" />
        <GlowingOrb position={[4.0, -1.5, -1.5]} color="#8CC63F" />
        <GlowingOrb position={[0, 2.5, -3.5]} color="#E0574F" />
      </ParallaxGroup>
    </>
  )
}

export default function Scene3DBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      {/* High-fidelity glowing vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070D0B]/70 via-transparent to-[#070D0B]/90" />
    </div>
  )
}
