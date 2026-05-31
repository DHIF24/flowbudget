import React from 'react';
import { X, Calendar, Tag } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { FormattedCurrency } from '../ui/FormattedCurrency';

export default function CategoryDetailsModal({ 
  isOpen, 
  onClose, 
  category, 
  transactions, 
  currency = 'DT' 
}) {
  if (!isOpen || !category) return null;

  // Filter transactions for this category
  const categoryTransactions = transactions.filter(
    tx => tx.category === category.id
  );

  const totalSpent = categoryTransactions.reduce(
    (sum, tx) => sum + (tx.type === 'expense' ? tx.amount : 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-xl text-white"
              style={{ backgroundColor: category.color }}
            >
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100">
                {category.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                {categoryTransactions.length} مصروفات
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Total */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800">
          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-1">المجموع</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-zinc-100 font-mono">
            <FormattedCurrency 
              amount={totalSpent} 
              currencyCode={currency} 
              decimalPlaces={3} 
              className="text-2xl sm:text-3xl font-bold" 
            />
          </p>
        </div>

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {categoryTransactions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-zinc-400">
              <p>لا توجد مصروفات في هذه الفئة</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categoryTransactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-zinc-100 truncate">
                      {tx.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        {formatDate(tx.date, 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 font-mono">
                    <FormattedCurrency 
                      amount={tx.amount} 
                      currencyCode={currency} 
                      decimalPlaces={3} 
                      className="text-sm font-bold" 
                    />
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 sm:py-3 bg-[#534AB7] text-white font-semibold rounded-xl hover:bg-[#433d96] transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
