'use client';

import { useState } from 'react';
import { createNote, updateNote, deleteNote } from '@/lib/actions';
import { Plus, X, Pin, Trash2 } from 'lucide-react';

const COLORS = ['#FFF5F7', '#FFE0E8', '#E8DFFF', '#FFF8F1', '#D1F7E2', '#FFE0B0', '#FFC2D1'];

export function NotesGrid({ notes }: { notes: any[] }) {
  const [editing, setEditing] = useState<any | null>(null);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setEditing({ id: null, title: '', body: '', color: '#FFF5F7' })} className="btn-primary">
          <Plus className="w-4 h-4" /> New note
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {notes.map((n) => (
          <div key={n.id} className="card p-4 group relative cursor-pointer hover:shadow-glow transition" style={{ background: n.color }} onClick={() => setEditing(n)}>
            {n.pinned && <div className="absolute top-2 right-2 text-sakura-400"><Pin className="w-4 h-4" fill="currentColor" /></div>}
            <div className="font-bold text-mocha-700 mb-1 pr-6">{n.title}</div>
            <div className="text-sm text-mocha-600 whitespace-pre-wrap line-clamp-6">{n.body}</div>
            <div className="text-xs text-mocha-500/70 mt-3">
              {new Date(n.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="col-span-full text-center text-mocha-500 py-12">
            <div className="text-5xl mb-2">🐾</div>
            No notes yet. Start scribbling!
          </div>
        )}
      </div>

      {editing && (
        <NoteEditor
          initial={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function NoteEditor({ initial, onClose }: { initial: any; onClose: () => void }) {
  const [title, setTitle] = useState(initial.title);
  const [body, setBody] = useState(initial.body || '');
  const [color, setColor] = useState(initial.color);

  async function save() {
    if (!title.trim()) return;
    if (initial.id) {
      await updateNote(initial.id, { title, body, color });
    } else {
      const fd = new FormData();
      fd.set('title', title); fd.set('body', body); fd.set('color', color);
      await createNote(fd);
    }
    onClose();
  }

  async function remove() {
    if (initial.id && confirm('Delete this note?')) {
      await deleteNote(initial.id);
      onClose();
    }
  }

  async function togglePin() {
    if (initial.id) await updateNote(initial.id, { pinned: !initial.pinned });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-mocha-700/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="card p-5 w-full max-w-xl space-y-3" style={{ background: color }}>
        <div className="flex items-center gap-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="input bg-white/60" autoFocus />
          {initial.id && <button onClick={togglePin} className="btn-ghost p-2" title="Pin"><Pin className="w-4 h-4" /></button>}
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} placeholder="Write anything..." className="input bg-white/60 resize-none" />
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)} className={`w-6 h-6 rounded-full border-2 transition ${color === c ? 'border-mocha-700 scale-110' : 'border-white'}`} style={{ background: c }} />
          ))}
        </div>
        <div className="flex justify-between pt-2">
          <button onClick={remove} className="btn-ghost text-sakura-400 hover:bg-sakura-50">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          <button onClick={save} className="btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
}
