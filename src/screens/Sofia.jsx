// Conversación con SofIA (cerebro SIMULADO; ver src/lib/sofiaBrain.js).
import { useEffect, useRef, useState } from 'react'
import Orb from '../components/Orb.jsx'
import { useCafe } from '../context/CafeContext.jsx'
import { sofiaBrain } from '../lib/sofiaBrain.js'
import { prefersReducedMotion } from '../lib/format.js'

const CHIPS = ['Quiero un latte', '¿Qué hay en la carta?', '¿Tiene alérgenos el capuchino?', '¿Eres una persona?', 'Quiero pagar']
const CHIP_LABEL = { '¿Tiene alérgenos el capuchino?': '¿Alérgenos?' }

function AiBubble({ msg, onAct, onDone }) {
  const { setOrbState, scrollToBottom } = useCafe()
  const [shown, setShown] = useState(msg.animate ? '' : msg.text)
  const [finished, setFinished] = useState(!msg.animate)

  useEffect(() => {
    if (!msg.animate) return
    setOrbState('speaking', msg.mood)
    if (prefersReducedMotion()) {
      setShown(msg.text)
      setFinished(true)
      onDone(msg.id)
      setTimeout(() => setOrbState('idle'), 400)
      return
    }
    let i = 0
    let done = false
    const id = setInterval(() => {
      i += 2
      setShown(msg.text.slice(0, i))
      scrollToBottom()
      if (i >= msg.text.length) {
        clearInterval(id)
        done = true
        setFinished(true)
        onDone(msg.id)
        setTimeout(() => setOrbState('idle'), 400)
      }
    }, 18)
    return () => {
      clearInterval(id)
      if (!done) {
        onDone(msg.id)
        setOrbState('idle')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (finished) scrollToBottom()
  }, [finished, scrollToBottom])

  return (
    <div className="msg ai">
      <span className="who">SofIA · IA</span>
      <span>{shown}</span>
      {finished && msg.acts?.length > 0 && (
        <div className="acts">
          {msg.acts.map((a) => (
            <button key={a.label} className="btn small alt" onClick={() => onAct(a)}>
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sofia() {
  const cafe = useCafe()
  const { messages, setMessages, setOrbState, addItems, go, scrollToBottom } = cafe
  const [input, setInput] = useState('')
  const [micOn, setMicOn] = useState(false)
  const busy = useRef(false)
  const nextId = useRef(1)

  // Siempre leemos el estado más reciente al momento de responder.
  const ctxRef = useRef(cafe)
  ctxRef.current = cafe

  useEffect(() => {
    scrollToBottom()
  }, [messages.length, scrollToBottom])

  const send = (text) => {
    if (!text.trim() || busy.current) return
    busy.current = true
    setMessages((m) => [...m, { id: 'u' + nextId.current++, who: 'me', text }])
    setOrbState('listening')
    setTimeout(() => {
      setOrbState('thinking')
      setTimeout(() => {
        const { cart, usual, track, solved } = ctxRef.current
        const r = sofiaBrain(text, { cart, usual, track, solved })
        if (r.add) addItems(r.add)
        setMessages((m) => [...m, { id: 'a' + nextId.current++, who: 'ai', text: r.text, acts: r.acts || [], mood: r.mood, animate: true }])
        busy.current = false
      }, 900)
    }, 450)
  }

  const markDone = (id) => setMessages((m) => m.map((x) => (x.id === id ? { ...x, animate: false } : x)))
  const onAct = (a) => (a.go ? go(a.go) : send(a.say))

  const onSubmit = (e) => {
    e.preventDefault()
    send(input)
    setInput('')
  }

  const mic = () => {
    if (busy.current) return
    setMicOn(true)
    setOrbState('listening')
    setTimeout(() => {
      setMicOn(false)
      send('Quiero un capuchino')
    }, 1800)
  }

  return (
    <section className="screen" aria-label="Conversación con SofIA">
      <Orb size={110} pulse liveStatus />
      <div className="chat" aria-live="polite">
        {messages.map((m) =>
          m.who === 'ai' ? (
            <AiBubble key={m.id} msg={m} onAct={onAct} onDone={markDone} />
          ) : (
            <div key={m.id} className="msg me">{m.text}</div>
          ),
        )}
      </div>
      <div className="chips">
        {CHIPS.map((c) => (
          <button key={c} className="chip" onClick={() => send(c)}>{CHIP_LABEL[c] || c}</button>
        ))}
      </div>
      <form className="composer" onSubmit={onSubmit}>
        <label htmlFor="msgInput" className="sr">Escríbele a SofIA</label>
        <input
          id="msgInput"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={micOn ? 'Escuchando… (voz simulada)' : 'Pídele un café a SofIA'}
        />
        <button type="button" className={'iconbtn' + (micOn ? ' on' : '')} aria-label="Hablar por voz (simulado)" onClick={mic}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#3A2E26" strokeWidth="2" strokeLinecap="round">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
        </button>
        <button type="submit" className="iconbtn" style={{ background: 'var(--teal-deep)', borderColor: 'var(--teal-deep)' }} aria-label="Enviar">
          <svg viewBox="0 0 24 24" fill="none" stroke="#F5EEDF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
    </section>
  )
}
