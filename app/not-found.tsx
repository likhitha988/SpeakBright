import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-xl p-10 text-center">
      <p className="text-6xl" aria-hidden>🧭</p>
      <h1 className="mt-3 text-3xl font-extrabold">We could not find that page</h1>
      <p className="mt-2 text-ink-soft">No worries! Let&apos;s go back and keep practising.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">Go to Home</Link>
        <Link href="/speaking" className="btn btn-outline">Practise Speaking</Link>
      </div>
    </div>
  );
}
