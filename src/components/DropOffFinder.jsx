import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { soundManager } from '../lib/soundManager'

// Leaflet markers styled with custom CSS glowing shadows
const userIcon = new L.DivIcon({
  className: '',
  html: '<div style="width:14px;height:14px;border-radius:50%;background:#2FA8D9;border:2px solid #F1EFE7;box-shadow:0 0 12px #2FA8D9, 0 0 0 4px rgba(47,168,217,0.25)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const pointIcon = new L.DivIcon({
  className: '',
  html: '<div style="width:12px;height:12px;border-radius:50%;background:#8CC63F;border:2px solid #070D0B;box-shadow:0 0 10px #8CC63F"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'
const RADIUS_M = 6000

async function fetchNearbyPoints(lat, lng, categoryKey) {
  const filter =
    categoryKey === 'hazardous'
      ? 'node["amenity"="recycling"]["recycling:electronic_equipment"="yes"](around:RADIUS,LAT,LNG);node["amenity"="recycling"]["recycling:batteries"="yes"](around:RADIUS,LAT,LNG);'
      : 'node["amenity"="recycling"](around:RADIUS,LAT,LNG);'

  const query = `[out:json][timeout:15];(${filter.replaceAll('RADIUS', RADIUS_M).replaceAll('LAT', lat).replaceAll('LNG', lng)});out body 15;`

  const res = await fetch(OVERPASS_URL, { method: 'POST', body: query })
  if (!res.ok) throw new Error('Overpass request failed')
  const data = await res.json()
  return (data.elements || [])
    .map((el) => ({
      id: el.id,
      lat: el.lat,
      lng: el.lon,
      name: el.tags?.name || el.tags?.operator || 'Municipal Recycling Center',
      distanceKm: haversine(lat, lng, el.lat, el.lon),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 8)
}

export default function DropOffFinder({ categoryKey }) {
  const [state, setState] = useState('idle') // idle | locating | loading | ready | error
  const [error, setError] = useState(null)
  const [origin, setOrigin] = useState(null)
  const [points, setPoints] = useState([])

  const run = () => {
    soundManager.playClick()
    setState('locating')
    setError(null)
    if (!navigator.geolocation) {
      soundManager.playError()
      setState('error')
      setError('Your browser doesn\u2019t support location access.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setOrigin({ lat: latitude, lng: longitude })
        setState('loading')
        try {
          const results = await fetchNearbyPoints(latitude, longitude, categoryKey)
          setPoints(results)
          setState('ready')
          soundManager.playSuccess()
        } catch {
          soundManager.playError()
          setState('error')
          setError('Couldn\u2019t reach the map database. Try again in a moment.')
        }
      },
      () => {
        soundManager.playError()
        setState('error')
        setError('Location access was denied. Enable it to find nearby drop-off points.')
      },
      { enableHighAccuracy: false, timeout: 10000 }
    )
  }

  return (
    <div className="mt-5 glass-card rounded-2xl p-5 sm:p-6 hud-border">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted">Disposal Telemetry</p>
          <h4 className="font-display font-bold text-lg mt-0.5 text-paper">Nearby Recycling Drop-Off Hubs</h4>
        </div>
        {state === 'idle' && (
          <button
            onClick={run}
            className="rounded-full bg-recyclable text-pine-950 font-display font-bold text-sm px-5 py-2 hover:brightness-110 active:scale-95 transition-all glow-recyclable"
          >
            Locate Drop-Offs
          </button>
        )}
      </div>

      {state === 'locating' && <p className="text-muted text-sm font-mono mt-4 animate-pulse">pinging satellite coordinate systems…</p>}
      {state === 'loading' && <p className="text-muted text-sm font-mono mt-4 animate-pulse">resolving OpenStreetMap recycling nodes…</p>}
      {state === 'error' && <p className="text-hazard text-sm font-mono mt-4">{error}</p>}

      {state === 'ready' && origin && (
        <div className="mt-4 animate-fade-up">
          <div className="rounded-xl overflow-hidden border border-pine-700/80 h-56 sm:h-64 shadow-2xl relative">
            <MapContainer center={[origin.lat, origin.lng]} zoom={13} className="w-full h-full" scrollWheelZoom={false}>
              {/* Sleek CARTO Dark Matter Tiles mapping */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              <Circle center={[origin.lat, origin.lng]} radius={RADIUS_M} pathOptions={{ color: '#2FA8D9', fillColor: '#2FA8D9', fillOpacity: 0.03, weight: 1 }} />
              <Marker position={[origin.lat, origin.lng]} icon={userIcon}>
                <Popup>Your Location</Popup>
              </Marker>
              {points.map((p) => (
                <Marker key={p.id} position={[p.lat, p.lng]} icon={pointIcon}>
                  <Popup>{p.name} · {p.distanceKm.toFixed(2)} km</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {points.length === 0 ? (
            <p className="text-muted text-xs font-mono mt-4 leading-relaxed">
              No recycling points detected within {RADIUS_M / 1000} km. Try searching on{' '}
              <a
                className="underline hover:text-paper"
                href={`https://www.openstreetmap.org/search?query=recycling#map=14/${origin.lat}/${origin.lng}`}
                target="_blank" rel="noreferrer"
              >
                OpenStreetMap
              </a>.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {points.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm border-b border-pine-800/50 pb-2.5 last:border-0 font-mono">
                  <span className="truncate pr-3 text-paper/90">{p.name}</span>
                  <span className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted font-bold">{p.distanceKm.toFixed(2)} km</span>
                    <a
                      className="text-xs text-recyclable hover:underline font-bold"
                      href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`}
                      target="_blank" rel="noreferrer"
                      onClick={() => soundManager.playClick()}
                    >
                      Directions ↗
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
