import { useRef, useState, useCallback, useEffect } from 'react'
import { useLiveDetector } from '../lib/useLiveDetector'
import { MATERIAL_COLORS } from '../lib/materialMap'
import { CATEGORIES } from '../lib/wasteMapping'
import { soundManager } from '../lib/soundManager'

const DETECT_INTERVAL_MS = 250

export default function ScanStage({ onImageCaptured, scanning, modelReady, previewSrc }) {
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const loopRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [camError, setCamError] = useState(null)
  const [liveCount, setLiveCount] = useState(0)
  const { ready: detectorReady, detect } = useLiveDetector()

  const loadFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith('image/')) return
      soundManager.playClick()
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => onImageCaptured(img, url)
      img.src = url
    },
    [onImageCaptured]
  )

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    loadFile(e.dataTransfer.files?.[0])
  }

  const startCamera = async () => {
    soundManager.playClick()
    setCamError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream
      setCameraOn(true)
    } catch {
      soundManager.playError()
      setCamError('Camera access was blocked or unavailable. Try uploading a photo instead.')
    }
  }

  useEffect(() => {
    if (cameraOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [cameraOn])

  const stopCamera = () => {
    soundManager.playClick()
    clearTimeout(loopRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraOn(false)
    setLiveCount(0)
  }

  // Draw futuristic sci-fi brackets instead of basic square boxes
  const drawHUDBox = (ctx, x, y, w, h, color, material, categoryLabel) => {
    // Translucent glass fill inside target bounding box
    ctx.fillStyle = color + '15'
    ctx.fillRect(x, y, w, h)

    ctx.strokeStyle = color
    ctx.lineWidth = 3
    const len = Math.min(18, w * 0.22, h * 0.22) // corner bracket side length

    // Top-Left Corner
    ctx.beginPath()
    ctx.moveTo(x, y + len)
    ctx.lineTo(x, y)
    ctx.lineTo(x + len, y)
    ctx.stroke()

    // Top-Right Corner
    ctx.beginPath()
    ctx.moveTo(x + w - len, y)
    ctx.lineTo(x + w, y)
    ctx.lineTo(x + w, y + len)
    ctx.stroke()

    // Bottom-Left Corner
    ctx.beginPath()
    ctx.moveTo(x, y + h - len)
    ctx.lineTo(x, y + h)
    ctx.lineTo(x + len, y + h)
    ctx.stroke()

    // Bottom-Right Corner
    ctx.beginPath()
    ctx.moveTo(x + w - len, y + h)
    ctx.lineTo(x + w, y + h)
    ctx.lineTo(x + w, y + h - len)
    ctx.stroke()

    // Drawing text label with styled background plate
    const label = `${material} · ${categoryLabel}`
    ctx.font = 'bold 11px "Space Grotesk", monospace'
    const textWidth = ctx.measureText(label).width
    
    ctx.fillStyle = color
    ctx.fillRect(x - 1, Math.max(0, y - 20), textWidth + 14, 20)
    
    ctx.fillStyle = '#070D0B'
    ctx.fillText(label, x + 7, Math.max(13, y - 6))
  }

  useEffect(() => {
    if (!cameraOn || !detectorReady) return
    let cancelled = false

    const tick = async () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState < 2) {
        loopRef.current = setTimeout(tick, DETECT_INTERVAL_MS)
        return
      }
      const detections = await detect(video)
      if (cancelled) return

      const rect = video.getBoundingClientRect()
      const cw = rect.width
      const ch = rect.height
      const vw = video.videoWidth
      const vh = video.videoHeight
      const dpr = window.devicePixelRatio || 1
      canvas.width = cw * dpr
      canvas.height = ch * dpr
      const ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cw, ch)

      if (vw && vh) {
        const scale = Math.max(cw / vw, ch / vh)
        const offsetX = (vw * scale - cw) / 2
        const offsetY = (vh * scale - ch) / 2

        detections.forEach((d) => {
          const [x, y, w, h] = d.bbox
          const bx = x * scale - offsetX
          const by = y * scale - offsetY
          const bw = w * scale
          const bh = h * scale
          const color = MATERIAL_COLORS[d.material] || '#B08968'
          const catLabel = CATEGORIES[d.categoryKey]?.label ?? 'Dry Waste'

          drawHUDBox(ctx, bx, by, bw, bh, color, d.material, catLabel)
        })
      }

      setLiveCount(detections.length)
      loopRef.current = setTimeout(tick, DETECT_INTERVAL_MS)
    }

    tick()
    return () => {
      cancelled = true
      clearTimeout(loopRef.current)
    }
  }, [cameraOn, detectorReady, detect])

  const capturePhoto = () => {
    const video = videoRef.current
    if (!video) return
    soundManager.playCoin()
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const img = new Image()
      img.onload = () => {
        onImageCaptured(img, url)
        stopCamera()
      }
      img.src = url
    }, 'image/jpeg', 0.94)
  }

  useEffect(() => () => stopCamera(), [])

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 hud-border relative">
      {/* Decorative HUD Corner Guides for the overall card */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-compost/30 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-compost/30 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-compost/30 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-compost/30 pointer-events-none" />

      {cameraOn ? (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3] sm:aspect-video border border-pine-700/60 shadow-2xl">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

          {/* Matrix green laser sweep line scanning down */}
          <div className="absolute inset-x-0 h-0.5 bg-[#8CC63F]/40 shadow-[0_0_12px_#8CC63F] z-10 pointer-events-none animate-scan" />

          <div className="absolute top-3 left-3 flex items-center gap-2 font-mono text-[10px] bg-pine-950/85 border border-pine-700/50 px-3 py-1.5 rounded-full z-10">
            <span className={`w-1.5 h-1.5 rounded-full ${detectorReady ? 'bg-compost animate-pulseGlow' : 'bg-landfill'}`} />
            <span className="text-paper/90 uppercase tracking-wide">
              {detectorReady ? `live analysis · ${liveCount} locked` : 'initializing lidar…'}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-3 z-20">
            <button
              onClick={capturePhoto}
              className="rounded-full bg-compost text-pine-950 font-display font-bold px-6 py-3 text-sm shadow-xl hover:scale-105 active:scale-95 transition-all glow-compost"
            >
              Capture Frame
            </button>
            <button
              onClick={stopCamera}
              className="rounded-full bg-pine-900/90 border border-pine-600/80 text-paper px-4 py-3 text-sm hover:bg-pine-800 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      ) : previewSrc ? (
        <div className="relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-video bg-pine-950/50 border border-pine-700/60">
          <img src={previewSrc} alt="Captured item" className="w-full h-full object-contain" />
          {scanning && (
            <>
              <div className="absolute inset-0 bg-pine-950/40 backdrop-blur-[1px]" />
              <div className="absolute inset-x-0 h-0.5 bg-compost/60 shadow-[0_0_15px_rgba(140,198,63,0.7)] animate-scan" />
              <div className="absolute top-3 left-3 font-mono text-[10px] uppercase text-compost bg-pine-950/85 border border-pine-700/40 px-3 py-1.5 rounded-full animate-pulse">
                resolving ensemble tensor…
              </div>
            </>
          )}
          {!scanning && (
            <button
              onClick={() => { soundManager.playClick(); fileInputRef.current.value = ''; fileInputRef.current.click() }}
              className="absolute bottom-3 right-3 rounded-full bg-pine-950/85 border border-pine-600/60 text-paper text-xs px-3.5 py-2 hover:bg-pine-900 transition-colors"
            >
              Replace Photo
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed aspect-[4/3] sm:aspect-video flex flex-col items-center justify-center gap-3 px-6 text-center transition-all duration-300 ${
            dragOver ? 'border-compost bg-compost/10 scale-102' : 'border-pine-700/80 bg-pine-950/15'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-pine-900/80 border border-pine-700 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" stroke="#9DB0A8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-paper font-semibold text-base">Drag & drop photo here</p>
            <p className="text-muted text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              Camera mode provides real-time bounding boxes of materials before capturing.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2.5 justify-center mt-2.5">
            <button
              onClick={() => { soundManager.playClick(); fileInputRef.current.click() }}
              disabled={!modelReady}
              className="rounded-full bg-compost text-pine-950 font-display font-bold text-sm px-5 py-2.5 hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed glow-compost"
            >
              Select Image
            </button>
            <button
              onClick={startCamera}
              disabled={!modelReady}
              className="rounded-full bg-pine-800 border border-pine-700/80 text-paper text-sm px-5 py-2.5 hover:bg-pine-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Open Camera
            </button>
          </div>
          {camError && <p className="text-hazard text-xs font-mono mt-2">{camError}</p>}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => loadFile(e.target.files?.[0])}
      />
    </div>
  )
}
