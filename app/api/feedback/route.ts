// Optional AI English tutor (server side only).
//
// - GET  /api/feedback  -> { configured: boolean }
// - POST /api/feedback  -> { reply: string }   (needs ANTHROPIC_API_KEY on the server)
//
// The API key is read from environment variables here and is NEVER sent to the browser.
// If no key is set, the website still works with its built-in rule-based feedback.

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MAX_TEXT = 1500;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function isConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY?.trim();
}

export async function GET() {
  return NextResponse.json({ configured: isConfigured() });
}

const LEVEL_HELP: Record<string, string> = {
  beginner: 'The student is a beginner. Use very simple words and very short sentences.',
  intermediate: 'The student is intermediate. Use clear, simple English and short explanations.',
  confident: 'The student is a confident speaker. You may suggest richer expressions, but stay clear.',
};

function systemPrompt(mode: string, level: string): string {
  const base = [
    'You are SpeakBright, a warm, encouraging English speaking coach for school and college students, many of them from India.',
    'You ONLY help with English communication: speaking, reading, everyday phrases, sentence correction and confidence.',
    'If the student asks about anything else (coding, maths, homework in other subjects, news, personal data), kindly say you can only help with English practice and invite an English question.',
    LEVEL_HELP[level] ?? LEVEL_HELP.intermediate,
    'Never shame the student. Never say their English is poor. Do not judge accents. Do not claim to measure pronunciation.',
    'Keep the reply under 130 words. Use plain text only (no markdown tables, no headings).',
  ];
  if (mode === 'feedback') {
    base.push(
      'The student answered a speaking question. Start with one genuine positive point. Then give one or two gentle improvements and one improved version of their sentence. End by asking them to say the improved sentence aloud.',
    );
  } else if (mode === 'journal') {
    base.push(
      'The student wrote a short English journal entry. Praise one thing. Suggest up to three small improvements, showing the original phrase and a better one. Keep their own ideas and voice.',
    );
  } else {
    base.push(
      'Answer the student question about English. Give one short explanation and two or three short example sentences they can say aloud. Encourage them to practise speaking.',
    );
  }
  return base.join(' ');
}

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      { error: 'The AI tutor is not switched on for this website. All other practice features still work.' },
      { status: 503 },
    );
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (tooMany(ip)) {
    return NextResponse.json({ error: 'You are asking very quickly. Please wait a minute and try again.' }, { status: 429 });
  }

  let body: { mode?: string; text?: string; context?: string; level?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Something was wrong with that request. Please try again.' }, { status: 400 });
  }

  const text = String(body.text ?? '').trim().slice(0, MAX_TEXT);
  const context = String(body.context ?? '').trim().slice(0, 300);
  const mode = ['tutor', 'feedback', 'journal'].includes(String(body.mode)) ? String(body.mode) : 'tutor';
  const level = String(body.level ?? 'intermediate');
  if (!text) {
    return NextResponse.json({ error: 'Please write a sentence or a question first.' }, { status: 400 });
  }

  const userMessage = context ? `Question or situation: ${context}\n\nStudent text: ${text}` : text;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL?.trim() || 'claude-haiku-5-5',
        max_tokens: 400,
        system: systemPrompt(mode, level),
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'The AI tutor could not answer right now. Please try again in a moment.' }, { status: 502 });
    }
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const reply = (data.content ?? [])
      .filter((c) => c.type === 'text' && c.text)
      .map((c) => c.text)
      .join('\n')
      .trim();
    if (!reply) {
      return NextResponse.json({ error: 'The AI tutor did not send an answer. Please try again.' }, { status: 502 });
    }
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: 'The AI tutor could not be reached. Please try again later.' }, { status: 502 });
  }
}
