import Logo from './Logo.jsx'
import { useCafe } from '../context/CafeContext.jsx'
import { countItems } from '../lib/format.js'

export default function Header() {
  const { cart, go } = useCafe()
  return (
    <header className="top">
      <div className="brand">
        <Logo />
        <div>
          Cafe Sof<em>IA</em> Polencho<small>Mendoza · prototipo</small>
        </div>
      </div>
      <button className="cartbtn" aria-label="Ver tu pedido" onClick={() => go('pago')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#3A2E26" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2.5 4h2.6l2.3 10.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.4-1.1L20.5 8H6.1" />
          <circle cx="9.5" cy="19.5" r="1.4" />
          <circle cx="17" cy="19.5" r="1.4" />
        </svg>
        <b>{countItems(cart)}</b>
      </button>
    </header>
  )
}
