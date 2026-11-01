import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PageHeader({
  title,
  subtitle,
  emoji,
  back = { href: '/', label: 'Home' },
  children,
}: {
  title: string;
  subtitle?: string;
  emoji?: string;
  back?: { href: string; label: string } | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      {back && (
        <Link href={back.href} className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-lav-700 hover:underline">
          <ArrowLeft size={16} aria-hidden /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {emoji && <span aria-hidden className="mr-2">{emoji}</span>}
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-lg text-ink-soft">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
