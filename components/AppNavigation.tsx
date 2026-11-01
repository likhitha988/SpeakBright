'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MAIN_NAV, type NavItem } from '@/lib/nav';

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
}

export default function AppNavigation({
  items = MAIN_NAV,
  orientation = 'horizontal',
  onNavigate,
}: {
  items?: NavItem[];
  orientation?: 'horizontal' | 'vertical';
  onNavigate?: () => void;
}) {
  const pathname = usePathname() ?? '/';
  return (
    <ul className={orientation === 'horizontal' ? 'flex items-center gap-1' : 'flex flex-col gap-1'}>
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={[
                'block whitespace-nowrap rounded-full px-3 py-2 text-sm font-bold transition-colors',
                active ? 'bg-lav-600 text-white' : 'text-ink-soft hover:bg-lav-100 hover:text-lav-800',
              ].join(' ')}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
