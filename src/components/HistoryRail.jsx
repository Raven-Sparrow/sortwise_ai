import { CATEGORIES } from '../lib/wasteMapping'

const RING_CLASSES = {
  recyclable: 'ring-recyclable',
  compost: 'ring-compost',
  hazardous: 'ring-hazard',
  landfill: 'ring-landfill',
}

export default function HistoryRail({ history, onSelect }) {
  if (history.length === 0) return null
  return (
    <div className="mt-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">History</p>
      <div className="flex gap-2.5 overflow-x-auto pb-1">
        {[...history].reverse().map((h) => (
          <button
            key={h.id}
            onClick={() => onSelect(h)}
            className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden ring-2 ${RING_CLASSES[h.categoryKey]} opacity-90 hover:opacity-100 transition-opacity`}
            title={CATEGORIES[h.categoryKey].label}
          >
            <img src={h.previewSrc} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
