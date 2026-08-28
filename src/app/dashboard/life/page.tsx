import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { LifeBoard } from '@/components/LifeBoard';

export default async function LifePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: { logs: { orderBy: { date: 'desc' } } },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-5">
        <h1 className="text-3xl font-extrabold text-mocha-700">Life 🌱</h1>
        <p className="text-mocha-500">Habits, streaks, and the areas that make up your days.</p>
      </header>
      <LifeBoard habits={habits} />
    </div>
  );
}
