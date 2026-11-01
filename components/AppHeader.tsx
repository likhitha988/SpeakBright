'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import AppNavigation from './AppNavigation';
import { MORE_NAV } from '@/lib/nav';

export default function AppHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu after moving to another page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Let Escape close the menu (keyboard friendly).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-lav-100 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="SpeakBright home">
          <Logo />
          <span className="text-xl font-extrabold tracking-tight text-ink">
            Speak<span className="text-lav-600">Bright</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <AppNavigation />
        </nav>

        <button
          type="button"
          className="btn btn-soft btn-sm xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          <span>{open ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Main mobile" className="border-t border-lav-100 bg-white xl:hidden">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4 sm:grid-cols-2 sm:px-6">
            <AppNavigation orientation="vertical" onNavigate={() => setOpen(false)} />
            <div>
              <p className="eyebrow mb-2 px-3.5">More practice</p>
              <AppNavigation items={MORE_NAV} orientation="vertical" onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
