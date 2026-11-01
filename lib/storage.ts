// SpeakBright storage: everything is saved in the browser (localStorage).
// No accounts, no servers, no audio recordings.
//
// The app state lives in one small JSON object. React components read it with
// useAppState() and change it with updateState(). Every read is defensive, so
// missing / corrupted / blocked storage never crashes the website.

import { useSyncExternalStore } from 'react';
import type { Level } from '@/data/types';

export const STORAGE_KEY = 'speakbright:v1';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface Prefs {
  level: Level;
  dailyGoal: number; // activities per day
  textSize: number; // reading text size in px
  sound: boolean; // text-to-speech on/off
  reducedMotion: boolean;
}

export interface SpeakingAttempt {
  id: string;
  ts: number;
  promptId: string;
  question: string;
  transcript: string; // text only, never audio
}

export interface JournalEntry {
  id: string;
  created: number;
  updated: number;
  prompt: string;
  text: string;
}

export type ActivityType = 'speaking' | 'reading' | 'conversation' | 'grammar' | 'journal';

export interface RecentItem {
  type: ActivityType;
  label: string;
  ts: number;
}

export interface AppState {
  v: 1;
  prefs: Prefs;
  days: Record<string, number>; // "2026-11-01" -> activities done that day
  speakingAttempts: SpeakingAttempt[];
  readingCompleted: string[];
  conversationsCompleted: string[];
  grammarDone: string[]; // keys like "simple-present:ex0"
  journal: JournalEntry[];
  recent: RecentItem[];
}

/* ------------------------------------------------------------------ */
/* Defaults and safe loading                                           */
/* ------------------------------------------------------------------ */

export function defaultState(): AppState {
  return {
    v: 1,
    prefs: { level: 'beginner', dailyGoal: 3, textSize: 22, sound: true, reducedMotion: false },
    days: {},
    speakingAttempts: [],
    readingCompleted: [],
    conversationsCompleted: [],
    grammarDone: [],
    journal: [],
    recent: [],
  };
}

const DEFAULT_STATE: AppState = defaultState();

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}
function strArr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}
function clampNum(v: unknown, min: number, max: number, fallback: number): number {
  return typeof v === 'number' && isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : fallback;
}

function sanitize(raw: unknown): AppState {
  const d = defaultState();
  if (!isObj(raw)) return d;
  const p = isObj(raw.prefs) ? raw.prefs : {};
  const levels = ['beginner', 'intermediate', 'confident'];

  const days: Record<string, number> = {};
  if (isObj(raw.days)) {
    for (const [k, v] of Object.entries(raw.days)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(k) && typeof v === 'number' && v > 0) days[k] = Math.round(v);
    }
  }

  const speakingAttempts = (Array.isArray(raw.speakingAttempts) ? raw.speakingAttempts : [])
    .filter(isObj)
    .map((a) => ({
      id: String(a.id ?? ''),
      ts: typeof a.ts === 'number' ? a.ts : 0,
      promptId: String(a.promptId ?? ''),
      question: String(a.question ?? ''),
      transcript: String(a.transcript ?? ''),
    }))
    .slice(0, 100);

  const journal = (Array.isArray(raw.journal) ? raw.journal : [])
    .filter(isObj)
    .map((j) => ({
      id: String(j.id ?? ''),
      created: typeof j.created === 'number' ? j.created : 0,
      updated: typeof j.updated === 'number' ? j.updated : 0,
      prompt: String(j.prompt ?? ''),
      text: String(j.text ?? ''),
    }))
    .filter((j) => j.id && j.text);

  const types: ActivityType[] = ['speaking', 'reading', 'conversation', 'grammar', 'journal'];
  const recent = (Array.isArray(raw.recent) ? raw.recent : [])
    .filter(isObj)
    .filter((r) => types.includes(r.type as ActivityType))
    .map((r) => ({ type: r.type as ActivityType, label: String(r.label ?? ''), ts: typeof r.ts === 'number' ? r.ts : 0 }))
    .slice(0, 30);

  return {
    v: 1,
    prefs: {
      level: levels.includes(p.level as string) ? (p.level as Level) : d.prefs.level,
      dailyGoal: clampNum(p.dailyGoal, 1, 10, d.prefs.dailyGoal),
      textSize: clampNum(p.textSize, 16, 36, d.prefs.textSize),
      sound: typeof p.sound === 'boolean' ? p.sound : d.prefs.sound,
      reducedMotion: typeof p.reducedMotion === 'boolean' ? p.reducedMotion : d.prefs.reducedMotion,
    },
    days,
    speakingAttempts,
    readingCompleted: strArr(raw.readingCompleted),
    conversationsCompleted: strArr(raw.conversationsCompleted),
    grammarDone: strArr(raw.grammarDone),
    journal,
    recent,
  };
}

/* ------------------------------------------------------------------ */
/* The tiny store                                                      */
/* ------------------------------------------------------------------ */

let cache: AppState | null = null;
let storageOk = true;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function load(): AppState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const text = window.localStorage.getItem(STORAGE_KEY);
    storageOk = true;
    if (!text) return defaultState();
    return sanitize(JSON.parse(text));
  } catch {
    // Blocked storage or broken JSON: start fresh but keep the app working.
    try {
      window.localStorage.getItem('x');
    } catch {
      storageOk = false;
    }
    return defaultState();
  }
}

function persist(s: AppState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    storageOk = true;
  } catch {
    storageOk = false;
  }
}

export function getState(): AppState {
  if (!cache) cache = load();
  return cache;
}

export function updateState(fn: (s: AppState) => AppState) {
  const next = fn(getState());
  cache = next;
  persist(next);
  emit();
}

export function resetProgress() {
  // Keep the student's preferences (level, goal, text size...) but clear learning progress.
  updateState((s) => ({ ...defaultState(), prefs: s.prefs }));
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      cache = load();
      cb();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

/** Read the saved state in a component. Returns [state, updateState]. */
export function useAppState(): [AppState, typeof updateState] {
  const s = useSyncExternalStore(subscribe, getState, () => DEFAULT_STATE);
  return [s, updateState];
}

/** false if the browser blocks localStorage (private mode, strict settings...). */
export function useStorageOk(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => {
      getState();
      return storageOk;
    },
    () => true,
  );
}

const noopSubscribe = () => () => {};
/** false while the page is being server-rendered / hydrated, true afterwards. */
export function useMounted(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/* ------------------------------------------------------------------ */
/* Dates, streaks and weekly summary                                   */
/* ------------------------------------------------------------------ */

export function dateKey(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function todayCount(s: AppState): number {
  return s.days[dateKey()] ?? 0;
}

export function practiceDays(s: AppState): number {
  return Object.values(s.days).filter((n) => n > 0).length;
}

/** Days in a row, counting back from today (or yesterday if today has not started yet). */
export function currentStreak(s: AppState): number {
  const d = new Date();
  if (!(s.days[dateKey(d)] > 0)) d.setDate(d.getDate() - 1);
  let n = 0;
  while (s.days[dateKey(d)] > 0) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export interface DayBar {
  key: string;
  label: string;
  count: number;
  isToday: boolean;
}

/** The last 7 days, oldest first. Only call after mount (it depends on the clock). */
export function lastSevenDays(s: AppState): DayBar[] {
  const out: DayBar[] = [];
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    out.push({ key, label: names[d.getDay()], count: s.days[key] ?? 0, isToday: i === 0 });
  }
  return out;
}

export function weekDaysPracticed(s: AppState): number {
  return lastSevenDays(s).filter((d) => d.count > 0).length;
}

/* ------------------------------------------------------------------ */
/* State changes (pure functions used with updateState)                */
/* ------------------------------------------------------------------ */

function uniq(list: string[], add: string): string[] {
  return list.includes(add) ? list : [...list, add];
}

export function logActivity(s: AppState, type: ActivityType, label: string): AppState {
  const key = dateKey();
  return {
    ...s,
    days: { ...s.days, [key]: (s.days[key] ?? 0) + 1 },
    recent: [{ type, label, ts: Date.now() }, ...s.recent].slice(0, 30),
  };
}

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function addSpeakingAttempt(
  s: AppState,
  promptId: string,
  question: string,
  transcript: string,
): AppState {
  const attempt: SpeakingAttempt = { id: newId(), ts: Date.now(), promptId, question, transcript };
  const next = { ...s, speakingAttempts: [attempt, ...s.speakingAttempts].slice(0, 100) };
  return logActivity(next, 'speaking', question);
}

export function setReadingCompleted(s: AppState, id: string, title: string, done: boolean): AppState {
  if (!done) return { ...s, readingCompleted: s.readingCompleted.filter((x) => x !== id) };
  if (s.readingCompleted.includes(id)) return s;
  return logActivity({ ...s, readingCompleted: [...s.readingCompleted, id] }, 'reading', title);
}

export function completeConversation(s: AppState, id: string, title: string): AppState {
  const firstTime = !s.conversationsCompleted.includes(id);
  const next = { ...s, conversationsCompleted: uniq(s.conversationsCompleted, id) };
  return logActivity(next, 'conversation', firstTime ? title : `${title} (again)`);
}

export function completeGrammar(s: AppState, key: string, label: string): AppState {
  if (s.grammarDone.includes(key)) return s;
  return logActivity({ ...s, grammarDone: [...s.grammarDone, key] }, 'grammar', label);
}

export function saveJournal(s: AppState, entry: { id?: string; prompt: string; text: string }): AppState {
  const now = Date.now();
  if (entry.id && s.journal.some((j) => j.id === entry.id)) {
    return {
      ...s,
      journal: s.journal.map((j) => (j.id === entry.id ? { ...j, prompt: entry.prompt, text: entry.text, updated: now } : j)),
    };
  }
  const created: JournalEntry = { id: newId(), created: now, updated: now, prompt: entry.prompt, text: entry.text };
  return logActivity({ ...s, journal: [created, ...s.journal] }, 'journal', 'Journal entry');
}

export function deleteJournal(s: AppState, id: string): AppState {
  return { ...s, journal: s.journal.filter((j) => j.id !== id) };
}

export function setPrefs(s: AppState, patch: Partial<Prefs>): AppState {
  return { ...s, prefs: { ...s.prefs, ...patch } };
}

/* ------------------------------------------------------------------ */
/* Handy totals for the Progress and Dashboard pages                   */
/* ------------------------------------------------------------------ */

export function totals(s: AppState) {
  return {
    speaking: s.speakingAttempts.length,
    reading: s.readingCompleted.length,
    conversations: s.conversationsCompleted.length,
    grammar: s.grammarDone.length,
    journal: s.journal.length,
    days: practiceDays(s),
  };
}
