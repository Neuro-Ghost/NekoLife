'use client';

import { useEffect, useState } from 'react';

const CATS = [
  { mood: 'happy',  emoji: '😺', text: "Purrfect. You're doing great." },
  { mood: 'love',   emoji: '😻', text: 'So many tasks done today! Nyan~' },
  { mood: 'sleep',  emoji: '😸', text: 'Remember to rest, hooman.' },
  { mood: 'wave',   emoji: '🐾', text: 'Welcome back to Neko Life!' },
];

export function CatMascot() {
  const [i, setI] = useState(0);
  useEffect(() => { setI(Math.floor(Math.random() * CATS.length)); }, []);
  const cat = CATS[i];
  return (
    <div className="card bg-gradient-to-r from-sakura-100 via-cream-100 to-lavender-100 p-4 mb-6 flex items-center gap-4">
      <div className="text-4xl">{cat.emoji}</div>
      <div className="flex-1">
        <div className="text-sm font-bold text-mocha-700">Your neko says:</div>
        <div className="text-mocha-600">{cat.text}</div>
      </div>
    </div>
  );
}
