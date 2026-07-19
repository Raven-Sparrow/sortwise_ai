import { CATEGORIES } from '../lib/wasteMapping'
import { computeImpact } from '../lib/impact'

const DOT_CLASSES = {
  recyclable: 'bg-recyclable shadow-[0_0_8px_#2FA8D9]',
  compost: 'bg-compost shadow-[0_0_8px_#8CC63F]',
  hazardous: 'bg-hazard shadow-[0_0_8px_#E0574F]',
  landfill: 'bg-landfill shadow-[0_0_8px_#B08968]',
}

export default function StatsBar({ history }) {
  const { counts, co2Grams, total } = computeImpact(history)

  return (
    <div className="mt-5 rounded-2xl border border-pine-700/80 glass-card p-5 flex flex-col md:flex-row md:items-center gap-5 md:gap-8 hud-border">
      <div className="shrink-0">
        <p className="font-mono text-[9px] uppercase tracking-wider text-muted">Session Logs</p>
        <p className="font-display text-2xl font-black text-paper leading-none mt-1">
          {total} <span className="text-muted text-xs font-mono font-medium uppercase tracking-wide ml-1">items resolved</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2.5 md:border-l md:border-pine-800/80 md:pl-8">
        {Object.keys(CATEGORIES).map((key) => (
          <div key={key} className="flex items-center gap-2 text-xs font-mono">
            <span className={`w-2.5 h-2.5 rounded-full ${DOT_CLASSES[key]}`} />
            <span className="text-muted/90 font-medium">{CATEGORIES[key].label}:</span>
            <span className="font-bold text-paper text-sm">{counts[key] || 0}</span>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="md:ml-auto md:text-right border-t border-pine-800/80 pt-4 md:pt-0 md:border-t-0">
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted">Estimated carbon footprint offset</p>
          <p className="font-display text-2xl font-black text-compost tracking-tight mt-0.5 animate-pulseGlow">
            {(co2Grams / 1000).toFixed(3)} kg <span className="text-xs text-muted/80 font-mono font-medium">CO₂e</span>
          </p>
        </div>
      )}
    </div>
  )
}
