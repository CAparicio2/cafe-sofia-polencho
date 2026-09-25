// Tocadiscos: al reproducir, el brazo va al disco, baja la aguja y el plato toma velocidad.
import { useEffect, useRef, useState } from 'react'
import Note from '../components/Note.jsx'
import { useCafe } from '../context/CafeContext.jsx'
import { TRACKS } from '../data/tracks.js'
import { prefersReducedMotion } from '../lib/format.js'

const TARGET_SPEED = 200 // grados por segundo = 33⅓ vueltas por minuto

function Deck({ over, down, on, discRef }) {
  return (
    <div className={'deck' + (down ? ' lowered' : '') + (on ? ' on' : '')} aria-hidden="true">
      <svg className="layer" viewBox="0 0 260 230">
        <rect x="1" y="1" width="258" height="228" rx="16" fill="#2E5F5E" />
        <rect x="6" y="6" width="248" height="218" rx="12" fill="none" stroke="#3E7C7B" strokeWidth="1.5" />
        <circle cx="110" cy="115" r="101" fill="#1F4544" />
        <circle cx="110" cy="115" r="101" fill="none" stroke="#D4A017" strokeWidth="1" strokeDasharray="1.2 3.4" />
        <circle cx="232" cy="198" r="10" fill="#EDE3CF" />
        <path d="M232 198l0-7" stroke="#3A2E26" strokeWidth="2" strokeLinecap="round" />
        <circle id="pilot" cx="248" cy="16" r="3.2" />
        <rect x="236" y="62" width="16" height="6" rx="2" fill="#1F4544" />
        <rect id="lever" x="244" y="63" width="12" height="4" rx="2" fill="#D9D2C3" />
      </svg>
      <div className="disc-v" ref={discRef}>
        <div className="lbl"><b>SofIA</b><i>JAZZ</i></div>
      </div>
      <div className="sheen" />
      <svg className="layer" viewBox="0 0 260 230">
        <circle cx="228" cy="34" r="16" fill="#1F4544" />
        <g id="arm" className={(over ? 'over ' : '') + (down ? 'down' : '')}>
          <g id="armShadow" opacity=".3">
            <path d="M228 34L206 148L186 170" fill="none" stroke="#000" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="173" y="166" width="17" height="11" rx="2" transform="rotate(42 181 171)" fill="#000" />
          </g>
          <rect x="221" y="2" width="14" height="18" rx="3" fill="#6A5647" />
          <path d="M228 34L206 148L186 170" fill="none" stroke="#D9D2C3" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <g id="head">
            <rect x="173" y="166" width="17" height="11" rx="2" transform="rotate(42 181 171)" fill="#3A2E26" />
            <rect x="176" y="169" width="8" height="5" rx="1" transform="rotate(42 181 171)" fill="#D4A017" />
            <path d="M190 172l7 4" stroke="#D9D2C3" strokeWidth="2" strokeLinecap="round" />
          </g>
          <circle cx="228" cy="34" r="9" fill="#D9D2C3" />
          <circle cx="228" cy="34" r="3.5" fill="#3A2E26" />
        </g>
      </svg>
    </div>
  )
}

export default function Tocadiscos() {
  const { track, setTrack, playing, setPlaying, toast } = useCafe()
  const [over, setOver] = useState(playing)
  const [down, setDown] = useState(playing)
  const [on, setOn] = useState(playing)
  const [status, setStatus] = useState(playing ? 'Sonando' : 'Aguja en reposo')
  const busy = useRef(false)
  const discRef = useRef(null)
  const motor = useRef({ ang: 0, speed: 0, target: 0, last: null, raf: 0 })

  const wait = (ms) => new Promise((r) => setTimeout(r, prefersReducedMotion() ? 0 : ms))

  const loop = (t) => {
    const m = motor.current
    if (m.last !== null) {
      const dt = Math.min(0.05, (t - m.last) / 1000)
      m.speed += (m.target - m.speed) * Math.min(1, dt * 1.5)
      m.ang = (m.ang + m.speed * dt) % 360
      if (discRef.current) discRef.current.style.transform = `rotate(${m.ang.toFixed(2)}deg)`
    }
    m.last = t
    if (m.target > 0 || m.speed > 1) m.raf = requestAnimationFrame(loop)
    else Object.assign(m, { raf: 0, last: null, speed: 0 })
  }
  const motorOn = () => {
    setOn(true)
    if (prefersReducedMotion()) return
    const m = motor.current
    m.target = TARGET_SPEED
    if (!m.raf) {
      m.last = null
      m.raf = requestAnimationFrame(loop)
    }
  }
  const motorOff = () => {
    setOn(false)
    motor.current.target = 0
  }

  // Si ya sonaba al entrar a la pantalla, el plato sigue girando.
  useEffect(() => {
    if (playing) motorOn()
    return () => cancelAnimationFrame(motor.current.raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const play = async () => {
    if (busy.current || playing) return
    busy.current = true
    setStatus('Moviendo el brazo hacia el disco…')
    motorOn()
    setOver(true)
    await wait(1050)
    setStatus('Bajando la aguja…')
    setDown(true)
    await wait(550)
    setPlaying(true)
    setStatus('Sonando')
    busy.current = false
  }

  const stop = async () => {
    if (busy.current || !playing) return
    busy.current = true
    setStatus('Levantando la aguja…')
    setDown(false)
    await wait(500)
    motorOff()
    setStatus('Volviendo el brazo a su lugar…')
    setOver(false)
    await wait(1050)
    setPlaying(false)
    setStatus('Aguja en reposo')
    busy.current = false
  }

  const choose = async (i) => {
    if (busy.current) return
    setTrack(i)
    toast('Elegiste: ' + TRACKS[i].title)
    if (!playing) return play()
    busy.current = true
    setStatus('Levantando la aguja…')
    setDown(false)
    await wait(600)
    setStatus('Bajando la aguja…')
    setDown(true)
    await wait(550)
    setStatus('Sonando')
    busy.current = false
  }

  return (
    <section className="screen" aria-label="Tocadiscos">
      <div>
        <span className="eyebrow">Tocadiscos</span>
        <h2>Elige qué suena en tu mesa</h2>
      </div>
      <Deck over={over} down={down} on={on} discRef={discRef} />
      <p className="deck-status" aria-live="polite">{status}</p>
      <div className="row card">
        <div>
          <h3>{TRACKS[track].title}</h3>
          <p className="muted">{TRACKS[track].artist}</p>
        </div>
        <button className="btn small" onClick={() => (playing ? stop() : play())}>
          {playing ? 'Pausar' : 'Reproducir'}
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TRACKS.map((t, i) => (
          <button key={t.title} className="track" aria-pressed={i === track} onClick={() => choose(i)}>
            <span className="n">{i + 1}</span>
            <span>
              {t.title}
              <small>{t.artist}</small>
            </span>
            <span className="muted">{i === track ? '♪ Elegida' : ''}</span>
          </button>
        ))}
      </div>
      <Note kind="info">
        <span>Audio simulado: en el prototipo no suena música.</span>
      </Note>
    </section>
  )
}
