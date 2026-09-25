import Note from '../components/Note.jsx'
import { useCafe } from '../context/CafeContext.jsx'
import { STAMPS_PER_COUPON } from '../data/riddles.js'
import { ars } from '../lib/format.js'

export default function Membresia() {
  const { solved, coupon, history, go } = useCafe()
  const n = solved
  return (
    <section className="screen" aria-label="Membresía">
      <div className="member">
        <div className="row">
          <span className="eyebrow">Club de jazz Polencho</span>
          <span className="demo" style={{ color: '#CFE0DC', borderColor: '#CFE0DC' }}>DEMO</span>
        </div>
        <h2>Membresía</h2>
        <p style={{ fontSize: 14 }}>Socio N.º 0042 · desde 2026</p>
        <div className="stamps">
          {Array.from({ length: STAMPS_PER_COUPON }, (_, i) => (
            <div key={i} className={'stamp' + (i < n ? ' on' : '')} aria-label={i < n ? 'Sello ganado' : 'Sello pendiente'}>
              {i < n ? '✓' : i + 1}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 14 }}>
          {n < STAMPS_PER_COUPON
            ? `${n} de 5 acertijos resueltos. Te faltan ${STAMPS_PER_COUPON - n} para tu próximo cupón.`
            : 'Completaste la ronda: ganaste un cupón. El próximo acertijo inicia una ronda nueva.'}
        </p>
      </div>

      <div className="card">
        <span className="eyebrow">Cómo funciona</span>
        <p className="muted">
          Cada acertijo del día que resuelves suma un sello. Al completar 5 sellos, recibes un cupón de 10 % para tu próximo pedido y
          empiezas una nueva ronda. El valor del cupón es de ejemplo y lo define el negocio.
        </p>
        <button className="btn alt small" style={{ alignSelf: 'flex-start' }} onClick={() => go('acertijo')}>
          Ir al acertijo del día
        </button>
      </div>

      {coupon && (
        <Note kind="ok">
          <span>
            Tienes un cupón disponible: 10 % en tu próximo pedido <span className="demo">DEMO</span>
          </span>
          <button className="btn small" style={{ alignSelf: 'flex-start' }} onClick={() => go('carta')}>Usar mi cupón</button>
        </Note>
      )}

      <div className="card">
        <span className="eyebrow">Tu historial</span>
        <div className="lines">
          {history.map((h, i) => (
            <div key={i} className="row">
              <span>{h.date} · {h.text}</span>
              <span>{ars(h.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
