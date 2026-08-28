import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { NotesGrid } from '@/components/NotesGrid';

export default async function NotesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: [{ pinned: 'desc' }, { updatedAt: 'desc' }],
  });
  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-5">
        <h1 className="text-3xl font-extrabold text-mocha-700">Notes 📝</h1>
        <p className="text-mocha-500">Quick thoughts, ideas, and scraps.</p>
      </header>
      <NotesGrid notes={notes} />
    </div>
  );
}
