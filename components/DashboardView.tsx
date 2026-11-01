'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Flame, MessageCircle, Mic, PenLine, Sparkles, Type } from 'lucide-react';
import { currentStreak, lastSevenDays, todayCount, totals, useAppState, useMounted, weekDaysPracticed, type ActivityType } from '@/lib/storage';
import ProgressCard from './ProgressCard';

const LEVEL_NAME = { beginner: 'Beginner', intermediate: 'Intermediate', confident: 'Confident Speaker' } as const;

const ACTIVITIES = [
  { key: 'speaking', href: '/speaking', title: 'Speaking practice', text: 'Answer a friendly question out loud.', icon: Mic },
  { key: 'reading', href: '/reading', title: 'Reading fluency', text: 'Read a short passage aloud.', icon: BookOpen },
  { key: 'conversations', href: '/conversations', title: 'Everyday conversation', text: 'Practise a real-life situation.', icon: MessageCircle },
  { key: 'grammar', href: '/grammar-practice', title: 'Grammar through speaking', text: 'Fix a sentence and say your own.', icon: Type },
  { key: 'journal', href: '/journal', title: 'English journal', text: 'Write a few sentences about your day.', icon: PenLine },
] as const;

const TYPE_LABEL: Record<ActivityType, string> = {
  speaking: 'Speaking',
  reading: 'Reading',
  conversation: 'Conversation',
  grammar: 'Grammar',
  journal: 'Journal',
};

export function WeekBars({ compact = false }: { compact?: boolean }) {
  const mounted = useMounted();
  const [state] = useAppState();
  if (!mounted) return <div className={compact ? 'h-24' : 'h-36'} aria-hidden />;
  const days = lastSevenDays(state);
  const max = Math.max(1, ...days.map((d) => d.count));
  return (
    <ul className={`flex items-end justify-between gap-2 ${compact ? 'h-24' : 'h-36'}`} aria-label="Activities in the last seven days">
      {days.map((d) => (
        <li key={d.key} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
          <span className="text-xs font-bold text-ink-mute">{d.count > 0 ? d.count : ''}</span>
          <span
            className={`w-full max-w-10 rounded-t-xl ${d.count > 0 ? (d.isToday ? 'bg-lav-600' : 'bg-lav-300') : 'bg-lav-100'}`}
            style={{ height: `${d.count > 0 ? Math.max(14, (d.count / max) * 100) : 6}%` }}
            title={`${d.label}: ${d.count} ${d.count === 1 ? 'activity' : 'activities'}`}
          />
          <span className={`text-xs font-bold ${d.isToday ? 'text-lav-700' : 'text-ink-mute'}`}>{d.label}</span>
        </li>
      ))}
    </ul>
  );
}

export default function DashboardView() {
  const [state] = useAppState();
  const mounted = useMounted();
  const t = totals(state);
  const goal = state.prefs.dailyGoal;
  const done = todayCount(state);
  const streak = mounted ? currentStreak(state) : 0;

  // Recommend the activity the student has practised least so far (gentle variety).
  const counts: Record<string, number> = {
    speaking: t.speaking,
    reading: t.reading,
    conversations: t.conversations,
    grammar: t.grammar,
    journal: t.journal,
  };
  const rec = [...ACTIVITIES].sort((a, b) => counts[a.key] - counts[b.key])[0];
  const RecIcon = rec.icon;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <section className="card flex flex-wrap items-center justify-between gap-5 bg-gradient-to-br from-lav-50 to-sky-50 p-6 sm:p-8">
        <div className="max-w-xl">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Welcome back! 💙</h2>
          <p className="mt-2 text-lg text-ink-soft">
            {total === 0 ? 'Your first practice is just one click away. There is no pressure. Start with something small.' : 'Every small practice helps your confidence grow. Shall we continue?'}
          </p>
          <p className="mt-2 text-sm font-bold text-lav-700">Your level: {LEVEL_NAME[state.prefs.level]} (you can change it in Settings)</p>
        </div>
        <Link href={`${rec.href}`} className="btn btn-primary">
          Continue Practising <ArrowRight size={18} aria-hidden />
        </Link>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <ProgressCard label="Today's goal" value={`${Math.min(done, goal)} / ${goal}`} hint={done >= goal ? 'Goal reached! 🌟' : 'activities today'} icon={<Sparkles size={24} />} tone="mint" />
        <ProgressCard label="Practice days" value={t.days} hint="in total" icon={<PenLine size={24} />} tone="sky" />
        <ProgressCard label="Days in a row" value={streak} hint={streak > 0 ? 'Keep it going!' : 'Start any time'} icon={<Flame size={24} />} tone="coral" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6" aria-label="Recommended activity">
          <p className="eyebrow">Recommended for you</p>
          <div className="mt-3 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-lav-100 text-lav-700" aria-hidden>
              <RecIcon size={28} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold">{rec.title}</h3>
              <p className="text-ink-soft">{rec.text}</p>
              <Link href={rec.href} className="btn btn-soft btn-sm mt-3">
                Let&apos;s go <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <section className="card p-6" aria-label="This week">
          <div className="flex items-center justify-between">
            <p className="eyebrow">This week</p>
            <p className="text-sm font-bold text-ink-soft">{mounted ? `${weekDaysPracticed(state)} of 7 days` : ''}</p>
          </div>
          <div className="mt-4">
            <WeekBars compact />
          </div>
        </section>
      </div>

      <section className="card p-6" aria-label="Recently completed">
        <h2 className="text-xl font-extrabold">Recently completed</h2>
        {state.recent.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-lav-50 p-6 text-center">
            <p className="text-4xl" aria-hidden>🌱</p>
            <p className="mt-1 font-bold">Nothing here yet.</p>
            <p className="text-ink-soft">When you finish an activity, it will appear here.</p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-lav-100">
            {state.recent.slice(0, 6).map((r, i) => (
              <li key={i} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <span className="font-semibold">{r.label}</span>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">{TYPE_LABEL[r.type]}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
