'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Eye, EyeOff, RotateCcw, ChevronLeft } from 'lucide-react';
import { speakingCategories, speakingPrompts } from '@/data/speaking-prompts';
import type { Level } from '@/data/types';
import { addSpeakingAttempt, useAppState } from '@/lib/storage';
import { speakingFeedback, countWords, type Feedback } from '@/lib/feedback';
import VoiceInput from './VoiceInput';
import FriendlyFeedback from './FriendlyFeedback';
import ListenButton from './ListenButton';
import AiTutorBox from './AiTutorBox';

const LEVELS: { id: Level | 'all'; label: string }[] = [
  { id: 'all', label: 'All levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'confident', label: 'Confident Speaker' },
];

export default function SpeakingPractice() {
  const [state, update] = useAppState();
  const [categoryId, setCategoryId] = useState<string>('all');
  const [levelChoice, setLevelChoice] = useState<Level | 'all' | null>(null); // null = use my level
  const [index, setIndex] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [checkedText, setCheckedText] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [noticed, setNoticed] = useState('');

  const level = levelChoice ?? state.prefs.level;

  const list = useMemo(
    () =>
      speakingPrompts.filter(
        (p) => (categoryId === 'all' || p.category === categoryId) && (level === 'all' || p.level === level),
      ),
    [categoryId, level],
  );
  const safeIndex = list.length ? Math.min(index, list.length - 1) : 0;
  const prompt = list[safeIndex];
  const category = prompt ? speakingCategories.find((c) => c.id === prompt.category) : undefined;

  function resetAttempt() {
    setAnswer('');
    setFeedback(null);
    setCheckedText('');
    setNoticed('');
    setResetKey((k) => k + 1);
  }

  function go(delta: number) {
    if (!list.length) return;
    setIndex((safeIndex + delta + list.length) % list.length);
    setShowExample(false);
    resetAttempt();
  }

  function check(text: string) {
    if (!prompt) return;
    const clean = text.trim();
    if (!clean) {
      setNoticed('Speak or type a few words first, then I can help. You can do it! 😊');
      return;
    }
    setNoticed('');
    const fb = speakingFeedback(clean, prompt, level === 'all' ? prompt.level : level);
    setFeedback(fb);
    setCheckedText(clean);
    // Saved as TEXT only (never audio). Only real attempts of 3+ words count as a speaking session.
    if (countWords(clean) >= 3) update((s) => addSpeakingAttempt(s, prompt.id, prompt.question, clean));
  }

  function markPractised() {
    if (!prompt) return;
    update((s) => addSpeakingAttempt(s, prompt.id, prompt.question, '(practised aloud)'));
    setFeedback({
      tone: 'good',
      headline: 'Well done for practising aloud! 🌟',
      good: ['Saying your answer out loud is the best way to grow confident.'],
      improve: [],
      next: 'Open "Show an Example" to compare ideas, then try once more or move to the next question.',
    });
    setCheckedText('(practised aloud)');
  }

  function selectCategory(id: string) {
    setCategoryId(id);
    setIndex(0);
    setShowExample(false);
    resetAttempt();
  }
  function selectLevel(id: Level | 'all') {
    setLevelChoice(id);
    setIndex(0);
    setShowExample(false);
    resetAttempt();
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <section aria-label="Choose a topic and level" className="card p-5 sm:p-6">
        <p className="eyebrow mb-3">Choose a topic</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Speaking topics">
          <button type="button" className="chip" aria-pressed={categoryId === 'all'} onClick={() => selectCategory('all')}>
            ✨ All topics
          </button>
          {speakingCategories.map((c) => (
            <button key={c.id} type="button" className="chip" aria-pressed={categoryId === c.id} onClick={() => selectCategory(c.id)}>
              <span aria-hidden>{c.emoji}</span> {c.title}
            </button>
          ))}
        </div>
        <p className="eyebrow mb-3 mt-5">Choose a level</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Speaking level">
          {LEVELS.map((l) => (
            <button key={l.id} type="button" className="chip" aria-pressed={level === l.id} onClick={() => selectLevel(l.id)}>
              {l.label}
            </button>
          ))}
        </div>
      </section>

      {!prompt ? (
        <div className="card p-8 text-center">
          <p className="text-4xl" aria-hidden>🔍</p>
          <p className="mt-2 text-lg font-bold">No questions here yet.</p>
          <p className="text-ink-soft">Try another topic or level.</p>
          <button type="button" className="btn btn-primary mt-4" onClick={() => { selectCategory('all'); selectLevel('all'); }}>
            Show all questions
          </button>
        </div>
      ) : (
        <section aria-label="Speaking practice" className="card p-5 sm:p-8">
          <div className="flex items-center justify-between gap-3 text-sm font-bold text-ink-mute">
            <span>
              {category?.emoji} {category?.title}
            </span>
            <span>
              Question {safeIndex + 1} of {list.length}
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-extrabold leading-snug sm:text-3xl" aria-live="polite">
            {prompt.question}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ListenButton text={prompt.question} label="Hear the question" />
            <span className="text-sm text-ink-mute">Need help starting?</span>
            {prompt.starters.map((s) => (
              <button
                key={s}
                type="button"
                className="chip"
                onClick={() => setAnswer((a) => (a.trim() ? a : s.replace(/\.\.\.$/, '').trim() + ' '))}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <VoiceInput
              value={answer}
              onChange={setAnswer}
              onFinished={(t) => check(t)}
              continuous
              resetKey={resetKey}
              placeholder="Your words will appear here as you speak. You can also type your answer."
            />
          </div>

          {noticed && (
            <p role="status" className="mt-4 rounded-2xl bg-sky-50 p-3 text-sm font-semibold text-sky-700">
              {noticed}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-mint" onClick={() => check(answer)}>
              Check my answer
            </button>
            <button type="button" className="btn btn-outline" onClick={resetAttempt}>
              <RotateCcw size={18} aria-hidden /> Try Again
            </button>
            <button type="button" className="btn btn-soft" onClick={() => setShowExample((v) => !v)} aria-expanded={showExample}>
              {showExample ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
              {showExample ? 'Hide Example' : 'Show an Example'}
            </button>
            <button type="button" className="btn btn-outline" onClick={markPractised}>
              I practised aloud ✓
            </button>
          </div>

          {showExample && (
            <div className="animate-fade-up mt-5 rounded-3xl border-2 border-sky-200 bg-sky-50 p-5">
              <p className="text-sm font-bold text-sky-700">An example answer (yours can be different!)</p>
              <p className="mt-1 text-lg">&ldquo;{prompt.example}&rdquo;</p>
              <div className="mt-3">
                <ListenButton text={prompt.example} label="Listen to the example" />
              </div>
            </div>
          )}

          {feedback && (
            <div className="mt-6 space-y-4">
              <FriendlyFeedback feedback={feedback} />
              {checkedText && checkedText !== '(practised aloud)' && (
                <AiTutorBox mode="feedback" text={checkedText} context={prompt.question} compact buttonLabel="Get extra help from the AI tutor" />
              )}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-lav-100 pt-5">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => go(-1)}>
              <ChevronLeft size={18} aria-hidden /> Previous
            </button>
            <button type="button" className="btn btn-primary" onClick={() => go(1)}>
              Next Question <ArrowRight size={18} aria-hidden />
            </button>
          </div>
        </section>
      )}

      <p className="rounded-2xl bg-lav-50 p-4 text-sm text-ink-soft">
        <strong>Good to know:</strong> Speech recognition is a helper, not a judge. It can miss words because of accents,
        background noise or the microphone, so please do not worry about it. Your answers are saved as text only on this
        device. Audio is never recorded or stored.
      </p>

      <p className="text-center text-ink-soft">
        Want to practise sentences too?{' '}
        <Link href="/grammar-practice" className="font-bold text-lav-700 underline">
          Try Grammar Through Speaking
        </Link>
      </p>
    </div>
  );
}
