// Software side of the incentive loop: verified correct disposal → tokens →
// redeemable at a vending machine. The award/redeem logic here is exactly
// what would sit behind a real vending machine's dispense API in a
// production deployment (e.g. an ESP32-based bin sensor confirming a physical
// drop, or a QR code scanned at the machine) — this simulates that trigger
// with an explicit user confirmation instead of hardware.

const BALANCE_KEY = 'sortwise:wallet-balance:v1'
const HISTORY_KEY = 'sortwise:wallet-history:v1'

export const TOKEN_REWARD = {
  recyclable: 10,
  compost: 8,
  hazardous: 20, // harder to dispose of correctly, worth more
  landfill: 3, // still reward proper disposal over littering
}

export function getBalance() {
  return Number(localStorage.getItem(BALANCE_KEY) || 0)
}

function setBalance(v) {
  localStorage.setItem(BALANCE_KEY, String(Math.max(0, v)))
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

function pushHistory(entry) {
  const h = [entry, ...getHistory()].slice(0, 50)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h))
}

/** Award tokens for a confirmed, correct disposal. */
export function awardForDisposal(categoryKey) {
  const amount = TOKEN_REWARD[categoryKey] ?? 0
  const balance = getBalance() + amount
  setBalance(balance)
  pushHistory({ type: 'earn', amount, categoryKey, at: Date.now() })
  return { balance, amount }
}

/** Attempt to redeem an item at the vending machine. Returns a redemption code on success. */
export function redeemItem(item) {
  const balance = getBalance()
  if (balance < item.cost) return { success: false, balance }
  const newBalance = balance - item.cost
  setBalance(newBalance)
  const code = Math.random().toString(36).slice(2, 8).toUpperCase()
  pushHistory({ type: 'redeem', amount: -item.cost, itemName: item.name, code, at: Date.now() })
  return { success: true, balance: newBalance, code }
}
