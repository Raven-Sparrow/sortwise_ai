import { BENCHMARK_STATS } from '../lib/ensembleClassifier'

export default function AccuracyBadge() {
  const { overallAccuracy, categories, totalSamples, methodology } = BENCHMARK_STATS

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8 border border-compost/30 hud-border relative">
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
        {/* Main circular gauge */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative w-18 h-18">
            <svg width="72" height="72" viewBox="0 0 72 72" className="transform -rotate-90">
              {/* Underlay rail */}
              <circle cx="36" cy="36" r="30" fill="none" stroke="#13241F" strokeWidth="6" />
              {/* Glowing active indicator */}
              <circle
                cx="36"
                cy="36"
                r="30"
                fill="none"
                stroke="#8CC63F"
                strokeWidth="6"
                strokeDasharray={`${overallAccuracy * 1.885} 188.5`}
                strokeLinecap="round"
                className="drop-shadow-[0_0_10px_#8CC63F]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-black text-lg text-compost leading-none">{overallAccuracy}%</span>
              <span className="font-mono text-[7px] text-muted uppercase mt-0.5 tracking-wider">Acc</span>
            </div>
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-paper">Ensemble Accuracy</h3>
            <p className="text-muted text-xs font-mono mt-0.5">Validated on {totalSamples} labeled items</p>
          </div>
        </div>

        {/* Category breakdown grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {Object.entries(categories).map(([key, { accuracy }]) => {
            const colors = {
              recyclable: 'text-recyclable border-recyclable/20 bg-recyclable/5',
              compost: 'text-compost border-compost/20 bg-compost/5',
              hazardous: 'text-hazard border-hazard/20 bg-hazard/5',
              landfill: 'text-landfill border-landfill/20 bg-landfill/5',
            }
            const labels = {
              recyclable: 'Recyclable',
              compost: 'Compostable',
              hazardous: 'Hazardous',
              landfill: 'Landfill',
            }
            return (
              <div key={key} className={`rounded-xl border px-3 py-2.5 text-center transition-transform hover:scale-103 ${colors[key]}`}>
                <p className="font-display font-black text-base">{accuracy}%</p>
                <p className="text-[9px] font-mono uppercase tracking-widest text-muted/90 mt-1">{labels[key]}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[9px] font-mono text-muted/85 border-t border-pine-850 pt-3">
        <span>Methodology: {methodology}</span>
      </div>
    </div>
  )
}
