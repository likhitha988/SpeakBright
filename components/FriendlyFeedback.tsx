'use client';

import { CheckCircle2, Lightbulb } from 'lucide-react';
import type { Feedback } from '@/lib/feedback';
import ListenButton from './ListenButton';

export default function FriendlyFeedback({ feedback }: { feedback: Feedback }) {
  const tone =
    feedback.tone === 'great'
      ? 'border-mint-200 bg-mint-50'
      : feedback.tone === 'retry'
        ? 'border-sky-200 bg-sky-50'
        : 'border-lav-200 bg-lav-50';
  return (
    <section aria-live="polite" className={`animate-fade-up rounded-3xl border-2 p-5 sm:p-6 ${tone}`}>
      <h3 className="text-xl font-extrabold">{feedback.headline}</h3>

      {feedback.good.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {feedback.good.map((g) => (
            <li key={g} className="flex gap-2 text-ink-soft">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-mint-600" aria-hidden />
              <span>{g}</span>
            </li>
          ))}
        </ul>
      )}

      {feedback.improve.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {feedback.improve.map((g) => (
            <li key={g} className="flex gap-2 text-ink-soft">
              <Lightbulb size={20} className="mt-0.5 shrink-0 text-coral-500" aria-hidden />
              <span>{g}</span>
            </li>
          ))}
        </ul>
      )}

      {feedback.improved && (
        <div className="mt-4 rounded-2xl bg-white p-4">
          <p className="text-sm font-bold text-ink-mute">A more natural way to say it:</p>
          <p className="mt-1 text-lg font-bold text-lav-800">&ldquo;{feedback.improved}&rdquo;</p>
          <div className="mt-2">
            <ListenButton text={feedback.improved} label="Hear it" />
          </div>
        </div>
      )}

      <p className="mt-4 font-semibold">{feedback.next}</p>
    </section>
  );
}
