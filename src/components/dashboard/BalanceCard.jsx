import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { FormattedCurrency } from '../ui/FormattedCurrency';

export default function BalanceCard({
  totalIncome = 0,
  totalExpense = 0,
  currency = 'DT',
  onAddIncome,
  onAddExpense
}) {
  const balance = totalIncome - totalExpense;
  const isPositive = balance >= 0;

  return (
    <div className="bg-[#534AB7] rounded-2xl p-3 sm:p-6 text-white shadow-lg">
      {/* Balance Section */}
      <div className="text-center mb-3 sm:mb-4">
        <p className="text-[#E0DDF7] text-xs sm:text-base mb-1">شنوا فضلت</p>
        <div className={`text-xl sm:text-4xl font-bold ${isPositive ? 'text-white' : 'text-red-200'}`}>
          <FormattedCurrency amount={balance} currencyCode={currency} decimalPlaces={3} className="text-xl sm:text-4xl font-bold" />
        </div>
      </div>

      {/* Progress bar */}
      {totalIncome > 0 && (
        <div className="mb-3 sm:mb-4">
          <div className="h-1.5 sm:h-2 bg-black/20 rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-400" style={{ width: `${Math.min((totalIncome / (totalIncome + totalExpense)) * 100, 100)}%` }} />
            <div className="h-full bg-red-400" style={{ width: `${Math.min((totalExpense / (totalIncome + totalExpense)) * 100, 100)}%` }} />
          </div>
        </div>
      )}

      {/* Income & Expense Cards */}
      <div className="grid grid-cols-2 gap-2">
        {/* Income - جبت */}
        <button onClick={onAddIncome} className="bg-emerald-500/20 rounded-lg sm:rounded-xl p-2 sm:p-3 text-left relative">
          <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
            <ArrowDownLeft className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-300" />
            <span className="text-xs sm:text-sm text-emerald-200 font-medium">دخلت</span>
          </div>
          <p className="text-xs sm:text-base font-bold text-emerald-100 truncate">
            + <FormattedCurrency amount={totalIncome} currencyCode={currency} decimalPlaces={3} className="text-xs sm:text-base font-bold" />
          </p>
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-1.5 bg-white/20 rounded-md sm:rounded-lg">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
        </button>

        {/* Expense - صرفت */}
        <button onClick={onAddExpense} className="bg-red-500/20 rounded-lg sm:rounded-xl p-2 sm:p-3 text-left relative">
          <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-300" />
            <span className="text-xs sm:text-sm text-red-200 font-medium">صرفت</span>
          </div>
          <p className="text-xs sm:text-base font-bold text-red-100 truncate">
            - <FormattedCurrency amount={totalExpense} currencyCode={currency} decimalPlaces={3} className="text-xs sm:text-base font-bold" />
          </p>
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-1.5 bg-white/20 rounded-md sm:rounded-lg">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}
