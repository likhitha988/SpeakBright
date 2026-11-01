'use client';

import { useEffect } from 'react';
import { useAppState, useStorageOk } from '@/lib/storage';

/** Applies the "reduced motion" setting and shows a small note if the browser cannot save progress. */
export default function PrefsApplier() {
  const [state] = useAppState();
  const storageOk = useStorageOk();

  useEffect(() => {
    document.documentElement.setAttribute('data-motion', state.prefs.reducedMotion ? 'reduce' : 'full');
  }, [state.prefs.reducedMotion]);

  if (storageOk) return null;
  return (
    <div role="status" className="border-b border-coral-200 bg-coral-50 px-4 py-2 text-center text-sm font-semibold text-ink">
      Your browser is not letting SpeakBright save progress. You can still practise, but your progress may not be saved
      after you close this page.
    </div>
  );
}
