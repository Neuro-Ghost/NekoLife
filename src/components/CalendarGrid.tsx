'use client';

import { useMemo, useState } from 'react';
import { createEvent, deleteEvent } from '@/lib/actions';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, addMonths, subMonths, isSameMonth, isSameDay, isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CalendarGrid({ events, tasks }: { events: any[]; tasks: any[] }) {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const days = useMemo(() => {
    const s = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const e = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: s, end: e });
  }, [cursor]);

  const itemsFor = (d: Date) => {
    const list: { id: string; title: string; color: string; time?: string }[] = [];
    events.forEach((ev) => {
      if (isSameDay(new Date(ev.startsAt), d)) {
        list.push({
          id: ev.id, title: ev.title, color: ev.color,
          time: ev.allDay ? undefined : format(new Date(ev.startsAt), 'HH:mm'),
        });
      }
    });
    tasks.forEach((t) => {
      if (t.dueDate && isSameDay(new Date(t.dueDate), d)) {
        list.push({ id: `t-${t.id}`, title: `✅ ${t.title}`, color: '#FFA3B8' });
      }
    });
    return list;
  };

  const selectedItems = selected ? itemsFor(selected) : [];

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setCursor(subMonths(cursor, 1))} className="btn-ghost p-2"><ChevronLeft className="w-5 h-5" /></button>
          <div className="font-extrabold text-mocha-700 text-lg">{format(cursor, 'MMMM yyyy')}</div>
          <button onClick={() => setCursor(addMonths(cursor, 1))} className="btn-ghost p-2"><ChevronRight className="w-5 h-5" /></button>
          <button onClick={() => setShowCreate(true)} className="btn-primary"><Plus className="w-4 h-4" /> Event</button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-mocha-500 mb-1">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => <div key={d} className="py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => {
            const items = itemsFor(d);
            const active = selected && isSameDay(selected, d);
            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelected(d)}
                className={cn(
                  'relative aspect-square rounded-xl p-1.5 text-left transition border',
                  !isSameMonth(d, cursor) && 'opacity-40',
                  isToday(d) && 'ring-2 ring-sakura-300',
                  active ? 'bg-sakura-100 border-sakura-300' : 'border-transparent hover:bg-cream-100'
                )}
              >
                <div className={cn('text-xs font-bold', isToday(d) ? 'text-sakura-400' : 'text-mocha-600')}>{format(d, 'd')}</div>
                <div className="mt-0.5 space-y-0.5 overflow-hidden">
                  {items.slice(0, 3).map((it) => (
                    <div key={it.id} className="text-[10px] font-semibold truncate rounded px-1" style={{ background: it.color + '55', color: '#4A3828' }}>
                      {it.time && <span className="mr-0.5">{it.time}</span>}{it.title}
                    </div>
                  ))}
                  {items.length > 3 && <div className="text-[10px] text-mocha-500">+{items.length - 3}</div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card p-4">
        <div className="font-bold text-mocha-700 mb-2">
          {selected ? format(selected, 'EEEE, MMMM d') : 'Pick a day'}
        </div>
        {selected ? (
          selectedItems.length === 0 ? (
            <div className="text-sm text-mocha-500">Nothing scheduled. 🌸</div>
          ) : (
            <ul className="space-y-2">
              {selectedItems.map((it) => (
                <li key={it.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-cream-50">
                  <div className="w-2 h-2 rounded-full mt-2" style={{ background: it.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-mocha-700">{it.title}</div>
                    {it.time && <div className="text-xs text-mocha-500">{it.time}</div>}
                  </div>
                  {!it.id.startsWith('t-') && (
                    <button onClick={() => deleteEvent(it.id)} className="text-mocha-500/60 hover:text-sakura-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )
        ) : (
          <div className="text-sm text-mocha-500">Click a date to see details.</div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-mocha-700/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <form
            onSubmit={async (e) => { e.preventDefault(); await createEvent(new FormData(e.currentTarget)); setShowCreate(false); }}
            className="card p-6 w-full max-w-lg space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-mocha-700 text-lg">New event 🌟</h3>
              <button type="button" onClick={() => setShowCreate(false)}><X className="w-5 h-5" /></button>
            </div>
            <input name="title" required placeholder="Event title" className="input" autoFocus />
            <textarea name="description" rows={2} placeholder="Details" className="input resize-none" />
            <div className="grid grid-cols-2 gap-2">
              <input name="startsAt" type="datetime-local" required defaultValue={selected ? format(selected, "yyyy-MM-dd'T'09:00") : ''} className="input" />
              <input name="endsAt" type="datetime-local" className="input" />
              <select name="area" defaultValue="PERSONAL" className="input">
                {['PERSONAL','WORK','HEALTH','STUDY','HOME','FINANCE','SOCIAL'].map((a) => <option key={a}>{a}</option>)}
              </select>
              <input name="color" type="color" defaultValue="#FFA3B8" className="input" />
            </div>
            <label className="flex items-center gap-2 text-sm text-mocha-600">
              <input type="checkbox" name="allDay" className="accent-sakura-400" /> All day
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowCreate(false)} className="btn-ghost">Cancel</button>
              <button className="btn-primary">Create event</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
