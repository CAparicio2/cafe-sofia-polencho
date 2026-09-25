// Aviso con color + ícono + texto (el color nunca es la única señal).
const ICON = { ok: '✓', bad: '!', info: 'i' }

export default function Note({ kind = 'info', icon, children, style }) {
  return (
    <div className={`note ${kind}`} style={style}>
      <b className="ic" aria-hidden="true">{icon || ICON[kind]}</b>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  )
}
