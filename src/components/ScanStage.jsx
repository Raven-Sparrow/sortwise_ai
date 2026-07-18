import { useRef, useState, useCallback, useEffect } from 'react'

export default function ScanStage({ onImageCaptured, scanning, modelReady, previewSrc }) {
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [camError, setCamError] = useState(null)

  const loadFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith('image/')) return
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
    setCamError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream
      setCameraOn(true)
    } catch {
      setCamError('Camera access was blocked or unavailable. Try uploading a photo instead.')
    }
  }

  useEffect(() => {
    if (cameraOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [cameraOn])

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  const capturePhoto = () => {
    const video = videoRef.current
    if (!video) return
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
    }, 'image/jpeg', 0.92)
  }

  useEffect(() => () => stopCamera(), [])

  return (
    <div className="noise-card rounded-2xl border border-pine-600 p-4 sm:p-6">
      {cameraOn ? (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3] sm:aspect-video">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-end justify-center gap-3 pb-4">
            <button
              onClick={capturePhoto}
              className="rounded-full bg-paper text-pine-900 font-display font-semibold px-5 py-2.5 text-sm shadow-lg hover:scale-105 transition-transform"
            >
              Capture
            </button>
            <button
              onClick={stopCamera}
              className="rounded-full bg-pine-800/80 border border-pine-600 text-paper px-4 py-2.5 text-sm hover:bg-pine-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : previewSrc ? (
        <div className="relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-video bg-pine-950">
          <img src={previewSrc} alt="Captured item" className="w-full h-full object-contain" />
          {scanning && (
            <>
              <div className="absolute inset-0 bg-pine-950/30" />
              <div className="absolute left-0 right-0 h-1/3 bg-gradient-to-b from-transparent via-compost/70 to-transparent animate-scan" />
              <div className="absolute top-3 left-3 font-mono text-[11px] text-compost bg-pine-950/70 px-2 py-1 rounded">
                analyzing…
              </div>
            </>
          )}
          {!scanning && (
            <button
              onClick={() => { fileInputRef.current.value = ''; fileInputRef.current.click() }}
              className="absolute bottom-3 right-3 rounded-full bg-pine-950/80 border border-pine-600 text-paper text-xs px-3 py-1.5 hover:bg-pine-800 transition-colors"
            >
              Replace photo
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed aspect-[4/3] sm:aspect-video flex flex-col items-center justify-center gap-3 px-6 text-center transition-colors ${
            dragOver ? 'border-compost bg-compost/5' : 'border-pine-600'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-pine-800 border border-pine-600 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" stroke="#9DB0A8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-paper font-medium text-sm sm:text-base">Drop a photo, or use your camera</p>
          <p className="text-muted text-xs sm:text-sm">JPG or PNG · one item, clear background works best</p>
          <div className="flex flex-wrap gap-2 justify-center mt-1">
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={!modelReady}
              className="rounded-full bg-compost text-pine-950 font-display font-semibold text-sm px-4 py-2 hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Upload photo
            </button>
            <button
              onClick={startCamera}
              disabled={!modelReady}
              className="rounded-full bg-pine-800 border border-pine-600 text-paper text-sm px-4 py-2 hover:bg-pine-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Use camera
            </button>
          </div>
          {camError && <p className="text-hazard text-xs mt-1">{camError}</p>}
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
