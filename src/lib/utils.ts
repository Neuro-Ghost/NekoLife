import { clsx, type ClassValue } from 'clsx';

export function cn(...v: ClassValue[]) { return clsx(v); }

export const AREA_META: Record<string, { label: string; color: string; emoji: string }> = {
  WORK:     { label: 'Work',     color: '#B8A4FF', emoji: '💼' },
  HEALTH:   { label: 'Health',   color: '#A8EFC8', emoji: '🌿' },
  STUDY:    { label: 'Study',    color: '#FFC2D1', emoji: '📚' },
  PERSONAL: { label: 'Personal', color: '#FFE0B0', emoji: '🐾' },
  HOME:     { label: 'Home',     color: '#D1F7E2', emoji: '🏡' },
  FINANCE:  { label: 'Finance',  color: '#FFD98E', emoji: '💰' },
  SOCIAL:   { label: 'Social',   color: '#FFA3B8', emoji: '☕' },
};

export function formatDate(d: Date | string | null | undefined) {
  if (!d) return '';
  const dt = typeof d === 'string' ? new Date(d) : d;
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
