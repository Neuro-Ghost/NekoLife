'use client';

import { useState } from 'react';
import { createTask, updateTask, deleteTask } from '@/lib/actions';
import { AREA_META, cn } from '@/lib/utils';
import { Plus, Check, Trash2, Flag, X } from 'lucide-react';

const COLUMNS = [
  { id: 'todo',  label: 'To Do',    emoji: '🌙', tone: 'bg-lavender-100' },
  { id: 'doing', label: 'Doing',    emoji: '🐾', tone: 'bg-cream-100' },
  { id: 'later', label: 'Later',    emoji: '🌸', tone: 'bg-sakura-100' },
  { id: 'done',  label: 'Done',     emoji: '✨', tone: 'bg-mint-100' },
];

const PRIO: Record<string, { color: string; label: string }> = {
  low:    { color: 'bg-mint-200 text-mocha-600',     label: 'Low' },
  normal: { color: 'bg-lavender-200 text-mocha-600', label: 'Normal' },
  high:   { color: 'bg-cream-200 text-mocha-700',    label: 'High' },
  urgent: { color: 'bg-sakura-300 text-white',       label: 'Urgent' },
};

export function TasksBoard({ tasks }: { tasks: any[] }) {
  const [show, setShow] = useState(false);
  const [quick, setQuick] = useState('');

  async function quickSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const t = quick.trim();
    if (!t) return;
    const fd = new FormData();
    fd.set('title', t);
    await createTask(fd);
    setQuick('');
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button onClick={() => setShow(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> New task
        </button>
        <form onSubmit={quickSubmit} className="flex gap-2 flex-1 min-w-[260px]">
          <input name="title" value={quick} onChange={(e) => setQuick(e.target.value)} placeholder="Quick add... (press Enter)" className="input" />
          <button type="submit" className="btn-outline">Add</button>
        </form>
      </div>

      {show && <TaskModal onClose={() => setShow(false)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => (col.id === 'done' ? t.done : t.status === col.id && !t.done));
          return (
            <div key={col.id} className={`rounded-2xl ${col.tone} p-3 min-h-[320px]`}>
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="font-bold text-mocha-700">{col.emoji} {col.label}</div>
                <span className="text-xs font-semibold text-mocha-500 bg-white/60 px-2 py-0.5 rounded-full">{colTasks.length}</span>
              </div>
              <div className="space-y-2">
                {colTasks.map((t) => {
                  const meta = AREA_META[t.area] || AREA_META.PERSONAL;
                  const p = PRIO[t.priority] || PRIO.normal;
                  return (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('taskId', t.id)}
                      className="card p-3 cursor-grab active:cursor-grabbing hover:shadow-glow transition"
                    >
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => updateTask(t.id, { done: !t.done, status: t.done ? 'todo' : 'done' })}
                          className={cn(
                            'mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition shrink-0',
                            t.done ? 'bg-mint-300 border-mint-300 text-white' : 'border-sakura-300 hover:border-sakura-400'
                          )}
                        >
                          {t.done && <Check className="w-3 h-3" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className={cn('font-semibold text-sm', t.done && 'line-through text-mocha-500/60')}>{t.title}</div>
                          {t.description && <div className="text-xs text-mocha-500 mt-1 line-clamp-2">{t.description}</div>}
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            <span className="tag" style={{ background: meta.color + '55', color: '#4A3828' }}>{meta.emoji} {meta.label}</span>
                            <span className={cn('tag', p.color)}><Flag className="w-3 h-3" />{p.label}</span>
                          </div>
                          {t.dueDate && (
                            <div className="text-xs text-mocha-500 mt-1">
                              📅 {new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                          )}
                        </div>
                        <button onClick={() => deleteTask(t.id)} className="text-mocha-500/60 hover:text-sakura-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {colTasks.length === 0 && (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                      const id = e.dataTransfer.getData('taskId');
                      if (!id) return;
                      if (col.id === 'done') await updateTask(id, { done: true, status: 'done' });
                      else await updateTask(id, { done: false, status: col.id });
                    }}
                    className="border-2 border-dashed border-mocha-500/20 rounded-xl p-4 text-center text-xs text-mocha-500"
                  >
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskModal({ onClose }: { onClose: () => void }) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createTask(fd);
    onClose();
  }
  return (
    <div className="fixed inset-0 bg-mocha-700/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        className="card p-6 w-full max-w-lg space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-mocha-700 text-lg">New task 🐾</h3>
          <button type="button" onClick={onClose} className="text-mocha-500 hover:text-mocha-700"><X className="w-5 h-5" /></button>
        </div>
        <input name="title" required placeholder="What needs doing?" className="input" autoFocus />
        <textarea name="description" placeholder="Details (optional)" rows={3} className="input resize-none" />
        <div className="grid grid-cols-2 gap-2">
          <select name="priority" defaultValue="normal" className="input">
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <select name="area" defaultValue="PERSONAL" className="input">
            {Object.entries(AREA_META).map(([k, v]) => (
              <option key={k} value={k}>{v.emoji} {v.label}</option>
            ))}
          </select>
          <select name="status" defaultValue="todo" className="input">
            <option value="todo">To Do</option>
            <option value="doing">Doing</option>
            <option value="later">Later</option>
          </select>
          <input name="dueDate" type="date" className="input" />
        </div>
        <input name="tags" placeholder="Tags (comma separated)" className="input" />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button className="btn-primary">Create task</button>
        </div>
      </form>
    </div>
  );
}
