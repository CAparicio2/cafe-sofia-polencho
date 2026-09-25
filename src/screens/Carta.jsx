import { useState } from 'react'
import Note from '../components/Note.jsx'
import { useCafe } from '../context/CafeContext.jsx'
import { MENU } from '../data/menu.js'
import { ars } from '../lib/format.js'

function CupIcon() {
  return (
    <div className="cup" aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none" stroke="#F5EEDF" strokeWidth="2.2" strokeLinecap="round">
        <path d="M8 16h20v7a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8z" />
        <path d="M28 18h3a3 3 0 0 1 0 6h-3M14 6c0 3 3 3 3 6M20 6c0 3 3 3 3 6" />
      </svg>
    </div>
  )
}

// Tarjeta reutilizable: se usa una vez por cada café de la carta.
function ProductCard({ product }) {
  const { addItems, toast } = useCafe()
  const [qty, setQty] = useState(1)
  const add = () => {
    addItems({ [product.id]: qty })
    toast(`Agregado: ${qty} ${product.name}`)
  }
  return (
    <div className="card">
      <div className="prod">
        <CupIcon />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="row">
            <h3>{product.name}</h3>
            <span className="price">{ars(product.price)}</span>
          </div>
          <p className="muted">{product.line}</p>
          <div className="row">
            <div className="qty">
              <button aria-label="Quitar uno" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button aria-label="Sumar uno" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button className="btn small" onClick={add}>Agregar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Carta() {
  return (
    <section className="screen" aria-label="Carta">
      <div>
        <span className="eyebrow">Carta</span>
        <h2>Tres cafés, nada más</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MENU.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <Note kind="info">
        <span>
          Precios en pesos argentinos. Ingredientes, alérgenos y stock se mostrarán cuando la carta esté conectada a la base de datos.
        </span>
      </Note>
    </section>
  )
}
