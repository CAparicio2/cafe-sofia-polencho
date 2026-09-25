import { findProduct } from '../data/menu.js'

// $3.500 (formato de Argentina)
export const ars = (n) => '$' + Math.round(n).toLocaleString('es-AR')

// { latte: 1, espresso: 2 } -> "2 Espresso, 1 Latte"
export const itemsText = (items) =>
  Object.entries(items)
    .filter(([, q]) => q > 0)
    .map(([id, q]) => `${q} ${findProduct(id).name}`)
    .join(', ')

export const sumItems = (items) =>
  Object.entries(items).reduce((acc, [id, q]) => acc + q * findProduct(id).price, 0)

export const countItems = (items) => Object.values(items).reduce((a, b) => a + b, 0)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
