import React, { useState, useMemo } from 'react';
import { History, Calendar, ChevronDown, Download, Filter, Trash2 } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../constants/categories';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { exportCSV } from '../utils/exportCSV';
import { FormattedCurrency } from '../components/ui/FormattedCurrency';
import toast from 'react-hot-toast';
import MonthPicker from '../components/ui/MonthPicker';

// Icon mapping for categories
import { 
  Utensils, Car, Receipt, Gamepad2, Coins, Layers, Coffee, Shirt, Wifi 
} from 'lucide-react';

// Layers is the default icon

const IconMap = {
  Utensils, Car, Receipt, Gamepad2, Coins, Layers, Coffee, Shirt, Wifi
};

export default function HistoryPage() {
  const { user } = useAuth();
  const { 
    transactions, 
    settings, 
    loading,
    activeMonth,
    setActiveMonth,
    removeTransaction
  } = useBudget();

  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'

  // Get all unique months from transactions
  const availableMonths = useMemo(() => {
    const getDate = (t) => {
      if (!t || !t.date) return null;
      
      // Firestore Timestamp with toDate() method
      if (typeof t.date.toDate === 'function') {
        return t.date.toDate();
      }
      
      // Firestore timestamp object { seconds, nanoseconds }
      if (t.date.seconds !== undefined) {
        return new Date(t.date.seconds * 1000 + Math.floor((t.date.nanoseconds || 0) / 1000000));
      }
      
      // JavaScript Date object
      if (t.date instanceof Date) {
        return t.date;
      }
      
      // String or number
      const parsed = new Date(t.date);
      return isNaN(parsed.getTime()) ? null : parsed;
    };
    
    const months = new Set();
    transactions.forEach(t => {
      const tDate = getDate(t);
      if (tDate && !isNaN(tDate.getTime())) {
        const y = tDate.getFullYear();
        const m = String(tDate.getMonth() + 1).padStart(2, '0');
        months.add(`${y}-${m}`);
      }
    });
    return Array.from(months).sort().reverse();
  }, [transactions]);

  // Filter transactions by selected month and type
  const filteredTransactions = useMemo(() => {
    const getDate = (t) => {
      if (!t || !t.date) return null;
      
      // Firestore Timestamp with toDate() method
      if (typeof t.date.toDate === 'function') {
        return t.date.toDate();
      }
      
      // Firestore timestamp object { seconds, nanoseconds }
      if (t.date.seconds !== undefined) {
        return new Date(t.date.seconds * 1000 + Math.floor((t.date.nanoseconds || 0) / 1000000));
      }
      
      // JavaScript Date object
      if (t.date instanceof Date) {
        return t.date;
      }
      
      // String or number
      const parsed = new Date(t.date);
      return isNaN(parsed.getTime()) ? null : parsed;
    };
    
    const getTimestamp = (t) => {
      const date = getDate(t);
      return date ? date.getTime() : 0;
    };
    
    return transactions
      .filter(t => {
        // Filter by month
        const tDate = getDate(t);
        if (!tDate || isNaN(tDate.getTime())) return false;
        
        const y = tDate.getFullYear();
        const m = String(tDate.getMonth() + 1).padStart(2, '0');
        const monthMatch = `${y}-${m}` === activeMonth;
        
        // Filter by type
        const typeMatch = filterType === 'all' || t.type === filterType;
        
        return monthMatch && typeMatch;
      })
      .sort((a, b) => {
        const timeA = getTimestamp(a);
        const timeB = getTimestamp(b);
        
        // Primary sort: date descending (newest first)
        if (timeB !== timeA) {
          return timeB - timeA;
        }
        
        // Secondary sort: document ID descending (newer first)
        return (b.id || '').localeCompare(a.id || '');
      });
  }, [transactions, activeMonth, filterType]);

  // Calculate totals
  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      toast.error('Aucune transaction à exporter');
      return;
    }
    exportCSV(filteredTransactions, settings.currency);
    toast.success('Export CSV réussi');
  };

  const handleDelete = async (tx) => {
    const isConfirmed = window.confirm(
      `🗑️ Supprimer "${tx.title}" ?\n\nCette action est irréversible.`
    );
    if (!isConfirmed) return;

    try {
      await removeTransaction(tx.id);
      toast.success('Transaction supprimée');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getCategoryIcon = (categoryId) => {
    const cat = CATEGORIES[categoryId];
    if (!cat) return Layers;
    return IconMap[cat.icon] || Layers;
  };

  const getCategoryColor = (categoryId) => {
    return CATEGORIES[categoryId]?.color || '#64748B';
  };

  const getCategoryName = (categoryId) => {
    return CATEGORIES[categoryId]?.name || categoryId;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-4xl">
        <div className="h-8 w-48 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
        <div className="h-12 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 overflow-x-hidden max-w-4xl">
      {/* Header */}
      <header>
        <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-mono">
          Archives Financières
        </span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
          Historique des Transactions
        </h2>
      </header>

      {/* Month Selector & Filters */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Month Picker */}
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-2">
              Période
            </label>
            <button
              onClick={() => setIsMonthPickerOpen(true)}
              className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-850 transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[#534AB7]" />
                <span className="text-sm sm:text-base font-semibold text-slate-800 dark:text-zinc-100 truncate">
                  {formatDate(new Date(activeMonth + '-01'), 'MMM yyyy')}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-2">
              Type
            </label>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'Tout', color: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-200' },
                { value: 'income', label: 'المدخول', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
                { value: 'expense', label: 'المصروف', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
              ].map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => setFilterType(value)}
                  className={`flex-1 py-3 px-2 sm:py-2.5 sm:px-3 rounded-lg text-xs font-semibold transition-all active:scale-95 min-h-[44px] ${
                    filterType === value
                      ? color + ' ring-2 ring-offset-1 ring-[#534AB7]'
                      : 'bg-slate-50 dark:bg-zinc-950 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards - Show based on filter */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 border-t border-slate-100 dark:border-zinc-800/50">
          {filterType !== 'expense' && (
            <div className="text-center p-2 sm:p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium uppercase truncate">المدخول</p>
              <p className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 font-mono mt-0.5 truncate">
                <FormattedCurrency amount={totals.income} currencyCode={settings.currency} decimalPlaces={3} className="text-xs sm:text-sm font-bold" />
              </p>
            </div>
          )}
          {filterType !== 'income' && (
            <div className="text-center p-2 sm:p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <p className="text-[10px] text-orange-600 dark:text-orange-400 font-medium uppercase truncate">المصروف</p>
              <p className="text-xs sm:text-sm font-bold text-orange-700 dark:text-orange-400 font-mono mt-0.5 truncate">
                <FormattedCurrency amount={totals.expense} currencyCode={settings.currency} decimalPlaces={3} className="text-xs sm:text-sm font-bold" />
              </p>
            </div>
          )}
          {filterType === 'all' && (
            <div className="text-center p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium uppercase truncate">فضلت</p>
              <p className={`text-xs sm:text-sm font-bold font-mono mt-0.5 truncate ${
                totals.balance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
              }`}>
                <FormattedCurrency amount={totals.balance} currencyCode={settings.currency} decimalPlaces={3} className="text-xs sm:text-sm font-bold" />
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={handleExport}
          disabled={filteredTransactions.length === 0}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#534AB7] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#433b9b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Exporter CSV</span>
          <span className="sm:hidden">CSV</span>
        </button>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-slate-100 dark:bg-zinc-800 rounded-full mb-4">
              <History className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-zinc-300">
              Aucune transaction trouvée
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Sélectionnez une autre période ou modifiez les filtres
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {filteredTransactions.map((tx) => {
              const IconComponent = getCategoryIcon(tx.category);
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-2 sm:gap-4 p-2.5 sm:p-4"
                >
                  {/* Icon */}
                  <div
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: isIncome ? '#1D9E7520' : getCategoryColor(tx.category) + '20',
                      color: isIncome ? '#1D9E75' : getCategoryColor(tx.category)
                    }}
                  >
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100 truncate">
                      {tx.title}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                      {formatDate(tx.date, 'dd/MM/yy')}
                    </p>
                  </div>

                  {/* Amount */}
                  <span className={`text-xs sm:text-sm font-bold font-mono whitespace-nowrap shrink-0 ${
                    isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-zinc-100'
                  }`}>
                    {isIncome ? '+' : '-'}<FormattedCurrency amount={tx.amount} currencyCode={settings.currency} decimalPlaces={3} className="text-xs sm:text-sm font-bold" />
                  </span>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(tx)}
                    className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Month Picker Modal */}
      <MonthPicker
        isOpen={isMonthPickerOpen}
        onClose={() => setIsMonthPickerOpen(false)}
        activeMonth={activeMonth}
        onChange={setActiveMonth}
      />
    </div>
  );
}
