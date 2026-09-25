// Cliente HTTP hacia el backend de Google Apps Script.
// Solo corre en el servidor (Vercel): la URL del backend nunca llega al navegador.
// Es el ÚNICO lugar que habla con Apps Script; cuando se sume el token
// (Etapa 6) se agrega acá y todas las llamadas lo heredan.

const TIMEOUT_MS = 20000

export class AppsScriptError extends Error {
  constructor(message, { status = 502, detail } = {}) {
    super(message)
    this.name = 'AppsScriptError'
    this.status = status
    this.detail = detail
  }
}

function getBackendUrl() {
  const url = process.env.APPS_SCRIPTAPA_URL
  if (!url) {
    throw new AppsScriptError('Falta la variable de entorno APPS_SCRIPTAPA_URL en Vercel.', { status: 500 })
  }
  return url
}

// Envía un POST con JSON al doPost de Apps Script y devuelve su respuesta ya
// parseada. Lanza AppsScriptError si no hay conexión, si tarda demasiado, si la
// respuesta no es JSON o si el backend contesta { ok: false }.
// (Apps Script siempre responde 200: los errores viajan dentro del JSON.)
export async function callAppsScript(payload) {
  const url = getBackendUrl()

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow', // Apps Script responde con un 302 hacia googleusercontent.com
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (err) {
    const timeout = err?.name === 'TimeoutError'
    throw new AppsScriptError(
      timeout ? 'El backend tardó demasiado en responder.' : 'No se pudo contactar al backend.',
      { status: timeout ? 504 : 502, detail: String(err) },
    )
  }

  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    // Típico cuando la implementación no está publicada con acceso "Cualquier
    // persona": Google devuelve una página HTML de login en vez de JSON.
    throw new AppsScriptError('El backend no respondió JSON (revisa que la implementación sea "Cualquier persona").', {
      detail: `HTTP ${res.status}: ${text.slice(0, 300)}`,
    })
  }

  if (!res.ok || !data || data.ok !== true) {
    throw new AppsScriptError(data?.error || 'El backend rechazó la solicitud.', { detail: data })
  }
  return data
}
