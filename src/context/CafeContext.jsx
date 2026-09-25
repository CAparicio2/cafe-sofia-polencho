// Estado global de la app (la "memoria" del prototipo).
// Todo vive en el navegador y se reinicia al recargar. En la versión real,
// pedidos, membresía e historial se guardarán en Google Sheets vía Apps Script / n8n.
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { findProduct } from '../data/menu.js'
import { itemsText } from '../lib/format.js'

const CafeContext = createContext(null)

const GREETING = {
  id: 'hello',
  who: 'ai',
  text: 'Hola, soy SofIA, la inteligencia artificial de este café. Puedes pedirme un café por texto o por voz. ¿Qué te preparo?',
  acts: [],
  animate: false,
}

export function CafeProvider({ children }) {
  // Navegación
  const [screen, setScreen] = useState('inicio')
  const mainRef = useRef(null)

  // Pedido y pago
  const [cart, setCart] = useState({})
  const [coupon, setCoupon] = useState(null)
  const [tab, setTab] = useState({})
  const [tabOpen, setTabOpen] = useState(false)
  const [closingTab, setClosingTab] = useState(false)
  const [mode, setMode] = useState('now') // 'now' | 'tab'
  const [method, setMethod] = useState('mp') // 'mp' | 'transfer'
  const [ticketN, setTicketN] = useState(41)
  const [lastTicket, setLastTicket] = useState(null)

  // Cliente (datos DEMO)
  const [usual, setUsual] = useState({ latte: 1 })
  const [history, setHistory] = useState([
    { date: '12/09', text: '1 Latte', total: 3500 },
    { date: '05/09', text: '1 Capuchino', total: 3000 },
  ])

  // Membresía y acertijos
  const [solved, setSolved] = useState(2)
  const [rIdx, setRIdx] = useState(0)
  const [solvedToday, setSolvedToday] = useState(false)

  // Tocadiscos
  const [track, setTrack] = useState(0)
  const [playing, setPlaying] = useState(false)

  // SofIA
  const [orb, setOrb] = useState({ state: 'idle', mood: 'warm' })
  const [messages, setMessages] = useState([GREETING])

  // Aviso flotante
  const [toastText, setToastText] = useState('')
  const toastTimer = useRef(null)

  const toast = useCallback((text) => {
    setToastText(text)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastText(''), 2200)
  }, [])

  const go = useCallback((id) => {
    setScreen(id)
    if (mainRef.current) mainRef.current.scrollTop = 0
  }, [])

  const scrollToBottom = useCallback(() => {
    const el = mainRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  const addItems = useCallback((items) => {
    setCart((prev) => {
      const next = { ...prev }
      Object.entries(items).forEach(([id, q]) => (next[id] = (next[id] || 0) + q))
      return next
    })
  }, [])

  const setOrbState = useCallback((state, mood) => {
    setOrb((prev) => ({ state, mood: mood || prev.mood }))
  }, [])

  // Cierra una compra pagada: arma el recibo, actualiza historial y "el de siempre".
  const finishOrder = useCallback(
    (items, totals) => {
      const n = ticketN + 1
      const date = new Date()
      const dd = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0')
      setTicketN(n)
      setUsual(items)
      setHistory((h) => [{ date: dd, text: itemsText(items), total: totals.tot }, ...h])
      setLastTicket({
        items,
        totals,
        date,
        n,
        coupon,
        methodName: { mp: 'Mercado Pago', transfer: 'Transferencia' }[method],
        track,
      })
      if (closingTab) {
        setTab({})
        setTabOpen(false)
        setClosingTab(false)
      } else {
        setCart({})
      }
      setCoupon(null)
    },
    [ticketN, coupon, method, track, closingTab],
  )

  // Abre (o suma a) la cuenta: el pedido va a barra y se paga al final.
  const moveCartToTab = useCallback(() => {
    setTab((prev) => {
      const next = { ...prev }
      Object.entries(cart).forEach(([id, q]) => (next[id] = (next[id] || 0) + q))
      return next
    })
    setTabOpen(true)
    setCart({})
  }, [cart])

  const value = useMemo(
    () => ({
      screen, go, mainRef, scrollToBottom,
      cart, addItems, coupon, setCoupon,
      tab, tabOpen, closingTab, setClosingTab, moveCartToTab,
      mode, setMode, method, setMethod, ticketN, lastTicket, finishOrder,
      usual, history,
      solved, setSolved, rIdx, setRIdx, solvedToday, setSolvedToday,
      track, setTrack, playing, setPlaying,
      orb, setOrbState, messages, setMessages,
      toast, toastText,
      findProduct,
    }),
    [screen, go, scrollToBottom, cart, addItems, coupon, tab, tabOpen, closingTab, moveCartToTab, mode, method, ticketN,
      lastTicket, finishOrder, usual, history, solved, rIdx, solvedToday, track, playing, orb, setOrbState, messages, toast, toastText],
  )

  return <CafeContext.Provider value={value}>{children}</CafeContext.Provider>
}

export const useCafe = () => useContext(CafeContext)
