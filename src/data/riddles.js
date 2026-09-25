// Acertijos del día. `a` es el índice de la opción correcta.
export const RIDDLES = [
  {
    title: 'El juego de 1950',
    home: '¿Qué propuso Alan Turing en 1950?',
    q: 'En 1950, Alan Turing publicó un artículo que proponía un juego para decidir si una máquina puede pensar. ¿Cómo lo llamó?',
    o: ['El juego de la imitación', 'La máquina Enigma', 'El problema de la parada', 'El test de Rorschach'],
    a: 0,
    hint: 'El juego consiste en que una máquina intente pasar por una persona en una conversación.',
    why: 'Lo propuso en el artículo "Computing Machinery and Intelligence".',
  },
  {
    title: 'Cinco por cuatro',
    home: '¿En qué año se grabó "Take Five"?',
    q: '"Take Five", del Dave Brubeck Quartet, está en el disco "Time Out". ¿En qué año se grabó?',
    o: ['1945', '1959', '1968', '1972'],
    a: 1,
    hint: 'Es el mismo año de "Kind of Blue", de Miles Davis.',
    why: 'Se grabó en 1959, en Nueva York.',
  },
  {
    title: 'El verano de 1956',
    home: '¿Dónde nació la IA como campo de estudio?',
    q: 'En 1956 se hizo el taller considerado el nacimiento de la inteligencia artificial como campo de estudio. ¿Dónde fue?',
    o: ['Bletchley Park', 'MIT', 'Dartmouth College', 'Stanford'],
    a: 2,
    hint: 'Es una universidad de New Hampshire, Estados Unidos.',
    why: 'Fue el taller de Dartmouth, organizado por John McCarthy y otros.',
  },
  {
    title: 'Mensajes cifrados',
    home: '¿Qué cifrado ayudó a romper Turing?',
    q: 'Durante la Segunda Guerra Mundial, Turing trabajó en Bletchley Park para descifrar mensajes alemanes. ¿Qué máquina los cifraba?',
    o: ['Colossus', 'Enigma', 'ENIAC', 'La máquina de Turing'],
    a: 1,
    hint: 'Su nombre significa "misterio" en griego.',
    why: 'Era la máquina Enigma.',
  },
  {
    title: 'A la velocidad del jazz',
    home: '¿A qué velocidad gira un LP?',
    q: 'Un disco de larga duración (LP), como los de nuestro tocadiscos, gira a cierta velocidad. ¿Cuál?',
    o: ['16 rpm', '45 rpm', '78 rpm', '33⅓ rpm'],
    a: 3,
    hint: 'Es más lenta que la de los singles, que giran a 45 rpm, y no es un número entero.',
    why: 'Gira a 33⅓ revoluciones por minuto.',
  },
]

// Regla de la membresía: cada 5 acertijos resueltos se otorga un cupón.
export const STAMPS_PER_COUPON = 5
export const MEMBERSHIP_COUPON = { code: 'MEMBRESIA5', pct: 10 } // valor DEMO, lo define el negocio
