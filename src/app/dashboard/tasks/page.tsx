import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { TasksBoard } from '@/components/TasksBoard';

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-5 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-mocha-700">Tasks 📋</h1>
          <p className="text-mocha-500">Drag tasks between columns to change their status.</p>
        </div>
      </header>
      <TasksBoard tasks={tasks} />
    </div>
  );
}
