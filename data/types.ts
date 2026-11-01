// Shared types for all SpeakBright learning content.

export type Level = 'beginner' | 'intermediate' | 'confident';
export type ReadingLevel = 'beginner' | 'intermediate' | 'advanced';

/* ---------- Speaking ---------- */
export interface SpeakingCategory {
  id: string;
  title: string;
  emoji: string;
  description: string;
}

export interface SpeakingPrompt {
  id: string; // e.g. "daily-routine-3"
  category: string; // SpeakingCategory.id
  level: Level;
  question: string;
  example: string; // model answer, 2-4 sentences
  keywords: string[]; // lowercase words a good answer will probably contain
  starters: string[]; // sentence starters ending with "..."
}

/* ---------- Reading ---------- */
export interface ReadingPassage {
  id: string; // e.g. "r-b1"
  level: ReadingLevel;
  topic: string;
  title: string;
  intro: string;
  paragraphs: string[];
  vocabulary: { word: string; meaning: string }[];
  questions: { question: string; answer: string }[];
}

/* ---------- Conversations ---------- */
export interface ConversationStep {
  partner: string; // what the conversation partner says to prompt the student
  hint: string; // plain-English instruction for what to say
  example: string; // a model reply
  starters: string[]; // sentence starters
}

export interface ConversationScenario {
  id: string;
  title: string;
  emoji: string;
  level: Level;
  situation: string;
  yourRole: string;
  partnerRole: string;
  steps: ConversationStep[]; // one per student turn (3-4)
  closing: string; // partner's final line after the last student reply
}

/* ---------- Grammar ---------- */
export interface GrammarTopic {
  id: string;
  title: string;
  emoji: string;
  summary: string;
  explanation: string;
  examples: { sentence: string; note?: string }[];
  mistakes: { wrong: string; right: string; why: string }[];
  exercises: { wrong: string; answers: string[]; explanation: string }[];
  createPrompt: string;
  createExample: string;
  checkWords?: string[];
}
