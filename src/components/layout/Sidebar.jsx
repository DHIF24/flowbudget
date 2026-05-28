import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  PieChart,
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBudget } from '../../context/BudgetContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { settings } = useBudget();

  const navItems = [
    { label: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Statistiques', path: '/stats', icon: BarChart3 },
    { label: 'Dépenses par catégorie', path: '/categories', icon: PieChart },
    { label: 'Paramètres', path: '/settings', icon: Settings },
  ];

  const getInitials = () => {
    if (settings.displayName) {
      return settings.displayName.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'FB';
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 p-6 sticky top-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#534AB7] rounded-lg text-white">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            FlowBudget
          </h1>
          <span className="text-xs text-slate-500 font-mono">FINANCES</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150
                ${isActive 
                  ? 'bg-[#534AB7]/10 text-[#534AB7] dark:bg-[#534AB7]/20 dark:text-[#766ee6]' 
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Information Profile footer */}
      <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#534AB7] flex items-center justify-center text-white text-xs font-semibold ring-2 ring-violet-100 dark:ring-violet-950">
            {getInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
              {settings.displayName || user?.displayName || 'Utilisateur'}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors w-full text-left"
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
