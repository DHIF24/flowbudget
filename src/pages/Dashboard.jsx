import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  ChevronRight,
  Activity, 
  Smile,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../context/BudgetContext';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import BalanceCard from '../components/dashboard/BalanceCard';
import TransactionItem from '../components/dashboard/TransactionItem';
import AddTransactionModal from '../components/modals/AddTransactionModal';
import MonthPicker from '../components/ui/MonthPicker';

export default function Dashboard() {
  const { user } = useAuth();
  const { 
    activeTransactions, 
    settings, 
    loading, 
    activeMonth,
    setActiveMonth,
    totalIncome,
    totalExpense,
    currentBalance,
    categorySpending,
    removeTransaction
  } = useBudget();

  // Modal view States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [modalDefaultType, setModalDefaultType] = useState('expense');
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  // Format active month in beautiful French, e.g. "Mai 2026"
  const getFrenchMonthLabel = () => {
    const [year, month] = activeMonth.split('-');
    const date = new Date(year, parseInt(month) - 1, 15);
    return formatDate(date, 'MMMM yyyy');
  };

  // Savings goal math
  const savings = currentBalance > 0 ? currentBalance : 0;
  const savingsGoal = settings.savingsGoal || 1; // avoid divide by zero
  const savingsPercent = Math.min(100, Math.max(0, (savings / savingsGoal) * 100));

  const getInitials = () => {
    if (settings.displayName) {
      return settings.displayName.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'FB';
  };

  const handleEditClick = (tx) => {
    setEditingTransaction(tx);
    setModalDefaultType(tx.type || 'expense');
    setIsModalOpen(true);
  };

  const handleAddIncomeClick = () => {
    setEditingTransaction(null);
    setModalDefaultType('income');
    setIsModalOpen(true);
  };

  const handleAddExpenseClick = () => {
    setEditingTransaction(null);
    setModalDefaultType('expense');
    setIsModalOpen(true);
  };

  // Define skeleton element for loading state
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between pb-2">
          <div className="h-7 w-40 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-10 w-10 bg-slate-200 dark:bg-zinc-800 rounded-full" />
        </div>
        {/* Balance Card Skeleton */}
        <div className="h-44 bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
        {/* Savings progress skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-1/2 bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-3 w-full bg-slate-200 dark:bg-zinc-800 rounded-full" />
        </div>
        {/* Categories grid skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-28 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-28 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6 relative min-h-[85vh]">
      
      {/* 1. Header: App title, Avatar, Month label */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-500 font-medium text-xs uppercase tracking-widest font-mono">
            <Sparkles className="h-3.5 w-3.5 text-[#534AB7]" />
            <span>Flux de Trésorerie</span>
          </div>
          
          <button 
            type="button"
            onClick={() => setIsMonthPickerOpen(true)}
            className="group flex items-center gap-2 hover:opacity-90 active:scale-98 transition-all duration-150 focus:outline-none text-left"
            title="Changer de période"
          >
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5 capitalize font-sans flex items-center gap-1">
              <span>{getFrenchMonthLabel()}</span>
              <ChevronDown className="h-4.5 w-4.5 text-slate-400 dark:text-zinc-500 group-hover:text-[#534AB7] dark:group-hover:text-indigo-400 transition" />
            </h2>
          </button>
        </div>

        {/* User avatar initials circle */}
        <div className="h-10 w-10 rounded-full bg-[#534AB7] text-white flex items-center justify-center text-xs font-semibold ring-2 ring-indigo-50 dark:ring-indigo-950">
          {getInitials()}
        </div>
      </header>

      {/* 2. Balance Card (purple background with interactive action buttons) */}
      <BalanceCard 
        totalIncome={totalIncome} 
        totalExpense={totalExpense} 
        currency={settings.currency} 
        onAddIncome={handleAddIncomeClick}
        onAddExpense={handleAddExpenseClick}
      />

      {/* 3. Recent Transactions list (last 5 entries) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
            Transactions récentes
          </h3>
          <span className="text-xs font-bold font-mono text-slate-400">
            {activeTransactions.length} au total
          </span>
        </div>

        {/* Empty state graphics if no transactions exist in active month */}
        {activeTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50/50 dark:bg-zinc-900/30 border border-dashed border-slate-200 dark:border-zinc-800/80 rounded-2xl text-center space-y-3">
            <div className="p-3 bg-slate-100 dark:bg-zinc-800 text-slate-400 rounded-full">
              <Activity className="h-6 w-6" />
            </div>
            <div className="max-w-[18rem]">
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                Aucune transaction ce mois-ci
              </p>
              <p className="text-xs text-slate-450 dark:text-zinc-500 mt-1 leading-relaxed">
                Cliquez sur le bouton plus (+) pour ajouter مصروفاتك أو مدخولك الأول !
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeTransactions.slice(0, 5).map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                currency={settings.currency}
                onEdit={handleEditClick}
                onDelete={removeTransaction}
              />
            ))}
          </div>
        )}
      </section>

      {/* ADD TRANSACTION MODAL SHEET */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionToEdit={editingTransaction}
        defaultType={modalDefaultType}
      />

      {/* MONTH/YEAR PICKER DIALOG POPUP */}
      <MonthPicker
        isOpen={isMonthPickerOpen}
        onClose={() => setIsMonthPickerOpen(false)}
        activeMonth={activeMonth}
        onChange={setActiveMonth}
      />

    </div>
  );
}
