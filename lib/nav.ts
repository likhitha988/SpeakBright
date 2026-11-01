// Navigation links shared by the header, footer and menus.
// Kept in a plain file (not a client component) so server and client components can both import it.

export interface NavItem {
  href: string;
  label: string;
}

export const MAIN_NAV: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/speaking', label: 'Speaking' },
  { href: '/reading', label: 'Reading' },
  { href: '/conversations', label: 'Conversations' },
  { href: '/progress', label: 'My Progress' },
  { href: '/settings', label: 'Settings' },
];

export const MORE_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/grammar-practice', label: 'Grammar Through Speaking' },
  { href: '/journal', label: 'English Journal' },
  { href: '/tutor', label: 'English Tutor' },
];
