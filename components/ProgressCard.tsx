const TONES = {
  lav: 'bg-lav-100 text-lav-700',
  sky: 'bg-sky-100 text-sky-700',
  mint: 'bg-mint-100 text-mint-700',
  coral: 'bg-coral-100 text-coral-600',
} as const;

export default function ProgressCard({
  label,
  value,
  hint,
  icon,
  tone = 'lav',
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  tone?: keyof typeof TONES;
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      {icon && (
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${TONES[tone]}`} aria-hidden>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-3xl font-extrabold leading-none">{value}</p>
        <p className="mt-1 text-sm font-bold text-ink-soft">{label}</p>
        {hint && <p className="text-xs text-ink-mute">{hint}</p>}
      </div>
    </div>
  );
}
