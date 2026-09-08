import Link from 'next/link';
import { Clapperboard } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-20 text-center">
      <Clapperboard className="h-10 w-10 text-amber-400" aria-hidden="true" />
      <p className="mt-6 font-mono text-xs uppercase tracking-[0.24em] text-amber-400">Scene missing</p>
      <h1 className="mt-3 font-serif text-4xl text-ash-50">This reel was never shot</h1>
      <p className="mt-3 text-sm leading-6 text-ash-300">
        The page you are looking for does not exist. Back to the studio to scout a real location.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-amber-400"
      >
        Back to LokDrishti
      </Link>
    </div>
  );
}
