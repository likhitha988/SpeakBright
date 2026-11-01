// Friendly, rule-based English feedback. No AI key needed.
//
// These rules catch a handful of very common learner patterns and always
// speak kindly. They are helpers, not an examiner: they never judge accents
// or claim to measure pronunciation.

import type { Level, SpeakingPrompt } from '@/data/types';

export interface Feedback {
  tone: 'great' | 'good' | 'retry';
  headline: string;
  good: string[];
  improve: string[];
  improved?: string; // a more natural version of what the student said
  next: string;
}

/* ------------------------------------------------------------------ */
/* Small text helpers                                                  */
/* ------------------------------------------------------------------ */

export function words(text: string): string[] {
  return (text.toLowerCase().replace(/[’‘]/g, "'").match(/[a-z]+(?:'[a-z]+)?/g) ?? []) as string[];
}

export function countWords(text: string): number {
  return words(text).length;
}

function cap(w: string): string {
  return w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w;
}

/** Lowercase, straight quotes, no end punctuation, single spaces. Used to compare sentences. */
export function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[.!?,;:"]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ------------------------------------------------------------------ */
/* Sentence fixing rules                                               */
/* ------------------------------------------------------------------ */

const PAST: Record<string, string> = {
  go: 'went', eat: 'ate', see: 'saw', come: 'came', do: 'did', have: 'had', meet: 'met', take: 'took',
  make: 'made', get: 'got', buy: 'bought', write: 'wrote', run: 'ran', give: 'gave', speak: 'spoke',
  say: 'said', tell: 'told', think: 'thought', feel: 'felt', leave: 'left', sit: 'sat', sleep: 'slept',
  drink: 'drank', know: 'knew',
};
const REGULAR_PAST = [
  'play', 'watch', 'walk', 'talk', 'visit', 'help', 'start', 'listen', 'cook', 'call', 'use', 'study',
  'work', 'stay', 'clean', 'want', 'need', 'like', 'love', 'enjoy', 'learn', 'wash', 'finish',
];
const AUX = new Set([
  'does', 'did', 'do', 'can', 'will', 'would', 'could', 'should', 'must', 'may', 'might', 'to', 'let',
  'make', 'makes', 'help', 'helps', 'not', "don't", "doesn't", "didn't", "can't", "won't",
]);

function addS(verb: string): string {
  if (verb === 'go') return 'goes';
  if (verb === 'do') return 'does';
  if (verb === 'have') return 'has';
  if (/[^aeiou]y$/.test(verb)) return verb.slice(0, -1) + 'ies';
  if (/(s|sh|ch|x|z|o)$/.test(verb)) return verb + 'es';
  return verb + 's';
}
function addEd(verb: string): string {
  if (verb.endsWith('e')) return verb + 'd';
  if (/[^aeiou]y$/.test(verb)) return verb.slice(0, -1) + 'ied';
  return verb + 'ed';
}
function addIng(verb: string): string {
  if (verb === 'study') return 'studying';
  if (verb === 'write') return 'writing';
  return verb + 'ing';
}

const THIRD_VERBS = [
  'go', 'do', 'have', 'like', 'play', 'want', 'live', 'work', 'study', 'come', 'eat', 'watch', 'wake',
  'get', 'make', 'take', 'love', 'enjoy', 'need', 'know', 'speak', 'help', 'visit', 'start', 'walk',
  'talk', 'listen', 'travel', 'cook', 'write', 'sing', 'dance', 'run', 'call', 'meet', 'use', 'try', 'stay',
];
const PAST_VERBS = [...Object.keys(PAST), ...REGULAR_PAST];
const ING_VERBS = ['study', 'play', 'go', 'work', 'read', 'watch', 'learn', 'eat', 'write', 'talk', 'walk', 'cook', 'listen'];

const BASE_FROM_WRONG: Record<string, string> = {
  goes: 'go', has: 'have', likes: 'like', plays: 'play', wants: 'want', knows: 'know', does: 'do',
  eats: 'eat', works: 'work', lives: 'live', comes: 'come', studies: 'study', went: 'go', ate: 'eat',
  came: 'come', saw: 'see', had: 'have', did: 'do', liked: 'like', played: 'play', watched: 'watch',
  wanted: 'want', got: 'get',
};

const AN_EXCEPTIONS = /^(uni|use|usu|uti|eur|one|once|ubi|uk\b)/i;
const A_EXCEPTIONS = /^(hour|honest|honou?r|heir)/i;

interface Rule {
  apply: (sentence: string) => { text: string; tip?: string } | null;
}

function regexRule(re: RegExp, to: string | ((...m: string[]) => string), tip: string): Rule {
  return {
    apply(sentence) {
      let changed = false;
      const text = sentence.replace(re, (...args) => {
        changed = true;
        const m = args.slice(0, -2) as string[];
        return typeof to === 'string' ? to.replace(/\$(\d)/g, (_, n) => m[Number(n)] ?? '') : to(...m);
      });
      return changed ? { text, tip } : null;
    },
  };
}

const RULES: Rule[] = [
  // "Myself Ravi" -> "My name is Ravi"
  regexRule(/\bmyself\s+([a-z]+)/gi, (_m, n) => `my name is ${n}`, "To introduce yourself, say 'My name is ...'."),
  // "my name is Ravi I am ..." -> "my name is Ravi, and I am ..."
  regexRule(/\b(my name is [a-z]+)\s+(i am|i'm)\b/gi, (_m, a, b) => `${a}, and ${b}`, 'Join short ideas with and to sound smoother.'),
  // I is / we is / he are ...
  regexRule(/\bI (is|are)\b/g, 'I am', "Use 'I am' with I."),
  regexRule(/\b(we|they|you) is\b/gi, (_m, p) => `${p} are`, "Use 'are' with we, you and they."),
  regexRule(/\b(he|she|it) (are|am)\b/gi, (_m, p) => `${p} is`, "Use 'is' with he, she and it."),
  // I am agree
  regexRule(/\bI am agree\b/gi, 'I agree', "Say 'I agree', not 'I am agree'."),
  // more better
  regexRule(/\bmore (better|easier|faster|bigger|happier|stronger)\b/gi, (_m, w) => w, "Do not use 'more' with 'better' or other -er words."),
  // I am knowing / liking ...
  regexRule(
    /\bI am (knowing|understanding|liking|wanting|loving)\b/gi,
    (_m, w) => ({ knowing: 'I know', understanding: 'I understand', liking: 'I like', wanting: 'I want', loving: 'I love' })[w.toLowerCase()] ?? _m,
    "Verbs like know, like and want do not usually use -ing: say 'I know', 'I like'.",
  ),
  // I am having two sisters
  regexRule(
    /\bI am having (a|an|one|two|three|four|five|\d+) (brothers?|sisters?|friends?|cousins?|pets?|dogs?|cats?)\b/gi,
    (_m, n, noun) => `I have ${n} ${noun}`,
    "Say 'I have two sisters', not 'I am having'.",
  ),
  // I have 20 years old
  regexRule(/\bI have (\w+) years old\b/gi, (_m, n) => `I am ${n} years old`, "Say 'I am ... years old'."),
  // interesting in
  regexRule(/\bI am (very |really )?interesting in\b/gi, (_m, v) => `I am ${v ?? ''}interested in`, "Use 'interested in' for your own feeling."),
  // good in -> good at
  regexRule(/\bI am (very |really )?good in\b/gi, (_m, v) => `I am ${v ?? ''}good at`, "We say 'good at' a subject or skill."),
  // discuss about
  regexRule(/\b(discuss|explain|describe|attend|enter|reach|marry|mention) about\b/gi, (_m, v) => v, "You do not need 'about' after this verb."),
  // studying degree / in second year
  regexRule(/\bstudying (degree)\b/gi, (_m, d) => `studying for my ${d}`, "Say 'studying for my degree'."),
  regexRule(/\b(in|on) (first|second|third|final|fourth) year\b/gi, (_m, p, y) => `in my ${y} year`, "Say 'in my second year'."),
  // I am study -> I am studying
  {
    apply(sentence) {
      const re = new RegExp(`\\b(I am|he is|she is|we are|they are|you are)\\s+(${ING_VERBS.join('|')})\\b(?!ing)`, 'gi');
      let changed = false;
      const text = sentence.replace(re, (_m, be: string, v: string) => {
        changed = true;
        return `${be} ${addIng(v.toLowerCase())}`;
      });
      return changed ? { text, tip: "After 'I am' use the -ing form: 'I am studying'." } : null;
    },
  },
  // he go -> he goes
  {
    apply(sentence) {
      const re = new RegExp(`\\b(he|she|it)\\s+(${THIRD_VERBS.join('|')})\\b`, 'gi');
      let changed = false;
      const text = sentence.replace(re, (m: string, subj: string, verb: string, offset: number, whole: string) => {
        const prev = /([\w']+)\s+$/.exec(whole.slice(0, offset))?.[1]?.toLowerCase();
        if (prev && AUX.has(prev)) return m;
        changed = true;
        return `${subj} ${addS(verb.toLowerCase())}`;
      });
      return changed ? { text, tip: "Use 'goes', 'likes', 'plays'... with he, she and it when talking about regular activities." } : null;
    },
  },
  // doesn't goes -> doesn't go
  {
    apply(sentence) {
      const re = new RegExp(`\\b(doesn't|does not|didn't|did not|don't|do not)\\s+(${Object.keys(BASE_FROM_WRONG).join('|')})\\b`, 'gi');
      let changed = false;
      const text = sentence.replace(re, (_m, aux: string, verb: string) => {
        changed = true;
        return `${aux} ${BASE_FROM_WRONG[verb.toLowerCase()]}`;
      });
      return changed ? { text, tip: "After 'do', 'does' or 'did' use the simple verb: 'does not go', 'did not like'." } : null;
    },
  },
  // yesterday I go -> yesterday I went
  {
    apply(sentence) {
      if (!/\b(yesterday|last (night|week|month|year|weekend|summer|sunday|monday|tuesday|wednesday|thursday|friday|saturday)|\w+ ago)\b/i.test(sentence)) return null;
      const re = new RegExp(`\\b(I|we|they|he|she|you)\\s+(${PAST_VERBS.join('|')})\\b`, 'gi');
      let changed = false;
      const text = sentence.replace(re, (m: string, subj: string, verb: string, offset: number, whole: string) => {
        const prev = /([\w']+)\s+$/.exec(whole.slice(0, offset))?.[1]?.toLowerCase();
        if (prev && AUX.has(prev)) return m;
        const v = verb.toLowerCase();
        changed = true;
        return `${subj} ${PAST[v] ?? addEd(v)}`;
      });
      return changed ? { text, tip: "When you talk about yesterday or the past, use the past form: 'went', 'ate', 'played'." } : null;
    },
  },
  // a apple -> an apple, an university -> a university
  {
    apply(sentence) {
      let changed = false;
      const text = sentence.replace(/\b(an|a)\s+([A-Za-z]\w*)/gi, (m: string, art: string, w: string) => {
        const needsAn = (/^[aeiou]/i.test(w) && !AN_EXCEPTIONS.test(w)) || A_EXCEPTIONS.test(w);
        const hasAn = art.toLowerCase() === 'an';
        if (needsAn === hasAn) return m;
        changed = true;
        const upper = art.charAt(0) === 'A';
        const fixedArt = needsAn ? 'an' : 'a';
        return `${upper ? fixedArt.charAt(0).toUpperCase() + fixedArt.slice(1) : fixedArt} ${w}`;
      });
      return changed ? { text, tip: "Use 'an' before a vowel sound (an apple) and 'a' before other sounds (a book)." } : null;
    },
  },
  // repeated word: "the the"
  {
    apply(sentence) {
      let changed = false;
      const text = sentence.replace(/\b(\w+)\s+\1\b/gi, (m: string, w: string) => {
        if (/^(had|that)$/i.test(w)) return m;
        changed = true;
        return w;
      });
      return changed ? { text, tip: 'A word was repeated. Take a small pause instead of repeating it.' } : null;
    },
  },
];

/** Tidy capitals, "I", names and end punctuation. */
function tidy(text: string): string {
  let t = text.replace(/\s+/g, ' ').trim();
  if (!t) return t;
  t = t.replace(/\bi\b/g, 'I');
  t = t.replace(/\bmy name is ([a-z]+)/gi, (_m, n) => `My name is ${cap(n)}`);
  t = t.replace(/(^|[.!?]\s+)([a-z])/g, (_m, a, b) => a + b.toUpperCase());
  if (!/[.!?]$/.test(t)) t += '.';
  return t;
}

export interface FixResult {
  fixed: string;
  tips: string[];
  changed: boolean;
}

/** Apply all rules to a piece of text (a few sentences). */
export function fixText(text: string): FixResult {
  let current = text.replace(/\s+/g, ' ').trim();
  const tips: string[] = [];
  for (const rule of RULES) {
    const r = rule.apply(current);
    if (r) {
      current = r.text;
      if (r.tip && !tips.includes(r.tip)) tips.push(r.tip);
    }
  }
  const fixed = tidy(current);
  return { fixed, tips, changed: normalise(fixed) !== normalise(text) };
}

export function detectName(text: string): string | null {
  const m = /\b(?:my name is|myself|i am called|call me)\s+([a-z]+)/i.exec(text);
  if (!m) return null;
  const n = m[1].toLowerCase();
  const stop = new Set(['a', 'an', 'the', 'from', 'in', 'studying', 'student', 'very', 'not', 'so', 'and', 'happy', 'fine', 'good']);
  return stop.has(n) || n.length < 2 ? null : cap(n);
}

/* ------------------------------------------------------------------ */
/* Speaking feedback                                                   */
/* ------------------------------------------------------------------ */

const STOP_WORDS = new Set(
  'a an the is are am was were be to of in on at for and or but with about your you i my me it this that what how why do does did which who when where would like tell describe usually something'.split(' '),
);

function matchesKeyword(token: string, key: string): boolean {
  if (token === key) return true;
  const stem = key.length >= 5 ? key.slice(0, key.length - 1) : key;
  return token.startsWith(stem) || (token.length >= 5 && key.startsWith(token.slice(0, token.length - 1)));
}

const CONNECTORS = ['and', 'because', 'but', 'so', 'then', 'also', 'when', 'while', 'after', 'before', 'although', 'however'];
const TARGET_WORDS: Record<Level, number> = { beginner: 8, intermediate: 18, confident: 30 };

export function speakingFeedback(transcript: string, prompt: SpeakingPrompt, level: Level): Feedback {
  const toks = words(transcript);
  const n = toks.length;
  const name = detectName(transcript);
  const hello = name ? `, ${name}` : '';

  if (n < 3) {
    return {
      tone: 'retry',
      headline: `Thank you for trying${hello}! 😊`,
      good: ['Starting is the hardest part, and you did it.'],
      improve: [
        n === 0
          ? 'I could not catch any words that time. Speak a little closer to the microphone.'
          : 'Try to say a full sentence this time.',
      ],
      next: `Need a start? Try: "${prompt.starters[0] ?? 'I think...'}"`,
    };
  }

  const good: string[] = [];
  const improve: string[] = [];

  // Fix rules
  const fix = fixText(transcript);

  // On topic? (look at the corrected version too, so "Myself Ravi" counts as a name)
  const allToks = words(transcript + ' ' + fix.fixed);
  const keyHits = prompt.keywords.filter((k) => allToks.some((t) => matchesKeyword(t, k)));
  const qWords = words(prompt.question).filter((w) => !STOP_WORDS.has(w) && w.length > 3);
  const qHits = qWords.filter((k) => allToks.some((t) => matchesKeyword(t, k)));
  const onTopic = keyHits.length > 0 || qHits.length > 0 || n >= 12;
  if (onTopic) good.push('You answered the question and shared your idea clearly.');
  else improve.push(`Try to use a few words from the question, like "${prompt.keywords[0] ?? qWords[0] ?? 'the topic'}".`);

  if (!fix.changed) good.push('Your sentences sound natural and correct. Well done!');
  else good.push('You communicated your main idea. That is what matters most.');
  for (const tip of fix.tips.slice(0, 2)) improve.push(tip);

  // Length and sentence building
  const target = TARGET_WORDS[level];
  if (n >= target) good.push('You gave a nice, full answer.');
  else improve.push(n < target / 2 ? 'Try adding one more sentence with more detail.' : 'Add one more detail to make your answer richer.');

  const hasConnector = toks.some((t) => CONNECTORS.includes(t));
  if (!hasConnector && n >= 10) improve.push("Link your ideas with a word like 'and', 'because' or 'but'.");
  else if (hasConnector) good.push('You linked your ideas well.');

  const unique = new Set(toks).size;
  if (n >= 15 && unique / n > 0.65) good.push('You used a nice variety of words.');

  const improved = fix.changed ? fix.fixed : undefined;
  const tone: Feedback['tone'] = !fix.changed && n >= target ? 'great' : 'good';

  return {
    tone,
    headline: tone === 'great' ? `Lovely answer${hello}! 🌟` : `Good try${hello}! 😊`,
    good: good.slice(0, 3),
    improve: improve.slice(0, 2),
    improved,
    next: improved
      ? 'Now try saying the improved sentence aloud.'
      : 'Try answering once more and add one new detail. Or move on to the next question.',
  };
}

/* ------------------------------------------------------------------ */
/* Reading feedback (approximate)                                      */
/* ------------------------------------------------------------------ */

function sameWord(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length >= 4 && b.length >= 4 && (a.startsWith(b) || b.startsWith(a)) && Math.abs(a.length - b.length) <= 2) return true;
  return false;
}

export interface ReadingResult {
  completed: boolean;
  coverage: number; // 0..1
  totalWords: number;
  matchedWords: number;
  missedWords: string[]; // unique, in order
  missedFlags: boolean[][]; // per paragraph, per token (whitespace separated)
  paragraphCoverage: number[];
  headline: string;
  message: string;
  suggestion: string;
}

export function tokenKey(token: string): string {
  return token.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z']/g, '');
}

export function readingFeedback(paragraphs: string[], transcript: string): ReadingResult {
  const heard = words(transcript);
  const tokens: { p: number; i: number; key: string }[] = [];
  paragraphs.forEach((para, p) =>
    para.split(/\s+/).filter(Boolean).forEach((tok, i) => {
      const key = tokenKey(tok);
      if (key) tokens.push({ p, i, key });
    }),
  );
  const n = tokens.length;
  const m = heard.length;

  // Longest common subsequence between the passage and what was heard.
  const dp: Uint16Array[] = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = sameWord(tokens[i].key, heard[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const matched = new Array<boolean>(n).fill(false);
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (sameWord(tokens[i].key, heard[j])) {
      matched[i] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }

  const matchedWords = matched.filter(Boolean).length;
  const coverage = n ? matchedWords / n : 0;

  const missedFlags = paragraphs.map((para) => new Array<boolean>(para.split(/\s+/).filter(Boolean).length).fill(false));
  const missedWords: string[] = [];
  const paraTotal = new Array<number>(paragraphs.length).fill(0);
  const paraHit = new Array<number>(paragraphs.length).fill(0);
  tokens.forEach((t, idx) => {
    paraTotal[t.p]++;
    if (matched[idx]) paraHit[t.p]++;
    else {
      missedFlags[t.p][t.i] = true;
      if (!missedWords.includes(t.key)) missedWords.push(t.key);
    }
  });
  const paragraphCoverage = paraTotal.map((tot, p) => (tot ? paraHit[p] / tot : 1));

  const completed = coverage >= 0.7;
  let headline: string;
  let message: string;
  let suggestion: string;

  if (m < 3) {
    headline = 'I could not hear much that time 😊';
    message = 'That can happen with background noise or a quiet microphone. It does not mean your reading was wrong.';
    suggestion = 'Try again a little closer to the microphone. Or listen to the passage first, then read along.';
  } else if (coverage >= 0.9) {
    headline = 'Wonderful reading! 🌟';
    message = 'Nearly every word was picked up. You read the passage smoothly.';
    suggestion = 'Great job! Try reading it once more a little faster, or choose another passage.';
  } else if (completed) {
    headline = 'Nice effort! You completed the passage. 😊';
    message = 'Most of the passage was recognised.';
    const weakest = paragraphCoverage.indexOf(Math.min(...paragraphCoverage));
    suggestion =
      paragraphs.length > 1
        ? `Try reading paragraph ${weakest + 1} a little more slowly. Focus on finishing each sentence before moving to the next.`
        : 'Try reading a little more slowly. Focus on finishing each sentence before moving to the next.';
  } else {
    headline = 'Good start! 😊';
    message = 'Part of the passage was recognised. Reading aloud takes practice, and every attempt helps.';
    suggestion = 'Listen to the passage once, then read along with it. Take a small pause at each full stop.';
  }

  return {
    completed,
    coverage,
    totalWords: n,
    matchedWords,
    missedWords: missedWords.slice(0, 12),
    missedFlags,
    paragraphCoverage,
    headline,
    message,
    suggestion,
  };
}

/* ------------------------------------------------------------------ */
/* Grammar checks                                       */
/* ------------------------------------------------------------------ */

export function matchesAnswer(answer: string, accepted: string[]): boolean {
  const a = normalise(answer);
  return !!a && accepted.some((x) => normalise(x) === a);
}

/** True when the answer shares most words with an accepted sentence (to say "almost there"). */
export function isCloseTo(answer: string, accepted: string[]): boolean {
  const a = new Set(words(answer));
  if (a.size < 3) return false;
  return accepted.some((x) => {
    const w = words(x);
    const hit = w.filter((t) => a.has(t)).length;
    return hit / w.length >= 0.75;
  });
}

export interface OwnSentenceResult {
  ok: boolean;
  message: string;
  improved?: string;
  tips: string[];
}

export function checkOwnSentence(text: string, checkWords?: string[]): OwnSentenceResult {
  const n = countWords(text);
  if (n < 3) {
    return { ok: false, message: 'Try to write a full sentence with at least three words. You can do it! 😊', tips: [] };
  }
  const fix = fixText(text);
  const toks = words(text);
  const usedKey = !checkWords || checkWords.length === 0 || checkWords.some((w) => toks.includes(w.toLowerCase()));
  if (fix.changed) {
    return {
      ok: true,
      message: 'Good try! Your idea is clear. Here is a smoother way to say it:',
      improved: fix.fixed,
      tips: fix.tips.slice(0, 2),
    };
  }
  if (!usedKey) {
    return {
      ok: true,
      message: 'Nice sentence! 🌟 It also helps to practise the pattern from this lesson. Look at the example and try one more.',
      tips: [],
    };
  }
  return { ok: true, message: 'Lovely sentence! 🌟 It sounds natural and correct.', tips: [] };
}

/* ------------------------------------------------------------------ */
/* Conversation summary                                                */
/* ------------------------------------------------------------------ */

export interface ConversationSummary {
  headline: string;
  praise: string[];
  polish: { original: string; better: string }[];
  next: string;
}

export function conversationSummary(replies: string[], totalSteps: number): ConversationSummary {
  const given = replies.filter((r) => countWords(r) > 0);
  const avg = given.length ? given.reduce((a, r) => a + countWords(r), 0) / given.length : 0;
  const polish = given
    .map((r) => ({ original: r, fix: fixText(r) }))
    .filter((x) => x.fix.changed && normalise(x.fix.fixed) !== normalise(x.original))
    .slice(0, 3)
    .map((x) => ({ original: x.original, better: x.fix.fixed }));

  const praise: string[] = [];
  if (given.length >= totalSteps) praise.push('You stayed in the conversation from start to finish.');
  else praise.push(`You answered ${given.length} of ${totalSteps} turns. You can come back and finish it any time.`);
  if (avg >= 8) praise.push('Your answers were full and clear.');
  else if (avg > 0) praise.push('Your answers were short and clear. Next time, add one small detail to each answer.');
  if (given.some((r) => /\b(please|thank|sorry|could you|would you)\b/i.test(r))) praise.push('You used polite expressions. That sounds friendly and confident.');
  if (given.some((r) => /\bbecause\b/i.test(r))) praise.push('You gave a reason with "because". Great!');

  return {
    headline: given.length >= totalSteps ? 'Well done! You finished the conversation! 🎉' : 'Nice start! 😊',
    praise: praise.slice(0, 3),
    polish,
    next: polish.length
      ? 'Try saying the smoother sentences aloud once. Then practise this conversation again, or try a new one.'
      : 'Try this conversation again with different answers, or choose a new scenario.',
  };
}

/* ------------------------------------------------------------------ */
/* Journal suggestions                                                 */
/* ------------------------------------------------------------------ */

export interface JournalSuggestion {
  original: string;
  suggestion: string;
  tips: string[];
}

export function journalSuggestions(text: string): JournalSuggestion[] {
  const sentences = text
    .replace(/\n+/g, ' ')
    .match(/[^.!?]+[.!?]*/g)
    ?.map((s) => s.trim())
    .filter(Boolean) ?? [];
  const out: JournalSuggestion[] = [];
  for (const s of sentences) {
    const fix = fixText(s);
    const tips = [...fix.tips];
    let suggestion = fix.fixed;
    if (!/[.!?]$/.test(s) && !tips.includes('Finish each sentence with a full stop.')) tips.push('Finish each sentence with a full stop.');
    if (/^[a-z]/.test(s) && !tips.includes('Start each sentence with a capital letter.')) tips.push('Start each sentence with a capital letter.');
    if (/\bi\b/.test(s) && !tips.includes("Write 'I' with a capital letter.")) tips.push("Write 'I' with a capital letter.");
    // Only suggest when something really differs from the original text.
    if (suggestion.trim() !== s.trim() && tips.length) out.push({ original: s, suggestion, tips: tips.slice(0, 3) });
    else if (suggestion.trim() !== s.trim()) out.push({ original: s, suggestion, tips: [] });
    suggestion = '';
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Reading time                                                        */
/* ------------------------------------------------------------------ */

export function readingMinutes(paragraphs: string[]): number {
  const n = countWords(paragraphs.join(' '));
  return Math.max(1, Math.round(n / 110));
}
