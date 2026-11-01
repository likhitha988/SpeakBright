'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Eye, Lightbulb, XCircle } from 'lucide-react';
import { grammarTopics } from '@/data/grammar';
import type { GrammarTopic } from '@/data/types';
import { completeGrammar, useAppState } from '@/lib/storage';
import { checkOwnSentence, isCloseTo, matchesAnswer, type OwnSentenceResult } from '@/lib/feedback';
import ListenButton from './ListenButton';

export default function GrammarPractice() {
  const [state] = useAppState();
  const [openId, setOpenId] = useState<string | null>(null);
  const open = openId ? grammarTopics.find((t) => t.id === openId) : undefined;

  if (open) return <Topic key={open.id} topic={open} onBack={() => setOpenId(null)} />;

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-ink-soft">
        Short, friendly lessons. Read a simple idea, fix a sentence, then say or write your own. No long rules!
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {grammarTopics.map((t) => {
          const done = state.grammarDone.filter((k) => k.startsWith(t.id + ':')).length;
          const total = t.exercises.length + 1;
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setOpenId(t.id)}
                className="card flex h-full w-full flex-col p-5 text-left transition-all hover:-translate-y-1 hover:border-lav-300"
              >
                <span className="text-3xl" aria-hidden>{t.emoji}</span>
                <span className="mt-2 text-lg font-extrabold">{t.title}</span>
                <span className="mt-1 flex-1 text-sm text-ink-soft">{t.summary}</span>
                <span className="mt-3 text-xs font-bold text-ink-mute">
                  {done} of {total} activities done
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Topic({ topic, onBack }: { topic: GrammarTopic; onBack: () => void }) {
  const [state, update] = useAppState();
  const [ex, setEx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'right' | 'close' | 'wrong'>('idle');
  const [tries, setTries] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const [own, setOwn] = useState('');
  const [ownResult, setOwnResult] = useState<OwnSentenceResult | null>(null);
  const [showOwnExample, setShowOwnExample] = useState(false);

  const exercise = topic.exercises[ex];
  const doneKey = (i: number) => `${topic.id}:ex${i}`;
  const ownKey = `${topic.id}:own`;

  function check() {
    if (!answer.trim()) {
      setStatus('idle');
      return;
    }
    if (matchesAnswer(answer, exercise.answers)) {
      setStatus('right');
      update((s) => completeGrammar(s, doneKey(ex), `${topic.title}: exercise ${ex + 1}`));
    } else {
      setTries((t) => t + 1);
      setStatus(isCloseTo(answer, exercise.answers) ? 'close' : 'wrong');
    }
  }

  function goTo(i: number) {
    setEx(i);
    setAnswer('');
    setStatus('idle');
    setTries(0);
    setShowAnswer(false);
  }

  function checkOwn() {
    const r = checkOwnSentence(own, topic.checkWords);
    setOwnResult(r);
    if (r.ok) update((s) => completeGrammar(s, ownKey, `${topic.title}: my own sentence`));
  }

  return (
    <div className="space-y-6">
      <button type="button" className="btn btn-outline btn-sm" onClick={onBack}>
        <ArrowLeft size={16} aria-hidden /> All grammar topics
      </button>

      {/* 1. Explain */}
      <section className="card p-5 sm:p-8">
        <h2 className="text-2xl font-extrabold">
          <span aria-hidden>{topic.emoji}</span> {topic.title}
        </h2>
        <p className="eyebrow mt-5">1. The idea</p>
        <p className="mt-1 text-lg text-ink-soft">{topic.explanation}</p>

        <p className="eyebrow mt-6">Examples to say aloud</p>
        <ul className="mt-2 space-y-2">
          {topic.examples.map((e) => (
            <li key={e.sentence} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-mint-50 p-3">
              <span>
                <span className="font-bold">{e.sentence}</span>
                {e.note && <span className="block text-sm text-ink-mute">{e.note}</span>}
              </span>
              <ListenButton text={e.sentence} iconOnly label={`Listen: ${e.sentence}`} />
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Common mistakes */}
      <section className="card p-5 sm:p-8">
        <p className="eyebrow">2. Common mistakes (everyone makes them!)</p>
        <ul className="mt-3 space-y-3">
          {topic.mistakes.map((m) => (
            <li key={m.wrong} className="rounded-2xl bg-lav-50 p-4">
              <p className="flex items-start gap-2 text-ink-soft">
                <XCircle size={20} className="mt-0.5 shrink-0 text-coral-500" aria-hidden />
                <span>
                  <span className="sr-only">Not correct: </span>
                  <span className="line-through decoration-coral-400">{m.wrong}</span>
                </span>
              </p>
              <p className="mt-1 flex items-start gap-2 font-bold">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-mint-600" aria-hidden />
                <span>
                  <span className="sr-only">Correct: </span>
                  {m.right}
                </span>
              </p>
              <p className="mt-1 pl-7 text-sm text-ink-soft">{m.why}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Correct the sentence */}
      <section className="card p-5 sm:p-8" aria-label="Correct the sentence">
        <p className="eyebrow">3. Fix the sentence</p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Exercises">
          {topic.exercises.map((_, i) => (
            <button key={i} type="button" className="chip" aria-pressed={ex === i} onClick={() => goTo(i)}>
              {state.grammarDone.includes(doneKey(i)) ? '✅' : '✏️'} Sentence {i + 1}
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm font-bold text-ink-mute">This sentence has one small mistake:</p>
        <p className="mt-1 rounded-2xl bg-coral-50 p-4 text-xl font-bold">{exercise.wrong}</p>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-bold text-ink-soft">Write the correct sentence</span>
          <input
            type="text"
            className="field"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setStatus('idle');
            }}
            onKeyDown={(e) => e.key === 'Enter' && check()}
            placeholder="Type the corrected sentence..."
            autoComplete="off"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={check}>
            Check
          </button>
          <button type="button" className="btn btn-soft" onClick={() => setShowAnswer((v) => !v)} aria-expanded={showAnswer}>
            <Eye size={18} aria-hidden /> {showAnswer ? 'Hide answer' : 'Show answer'}
          </button>
        </div>

        {status === 'right' && (
          <div role="status" className="animate-fade-up mt-4 rounded-2xl bg-mint-50 p-4">
            <p className="font-extrabold">Correct! Well done! 🌟</p>
            <p className="text-ink-soft">{exercise.explanation}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <ListenButton text={exercise.answers[0]} label="Say it with me" />
              {ex + 1 < topic.exercises.length && (
                <button type="button" className="btn btn-primary btn-sm" onClick={() => goTo(ex + 1)}>
                  Next sentence
                </button>
              )}
            </div>
          </div>
        )}
        {status === 'close' && (
          <p role="status" className="animate-fade-up mt-4 rounded-2xl bg-sky-50 p-4 font-semibold">
            Almost there! 😊 You are very close. Check the small mistake once more.
            {tries >= 2 && <span className="mt-1 block font-normal text-ink-soft">Hint: {exercise.explanation}</span>}
          </p>
        )}
        {status === 'wrong' && (
          <p role="status" className="animate-fade-up mt-4 rounded-2xl bg-sky-50 p-4 font-semibold">
            Good try! Look at the sentence again and find the one word to change.
            {tries >= 2 && <span className="mt-1 block font-normal text-ink-soft"><Lightbulb size={16} className="mr-1 inline text-coral-500" aria-hidden />Hint: {exercise.explanation}</span>}
          </p>
        )}
        {showAnswer && (
          <div className="animate-fade-up mt-4 rounded-2xl bg-lav-50 p-4">
            <p className="text-sm font-bold text-lav-700">A correct sentence</p>
            <p className="text-lg font-bold">{exercise.answers[0]}</p>
            <p className="mt-1 text-sm text-ink-soft">{exercise.explanation}</p>
          </div>
        )}
      </section>

      {/* 4. Own sentence */}
      <section className="card p-5 sm:p-8" aria-label="Make your own sentence">
        <p className="eyebrow">4. Your turn</p>
        <p className="mt-1 text-lg font-bold">{topic.createPrompt}</p>
        <p className="text-sm text-ink-mute">Say it aloud first, then type it here.</p>
        <textarea
          className="field mt-3"
          rows={2}
          value={own}
          onChange={(e) => {
            setOwn(e.target.value);
            setOwnResult(null);
          }}
          placeholder="Type your sentence..."
          aria-label="Your own sentence"
        />
        <div className="mt-3 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={checkOwn}>
            Check my sentence
          </button>
          <button type="button" className="btn btn-soft" onClick={() => setShowOwnExample((v) => !v)} aria-expanded={showOwnExample}>
            <Eye size={18} aria-hidden /> {showOwnExample ? 'Hide example' : 'See an example'}
          </button>
        </div>
        {ownResult && (
          <div role="status" className="animate-fade-up mt-4 rounded-2xl bg-mint-50 p-4">
            <p className="font-semibold">{ownResult.message}</p>
            {ownResult.improved && (
              <p className="mt-1 flex flex-wrap items-center gap-2 text-lg font-bold text-lav-800">
                &ldquo;{ownResult.improved}&rdquo; <ListenButton text={ownResult.improved} label="Hear it" />
              </p>
            )}
            {ownResult.tips.map((t) => (
              <p key={t} className="mt-1 text-sm text-ink-soft">{t}</p>
            ))}
          </div>
        )}
        {showOwnExample && (
          <div className="animate-fade-up mt-4 rounded-2xl bg-sky-50 p-4">
            <p className="text-sm font-bold text-sky-700">An example</p>
            <p className="text-lg">&ldquo;{topic.createExample}&rdquo;</p>
            <div className="mt-2">
              <ListenButton text={topic.createExample} label="Listen" />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
