// src/components/MaterialLegend.jsx
import { MATERIAL_COLORS } from '../lib/materialMap'

export default function MaterialLegend() {
  const entries = Object.entries(MATERIAL_COLORS)
  return (
    <div className="absolute top-4 right-4 bg-pine-950/80 backdrop-blur border border-pine-700/50 rounded-lg p-3 shadow-lg animate-fade-up">
      <h4 className="text-xs text-paper uppercase mb-2">Material Palette</h4>
      <ul className="space-y-1">
        {entries.map(([name, color]) => (
          <li key={name} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-paper capitalize">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
