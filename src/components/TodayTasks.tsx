'use client';

import { updateTask, deleteTask } from '@/lib/actions';
import { AREA_META } from '@/lib/utils';
import { Check, Trash2, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIO: Record<string, { color: string; label: string }> = {
  low:    { color: 'bg-mint-200 text-mocha-600',     label: 'Low' },
  normal: { color: 'bg-lavender-200 text-mocha-600', label: 'Normal' },
  high:   { color: 'bg-cream-200 text-mocha-700',     label: 'High' },
  urgent: { color: 'bg-sakura-300 text-white',        label: 'Urgent' },
};

export function TodayTasks({ tasks }: { tasks: any[] }) {
  if (tasks.length === 0) {
    return <div className="text-sm text-mocha-500 py-4 text-center">No open tasks — go add some, or enjoy the calm. 🌿</div>;
  }
  return (
    <ul className="space-y-2">
      {tasks.map((t) => {
        const meta = AREA_META[t.area] || AREA_META.PERSONAL;
        const p = PRIO[t.priority] || PRIO.normal;
        return (
          <li key={t.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-cream-50 transition group">
            <button
              onClick={() => updateTask(t.id, { done: !t.done, status: t.done ? 'todo' : 'done' })}
              className={cn(
                'w-5 h-5 rounded-md border-2 flex items-center justify-center transition',
                t.done ? 'bg-mint-300 border-mint-300 text-white' : 'border-sakura-300 hover:border-sakura-400'
              )}
              title="Toggle done"
            >
              {t.done && <Check className="w-3 h-3" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className={cn('font-semibold text-sm truncate', t.done && 'line-through text-mocha-500/60')}>
                {t.title}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="tag" style={{ background: meta.color + '55', color: '#4A3828' }}>{meta.emoji} {meta.label}</span>
                <span className={cn('tag', p.color)}><Flag className="w-3 h-3" />{p.label}</span>
                {t.dueDate && (
                  <span className="text-xs text-mocha-500">
                    {new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => deleteTask(t.id)}
              className="opacity-0 group-hover:opacity-100 text-mocha-500 hover:text-sakura-400 transition p-1"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
