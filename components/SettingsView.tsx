'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { Level } from '@/data/types';
import { resetProgress, setPrefs, useAppState } from '@/lib/storage';
import ConfirmDialog from './ConfirmDialog';

const LEVELS: { id: Level; title: string; text: string }[] = [
  { id: 'beginner', title: 'Beginner', text: 'You know a few English words but find it hard to make sentences.' },
  { id: 'intermediate', title: 'Intermediate', text: 'You can speak basic English and want smoother, more fluent sentences.' },
  { id: 'confident', title: 'Confident Speaker', text: 'You want to share ideas clearly and join discussions naturally.' },
];

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-lav-50 p-4">
      <div>
        <p className="font-bold">{label}</p>
        <p className="text-sm text-ink-soft">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${checked ? 'bg-mint-500' : 'bg-lav-300'}`}
      >
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${checked ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}

export default function SettingsView() {
  const [state, update] = useAppState();
  const p = state.prefs;
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div className="space-y-6">
      <section className="card p-6" aria-labelledby="level-h">
        <h2 id="level-h" className="text-xl font-extrabold">Your learning level</h2>
        <p className="text-ink-soft">You can change this any time. No account needed.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3" role="radiogroup" aria-labelledby="level-h">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              role="radio"
              aria-checked={p.level === l.id}
              onClick={() => update((s) => setPrefs(s, { level: l.id }))}
              className={`rounded-2xl border-2 p-4 text-left transition-colors ${p.level === l.id ? 'border-lav-600 bg-lav-600 text-white' : 'border-lav-100 bg-white hover:border-lav-300'}`}
            >
              <span className="block text-lg font-extrabold">{l.title}</span>
              <span className={`text-sm ${p.level === l.id ? 'text-lav-100' : 'text-ink-soft'}`}>{l.text}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card space-y-5 p-6" aria-labelledby="prefs-h">
        <h2 id="prefs-h" className="text-xl font-extrabold">Your practice</h2>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-lav-50 p-4">
          <div>
            <p className="font-bold">Daily practice goal</p>
            <p className="text-sm text-ink-soft">How many activities would you like to do each day?</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="btn btn-outline btn-sm" aria-label="Fewer activities" disabled={p.dailyGoal <= 1} onClick={() => update((s) => setPrefs(s, { dailyGoal: s.prefs.dailyGoal - 1 }))}>
              <Minus size={16} aria-hidden />
            </button>
            <span className="min-w-8 text-center text-2xl font-extrabold" aria-live="polite">{p.dailyGoal}</span>
            <button type="button" className="btn btn-outline btn-sm" aria-label="More activities" disabled={p.dailyGoal >= 10} onClick={() => update((s) => setPrefs(s, { dailyGoal: s.prefs.dailyGoal + 1 }))}>
              <Plus size={16} aria-hidden />
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-lav-50 p-4">
          <label htmlFor="text-size" className="font-bold">Reading text size: {p.textSize}px</label>
          <input
            id="text-size"
            type="range"
            min={16}
            max={36}
            step={2}
            value={p.textSize}
            onChange={(e) => update((s) => setPrefs(s, { textSize: Number(e.target.value) }))}
            className="mt-2 w-full accent-lav-600"
          />
          <p className="reading-text mt-2 rounded-xl bg-white p-3" style={{ fontSize: `${p.textSize}px` }}>
            Every confident speaker starts with a single sentence.
          </p>
        </div>

        <Toggle label="Sound" description="Lets the Listen buttons read English aloud. Turn it off for a quiet practice." checked={p.sound} onChange={(v) => update((s) => setPrefs(s, { sound: v }))} />
        <Toggle label="Reduce motion" description="Turns off animations such as floating shapes and confetti." checked={p.reducedMotion} onChange={(v) => update((s) => setPrefs(s, { reducedMotion: v }))} />
      </section>

      <section className="card p-6" aria-labelledby="data-h">
        <h2 id="data-h" className="text-xl font-extrabold">Your data and privacy</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-soft">
          <li>There are no accounts. You never need to log in or sign up.</li>
          <li>Your progress, saved words, settings and journal are saved <strong>in this browser only</strong>.</li>
          <li>Progress does <strong>not</strong> automatically move to another device or browser. If you clear your browser data, it is cleared too.</li>
          <li>Your voice is never recorded or stored. Only the text of your answers can be saved.</li>
          <li>There are no analytics or tracking scripts.</li>
          <li>If the optional AI tutor is switched on, text you choose to send for feedback is sent to the AI service only when you press its button.</li>
        </ul>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-coral" onClick={() => { setDone(false); setConfirm(true); }}>
            Reset learning progress
          </button>
          <Link href="/tutor" className="btn btn-soft">About the optional English tutor</Link>
        </div>
        {done && <p role="status" className="mt-4 rounded-2xl bg-mint-50 p-3 font-semibold">Your progress was reset. Your settings were kept. 🌱</p>}
      </section>

      <ConfirmDialog
        open={confirm}
        title="Reset all learning progress?"
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
