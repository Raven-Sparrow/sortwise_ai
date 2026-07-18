// Rough, clearly-labelled illustrative estimates (grams of CO2e avoided per
// correctly-sorted item vs. it going to general landfill) — used only to make
// the running session tally tangible, not presented as precise LCA data.
export const CO2_PER_ITEM_G = {
  recyclable: 180,
  compost: 90,
  hazardous: 250,
  landfill: 0,
}

export function computeImpact(history) {
  const counts = { recyclable: 0, compost: 0, landfill: 0, hazardous: 0 }
  let co2 = 0
  for (const h of history) {
    counts[h.categoryKey] = (counts[h.categoryKey] || 0) + 1
    co2 += CO2_PER_ITEM_G[h.categoryKey] || 0
  }
  return { counts, co2Grams: co2, total: history.length }
}
