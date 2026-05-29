import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';
import { useSettings } from '../hooks/useSettings';
import { 
  saveTransaction as fsSaveTx, 
  deleteTransaction as fsDeleteTx, 
  saveBudget as fsSaveBudget, 
  saveSettings as fsSaveSettings 
} from '../firebase/firestore';
import { CATEGORIES } from '../constants/categories';

const BudgetContext = createContext();

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}

export function BudgetProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.uid;

  // Selected calendar month (format "YYYY-MM") - load from localStorage or default to current month
  const [activeMonth, setActiveMonthState] = useState(() => {
    const saved = localStorage.getItem('activeMonth');
    if (saved) return saved;
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  });

  // Wrapper to save to localStorage when month changes
  const setActiveMonth = (month) => {
    localStorage.setItem('activeMonth', month);
    setActiveMonthState(month);
  };

  // Load real-time data from core listeners
  const { transactions, loading: txLoading } = useTransactions(userId);
  const { budgets, loading: budgetLoading } = useBudgets(userId);
  const { settings, loading: settingsLoading } = useSettings(userId);

  const loading = txLoading || budgetLoading || settingsLoading;

  // Refs to prevent duplicate notifications during initialization
  const isFirstLoad = useRef(true);

  // Filter transactions of activeMonth and sort by date descending
  const activeTransactions = transactions
    .filter(t => {
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
      
      const tDate = getDate(t);
      if (!tDate || isNaN(tDate.getTime())) return false;
      
      const y = tDate.getFullYear();
      const m = String(tDate.getMonth() + 1).padStart(2, '0');
      return `${y}-${m}` === activeMonth;
    })
    .sort((a, b) => {
      const getTimestamp = (t) => {
        if (!t || !t.date) return 0;
        
        // Firestore Timestamp with toDate() method
        if (typeof t.date.toDate === 'function') {
          return t.date.toDate().getTime();
        }
        
        // Firestore timestamp object { seconds, nanoseconds }
        if (t.date.seconds !== undefined) {
          return t.date.seconds * 1000 + Math.floor((t.date.nanoseconds || 0) / 1000000);
        }
        
        // JavaScript Date object
        if (t.date instanceof Date) {
          return t.date.getTime();
        }
        
        // String or number timestamp
        const parsed = new Date(t.date);
        return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
      };
      
      const timeA = getTimestamp(a);
      const timeB = getTimestamp(b);
      
      // Primary sort: date descending (newest first)
      if (timeB !== timeA) {
        return timeB - timeA;
      }
      
      // Secondary sort: document ID descending (newer first)
      return (b.id || '').localeCompare(a.id || '');
    });

  // Calculate Balance Metrics for activeMonth
  const totalIncome = activeTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = activeTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const currentBalance = totalIncome - totalExpense;

  // Helper to retrieve budget for single category
  const getCategoryBudget = (categoryKey) => {
    const found = budgets.find(b => b.category === categoryKey && b.month === activeMonth);
    return found ? Number(found.limit || 0) : 0;
  };

  // Category summary for spending bars
  const categorySpending = Object.keys(CATEGORIES).reduce((summary, key) => {
    // Total spent in this category
    const spent = activeTransactions
      .filter(t => t.category === key && t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const limit = getCategoryBudget(key);
    
    summary[key] = {
      ...CATEGORIES[key],
      spent,
      limit,
      progress: limit > 0 ? (spent / limit) * 100 : 0
    };
    return summary;
  }, {});

  // Monitor goals for smart notifications (only active after initial page mount loads)
  useEffect(() => {
    if (loading) return;
    
    // Skip toast warnings on very first loading snapshot to avoid spamming existing limits
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    // Savings goal alert Check
    const monthlySavings = currentBalance;
    if (settings.savingsGoal > 0 && monthlySavings >= settings.savingsGoal) {
      toast.success('🎉 Objectif d\'épargne atteint ce mois !', { id: 'savings-goal' });
    }

    // Budget warning Checks
    Object.keys(categorySpending).forEach(key => {
      const cat = categorySpending[key];
      if (cat.limit > 0 && cat.progress >= 90) {
        toast((t) => (
          <span>
            ⚠️ <strong>{cat.name}</strong>: 90% du budget atteint ({cat.spent.toFixed(2)} / {cat.limit} {settings.currency})
          </span>
         ), {
           id: `budget-warning-${key}`,
           duration: 4000
         });
      }
    });

  }, [activeTransactions.length, budgets.length, settings.savingsGoal, activeMonth, loading]);

  // Actions
  const addTransaction = async (tx) => {
    if (!userId) return;
    await fsSaveTx(userId, tx);
    toast.success('✅ Transaction ajoutée');
  };

  const removeTransaction = async (id) => {
    if (!userId) return;
    await fsDeleteTx(userId, id);
    toast.success('Transaction supprimée');
  };

  const updateCategoryBudget = async (category, limit) => {
    if (!userId) return;
    await fsSaveBudget(userId, category, limit, activeMonth);
  };

  const updateSettings = async (setts) => {
    if (!userId) return;
    await fsSaveSettings(userId, { ...settings, ...setts });
    toast.success('Paramètres enregistrés');
  };

  // Clear month active data (delete transactions & budgets of active month)
  const clearMonthData = async () => {
    if (!userId) return;
    try {
      // 1. Delete transactions of current activeMonth
      const txPromises = activeTransactions.map(t => fsDeleteTx(userId, t.id));
      
      // 2. Delete budget configurations of current activeMonth
      const activeBudgets = budgets.filter(b => b.month === activeMonth);
      const budgetPromises = activeBudgets.map(b => fsSaveBudget(userId, b.category, 0, activeMonth));

      await Promise.all([...txPromises, ...budgetPromises]);
      toast.success('Données du mois supprimées avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression des données');
    }
  };

  const value = {
    transactions,
    activeTransactions,
    budgets,
    settings,
    loading,
    activeMonth,
    setActiveMonth,
    totalIncome,
    totalExpense,
    currentBalance,
    categorySpending,
    getCategoryBudget,
    addTransaction,
    removeTransaction,
    updateCategoryBudget,
    updateSettings,
    clearMonthData
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
}
