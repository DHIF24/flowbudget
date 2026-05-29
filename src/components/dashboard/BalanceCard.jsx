import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

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
    <div className="bg-[#534AB7] rounded-2xl p-4 sm:p-6 text-white relative shadow-lg overflow-hidden">
      {/* Balance Section */}
      <div className="text-center mb-4 sm:mb-6">
        <p className="text-[#E0DDF7] text-xs sm:text-sm mb-1">شنوا فضلت</p>
        <div className={`text-2xl sm:text-4xl font-bold truncate ${isPositive ? 'text-white' : 'text-red-200'}`}>
          {formatCurrency(balance, currency)}
        </div>
      </div>

      {/* Progress bar showing income vs expense ratio */}
      {totalIncome > 0 && (
        <div className="mb-4 sm:mb-6">
          <div className="h-2 bg-black/20 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-400"
              style={{ width: `${Math.min((totalIncome / (totalIncome + totalExpense)) * 100, 100)}%` }}
            />
            <div
              className="h-full bg-red-400"
              style={{ width: `${Math.min((totalExpense / (totalIncome + totalExpense)) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Income & Expense Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Income - جبت */}
        <button
          onClick={onAddIncome}
          type="button"
          className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-3 sm:p-4 text-left"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-emerald-400/30 rounded-lg">
              <ArrowDownLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-300" />
            </div>
            <span className="text-[10px] sm:text-xs text-emerald-200">جبت</span>
          </div>
          <p className="text-sm sm:text-lg font-bold text-emerald-100 truncate">
            + {formatCurrency(totalIncome, currency)}
          </p>
        </button>

        {/* Expense - صرفت */}
        <button
          onClick={onAddExpense}
          type="button"
          className="bg-red-500/20 border border-red-400/30 rounded-xl p-3 sm:p-4 text-left"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-red-400/30 rounded-lg">
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-300" />
            </div>
            <span className="text-[10px] sm:text-xs text-red-200">صرفت</span>
          </div>
          <p className="text-sm sm:text-lg font-bold text-red-100 truncate">
            - {formatCurrency(totalExpense, currency)}
          </p>
        </button>
      </div>
    </div>
  );
}
