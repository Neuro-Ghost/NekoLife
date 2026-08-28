import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { updateProfile } from '@/lib/actions';
import { signOut } from '@/lib/auth';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect('/login');

  const stats = await prisma.$transaction([
    prisma.task.count({ where: { userId: user.id } }),
    prisma.task.count({ where: { userId: user.id, done: true } }),
    prisma.note.count({ where: { userId: user.id } }),
    prisma.event.count({ where: { userId: user.id } }),
    prisma.habit.count({ where: { userId: user.id } }),
  ]);

  async function logout() {
    'use server';
    await signOut({ redirectTo: '/' });
  }

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-5">
        <h1 className="text-3xl font-extrabold text-mocha-700">Profile 🐾</h1>
        <p className="text-mocha-500">Your cozy corner.</p>
      </header>

      <div className="card p-6 flex items-center gap-4 mb-4">
        {user.image ? (
          <img src={user.image} alt="" className="w-20 h-20 rounded-full border-4 border-sakura-200" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sakura-200 to-lavender-200 flex items-center justify-center text-mocha-700 text-3xl font-extrabold">
            {(user.name || user.email || '?')[0].toUpperCase()}
          </div>
        )}
        <div>
          <div className="text-xl font-extrabold text-mocha-700">{user.name || 'Friend'}</div>
          <div className="text-mocha-500">{user.email}</div>
          <div className="text-xs text-mocha-500/70 mt-1">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      <form action={updateProfile} className="card p-6 space-y-3 mb-4">
        <h3 className="font-bold text-mocha-700">Edit profile</h3>
        <label className="block">
          <span className="text-sm text-mocha-600 font-semibold">Name</span>
          <input name="name" defaultValue={user.name || ''} className="input" />
        </label>
        <label className="block">
          <span className="text-sm text-mocha-600 font-semibold">Bio</span>
          <textarea name="bio" defaultValue={user.bio || ''} rows={3} placeholder="Tell Neko Life about you..." className="input resize-none" />
        </label>
        <div className="flex justify-end">
          <button className="btn-primary">Save</button>
        </div>
      </form>

      <div className="card p-6 mb-4">
        <h3 className="font-bold text-mocha-700 mb-3">Your stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { l: 'Total tasks', v: stats[0], e: '📋' },
            { l: 'Completed',   v: stats[1], e: '✨' },
            { l: 'Notes',       v: stats[2], e: '📝' },
            { l: 'Events',      v: stats[3], e: '📅' },
            { l: 'Habits',      v: stats[4], e: '🌱' },
          ].map((s) => (
            <div key={s.l} className="bg-cream-50 rounded-xl p-3 text-center">
              <div className="text-2xl">{s.e}</div>
              <div className="text-2xl font-extrabold text-mocha-700">{s.v}</div>
              <div className="text-xs text-mocha-500">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <form action={logout}>
        <button className="btn-outline w-full">Log out</button>
      </form>
    </div>
  );
}
