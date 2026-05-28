import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';

const FRENCH_MONTHS = [
  { value: '01', label: 'Janvier' },
  { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },
  { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },
  { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' },
  { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' },
  { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },
  { value: '12', label: 'Décembre' }
];

export default function MonthPicker({ isOpen, onClose, activeMonth, onChange }) {
  const modalRef = useRef(null);
  
  // Extract current year and month from activeMonth format "YYYY-MM"
  const [currentYearStr, currentMonthStr] = activeMonth.split('-');
  const selectedYear = parseInt(currentYearStr, 10);
  const selectedMonth = currentMonthStr;

  // Let local selection state hold the year that coordinates the grid display
  const [gridYear, setGridYear] = React.useState(selectedYear);

  // Sync grid view year when activeMonth or open status changes
  useEffect(() => {
    if (isOpen) {
      setGridYear(selectedYear);
    }
  }, [isOpen, selectedYear]);

  // Handle Close when clicking outside of the modal dialog contents
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrevYear = () => {
    setGridYear(prev => prev - 1);
  };

  const handleNextYear = () => {
    setGridYear(prev => prev + 1);
  };

  const handleSelectMonth = (monthVal) => {
    const newMonthStr = `${gridYear}-${monthVal}`;
    onChange(newMonthStr);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in animate-duration-150">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden p-6 transform transition-all animate-scale-up"
      >
        {/* Header Title with Calendar Icon and Close button */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#534AB7]/10 text-[#534AB7] dark:bg-[#534AB7]/20 rounded-lg">
              <Calendar className="h-4.5 w-4.5" />
            </span>
            <span className="text-sm font-bold text-slate-850 dark:text-zinc-100 font-sans">
              Sélectionner une période
            </span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-805 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-zinc-200 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Year Selector Control (Header of month selection dialog) */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 rounded-xl border border-slate-150 dark:border-zinc-800/60 mb-5">
          <button
            type="button"
            onClick={handlePrevYear}
            className="p-1.5 hover:bg-white dark:hover:bg-zinc-900 rounded-lg text-slate-600 dark:text-zinc-300 border border-transparent hover:border-slate-200 dark:hover:border-zinc-800 shadow-sm transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="font-mono font-bold text-base text-slate-850 dark:text-zinc-100">
            {gridYear}
          </span>

          <button
            type="button"
            onClick={handleNextYear}
            className="p-1.5 hover:bg-white dark:hover:bg-zinc-900 rounded-lg text-slate-600 dark:text-zinc-300 border border-transparent hover:border-slate-200 dark:hover:border-zinc-800 shadow-sm transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Months grid (3 columns x 4 rows) */}
        <div className="grid grid-cols-3 gap-2.5">
          {FRENCH_MONTHS.map((m) => {
            const isSelected = selectedYear === gridYear && selectedMonth === m.value;
            
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => handleSelectMonth(m.value)}
                className={`py-3 px-1 rounded-xl text-xs font-semibold text-center transition-all duration-150 focus:outline-none ${
                  isSelected 
                    ? 'bg-[#534AB7] text-white shadow-md shadow-[#534AB7]/30 scale-[1.03]' 
                    : 'bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-805 text-slate-700 dark:text-zinc-300 border border-slate-100 dark:border-zinc-800/60 hover:border-slate-200'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
