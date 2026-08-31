'use client';

import { useState, useTransition } from 'react';
import { saveReflection } from '@/lib/actions';

interface DailyReflectionProps {
  initialContent: string;
  stickers: string[];
}

export function DailyReflection({ initialContent, stickers }: DailyReflectionProps) {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    setSaved(false);
    startTransition(async () => {
      const res = await saveReflection(content);
      if (res?.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-mocha-100 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-mocha-700 flex items-center gap-2">
            Daily Reflection 📝
          </h2>
          <p className="text-sm text-mocha-500">
            Jot down quick thoughts, wins, or how today felt.
          </p>
        </div>

        {/* Sticker Collection Counter */}
        <div className="flex items-center gap-1.5 bg-mocha-50 px-3 py-1.5 rounded-full border border-mocha-100 text-sm font-medium text-mocha-600">
          <span>Stickers earned:</span>
          <span className="font-bold text-mocha-800">{stickers.length}</span>
          <span className="text-base">✨</span>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="How did today go? What are you grateful for?"
        className="w-full h-28 p-3 text-sm text-mocha-800 bg-mocha-50/50 rounded-xl border border-mocha-200 focus:outline-none focus:ring-2 focus:ring-mocha-400 focus:bg-white transition-all resize-none"
      />

      <div className="flex items-center justify-between">
        {/* Save confirmation message */}
        <div>
          {saved && (
            <span className="text-sm font-medium text-emerald-600 flex items-center gap-1 animate-fade-in">
               Saved & sticker awarded! 🎉
            </span>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={isPending || !content.trim()}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-mocha-600 hover:bg-mocha-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {isPending ? 'Saving...' : 'Save Entry'}
        </button>
      </div>

      {/* Recent Stickers Grid */}
      {stickers.length > 0 && (
        <div className="pt-3 border-t border-mocha-100">
          <p className="text-xs font-semibold text-mocha-400 uppercase tracking-wider mb-2">
            Your Reflection Collection
          </p>
          <div className="flex flex-wrap gap-2 text-xl">
            {stickers.map((sticker, idx) => (
              <span
                key={idx}
                className="w-8 h-8 rounded-lg bg-mocha-50 flex items-center justify-center border border-mocha-100"
                title={`Reflection ${idx + 1}`}
              >
                {sticker}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
