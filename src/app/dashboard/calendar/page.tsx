import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { CalendarGrid } from '@/components/CalendarGrid';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  let events = [];
  let tasks = [];

  try {
    events = await prisma.event.findMany({
      where: { userId: session.user.id },
      orderBy: { startsAt: 'asc' },
    });

    tasks = await prisma.task.findMany({
      where: { userId: session.user.id, dueDate: { not: null } },
    });
  } catch (error) {
    console.error('Failed to fetch calendar data during build/render:', error);
  }

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
