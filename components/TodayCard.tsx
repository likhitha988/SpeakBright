'use client';

import Link from 'next/link';
import { Target } from 'lucide-react';
import { todayCount, useAppState } from '@/lib/storage';

export default function TodayCard() {
  const [state] = useAppState();
  const goal = state.prefs.dailyGoal;
  const done = todayCount(state);
  const pct = Math.min(100, Math.round((done / goal) * 100));
  const reached = done >= goal;

  return (
    <section className="card mx-auto max-w-3xl p-6 sm:p-7" aria-label="Today's practice">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-100 text-mint-700" aria-hidden>
            <Target size={28} />
          </div>
          <div>
            <p className="eyebrow">Today&apos;s practice</p>
            <p className="text-xl font-extrabold">
              {done} of {goal} {goal === 1 ? 'activity' : 'activities'} done
            </p>
            <p className="text-sm text-ink-soft">
              {reached ? 'You reached your goal today. Lovely work! 🌟' : done > 0 ? 'Nice start! A little more and you are there.' : 'Your goal for today is a small, friendly step.'}
            </p>
          </div>
        </div>
        <Link href="/dashboard" className="btn btn-primary">
          Continue Practising
        </Link>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-lav-100" role="progressbar" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(done, goal)} aria-label="Today's goal">
        <div className="h-full rounded-full bg-mint-400 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </section>
  );
}
