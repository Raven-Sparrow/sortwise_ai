export default function ProblemStatement() {
  return (
    <section className="glass-card rounded-2xl p-5 sm:p-7 mb-6 sm:mb-8 relative overflow-hidden hud-border">
      <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-4">Core Problem &amp; Architecture</p>
      
      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-pine-800/80">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-hazard/90 mb-3.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-hazard/10 border border-hazard/30 flex items-center justify-center text-xs font-mono font-bold">!</span>
            The Ecological Bottleneck
          </h3>
          <p className="text-xs sm:text-sm text-paper/80 leading-relaxed">
            Over 60% of municipal household waste is misrouted. When recyclables are contaminated by food residue or compostable materials are mixed with plastic, entire collection batches are rejected at sorting centers. This creates massive landfill expansion and microplastic leakage into groundwater tables.
          </p>
        </div>
        <div className="pt-6 sm:pt-0 sm:pl-8">
          <h3 className="font-display font-bold text-base sm:text-lg text-compost mb-3.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-compost/10 border border-compost/30 flex items-center justify-center text-xs font-mono font-bold">✓</span>
            The Sortwise Edge Core
          </h3>
          <p className="text-xs sm:text-sm text-paper/80 leading-relaxed">
            By running computer vision locally on the edge, we eliminate latency and privacy concerns. A triple-model decision network validates objects in seconds. Correct sorting habits are incentivized via local tokens, and manual corrections personalize the neural network on the fly.
          </p>
        </div>
      </div>
    </section>
  )
}
