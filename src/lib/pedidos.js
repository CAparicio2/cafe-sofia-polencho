// Aviso de venta desde el navegador. Nunca habla directo con Apps Script:
// llama a nuestra función serverless /api/pedido, que es la que conoce la URL.

// Id único por intento de compra. Si se reintenta el aviso con el mismo id,
// el backend lo reconoce y no registra la venta dos veces.
export function nuevoOrderId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
}

// { latte: 2, espresso: 1 } -> [{ id: 'latte', qty: 2 }, { id: 'espresso', qty: 1 }]
export function itemsParaBackend(items) {
  return Object.entries(items)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ id, qty }))
}

export async function registrarVenta({ orderId, items, method, cliente = '', email = '' }) {
  let res
  try {
    res = await fetch('/api/pedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, items: itemsParaBackend(items), method, cliente, email }),
    })
  } catch {
    throw new Error('Sin conexión. Revisa tu internet e intenta de nuevo.')
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    // respuesta vacía o no JSON: se trata como error abajo
  }
  if (!res.ok || !data?.ok) throw new Error(data?.error || 'No pudimos registrar tu pedido. Intenta de nuevo.')
  return data
}
