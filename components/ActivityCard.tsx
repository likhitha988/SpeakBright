import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const TONES = {
  lav: { bg: 'bg-lav-100', icon: 'text-lav-700', ring: 'hover:border-lav-300' },
  sky: { bg: 'bg-sky-100', icon: 'text-sky-700', ring: 'hover:border-sky-300' },
  mint: { bg: 'bg-mint-100', icon: 'text-mint-700', ring: 'hover:border-mint-300' },
  coral: { bg: 'bg-coral-100', icon: 'text-coral-600', ring: 'hover:border-coral-200' },
} as const;

export default function ActivityCard({
  href,
  title,
  description,
  button,
  icon,
  tone = 'lav',
}: {
  href: string;
  title: string;
  description: string;
  button: string;
  icon: React.ReactNode;
  tone?: keyof typeof TONES;
}) {
  const t = TONES[tone];
  return (
    <article className={`card group flex h-full flex-col p-6 transition-all hover:-translate-y-1 ${t.ring}`}>
      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${t.bg} ${t.icon}`} aria-hidden>
        {icon}
      </div>
      <h3 className="text-xl font-extrabold">{title}</h3>
      <p className="mt-2 flex-1 text-ink-soft">{description}</p>
      <Link href={href} className="btn btn-primary mt-5 self-start">
        {button} <ArrowRight size={18} aria-hidden />
      </Link>
    </article>
  );
}
