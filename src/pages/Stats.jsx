import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  CheckCircle2
} from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import MonthPicker from '../components/ui/MonthPicker';

export default function Stats() {
  const { 
    transactions, 
    activeTransactions, 
    settings, 
    activeMonth, 
    setActiveMonth,
    categorySpending
  } = useBudget();

  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  // 1. Month Navigation Handler
  const handlePrevMonth = () => {
    const [year, colMonth] = activeMonth.split('-').map(Number);
    let newMonth = colMonth - 1;
    let newYear = year;
    if (newMonth === 0) {
      newMonth = 12;
      newYear = year - 1;
    }
    setActiveMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, colMonth] = activeMonth.split('-').map(Number);
    let newMonth = colMonth + 1;
    let newYear = year;
    if (newMonth === 13) {
      newMonth = 1;
      newYear = year + 1;
    }
    setActiveMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const getFrenchMonthLabel = () => {
    const [year, month] = activeMonth.split('-');
    const date = new Date(year, parseInt(month) - 1, 15);
    return formatDate(date, 'MMMM yyyy');
  };

  // 2. Find Greatest Expense of the Active Month
  const expenses = activeTransactions.filter(t => t.type === 'expense');
  const biggestExpense = expenses.length > 0
    ? [...expenses].sort((a, b) => b.amount - a.amount)[0]
    : null;

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mb-1">شوف فلوسك وين مشات</p>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            حساباتي
          </h2>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-1 self-start bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-1">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-850 rounded-lg text-slate-600 dark:text-zinc-300 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            onClick={() => setIsMonthPickerOpen(true)}
            className="px-3 py-1 text-sm font-semibold text-slate-850 dark:text-zinc-200 capitalize min-w-[100px] text-center"
          >
            {getFrenchMonthLabel()}
          </button>

          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-850 rounded-lg text-slate-600 dark:text-zinc-300 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 1. Biggest Expense First */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="h-5 w-5" />
          <h3 className="text-sm font-semibold">اكثر مصروف صرفتو 💸</h3>
        </div>

        {biggestExpense ? (
          <div className="space-y-2">
            <div className="text-3xl font-bold font-mono">
              {formatCurrency(biggestExpense.amount, settings.currency, 0)}
            </div>
            <p className="text-base font-medium opacity-95">
              {biggestExpense.title}
            </p>
            <p className="text-xs opacity-75">
              {formatDate(biggestExpense.date, 'dd/MM/yyyy')}
            </p>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm opacity-80">ما صرفت والو هذا الشهر 👍</p>
          </div>
        )}
      </div>

      {/* 2. Category Spending Second */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-4">
          وين مشات الفلوس 📊
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.values(categorySpending)
            .filter((cat) => cat.spent > 0)
            .map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl">
                <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{cat.name}</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-zinc-100 font-mono">
                    {formatCurrency(cat.spent, settings.currency, 0)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* MONTH/YEAR PICKER POPUP */}
      <MonthPicker
        isOpen={isMonthPickerOpen}
        onClose={() => setIsMonthPickerOpen(false)}
        activeMonth={activeMonth}
        onChange={setActiveMonth}
      />

    </div>
  );
}
