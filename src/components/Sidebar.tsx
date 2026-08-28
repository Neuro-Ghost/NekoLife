'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, CheckSquare, Calendar, StickyNote, Sprout, UserCircle, LogOut } from 'lucide-react';

const NAV = [
  { href: '/dashboard',         label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/tasks',   label: 'Tasks',     icon: CheckSquare },
  { href: '/dashboard/calendar',label: 'Calendar',  icon: Calendar },
  { href: '/dashboard/notes',   label: 'Notes',     icon: StickyNote },
  { href: '/dashboard/life',    label: 'Life',      icon: Sprout },
  { href: '/dashboard/profile', label: 'Profile',   icon: UserCircle },
];

export function Sidebar({ user, logoutAction }: { user: any; logoutAction: () => void }) {
  const path = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 shrink-0 bg-white/70 backdrop-blur border-r border-sakura-100 flex-col p-5 sticky top-0 h-screen">
      <Link href="/dashboard" className="flex items-center gap-2 mb-8">
        <span className="text-3xl">🐱</span>
        <div>
          <div className="font-extrabold text-mocha-700 text-lg leading-tight">Neko Life</div>
          <div className="text-xs text-mocha-500">cozy & organized</div>
        </div>
      </Link>

      <nav className="flex-1 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition',
                active ? 'bg-gradient-to-r from-sakura-200 to-lavender-200 text-mocha-700 shadow-soft' : 'text-mocha-500 hover:bg-sakura-50'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="card p-3 mt-4 flex items-center gap-3">
        {user?.image ? (
          <img src={user.image} alt="" className="w-10 h-10 rounded-full border-2 border-sakura-200" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-sakura-200 flex items-center justify-center text-mocha-700 font-bold">
            {(user?.name || user?.email || '?')[0].toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-bold text-mocha-700 text-sm truncate">{user?.name || 'Friend'}</div>
          <div className="text-xs text-mocha-500 truncate">{user?.email}</div>
        </div>
        <form action={logoutAction}>
          <button title="Log out" className="p-1.5 rounded-lg hover:bg-sakura-50 text-mocha-500">
            <LogOut className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}
