# Cafe SofIA Polencho

App de clientes (mobile-first) del café de Mendoza atendido por **SofIA**, un agente de inteligencia artificial.
Estética de los años 50, con jazz, tocadiscos y acertijos. Hecha con **React + Vite**.

> Esta versión sale del prototipo aprobado. La voz, los pagos, la música y los datos del cliente
> son **simulados**, y están marcados en pantalla como `DEMO` o `SIMULADO`.

## Cómo abrirla en tu computadora

Necesitas tener instalado [Node.js](https://nodejs.org) (versión 18 o superior).

```bash
npm install     # instala las dependencias (solo la primera vez)
npm run dev     # abre la app en modo desarrollo (http://localhost:5173)
npm run build   # genera la versión final en la carpeta dist/ (la que usa Vercel)
```

## Qué hay en cada carpeta

```
src/
├── main.jsx               Punto de entrada
├── App.jsx                Estructura: cabecera, pantalla actual y menú inferior
├── styles.css             Colores, tipografías y estilos (paleta B "Tocadiscos")
├── context/
│   └── CafeContext.jsx    Estado de la app: pedido, cuenta, membresía, tocadiscos, SofIA
├── data/                  Datos del negocio (lo único que SofIA puede usar)
│   ├── menu.js            Carta y precios en pesos argentinos
│   ├── riddles.js         Acertijos y la regla de la membresía (cupón cada 5)
│   └── tracks.js          Temas del tocadiscos
├── lib/
│   ├── format.js          Formato de precios y sumas del pedido
│   └── sofiaBrain.js      Respuestas simuladas de SofIA (se reemplaza por el agente real)
├── components/            Piezas reutilizables (logo, orbe, cabecera, menú, avisos…)
└── screens/               Una pantalla por archivo
    ├── Inicio.jsx
    ├── Carta.jsx
    ├── Sofia.jsx          Conversación con el orbe
    ├── Tocadiscos.jsx
    ├── Acertijo.jsx
    ├── Membresia.jsx
    ├── Pago.jsx           Mercado Pago (QR/link), transferencia y cuenta abierta
    └── Recibo.jsx
```

## Identidad visual

| Rol | Color |
|---|---|
| Base (60 %) | `#EDE3CF` |
| Secundario (30 %) | `#3E7C7B` (botones: `#2E5F5E`) |
| Acento (10 %) | `#D4A017` |
| Texto | `#3A2E26` |
| Solo alertas | `#A8322A` |
| Logo (terracota / hueso) | `#9A4A2E` / `#F3EAD8` |

Tipografías (Google Fonts): **DM Serif Display** (títulos), **Jost** (textos), **Courier Prime** (recibo) y **Antonio** (logo).

## Regla de oro de SofIA

SofIA **nunca inventa datos**. Ante preguntas sobre stock, ventas, precios, la carta o cómo se arma un producto,
debe consultar la herramienta que corresponde y responder solo con lo que devuelve. Si no tiene el dato, lo dice.

## Próximos pasos (curso)

1. Subir el código a GitHub.
2. Publicarlo en Vercel.
3. Conectar el backend: Google Sheets + Apps Script, n8n y Retell AI (voz).
4. Pagos reales y panel de administración.

### Decisiones de negocio pendientes

- Nombre oficial único (el escudo dice "CAFE SOFIA" y el título "Cafe SofIA Polencho").
- Valor del cupón de la membresía (hoy 10 %, de ejemplo).
- Transferencias: quién verifica el pago y si el café se prepara antes o después de confirmarlo.
- Si hace falta comprar para sumar sellos con los acertijos.
