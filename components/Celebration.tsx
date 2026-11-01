const PIECES = [
  ['8%', '#8874e4', '0s'], ['16%', '#ff8b72', '0.15s'], ['24%', '#4fc794', '0.3s'], ['32%', '#58b3e6', '0.05s'],
  ['40%', '#ffc8bb', '0.25s'], ['48%', '#a697ee', '0.1s'], ['56%', '#82dcb6', '0.35s'], ['64%', '#8ccdf1', '0.2s'],
  ['72%', '#ff8b72', '0.4s'], ['80%', '#8874e4', '0.12s'], ['88%', '#4fc794', '0.28s'], ['94%', '#58b3e6', '0.18s'],
] as const;

/** A gentle celebration card with a little falling confetti (hidden when motion is reduced). */
export default function Celebration({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div role="status" className="animate-pop relative overflow-hidden rounded-3xl border-2 border-mint-200 bg-mint-50 p-6 text-center sm:p-8">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {PIECES.map(([left, color, delay], i) => (
          <span
            key={i}
            className="absolute top-0 h-3 w-2 animate-confetti rounded-sm"
            style={{ left, backgroundColor: color, animationDelay: delay }}
          />
        ))}
      </div>
      <p className="text-5xl" aria-hidden>
        🎉
      </p>
      <h3 className="mt-2 text-2xl font-extrabold">{title}</h3>
      <div className="mt-2 text-ink-soft">{children}</div>
    </div>
  );
}
