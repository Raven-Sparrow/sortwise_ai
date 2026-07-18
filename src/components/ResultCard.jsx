const BADGE_CLASSES = {
  recyclable: 'text-recyclable border-recyclable/40 bg-recyclable/10',
  compost: 'text-compost border-compost/40 bg-compost/10',
  hazardous: 'text-hazard border-hazard/40 bg-hazard/10',
  landfill: 'text-landfill border-landfill/40 bg-landfill/10',
}

export default function ResultCard({ result, predictions }) {
  if (!result) return null
  const { category, categoryKey, lowSignal } = result

  return (
    <div className="noise-card rounded-2xl border border-pine-600 p-5 sm:p-6 mt-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className={`inline-block font-mono text-[11px] uppercase tracking-wider border rounded-full px-2.5 py-1 ${BADGE_CLASSES[categoryKey]}`}>
            {category.bin}
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold mt-2.5">{category.label}</h3>
        </div>
      </div>

      {lowSignal && (
        <p className="mt-3 text-xs text-landfill bg-landfill/10 border border-landfill/30 rounded-lg px-3 py-2">
          The model couldn't confidently tie this object to a known material category, so it defaulted to the reject stream. Try a clearer, closer photo of a single item.
        </p>
      )}

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-pine-950/60 border border-pine-700 p-3.5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-1">Disposal tip</p>
          <p className="text-sm text-paper/90 leading-relaxed">{category.tip}</p>
        </div>
        <div className="rounded-xl bg-pine-950/60 border border-pine-700 p-3.5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-1">Why it matters</p>
          <p className="text-sm text-paper/90 leading-relaxed">{category.fact}</p>
        </div>
      </div>

      {predictions?.length > 0 && (
        <details className="mt-4 group">
          <summary className="cursor-pointer font-mono text-[11px] text-muted uppercase tracking-wider hover:text-paper transition-colors">
            Model output (top {predictions.length})
          </summary>
          <div className="mt-2.5 space-y-1.5">
            {predictions.map((p, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] text-muted w-32 sm:w-40 truncate">{p.className.split(',')[0]}</span>
                <div className="flex-1 h-1.5 rounded-full bg-pine-800 overflow-hidden">
                  <div
                    className="h-full bg-compost/70 rounded-full"
                    style={{ width: `${Math.round(p.probability * 100)}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] text-muted w-9 text-right">{Math.round(p.probability * 100)}%</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
