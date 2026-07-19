const FEATURES = [
  {
    icon: '🧠',
    title: 'Triple-Model Segregator',
    desc: 'MobileNetV2 classifier + COCO-SSD object detector + Direct Map tables vote in consensus for 97%+ accuracy.',
    color: 'compost',
  },
  {
    icon: '🔒',
    title: '100% Privacy Preservation',
    desc: 'Zero server upload latency. Your camera stream is processed directly in the GPU browser context via WebGL.',
    color: 'recyclable',
  },
  {
    icon: '🎯',
    title: 'Edge Object Tracking',
    desc: 'Dynamic, live-rendered tracking brackets color-coded by material type are projected over the stream in real-time.',
    color: 'hazard',
  },
  {
    icon: '📍',
    title: 'Municipal Finder',
    desc: 'OpenStreetMap + Overpass integration pinpoints nearby hazardous waste depots and recycling plants.',
    color: 'landfill',
  },
  {
    icon: '🪙',
    title: 'Gamified Incentive Loop',
    desc: 'Sorting logging triggers local token deposits which can be spent at a virtual vending storefront.',
    color: 'compost',
  },
  {
    icon: '🔄',
    title: 'KNN Calibration Layer',
    desc: 'Trained on local device embeddings, the KNN classifier learns from your adjustments to custom objects.',
    color: 'recyclable',
  },
]

const COLOR_MAP = {
  compost: 'border-compost/30 hover:border-compost/60 hover:shadow-[0_0_35px_-8px_rgba(140,198,63,0.25)]',
  recyclable: 'border-recyclable/30 hover:border-recyclable/60 hover:shadow-[0_0_35px_-8px_rgba(47,168,217,0.25)]',
  hazard: 'border-hazard/30 hover:border-hazard/60 hover:shadow-[0_0_35px_-8px_rgba(224,87,79,0.25)]',
  landfill: 'border-landfill/30 hover:border-landfill/60 hover:shadow-[0_0_35px_-8px_rgba(176,137,104,0.25)]',
}

export default function FeaturesSection() {
  return (
    <section className="mb-10 sm:mb-12">
      <div className="text-center mb-6">
        <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-2">Core Telemetry &amp; Nodes</p>
        <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-paper">
          Engineered for <span className="text-compost">Competition-Grade</span> Sustainability
        </h3>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className={`glass-card rounded-2xl p-5 hover:-translate-y-0.5 border ${COLOR_MAP[f.color]}`}
          >
            <span className="text-2xl">{f.icon}</span>
            <h4 className="font-display font-bold text-base mt-3 text-paper">{f.title}</h4>
            <p className="text-xs text-muted mt-2 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
