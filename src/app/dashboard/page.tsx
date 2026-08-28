import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { AREA_META } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, StickyNote, Sprout } from 'lucide-react';
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { TodayTasks } from '@/components/TodayTasks';

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const uid = session.user.id;
  const now = new Date();
  const [tasks, overdue, upcoming, notes, habits] = await Promise.all([
    prisma.task.findMany({
      where: { userId: uid, done: false },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.task.count({
      where: { userId: uid, done: false, dueDate: { lt: startOfDay(now) } },
    }),
    prisma.event.findMany({
      where: { userId: uid, startsAt: { gte: now, lte: endOfWeek(now, { weekStartsOn: 1 }) } },
      orderBy: { startsAt: 'asc' },
      take: 5,
    }),
    prisma.note.count({ where: { userId: uid } }),
    prisma.habit.findMany({ where: { userId: uid }, take: 5 }),
  ]);

  const doneToday = await prisma.task.count({
    where: { userId: uid, done: true, updatedAt: { gte: startOfDay(now) } },
  });

  const totalOpen = tasks.length;
  const pct = totalOpen + doneToday > 0 ? Math.round((doneToday / (totalOpen + doneToday)) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6">
        <div className="text-mocha-500 text-sm">
          {now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-mocha-700">
          Hello, {session.user.name || session.user.email?.split('@')[0] || 'friend'} 🐾
        </h1>
        <p className="text-mocha-500">Here's your day at a glance.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat icon={<CheckCircle2 className="w-5 h-5" />} label="Done today"   value={doneToday} tone="mint" />
        <Stat icon={<Clock className="w-5 h-5" />}         label="Overdue"      value={overdue}   tone="sakura" />
        <Stat icon={<StickyNote className="w-5 h-5" />}    label="Notes"        value={notes}     tone="lavender" />
        <Stat icon={<Sprout className="w-5 h-5" />}        label="Habits"       value={habits.length} tone="cream" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-mocha-700">Today's tasks</h2>
            <Link href="/dashboard/tasks" className="text-sm font-semibold text-sakura-400 hover:text-sakura-300 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <TodayTasks tasks={tasks} />
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-mocha-700 mb-3">Upcoming events</h2>
          {upcoming.length === 0 ? (
            <div className="text-sm text-mocha-500">Nothing scheduled — enjoy the calm. 🌸</div>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((e) => {
                const meta = AREA_META[e.area] || AREA_META.PERSONAL;
                return (
                  <li key={e.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ background: meta.color }} />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-mocha-700 text-sm truncate">{e.title}</div>
                      <div className="text-xs text-mocha-500">
                        {e.startsAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        {!e.allDay && ` · ${e.startsAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="card p-5 mt-4 bg-gradient-to-r from-lavender-100 to-sakura-100">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{pct >= 75 ? '😻' : pct >= 40 ? '😺' : '😿'}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm font-semibold text-mocha-700 mb-1">
              <span>Daily progress</span>
              <span>{pct}%</span>
            </div>
            <div className="h-3 bg-white/70 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sakura-300 to-lavender-300 transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, tone }: any) {
  const tones: Record<string, string> = {
    mint: 'from-mint-100 to-mint-200',
    sakura: 'from-sakura-100 to-sakura-200',
    lavender: 'from-lavender-100 to-lavender-200',
    cream: 'from-cream-100 to-cream-200',
  };
  return (
    <div className={`card bg-gradient-to-br ${tones[tone]} p-4`}>
      <div className="flex items-center gap-2 text-mocha-600 mb-1">{icon}<span className="text-xs font-semibold">{label}</span></div>
      <div className="text-3xl font-extrabold text-mocha-700">{value}</div>
    </div>
  );
}
