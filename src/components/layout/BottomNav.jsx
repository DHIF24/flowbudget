import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  PieChart,
  Settings 
} from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { label: 'Accueil', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Stats', path: '/stats', icon: BarChart3 },
    { label: 'Dépenses', path: '/categories', icon: PieChart },
    { label: 'Réglages', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-around z-40 pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center flex-1 h-full gap-1 text-[10px] font-medium transition-colors duration-150
              ${isActive 
                ? 'text-[#534AB7]' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100'
              }
            `}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
