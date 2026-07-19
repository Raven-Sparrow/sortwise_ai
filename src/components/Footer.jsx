export default function Footer() {
  return (
    <footer className="max-w-5xl mx-auto px-5 sm:px-8 py-12 mt-12">
      <div className="glass-card rounded-2xl p-6 sm:p-8 text-center hud-border relative">
        <div className="flex items-center justify-center gap-2 mb-3">
          <svg width="26" height="26" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="9" fill="#13241F" />
            <path d="M8 22c8 1 14-5 15-14-9-1-15 5-15 14z" fill="#8CC63F" />
          </svg>
          <span className="font-display font-black text-xl text-paper tracking-tight">Sortwise</span>
        </div>
        <p className="text-muted text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Competition Entry for <strong className="text-paper/90">Idea2Impact 2026 · Theme: Clean &amp; Green Technology</strong>. 
          Enabling localized, privacy-first municipal waste classification on the edge.
        </p>
        
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono text-muted">
          <span className="bg-[#09110f] border border-pine-750 rounded-md px-3 py-1 font-semibold">MobileNetV2</span>
          <span className="bg-[#09110f] border border-pine-750 rounded-md px-3 py-1 font-semibold">COCO-SSD</span>
          <span className="bg-[#09110f] border border-pine-750 rounded-md px-3 py-1 font-semibold">KNN personalizer</span>
          <span className="bg-[#09110f] border border-pine-750 rounded-md px-3 py-1 font-semibold">TensorFlow.js</span>
          <span className="bg-[#09110f] border border-pine-750 rounded-md px-3 py-1 font-semibold">Three.js R3F</span>
          <span className="bg-[#09110f] border border-pine-750 rounded-md px-3 py-1 font-semibold">OpenStreetMap API</span>
        </div>
        
        <div className="mt-6 border-t border-pine-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-muted/70 gap-2">
          <p>© {new Date().getFullYear()} Sortwise Team. Distributed under the MIT License.</p>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-paper transition-colors">GitHub Repo</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-paper transition-colors">Documentation</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
