import { useState } from 'react'
import { TOKEN_REWARD } from '../lib/wallet'
import { soundManager } from '../lib/soundManager'

export default function DisposalConfirm({ categoryKey, onConfirm }) {
  const [claimed, setClaimed] = useState(false)
  const reward = TOKEN_REWARD[categoryKey] ?? 0

  const handleConfirm = () => {
    soundManager.playCoin()
    onConfirm()
    setClaimed(true)
  }

  if (claimed) {
    return (
      <div className="mt-4 rounded-xl bg-compost/10 border border-compost/30 px-4 py-3 flex items-center gap-2.5 text-compost font-mono text-xs animate-fade-up">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        <span className="font-semibold">+{reward} credits deposited. Blockchain simulation logged.</span>
      </div>
    )
  }

  return (
    <button
      onClick={handleConfirm}
      className="mt-4 w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-full bg-compost hover:brightness-110 text-pine-950 font-display font-bold text-sm px-6 py-3 transition-all active:scale-95 shadow-lg glow-compost"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 8l8-5 8 5-8 5-8-5z" stroke="#0F1B17" strokeWidth="2" strokeLinejoin="round"/><path d="M4 8v8l8 5 8-5V8" stroke="#0F1B17" strokeWidth="2" strokeLinejoin="round"/></svg>
      Log Disposal — Claim +{reward} Credits
    </button>
  )
}
