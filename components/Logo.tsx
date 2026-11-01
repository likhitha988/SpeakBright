export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="SpeakBright logo" className="shrink-0">
      <defs>
        <linearGradient id="sbLogoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8874e4" />
          <stop offset="1" stopColor="#58b3e6" />
        </linearGradient>
      </defs>
      <path
        d="M24 4C13 4 5 11.6 5 21c0 5 2.3 9.3 6 12.3L9 43l9.6-4.6c1.7.4 3.5.6 5.4.6 11 0 19-7.6 19-17S35 4 24 4z"
        fill="url(#sbLogoGrad)"
      />
      <circle cx="24" cy="21" r="6.5" fill="#fffbf3" />
      <g stroke="#fffbf3" strokeWidth="2.4" strokeLinecap="round">
        <path d="M24 9.2v2.4" />
        <path d="M13.6 14.2l1.7 1.7" />
        <path d="M34.4 14.2l-1.7 1.7" />
      </g>
      <circle cx="24" cy="21" r="3" fill="#ff8b72" />
    </svg>
  );
}
