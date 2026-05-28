import React, { useState, useEffect } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import ProgressBar from '../components/ui/ProgressBar';
import MonthPicker from '../components/ui/MonthPicker';
import { 
  Utensils, 
  Car, 
  Receipt, 
  Gamepad2, 
  Coins, 
  Layers,
  Sparkles,
  Save,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const iconMap = {
  Utensils,
  Car,
  Receipt,
  Gamepad2,
  Coins,
  Layers
};

export default function Categories() {
  const { 
    categorySpending, 
    settings, 
    updateCategoryBudget, 
    loading,
    activeMonth,
    setActiveMonth
  } = useBudget();

  // Keep a local dictionary for the limits currently being edited or typed
  const [localLimits, setLocalLimits] = useState({});
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  // When categorySpending changes (e.g., initial load or month changes), initialize our local limit input values
  useEffect(() => {
    if (categorySpending) {
      const initialLimits = {};
      Object.keys(categorySpending).forEach((key) => {
        initialLimits[key] = categorySpending[key].limit > 0 ? String(categorySpending[key].limit) : '';
      });
      setLocalLimits(initialLimits);
    }
  }, [categorySpending]);

  const handleLimitChange = (key, val) => {
    setLocalLimits(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSaveLimit = async (key) => {
    const rawValue = localLimits[key];
    const newLimit = rawValue === '' ? 0 : parseFloat(rawValue);

    if (isNaN(newLimit) || newLimit < 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    try {
      await updateCategoryBudget(key, newLimit);
      toast.success(`Budget mis à jour pour ${categorySpending[key].name}`);
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du budget');
    }
  };

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

  // Define active category keys (typically the ones we track budgets on, e.g. food, transport, bills, entertainment, other)
  const budgetKeys = ['food', 'transport', 'bills', 'entertainment', 'other'];

  return (
    <div className="space-y-6 pb-20 md:pb-6 relative min-h-[85vh]">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-500 font-medium text-xs uppercase tracking-widest font-mono">
            <Sparkles className="h-3.5 w-3.5 text-[#534AB7]" />
            <span>Gestion des plafonds</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans mt-0.5">
            Limites Budgétaires
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl font-sans mt-1">
            Définissez un seuil mensuel de dépenses par catégorie. Un signalement de couleur et un avertissement apparaîtront si le seuil approche ou est franchi.
          </p>
        </div>

        {/* Dynamic Month Selector Button */}
        <div className="self-start sm:self-center">
          <button
            type="button"
            onClick={() => setIsMonthPickerOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850/80 rounded-xl border border-slate-200 dark:border-zinc-805 shadow-sm transition-all focus:outline-none text-left shrink-0"
            title="Saisir ou choisir une période"
          >
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 font-mono uppercase tracking-wider block">
              Période:
            </span>
            <span className="text-sm font-bold text-slate-850 dark:text-zinc-100 capitalize font-sans flex items-center gap-1">
              {getFrenchMonthLabel()}
              <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-[#534AB7] transition-transform duration-200" />
            </span>
          </button>
        </div>
      </header>

      {/* Grid of editable category budget cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {budgetKeys.map((key) => {
          const cat = categorySpending[key];
          if (!cat) return null;

          const IconComponent = iconMap[cat.icon] || Layers;
          const spent = cat.spent || 0;
          const limit = cat.limit || 0;
          const percent = limit > 0 ? (spent / limit) * 100 : 0;
          const isOverBudget = limit > 0 && spent > limit;
          const remaining = Math.max(0, limit - spent);

          return (
            <div 
              key={key}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2.5 rounded-xl text-white font-semibold shadow-sm shadow-[#534AB7]/10"
                      style={{ backgroundColor: cat.color }}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-850 dark:text-zinc-100">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-zinc-505 font-sans">
                        Dépenses mensuelles actuelles
                      </p>
                    </div>
                  </div>

                  {/* Top-right Status badge / Percent indicator */}
                  {limit > 0 ? (
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${isOverBudget ? 'bg-red-50 text-red-500 dark:bg-red-950/20 dark:text-red-400 animate-pulse' : 'text-slate-500 dark:text-zinc-400'}`}>
                      {percent.toFixed(0)}%
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 italic bg-slate-50 dark:bg-zinc-950 px-2 py-0.5 rounded-full font-mono">
                      sans limite
                    </span>
                  )}
                </div>

                {/* Spent amount details */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-baseline justify-between py-1">
                    <span className="text-xs text-slate-505 dark:text-zinc-400 font-medium">
                      Montant total consommé:
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-zinc-100 font-mono">
                      {formatCurrency(spent, settings.currency)}
                    </span>
                  </div>

                  {/* High Density Progress bar */}
                  <ProgressBar value={percent} type="budget" />

                  {/* Consumed / Exceeded information */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-zinc-500 font-mono pt-1">
                    {limit > 0 ? (
                      <>
                        <span>{percent.toFixed(0)}% du budget consommé</span>
                        <span>Reste: {formatCurrency(remaining, settings.currency)}</span>
                      </>
                    ) : (
                      <span className="italic">Aucune limite fixée pour ce mois.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Editable limit input area at bottom */}
              <div className="pt-4 mt-2 border-t border-slate-150 dark:border-zinc-800/80 flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    placeholder="Aucune limite"
                    value={localLimits[key] ?? ''}
                    onChange={(e) => handleLimitChange(key, e.target.value)}
                    className="w-full pl-3 pr-10 py-1.5 text-sm bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#534AB7] focus:border-[#534AB7] text-slate-850 dark:text-zinc-100 font-mono font-bold"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 uppercase font-mono">
                    {settings.currency}
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleSaveLimit(key)}
                  className="px-4 py-2 bg-[#534AB7] hover:bg-[#433b9b] dark:bg-[#534AB7] hover:dark:bg-[#453da3] text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Enregistrer</span>
                </button>
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
