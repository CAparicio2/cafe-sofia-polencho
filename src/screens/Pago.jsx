// Checkout: pagar ahora (QR/link de Mercado Pago o transferencia) o abrir una cuenta.
// Todos los pagos son SIMULADOS en esta versión.
import { useEffect, useRef, useState } from 'react'
import Note from '../components/Note.jsx'
import Steps from '../components/Steps.jsx'
import QrSimulado from '../components/QrSimulado.jsx'
import { useCafe } from '../context/CafeContext.jsx'
import { findProduct } from '../data/menu.js'
import { ars, countItems, sumItems } from '../lib/format.js'

const METHODS = [
  { id: 'mp', label: 'QR o link de Mercado Pago' },
  { id: 'transfer', label: 'Transferencia bancaria' },
]

function OrderLines({ items, coupon, disc, tot }) {
  return (
    <div className="card lines">
      {Object.entries(items)
        .filter(([, q]) => q > 0)
        .map(([id, q]) => {
          const p = findProduct(id)
          return (
            <div key={id} className="row">
              <span>{q} × {p.name}</span>
              <span>{ars(q * p.price)}</span>
            </div>
          )
        })}
      {disc > 0 && (
        <div className="row" style={{ color: '#1F4544' }}>
          <span>✓ Cupón {coupon.code} (−{coupon.pct} %) <span className="demo">DEMO</span></span>
          <span>−{ars(disc)}</span>
        </div>
      )}
      <div className="row total"><span>Total</span><span>{ars(tot)}</span></div>
    </div>
  )
}

export default function Pago() {
  const {
    cart, tab, tabOpen, closingTab, coupon, mode, setMode, method, setMethod, ticketN,
    finishOrder, moveCartToTab, setOrbState, go, toast,
  } = useCafe()
  const [flow, setFlow] = useState(null)
  const timers = useRef([])
  const aliasRef = useRef(null)
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))

  const items = closingTab ? tab : cart
  const sub = sumItems(items)
  const disc = coupon ? Math.round((sub * coupon.pct) / 100) : 0
  const tot = sub - disc
  const canTab = !closingTab

  // --- Pagar ahora ---
  const runPay = (fail) => {
    const tr = method === 'transfer'
    const last = closingTab ? 'Cuenta cerrada' : 'Pedido enviado a barra'
    const labels = [tr ? 'Verificando transferencia' : 'Procesando pago', tr ? 'Transferencia acreditada' : 'Pago aprobado', last]
    const snap = { items: { ...items }, coupon, disc, tot, sub }
    setFlow({ kind: 'pay', snap, labels, states: ['active', '', ''] })
    setOrbState('thinking', 'warm')
    later(() => {
      if (fail) {
        setOrbState('idle', 'cool')
        setFlow({ kind: 'pay', snap, fail: true, tr, labels: [tr ? 'Transferencia no recibida' : 'Pago rechazado', labels[1], last], states: ['fail', '', ''] })
        return
      }
      setFlow({ kind: 'pay', snap, labels, states: ['done', 'done', 'active'] })
      later(() => {
        setFlow({ kind: 'pay', snap, labels, states: ['done', 'done', 'done'], done: true })
        setOrbState('idle', 'warm')
        finishOrder(snap.items, { sub: snap.sub, disc: snap.disc, tot: snap.tot })
      }, 1100)
    }, 1500)
  }

  // --- Abrir cuenta / sumar a la cuenta ---
  const runTab = () => {
    const labels = [tabOpen ? 'Sumado a tu cuenta' : 'Cuenta abierta', 'Pedido enviado a barra']
    const snap = { items: { ...items }, coupon, disc, tot, sub }
    setFlow({ kind: 'tab', snap, labels, states: ['active', ''] })
    later(() => {
      setFlow({ kind: 'tab', snap, labels, states: ['done', 'active'] })
      later(() => {
        const newTotal = sumItems(tab) + sumItems(cart)
        moveCartToTab()
        setFlow({ kind: 'tab', snap, labels, states: ['done', 'done'], done: true, newTotal })
      }, 1000)
    }, 900)
  }

  const copyAlias = () => {
    const text = aliasRef.current?.textContent || ''
    const fallback = () => {
      const r = document.createRange()
      r.selectNodeContents(aliasRef.current)
      const s = window.getSelection()
      s.removeAllRanges()
      s.addRange(r)
      toast('Alias seleccionado: cópialo')
    }
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => toast('Alias copiado')).catch(fallback)
    else fallback()
  }

  const title = closingTab ? 'Cerrar tu cuenta' : 'Tu pedido'

  // Pedido vacío
  if (!flow && !countItems(items)) {
    return (
      <section className="screen" aria-label="Tu pedido y pago">
        <div><span className="eyebrow">Checkout</span><h2>{title}</h2></div>
        <div className="card" style={{ alignItems: 'flex-start' }}>
          <h3>Tu pedido está vacío</h3>
          <p className="muted">Elige un café de la carta o pídeselo a SofIA.</p>
          <div className="acts">
            <button className="btn small" onClick={() => go('carta')}>Ver la carta</button>
            <button className="btn small alt" onClick={() => go('sofia')}>Hablar con SofIA</button>
          </div>
        </div>
      </section>
    )
  }

  const view = flow ? flow.snap : { items, coupon, disc, tot }

  return (
    <section className="screen" aria-label="Tu pedido y pago">
      <div><span className="eyebrow">Checkout</span><h2>{title}</h2></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <OrderLines items={view.items} coupon={view.coupon} disc={view.disc} tot={view.tot} />

        {!flow && canTab && (
          <div className="seg" role="group" aria-label="Cómo quieres pagar">
            <button aria-pressed={mode === 'now'} onClick={() => setMode('now')}>Pagar ahora</button>
            <button aria-pressed={mode === 'tab'} onClick={() => setMode('tab')}>{tabOpen ? 'Sumar a mi cuenta' : 'Abrir cuenta'}</button>
          </div>
        )}

        {!flow && mode === 'tab' && canTab && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p className="muted">Tu pedido va a la barra ahora y pagas todo al final, cuando cierres la cuenta.</p>
            <button className="btn block" onClick={runTab}>{tabOpen ? 'Sumar a mi cuenta' : 'Abrir cuenta'} y enviar a barra</button>
          </div>
        )}

        {!flow && (mode === 'now' || !canTab) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} role="radiogroup" aria-label="Medio de pago">
            {METHODS.map((m) => (
              <button key={m.id} className="method" role="radio" aria-checked={method === m.id} onClick={() => setMethod(m.id)}>
                <span className="dot" />
                {m.label}
              </button>
            ))}

            {method === 'mp' && (
              <div className="card qr">
                <QrSimulado seed={ticketN} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className="demo" style={{ alignSelf: 'flex-start' }}>SIMULADO</span>
                  <p style={{ fontSize: 14 }}>SofIA generó tu link de pago:</p>
                  <p style={{ fontFamily: 'var(--mono)', fontSize: 13, wordBreak: 'break-all' }}>link-de-pago/demo-{ticketN + 1}</p>
                  <p className="muted" style={{ fontSize: 12 }}>No escanear: es solo una muestra.</p>
                </div>
              </div>
            )}

            {method === 'transfer' && (
              <div className="card">
                <div className="row"><span className="eyebrow">Datos para transferir</span><span className="demo">SIMULADO</span></div>
                <div className="lines" style={{ fontSize: 14 }}>
                  <div className="row"><span className="muted">Alias</span><span style={{ fontFamily: 'var(--mono)' }} ref={aliasRef}>cafe.sofia.demo</span></div>
                  <div className="row"><span className="muted">Titular</span><span>Cafe SofIA Polencho (DEMO)</span></div>
                  <div className="row"><span className="muted">Monto exacto</span><span style={{ fontWeight: 600 }}>{ars(tot)}</span></div>
                </div>
                <button className="btn small alt" style={{ alignSelf: 'flex-start' }} onClick={copyAlias}>Copiar alias</button>
                <p className="muted" style={{ fontSize: 12 }}>Datos de muestra: no transfieras a este alias.</p>
              </div>
            )}

            <button className="btn block gold" onClick={() => runPay(false)}>
              {method === 'transfer' ? 'Ya transferí ' + ars(tot) : 'Pagar ' + ars(tot)}
            </button>
            <button className="link" style={{ alignSelf: 'center' }} onClick={() => runPay(true)}>Simular pago rechazado</button>
          </div>
        )}

        {flow && (
          <div>
            <Steps labels={flow.labels} states={flow.states} />
            {flow.fail && (
              <>
                <Note kind="bad" style={{ marginTop: 10 }}>
                  <span>
                    {flow.tr
                      ? 'Todavía no vemos tu transferencia. Revisa el alias y el monto, o prueba con otro medio de pago.'
                      : 'El pago no se aprobó. No se te cobró nada. Prueba con otro medio de pago.'}
                  </span>
                </Note>
                <button className="btn block" style={{ marginTop: 10 }} onClick={() => setFlow(null)}>Elegir otro medio</button>
              </>
            )}
            {flow.kind === 'pay' && flow.done && (
              <button className="btn block" style={{ marginTop: 12 }} onClick={() => go('recibo')}>Ver recibo</button>
            )}
            {flow.kind === 'tab' && flow.done && (
              <>
                <Note kind="ok" style={{ marginTop: 10 }}>
                  <span>Tu cuenta va en {ars(flow.newTotal)}. Puedes cerrarla desde el inicio cuando quieras.</span>
                </Note>
                <button className="btn block" style={{ marginTop: 10 }} onClick={() => go('inicio')}>Volver al inicio</button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
