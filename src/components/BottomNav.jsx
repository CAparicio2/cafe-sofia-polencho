import { useCafe } from '../context/CafeContext.jsx'

const ITEMS = [
  { id: 'inicio', label: 'Inicio', icon: <path d="M4 11l8-7 8 7v9H4z" /> },
  { id: 'carta', label: 'Carta', icon: <path d="M5 9h12v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2M9 3v3M13 3v3" /> },
  { id: 'sofia', label: 'SofIA', orb: true },
  { id: 'tocadiscos', label: 'Tocadiscos', icon: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.5" /></> },
  { id: 'membresia', label: 'Membresía', icon: <><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="9" cy="12" r="2" /><path d="M14 11h4M14 14h3" /></> },
]

export default function BottomNav() {
  const { screen, go } = useCafe()
  return (
    <nav className="tabs" aria-label="Secciones">
      {ITEMS.map((it) => (
        <button key={it.id} onClick={() => go(it.id)} aria-current={screen === it.id ? 'page' : undefined}>
          {it.orb ? (
            <div className="mini-orb" aria-hidden="true" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{it.icon}</svg>
          )}
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  )
}
