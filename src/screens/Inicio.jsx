import Orb from '../components/Orb.jsx'
import Note from '../components/Note.jsx'
import { useCafe } from '../context/CafeContext.jsx'
import { ars, itemsText, sumItems } from '../lib/format.js'
import { TRACKS } from '../data/tracks.js'
import { RIDDLES } from '../data/riddles.js'

export default function Inicio() {
  const { go, usual, addItems, toast, tab, tabOpen, setClosingTab, setMode, track, rIdx, solved, solvedToday } = useCafe()

  const orderUsual = () => {
    addItems(usual)
    toast('Agregado: ' + itemsText(usual))
    go('pago')
  }
  const closeTab = () => {
    setClosingTab(true)
    setMode('now')
    go('pago')
  }

  return (
    <section className="screen" aria-label="Inicio">
      <div style={{ paddingTop: 8 }}>
        <Orb size={130} />
      </div>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h1>Hola. Soy SofIA.</h1>
        <p className="muted">
          Soy la inteligencia artificial que atiende este café. No soy una persona: soy un agente de IA, y me encanta el jazz.
        </p>
      </div>
      <button className="btn block" onClick={() => go('sofia')}>Hablar con SofIA</button>

      {tabOpen && (
        <Note kind="ok">
          <span>
            Cuenta abierta: {itemsText(tab)} · <b>{ars(sumItems(tab))}</b>
          </span>
          <button className="btn small" style={{ alignSelf: 'flex-start' }} onClick={closeTab}>
            Cerrar cuenta y pagar
          </button>
        </Note>
      )}

      <div className="card">
        <div className="row">
          <span className="eyebrow">El de siempre</span>
          <span className="demo">DEMO</span>
        </div>
        <div className="row">
          <h3>{itemsText(usual)}</h3>
          <span className="price">{ars(sumItems(usual))}</span>
        </div>
        <p className="muted">Lo que pediste la última vez.</p>
        <button className="btn gold small" style={{ alignSelf: 'flex-start' }} onClick={orderUsual}>
          Pedir de nuevo
        </button>
      </div>

      <div className="card">
        <span className="eyebrow">Acertijo del día</span>
        <h3>{RIDDLES[rIdx].home}</h3>
        <p className="muted">
          {solvedToday
            ? `Resuelto hoy. Llevas ${solved} de 5 para tu próximo cupón.`
            : `Llevas ${solved} de 5 acertijos. Al quinto, tu membresía te da un cupón.`}
        </p>
        <button className="btn alt small" style={{ alignSelf: 'flex-start' }} onClick={() => go('acertijo')}>
          Resolver
        </button>
      </div>

      <div className="card">
        <div className="row">
          <span className="eyebrow">Sonando en tu mesa</span>
          <span className="demo">SIMULADO</span>
        </div>
        <div className="row">
          <div>
            <h3>{TRACKS[track].title}</h3>
            <p className="muted">{TRACKS[track].artist}</p>
          </div>
          <button className="btn alt small" onClick={() => go('tocadiscos')}>Tocadiscos</button>
        </div>
      </div>

      <p className="motto">La IA, bien usada, potencia a la humanidad.</p>
    </section>
  )
}
