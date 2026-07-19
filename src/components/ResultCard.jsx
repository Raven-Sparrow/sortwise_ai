import { useState } from 'react'
import CorrectionPanel from './CorrectionPanel'
import { soundManager } from '../lib/soundManager'

const BADGE_CLASSES = {
  recyclable: 'text-recyclable border-recyclable/40 bg-recyclable/10',
  compost: 'text-compost border-compost/40 bg-compost/10',
  hazardous: 'text-hazard border-hazard/40 bg-hazard/10',
  landfill: 'text-landfill border-landfill/40 bg-landfill/10',
}

const GLOW_CLASSES = {
  recyclable: 'glow-recyclable border-recyclable/50',
  compost: 'glow-compost border-compost/50',
  hazardous: 'glow-hazard border-hazard/50',
  landfill: 'glow-landfill border-landfill/50',
}

export default function ResultCard({ result, predictions, onCorrect }) {
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  if (!result) return null

  const { category, categoryKey, lowSignal, personalized, ensembleAgreement, confidence, sources } = result
  const confPct = Math.round((confidence ?? 0) * 100)

  // Map layer labels
  const LAYER_NAMES = {
    direct: 'ImageNet Mapping',
    heuristic: 'Keyword Decision Tree',
    'coco-ssd': 'COCO-SSD Bounding Box',
    knn: 'KNN Personalization Core',
  }

  const toggleDiagnostics = () => {
    soundManager.playClick()
    setShowDiagnostics(!showDiagnostics)
  }

  return (
    <div className={`glass-card rounded-2xl p-5 sm:p-6 mt-5 animate-fade-up border ${GLOW_CLASSES[categoryKey]}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-block font-mono text-[10px] uppercase tracking-widest border rounded-full px-3 py-1 ${BADGE_CLASSES[categoryKey]}`}>
              {category.bin}
            </span>
            {personalized && (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider border border-pine-600 text-muted rounded-full px-3 py-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-compost"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" fill="currentColor"/></svg>
                personalized
              </span>
            )}
            {ensembleAgreement >= 2 && (
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider border border-compost/30 text-compost rounded-full px-3 py-1 bg-compost/5">
                <span className="w-1.5 h-1.5 rounded-full bg-compost animate-pulse" />
                {ensembleAgreement} models agree
              </span>
            )}
          </div>
          <h3 className="font-display text-3xl font-bold mt-2.5 tracking-tight text-paper">{category.label}</h3>
        </div>
        <div className="text-right">
          <p className="font-display font-black text-4xl text-paper tracking-tight">{confPct}%</p>
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted">confidence score</p>
        </div>
      </div>

      {lowSignal && (
        <p className="mt-4 text-xs text-landfill bg-landfill/10 border border-landfill/30 rounded-xl px-4 py-3 leading-relaxed">
          ⚠️ Low-Signal Warning: The ensemble detected conflicting details. Try snapping a closer, well-lit photo of a single item.
        </p>
      )}

      {/* Disposal explanation cards */}
      <div className="mt-5 grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#0b1411] border border-pine-700/60 p-4 transition-all hover:bg-[#0c1815]">
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted mb-1.5">Action Plan</p>
          <p className="text-sm text-paper/90 leading-relaxed">{category.tip}</p>
        </div>
        <div className="rounded-xl bg-[#0b1411] border border-pine-700/60 p-4 transition-all hover:bg-[#0c1815]">
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted mb-1.5">Ecological Impact</p>
          <p className="text-sm text-paper/90 leading-relaxed">{category.fact}</p>
        </div>
      </div>

      {/* Accordion AI Diagnostic Panel */}
      <div className="mt-5 border-t border-pine-700/50 pt-4">
        <button
          onClick={toggleDiagnostics}
          className="flex items-center justify-between w-full font-mono text-[10px] text-muted uppercase tracking-widest hover:text-paper transition-colors py-1.5"
        >
          <span>Ensemble Diagnostics HUD</span>
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            className={`transform transition-transform duration-300 ${showDiagnostics ? 'rotate-180 text-compost' : 'text-muted'}`}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showDiagnostics && (
          <div className="mt-4 space-y-4 animate-fade-up">
            {/* Model Consensus Nodes */}
            <div className="rounded-xl bg-[#09110e] border border-pine-800/80 p-4">
              <h4 className="font-mono text-[9px] text-muted uppercase tracking-widest mb-3">Voter Weight Distribution</h4>
              <div className="space-y-3">
                {sources && sources.length > 0 ? (
                  sources.map((s, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-paper/95">{LAYER_NAMES[s.layer] || s.layer}</span>
                        <span className="text-muted">Weight Contribution: {s.weight.toFixed(2)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-pine-950 overflow-hidden border border-pine-800">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (s.weight / 6.0) * 100)}%`,
                            backgroundColor: s.category === categoryKey ? '#8CC63F' : '#E0574F'
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted font-mono">No telemetry recorded for this scan.</p>
                )}
              </div>
            </div>

            {/* Top 5 Raw MobileNet Predictions */}
            {predictions?.length > 0 && (
              <div className="rounded-xl bg-[#09110e] border border-pine-800/80 p-4">
                <h4 className="font-mono text-[9px] text-muted uppercase tracking-widest mb-3">MobileNet Class Likelihood (Top 5)</h4>
                <div className="space-y-2.5">
                  {predictions.slice(0, 5).map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-muted w-36 sm:w-44 truncate">{p.className.split(',')[0]}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-pine-950 overflow-hidden">
                        <div
                          className="h-full bg-compost/60 rounded-full"
                          style={{ width: `${Math.round(p.probability * 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-muted w-8 text-right">{Math.round(p.probability * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {onCorrect && <CorrectionPanel currentKey={categoryKey} onCorrect={onCorrect} />}
    </div>
  )
}
