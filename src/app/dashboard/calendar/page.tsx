import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { CalendarGrid } from '@/components/CalendarGrid';

export default async function CalendarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const events = await prisma.event.findMany({
    where: { userId: session.user.id },
    orderBy: { startsAt: 'asc' },
  });

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id, dueDate: { not: null } },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-5">
        <h1 className="text-3xl font-extrabold text-mocha-700">Calendar 📅</h1>
        <p className="text-mocha-500">Events and due tasks on a single view.</p>
      </header>
      <CalendarGrid events={events} tasks={tasks} />
    </div>
  );
}
