import { useEffect, useState } from 'react'
import { CATEGORIES } from '../lib/wasteMapping'

const BIN_ORDER = ['recyclable', 'compost', 'hazardous', 'landfill']
const LANE_STOP = { recyclable: '10%', compost: '36%', hazardous: '62%', landfill: '88%' }
// Written as full static class strings (not interpolated) so Tailwind's JIT scanner can find them.
const LANE_ACTIVE_CLASSES = {
  recyclable: 'border-recyclable bg-recyclable/10',
  compost: 'border-compost bg-compost/10',
  hazardous: 'border-hazard bg-hazard/10',
  landfill: 'border-landfill bg-landfill/10',
}

const BIN_ICON = {
  recyclable: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 7l3-4h4l3 4M4 7h16M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  compost: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21c6-1 9-6 8-13-7-1-11 3-12 9" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 21c-1-4-3-6-7-8" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  hazardous: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l9 16H3L12 3z" stroke={c} strokeWidth="1.8" strokeLinejoin="round" /><path d="M12 10v4M12 17h.01" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>
  ),
  landfill: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 20h16M6 20V10l6-5 6 5v10" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
}

export default function ConveyorBelt({ result, previewSrc, scanToken }) {
  const [phase, setPhase] = useState('idle') // idle | traveling | arrived
  const [displayConf, setDisplayConf] = useState(0)

  useEffect(() => {
    if (!result) {
      setPhase('idle')
      return
    }
    setPhase('traveling')
    setDisplayConf(0)
  }, [result, scanToken])

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

  const colorHex = {
    recyclable: '#2FA8D9',
    compost: '#8CC63F',
    hazardous: '#E0574F',
    landfill: '#B08968',
  }

  return (
    <div className="noise-card rounded-2xl border border-pine-600 p-4 sm:p-6 mt-5">
      <p className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3">Sorting line</p>

      <div className="relative">
        {/* Belt track */}
        <div className="relative h-16 sm:h-20 rounded-lg bg-pine-950 belt-texture overflow-hidden border border-pine-700">
          {phase !== 'idle' && result && previewSrc && (
            <img
              key={scanToken}
              src={previewSrc}
              alt=""
              onAnimationEnd={() => setPhase('arrived')}
              className="absolute top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 shadow-lg animate-travel"
              style={{
                '--stop': LANE_STOP[result.categoryKey],
                borderColor: colorHex[result.categoryKey],
              }}
            />
          )}
          {phase === 'idle' && (
            <div className="absolute inset-0 flex items-center justify-center text-muted text-xs sm:text-sm font-mono">
              waiting for input…
            </div>
          )}
        </div>

        {/* Lanes */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {BIN_ORDER.map((key) => {
            const cat = CATEGORIES[key]
            const isTarget = phase === 'arrived' && result?.categoryKey === key
            return (
              <div
                key={key}
                className={`rounded-lg border px-1.5 sm:px-2.5 py-2 sm:py-3 flex flex-col items-center gap-1 text-center transition-all duration-300 ${
                  isTarget ? `${LANE_ACTIVE_CLASSES[key]} scale-105` : 'border-pine-700 bg-pine-900/40'
                }`}
                style={isTarget ? { boxShadow: `0 0 24px -6px ${colorHex[key]}` } : undefined}
              >
                <div className={isTarget ? 'animate-pulseGlow' : 'opacity-70'}>{BIN_ICON[key](isTarget ? colorHex[key] : '#9DB0A8')}</div>
                <span className="text-[10px] sm:text-xs font-display font-semibold leading-tight">{cat.label}</span>
                <span className="text-[9px] sm:text-[10px] text-muted leading-tight hidden sm:block">{cat.bin}</span>
              </div>
            )
          })}
        </div>
      </div>

      {phase === 'arrived' && result && (
        <div className="mt-4 flex items-center justify-between font-mono text-xs text-muted">
          <span>
            matched signal: <span className="text-paper">{result.matchedLabel}</span>
          </span>
          <span className="text-paper">{displayConf}% confidence</span>
        </div>
      )}
    </div>
  )
}
