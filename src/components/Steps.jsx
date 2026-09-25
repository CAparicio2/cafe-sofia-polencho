// Estados del pago: En espera → En curso → Listo (o Rechazado).
const ICON = { done: '✓', active: '⟳', fail: '!', '': '○' }
const NOTE = { done: 'Listo', active: 'En curso', fail: 'Rechazado', '': 'En espera' }

export default function Steps({ labels, states }) {
  return (
    <div className="steps" aria-live="polite">
      {labels.map((label, i) => {
        const st = states[i] || ''
        return (
          <div key={label} className={`step ${st}`}>
            <span className="ic" aria-hidden="true">{ICON[st]}</span>
            {label}
            <small>{NOTE[st]}</small>
          </div>
        )
      })}
    </div>
  )
}
