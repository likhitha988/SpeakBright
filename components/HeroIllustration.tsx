/** Friendly illustration: two students chatting comfortably (inline SVG, no external images). */
export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 520 420" role="img" aria-label="Two friendly students chatting with speech bubbles" className="h-auto w-full max-w-lg">
      <defs>
        <linearGradient id="hgBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eeeafe" />
          <stop offset="1" stopColor="#ddf0fc" />
        </linearGradient>
      </defs>
      <rect x="20" y="30" width="480" height="360" rx="48" fill="url(#hgBg)" />
      <circle cx="430" cy="80" r="34" fill="#fff6e6" />
      <circle cx="95" cy="350" r="26" fill="#d9f5e8" />

      {/* speech bubbles */}
      <g className="animate-float">
        <path d="M70 70h150a22 22 0 0 1 22 22v44a22 22 0 0 1-22 22h-86l-30 24 6-24h-40a22 22 0 0 1-22-22V92a22 22 0 0 1 22-22z" fill="#fff" />
        <rect x="92" y="94" width="110" height="9" rx="4.5" fill="#c4b9f7" />
        <rect x="92" y="114" width="78" height="9" rx="4.5" fill="#ddd6fc" />
      </g>
      <g className="animate-float [animation-delay:1.5s]">
        <path d="M300 110h140a22 22 0 0 1 22 22v36a22 22 0 0 1-22 22h-20l6 24-34-24h-92a22 22 0 0 1-22-22v-36a22 22 0 0 1 22-22z" fill="#fff" />
        <circle cx="332" cy="150" r="8" fill="#ff8b72" />
        <circle cx="366" cy="150" r="8" fill="#4fc794" />
        <circle cx="400" cy="150" r="8" fill="#58b3e6" />
      </g>

      {/* student left */}
      <g>
        <path d="M110 390v-62a50 50 0 0 1 100 0v62z" fill="#8874e4" />
        <circle cx="160" cy="262" r="38" fill="#f3c9a5" />
        <path d="M122 258c0-30 18-46 40-46s38 14 38 40c-12-10-26-16-40-16s-26 6-38 22z" fill="#40308c" />
        <circle cx="147" cy="266" r="3.6" fill="#26244a" />
        <circle cx="173" cy="266" r="3.6" fill="#26244a" />
        <path d="M150 282q10 9 20 0" stroke="#26244a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      </g>

      {/* student right */}
      <g>
        <path d="M300 390v-62a50 50 0 0 1 100 0v62z" fill="#58b3e6" />
        <circle cx="350" cy="262" r="38" fill="#e8b48c" />
        <path d="M310 262c-6-34 14-56 42-56 26 0 44 20 38 56-6-14-14-26-40-26s-32 12-40 26z" fill="#26244a" />
        <circle cx="337" cy="268" r="3.6" fill="#26244a" />
        <circle cx="363" cy="268" r="3.6" fill="#26244a" />
        <path d="M340 284q10 9 20 0" stroke="#26244a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      </g>

      {/* sparkles */}
      <g fill="#ff8b72">
        <path d="M250 300l5 12 12 5-12 5-5 12-5-12-12-5 12-5z" />
      </g>
      <g fill="#4fc794">
        <path d="M455 250l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
      </g>
    </svg>
  );
}
