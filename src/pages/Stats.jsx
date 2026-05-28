import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingDown, 
  Calendar, 
  AlertCircle,
  PiggyBank,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
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

  // 2. Prepare Donut Chart Data (Expenses only)
  const expenseData = Object.values(categorySpending)
    .filter(c => c.spent > 0)
    .map(c => ({
      name: c.name,
      value: c.spent,
      color: c.color
    }));

  // 3. Prepare Last 6 Months Comparison Data
  const get6MonthsArray = () => {
    const list = [];
    const [yr, mth] = activeMonth.split('-').map(Number);
    for (let i = 5; i >= 0; i--) {
      let targetMonth = mth - i;
      let targetYear = yr;
      if (targetMonth <= 0) {
        targetMonth = 12 + targetMonth;
        targetYear = yr - 1;
      }
      list.push(`${targetYear}-${String(targetMonth).padStart(2, '0')}`);
    }
    return list;
  };

  const monthlyHistoryData = get6MonthsArray().map(mStr => {
    // Find transactions of this specific month in the loaded array
    const monthTx = transactions.filter(t => {
      let tDate;
      if (t.date && typeof t.date.toDate === 'function') {
        tDate = t.date.toDate();
      } else if (t.date?.seconds !== undefined) {
        tDate = new Date(t.date.seconds * 1000);
      } else {
        tDate = new Date(t.date);
      }
      if (isNaN(tDate.getTime())) return false;
      const y = tDate.getFullYear();
      const m = String(tDate.getMonth() + 1).padStart(2, '0');
      return `${y}-${m}` === mStr;
    });

    const incomeSum = monthTx
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const expenseSum = monthTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    // Get localized French short month label (e.g., "Janv.", "Févr.")
    const [yearVal, monthVal] = mStr.split('-');
    const dummyDate = new Date(yearVal, monthVal - 1, 15);
    const label = dummyDate.toLocaleDateString('fr-FR', { month: 'short' });

    return {
      month: label.replace('.', ''),
      Revenus: incomeSum,
      Dépenses: expenseSum
    };
  });

  // 4. Find Greatest Expense of the Active Month
  const expenses = activeTransactions.filter(t => t.type === 'expense');
  const biggestExpense = expenses.length > 0
    ? [...expenses].sort((a, b) => b.amount - a.amount)[0]
    : null;

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      
      {/* Page Title & Month Navigation Selector */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-mono">
            Rapports Analytiques
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
            Statistiques & Analyses
          </h2>
        </div>

        {/* 1. Month selector with Arrows */}
        <div className="flex items-center gap-1.5 self-start bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-1">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-850 rounded-lg text-slate-600 dark:text-zinc-300 transition"
            title="Mois précédent"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          
          <button
            type="button"
            onClick={() => setIsMonthPickerOpen(true)}
            className="px-3 py-1 text-sm font-semibold text-slate-850 dark:text-zinc-250 hover:text-[#534AB7] dark:hover:text-indigo-400 capitalize transition select-none min-w-[100px] text-center font-sans focus:outline-none"
            title="Choisir une période"
          >
            {getFrenchMonthLabel()}
          </button>

          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-850 rounded-lg text-slate-600 dark:text-zinc-300 transition"
            title="Mois suivant"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </header>

      {/* Grid: Charts elements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 2. Donut Chart: Expense breakdown */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-mono mb-4">
            Répartition des dépenses
          </h3>
          
          {expenseData.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-12 text-center text-slate-400 dark:text-zinc-650">
              <TrendingDown className="h-8 w-8 mb-2 opacity-55" />
              <p className="text-xs font-medium">Aucune dépense enregistrée ce mois-ci</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* Pie Chart container */}
              <div className="w-full max-w-[180px] h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="55%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val) => [`${Number(val).toFixed(2)} ${settings.currency}`, 'Montant']}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        borderColor: '#e2e8f0',
                        fontSize: '12px',
                        fontFamily: 'sans-serif'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Pie legend colors info */}
              <div className="flex-1 space-y-2 w-full">
                {expenseData.map((e, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                      <span className="text-slate-600 dark:text-zinc-300 font-medium">{e.name}</span>
                    </div>
                    <span className="font-semibold text-slate-850 dark:text-zinc-100 font-mono">
                      {formatCurrency(e.value, settings.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Bar Chart: Monthly comparison */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-mono mb-4">
            Comparatif sur 6 Mois
          </h3>
          <div className="h-44 sm:h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyHistoryData} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  formatter={(val) => [`${Number(val).toFixed(0)} ${settings.currency}`, '']}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    fontSize: '11px',
                    borderColor: '#e2e8f0'
                  }}
                />
                <Legend 
                  iconSize={8} 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'sans-serif', paddingTop: '10px' }} 
                />
                <Bar dataKey="Revenus" fill="#1D9E75" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Dépenses" fill="#D85A30" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Biggest block and limits table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 4. Category Table Summary */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-mono mb-4">
            Bilan des budgets par catégorie
          </h3>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 font-mono font-bold uppercase">
                  <th className="pb-2.5 font-medium">Catégorie</th>
                  <th className="pb-2.5 font-medium text-right">Budget</th>
                  <th className="pb-2.5 font-medium text-right">Dépensé</th>
                  <th className="pb-2.5 font-medium text-right">Reste</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-zinc-850">
                {Object.values(categorySpending).map((cat) => {
                  const remaining = cat.limit > 0 ? cat.limit - cat.spent : 0;
                  const isExceeded = cat.limit > 0 && cat.spent > cat.limit;
                  
                  return (
                    <tr key={cat.id} className="text-slate-700 dark:text-zinc-300">
                      <td className="py-3 font-semibold flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                      </td>
                      <td className="py-3 text-right font-mono">
                        {cat.limit > 0 ? formatCurrency(cat.limit, settings.currency) : '-'}
                      </td>
                      <td className="py-3 text-right font-mono">
                        {formatCurrency(cat.spent, settings.currency)}
                      </td>
                      <td className="py-3 text-right font-mono">
                        {cat.limit > 0 ? (
                          <span 
                            className={`font-bold px-1.5 py-0.5 rounded
                              ${isExceeded 
                                ? 'text-[#D85A30] bg-orange-50 dark:bg-orange-950/20' 
                                : 'text-[#1D9E75] bg-emerald-50 dark:bg-emerald-950/20'
                              }
                            `}
                          >
                            {formatCurrency(remaining, settings.currency)}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Biggest Expense Card Highlight */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-mono mb-4">
              Plus grosse dépense
            </h3>
            
            {biggestExpense ? (
              <div className="space-y-4">
                <div className="bg-[#D85A30]/5 dark:bg-orange-950/10 p-4 border border-[#D85A30]/15 dark:border-orange-900/40 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-[#D85A30] text-white rounded-lg shrink-0">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase font-mono font-semibold text-[#D85A30]">
                      Alerte Somme
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight font-mono select-all">
                      {formatCurrency(biggestExpense.amount, settings.currency)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-450">Titre:</span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-250 truncate block max-w-[150px]">
                      {biggestExpense.title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-450">Date:</span>
                    <span className="font-mono text-slate-800 dark:text-zinc-300">
                      {formatDate(biggestExpense.date, 'dd MMMM yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-450">Catégorie:</span>
                    <span className="font-semibold text-slate-850 dark:text-zinc-200 capitalize">
                      {biggestExpense.category}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 dark:text-zinc-650 flex flex-col items-center justify-center">
                <CheckCircle2 className="h-7 w-7 mb-2 text-[#1D9E75]/70" />
                <p className="text-xs font-semibold">Aucune dépense relevée</p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-600 mt-1">Vous n'avez pas de dépenses enregistrées ce mois-ci !</p>
              </div>
            )}
          </div>

          {biggestExpense && (
            <div className="mt-6 pt-3 border-t border-slate-150 dark:border-zinc-800/80 text-[10px] text-slate-450 dark:text-zinc-500 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500 shrink-0" />
              <span>Cette dépense représente un point d'optimisation potentiel pour votre budget de ce mois-ci.</span>
            </div>
          )}
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
