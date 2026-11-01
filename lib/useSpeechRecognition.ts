'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  friendlyRecognitionError,
  getRecognitionCtor,
  type RecognitionLike,
  UNSUPPORTED_MESSAGE,
} from './speech';

interface Options {
  continuous?: boolean;
  lang?: string;
  /** Called when listening ends and some words were heard. */
  onFinished?: (text: string) => void;
}

/**
 * React hook around the browser speech recognition.
 * The microphone permission is only requested when start() is called.
 */
export function useSpeechRecognition(opts: Options = {}) {
  const { continuous = false, lang = 'en-IN' } = opts;
  const [supported, setSupported] = useState<boolean | null>(null); // null = not checked yet
  const [listening, setListening] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recRef = useRef<RecognitionLike | null>(null);
  const finalRef = useRef('');
  const interimRef = useRef('');
  const wantRef = useRef(false);
  const onFinishedRef = useRef(opts.onFinished);
  onFinishedRef.current = opts.onFinished;

  useEffect(() => {
    setSupported(!!getRecognitionCtor());
    return () => {
      wantRef.current = false;
      try {
        recRef.current?.abort();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setError(UNSUPPORTED_MESSAGE);
      return;
    }
    if (wantRef.current) return;
    setError(null);
    finalRef.current = '';
    interimRef.current = '';
    setFinalText('');
    setInterim('');

    let rec: RecognitionLike;
    try {
      rec = new Ctor();
    } catch {
      setError(UNSUPPORTED_MESSAGE);
      return;
    }
    rec.lang = lang;
    rec.continuous = continuous;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);
    rec.onresult = (e) => {
      let interimStr = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const t: string = r[0]?.transcript ?? '';
        if (r.isFinal) finalRef.current = (finalRef.current + ' ' + t).replace(/\s+/g, ' ').trim();
        else interimStr += t;
      }
      interimRef.current = interimStr.trim();
      setFinalText(finalRef.current);
      setInterim(interimRef.current);
    };
    rec.onerror = (e) => {
      const code: string = e?.error ?? 'unknown';
      if (code === 'aborted') return;
      wantRef.current = false;
      setError(friendlyRecognitionError(code));
    };
    rec.onend = () => {
      // Some browsers stop on their own after a pause. Keep going while the student wants to.
      if (wantRef.current && continuous) {
        try {
          rec.start();
          return;
        } catch {
          /* fall through and finish */
        }
      }
      wantRef.current = false;
      setListening(false);
      const heard = (finalRef.current + ' ' + interimRef.current).replace(/\s+/g, ' ').trim();
      if (interimRef.current) {
        finalRef.current = heard;
        interimRef.current = '';
        setFinalText(heard);
        setInterim('');
      }
      if (heard) onFinishedRef.current?.(heard);
    };

    recRef.current = rec;
    wantRef.current = true;
    try {
      rec.start();
    } catch {
      wantRef.current = false;
      setError('The microphone could not start. Please try again.');
    }
  }, [continuous, lang]);

  const stop = useCallback(() => {
    wantRef.current = false;
    try {
      recRef.current?.stop();
    } catch {
      /* ignore */
    }
  }, []);

  const reset = useCallback(() => {
    wantRef.current = false;
    try {
      recRef.current?.abort();
    } catch {
      /* ignore */
    }
    finalRef.current = '';
    interimRef.current = '';
    setFinalText('');
    setInterim('');
    setError(null);
    setListening(false);
  }, []);

  return { supported, listening, finalText, interim, error, start, stop, reset };
}
