'use client';

import { useEffect, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useAppState } from '@/lib/storage';

type Mode = 'tutor' | 'feedback' | 'journal';

/**
 * Optional AI English tutor.
 * - It only works when the website owner has set ANTHROPIC_API_KEY on the server.
 * - If it is not configured, it says so honestly (or stays hidden in compact mode).
 * - Text is only sent when the student presses the button.
 */
export default function AiTutorBox({
  mode = 'tutor',
  text,
  context,
  compact = false,
  buttonLabel = 'Ask the AI tutor',
}: {
  mode?: Mode;
  /** If given, this text is sent when the student presses the button (no typing box shown). */
  text?: string;
  context?: string;
  compact?: boolean;
  buttonLabel?: string;
}) {
  const [state] = useAppState();
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [input, setInput] = useState('');
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch('/api/feedback')
      .then((r) => r.json())
      .then((d) => alive && setConfigured(!!d.configured))
      .catch(() => alive && setConfigured(false));
    return () => {
      alive = false;
    };
  }, []);

  const toSend = (text ?? input).trim();

  async function ask() {
    if (!toSend) {
      setError('Please write a sentence or a question first.');
      return;
    }
    setBusy(true);
    setError('');
    setReply('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, text: toSend, context, level: state.prefs.level }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'The tutor could not answer right now. Please try again.');
      setReply(String(data.reply ?? ''));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The tutor could not answer right now. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (configured === null) return compact ? null : <p className="text-ink-mute">Checking whether the AI tutor is available...</p>;

  if (!configured) {
    if (compact) return null;
    return (
      <div className="card p-6">
        <h2 className="text-xl font-extrabold">The AI tutor is not switched on</h2>
        <p className="mt-2 text-ink-soft">
          This website does not have an AI service connected, so there is no AI tutor here. Everything else in SpeakBright
          still works: speaking practice, reading, conversations, grammar and the journal all give
          friendly feedback without AI.
        </p>
        <p className="mt-2 text-sm text-ink-mute">
          If you run this website yourself, the README explains how to add an optional AI key on the server.
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? 'rounded-3xl border-2 border-sky-200 bg-sky-50 p-4' : 'card p-6'}>
      {!compact && (
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <Sparkles size={22} className="text-lav-600" aria-hidden /> Ask your English tutor
        </h2>
      )}
      {text === undefined && (
        <label className="mt-3 block">
          <span className="mb-1.5 block text-sm font-bold text-ink-soft">
            Write a sentence to improve, or ask how to say something in English
          </span>
          <textarea className="field" rows={4} value={input} onChange={(e) => setInput(e.target.value)} placeholder='For example: "How can I politely ask my teacher to repeat?"' />
        </label>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary btn-sm" onClick={ask} disabled={busy}>
          <Send size={16} aria-hidden /> {busy ? 'Thinking...' : buttonLabel}
        </button>
        <p className="text-xs text-ink-mute">
          The text is sent to an AI service only when you press this button.
        </p>
      </div>
      {error && (
        <p role="alert" className="mt-3 rounded-2xl bg-coral-50 p-3 text-sm font-semibold">
          {error}
        </p>
      )}
      {reply && (
        <div role="status" className="animate-fade-up mt-4 rounded-2xl bg-white p-4">
          <p className="text-xs font-extrabold uppercase tracking-wide text-sky-700">AI tutor reply</p>
          <p className="mt-1 whitespace-pre-wrap text-ink">{reply}</p>
        </div>
      )}
    </div>
  );
}
