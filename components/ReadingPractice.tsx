'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, Check, CheckCircle2, Clock, Eye, EyeOff, Mic, Minus, Plus, RotateCcw, Square } from 'lucide-react';
import { readingPassages } from '@/data/reading-passages';
import type { ReadingLevel, ReadingPassage } from '@/data/types';
import { setPrefs, setReadingCompleted, useAppState } from '@/lib/storage';
import { readingFeedback, readingMinutes, type ReadingResult } from '@/lib/feedback';
import { useSpeechRecognition } from '@/lib/useSpeechRecognition';
import { UNSUPPORTED_MESSAGE } from '@/lib/speech';
import ListenButton from './ListenButton';

const LEVELS: { id: ReadingLevel; label: string; hint: string }[] = [
  { id: 'beginner', label: 'Beginner', hint: 'Short and simple' },
  { id: 'intermediate', label: 'Intermediate', hint: 'A little longer' },
  { id: 'advanced', label: 'Advanced', hint: 'Richer language' },
];

export default function ReadingPractice() {
  const [state] = useAppState();
  const mapped: ReadingLevel = state.prefs.level === 'confident' ? 'advanced' : state.prefs.level;
  const [levelChoice, setLevelChoice] = useState<ReadingLevel | null>(null);
  const level = levelChoice ?? mapped;
  const [openId, setOpenId] = useState<string | null>(null);

  const passages = useMemo(() => readingPassages.filter((p) => p.level === level), [level]);
  const open = openId ? readingPassages.find((p) => p.id === openId) : undefined;

  if (open) {
    return <Reader key={open.id} passage={open} onBack={() => setOpenId(null)} />;
  }

  return (
    <div className="space-y-8">
      <section className="card p-5 sm:p-6" aria-label="Reading level">
        <p className="eyebrow mb-3">Choose a level (you can change it any time)</p>
        <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Reading levels">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={level === l.id}
              onClick={() => setLevelChoice(l.id)}
              className={`rounded-2xl border-2 p-4 text-left transition-colors ${
                level === l.id ? 'border-lav-600 bg-lav-600 text-white' : 'border-lav-100 bg-white hover:border-lav-300'
              }`}
            >
              <span className="block text-lg font-extrabold">{l.label}</span>
              <span className={`text-sm ${level === l.id ? 'text-lav-100' : 'text-ink-mute'}`}>{l.hint}</span>
            </button>
          ))}
        </div>
      </section>

      <section aria-label="Passages">
        <h2 className="mb-4 text-xl font-extrabold">Pick a passage to read</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {passages.map((p) => {
            const done = state.readingCompleted.includes(p.id);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(p.id)}
                  className="card flex h-full w-full flex-col p-5 text-left transition-all hover:-translate-y-1 hover:border-lav-300"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">{p.topic}</span>
                    {done && (
                      <span className="flex items-center gap-1 text-xs font-bold text-mint-700">
                        <CheckCircle2 size={16} aria-hidden /> Completed
                      </span>
                    )}
                  </span>
                  <span className="mt-3 text-lg font-extrabold">{p.title}</span>
                  <span className="mt-1 flex-1 text-sm text-ink-soft">{p.intro}</span>
                  <span className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-ink-mute">
                    <Clock size={15} aria-hidden /> About {readingMinutes(p.paragraphs)} min
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Reader({ passage, onBack }: { passage: ReadingPassage; onBack: () => void }) {
  const [state, update] = useAppState();
  const [slow, setSlow] = useState(false);
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [showVocab, setShowVocab] = useState(true);

  const done = state.readingCompleted.includes(passage.id);
  const size = state.prefs.textSize;
  const fullText = passage.paragraphs.join(' ');

  const rec = useSpeechRecognition({
    continuous: true,
    onFinished: (heard) => setResult(readingFeedback(passage.paragraphs, heard)),
  });

  function readAgain() {
    rec.reset();
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleComplete() {
    update((s) => setReadingCompleted(s, passage.id, passage.title, !done));
  }

  const changeSize = (delta: number) =>
    update((s) => setPrefs(s, { textSize: Math.min(36, Math.max(16, s.prefs.textSize + delta)) }));

  return (
    <div className="space-y-6">
      <button type="button" className="btn btn-outline btn-sm" onClick={onBack}>
        <ArrowLeft size={16} aria-hidden /> Choose Another Passage
      </button>

      <article className="card p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
          <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">{passage.topic}</span>
          <span className="flex items-center gap-1 text-ink-mute">
            <Clock size={15} aria-hidden /> About {readingMinutes(passage.paragraphs)} min
          </span>
          {done && (
            <span className="flex items-center gap-1 text-mint-700">
              <CheckCircle2 size={16} aria-hidden /> Completed
            </span>
          )}
        </div>
        <h2 className="mt-3 text-3xl font-extrabold">{passage.title}</h2>
        <p className="mt-1 text-ink-soft">{passage.intro}</p>

        {/* Text size */}
        <div className="mt-5 flex flex-wrap items-center gap-3" role="group" aria-label="Text size">
          <span className="text-sm font-bold text-ink-soft">Text size</span>
          <button type="button" className="btn btn-soft btn-sm" onClick={() => changeSize(-2)} aria-label="Make text smaller" disabled={size <= 16}>
            <Minus size={16} aria-hidden /> A
          </button>
          <span className="min-w-12 text-center text-sm font-bold text-ink-mute" aria-live="polite">
            {size}px
          </span>
          <button type="button" className="btn btn-soft btn-sm" onClick={() => changeSize(2)} aria-label="Make text bigger" disabled={size >= 36}>
            <Plus size={16} aria-hidden /> A
          </button>
        </div>

        {/* The passage */}
        <div className="reading-text mt-6 space-y-5 rounded-3xl bg-cream p-5 sm:p-8" style={{ fontSize: `${size}px` }}>
          {passage.paragraphs.map((para, p) => (
            <p key={p}>
              {para
                .split(/\s+/)
                .filter(Boolean)
                .map((tok, i) => (
                  <span key={i}>
                    {result?.missedFlags[p]?.[i] ? <span className="needs-practice">{tok}</span> : tok}{' '}
                  </span>
                ))}
            </p>
          ))}
        </div>
        {result && result.missedWords.length > 0 && (
          <p className="mt-3 text-sm text-ink-mute">
            Words with a <span className="needs-practice">pink underline</span> may need another try. They may also just be
            words the microphone missed.
          </p>
        )}

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ListenButton text={fullText} label="Listen to Passage" stopLabel="Stop Listening" size="md" variant="primary" rate={slow ? 0.75 : 0.95} />
          <button type="button" className="chip" aria-pressed={slow} onClick={() => setSlow((v) => !v)}>
            🐢 Slow voice
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {rec.listening ? (
            <button type="button" className="btn btn-coral" onClick={rec.stop}>
              <Square size={18} aria-hidden /> Stop Reading
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-mint"
              onClick={() => {
                setResult(null);
                rec.start();
              }}
              disabled={rec.supported !== true}
            >
              <Mic size={18} aria-hidden /> Start Reading
            </button>
          )}
          <button type="button" className="btn btn-outline" onClick={readAgain}>
            <RotateCcw size={18} aria-hidden /> Read Again
          </button>
          <button type="button" className={`btn ${done ? 'btn-soft' : 'btn-primary'}`} onClick={toggleComplete} aria-pressed={done}>
            <Check size={18} aria-hidden /> {done ? 'Completed (tap to undo)' : 'Mark as Completed'}
          </button>
        </div>

        {rec.supported === false && (
          <p role="status" className="mt-4 rounded-2xl bg-sky-50 p-4 text-sm font-semibold text-sky-700">
            {UNSUPPORTED_MESSAGE} Read the passage aloud on your own, then press &ldquo;Mark as Completed&rdquo;.
          </p>
        )}
        {rec.error && (
          <p role="alert" className="mt-4 rounded-2xl bg-coral-50 p-4 text-sm font-semibold">
            {rec.error}
          </p>
        )}
        {rec.listening && (
          <div role="status" className="mt-4 rounded-2xl bg-mint-50 p-4">
            <p className="font-bold text-mint-700">Listening... read the passage aloud at your own pace.</p>
            <p className="mt-1 text-sm text-ink-soft">{(rec.finalText + ' ' + rec.interim).trim() || '...'}</p>
          </div>
        )}
      </article>

      {/* Reading feedback */}
      {result && (
        <section aria-live="polite" className="animate-fade-up rounded-3xl border-2 border-lav-200 bg-lav-50 p-5 sm:p-6">
          <h3 className="text-xl font-extrabold">{result.headline}</h3>
          <p className="mt-2 text-ink-soft">{result.message}</p>
          <ul className="mt-3 space-y-1 text-ink-soft">
            <li>
              <strong>Passage completed:</strong> {result.completed ? 'Yes, well done!' : 'Not yet. Try once more, no pressure.'}
            </li>
            {result.totalWords > 0 && (
              <li>
                <strong>Approximate result:</strong> about {Math.round(result.coverage * 100)}% of the words were recognised.
              </li>
            )}
            {result.missedWords.length > 0 && (
              <li>
                <strong>Words to try again:</strong> {result.missedWords.join(', ')}
              </li>
            )}
          </ul>
          <p className="mt-3 font-semibold">{result.suggestion}</p>
          {result.completed && !done && (
            <button type="button" className="btn btn-primary mt-4" onClick={toggleComplete}>
              <Check size={18} aria-hidden /> Mark as Completed
            </button>
          )}
          <p className="mt-4 rounded-2xl bg-white p-3 text-sm text-ink-mute">
            This is only an approximate check. Results can change because of accents, background noise, microphone
            quality and your browser. It is not a pronunciation test.
          </p>
        </section>
      )}

      {/* Vocabulary */}
      <section className="card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-extrabold">Useful words in this passage</h3>
          <button type="button" className="btn btn-soft btn-sm" onClick={() => setShowVocab((v) => !v)} aria-expanded={showVocab}>
            {showVocab ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />} {showVocab ? 'Hide' : 'Show'}
          </button>
        </div>
        {showVocab && (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {passage.vocabulary.map((v) => (
              <li key={v.word} className="rounded-2xl bg-lav-50 p-4">
                <p className="flex items-center justify-between gap-2 font-extrabold text-lav-800">
                  {v.word}
                  <ListenButton text={v.word} iconOnly label={`Listen to ${v.word}`} />
                </p>
                <p className="text-ink-soft">{v.meaning}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Comprehension */}
      <section className="card p-5 sm:p-6">
        <h3 className="text-xl font-extrabold">Think and speak</h3>
        <p className="text-ink-soft">Answer each question aloud in your own words. Then check a sample answer.</p>
        <ol className="mt-4 space-y-4">
          {passage.questions.map((q, i) => (
            <li key={i} className="rounded-2xl bg-sky-50 p-4">
              <p className="font-bold">
                {i + 1}. {q.question}
              </p>
              <button type="button" className="btn btn-soft btn-sm mt-2" onClick={() => setRevealed((r) => ({ ...r, [i]: !r[i] }))} aria-expanded={!!revealed[i]}>
                {revealed[i] ? 'Hide sample answer' : 'Show a sample answer'}
              </button>
              {revealed[i] && <p className="animate-fade-up mt-2 text-ink-soft">{q.answer}</p>}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
