'use client';

import { useEffect, useRef, useState } from 'react';
import { Square, Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeaking, ttsSupported } from '@/lib/speech';
import { useAppState } from '@/lib/storage';

/** A "Listen" button that reads English text aloud with the browser voice. */
export default function ListenButton({
  text,
  label = 'Listen',
  stopLabel = 'Stop',
  rate,
  size = 'sm',
  variant = 'soft',
  iconOnly = false,
}: {
  text: string;
  label?: string;
  stopLabel?: string;
  rate?: number;
  size?: 'sm' | 'md';
  variant?: 'soft' | 'outline' | 'primary';
  iconOnly?: boolean;
}) {
  const [state] = useAppState();
  const [speaking, setSpeaking] = useState(false);
  const [note, setNote] = useState('');
  const speakingRef = useRef(false);
  speakingRef.current = speaking;

  useEffect(() => {
    return () => {
      if (speakingRef.current) stopSpeaking();
    };
  }, []);

  const soundOn = state.prefs.sound;

  const onClick = () => {
    setNote('');
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    if (!soundOn) {
      setNote('Sound is turned off. You can turn it on in Settings.');
      return;
    }
    if (!ttsSupported()) {
      setNote('Your browser cannot read text aloud. You can still read it yourself.');
      return;
    }
    setSpeaking(true);
    const ok = speakText(text, { rate, onEnd: () => setSpeaking(false) });
    if (!ok) setSpeaking(false);
  };

  const cls = `btn ${size === 'sm' ? 'btn-sm' : ''} ${variant === 'primary' ? 'btn-primary' : variant === 'outline' ? 'btn-outline' : 'btn-soft'}`;
  const Icon = speaking ? Square : soundOn ? Volume2 : VolumeX;
  const text2 = speaking ? stopLabel : label;

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button type="button" onClick={onClick} className={cls} aria-label={iconOnly ? text2 : undefined} aria-pressed={speaking}>
        <Icon size={size === 'sm' ? 16 : 18} aria-hidden />
        {!iconOnly && <span>{text2}</span>}
      </button>
      {note && (
        <span role="status" className="max-w-xs text-xs font-semibold text-coral-600">
          {note}
        </span>
      )}
    </span>
  );
}
