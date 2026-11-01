'use client';

import { useEffect, useRef } from 'react';
import { Mic, Square } from 'lucide-react';
import MicButton from './MicButton';
import { useSpeechRecognition } from '@/lib/useSpeechRecognition';
import { UNSUPPORTED_MESSAGE } from '@/lib/speech';

/**
 * Speak OR type an answer.
 * The microphone permission is only requested when the student presses Start Speaking.
 * If speech recognition is not supported, the student can still type.
 */
export default function VoiceInput({
  value,
  onChange,
  onFinished,
  placeholder = 'Your answer will appear here. You can also type or edit it.',
  continuous = false,
  compact = false,
  rows = 4,
  resetKey = 0,
  label = 'Your answer',
}: {
  value: string;
  onChange: (v: string) => void;
  onFinished?: (text: string) => void;
  placeholder?: string;
  continuous?: boolean;
  compact?: boolean;
  rows?: number;
  resetKey?: number;
  label?: string;
}) {
  const baseRef = useRef('');
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const rec = useSpeechRecognition({
    continuous,
    onFinished: (heard) => {
      const full = (baseRef.current + ' ' + heard).replace(/\s+/g, ' ').trim();
      onFinishedRef.current?.(full);
    },
  });

  // Show the words live while the student speaks.
  useEffect(() => {
    if (rec.listening || rec.finalText) {
      onChangeRef.current((baseRef.current + ' ' + rec.finalText + ' ' + rec.interim).replace(/\s+/g, ' ').trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rec.finalText, rec.interim, rec.listening]);

  // Parent asked for a fresh start (Try Again / next question).
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    rec.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const canSpeak = rec.supported === true;
  const start = () => {
    baseRef.current = value.trim();
    rec.start();
  };

  return (
    <div>
      {rec.supported === false && (
        <p role="status" className="mb-4 rounded-2xl bg-sky-50 p-4 text-sm font-semibold text-sky-700">
          {UNSUPPORTED_MESSAGE}
        </p>
      )}
      {rec.error && (
        <p role="alert" className="mb-4 rounded-2xl bg-coral-50 p-4 text-sm font-semibold text-ink">
          {rec.error}
        </p>
      )}

      <div className="flex flex-col items-center gap-3">
        <MicButton
          listening={rec.listening}
          onStart={start}
          onStop={rec.stop}
          disabled={!canSpeak}
          size={compact ? 'md' : 'lg'}
        />
        <p className="text-sm font-semibold text-ink-soft" aria-live="polite">
          {rec.listening
            ? 'Listening... speak now. Press stop when you finish.'
            : canSpeak
              ? 'Press the microphone and start speaking.'
              : 'Type your answer below.'}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" className="btn btn-primary btn-sm" onClick={start} disabled={!canSpeak || rec.listening}>
            <Mic size={16} aria-hidden /> Start Speaking
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={rec.stop} disabled={!rec.listening}>
            <Square size={16} aria-hidden /> Stop Speaking
          </button>
        </div>
      </div>

      <label className="mt-5 block">
        <span className="mb-1.5 block text-sm font-bold text-ink-soft">{label}</span>
        <textarea
          className="field"
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
