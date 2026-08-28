import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Sidebar } from '@/components/Sidebar';
import { CatMascot } from '@/components/CatMascot';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true, bio: true, theme: true },
  });

  async function logout() {
    'use server';
    await signOut({ redirectTo: '/' });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-sakura-50 to-lavender-50 flex">
      <Sidebar user={user} logoutAction={logout} />
      <main className="flex-1 min-w-0 p-6 md:p-10 overflow-y-auto">
        <CatMascot />
        {children}
      </main>
    </div>
  );
}
