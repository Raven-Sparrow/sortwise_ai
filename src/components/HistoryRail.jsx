import { CATEGORIES } from '../lib/wasteMapping'

const RING_CLASSES = {
  recyclable: 'ring-recyclable hover:shadow-[0_0_10px_#2FA8D9]',
  compost: 'ring-compost hover:shadow-[0_0_10px_#8CC63F]',
  hazardous: 'ring-hazard hover:shadow-[0_0_10px_#E0574F]',
  landfill: 'ring-landfill hover:shadow-[0_0_10px_#B08968]',
}

export default function HistoryRail({ history, onSelect }) {
  if (history.length === 0) return null
  return (
    <div className="mt-6 border-t border-pine-850 pt-5">
      <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-3 flex items-center gap-1.5">
        <span className="w-1 h-1 bg-muted rounded-full" />
        Classification History Rail
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {[...history].reverse().map((h) => (
          <button
            key={h.id}
            onClick={() => onSelect(h)}
            className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden ring-2 ring-offset-2 ring-offset-[#070D0B] ${RING_CLASSES[h.categoryKey]} opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 transition-all`}
            title={`${CATEGORIES[h.categoryKey].label} · ${h.matchedLabel}`}
          >
            <img src={h.previewSrc} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
