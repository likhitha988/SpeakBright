'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, CalendarDays, CheckSquare, Flame, MessageCircle, Mic, PenLine } from 'lucide-react';
import { currentStreak, resetProgress, totals, useAppState, useMounted, weekDaysPracticed } from '@/lib/storage';
import ProgressCard from './ProgressCard';
import ConfirmDialog from './ConfirmDialog';
import { WeekBars } from './DashboardView';

export default function ProgressView() {
  const [state] = useAppState();
  const mounted = useMounted();
  const t = totals(state);
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const week = mounted ? weekDaysPracticed(state) : 0;
  const streak = mounted ? currentStreak(state) : 0;
  const nothingYet = t.days === 0;

  let message: string;
  if (nothingYet) message = 'Your progress will appear here. Every practice counts, even a small one. Ready when you are! 💙';
  else if (week >= 5) message = `You practised English on ${week} days this week. Wonderful consistency! Keep going!`;
  else if (week >= 1) message = `You practised English on ${week} ${week === 1 ? 'day' : 'days'} this week. Great effort! Keep going!`;
  else message = 'Welcome back! A new week is a fresh start. One small activity is enough to begin. 💙';

  return (
    <div className="space-y-8">
      <section className="card bg-gradient-to-br from-mint-50 to-sky-50 p-6 sm:p-8" aria-live="polite">
        <p className="text-2xl font-extrabold sm:text-3xl">{message}</p>
        {streak > 1 && <p className="mt-2 font-bold text-lav-700">🔥 {streak} days in a row</p>}
        {nothingYet && (
          <Link href="/speaking" className="btn btn-primary mt-4">
            Start with Speaking
          </Link>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ProgressCard label="Speaking sessions" value={t.speaking} icon={<Mic size={24} />} tone="lav" />
        <ProgressCard label="Reading passages completed" value={t.reading} icon={<BookOpen size={24} />} tone="sky" />
        <ProgressCard label="Conversations completed" value={t.conversations} icon={<MessageCircle size={24} />} tone="mint" />
        <ProgressCard label="Grammar exercises completed" value={t.grammar} icon={<CheckSquare size={24} />} tone="lav" />
        <ProgressCard label="Practice days" value={t.days} icon={<CalendarDays size={24} />} tone="mint" />
        <ProgressCard label="Journal entries" value={t.journal} icon={<PenLine size={24} />} tone="coral" />
        <ProgressCard label="Days in a row" value={streak} hint="Missing a day is okay" icon={<Flame size={24} />} tone="lav" />
      </div>

      <section className="card p-6" aria-label="Weekly practice">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Your week</h2>
          <p className="text-sm font-bold text-ink-soft">{mounted ? `${week} of 7 days` : ''}</p>
        </div>
        <div className="mt-5">
          <WeekBars />
        </div>
      </section>

      <section className="card p-6" aria-label="About your saved progress">
        <h2 className="text-xl font-extrabold">Where is my progress saved?</h2>
        <p className="mt-2 text-ink-soft">
          Your progress is saved <strong>only in this browser on this device</strong>. There are no accounts, so nothing is
          sent to a server and it does not automatically move to another phone, computer or browser. If you clear your
          browser data, your progress will be cleared too.
        </p>
        <p className="mt-3 text-sm text-ink-mute">SpeakBright never records or stores your voice. Only text such as your answers and journal is saved.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/journal" className="btn btn-soft">
            Open my English Journal
          </Link>
          <button type="button" className="btn btn-outline" onClick={() => { setDone(false); setConfirm(true); }}>
            Reset Progress
          </button>
        </div>
        {done && (
          <p role="status" className="mt-4 rounded-2xl bg-mint-50 p-3 font-semibold">
            Your progress was reset. A fresh start is a good start! 🌱
          </p>
        )}
      </section>

      <ConfirmDialog
        open={confirm}
        title="Reset all progress?"
        message="This clears your practice history, saved words, journal entries and completed activities in this browser. Your settings will stay. This cannot be undone."
        confirmLabel="Yes, reset progress"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          resetProgress();
          setConfirm(false);
          setDone(true);
        }}
      />
    </div>
  );
}
