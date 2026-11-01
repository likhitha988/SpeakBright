import type { GrammarTopic } from './types';

export const grammarTopics: GrammarTopic[] = [
  {
    id: 'simple-present',
    title: 'Simple Present Tense',
    emoji: '☀️',
    summary: 'Talk about habits, routines and facts.',
    explanation:
      "We use the simple present for things we do every day and things that are always true. With he, she and it, we add -s or -es to the verb. For questions and 'no' sentences, we use do/does and don't/doesn't.",
    examples: [
      { sentence: 'I wake up at six every morning.', note: 'A daily habit.' },
      { sentence: 'My sister goes to college by bus.', note: "She + goes (add -es)." },
      { sentence: 'The sun rises in the east.', note: 'A fact that is always true.' },
      { sentence: "My brother doesn't like tea.", note: 'Use doesn\'t + the base verb.' },
    ],
    mistakes: [
      {
        wrong: 'She go to college every day.',
        right: 'She goes to college every day.',
        why: 'Use goes with he, she and it.',
      },
      {
        wrong: 'He don\'t like cricket.',
        right: "He doesn't like cricket.",
        why: "Use doesn't with he, she and it.",
      },
      {
        wrong: 'Does she plays the guitar?',
        right: 'Does she play the guitar?',
        why: 'After does, the verb stays in its base form.',
      },
    ],
    exercises: [
      {
        wrong: 'My mother cook dinner at seven.',
        answers: ['My mother cooks dinner at seven.'],
        explanation: 'Add -s to the verb with she, he, it or one person.',
      },
      {
        wrong: 'They goes to school by bus.',
        answers: ['They go to school by bus.'],
        explanation: 'Use the base verb go with they.',
      },
      {
        wrong: "My friend don't eat meat.",
        answers: ["My friend doesn't eat meat."],
        explanation: "Use doesn't with one person like my friend.",
      },
    ],
    createPrompt: 'Write one sentence about what you do every morning.',
    createExample: 'I wake up at six, brush my teeth and drink a glass of milk.',
    checkWords: ['i', 'every', 'always', 'usually', 'morning', 'wake', 'brush'],
  },
  {
    id: 'simple-past',
    title: 'Simple Past Tense',
    emoji: '⏪',
    summary: 'Talk about things that already happened.',
    explanation:
      'We use the simple past for finished actions, like yesterday or last week. Most verbs add -ed, but many common verbs change their form, like go to went. In questions and negatives, we use did and the base verb.',
    examples: [
      { sentence: 'I watched a film with my cousins yesterday.', note: 'Watch + ed.' },
      { sentence: 'We went to the market last Sunday.', note: 'Go becomes went.' },
      { sentence: 'Did you finish your homework?', note: 'Did + base verb.' },
      { sentence: "She didn't come to class on Monday.", note: "didn't + base verb." },
    ],
    mistakes: [
      {
        wrong: 'Yesterday I go to the temple.',
        right: 'Yesterday I went to the temple.',
        why: 'Yesterday means the action is finished, so use went.',
      },
      {
        wrong: 'Did you went to school today?',
        right: 'Did you go to school today?',
        why: 'After did, use the base verb go.',
      },
      {
        wrong: 'He didn\'t called me.',
        right: "He didn't call me.",
        why: "After didn't, use the base verb call.",
      },
    ],
    exercises: [
      {
        wrong: 'Last night I eat rice and dal.',
        answers: ['Last night I ate rice and dal.'],
        explanation: 'Last night is in the past, so eat becomes ate.',
      },
      {
        wrong: 'Did she called you yesterday?',
        answers: ['Did she call you yesterday?'],
        explanation: 'After did, use the base verb call.',
      },
      {
        wrong: 'We play cricket last Saturday.',
        answers: ['We played cricket last Saturday.'],
        explanation: 'Last Saturday is past, so add -ed to play.',
      },
    ],
    createPrompt: 'Write one sentence about what you did yesterday.',
    createExample: 'Yesterday I visited my grandmother and helped her in the kitchen.',
    checkWords: ['yesterday', 'went', 'visited', 'played', 'did', 'last', 'ate', 'watched'],
  },
  {
    id: 'simple-future',
    title: 'Simple Future Tense',
    emoji: '🔮',
    summary: 'Talk about plans and things that will happen.',
    explanation:
      "We use will + the base verb for future actions and quick decisions. We use going to for plans we have already made. The word 'will' does not change with he, she or it.",
    examples: [
      { sentence: 'I will call you tonight.', note: 'will + base verb.' },
      { sentence: 'We are going to visit our village next month.', note: 'A plan.' },
      { sentence: "It will rain tomorrow, so take an umbrella.", note: 'A prediction.' },
      { sentence: "She won't be late for class.", note: "won't = will not." },
    ],
    mistakes: [
      {
        wrong: 'I will goes to the library tomorrow.',
        right: 'I will go to the library tomorrow.',
        why: 'After will, always use the base verb.',
      },
      {
        wrong: 'Tomorrow I am going to meets my teacher.',
        right: 'Tomorrow I am going to meet my teacher.',
        why: 'After going to, use the base verb.',
      },
      {
        wrong: 'If it will rain, we will stay home.',
        right: 'If it rains, we will stay home.',
        why: 'After if, use the simple present, not will.',
      },
    ],
    exercises: [
      {
        wrong: 'She will comes to the party tomorrow.',
        answers: ['She will come to the party tomorrow.'],
        explanation: 'After will, use the base verb come.',
      },
      {
        wrong: 'I am going to buys a new bag next week.',
        answers: ['I am going to buy a new bag next week.'],
        explanation: 'After going to, use the base verb buy.',
      },
      {
        wrong: 'Next year, we will studying in a new class.',
        answers: ['Next year, we will study in a new class.'],
        explanation: 'After will, use study, not studying.',
      },
    ],
    createPrompt: 'Write one sentence about what you will do this weekend.',
    createExample: 'This weekend I will visit my friend and we will play carrom.',
    checkWords: ['will', 'going', 'tomorrow', 'next', 'weekend'],
  },
  {
    id: 'question-formation',
    title: 'Question Formation',
    emoji: '❓',
    summary: 'Ask clear questions in the right word order.',
    explanation:
      'In most English questions, the helper word (do, does, did, is, are, can) comes before the person. Question words like what, where and why go at the start. Use the helper word only once, and keep the main verb simple.',
    examples: [
      { sentence: 'Where do you live?', note: 'Question word + do + you.' },
      { sentence: 'What time does the class start?', note: 'does + base verb.' },
      { sentence: 'Can you help me with this word?', note: 'Can comes first.' },
      { sentence: 'Why are you happy today?', note: 'Question word + are + you.' },
    ],
    mistakes: [
      {
        wrong: 'Where you are going?',
        right: 'Where are you going?',
        why: 'Put are before you in a question.',
      },
      {
        wrong: 'What you want to eat?',
        right: 'What do you want to eat?',
        why: 'Use do before you in a simple present question.',
      },
      {
        wrong: 'Why she is crying?',
        right: 'Why is she crying?',
        why: 'The helper word is comes before she.',
      },
    ],
    exercises: [
      {
        wrong: 'Where you live?',
        answers: ['Where do you live?'],
        explanation: 'Add do before you in this question.',
      },
      {
        wrong: 'What time the class starts?',
        answers: ['What time does the class start?'],
        explanation: 'Use does before the class, and then the base verb start.',
      },
      {
        wrong: 'How you are today?',
        answers: ['How are you today?'],
        explanation: 'Put are before you.',
      },
    ],
    createPrompt: 'Write one question you would ask a new classmate.',
    createExample: 'What do you like to do after school?',
    checkWords: ['what', 'where', 'do', 'does', 'how', 'why', 'are', 'can', 'which'],
  },
  {
    id: 'articles',
    title: 'Articles: a, an, the',
    emoji: '📘',
    summary: 'Know when to use a, an and the.',
    explanation:
      "Use a or an for one thing when we say it for the first time. Use an before a vowel sound (an apple, an hour) and a before other sounds (a book, a university). Use the when both people know which thing we mean.",
    examples: [
      { sentence: 'I have a pen and an eraser.', note: 'First time, one thing each.' },
      { sentence: 'She is an engineer.', note: 'Use a or an for jobs.' },
      { sentence: 'Please close the door.', note: 'We both know which door.' },
      { sentence: 'The moon looks beautiful tonight.', note: 'There is only one moon.' },
    ],
    mistakes: [
      {
        wrong: 'He is a engineer.',
        right: 'He is an engineer.',
        why: 'Engineer starts with a vowel sound, so use an.',
      },
      {
        wrong: 'I bought a apple from the market.',
        right: 'I bought an apple from the market.',
        why: 'Apple starts with a vowel sound, so use an.',
      },
      {
        wrong: 'My father is doctor.',
        right: 'My father is a doctor.',
        why: 'Use a before a singular job name.',
      },
    ],
    exercises: [
      {
        wrong: 'She is a honest girl.',
        answers: ['She is an honest girl.'],
        explanation: 'Honest starts with a vowel sound, so use an.',
      },
      {
        wrong: 'I saw elephant at the zoo.',
        answers: ['I saw an elephant at the zoo.'],
        explanation: 'Use an before elephant.',
      },
      {
        wrong: 'My brother is teacher.',
        answers: ['My brother is a teacher.'],
        explanation: 'Use a before a singular job name.',
      },
    ],
    createPrompt: 'Write one sentence about something you have in your bag.',
    createExample: 'I have a notebook, an umbrella and the keys to our house.',
    checkWords: ['a', 'an', 'the', 'have', 'bag'],
  },
  {
    id: 'prepositions',
    title: 'Prepositions',
    emoji: '📍',
    summary: 'Use in, on, at, to and for with confidence.',
    explanation:
      'Prepositions are small words that show time, place or direction. Use at for exact times and points, on for days and surfaces, and in for months, years and larger spaces. Learn them in short phrases like at 5 o\'clock or on Monday.',
    examples: [
      { sentence: 'The class starts at nine o\'clock.', note: 'at + exact time.' },
      { sentence: 'My birthday is on Friday.', note: 'on + day.' },
      { sentence: 'We live in Hyderabad.', note: 'in + city.' },
      { sentence: 'I go to college by bus.', note: 'go to + place.' },
    ],
    mistakes: [
      {
        wrong: 'I will meet you in Monday.',
        right: 'I will meet you on Monday.',
        why: 'Use on with days.',
      },
      {
        wrong: 'She is good in English.',
        right: 'She is good at English.',
        why: 'We say good at a subject.',
      },
      {
        wrong: 'I reached to the station early.',
        right: 'I reached the station early.',
        why: 'The verb reach does not need to.',
      },
    ],
    exercises: [
      {
        wrong: 'The film starts in 6 o\'clock.',
        answers: ["The film starts at 6 o'clock."],
        explanation: 'Use at with exact times.',
      },
      {
        wrong: 'My exam is in Tuesday.',
        answers: ['My exam is on Tuesday.'],
        explanation: 'Use on with days.',
      },
      {
        wrong: 'I am interested on music.',
        answers: ['I am interested in music.'],
        explanation: 'We say interested in.',
      },
    ],
    createPrompt: 'Write one sentence about where and when you study.',
    createExample: 'I study at my desk in the evening, after I come home from college.',
    checkWords: ['at', 'in', 'on', 'to', 'for', 'from'],
  },
  {
    id: 'subject-verb-agreement',
    title: 'Subject-Verb Agreement',
    emoji: '🤝',
    summary: 'Make the verb match the person or thing.',
    explanation:
      'The verb must match the subject. One person or thing takes is, was or a verb with -s. More than one takes are, were or the base verb. Words like everyone, nobody and each take a singular verb.',
    examples: [
      { sentence: 'My friends are very helpful.', note: 'Friends is plural, so are.' },
      { sentence: 'Everyone in my class likes music.', note: 'Everyone is singular.' },
      { sentence: 'The books on the table are mine.', note: 'The subject is books.' },
      { sentence: 'Neither of my parents drives a car.', note: 'Neither is singular.' },
    ],
    mistakes: [
      {
        wrong: 'My friends is coming today.',
        right: 'My friends are coming today.',
        why: 'Friends is plural, so use are.',
      },
      {
        wrong: 'Everyone are happy.',
        right: 'Everyone is happy.',
        why: 'Everyone is singular, so use is.',
      },
      {
        wrong: 'There is many students in the hall.',
        right: 'There are many students in the hall.',
        why: 'Students is plural, so use are.',
      },
    ],
    exercises: [
      {
        wrong: 'The children is playing outside.',
        answers: ['The children are playing outside.'],
        explanation: 'Children is plural, so use are.',
      },
      {
        wrong: 'Each student have a book.',
        answers: ['Each student has a book.'],
        explanation: 'Each is singular, so use has.',
      },
      {
        wrong: 'My brother and sister is at home.',
        answers: ['My brother and sister are at home.'],
        explanation: 'Two people joined by and need are.',
      },
    ],
    createPrompt: 'Write one sentence about your family members and what they do.',
    createExample: 'My parents work in the city, and my sister studies in college.',
    checkWords: ['are', 'is', 'my', 'works', 'work', 'family'],
  },
  {
    id: 'sentence-patterns',
    title: 'Common Sentence Patterns',
    emoji: '🧩',
    summary: 'Use simple patterns again and again when you speak.',
    explanation:
      "Many English sentences follow easy patterns, like 'I like to ...', 'I am going to ...' and 'I want to ...'. Learn a few patterns and change the last part to say what you mean. This helps you speak faster with fewer mistakes.",
    examples: [
      { sentence: 'I like to read stories before bed.', note: 'I like to + verb.' },
      { sentence: 'I am good at drawing.', note: 'I am good at + word with -ing.' },
      { sentence: 'I would like some water, please.', note: 'A polite way to ask.' },
      { sentence: 'I think this idea is nice.', note: 'I think + sentence.' },
    ],
    mistakes: [
      {
        wrong: 'I am agree with you.',
        right: 'I agree with you.',
        why: 'Agree is a verb, so do not add am.',
      },
      {
        wrong: 'I want go to the park.',
        right: 'I want to go to the park.',
        why: 'We say want to + verb.',
      },
      {
        wrong: 'I am liking this song.',
        right: 'I like this song.',
        why: 'Like does not usually take -ing.',
      },
    ],
    exercises: [
      {
        wrong: 'I am agree with my teacher.',
        answers: ['I agree with my teacher.'],
        explanation: 'Agree is a verb, so do not use am.',
      },
      {
        wrong: 'I want learn English well.',
        answers: ['I want to learn English well.'],
        explanation: 'We say want to + verb.',
      },
      {
        wrong: 'She is good in singing.',
        answers: ['She is good at singing.'],
        explanation: 'We say good at.',
      },
    ],
    createPrompt: "Write one sentence about what you like to do, starting with 'I like to'.",
    createExample: 'I like to listen to music while I walk home.',
    checkWords: ['like', 'want', 'would', 'think', 'am', 'good'],
  },
  {
    id: 'sentence-correction',
    title: 'Everyday Sentence Correction',
    emoji: '✏️',
    summary: 'Spot and fix small mistakes in daily sentences.',
    explanation:
      'Many small mistakes come from habits in our own language. Read your sentence slowly and check the verb, the small words and the word order. Fixing one mistake at a time makes your English stronger.',
    examples: [
      { sentence: 'I have two brothers.', note: 'Use have for family and things you own.' },
      { sentence: 'Please give me some advice.', note: 'Advice has no plural.' },
      { sentence: 'I am twelve years old.', note: 'We use am for age.' },
      { sentence: 'She told me a funny story.', note: 'Tell + person + story.' },
    ],
    mistakes: [
      {
        wrong: 'Please give me some advices.',
        right: 'Please give me some advice.',
        why: 'Advice has no plural form.',
      },
      {
        wrong: 'I have twelve years.',
        right: 'I am twelve years old.',
        why: 'In English, we use am for age.',
      },
      {
        wrong: 'He said me to wait.',
        right: 'He told me to wait.',
        why: 'Use told with a person after it.',
      },
    ],
    exercises: [
      {
        wrong: 'I have fifteen years.',
        answers: ['I am fifteen years old.', 'I am fifteen.'],
        explanation: 'We say I am fifteen years old for age.',
      },
      {
        wrong: 'Can you give me some informations?',
        answers: ['Can you give me some information?'],
        explanation: 'Information has no plural form.',
      },
      {
        wrong: 'The teacher said me to sit down.',
        answers: ['The teacher told me to sit down.'],
        explanation: 'Use told with a person after it.',
      },
    ],
    createPrompt: 'Write one correct sentence about your age and your class.',
    createExample: 'I am sixteen years old and I study in the eleventh class.',
    checkWords: ['am', 'years', 'old', 'class', 'study'],
  },
];
