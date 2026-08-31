'use client';

import { useState, useTransition } from 'react';
import { saveReflection } from '@/lib/actions';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const PROMPTS = [
  'What was one tiny win today?',
  'What made you smile today?',
  'What is something you are proud of starting?',
  'What was a cozy moment today?',
];

export function DailyReflection({ initialContent, stickers }: { initialContent: string; stickers: string[] }) {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(!!initialContent);
  const [isPending, startTransition] = useTransition();

  // Pick a prompt based on the day of the year so it stays consistent for the day
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const prompt = PROMPTS[dayOfYear % PROMPTS.length];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      await saveReflection(content);
      setSaved(true);
    });
  };

  return (
    <div className="card p-5 mt-6 bg-gradient-to-r from-sakura-50/50 to-lavender-50/50 border border-sakura-200/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sakura-400" />
          <h3 className="font-extrabold text-mocha-700 text-sm">{prompt}</h3>
        </div>
        {saved && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setSaved(false);
          }}
          placeholder="Write 1-2 sentences..."
          className="input flex-1 h-10 text-sm py-1.5 px-3 bg-white/80"
        />
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="btn-primary text-xs px-4 h-10"
        >
          {isPending ? 'Saving...' : 'Reflect'}
        </button>
      </form>

      {/* Sticker Rewards Collection */}
      {stickers.length > 0 && (
        <div className="mt-4 pt-3 border-t border-mocha-500/10 flex items-center justify-between">
          <span className="text-[11px] font-bold text-mocha-500 uppercase tracking-wide">
            Sticker Reward Collection ({stickers.length})
          </span>
          <div className="flex gap-1.5 text-lg">
            {stickers.slice(0, 10).map((sticker, idx) => (
              <span key={idx} className="hover:scale-125 transition-transform cursor-default" title="Reflection Sticker">
                {sticker}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
