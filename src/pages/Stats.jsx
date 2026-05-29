import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingDown, 
  CheckCircle2
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
      المدخول: incomeSum,
      المصروف: expenseSum
    };
  });

  // 4. Find Greatest Expense of the Active Month
  const expenses = activeTransactions.filter(t => t.type === 'expense');
  const biggestExpense = expenses.length > 0
    ? [...expenses].sort((a, b) => b.amount - a.amount)[0]
    : null;

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          إحصائياتي
        </h2>

        {/* Month Selector */}
        <div className="flex items-center gap-1 self-start bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-1">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-850 rounded-lg text-slate-600 dark:text-zinc-300 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            onClick={() => setIsMonthPickerOpen(true)}
            className="px-3 py-1 text-sm font-semibold text-slate-850 dark:text-zinc-200 capitalize min-w-[100px] text-center"
          >
            {getFrenchMonthLabel()}
          </button>

          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-850 rounded-lg text-slate-600 dark:text-zinc-300 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 1. Biggest Expense First */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-4">
          اكتر مصروف صرفتو
        </h3>

        {biggestExpense ? (
          <div className="space-y-3">
            <div className="text-3xl font-bold text-slate-900 dark:text-zinc-100 font-mono">
              {formatCurrency(biggestExpense.amount, settings.currency)}
            </div>
            <p className="text-sm text-slate-600 dark:text-zinc-300 truncate">
              {biggestExpense.title}
            </p>
            <p className="text-xs text-slate-400">
              {formatDate(biggestExpense.date, 'dd MMMM yyyy')}
            </p>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">لا توجد مصروفات</p>
          </div>
        )}
      </div>

      {/* 2. Category Spending Second */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-4">
          المصاريف حسب الفئة
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.values(categorySpending).map((cat) => (
            <div key={cat.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl">
              <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{cat.name}</p>
                <p className="text-sm font-bold text-slate-800 dark:text-zinc-100 font-mono">
                  {formatCurrency(cat.spent, settings.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Charts Section Last */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Expense Distribution */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-4">
            توزيع المصاريف
          </h3>

          {expenseData.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-12 text-center text-slate-400">
              <TrendingDown className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-xs">لا توجد مصروفات</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="w-full max-w-[160px] h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [`${Number(val).toFixed(0)} ${settings.currency}`, '']}
                      contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 space-y-2 w-full">
                {expenseData.map((e, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: e.color }} />
                      <span className="text-slate-600 dark:text-zinc-300">{e.name}</span>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-zinc-100 font-mono">
                      {formatCurrency(e.value, settings.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-4">
            آخر 6 أشهر
          </h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val) => [`${Number(val).toFixed(0)} ${settings.currency}`, '']}
                  contentStyle={{ borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="المدخول" fill="#1D9E75" radius={[3, 3, 0, 0]} />
                <Bar dataKey="المصروف" fill="#D85A30" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
