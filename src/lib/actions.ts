'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function userId() {
  const s = await auth();
  if (!s?.user?.id) throw new Error('Not authenticated');
  return s.user.id;
}

// ---- Tasks ----
export async function createTask(fd: FormData) {
  const title = String(fd.get('title') || '').trim();
  if (!title) return;
  await prisma.task.create({
    data: {
      title,
      description: (fd.get('description') as string) || null,
      priority: (fd.get('priority') as string) || 'normal',
      area: (fd.get('area') as string) || 'PERSONAL',
      status: (fd.get('status') as string) || 'todo',
      dueDate: fd.get('dueDate') ? new Date(String(fd.get('dueDate'))) : null,
      tags: (fd.get('tags') as string) || '',
      userId: await userId(),
    },
  });
  revalidatePath('/dashboard', 'layout');
}

export async function updateTask(id: string, patch: any) {
  await prisma.task.update({ where: { id }, data: patch });
  revalidatePath('/dashboard', 'layout');
}

export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } });
  revalidatePath('/dashboard', 'layout');
}

// ---- Events ----
export async function createEvent(fd: FormData) {
  const title = String(fd.get('title') || '').trim();
  if (!title) return;
  await prisma.event.create({
    data: {
      title,
      description: (fd.get('description') as string) || null,
      startsAt: new Date(String(fd.get('startsAt'))),
      endsAt: fd.get('endsAt') ? new Date(String(fd.get('endsAt'))) : null,
      allDay: fd.get('allDay') === 'on',
      area: (fd.get('area') as string) || 'PERSONAL',
      color: (fd.get('color') as string) || '#FFA3B8',
      userId: await userId(),
    },
  });
  revalidatePath('/dashboard', 'layout');
}

export async function updateEvent(id: string, patch: any) {
  await prisma.event.update({ where: { id }, data: patch });
  revalidatePath('/dashboard', 'layout');
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({ where: { id } });
  revalidatePath('/dashboard', 'layout');
}

// ---- Notes ----
export async function createNote(fd: FormData) {
  const title = String(fd.get('title') || '').trim();
  if (!title) return;
  await prisma.note.create({
    data: {
      title,
      body: (fd.get('body') as string) || '',
      color: (fd.get('color') as string) || '#FFF5F7',
      userId: await userId(),
    },
  });
  revalidatePath('/dashboard/notes');
}

export async function updateNote(id: string, patch: any) {
  await prisma.note.update({ where: { id }, data: patch });
  revalidatePath('/dashboard/notes');
}

export async function deleteNote(id: string) {
  await prisma.note.delete({ where: { id } });
  revalidatePath('/dashboard/notes');
}

// ---- Habits ----
export async function createHabit(fd: FormData) {
  const name = String(fd.get('name') || '').trim();
  if (!name) return;
  await prisma.habit.create({
    data: {
      name,
      emoji: (fd.get('emoji') as string) || '✨',
      area: (fd.get('area') as string) || 'HEALTH',
      userId: await userId(),
    },
  });
  revalidatePath('/dashboard/life');
}

export async function deleteHabit(id: string) {
  await prisma.habit.delete({ where: { id } });
  revalidatePath('/dashboard/life');
}

export async function toggleHabitLog(habitId: string, date: string) {
  const uid = await userId();
  const existing = await prisma.habitLog.findUnique({ where: { habitId_date: { habitId, date } } });
  if (existing) {
    await prisma.habitLog.delete({ where: { id: existing.id } });
  } else {
    await prisma.habitLog.create({ data: { habitId, userId: uid, date } });
  }
  revalidatePath('/dashboard/life');
}

// ---- Profile ----
export async function updateProfile(fd: FormData) {
  const uid = await userId();
  await prisma.user.update({
    where: { id: uid },
    data: {
      name: (fd.get('name') as string) || null,
      bio: (fd.get('bio') as string) || null,
    },
  });
  revalidatePath('/dashboard', 'layout');
}
