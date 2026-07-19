import { useState } from 'react'
import { soundManager } from '../lib/soundManager'

export default function Header({ modelStatus, tokenBalance }) {
  const [muted, setMuted] = useState(() => soundManager.getMuteState())

  const handleMuteToggle = () => {
    const nextMuted = soundManager.toggleMute()
    setMuted(nextMuted)
    if (!nextMuted) {
      soundManager.playClick()
    }
  }

  const statusMeta = {
    loading: { text: 'Loading AI Core…', dot: 'bg-landfill animate-pulseGlow' },
    ready: { text: 'AI Ensemble Live', dot: 'bg-compost animate-pulseGlow' },
    error: { text: 'Core Load Failed', dot: 'bg-hazard' },
  }[modelStatus]

  return (
    <header className="max-w-5xl mx-auto px-5 sm:px-8 pt-8 sm:pt-12 flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg width="36" height="36" viewBox="0 0 32 32" className="shrink-0 shadow-lg rounded-xl">
              <rect width="32" height="32" rx="10" fill="#13241F" />
              <path d="M8 22c8 1 14-5 15-14-9-1-15 5-15 14z" fill="#8CC63F" />
              <path d="M8 22c3-6 7-9 12-12" stroke="#070D0B" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-compost border-2 border-[#070D0B] animate-pulseGlow" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl tracking-tight text-paper flex items-center gap-2 leading-none">
              Sortwise
              <span className="font-mono text-[9px] uppercase tracking-widest text-compost bg-compost/10 border border-compost/20 rounded px-2 py-0.5">v5.0</span>
            </h1>
          </div>
        </div>
        <p className="mt-2 text-muted text-xs sm:text-sm max-w-md leading-relaxed">
          Competition Entry · Idea2Impact 2026. On-device triple-model AI ensemble categorizes waste with 97%+ accuracy.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Synth Sound FX Mute Toggle */}
        <button
          onClick={handleMuteToggle}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-pine-750 bg-pine-900/40 text-muted hover:text-paper hover:border-pine-600 transition-colors"
          title={muted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {muted ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M23 9l-6 6M17 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
            <div className="relative">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-compost rounded-full audio-ripple" />
            </div>
          )}
        </button>

        {/* Token Balance Indicator */}
        <div className="flex items-center gap-1.5 rounded-full border border-landfill/40 bg-landfill/10 backdrop-blur px-3 py-1.5 font-mono text-xs text-paper shadow-md">
          <span>🪙</span>
          <span className="font-bold">{tokenBalance}</span>
        </div>

        {/* Core status dot */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-pine-750 bg-pine-900/40 backdrop-blur px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wide text-muted shadow-md">
          <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
          {statusMeta.text}
        </div>
      </div>
    </header>
  )
}
