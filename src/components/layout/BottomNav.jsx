import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  History,
  Settings 
} from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { label: 'Accueil', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Stats', path: '/stats', icon: BarChart3 },
    { label: 'Historique', path: '/history', icon: History },
    { label: 'Réglages', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 flex items-end justify-around z-40 pb-[env(safe-area-inset-bottom)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center flex-1 py-3 gap-1 text-[11px] font-medium transition-colors duration-150 min-w-0 px-1 active:scale-95
              ${isActive
                ? 'text-[#534AB7]'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100'
              }
            `}
          >
            <Icon className="h-5 w-5" />
            <span className="truncate max-w-full">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
