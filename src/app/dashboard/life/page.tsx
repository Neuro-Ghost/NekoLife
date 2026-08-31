import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getReflectionData } from '@/lib/actions';
import { LifeBoard } from '@/components/LifeBoard';
import { DailyReflection } from '@/components/DailyReflection';

export default async function LifePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  // Fetch user habits along with their logs
  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: { logs: { orderBy: { date: 'desc' } } },
    orderBy: { createdAt: 'asc' },
  });

  // Fetch daily reflection and sticker history
  const { todayReflection, stickers } = await getReflectionData();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="mb-5">
        <h1 className="text-3xl font-extrabold text-mocha-700">Life 🌱</h1>
        <p className="text-mocha-500">Habits, streaks, and the areas that make up your days.</p>
      </header>

      {/* Habit tracking grid */}
      <LifeBoard habits={habits} />

      {/* Micro-journaling & Sticker Rewards section */}
      <DailyReflection initialContent={todayReflection} stickers={stickers} />
    </div>
  );
}
