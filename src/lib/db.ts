import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper function to safely fetch reflection data inside Server Components
export async function fetchReflectionData() {
  const session = await auth();
  if (!session?.user?.id) return { todayReflection: '', stickers: {} };

  const today = new Date().toISOString().split('T')[0];

  const [todayReflection, reflections] = await Promise.all([
    prisma.reflection.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
    }),
    prisma.reflection.findMany({
      where: { userId: session.user.id },
      select: { date: true, sticker: true },
    }),
  ]);

  const stickers = reflections.reduce((acc, curr) => {
    acc[curr.date] = curr.sticker;
    return acc;
  }, {} as Record<string, string>);

  return {
    todayReflection: todayReflection?.content || '',
    stickers,
  };
}
