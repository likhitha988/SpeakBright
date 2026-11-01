# SpeakBright 💙
**Speak More. Fear Less. Shine Brighter.**

SpeakBright is a friendly website where students practise English speaking, reading, conversations and grammar.

**There is no login, no signup and no registration.** Open the website and start practising.

---

## 1. What SpeakBright does

| Page | Address | What students do |
|---|---|---|
| Home | `/` | Welcome page with four main activities |
| Dashboard | `/dashboard` | Today's goal, recommended activity, weekly summary |
| Speaking | `/speaking` | 72 questions in 12 topics, microphone practice, friendly feedback, example answers |
| Reading | `/reading` | 21 original passages (3 levels), listen, read aloud, approximate feedback |
| Conversations | `/conversations` | 20 step-by-step role-plays with hints, examples and sentence starters |
| Grammar | `/grammar-practice` | 9 short topics taught through everyday speaking |
| My Progress | `/progress` | Friendly progress cards and a reset button |
| Journal | `/journal` | Private English journal with gentle suggestions |
| Settings | `/settings` | Level, daily goal, text size, sound, reduced motion |
| Tutor | `/tutor` | Optional AI tutor (only if you add an API key) |

Feedback is **rule-based and kind**. It never shames students, never judges accents and never claims to measure pronunciation.

## 2. Technologies

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Lucide icons · Web Speech API (speech recognition) · SpeechSynthesis API (listen) · localStorage.
There is **no database** and **no user accounts**.

## 3. Install Node.js (once)

1. Go to <https://nodejs.org> and download the **LTS** version (Node 20 or newer).
2. Install it with the default options.
3. Check it worked: open a terminal and type `node -v` (you should see a version number such as `v22.x.x`).

## 4. Open the project in VS Code

1. Unzip `SpeakBright_English_Practice_Website.zip`. You will get a folder called `speakbright`.
2. Open **VS Code** → **File → Open Folder…** → choose the `speakbright` folder.

## 5. Open the terminal in VS Code

Use the menu **Terminal → New Terminal** (or press <kbd>Ctrl</kbd> + <kbd>`</kbd>). It opens inside the project folder.

## 6. Install dependencies

```bash
npm install
```
This needs internet and takes a minute or two. It creates a `node_modules` folder and a `package-lock.json` file.

## 7. Run the website

```bash
npm run dev
```
Open <http://localhost:3000> in **Google Chrome** or **Microsoft Edge**. Stop the server with <kbd>Ctrl</kbd> + <kbd>C</kbd>.

## 8. Test speaking and reading

- **Speaking:** open `/speaking`, press the big microphone (or **Start Speaking**), say a sentence, then press **Stop Speaking**. Your words appear as text and you get friendly feedback. Try saying: *"Myself Ravi. I am studying degree."*
- **Reading:** open `/reading`, choose a passage, press **Listen to Passage**, then **Start Reading** and read aloud. Press **Stop Reading** to see an approximate result.
- No microphone? You can always type your answer, or press **I practised aloud ✓**.

## 9. Why does the browser ask for the microphone?

Speech recognition needs your microphone. SpeakBright asks **only when a student presses Start Speaking / Start Reading**. Audio is processed by the browser's speech service and is **never recorded or stored by SpeakBright**. If you press "Block", you can allow it again from the lock icon near the address bar.

> Tip: speech recognition works on `http://localhost` and on `https://` websites, but not on plain `http://` websites.

## 10. Optional AI tutor (not required)

The website works fully without it. To switch it on:

1. Copy `.env.example` to a new file named `.env.local`.
2. Put your key in it: `ANTHROPIC_API_KEY=your-key-here`
3. Restart `npm run dev`.

The key is read **only on the server** (`app/api/feedback/route.ts`) and is never sent to the browser. Students never enter keys. Text is sent to the AI service **only when a student presses an AI button**; private journal entries are never sent automatically. Without a key, the AI buttons are hidden and the Tutor page says honestly that no AI is connected.
You can change the model with `ANTHROPIC_MODEL` in `.env.local`.

## 11. Build for production

```bash
npm run build
npm run start
```

## 12. Deploy

The easiest way is **Vercel** (free): upload the project to GitHub, import it at <https://vercel.com/new>, press **Deploy**. Any host that runs Node.js works too (`npm run build` then `npm run start`). Add `ANTHROPIC_API_KEY` in the host's *Environment Variables* only if you want the AI tutor. Use an `https://` address so the microphone works.

## 13. Browser support

| Feature | Works in |
|---|---|
| Listen (text-to-speech) | Chrome, Edge, Safari, Firefox |
| Speech recognition (microphone) | Chrome, Edge (best), Safari (partly). **Firefox does not support it** |

When speech recognition is missing, SpeakBright shows a friendly message and students can still type answers and read aloud on their own. The voices used for **Listen** depend on the device. Recognition results can change because of accents, noise and microphone quality, so they are only a helper.

## 14. How progress is saved

Everything is saved in your browser's **localStorage** under one key (`speakbright:v1`): level and settings, completed activities, speaking history (text only), reading progress, completed conversations, grammar progress, practice days and journal entries.

## 15. Why progress does not sync between devices

There are no accounts and no server database, so nothing leaves the browser. A different phone, computer or browser starts fresh, and clearing browser data (or pressing **Reset Progress**, which asks for confirmation) removes progress. The Settings page explains this to students.

---

### Project structure
```
app/            pages (one folder per route) + api/feedback/route.ts + globals.css
components/     header, cards, practice components, feedback, dialogs
data/           speaking prompts, reading passages, conversations, grammar
lib/            storage.ts (localStorage), speech.ts + useSpeechRecognition.ts, feedback.ts (rule-based help)
```
To add content, edit the files in `data/`. No other code needs to change.
