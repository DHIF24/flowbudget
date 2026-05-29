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
    <div className="bg-[#534AB7] rounded-2xl p-5 sm:p-6 text-white relative shadow-lg">
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
          className="bg-white/10 rounded-xl p-3 flex items-center justify-between text-left w-full"
          title="إضافة مدخول (+)"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-teal-500/20 text-teal-300 rounded-lg shrink-0">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs text-[#E0DDF7] block font-semibold uppercase tracking-wider font-mono">
                المدخول
              </span>
              <span className="text-sm sm:text-base font-bold text-white truncate block">
                + {formatCurrency(totalIncome, currency)}
              </span>
            </div>
          </div>
          <div className="p-1 bg-white/10 rounded-lg text-white shrink-0">
            <Plus className="h-4 w-4" />
          </div>
        </button>

        {/* Expense Card - Interactive add expense button */}
        <button
          onClick={onAddExpense}
          type="button"
          className="bg-white/10 rounded-xl p-3 flex items-center justify-between text-left w-full"
          title="إضافة مصروف (-)"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-red-500/20 text-red-300 rounded-lg shrink-0">
              <TrendingDown className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs text-[#E0DDF7] block font-semibold uppercase tracking-wider font-mono">
                المصروف
              </span>
              <span className="text-sm sm:text-base font-bold text-red-100 truncate block">
                - {formatCurrency(totalExpense, currency)}
              </span>
            </div>
          </div>
          <div className="p-1 bg-white/10 rounded-lg text-white shrink-0">
            <Plus className="h-4 w-4" />
          </div>
        </button>
      </div>
    </div>
  );
}
