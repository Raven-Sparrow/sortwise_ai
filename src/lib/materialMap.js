// COCO-SSD detects generic objects with bounding boxes in real time — it
// doesn't know about materials or waste streams, so this is the domain
// layer translating "bottle" into "Plastic · Recyclable" the same way
// wasteMapping.js does for the deeper MobileNet-based single-shot scan.

export const MATERIAL_COLORS = {
  Plastic: '#2FA8D9',
  Metal: '#9DB0A8',
  Paper: '#B08968',
  Glass: '#3FD1C7',
  Organic: '#8CC63F',
  Electronic: '#E0574F',
  Textile: '#C9A24B',
  Mixed: '#B08968',
}

// class name (as returned by coco-ssd) -> { material, categoryKey }
export const COCO_MATERIAL_MAP = {
  bottle: { material: 'Plastic', categoryKey: 'recyclable' },
  'wine glass': { material: 'Glass', categoryKey: 'recyclable' },
  cup: { material: 'Paper', categoryKey: 'landfill' }, // often wax/plastic-lined
  bowl: { material: 'Mixed', categoryKey: 'landfill' },
  fork: { material: 'Metal', categoryKey: 'recyclable' },
  knife: { material: 'Metal', categoryKey: 'recyclable' },
  spoon: { material: 'Metal', categoryKey: 'recyclable' },
  banana: { material: 'Organic', categoryKey: 'compost' },
  apple: { material: 'Organic', categoryKey: 'compost' },
  orange: { material: 'Organic', categoryKey: 'compost' },
  sandwich: { material: 'Organic', categoryKey: 'compost' },
  broccoli: { material: 'Organic', categoryKey: 'compost' },
  carrot: { material: 'Organic', categoryKey: 'compost' },
  'hot dog': { material: 'Organic', categoryKey: 'compost' },
  pizza: { material: 'Organic', categoryKey: 'compost' },
  donut: { material: 'Organic', categoryKey: 'compost' },
  cake: { material: 'Organic', categoryKey: 'compost' },
  book: { material: 'Paper', categoryKey: 'recyclable' },
  scissors: { material: 'Metal', categoryKey: 'recyclable' },
  'cell phone': { material: 'Electronic', categoryKey: 'hazardous' },
  laptop: { material: 'Electronic', categoryKey: 'hazardous' },
  keyboard: { material: 'Electronic', categoryKey: 'hazardous' },
  mouse: { material: 'Electronic', categoryKey: 'hazardous' },
  remote: { material: 'Electronic', categoryKey: 'hazardous' },
  tv: { material: 'Electronic', categoryKey: 'hazardous' },
  microwave: { material: 'Electronic', categoryKey: 'hazardous' },
  toaster: { material: 'Electronic', categoryKey: 'hazardous' },
  'hair drier': { material: 'Electronic', categoryKey: 'hazardous' },
  toothbrush: { material: 'Mixed', categoryKey: 'landfill' },
  backpack: { material: 'Textile', categoryKey: 'landfill' },
  handbag: { material: 'Textile', categoryKey: 'landfill' },
  tie: { material: 'Textile', categoryKey: 'landfill' },
  suitcase: { material: 'Textile', categoryKey: 'landfill' },
  umbrella: { material: 'Mixed', categoryKey: 'landfill' },
  'sports ball': { material: 'Mixed', categoryKey: 'landfill' },
  vase: { material: 'Glass', categoryKey: 'recyclable' },
  'potted plant': { material: 'Organic', categoryKey: 'compost' },
}

export function lookupMaterial(className) {
  return COCO_MATERIAL_MAP[className] || { material: 'Mixed', categoryKey: 'landfill' }
}
