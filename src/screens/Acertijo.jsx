import { useState } from 'react'
import Note from '../components/Note.jsx'
import { useCafe } from '../context/CafeContext.jsx'
import { RIDDLES, STAMPS_PER_COUPON, MEMBERSHIP_COUPON } from '../data/riddles.js'

export default function Acertijo() {
  const { rIdx, setRIdx, solved, setSolved, solvedToday, setSolvedToday, setCoupon, go, mainRef } = useCafe()
  const [wrong, setWrong] = useState(null) // índice de la opción equivocada
  const [fresh, setFresh] = useState(false) // se acaba de resolver
  const R = RIDDLES[rIdx]

  const answer = (i) => {
    if (solvedToday) return
    if (i !== R.a) {
      setWrong(i)
      return
    }
    setWrong(null)
    const n = solved >= STAMPS_PER_COUPON ? 1 : solved + 1
    setSolved(n)
    setSolvedToday(true)
    setFresh(true)
    if (n === STAMPS_PER_COUPON) setCoupon(MEMBERSHIP_COUPON)
  }

  const nextDay = () => {
    setRIdx((rIdx + 1) % RIDDLES.length)
    setSolvedToday(false)
    setFresh(false)
    setWrong(null)
    if (mainRef.current) mainRef.current.scrollTop = 0
  }

  const prize = fresh && solved === STAMPS_PER_COUPON

  return (
    <section className="screen" aria-label="Acertijo del día">
      <div className="row">
        <div>
          <span className="eyebrow">Acertijo del día</span>
          <h2>{R.title}</h2>
        </div>
        <span className="muted" style={{ textAlign: 'right', fontSize: 13 }}>
          Membresía
          <br />
          <b style={{ color: 'var(--ink)' }}>{solved} de 5</b>
        </span>
      </div>
      <p>{R.q}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {R.o.map((o, i) => (
          <button
            key={o}
            className={'opt' + (solvedToday && i === R.a ? ' right' : '') + (wrong === i ? ' wrong' : '')}
            disabled={solvedToday}
            onClick={() => answer(i)}
          >
            {o}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {solvedToday && (
          <Note kind="ok">
            <span>
              {fresh ? 'Correcto. ' : ''}
              {R.why} {prize ? '' : `Sumaste un sello: llevas ${solved} de 5.`}
            </span>
            {prize && (
              <span>
                <b>Completaste 5 acertijos.</b> Tu membresía te dio un cupón de 10 % (DEMO), que se aplica en tu próximo pedido.
              </span>
            )}
            <div className="acts">
              {prize && <button className="btn small" onClick={() => go('carta')}>Usar mi cupón</button>}
              <button className="btn small alt" onClick={nextDay}>Siguiente acertijo (simular otro día)</button>
            </div>
          </Note>
        )}
        {!solvedToday && wrong !== null && (
          <Note kind="bad" icon="✗">
            <span>No es esa, pero puedes volver a intentar. Pista: {R.hint}</span>
          </Note>
        )}
      </div>
    </section>
  )
}
