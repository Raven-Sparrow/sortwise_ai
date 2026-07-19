import { useEffect, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CATEGORIES } from '../lib/wasteMapping'
import { soundManager } from '../lib/soundManager'

const BIN_ORDER = ['recyclable', 'compost', 'hazardous', 'landfill']
const COLOR_HEX = {
  recyclable: '#2FA8D9',
  compost: '#8CC63F',
  hazardous: '#E0574F',
  landfill: '#B08968',
}

const BIN_ICON = {
  recyclable: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 7l3-4h4l3 4M4 7h16M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  compost: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21c6-1 9-6 8-13-7-1-11 3-12 9" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 21c-1-4-3-6-7-8" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  hazardous: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l9 16H3L12 3z" stroke={c} strokeWidth="2" strokeLinejoin="round" /><path d="M12 10v4M12 17h.01" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>
  ),
  landfill: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 20h16M6 20V10l6-5 6 5v10" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
}

// 3D Moving Item on Conveyor Belt
function ConveyorItem({ categoryKey, phase, setPhase, onLaserCross }) {
  const meshRef = useRef()
  const progressRef = useRef(0)
  const crossedRef = useRef(false)

  // Determine geometry based on waste type
  const geometry = useRef(null)
  if (!geometry.current) {
    if (categoryKey === 'recyclable') {
      geometry.current = new THREE.CylinderGeometry(0.2, 0.2, 0.55, 12)
    } else if (categoryKey === 'compost') {
      geometry.current = new THREE.DodecahedronGeometry(0.3, 0)
    } else if (categoryKey === 'hazardous') {
      geometry.current = new THREE.BoxGeometry(0.35, 0.15, 0.5)
    } else {
      geometry.current = new THREE.TorusGeometry(0.18, 0.08, 8, 16)
    }
  }

  useFrame((state, delta) => {
    if (!meshRef.current) return

    if (phase === 'traveling') {
      // Move from X = -2.8 to X = 2.4 (takes ~1.5s)
      progressRef.current += delta * 0.65
      
      // X coordinate path
      const startX = -2.8
      const targetX = 2.4
      const currentX = startX + (targetX - startX) * Math.min(progressRef.current, 1)
      
      meshRef.current.position.x = currentX
      meshRef.current.position.y = 0.08
      
      // Gentle rolling rotation as it moves
      meshRef.current.rotation.z -= delta * 3
      meshRef.current.rotation.x += delta * 1.5

      // Check if item crossed the scanner center (X = 0)
      if (currentX >= 0 && !crossedRef.current) {
        crossedRef.current = true
        onLaserCross()
      }

      // Finish traveling, start dropping
      if (progressRef.current >= 1) {
        setPhase('dropping')
        progressRef.current = 0
      }
    } else if (phase === 'dropping') {
      // Simulate falling down into the sorting chute
      progressRef.current += delta * 3.5
      meshRef.current.position.x = 2.4 + progressRef.current * 0.2
      // Gravity formula: y = h - 0.5 * g * t^2
      meshRef.current.position.y = 0.08 - 0.5 * 9.8 * Math.pow(progressRef.current * 0.4, 2)
      meshRef.current.scale.multiplyScalar(0.96) // shrink as it drops

      if (meshRef.current.position.y < -1.5) {
        setPhase('arrived')
        soundManager.playClick()
      }
    }
  })

  // Material changes color when it passes the scanning laser
  const itemColor = crossedRef.current ? COLOR_HEX[categoryKey] : '#859E94'
  const emissiveIntensity = crossedRef.current ? 0.4 : 0.05

  return (
    <mesh ref={meshRef} position={[-2.8, 0.08, 0]} geometry={geometry.current} castShadow>
      <meshStandardMaterial
        color={itemColor}
        roughness={0.2}
        metalness={0.5}
        emissive={itemColor}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  )
}

// 3D Scene Components
function ConveyorBeltScene({ categoryKey, phase, setPhase, onLaserCross, showLaser }) {
  const beltRef = useRef()

  // Animate conveyor belt texture rollers
  useFrame((state, delta) => {
    if (beltRef.current && phase === 'traveling') {
      beltRef.current.material.map.offset.x -= delta * 0.8
    }
  })

  // Creating a simple striped canvas texture for the conveyor belt
  const beltTexture = useRef(null)
  if (!beltTexture.current) {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#111e1a'
    ctx.fillRect(0, 0, 128, 32)
    ctx.strokeStyle = '#223831'
    ctx.lineWidth = 4
    for (let i = 0; i < 128; i += 16) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i + 8, 32)
      ctx.stroke()
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(4, 1)
    beltTexture.current = tex
  }

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 4, 3]} intensity={1.2} castShadow />
      <pointLight position={[-3, 2, 1]} intensity={0.6} color="#2FA8D9" />
      <pointLight position={[3, 2, 1]} intensity={0.8} color="#8CC63F" />

      {/* Main Conveyor Structure */}
      <mesh position={[0, -0.22, 0]} ref={beltRef} receiveShadow>
        <boxGeometry args={[6.2, 0.24, 0.9]} />
        <meshStandardMaterial map={beltTexture.current} roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Roller Rails */}
      <mesh position={[0, -0.36, 0.46]}>
        <cylinderGeometry args={[0.04, 0.04, 6.2, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2d423b" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.36, -0.46]}>
        <cylinderGeometry args={[0.04, 0.04, 6.2, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2d423b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Holographic Scanner Arch */}
      <group position={[0, 0.4, 0]}>
        {/* Left pillar */}
        <mesh position={[-0.55, -0.2, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#1a2d27" metalness={0.7} />
        </mesh>
        {/* Right pillar */}
        <mesh position={[0.55, -0.2, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#1a2d27" metalness={0.7} />
        </mesh>
        {/* Top bar */}
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 1.1, 8]} />
          <meshStandardMaterial color="#1a2d27" metalness={0.7} />
        </mesh>
        {/* Scanner emitter */}
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.2, 0.08, 0.25]} />
          <meshStandardMaterial color="#8CC63F" emissive="#8CC63F" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Laser Scanning Beam Plane */}
        {showLaser && (
          <mesh position={[0, -0.28, 0]}>
            <planeGeometry args={[0.1, 0.9]} rotation={[Math.PI / 2, 0, 0]} />
            <meshBasicMaterial
              color={categoryKey ? COLOR_HEX[categoryKey] : '#8CC63F'}
              transparent
              opacity={0.65}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>

      {/* Drop-off funnel chute at the right */}
      <mesh position={[2.5, -0.6, 0]}>
        <cylinderGeometry args={[0.42, 0.3, 0.6, 16, 1, true]} />
        <meshStandardMaterial color="#0c1814" roughness={0.4} metalness={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* The traveling waste item */}
      {(phase === 'traveling' || phase === 'dropping') && (
        <ConveyorItem
          categoryKey={categoryKey}
          phase={phase}
          setPhase={setPhase}
          onLaserCross={onLaserCross}
        />
      )}
    </>
  )
}

export default function ConveyorBelt({ result, scanToken }) {
  const [phase, setPhase] = useState('idle') // idle | traveling | dropping | arrived
  const [showLaser, setShowLaser] = useState(false)
  const [displayConf, setDisplayConf] = useState(0)

  useEffect(() => {
    if (!result) {
      setPhase('idle')
      return
    }
    setPhase('traveling')
    setShowLaser(false)
    setDisplayConf(0)
  }, [result, scanToken])

  // Confidence ticker count-up on arrival
  useEffect(() => {
    if (phase !== 'arrived' || !result) return
    const target = Math.round(result.confidence * 100)
    let cur = 0
    const step = Math.max(1, Math.round(target / 20))
    const id = setInterval(() => {
      cur += step
      if (cur >= target) {
        cur = target
        clearInterval(id)
      }
      setDisplayConf(cur)
    }, 22)
    return () => clearInterval(id)
  }, [phase, result])

  const handleLaserCross = () => {
    setShowLaser(true)
    soundManager.playSuccess()
    setTimeout(() => {
      setShowLaser(false)
    }, 450)
  }

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 mt-5 relative overflow-hidden hud-border">
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-compost animate-pulse" />
          WebGL 3D Sorting Line
        </p>
        {result && phase !== 'idle' && (
          <span className="font-mono text-[10px] uppercase text-muted tracking-wide animate-pulse">
            Processing Item...
          </span>
        )}
      </div>

      {/* 3D WebGL Canvas Conveyor Belt */}
      <div className="relative h-40 sm:h-44 rounded-xl bg-[#09120F] border border-pine-700/80 overflow-hidden">
        {phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted text-xs sm:text-sm font-mono z-10 bg-[#09120F]/90">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mb-2 opacity-50 animate-bounce">
              <path d="M12 4v16m0-16l-4 4m4-4l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            awaiting scan input...
          </div>
        )}

        <Canvas
          shadows
          camera={{ position: [0, 1.1, 2.7], fov: 36 }}
          gl={{ antialias: true }}
          dpr={[1, 1.5]}
        >
          <ConveyorBeltScene
            categoryKey={result?.categoryKey}
            phase={phase}
            setPhase={setPhase}
            onLaserCross={handleLaserCross}
            showLaser={showLaser}
          />
        </Canvas>
      </div>

      {/* Lanes display below belt */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {BIN_ORDER.map((key) => {
          const cat = CATEGORIES[key]
          const isTarget = (phase === 'dropping' || phase === 'arrived') && result?.categoryKey === key
          const isActiveGlow = isTarget ? `glow-${key}` : ''
          const activeBorder = isTarget
            ? {
                recyclable: 'border-recyclable bg-recyclable/10 text-recyclable',
                compost: 'border-compost bg-compost/10 text-compost',
                hazardous: 'border-hazard bg-hazard/10 text-hazard',
                landfill: 'border-landfill bg-landfill/10 text-landfill',
              }[key]
            : 'border-pine-700/60 bg-pine-950/20 text-muted'

          return (
            <div
              key={key}
              className={`rounded-xl border p-2 sm:p-3.5 flex flex-col items-center gap-1.5 text-center transition-all duration-500 hover:scale-102 ${activeBorder} ${isActiveGlow}`}
              style={isTarget ? { color: COLOR_HEX[key] } : undefined}
            >
              <div className={`transition-transform duration-300 ${isTarget ? 'scale-110' : 'opacity-60'}`}>
                {BIN_ICON[key](isTarget ? COLOR_HEX[key] : '#7A9188')}
              </div>
              <span className="text-[10px] sm:text-xs font-display font-bold leading-tight">{cat.label}</span>
              <span className="text-[9px] text-muted/80 leading-tight hidden sm:block font-mono">{cat.bin.split('·')[0]}</span>
            </div>
          )
        })}
      </div>

      {phase === 'arrived' && result && (
        <div className="mt-4 flex items-center justify-between font-mono text-xs text-muted border-t border-pine-800/60 pt-3">
          <span>
            detector match: <span className="text-paper font-semibold">{result.matchedLabel}</span>
          </span>
          <span className="text-compost font-bold tracking-wide">{displayConf}% confidence</span>
        </div>
      )}
    </div>
  )
}
