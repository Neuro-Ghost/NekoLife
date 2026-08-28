import { auth, signIn, isEmailConfigured, isDevDemo } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage({ searchParams }: { searchParams: { verify?: string; error?: string } }) {
  const session = await auth();
  if (session) redirect('/dashboard');

  async function oauth(provider: string) {
    'use server';
    await signIn(provider, { redirectTo: '/dashboard' });
  }

  async function emailAction(fd: FormData) {
    'use server';
    await signIn('nodemailer', { email: fd.get('email'), redirectTo: '/dashboard' });
  }

  async function demoAction(fd: FormData) {
    'use server';
    await signIn('demo', { email: fd.get('email'), redirectTo: '/dashboard' });
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cream-50 via-sakura-50 to-lavender-50 flex items-center justify-center p-6">
      <div className="card max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🐾</div>
          <h1 className="text-2xl font-extrabold text-mocha-700">Welcome back</h1>
          <p className="text-mocha-500 text-sm">Sign in to continue to Neko Life</p>
        </div>

        {searchParams.verify && (
          <div className="bg-mint-100 text-mocha-700 text-sm rounded-xl p-3 mb-4">
            ✉️ Magic link sent! Check your inbox.
          </div>
        )}
        {searchParams.error && (
          <div className="bg-sakura-100 text-mocha-700 text-sm rounded-xl p-3 mb-4">
            Something went wrong. Please try again.
          </div>
        )}

        {isDevDemo && (
          <>
            <div className="bg-cream-100 text-mocha-700 text-sm rounded-xl p-3 mb-4">
              🐱 <b>Dev demo mode</b> — no OAuth configured yet. Enter any email to create an account instantly.
            </div>
            <form action={demoAction} className="flex gap-2 mb-4">
              <input name="email" type="email" required placeholder="you@example.com" className="input" />
              <button className="btn-primary whitespace-nowrap">Continue</button>
            </form>
            <div className="flex items-center gap-3 text-mocha-500 text-xs my-4">
              <div className="flex-1 h-px bg-sakura-100" /> add OAuth keys in .env to enable these <div className="flex-1 h-px bg-sakura-100" />
            </div>
          </>
        )}

        <form action={oauth.bind(null, 'discord')} className="mb-3">
          <button type="submit" disabled={!process.env.AUTH_DISCORD_ID} className="btn w-full bg-[#5865F2] text-white hover:opacity-90 disabled:opacity-40">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.2.3c1.7.5 3 1.3 4.2 2.2a13.5 13.5 0 0 0-14.8 0A12 12 0 0 1 8.8 3.3L8.6 3a19.8 19.8 0 0 0-4.9 1.4C.8 9-.3 13.4.2 17.8a20 20 0 0 0 6 3l.8-1.2a13 13 0 0 1-2.1-1l.5-.4a14.3 14.3 0 0 0 12.2 0l.5.4c-.7.4-1.4.8-2.1 1l.8 1.2a20 20 0 0 0 6-3c.7-5.2-.8-9.7-3.5-13.4ZM8 15.2c-1.1 0-2-1-2-2.3s.9-2.3 2-2.3 2 1 2 2.3-.9 2.3-2 2.3Zm8 0c-1.1 0-2-1-2-2.3s.9-2.3 2-2.3 2 1 2 2.3-.9 2.3-2 2.3Z"/></svg>
            Continue with Discord
          </button>
        </form>
        <form action={oauth.bind(null, 'google')} className="mb-3">
          <button type="submit" disabled={!process.env.AUTH_GOOGLE_ID} className="btn w-full bg-white border border-sakura-100 text-mocha-700 hover:bg-sakura-50 disabled:opacity-40">
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8.1Z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.7H2v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.7 14a6.6 6.6 0 0 1 0-4V7.2H2a11 11 0 0 0 0 9.6L5.7 14Z"/><path fill="#EA4335" d="M12 4.6c1.6 0 3.1.6 4.3 1.7l3.2-3.2A11 11 0 0 0 2 7.2l3.7 2.8C6.6 7 9.1 4.6 12 4.6Z"/></svg>
            Continue with Google
          </button>
        </form>
        <form action={oauth.bind(null, 'github')} className="mb-5">
          <button type="submit" disabled={!process.env.AUTH_GITHUB_ID} className="btn w-full bg-mocha-700 text-white hover:opacity-90 disabled:opacity-40">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5 3.3 9.3 7.8 10.8.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0C17.3 4 18.3 4.3 18.3 4.3c.7 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1 .8 2.1v3.1c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5Z"/></svg>
            Continue with GitHub
          </button>
        </form>

        {isEmailConfigured && (
          <>
            <div className="flex items-center gap-3 text-mocha-500 text-xs my-4">
              <div className="flex-1 h-px bg-sakura-100" /> OR <div className="flex-1 h-px bg-sakura-100" />
            </div>
            <form action={emailAction} className="flex gap-2">
              <input name="email" type="email" required placeholder="you@domain.com" className="input" />
              <button className="btn-primary whitespace-nowrap">Magic link</button>
            </form>
            <p className="text-xs text-mocha-500/70 mt-2 text-center">We&apos;ll email you a one-click sign-in link.</p>
          </>
        )}
      </div>
    </main>
  );
}
