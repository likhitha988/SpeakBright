import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import PrefsApplier from '@/components/PrefsApplier';

export const metadata: Metadata = {
  title: {
    default: 'SpeakBright - Speak More. Fear Less. Shine Brighter.',
    template: '%s | SpeakBright',
  },
  description:
    'SpeakBright helps students practise English speaking, reading, conversations and grammar. No login, no signup: just open the website and start practising.',
};

export const viewport: Viewport = {
  themeColor: '#fffbf3',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-motion="full">
      <body className="min-h-screen">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <AppHeader />
        <PrefsApplier />
        <main id="main" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
        <AppFooter />
      </body>
    </html>
  );
}
