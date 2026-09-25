// Escudo de Cafe SofIA (dibujado en SVG para que se vea nítido en cualquier tamaño).
export default function Logo({ className = 'badge logo' }) {
  return (
    <svg className={className} viewBox="0 0 240 300" role="img" aria-labelledby="badgeT">
      <title id="badgeT">
        Escudo de Cafe SofIA: taza con vapor que se convierte en notas de jazz y una pieza de rompecabezas, con un tocadiscos EN VIVO
      </title>
      <defs>
        <clipPath id="shieldIn">
          <path d="M120 17L211 38V180Q211 228 120 282Q29 228 29 180V38Z" />
        </clipPath>
      </defs>
      <path d="M120 5L223 29V180Q223 237 120 295Q17 237 17 180V29Z" fill="#F3EAD8" />
      <path d="M120 5L223 29V180Q223 237 120 295Q17 237 17 180V29Z" fill="none" stroke="#9A4A2E" strokeWidth="5" strokeLinejoin="round" />
      <g clipPath="url(#shieldIn)">
        <rect x="0" y="0" width="240" height="142" fill="#9A4A2E" />
        <rect x="0" y="194" width="240" height="110" fill="#9A4A2E" />
        <path d="M0 147H240M0 189H240" stroke="#9A4A2E" strokeWidth="1.5" />
      </g>
      {/* Taza */}
      <g fill="#F3EAD8" transform="translate(0 -10)">
        <ellipse cx="118" cy="140" rx="46" ry="7" />
        <path d="M84 94H152V102Q152 129 124 134H112Q84 129 84 102Z" />
        <path d="M150 104q17-2 17 11t-19 13" fill="none" stroke="#F3EAD8" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="118" cy="94" rx="34" ry="5.5" />
        <ellipse cx="118" cy="94.5" rx="29" ry="3.6" fill="#5E2A19" />
      </g>
      {/* Vapor: notas de jazz y pieza de rompecabezas */}
      <g transform="translate(0 -1)">
        <g className="steam" fill="none" stroke="#F3EAD8" strokeWidth="3.2" strokeLinecap="round">
          <g>
            <path d="M106 86q-8-8 0-16t-1-13" />
            <g transform="translate(-16 -6)">
              <ellipse cx="96" cy="55" rx="5.6" ry="4" transform="rotate(-25 96 55)" fill="#F3EAD8" stroke="none" />
              <ellipse cx="112" cy="51" rx="5.6" ry="4" transform="rotate(-25 112 51)" fill="#F3EAD8" stroke="none" />
              <path d="M101 54V37M117 50V33" strokeWidth="2.6" />
              <path d="M101 37l16-4" strokeWidth="5" />
            </g>
          </g>
          <g>
            <path d="M120 86q-8-9 0-18t0-16" />
            <g transform="translate(6 -4)">
              <ellipse cx="116" cy="44" rx="5" ry="3.6" transform="rotate(-25 116 44)" fill="#F3EAD8" stroke="none" />
              <path d="M120.5 43V27q5 3 7 9" strokeWidth="2.6" />
            </g>
          </g>
          <g>
            <path d="M134 86q-8-8 0-16t4-12" />
            <path transform="translate(4 -14) rotate(15 150 58)" d="M141 50h5.5a4 4 0 1 1 8 0h5.5v6a4 4 0 1 1 0 8v6h-19z" fill="#F3EAD8" stroke="none" />
          </g>
        </g>
      </g>
      <text x="120" y="181" textAnchor="middle" className="bt" fontWeight="700" fontSize="36" textLength="166" lengthAdjust="spacingAndGlyphs" fill="#9A4A2E">
        CAFE SOFIA
      </text>
      <text x="120" y="213" textAnchor="middle" className="bt" fontWeight="700" fontSize="13" textLength="136" lengthAdjust="spacingAndGlyphs" fill="#F3EAD8">
        JAZZ, ACERTIJOS &amp; CAFÉ
      </text>
      <text x="100" y="243" textAnchor="end" className="bt" fontWeight="700" fontSize="13" fill="#F3EAD8">EN</text>
      <text x="140" y="243" textAnchor="start" className="bt" fontWeight="700" fontSize="13" fill="#F3EAD8">VIVO</text>
      {/* Vinilo EN VIVO */}
      <g transform="translate(0 -14)">
        <circle cx="120" cy="252" r="15" fill="#F3EAD8" />
        <g className="disc">
          <circle cx="120" cy="252" r="12.5" fill="#3A2E26" />
          <circle cx="120" cy="252" r="10.5" fill="none" stroke="#6A5647" strokeWidth=".7" />
          <circle cx="120" cy="252" r="7.5" fill="none" stroke="#6A5647" strokeWidth=".7" />
          <circle cx="120" cy="252" r="4.2" fill="#9A4A2E" />
          <circle cx="118.6" cy="250.6" r="1" fill="#F3EAD8" />
        </g>
        <path d="M132 240l-2.5 10-5 4" fill="none" stroke="#F3EAD8" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  )
}
