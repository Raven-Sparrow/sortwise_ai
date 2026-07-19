import { useState, useEffect } from 'react'
import { redeemItem, getHistory } from '../lib/wallet'
import { soundManager } from '../lib/soundManager'

const CATALOG = [
  { id: 'water', name: 'Aluminium Thermal Bottle', cost: 120, icon: '🧴' },
  { id: 'coffee', name: 'Zero-Waste Coffee Voucher', cost: 60, icon: '🥤' },
  { id: 'notebook', name: 'Recycled Bamboo Notebook', cost: 45, icon: '📓' },
  { id: 'sapling', name: 'Campus Tree Planting Initiative', cost: 30, icon: '🌱' },
  { id: 'snack', name: 'Vegan Energy Canteen Bar', cost: 50, icon: '🍪' },
  { id: 'travel', name: 'Metro Smart Transit Credit', cost: 90, icon: '🚌' },
]

export default function RewardsStore({ balance, onRedeem }) {
  const [redeemed, setRedeemed] = useState(null) // { name, code }
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  // Load transaction history on mount and when balance updates
  useEffect(() => {
    setHistory(getHistory())
  }, [balance])

  const handleRedeem = (item) => {
    setError(null)
    const res = redeemItem(item)
    if (!res.success) {
      soundManager.playError()
      setError(`Telemetry: Insufficient balance. Need ${item.cost - balance} more credits.`)
      return
    }
    // Play vending clunk sound!
    soundManager.playVending()
    onRedeem(res.balance)
    setRedeemed({ name: item.name, code: res.code })
  }

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 mt-5 hud-border">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted">Vending Console</p>
          <h3 className="font-display text-lg font-bold mt-0.5 text-paper">Redeem E-Tokens</h3>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-landfill/40 bg-landfill/10 px-3 py-1.5 shadow-[0_0_15px_rgba(176,137,104,0.15)]">
          <span className="text-sm">🪙</span>
          <span className="font-mono text-sm text-paper font-bold">{balance}</span>
        </div>
      </div>

      {redeemed && (
        <div className="mt-4 rounded-xl border border-compost/40 bg-compost/10 px-4 py-3.5 animate-fade-up relative">
          <p className="text-sm text-compost font-bold">
            ✓ Purchase Authorized: {redeemed.name}
          </p>
          <p className="text-xs text-muted/95 mt-1.5 font-mono leading-relaxed">
            Dispense Code: <span className="text-paper font-semibold tracking-widest bg-pine-950/80 px-2 py-0.5 rounded border border-pine-750">{redeemed.code}</span>
          </p>
          <button
            onClick={() => { soundManager.playClick(); setRedeemed(null) }}
            className="text-[10px] font-mono underline text-muted hover:text-paper mt-2.5 block"
          >
            Acknowledge
          </button>
        </div>
      )}
      {error && <p className="mt-4 text-xs text-hazard font-mono animate-fade-up">{error}</p>}

      {/* Vending items grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
        {CATALOG.map((item) => {
          const affordable = balance >= item.cost
          return (
            <button
              key={item.id}
              onClick={() => handleRedeem(item)}
              disabled={!affordable}
              className={`rounded-xl border p-3.5 text-left transition-all duration-300 active:scale-97 flex flex-col justify-between ${
                affordable
                  ? 'border-pine-700 bg-pine-950/20 hover:border-compost/50 hover:bg-compost/5 hover:shadow-[0_0_20px_rgba(140,198,63,0.06)]'
                  : 'border-pine-800 bg-pine-950/5 opacity-40 cursor-not-allowed'
              }`}
            >
              <div>
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-xs font-bold text-paper/90 leading-snug">{item.name}</p>
              </div>
              <p className="text-[10px] font-mono text-muted mt-3 font-semibold">{item.cost} tokens</p>
            </button>
          )
        })}
      </div>

      {/* Ledger history list */}
      {history.length > 0 && (
        <details className="mt-5 border-t border-pine-800/80 pt-4 group">
          <summary className="cursor-pointer font-mono text-[9px] text-muted uppercase tracking-widest hover:text-paper transition-colors select-none">
            Recent Ledger Logs
          </summary>
          <div className="mt-3 max-h-32 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
            {history.map((h, i) => {
              const dateStr = new Date(h.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              return (
                <div key={i} className="flex justify-between items-center text-[10px] font-mono border-b border-pine-900 pb-1.5 last:border-0">
                  <span className="text-muted">{dateStr}</span>
                  <span className="text-paper/85 truncate max-w-[150px] sm:max-w-[250px]">
                    {h.type === 'earn' ? `Sorted ${h.categoryKey}` : `Redeemed ${h.itemName}`}
                  </span>
                  <span className={`font-bold ${h.amount > 0 ? 'text-compost' : 'text-hazard'}`}>
                    {h.amount > 0 ? `+${h.amount}` : h.amount}
                  </span>
                </div>
              )
            })}
          </div>
        </details>
      )}

      <p className="text-[10px] text-muted/75 font-mono mt-4 leading-relaxed border-t border-pine-800/80 pt-3">
        Hardware Node Telemetry: Redemption events trigger mock payload dispenses (simulating GPIO signals to a physical vending coil).
      </p>
    </div>
  )
}
