'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { format } from 'date-fns';

const STICKERS = ['🌸', '✨', '🐾', '🍵', '🌿', '🎨', '🌙'];

/**
 * Retrieves the current authenticated user ID.
 * Throws an explicit error if the user is unauthenticated.
 */
async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
}

/**
 * Safely parses string inputs into valid Date objects.
 */
function parseDate(value: FormDataEntryValue | null): Date | null {
  if (!value) return null;
  const parsed = new Date(String(value));
  return isNaN(parsed.getTime()) ? null : parsed;
}

// ==========================================
// TASK ACTIONS
// ==========================================

export async function createTask(fd: FormData) {
  const userId = await requireUserId();
  const title = String(fd.get('title') || '').trim();
  if (!title) return;

  await prisma.task.create({
    data: {
      title,
      description: (fd.get('description') as string) || null,
      priority: (fd.get('priority') as string) || 'normal',
      area: (fd.get('area') as string) || 'PERSONAL',
      status: (fd.get('status') as string) || 'todo',
      dueDate: parseDate(fd.get('dueDate')),
      tags: (fd.get('tags') as string) || '',
      userId,
    },
  });

  revalidatePath('/dashboard', 'layout');
}

export async function updateTask(
  id: string,
  patch: Prisma.TaskUpdateInput
) {
  const userId = await requireUserId();

  await prisma.task.updateMany({
    where: { id, userId },
    data: patch,
  });

  revalidatePath('/dashboard', 'layout');
}

export async function deleteTask(id: string) {
  const userId = await requireUserId();

  await prisma.task.deleteMany({
    where: { id, userId },
  });

  revalidatePath('/dashboard', 'layout');
}

// ==========================================
// EVENT ACTIONS
// ==========================================

export async function createEvent(fd: FormData) {
  const userId = await requireUserId();
  const title = String(fd.get('title') || '').trim();
  const startsAt = parseDate(fd.get('startsAt'));

  if (!title || !startsAt) return;

  await prisma.event.create({
    data: {
      title,
      description: (fd.get('description') as string) || null,
      startsAt,
      endsAt: parseDate(fd.get('endsAt')),
      allDay: fd.get('allDay') === 'on' || fd.get('allDay') === 'true',
      area: (fd.get('area') as string) || 'PERSONAL',
      color: (fd.get('color') as string) || '#FFA3B8',
      userId,
    },
  });

  revalidatePath('/dashboard', 'layout');
}

export async function updateEvent(
  id: string,
  patch: Prisma.EventUpdateInput
) {
  const userId = await requireUserId();

  await prisma.event.updateMany({
    where: { id, userId },
    data: patch,
  });

  revalidatePath('/dashboard', 'layout');
}

export async function deleteEvent(id: string) {
  const userId = await requireUserId();

  await prisma.event.deleteMany({
    where: { id, userId },
  });

  revalidatePath('/dashboard', 'layout');
}

// ==========================================
// NOTE ACTIONS
// ==========================================

export async function createNote(fd: FormData) {
  const userId = await requireUserId();
  const title = String(fd.get('title') || '').trim();
  if (!title) return;

  await prisma.note.create({
    data: {
      title,
      body: (fd.get('body') as string) || '',
      color: (fd.get('color') as string) || '#FFF5F7',
      userId,
    },
  });

  revalidatePath('/dashboard/notes');
}

export async function updateNote(
  id: string,
  patch: Prisma.NoteUpdateInput
) {
  const userId = await requireUserId();

  await prisma.note.updateMany({
    where: { id, userId },
    data: patch,
  });

  revalidatePath('/dashboard/notes');
}

export async function deleteNote(id: string) {
  const userId = await requireUserId();

  await prisma.note.deleteMany({
    where: { id, userId },
  });

  revalidatePath('/dashboard/notes');
}

// ==========================================
// HABIT ACTIONS
// ==========================================

export async function createHabit(fd: FormData) {
  const userId = await requireUserId();
  const name = String(fd.get('name') || '').trim();
  if (!name) return;

  await prisma.habit.create({
    data: {
      name,
      emoji: (fd.get('emoji') as string) || '✨',
      area: (fd.get('area') as string) || 'HEALTH',
      userId,
    },
  });

  revalidatePath('/dashboard/life');
}

export async function deleteHabit(id: string) {
  const userId = await requireUserId();

  await prisma.habit.deleteMany({
    where: { id, userId },
  });

  revalidatePath('/dashboard/life');
}

export async function toggleHabitLog(habitId: string, date: string) {
  const userId = await requireUserId();

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) {
    console.warn(`Habit ${habitId} not found for user ${userId}`);
    revalidatePath('/dashboard/life');
    return { error: 'Habit not found' };
  }

  const existing = await prisma.habitLog.findFirst({
    where: { habitId, date, userId },
  });

  if (existing) {
    await prisma.habitLog.delete({ where: { id: existing.id } });
  } else {
    await prisma.habitLog.create({
      data: { habitId, userId, date },
    });
  }

  revalidatePath('/dashboard/life');
  return { success: true };
}

// ==========================================
// REFLECTION ACTIONS
// ==========================================

export async function saveReflection(content: string) {
  const userId = await requireUserId();
  const today = format(new Date(), 'yyyy-MM-dd');
  const randomSticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];

  try {
    const existing = await prisma.reflection.findFirst({
      where: { userId, date: today },
    });

    if (existing) {
      await prisma.reflection.update({
        where: { id: existing.id },
        data: { content },
      });
    } else {
      await prisma.reflection.create({
        data: {
          userId,
          date: today,
          content,
          sticker: randomSticker,
        },
      });
    }

    revalidatePath('/dashboard/life');
    return { success: true };
  } catch (error) {
    console.error('Error saving reflection:', error);
    return { error: 'Failed to save reflection' };
  }
}

export async function getReflectionData() {
  try {
    const userId = await requireUserId();
    const today = format(new Date(), 'yyyy-MM-dd');

    const entries = await prisma.reflection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const todayEntry = entries.find((e) => e.date === today);
    const stickers = entries.map((e) => e.sticker);

    return {
      todayReflection: todayEntry?.content || '',
      totalCount: entries.length,
      stickers,
    };
  } catch (error) {
    console.error('Error fetching reflection data:', error);
    return {
      todayReflection: '',
      totalCount: 0,
      stickers: [],
    };
  }
}

// ==========================================
// PROFILE ACTIONS
// ==========================================

export async function updateProfile(fd: FormData) {
  const userId = await requireUserId();

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: (fd.get('name') as string) || null,
      bio: (fd.get('bio') as string) || null,
    },
  });

  revalidatePath('/dashboard', 'layout');
}
