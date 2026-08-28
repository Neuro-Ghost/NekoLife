'use client';

import { useState } from 'react';
import { createHabit, deleteHabit, toggleHabitLog } from '@/lib/actions';
import { AREA_META, cn } from '@/lib/utils';
import { Plus, Trash2, Flame, X } from 'lucide-react';
import { format, subDays } from 'date-fns';

export function LifeBoard({ habits }: { habits: any[] }) {
  const [show, setShow] = useState(false);
  const last7 = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'));
  const labels = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), 'EEE'));

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setShow(true)} className="btn-primary"><Plus className="w-4 h-4" /> New habit</button>
      </div>

      <div className="card p-5">
        <div className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[2fr_repeat(7,1fr)_auto] items-center gap-2">
          <div className="text-xs font-bold text-mocha-500 uppercase tracking-wide">Habit</div>
          {labels.map((l, i) => (
            <div key={i} className="text-xs font-bold text-mocha-500 text-center hidden md:block">{l}</div>
          ))}
          <div className="text-xs font-bold text-mocha-500 text-center">Streak</div>
          <div></div>

          {habits.map((h) => {
            const logSet = new Set(h.logs.map((l: any) => l.date));
            const streak = computeStreak(h.logs.map((l: any) => l.date));
            const meta = AREA_META[h.area] || AREA_META.HEALTH;
            return (
              <div key={h.id} className="contents">
                <div className="flex items-center gap-2 py-2">
                  <span className="text-2xl">{h.emoji}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-mocha-700 truncate">{h.name}</div>
                    <span className="tag text-[10px]" style={{ background: meta.color + '55', color: '#4A3828' }}>{meta.emoji} {meta.label}</span>
                  </div>
                </div>
                {last7.map((d) => (
                  <button
                    key={d}
                    onClick={() => toggleHabitLog(h.id, d)}
                    className={cn(
                      'hidden md:flex h-10 rounded-lg items-center justify-center transition border',
                      logSet.has(d) ? 'bg-gradient-to-br from-sakura-200 to-lavender-200 border-sakura-300' : 'border-mocha-500/10 hover:border-sakura-300'
                    )}
                    title={d}
                  >
                    {logSet.has(d) ? '✓' : ''}
                  </button>
                ))}
                <div className="flex items-center gap-1 justify-center font-bold text-mocha-700">
                  <Flame className={cn('w-4 h-4', streak > 0 ? 'text-sakura-400' : 'text-mocha-500/50')} />
                  {streak}
                </div>
                <button onClick={() => deleteHabit(h.id)} className="text-mocha-500/60 hover:text-sakura-400 p-1">
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

      {show && (
        <div className="fixed inset-0 bg-mocha-700/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShow(false)}>
          <form
            onSubmit={async (e) => { e.preventDefault(); await createHabit(new FormData(e.currentTarget)); setShow(false); }}
            className="card p-6 w-full max-w-md space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-mocha-700 text-lg">New habit 🌱</h3>
              <button type="button" onClick={() => setShow(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex gap-2">
              <input name="emoji" defaultValue="✨" className="input w-20 text-center text-2xl" maxLength={3} />
              <input name="name" required placeholder="e.g. Drink water" className="input flex-1" autoFocus />
            </div>
            <select name="area" defaultValue="HEALTH" className="input">
              {Object.entries(AREA_META).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShow(false)} className="btn-ghost">Cancel</button>
              <button className="btn-primary">Create</button>
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
    if (set.has(key)) { streak++; d = subDays(d, 1); }
    else break;
  }
  return streak;
}
