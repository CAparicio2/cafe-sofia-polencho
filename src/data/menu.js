// Carta oficial. Precios en pesos argentinos (ARS).
// Regla de oro: SofIA solo puede responder con estos datos. No inventar productos, precios ni stock.
export const MENU = [
  { id: 'espresso', name: 'Espresso', price: 2000, line: 'Para empezar la sesión.' },
  { id: 'capuchino', name: 'Capuchino', price: 3000, line: 'Para una charla larga.' },
  { id: 'latte', name: 'Latte', price: 3500, line: 'Para pensar despacio.' },
]

export const findProduct = (id) => MENU.find((m) => m.id === id)
