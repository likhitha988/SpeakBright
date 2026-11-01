'use client';

import { useState } from 'react';
import { Pencil, Save, Trash2 } from 'lucide-react';
import { deleteJournal, saveJournal, useAppState, type JournalEntry } from '@/lib/storage';
import { journalSuggestions, type JournalSuggestion } from '@/lib/feedback';
import AiTutorBox from './AiTutorBox';
import ConfirmDialog from './ConfirmDialog';
import ListenButton from './ListenButton';

const PROMPTS = [
  'What did you learn today?',
  'What made you happy today?',
  'What did you do today?',
  'What would you like to improve tomorrow?',
  'What is something you are proud of?',
];

function Suggestions({ items }: { items: JournalSuggestion[] }) {
  if (items.length === 0) {
    return (
      <p role="status" className="rounded-2xl bg-mint-50 p-4 font-semibold">
        Lovely writing! 🌟 I did not find anything to change. Your original text stays exactly as you wrote it.
      </p>
    );
  }
  return (
    <div role="status" className="space-y-3 rounded-2xl bg-sky-50 p-4">
      <p className="font-extrabold">Ideas to make it smoother (your own writing is not changed)</p>
      <ul className="space-y-3">
        {items.map((s) => (
          <li key={s.original} className="rounded-2xl bg-white p-3">
            <p className="text-sm text-ink-mute">You wrote: &ldquo;{s.original}&rdquo;</p>
            <p className="mt-1 flex flex-wrap items-center gap-2 font-bold text-lav-800">
              Try: &ldquo;{s.suggestion}&rdquo; <ListenButton text={s.suggestion} label="Hear it" />
            </p>
            {s.tips.map((t) => (
              <p key={t} className="text-sm text-ink-soft">{t}</p>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function JournalView() {
  const [state, update] = useAppState();
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState('');
  const [suggest, setSuggest] = useState<JournalSuggestion[] | null>(null);
  const [openSuggest, setOpenSuggest] = useState<Record<string, boolean>>({});
  const [toDelete, setToDelete] = useState<JournalEntry | null>(null);

  function save() {
    const clean = text.trim();
    if (!clean) {
      setSaved('Write a few words first. Even one sentence is a great start! 😊');
      return;
    }
    update((s) => saveJournal(s, { id: editingId ?? undefined, prompt, text: clean }));
    setSaved(editingId ? 'Your entry was updated. ✅' : 'Your entry was saved on this device. ✅');
    setText('');
    setEditingId(null);
    setSuggest(null);
  }

  function edit(e: JournalEntry) {
    setEditingId(e.id);
    setPrompt(e.prompt || PROMPTS[0]);
    setText(e.text);
    setSuggest(null);
    setSaved('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="space-y-8">
      <section className="card p-5 sm:p-8" aria-label="Write in your journal">
        <p className="eyebrow">{editingId ? 'Editing an entry' : 'Today'}</p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Writing prompts">
          {PROMPTS.map((p) => (
            <button key={p} type="button" className="chip" aria-pressed={prompt === p} onClick={() => setPrompt(p)}>
              {p}
            </button>
          ))}
        </div>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-lg font-bold">{prompt}</span>
          <textarea
            className="field"
            rows={6}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setSuggest(null);
              setSaved('');
            }}
            placeholder="Write a few sentences in English. Mistakes are okay. This is just for you."
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={save}>
            <Save size={18} aria-hidden /> {editingId ? 'Update entry' : 'Save entry'}
          </button>
          <button type="button" className="btn btn-soft" onClick={() => setSuggest(text.trim() ? journalSuggestions(text) : [])}>
            Check my writing
          </button>
          {editingId && (
            <button type="button" className="btn btn-outline" onClick={() => { setEditingId(null); setText(''); setSuggest(null); }}>
              Cancel editing
            </button>
          )}
        </div>
        {saved && <p role="status" className="mt-4 rounded-2xl bg-mint-50 p-3 font-semibold">{saved}</p>}
        {suggest && text.trim() && <div className="mt-4"><Suggestions items={suggest} /></div>}
        {text.trim() && (
          <div className="mt-4">
            <AiTutorBox mode="journal" text={text} context={prompt} compact buttonLabel="Ask the AI tutor to review this entry" />
          </div>
        )}
        <p className="mt-4 text-sm text-ink-mute">Your journal stays private in this browser. It is never sent anywhere unless you press an AI button.</p>
      </section>

      <section aria-label="Previous entries">
        <h2 className="mb-4 text-xl font-extrabold">My entries</h2>
        {state.journal.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-5xl" aria-hidden>📓</p>
            <p className="mt-2 text-lg font-bold">Your journal is empty.</p>
            <p className="text-ink-soft">Pick a prompt above and write your first sentences.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {state.journal.map((e) => (
              <li key={e.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-ink-mute">
                    {new Date(e.created).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    {e.updated > e.created + 1000 ? ' (edited)' : ''}
                  </p>
                  <p className="rounded-full bg-lav-100 px-3 py-1 text-xs font-bold text-lav-800">{e.prompt}</p>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-lg">{e.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="btn btn-soft btn-sm" onClick={() => edit(e)}>
                    <Pencil size={15} aria-hidden /> Edit
                  </button>
                  <button type="button" className="btn btn-soft btn-sm" aria-expanded={!!openSuggest[e.id]} onClick={() => setOpenSuggest((o) => ({ ...o, [e.id]: !o[e.id] }))}>
                    {openSuggest[e.id] ? 'Hide suggestions' : 'Show suggestions'}
                  </button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setToDelete(e)}>
                    <Trash2 size={15} aria-hidden /> Delete
                  </button>
                </div>
                {openSuggest[e.id] && <div className="mt-3"><Suggestions items={journalSuggestions(e.text)} /></div>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this entry?"
        message="This journal entry will be removed from this browser. This cannot be undone."
        confirmLabel="Yes, delete"
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) update((s) => deleteJournal(s, toDelete.id));
          setToDelete(null);
        }}
      />
    </div>
  );
}
