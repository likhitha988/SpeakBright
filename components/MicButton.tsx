'use client';

import { Mic, Square } from 'lucide-react';

/** The big round microphone button. */
export default function MicButton({
  listening,
  onStart,
  onStop,
  disabled,
  size = 'lg',
}: {
  listening: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
  size?: 'lg' | 'md';
}) {
  const dim = size === 'lg' ? 'h-24 w-24' : 'h-14 w-14';
  return (
    <span className="relative inline-flex items-center justify-center">
      {listening && (
        <>
          <span aria-hidden className={`absolute ${dim} animate-ring rounded-full bg-coral-400/50`} />
          <span aria-hidden className={`absolute ${dim} animate-ring rounded-full bg-coral-400/40 [animation-delay:0.5s]`} />
        </>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={listening ? onStop : onStart}
        aria-pressed={listening}
        aria-label={listening ? 'Stop speaking' : 'Start speaking'}
        className={`relative flex ${dim} items-center justify-center rounded-full text-white shadow-soft transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${
          listening ? 'bg-coral-500' : 'bg-lav-600 hover:bg-lav-700'
        }`}
      >
        {listening ? <Square size={size === 'lg' ? 34 : 22} aria-hidden fill="currentColor" /> : <Mic size={size === 'lg' ? 40 : 26} aria-hidden />}
      </button>
    </span>
  );
}
