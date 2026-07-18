import { CATEGORIES } from '../lib/wasteMapping'
import { computeImpact } from '../lib/impact'

const DOT_CLASSES = {
  recyclable: 'bg-recyclable',
  compost: 'bg-compost',
  hazardous: 'bg-hazard',
  landfill: 'bg-landfill',
}

export default function StatsBar({ history }) {
  const { counts, co2Grams, total } = computeImpact(history)

  return (
    <div className="mt-5 rounded-2xl border border-pine-600 noise-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted">This session</p>
        <p className="font-display text-2xl font-semibold">
          {total} <span className="text-muted text-sm font-body font-normal">item{total === 1 ? '' : 's'} sorted</span>
        </p>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {Object.keys(CATEGORIES).map((key) => (
          <div key={key} className="flex items-center gap-1.5 text-sm">
            <span className={`w-2 h-2 rounded-full ${DOT_CLASSES[key]}`} />
            <span className="text-muted">{CATEGORIES[key].label}</span>
            <span className="font-mono text-paper">{counts[key] || 0}</span>
          </div>
        ))}
      </div>
      {total > 0 && (
        <div className="sm:ml-auto">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Est. CO₂e avoided</p>
          <p className="font-display text-lg font-semibold text-compost">{(co2Grams / 1000).toFixed(2)} kg</p>
        </div>
      )}
    </div>
  )
}
