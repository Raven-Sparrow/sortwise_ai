import { useState } from 'react'
import { CATEGORIES } from '../lib/wasteMapping'
import { soundManager } from '../lib/soundManager'

const BTN_CLASSES = {
  recyclable: 'hover:border-recyclable hover:text-recyclable hover:bg-recyclable/5',
  compost: 'hover:border-compost hover:text-compost hover:bg-compost/5',
  hazardous: 'hover:border-hazard hover:text-hazard hover:bg-hazard/5',
  landfill: 'hover:border-landfill hover:text-landfill hover:bg-landfill/5',
}

export default function CorrectionPanel({ currentKey, onCorrect }) {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  const handleOpen = () => {
    soundManager.playClick()
    setOpen(true)
  }

  const handleSelect = (key) => {
    soundManager.playCoin()
    onCorrect(key)
    setDone(true)
  }

  if (done) {
    return (
      <p className="mt-4 text-xs text-compost bg-compost/10 border border-compost/30 rounded-xl px-4 py-2.5 font-mono animate-fade-up">
        ✓ Learned: item category preference recorded on device.
      </p>
    )
  }

  return (
    <div className="mt-4">
      {!open ? (
        <button
          onClick={handleOpen}
          className="text-xs text-muted hover:text-paper underline underline-offset-4 transition-colors font-mono"
        >
          Not correct? Adjust classification
        </button>
      ) : (
        <div className="rounded-xl border border-pine-700/60 bg-[#09110f] p-4 animate-fade-up">
          <p className="text-xs text-muted font-mono mb-3">Re-map classification weight manually:</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(CATEGORIES).map((key) => (
              <button
                key={key}
                disabled={key === currentKey}
                onClick={() => handleSelect(key)}
                className={`text-xs font-mono font-medium rounded-full border border-pine-700 px-3.5 py-2 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${BTN_CLASSES[key]}`}
              >
                {CATEGORIES[key].label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
