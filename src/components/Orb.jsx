// El Orbe de SofIA: cambia según su estado (inactiva, escuchando, pensando, hablando)
// y su ánimo (cálido = interacción exitosa, frío = calma o problema).
import { useEffect, useRef } from 'react'
import { useCafe } from '../context/CafeContext.jsx'
import { prefersReducedMotion } from '../lib/format.js'

const LABEL = {
  idle: ['○', 'Inactiva'],
  listening: ['◉', 'Escuchando'],
  thinking: ['⋯', 'Pensando'],
  speaking: ['≋', 'Hablando'],
}

export default function Orb({ size = 130, pulse = false, liveStatus = false }) {
  const { orb } = useCafe()
  const ref = useRef(null)

  // Mientras habla, el orbe "late" con la voz (solo en la pantalla de conversación).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.removeProperty('--s')
    if (!pulse || orb.state !== 'speaking' || prefersReducedMotion()) return
    const id = setInterval(() => el.style.setProperty('--s', (1 + Math.random() * 0.12).toFixed(3)), 90)
    return () => {
      clearInterval(id)
      el.style.removeProperty('--s')
    }
  }, [orb.state, pulse])

  const [icon, label] = LABEL[orb.state]
  return (
    <div className="orb-wrap">
      <div
        ref={ref}
        className={'orb' + (orb.mood === 'cool' ? ' cool' : '')}
        data-state={orb.state}
        style={{ '--size': size + 'px' }}
        aria-hidden="true"
      />
      <span className="orb-status" aria-live={liveStatus ? 'polite' : undefined}>
        <i aria-hidden="true">{icon}</i> {label}
      </span>
    </div>
  )
}
