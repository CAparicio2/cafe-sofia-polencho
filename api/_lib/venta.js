// Valida lo que manda el navegador y lo traduce al formato que espera
// doPostPedidos_ (Pedidos.gs): { orderId, method, items: [{ id, qty }], cliente, email }.
// El precio NO viaja: el backend lo toma de su hoja 'carta'.

// Métodos de la app -> nombres que entiende el backend.
// 'transferencia' queda PENDIENTE en Apps Script hasta que se confirme en /admin.
const METODOS = { mp: 'mercado_pago', transfer: 'transferencia' }

const ORDER_ID_RE = /^[A-Za-z0-9_-]{8,64}$/
const ITEM_ID_RE = /^[a-z0-9_-]{1,40}$/i
const MAX_LINEAS = 20
const MAX_QTY = 20

export class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
  }
}

function texto(valor, max) {
  return typeof valor === 'string' ? valor.trim().slice(0, max) : ''
}

function normalizarItems(items) {
  if (!Array.isArray(items) || items.length === 0) throw new ValidationError('El pedido no tiene productos.')
  if (items.length > MAX_LINEAS) throw new ValidationError('Demasiados productos en un solo pedido.')

  // Suma cantidades si el mismo café vino repetido.
  const porId = new Map()
  for (const it of items) {
    const id = String(it?.id ?? '')
    const qty = Number(it?.qty)
    if (!ITEM_ID_RE.test(id)) throw new ValidationError(`Producto inválido: "${id}".`)
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) throw new ValidationError(`Cantidad inválida para "${id}".`)
    porId.set(id, (porId.get(id) || 0) + qty)
  }
  return [...porId].map(([id, qty]) => ({ id, qty: Math.min(qty, MAX_QTY) }))
}

export function buildVentaPayload(body) {
  if (!body || typeof body !== 'object') throw new ValidationError('Cuerpo de la solicitud inválido.')

  const orderId = String(body.orderId ?? '')
  if (!ORDER_ID_RE.test(orderId)) throw new ValidationError('orderId inválido.')

  const method = METODOS[body.method]
  if (!method) throw new ValidationError('Medio de pago no soportado.')

  return {
    orderId,
    method,
    items: normalizarItems(body.items),
    cliente: texto(body.cliente, 40),
    email: texto(body.email, 120).toLowerCase(),
  }
}
