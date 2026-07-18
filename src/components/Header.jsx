export default function Header({ modelStatus }) {
  const statusMeta = {
    loading: { text: 'Loading vision model…', dot: 'bg-landfill animate-pulseGlow' },
    ready: { text: 'Model live — running in your browser', dot: 'bg-compost animate-pulseGlow' },
    error: { text: 'Model failed to load', dot: 'bg-hazard' },
  }[modelStatus]

  return (
    <header className="max-w-5xl mx-auto px-5 sm:px-8 pt-8 sm:pt-12 flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <svg width="30" height="30" viewBox="0 0 32 32" className="shrink-0">
            <rect width="32" height="32" rx="8" fill="#1D302A" />
            <path d="M8 22c8 1 14-5 15-14-9-1-15 5-15 14z" fill="#8CC63F" />
            <path d="M8 22c3-6 7-9 12-12" stroke="#0F1B17" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          </svg>
          <span className="font-display font-semibold text-xl tracking-tight text-paper">Sortwise</span>
        </div>
        <p className="mt-2 text-muted text-sm sm:text-base max-w-md">
          Show it an item. A convolutional network sorts it live — no server, no upload, straight into the right bin.
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-2 shrink-0 mt-1 rounded-full border border-pine-600 bg-pine-800/60 px-3 py-1.5 font-mono text-xs text-muted">
        <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
        {statusMeta.text}
      </div>
    </header>
  )
}
