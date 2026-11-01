import Link from 'next/link';
import { BookOpen, MessageCircle, Mic, Type } from 'lucide-react';
import ActivityCard from '@/components/ActivityCard';
import HeroIllustration from '@/components/HeroIllustration';
import TodayCard from '@/components/TodayCard';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="grid items-center gap-10 lg:grid-cols-2" aria-labelledby="hero-title">
        <div className="animate-fade-up">
          <p className="inline-block rounded-full bg-mint-100 px-4 py-1.5 text-sm font-extrabold text-mint-700">
            Welcome to SpeakBright! 💙
          </p>
          <h1 id="hero-title" className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Your English Journey Starts Here!
          </h1>
          <p className="mt-4 text-lg text-ink-soft sm:text-xl">
            Build confidence, improve your fluency, and express yourself freely—one small step at a time.
          </p>
          <p className="mt-4 max-w-lg text-ink-soft">
            Choose an activity, practise at your own pace, and improve a little every day.
            <br />
            <strong className="text-ink">No registration. No pressure. Just practise!</strong>
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/speaking" className="btn btn-primary text-lg">
              Start Practising
            </Link>
            <a href="#activities" className="btn btn-outline text-lg">
              Explore Activities
            </a>
          </div>
          <p className="mt-5 text-sm font-bold text-lav-700">Speak More. Fear Less. Shine Brighter.</p>
        </div>
        <div className="flex justify-center">
          <HeroIllustration />
        </div>
      </section>

      {/* Today */}
      <TodayCard />

      {/* Activities */}
      <section id="activities" className="scroll-mt-24" aria-labelledby="activities-title">
        <h2 id="activities-title" className="text-center text-2xl font-extrabold sm:text-3xl">
          What would you like to practise today?
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ActivityCard
            href="/speaking"
            tone="lav"
            icon={<Mic size={28} />}
            title="Speak with Confidence"
            description="Practise everyday questions and improve your speaking confidence."
            button="Practise Speaking"
          />
          <ActivityCard
            href="/reading"
            tone="sky"
            icon={<BookOpen size={28} />}
            title="Read English Aloud"
            description="Read short passages and improve your reading fluency."
            button="Start Reading"
          />
          <ActivityCard
            href="/conversations"
            tone="mint"
            icon={<MessageCircle size={28} />}
            title="Everyday Conversations"
            description="Practise realistic conversations in a friendly environment."
            button="Practise Conversations"
          />
          <ActivityCard
            href="/grammar-practice"
            tone="coral"
            icon={<Type size={28} />}
            title="Grammar Through Speaking"
            description="Learn sentence patterns from everyday examples, then say your own."
            button="Practise Grammar"
          />
        </div>
      </section>

      {/* Encouragement */}
      <section className="rounded-[2rem] bg-lav-600 px-6 py-10 text-center text-white sm:px-10" aria-label="Encouragement">
        <p className="text-2xl font-extrabold sm:text-3xl">&ldquo;Every confident speaker starts with a single sentence. Let&rsquo;s begin!&rdquo;</p>
      </section>
    </div>
  );
}
