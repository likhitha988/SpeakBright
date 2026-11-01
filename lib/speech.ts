// Browser speech helpers.
// - Text-to-speech uses window.speechSynthesis.
// - Speech recognition uses the Web Speech API (SpeechRecognition / webkitSpeechRecognition).
// Both are optional: every function here is safe to call when the browser does not support it.

/* ---------------- Speech recognition (microphone) ---------------- */

export interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onresult: ((e: any) => void) | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onerror: ((e: any) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

export type RecognitionCtor = new () => RecognitionLike;

export function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return (w.SpeechRecognition || w.webkitSpeechRecognition || null) as RecognitionCtor | null;
}

export const UNSUPPORTED_MESSAGE =
  "Your browser does not support automatic speech recognition for this activity. That's okay! You can still practise by reading the question aloud.";

export function friendlyRecognitionError(code: string): string {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'The microphone is blocked. Please allow microphone access in your browser (look for the lock or microphone icon near the address bar), then try again. You can also type your answer.';
    case 'no-speech':
      return "I did not hear anything that time. That's okay! Move a little closer to the microphone and try again.";
    case 'audio-capture':
      return 'I could not find a microphone. Please check that one is connected, or type your answer instead.';
    case 'network':
      return 'Speech recognition needs an internet connection in this browser. You can still type your answer.';
    case 'language-not-supported':
      return 'This browser could not use English speech recognition. You can type your answer instead.';
    default:
      return 'Something went wrong with the microphone. Please try again, or type your answer.';
  }
}

/* ---------------- Text-to-speech (listen) ---------------- */

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (!ttsSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const prefer = ['en-IN', 'en-GB', 'en-US', 'en'];
  for (const p of prefer) {
    const v = voices.find((x) => x.lang.replace('_', '-').toLowerCase().startsWith(p.toLowerCase()));
    if (v) return v;
  }
  return null;
}

/** Split long text into sentence-sized chunks (long utterances stop early in some browsers). */
export function splitForSpeech(text: string): string[] {
  const parts = text.replace(/\s+/g, ' ').trim().match(/[^.!?]+[.!?]*/g) ?? [];
  const chunks: string[] = [];
  let buf = '';
  for (const p of parts) {
    const piece = p.trim();
    if (!piece) continue;
    if ((buf + ' ' + piece).length > 160 && buf) {
      chunks.push(buf);
      buf = piece;
    } else {
      buf = buf ? buf + ' ' + piece : piece;
    }
  }
  if (buf) chunks.push(buf);
  return chunks;
}

let activeToken = 0;
let activeEnd: (() => void) | null = null;

export function stopSpeaking() {
  activeToken++;
  if (activeEnd) {
    const e = activeEnd;
    activeEnd = null;
    e();
  }
  if (ttsSupported()) window.speechSynthesis.cancel();
}

/** Read text aloud. onEnd runs when finished OR when stopped. Returns false if not supported. */
export function speakText(text: string, opts: { rate?: number; onEnd?: () => void } = {}): boolean {
  if (!ttsSupported() || !text.trim()) return false;
  stopSpeaking();
  const token = ++activeToken;
  const chunks = splitForSpeech(text);
  let i = 0;
  const finish = () => {
    if (activeEnd === finish) activeEnd = null;
    opts.onEnd?.();
  };
  activeEnd = finish;

  const next = () => {
    if (token !== activeToken) return;
    if (i >= chunks.length) {
      finish();
      return;
    }
    const u = new SpeechSynthesisUtterance(chunks[i++]);
    u.rate = opts.rate ?? 0.95;
    u.lang = 'en-IN';
    const v = pickVoice();
    if (v) {
      u.voice = v;
      u.lang = v.lang;
    }
    u.onend = next;
    u.onerror = () => {
      if (token === activeToken) finish();
    };
    window.speechSynthesis.speak(u);
  };
  next();
  return true;
}
