// POST /api/pedido — función serverless de Vercel.
// El navegador avisa acá que una compra se confirmó; esta función valida el
// pedido y se lo reenvía a Apps Script (que descuenta stock, suma a caja y anota
// la venta). Así la URL del backend (y más adelante el token) nunca salen del servidor.
import { AppsScriptError, callAppsScript } from './_lib/appsScript.js'
import { ValidationError, buildVentaPayload } from './_lib/venta.js'

function leerBody(req) {
  if (typeof req.body !== 'string') return req.body
  try {
    return JSON.parse(req.body)
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Método no permitido.' })
  }

  let payload
  try {
    payload = buildVentaPayload(leerBody(req))
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ ok: false, error: err.message })
    throw err
  }

  try {
    const data = await callAppsScript(payload)

    // Si un id no existe en la hoja 'carta', el backend lo informa en 'faltantes'
    // con el texto "(no está en la carta)". Queda en los logs de Vercel.
    if (data.faltantes?.length) {
      console.warn('[api/pedido] faltantes en', payload.orderId, data.faltantes)
    }

    return res.status(200).json({
      ok: true,
      orderId: payload.orderId,
      pendiente: Boolean(data.pendiente), // transferencia: espera confirmación en /admin
      duplicado: Boolean(data.dedup),     // reintento de un pedido ya registrado
    })
  } catch (err) {
    // El detalle técnico va a los logs; al navegador solo un mensaje genérico.
    console.error('[api/pedido]', payload.orderId, err.message, err.detail ?? '')
    const status = err instanceof AppsScriptError ? err.status : 500
    return res.status(status).json({ ok: false, error: 'No pudimos registrar tu pedido. Intenta de nuevo.' })
  }
}
