// Direct ImageNet class → waste category mappings for high-confidence classification.

export const DIRECT_MAPPINGS = {
  // Recyclable — dry, non-organic materials
  pop_bottle: 'recyclable', water_bottle: 'recyclable', beer_bottle: 'recyclable',
  wine_bottle: 'recyclable', bottlecap: 'recyclable', pop_can: 'recyclable',
  tin_can: 'recyclable', carton: 'recyclable', cardboard: 'recyclable',
  crate: 'recyclable', box: 'recyclable', envelope: 'recyclable',
  binder: 'recyclable', notebook: 'recyclable', book_jacket: 'recyclable',
  comic_book: 'recyclable', newspaper: 'recyclable', magazine: 'recyclable',
  plastic_bag: 'recyclable', shopping_basket: 'recyclable', milk_can: 'recyclable',
  pitcher: 'recyclable', beaker: 'recyclable', measuring_cup: 'recyclable',
  water_jug: 'recyclable', jar: 'recyclable', jug: 'recyclable',
  beer_glass: 'recyclable', goblet: 'recyclable', vase: 'recyclable',
  paper_towel: 'recyclable', doormat: 'recyclable', packet: 'recyclable',
  rubber_eraser: 'recyclable', pencil_box: 'recyclable', pencil_sharpener: 'recyclable',
  ruler: 'recyclable', scissors: 'recyclable', can_opener: 'recyclable',
  corkscrew: 'recyclable', ladle: 'recyclable', spatula: 'recyclable',
  whisk: 'recyclable', frying_pan: 'recyclable', wok: 'recyclable',
  pot: 'recyclable', bucket: 'recyclable', barrel: 'recyclable',
  tray: 'recyclable', plate: 'recyclable', bowl: 'recyclable',
  cup: 'recyclable', coffee_mug: 'recyclable', teapot: 'recyclable',
  wineglass: 'recyclable', cocktail_shaker: 'recyclable', saltshaker: 'recyclable',
  pepper_mill: 'recyclable', soap_dispenser: 'recyclable', lotion: 'recyclable',
  perfume: 'recyclable', lipstick: 'recyclable', nail: 'recyclable',
  screw: 'recyclable', chain: 'recyclable', hook: 'recyclable',
  padlock: 'recyclable', key: 'recyclable', hammer: 'recyclable',
  plunger: 'recyclable', screw_driver: 'recyclable', wrench: 'recyclable',
  pliers: 'recyclable', shovel: 'recyclable', rake: 'recyclable',
  broom: 'recyclable', mop: 'recyclable', dustpan: 'recyclable',
  matchstick: 'recyclable', mail_slot: 'recyclable',

  // Compost — organic / food matter
  banana: 'compost', orange: 'compost', lemon: 'compost', fig: 'compost',
  pineapple: 'compost', pomegranate: 'compost', strawberry: 'compost',
  custard_apple: 'compost', jackfruit: 'compost', apple: 'compost',
  mushroom: 'compost', corn: 'compost', cucumber: 'compost',
  artichoke: 'compost', zucchini: 'compost', bell_pepper: 'compost',
  cardoon: 'compost', broccoli: 'compost', cauliflower: 'compost',
  head_cabbage: 'compost', acorn_squash: 'compost', butternut_squash: 'compost',
  spaghetti_squash: 'compost', acorn: 'compost', chestnut: 'compost',
  egg: 'compost', eggnog: 'compost', trifle: 'compost', guacamole: 'compost',
  potpie: 'compost', meat_loaf: 'compost', hotdog: 'compost',
  pizza: 'compost', burrito: 'compost', bagel: 'compost', pretzel: 'compost',
  cheeseburger: 'compost', mashed_potato: 'compost', dough: 'compost',
  French_loaf: 'compost', hip: 'compost', buckeye: 'compost', cornet: 'compost',

  // Hazardous — e-waste, batteries, medical, chemical
  cellular_telephone: 'hazardous', iPod: 'hazardous', remote_control: 'hazardous',
  laptop: 'hazardous', notebook_computer: 'hazardous', desktop_computer: 'hazardous',
  hard_disc: 'hazardous', modem: 'hazardous', joystick: 'hazardous',
  monitor: 'hazardous', projector: 'hazardous', camera: 'hazardous',
  syringe: 'hazardous', medicine_chest: 'hazardous', thermometer: 'hazardous',
  stethoscope: 'hazardous', pill_bottle: 'hazardous', spray_can: 'hazardous',
  lighter: 'hazardous', fire_extinguisher: 'hazardous', gasmask: 'hazardous',
  power_drill: 'hazardous', electric_fan: 'hazardous', space_heater: 'hazardous',
  toaster: 'hazardous', microwave: 'hazardous', washer: 'hazardous',
  dishwasher: 'hazardous', iron: 'hazardous', vacuum: 'hazardous',
  refrigerator: 'hazardous', oven: 'hazardous', stove: 'hazardous',
  cassette_player: 'hazardous', CD_player: 'hazardous', radio: 'hazardous',
  television: 'hazardous', screen: 'hazardous', keyboard: 'hazardous',
  mouse: 'hazardous', printer: 'hazardous', scanner: 'hazardous',
  fax: 'hazardous', photocopier: 'hazardous', hand_blower: 'hazardous',
  hair_dryer: 'hazardous', electric_guitar: 'hazardous', amplifier: 'hazardous',
  battery: 'hazardous', flashlight: 'hazardous', lantern: 'hazardous',
  spotlight: 'hazardous', solar_dish: 'hazardous', oscilloscope: 'hazardous',
  digital_clock: 'hazardous', analog_clock: 'hazardous', wall_clock: 'hazardous',
  stopwatch: 'hazardous', timer: 'hazardous', parking_meter: 'hazardous',
  slot: 'hazardous', vending_machine: 'hazardous', cash_machine: 'hazardous',
  pay_phone: 'hazardous', dial_telephone: 'hazardous',

  // Landfill — mixed / composite / non-recyclable
  diaper: 'landfill', sandal: 'landfill', shoe: 'landfill',
  running_shoe: 'landfill', sock: 'landfill', slipper: 'landfill',
  loafer: 'landfill', cowboy_boot: 'landfill', clog: 'landfill', boot: 'landfill',
  toothbrush: 'landfill', hairbrush: 'landfill', rubber_glove: 'landfill',
  napkin: 'landfill', tissue: 'landfill', paper_towel_used: 'landfill',
  styrofoam: 'landfill', foam: 'landfill', wrapper: 'landfill',
  candy: 'landfill', chocolate: 'landfill', plastic_wrap: 'landfill',
  backpack: 'landfill', handbag: 'landfill', purse: 'landfill',
  suitcase: 'landfill', umbrella: 'landfill', tie: 'landfill',
  bow_tie: 'landfill', scarf: 'landfill', mitten: 'landfill', glove: 'landfill',
  jersey: 'landfill', sweatshirt: 'landfill', cardigan: 'landfill',
  sweater: 'landfill', T_shirt: 'landfill', tank_top: 'landfill',
  brassiere: 'landfill', bikini: 'landfill', miniskirt: 'landfill',
  sarong: 'landfill', kimono: 'landfill', apron: 'landfill',
  poncho: 'landfill', cloak: 'landfill', academic_gown: 'landfill',
  gown: 'landfill', fur_coat: 'landfill', trench_coat: 'landfill',
  lab_coat: 'landfill', bulletproof_vest: 'landfill', vest: 'landfill', jean: 'landfill',
}

function normalize(str) {
  return str.toLowerCase().replace(/[\s,-]+/g, '_').replace(/_+/g, '_')
}

export function lookupDirect(className, probability) {
  const name = normalize(className.split(',')[0])
  const categoryKey = DIRECT_MAPPINGS[name]
  if (!categoryKey) return null
  return {
    categoryKey,
    confidence: Math.min(0.99, 0.85 + probability * 0.14),
    source: 'direct',
  }
}
