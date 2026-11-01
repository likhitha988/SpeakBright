'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Eye, Flag, HelpCircle, Repeat, RotateCcw, Volume2 } from 'lucide-react';
import { conversationScenarios } from '@/data/conversations';
import type { ConversationScenario, Level } from '@/data/types';
import { completeConversation, useAppState } from '@/lib/storage';
import { conversationSummary, countWords, type ConversationSummary } from '@/lib/feedback';
import VoiceInput from './VoiceInput';
import ListenButton from './ListenButton';
import Celebration from './Celebration';
import { speakText, stopSpeaking, ttsSupported } from '@/lib/speech';

const LEVEL_LABEL: Record<Level, string> = { beginner: 'Beginner', intermediate: 'Intermediate', confident: 'Confident Speaker' };
const LEVEL_FILTERS: { id: Level | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'confident', label: 'Confident Speaker' },
];

export default function ConversationPractice() {
  const [state] = useAppState();
  const [filter, setFilter] = useState<Level | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const open = openId ? conversationScenarios.find((c) => c.id === openId) : undefined;

  if (open) return <Session key={open.id} scenario={open} onExit={() => setOpenId(null)} />;

  const list = conversationScenarios.filter((c) => filter === 'all' || c.level === filter);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by level">
        {LEVEL_FILTERS.map((l) => (
          <button key={l.id} type="button" className="chip" aria-pressed={filter === l.id} onClick={() => setFilter(l.id)}>
            {l.label}
          </button>
        ))}
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => {
          const done = state.conversationsCompleted.includes(c.id);
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setOpenId(c.id)}
                className="card flex h-full w-full flex-col p-5 text-left transition-all hover:-translate-y-1 hover:border-lav-300"
              >
                <span className="flex items-center justify-between">
                  <span className="text-3xl" aria-hidden>{c.emoji}</span>
                  {done && (
                    <span className="flex items-center gap-1 text-xs font-bold text-mint-700">
                      <CheckCircle2 size={16} aria-hidden /> Completed
                    </span>
                  )}
                </span>
                <span className="mt-2 text-lg font-extrabold">{c.title}</span>
                <span className="mt-1 flex-1 text-sm text-ink-soft">{c.situation}</span>
                <span className="mt-3 w-fit rounded-full bg-lav-100 px-3 py-1 text-xs font-bold text-lav-800">{LEVEL_LABEL[c.level]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type Bubble = { who: 'partner' | 'you'; text: string };

function Session({ scenario, onExit }: { scenario: ConversationScenario; onExit: () => void }) {
  const [, update] = useAppState();
  const total = scenario.steps.length;
  const [step, setStep] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([{ who: 'partner', text: scenario.steps[0].partner }]);
  const [replies, setReplies] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState<ConversationSummary | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const current = scenario.steps[Math.min(step, total - 1)];
  const finished = summary !== null;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [bubbles.length, summary]);

  useEffect(() => () => stopSpeaking(), []);

  function finish(allReplies: string[], lastBubbles: Bubble[]) {
    const sum = conversationSummary(allReplies, total);
    setBubbles([...lastBubbles, { who: 'partner', text: scenario.closing }]);
    setSummary(sum);
    if (allReplies.filter((r) => countWords(r) > 0).length >= total) {
      update((s) => completeConversation(s, scenario.id, scenario.title));
    }
  }

  function next() {
    const text = answer.trim();
    if (countWords(text) < 2) {
      setMessage('Try saying a few words first. You can use a hint or a sentence starter. You can do it! 😊');
      return;
    }
    setMessage('');
    const newReplies = [...replies, text];
    const newBubbles: Bubble[] = [...bubbles, { who: 'you', text }];
    setReplies(newReplies);
    setAnswer('');
    setResetKey((k) => k + 1);
    setShowHint(false);
    setShowExample(false);
    if (step + 1 >= total) {
      finish(newReplies, newBubbles);
    } else {
      setStep(step + 1);
      setBubbles([...newBubbles, { who: 'partner', text: scenario.steps[step + 1].partner }]);
    }
  }

  function finishEarly() {
    const text = answer.trim();
    const all = countWords(text) >= 2 ? [...replies, text] : replies;
    const b = countWords(text) >= 2 ? [...bubbles, { who: 'you' as const, text }] : bubbles;
    setReplies(all);
    finish(all, b);
  }

  function repeatMyAnswer() {
    const text = answer.trim();
    if (!text) {
      setMessage('Say or type your answer first. Then I can read it back to you.');
      return;
    }
    setMessage('');
    if (!ttsSupported()) {
      setMessage('Your browser cannot read text aloud, but you can read your answer aloud yourself.');
      return;
    }
    speakText(text);
  }

  function tryAnother() {
    setAnswer('');
    setMessage('');
    setResetKey((k) => k + 1);
  }

  function restart() {
    stopSpeaking();
    setStep(0);
    setBubbles([{ who: 'partner', text: scenario.steps[0].partner }]);
    setReplies([]);
    setAnswer('');
    setSummary(null);
    setShowHint(false);
    setShowExample(false);
    setMessage('');
    setResetKey((k) => k + 1);
  }

  return (
    <div className="space-y-6">
      <button type="button" className="btn btn-outline btn-sm" onClick={() => { stopSpeaking(); onExit(); }}>
        ← All conversations
      </button>

      <section className="card p-5 sm:p-6">
        <h2 className="text-2xl font-extrabold">
          <span aria-hidden>{scenario.emoji}</span> {scenario.title}
        </h2>
        <p className="mt-2 text-ink-soft">{scenario.situation}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
          <span className="rounded-full bg-lav-100 px-3 py-1 text-lav-800">{scenario.yourRole}</span>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">{scenario.partnerRole}</span>
          <span className="rounded-full bg-mint-100 px-3 py-1 text-mint-700">
            {finished ? 'Finished' : `Step ${step + 1} of ${total}`}
          </span>
        </div>
      </section>

      {/* Chat */}
      <section aria-label="Conversation" aria-live="polite" className="card space-y-3 p-4 sm:p-6">
        {bubbles.map((b, i) => (
          <div key={i} className={`flex ${b.who === 'you' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[88%] rounded-3xl px-4 py-3 sm:max-w-[75%] ${
                b.who === 'you' ? 'rounded-br-lg bg-lav-600 text-white' : 'rounded-bl-lg bg-sky-100 text-ink'
              }`}
            >
              <p className={`text-xs font-extrabold uppercase tracking-wide ${b.who === 'you' ? 'text-lav-100' : 'text-sky-700'}`}>
                {b.who === 'you' ? 'You' : scenario.partnerRole.replace(/^Partner:\s*/i, '')}
              </p>
              <p className="mt-0.5 text-lg">{b.text}</p>
              {b.who === 'partner' && (
                <div className="mt-1">
                  <ListenButton text={b.text} iconOnly label="Listen to this line" />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </section>

      {!finished ? (
        <section className="card p-5 sm:p-6" aria-label="Your reply">
          <h3 className="text-lg font-extrabold">Your turn</h3>
          <p className="text-ink-soft">Speak or type your reply.</p>

          <div className="mt-4">
            <VoiceInput value={answer} onChange={setAnswer} resetKey={resetKey} compact rows={3} label="Your reply" placeholder="Say or type your reply here..." />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {current.starters.map((s) => (
              <button key={s} type="button" className="chip" onClick={() => setAnswer((a) => (a.trim() ? a : s.replace(/\.\.\.\??$/, '').trim() + ' '))}>
                {s}
              </button>
            ))}
          </div>

          {message && (
            <p role="status" className="mt-4 rounded-2xl bg-sky-50 p-3 text-sm font-semibold text-sky-700">
              {message}
            </p>
          )}

          {showHint && (
            <div className="animate-fade-up mt-4 rounded-2xl bg-mint-50 p-4">
              <p className="text-sm font-bold text-mint-700">Hint</p>
              <p>{current.hint}</p>
            </div>
          )}
          {showExample && (
            <div className="animate-fade-up mt-4 rounded-2xl bg-sky-50 p-4">
              <p className="text-sm font-bold text-sky-700">An example reply</p>
              <p className="text-lg">&ldquo;{current.example}&rdquo;</p>
              <div className="mt-2">
                <ListenButton text={current.example} label="Listen to the example" />
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="btn btn-soft" onClick={() => setShowHint((v) => !v)} aria-expanded={showHint}>
              <HelpCircle size={18} aria-hidden /> Give Me a Hint
            </button>
            <button type="button" className="btn btn-soft" onClick={() => setShowExample((v) => !v)} aria-expanded={showExample}>
              <Eye size={18} aria-hidden /> Show an Example
            </button>
            <button type="button" className="btn btn-outline" onClick={tryAnother}>
              <RotateCcw size={18} aria-hidden /> Try Another Response
            </button>
            <button type="button" className="btn btn-outline" onClick={repeatMyAnswer}>
              <Repeat size={18} aria-hidden /> Repeat My Answer
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-lav-100 pt-5">
            <button type="button" className="btn btn-outline btn-sm" onClick={finishEarly}>
              <Flag size={16} aria-hidden /> Finish Conversation
            </button>
            <button type="button" className="btn btn-primary" onClick={next}>
              {step + 1 >= total ? 'Send and finish' : 'Next Step'} <ArrowRight size={18} aria-hidden />
            </button>
          </div>
        </section>
      ) : (
        summary && (
          <div className="space-y-4">
            {replies.length >= total ? (
              <Celebration title={summary.headline}>
                <ul className="mx-auto mt-2 max-w-md space-y-1 text-left">
                  {summary.praise.map((p) => (
                    <li key={p} className="flex gap-2">
                      <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-mint-600" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </Celebration>
            ) : (
              <section className="rounded-3xl border-2 border-lav-200 bg-lav-50 p-6">
                <h3 className="text-xl font-extrabold">{summary.headline}</h3>
                <ul className="mt-2 space-y-1">
                  {summary.praise.map((p) => (
                    <li key={p} className="flex gap-2 text-ink-soft">
                      <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-mint-600" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {summary.polish.length > 0 && (
              <section className="card p-5 sm:p-6">
                <h3 className="text-lg font-extrabold">Smoother ways to say it</h3>
                <ul className="mt-3 space-y-3">
                  {summary.polish.map((p) => (
                    <li key={p.original} className="rounded-2xl bg-lav-50 p-4">
                      <p className="text-sm text-ink-mute">You said: &ldquo;{p.original}&rdquo;</p>
                      <p className="mt-1 flex flex-wrap items-center gap-2 font-bold text-lav-800">
                        <Volume2 size={16} aria-hidden className="text-lav-600" /> &ldquo;{p.better}&rdquo;
                        <ListenButton text={p.better} label="Hear it" />
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <p className="font-semibold">{summary.next}</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary" onClick={restart}>
                <RotateCcw size={18} aria-hidden /> Practise this again
              </button>
              <button type="button" className="btn btn-outline" onClick={onExit}>
                Choose another conversation
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
