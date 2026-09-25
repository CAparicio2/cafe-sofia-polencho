// Cerebro SIMULADO de SofIA (reglas simples).
// En la versión real, esto se reemplaza por el agente de IA conectado a n8n / Retell AI,
// que debe consultar las herramientas (Google Sheets) antes de responder.
// Regla de oro: nunca inventar datos. Si no hay información, decirlo con sinceridad.
import { MENU } from '../data/menu.js'
import { TRACKS } from '../data/tracks.js'
import { ars, itemsText, sumItems, countItems } from './format.js'

const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/**
 * @param {string} raw  mensaje del cliente
 * @param {object} ctx  { cart, usual, track, solved }
 * @returns {{ mood: 'warm'|'cool', text: string, add?: object, acts?: Array<{label:string, go?:string, say?:string}> }}
 */
export function sofiaBrain(raw, ctx) {
  const t = norm(raw)
  const nums = { un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4 }
  const found = {}
  const re = /(\d+|un|una|uno|dos|tres|cuatro)?\s*(espresso|expreso|capuchino|cappuccino|capuccino|latte)s?/g
  let m
  while ((m = re.exec(t))) {
    const id = m[2].startsWith('exp') || m[2] === 'espresso' ? 'espresso' : m[2] === 'latte' ? 'latte' : 'capuchino'
    const q = m[1] ? nums[m[1]] || parseInt(m[1], 10) : 1
    found[id] = (found[id] || 0) + q
  }
  const wantsOrder = /(quiero|dame|pedir|pido|agrega|trae|me das|para mi|sumame|suma)/.test(t)

  if (/(alergen|ingredient|horario|abren|cierran|stock|queda|hay de|leche|sin tacc|gluten)/.test(t))
    return {
      mood: 'cool',
      text: 'No tengo esa información cargada todavía, así que prefiero no inventarla. Cuando la carta esté conectada a la base de datos, te lo diré con datos reales.',
    }

  if (Object.keys(found).length && wantsOrder) {
    const newCart = { ...ctx.cart }
    Object.entries(found).forEach(([id, q]) => (newCart[id] = (newCart[id] || 0) + q))
    return {
      mood: 'warm',
      add: found,
      text: `Anotado: ${itemsText(found)}. Tu pedido va en ${ars(sumItems(newCart))}. ¿Lo pagamos o sumas algo más?`,
      acts: [{ label: 'Ir a pagar', go: 'pago' }, { label: 'Ver la carta', go: 'carta' }],
    }
  }

  if (/el de siempre|lo de siempre/.test(t))
    return {
      mood: 'warm',
      add: ctx.usual,
      text: `El de siempre: ${itemsText(ctx.usual)}. Ya está en tu pedido (dato DEMO).`,
      acts: [{ label: 'Ir a pagar', go: 'pago' }],
    }

  if (/mas caro/.test(t)) {
    const x = [...MENU].sort((a, b) => b.price - a.price)[0]
    return { mood: 'warm', text: `El más caro de la carta es el ${x.name}: ${ars(x.price)}.` }
  }
  if (/(mas barato|economico)/.test(t)) {
    const x = [...MENU].sort((a, b) => a.price - b.price)[0]
    return { mood: 'warm', text: `El más económico es el ${x.name}: ${ars(x.price)}.` }
  }

  if (Object.keys(found).length || /(carta|menu|precio|cuanto|que tienen|que hay)/.test(t))
    return {
      mood: 'warm',
      text: 'La carta tiene tres cafés: ' + MENU.map((p) => `${p.name} ${ars(p.price)}`).join(', ') + '. ¿Cuál te preparo?',
      acts: MENU.map((p) => ({ label: p.name, say: 'Quiero un ' + p.name.toLowerCase() })),
    }

  if (/(persona|humano|humana|eres real|robot|eres una ia|quien eres)/.test(t))
    return {
      mood: 'cool',
      text: 'No soy una persona. Soy SofIA, un agente de inteligencia artificial. Tomo tu pedido y te acompaño; un segundo agente de IA administra el negocio. Los humanos del café preparan las bebidas.',
    }

  if (/(pagar|cuenta|cobrar|checkout)/.test(t))
    return countItems(ctx.cart)
      ? { mood: 'warm', text: `Tu pedido suma ${ars(sumItems(ctx.cart))}. Te llevo al pago.`, acts: [{ label: 'Ir a pagar', go: 'pago' }] }
      : { mood: 'cool', text: 'Todavía no tienes nada en tu pedido. ¿Qué café te preparo?' }

  if (/(musica|jazz|cancion|tema|rocola|tocadiscos|vinilo)/.test(t))
    return {
      mood: 'warm',
      text: `Ahora suena "${TRACKS[ctx.track].title}". Puedes cambiarla en el tocadiscos.`,
      acts: [{ label: 'Abrir tocadiscos', go: 'tocadiscos' }],
    }

  if (/turing/.test(t))
    return {
      mood: 'warm',
      text: 'Alan Turing es nuestro referente. En 1950 propuso el "juego de la imitación" para pensar si una máquina puede pensar. Es uno de los acertijos del café.',
      acts: [{ label: 'Ir al acertijo', go: 'acertijo' }],
    }

  if (/(acertijo|descuento|cupon|juego)/.test(t))
    return {
      mood: 'warm',
      text: `Cada acertijo del día que resuelves suma un sello a tu membresía. Al completar 5, recibes un cupón de descuento. Llevas ${ctx.solved} de 5.`,
      acts: [{ label: 'Ir al acertijo', go: 'acertijo' }],
    }

  if (/^(hola|buenas|buen dia|buenas tardes|buenas noches)/.test(t))
    return { mood: 'warm', text: 'Hola. ¿Qué café te preparo hoy?' }

  return {
    mood: 'cool',
    text: 'No tengo una respuesta para eso. Puedo ayudarte con la carta, tu pedido, la música o el acertijo del día.',
  }
}
