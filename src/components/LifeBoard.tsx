'use client';

import { useState } from 'react';
import { createHabit, deleteHabit, toggleHabitLog } from '@/lib/actions';
import { AREA_META, cn } from '@/lib/utils';
import { Plus, Trash2, Flame, X } from 'lucide-react';
import { format, subDays } from 'date-fns';

const COMMON_EMOJIS = ['✨', '💧', '🏃', '📚', '🧘', '🥗', '🏋️', '😴', '💊', '🎸', '💻', '🎨', '🌱', '☀️', '☕'];

export function LifeBoard({ habits }: { habits: any[] }) {
  const [show, setShow] = useState(false);
  const [emoji, setEmoji] = useState('✨');
  const [name, setName] = useState('');

  const last7 = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'));
  const labels = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), 'EEE'));

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formData = new FormData(e.currentTarget);
    await createHabit(formData);

    setName('');
    setEmoji('✨');
    setShow(false);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setShow(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> New habit
        </button>
      </div>

      <div className="card p-5">
        {/* Table Header */}
        <div className="flex items-center gap-3 pb-3 mb-2 border-b border-mocha-500/10">
          <div className="w-56 text-xs font-bold text-mocha-500 uppercase tracking-wide">Habit</div>
          <div className="flex-1 hidden md:flex gap-2">
            {labels.map((l, i) => (
              <div key={i} className="flex-1 text-xs font-bold text-mocha-500 text-center">
                {l}
              </div>
            ))}
          </div>
          <div className="w-16 text-xs font-bold text-mocha-500 text-center">Streak</div>
          <div className="w-8"></div>
        </div>

        {/* Habit Rows */}
        <div className="space-y-3">
          {habits.map((h) => {
            const logSet = new Set(h.logs.map((l: any) => l.date));
            const streak = computeStreak(h.logs.map((l: any) => l.date));
            const meta = AREA_META[h.area] || AREA_META.HEALTH;

            return (
              <div key={h.id} className="flex items-center gap-3 py-1">
                {/* Habit Details */}
                <div className="w-56 flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl shrink-0">{h.emoji}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-mocha-700 truncate">{h.name}</div>
                    <span className="tag text-[10px]" style={{ background: meta.color + '55', color: '#4A3828' }}>
                      {meta.emoji} {meta.label}
                    </span>
                  </div>
                </div>

                {/* Last 7 Days Checkboxes */}
                <div className="flex-1 hidden md:flex gap-2">
                  {last7.map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleHabitLog(h.id, d)}
                      className={cn(
                        'flex-1 h-10 rounded-lg flex items-center justify-center transition border',
                        logSet.has(d)
                          ? 'bg-gradient-to-br from-sakura-200 to-lavender-200 border-sakura-300 font-bold text-mocha-700'
                          : 'border-mocha-500/10 hover:border-sakura-300'
                      )}
                      title={d}
                    >
                      {logSet.has(d) ? '✓' : ''}
                    </button>
                  ))}
                </div>

                {/* Streak Badge */}
                <div className="w-16 flex items-center justify-center gap-1 font-bold text-mocha-700">
                  <Flame className={cn('w-4 h-4', streak > 0 ? 'text-sakura-400' : 'text-mocha-500/50')} />
                  {streak}
                </div>

                {/* Delete Button */}
                <button onClick={() => deleteHabit(h.id)} className="w-8 flex justify-center text-mocha-500/60 hover:text-sakura-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {habits.length === 0 && (
          <div className="text-center text-mocha-500 py-8">
            <div className="text-5xl mb-2">🐱</div>
            No habits yet. Start small — one tiny habit is plenty.
          </div>
        )}
      </div>

      {/* New Habit Modal */}
      {show && (
        <div
          className="fixed inset-0 bg-mocha-700/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShow(false)}
        >
          <form
            onSubmit={handleCreate}
            className="card p-6 w-full max-w-md space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-mocha-700 text-lg">New habit 🌱</h3>
              <button type="button" onClick={() => setShow(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-3 items-end">
              <div>
                <label className="block text-xs font-semibold text-mocha-500 mb-1">Emoji</label>
                <select
                  name="emoji"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="input w-16 text-center text-lg h-10 py-1 px-1 cursor-pointer"
                >
                  {COMMON_EMOJIS.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-mocha-500 mb-1">Habit Name</label>
                <input
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Drink water"
                  className="input w-full h-10 py-1.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-mocha-500 mb-1">Area</label>
              <select name="area" defaultValue="HEALTH" className="input w-full">
                {Object.entries(AREA_META).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.emoji} {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShow(false)} className="btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates);
  let streak = 0;
  let d = new Date();
  while (true) {
    const key = format(d, 'yyyy-MM-dd');
    if (set.has(key)) {
      streak++;
      d = subDays(d, 1);
    } else break;
  }
  return streak;
}
