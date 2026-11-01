import Link from 'next/link';
import Logo from './Logo';
import { MAIN_NAV, MORE_NAV } from '@/lib/nav';

export default function AppFooter() {
  const links = [...MAIN_NAV.filter((n) => n.href !== '/'), ...MORE_NAV];
  return (
    <footer className="mt-16 border-t border-lav-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Logo size={32} />
              <span className="text-lg font-extrabold">
                Speak<span className="text-lav-600">Bright</span>
              </span>
            </div>
            <p className="mt-3 font-semibold text-ink-soft">Speak More. Fear Less. Shine Brighter.</p>
            <p className="mt-2 text-sm text-ink-mute">
              No registration. No pressure. Just practise! Your progress is saved only in this browser.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm font-semibold sm:grid-cols-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-soft hover:text-lav-700 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
