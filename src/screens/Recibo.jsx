// Recibo digital estilo ticket de máquina de escribir.
import { useCafe } from '../context/CafeContext.jsx'
import { findProduct } from '../data/menu.js'
import { TRACKS } from '../data/tracks.js'
import { ars } from '../lib/format.js'

const Line = ({ a, b }) => (
  <div className="l"><span>{a}</span><span>{b}</span></div>
)

export default function Recibo() {
  const { lastTicket: T, go } = useCafe()

  let rows = [<p key="none" className="c">Todavía no hay recibos.</p>]
  if (T) {
    rows = [
      <div key="t" className="c" style={{ fontSize: 16 }}>CAFE SOFIA POLENCHO</div>,
      <div key="p" className="c">Mendoza · Argentina</div>,
      <hr key="h1" />,
      <Line key="n" a="Ticket N.º" b={String(T.n).padStart(6, '0')} />,
      <Line key="d" a="Fecha" b={T.date.toLocaleDateString('es-AR') + ' ' + T.date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} />,
      <hr key="h2" />,
      ...Object.entries(T.items)
        .filter(([, q]) => q > 0)
        .map(([id, q]) => {
          const p = findProduct(id)
          return <Line key={id} a={`${q} x ${p.name}`} b={ars(q * p.price)} />
        }),
      <hr key="h3" />,
      <Line key="s" a="Subtotal" b={ars(T.totals.sub)} />,
      T.totals.disc ? <Line key="c" a={'Cupón ' + T.coupon.code} b={'-' + ars(T.totals.disc)} /> : null,
      <Line key="tt" a="TOTAL" b={ars(T.totals.tot)} />,
      <Line key="m" a="Pagado con" b={T.methodName} />,
      <hr key="h4" />,
      <div key="by" className="c">Atendido por SofIA, agente de IA</div>,
      <div key="tr" className="c">Sonaba: {TRACKS[T.track].title}</div>,
      <div key="demo" className="c" style={{ marginTop: 6 }}>*** DEMO · no válido como factura ***</div>,
    ].filter(Boolean)
  }

  return (
    <section className="screen" aria-label="Recibo">
      <div><span className="eyebrow">Recibo digital</span><h2>Tu ticket</h2></div>
      <div className="ticket">
        {rows.map((r, i) => (
          <div key={i} className="tw" style={{ animationDelay: (i * 0.12).toFixed(2) + 's' }}>{r}</div>
        ))}
      </div>
      <button className="btn block" onClick={() => go('inicio')}>Volver al inicio</button>
    </section>
  )
}
