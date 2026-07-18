// Decision engine: turns raw MobileNet (ImageNet-1000) predictions into a
// waste-sorting call. MobileNet was trained on general object recognition,
// not trash — so this layer is the actual domain intelligence: it interprets
// what the CNN saw through the lens of disposal streams used in Indian
// municipal waste systems (dry/recyclable, wet/compost, reject/landfill,
// hazardous/e-waste).

export const CATEGORIES = {
  recyclable: {
    label: 'Recyclable',
    bin: 'Blue bin · Dry waste',
    color: 'recyclable',
    tip: 'Rinse off food residue and keep it dry — contaminated recyclables often get rejected at the sorting facility.',
    fact: 'A single recycled aluminium can saves enough energy to run a TV for 3 hours.',
  },
  compost: {
    label: 'Compostable',
    bin: 'Green bin · Wet waste',
    color: 'compost',
    tip: 'Keep food and garden waste separate from packaging — even one plastic wrapper can contaminate a whole compost batch.',
    fact: 'Composted wet waste can cut a household\u2019s landfill contribution by up to 40%.',
  },
  landfill: {
    label: 'Landfill',
    bin: 'Black bin · Reject waste',
    color: 'landfill',
    tip: 'Before binning it, double-check there isn\u2019t a take-back or recycling scheme for this item in your city.',
    fact: 'Reject waste that can\u2019t be recycled or composted still takes decades to break down — reducing it matters more than sorting it.',
  },
  hazardous: {
    label: 'Hazardous',
    bin: 'Red bin · Special collection',
    color: 'hazard',
    tip: 'Never mix this with household waste. Drop it at a designated e-waste / hazardous collection point.',
    fact: 'A single button battery can contaminate up to 600,000 litres of water if it ends up in a landfill.',
  },
}

// Keyword → category weight table. A prediction's className is matched
// against these keyword groups; each hit contributes (probability × weight)
// to that category's running score. Multiple weak signals can outweigh one
// strong but ambiguous one, which mirrors how a human sorter reasons.
const KEYWORD_RULES = [
  // Recyclable — dry, non-organic, commonly processed materials
  { keywords: ['bottle', 'pop_bottle', 'water_bottle', 'beer_bottle', 'wine_bottle', 'jar', 'jug'], category: 'recyclable', weight: 1.0 },
  { keywords: ['can', 'tin', 'pop can', 'beer_glass'], category: 'recyclable', weight: 0.9 },
  { keywords: ['carton', 'cardboard', 'box', 'crate'], category: 'recyclable', weight: 0.95 },
  { keywords: ['newspaper', 'envelope', 'binder', 'notebook', 'book_jacket', 'comic_book', 'paper_towel'], category: 'recyclable', weight: 0.85 },
  { keywords: ['plastic_bag', 'shopping_basket', 'milk_can'], category: 'recyclable', weight: 0.8 },
  { keywords: ['pitcher', 'beaker', 'measuring_cup', 'water_jug'], category: 'recyclable', weight: 0.7 },

  // Compost — organic / food matter
  { keywords: ['banana', 'orange', 'lemon', 'fig', 'pineapple', 'pomegranate', 'strawberry', 'custard_apple', 'jackfruit', 'apple'], category: 'compost', weight: 1.0 },
  { keywords: ['mushroom', 'corn', 'cucumber', 'artichoke', 'zucchini', 'bell_pepper', 'cardoon', 'broccoli', 'cauliflower', 'head_cabbage'], category: 'compost', weight: 1.0 },
  { keywords: ['eggnog', 'trifle', 'guacamole', 'potpie', 'meat_loaf', 'hotdog', 'pizza', 'burrito'], category: 'compost', weight: 0.55 },
  { keywords: ['plate', 'tray'], category: 'compost', weight: 0.25 },

  // Hazardous — e-waste, batteries, medical, chemical
  { keywords: ['cellular_telephone', 'iPod', 'remote_control', 'laptop', 'notebook_computer', 'desktop_computer', 'hard_disc', 'modem', 'joystick', 'monitor', 'projector', 'camera'], category: 'hazardous', weight: 1.0 },
  { keywords: ['syringe', 'medicine_chest', 'thermometer', 'stethoscope', 'pill_bottle'], category: 'hazardous', weight: 1.0 },
  { keywords: ['spray_can', 'lighter', 'fire_extinguisher', 'gasmask'], category: 'hazardous', weight: 0.9 },
  { keywords: ['power_drill', 'electric_fan', 'space_heater', 'toaster', 'microwave', 'washer', 'dishwasher', 'iron'], category: 'hazardous', weight: 0.8 },

  // Landfill — mixed / composite / non-recyclable materials
  { keywords: ['diaper', 'rubber_eraser', 'sandal', 'shoe', 'running_shoe', 'sock'], category: 'landfill', weight: 0.85 },
  { keywords: ['styrofoam', 'foam', 'cup', 'coffee_mug', 'paper_cup'], category: 'landfill', weight: 0.5 }, // often unrecyclable coated cups
  { keywords: ['wrapper', 'candy', 'chocolate', 'plastic_wrap'], category: 'landfill', weight: 0.7 },
  { keywords: ['broom', 'mop', 'toothbrush', 'hairbrush', 'rubber_glove'], category: 'landfill', weight: 0.75 },
  { keywords: ['napkin', 'tissue', 'paper_towel_used'], category: 'landfill', weight: 0.4 },
]

function normalize(str) {
  return str.toLowerCase().replace(/[\s-]+/g, '_')
}

/**
 * Runs the MobileNet top-K predictions through the keyword decision engine.
 * @param {{className: string, probability: number}[]} predictions
 * @returns {{ categoryKey: string, category: object, confidence: number, matchedLabel: string, breakdown: object }}
 */
export function classifyPredictions(predictions) {
  const scores = { recyclable: 0, compost: 0, landfill: 0, hazardous: 0 }
  let matchedLabel = predictions[0]?.className ?? 'unknown object'
  let bestSingleHit = { score: 0, category: null, keyword: null, prob: 0 }

  for (const pred of predictions) {
    const name = normalize(pred.className)
    for (const rule of KEYWORD_RULES) {
      for (const kw of rule.keywords) {
        if (name.includes(normalize(kw))) {
          const contribution = pred.probability * rule.weight
          scores[rule.category] += contribution
          if (contribution > bestSingleHit.score) {
            bestSingleHit = { score: contribution, category: rule.category, keyword: kw, prob: pred.probability }
          }
        }
      }
    }
  }

  const totalSignal = Object.values(scores).reduce((a, b) => a + b, 0)
  let categoryKey = 'landfill' // default: if the CNN can't tie the object to a clean stream, be conservative
  let confidence = predictions[0]?.probability ?? 0

  if (totalSignal > 0.02) {
    categoryKey = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
    confidence = Math.min(0.97, totalSignal / (predictions.slice(0, 3).reduce((a, p) => a + p.probability, 0) || 1))
  }

  return {
    categoryKey,
    category: CATEGORIES[categoryKey],
    confidence,
    matchedLabel: predictions[0]?.className?.split(',')[0] ?? 'object',
    breakdown: scores,
    lowSignal: totalSignal <= 0.02,
  }
}
