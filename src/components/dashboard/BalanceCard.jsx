import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function BalanceCard({ 
  totalIncome = 0, 
  totalExpense = 0, 
  currency = 'DT',
  onAddIncome,
  onAddExpense
}) {
  const balance = totalIncome - totalExpense;

  return (
    <div className="bg-[#534AB7] rounded-2xl p-6 text-white overflow-hidden relative shadow-xl shadow-[#534AB7]/20 dark:shadow-zinc-950/50">
      {/* Absolute Decorative Geometric Shapes conforming to High Density Design */}
      <div className="absolute -top-12 -right-12 h-44 w-44 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-36 w-36 bg-black/5 rounded-full pointer-events-none" />

      {/* Card Header Content */}
      <div className="flex items-center gap-2 text-[#E0DDF7] text-xs font-semibold uppercase tracking-wider font-mono mb-2">
        <Wallet className="h-4 w-4" />
        <span>Solde disponible</span>
      </div>

      <div className="text-3xl sm:text-4xl font-bold tracking-tight italic select-all mb-4 sm:mb-6">
        {formatCurrency(balance, currency)}
      </div>

      {/* Two side by side Mini cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Income Card - Interactive add income button */}
        <button
          onClick={onAddIncome}
          type="button"
          className="bg-white/10 hover:bg-white/15 active:scale-[0.98] rounded-xl p-3.5 flex items-center justify-between border border-white/10 shadow-sm transition-all text-left w-full group focus:outline-none"
          title="إضافة مدخول (+)"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-teal-500/20 text-teal-300 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs text-[#E0DDF7] block font-semibold uppercase tracking-wider font-mono">
                المدخول
              </span>
              <span className="text-sm sm:text-base font-bold text-white truncate block font-sans">
                + {formatCurrency(totalIncome, currency)}
              </span>
            </div>
          </div>
          <div className="p-1 bg-white/10 rounded-lg text-white group-hover:bg-white/20 transition-colors shrink-0">
            <Plus className="h-4 w-4" />
          </div>
        </button>

        {/* Expense Card - Interactive add expense button */}
        <button
          onClick={onAddExpense}
          type="button"
          className="bg-white/10 hover:bg-white/15 active:scale-[0.98] rounded-xl p-3.5 flex items-center justify-between border border-white/10 shadow-sm transition-all text-left w-full group focus:outline-none"
          title="إضافة مصروف (-)"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-red-500/20 text-red-300 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
              <TrendingDown className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs text-[#E0DDF7] block font-semibold uppercase tracking-wider font-mono">
                المصروف
              </span>
              <span className="text-sm sm:text-base font-bold text-red-100 truncate block font-sans">
                - {formatCurrency(totalExpense, currency)}
              </span>
            </div>
          </div>
          <div className="p-1 bg-white/10 rounded-lg text-white group-hover:bg-white/20 transition-colors shrink-0">
            <Plus className="h-4 w-4" />
          </div>
        </button>
      </div>
    </div>
  );
}
