import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import MonthPicker from '../components/ui/MonthPicker';
import { 
  Utensils, 
  Car, 
  Receipt, 
  Gamepad2, 
  Coins, 
  Layers,
  Coffee,
  Shirt,
  ChevronDown
} from 'lucide-react';

const iconMap = {
  Utensils,
  Car,
  Receipt,
  Gamepad2,
  Coins,
  Layers,
  Coffee,
  Shirt
};

export default function Categories() {
  const { 
    categorySpending, 
    settings, 
    loading,
    activeMonth,
    setActiveMonth
  } = useBudget();

  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  const getFrenchMonthLabel = () => {
    const [year, month] = activeMonth.split('-');
    const date = new Date(year, parseInt(month) - 1, 15);
    return formatDate(date, 'MMMM yyyy');
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
        <div className="h-4 w-96 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="h-56 bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
          <div className="h-56 bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  // All category keys to display
  const categoryKeys = ['food', 'transport', 'bills', 'entertainment', 'cafe', 'clothes', 'other'];

  return (
    <div className="space-y-6 pb-20 md:pb-6 relative min-h-[85vh]">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            المصاريف حسب الفئة
          </h2>
        </div>

        {/* Month Selector */}
        <div className="self-start sm:self-center">
          <button
            type="button"
            onClick={() => setIsMonthPickerOpen(true)}
            className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850/80 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm transition-all"
          >
            <span className="text-sm font-bold text-slate-850 dark:text-zinc-100 capitalize">
              {getFrenchMonthLabel()}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {categoryKeys.map((key) => {
          const cat = categorySpending[key];
          if (!cat) return null;

          const IconComponent = iconMap[cat.icon] || Layers;
          const spent = cat.spent || 0;

          return (
            <div 
              key={key}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="p-2 rounded-xl text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-850 dark:text-zinc-100">
                  {cat.name}
                </h4>
              </div>
              
              <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-mono">
                {formatCurrency(spent, settings.currency)}
              </div>
            </div>
          );
        })}
      </div>

      {/* MONTH/YEAR SELECTOR POPUP */}
      <MonthPicker
        isOpen={isMonthPickerOpen}
        onClose={() => setIsMonthPickerOpen(false)}
        activeMonth={activeMonth}
        onChange={setActiveMonth}
      />

    </div>
  );
}
