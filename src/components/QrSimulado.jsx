// Dibuja un QR de MUESTRA (no escaneable). En la versión real lo genera Mercado Pago.
import { useEffect, useRef } from 'react'

export default function QrSimulado({ seed }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const x = c.getContext('2d')
    const n = 21, s = 6
    x.fillStyle = '#F5EEDF'
    x.fillRect(0, 0, 126, 126)
    x.fillStyle = '#3A2E26'
    let v = seed * 97 + 13
    const r = () => (v = (v * 16807) % 2147483647) / 2147483647
    const finder = (a, b) => a < 7 && b < 7
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        if (finder(i, j) || finder(n - 1 - i, j) || finder(i, n - 1 - j)) continue
        if (r() > 0.52) x.fillRect(i * s, j * s, s, s)
      }
    ;[[0, 0], [n - 7, 0], [0, n - 7]].forEach(([a, b]) => {
      x.fillRect(a * s, b * s, 7 * s, 7 * s)
      x.fillStyle = '#F5EEDF'
      x.fillRect((a + 1) * s, (b + 1) * s, 5 * s, 5 * s)
      x.fillStyle = '#3A2E26'
      x.fillRect((a + 2) * s, (b + 2) * s, 3 * s, 3 * s)
    })
  }, [seed])
  return <canvas ref={ref} width="126" height="126" aria-label="Código QR simulado" />
}
