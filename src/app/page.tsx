import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();
  if (session) redirect('/dashboard');
  return (
    <main className="min-h-screen bg-gradient-to-br from-cream-50 via-sakura-50 to-lavender-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center">
        <div className="text-8xl mb-4 animate-bounce">🐱</div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-mocha-700 mb-3">
          Neko <span className="bg-gradient-to-r from-sakura-400 to-lavender-400 bg-clip-text text-transparent">Life</span>
        </h1>
        <p className="text-lg md:text-xl text-mocha-500 max-w-xl mx-auto mb-8">
          A cozy place to organize tasks, plan your days, jot down thoughts, and build habits — one paw at a time.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login" className="btn-primary text-base px-6 py-3">✨ Get started</Link>
          <Link href="/login" className="btn-outline text-base px-6 py-3">I have an account</Link>
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { e: '📋', t: 'Tasks', d: 'Kanban + lists' },
            { e: '📅', t: 'Calendar', d: 'Plan your days' },
            { e: '📝', t: 'Notes', d: 'Quick thoughts' },
            { e: '🌱', t: 'Habits', d: 'Build streaks' },
          ].map((f) => (
            <div key={f.t} className="card p-4 text-left">
              <div className="text-3xl mb-2">{f.e}</div>
              <div className="font-bold text-mocha-700">{f.t}</div>
              <div className="text-sm text-mocha-500">{f.d}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
