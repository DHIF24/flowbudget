import React from 'react';

/**
 * Custom pill toggle element (Expense / Income selector)
 */
export default function Toggle({
  value,
  onChange,
  leftLabel = 'المصروف',
  rightLabel = 'المدخول'
}) {
  const isLeft = value === 'expense';

  return (
    <div className="relative flex p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl w-full">
      {/* Sliding Highlight Block */}
      <div 
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#534AB7] rounded-lg transition-transform duration-200 ease-out shadow-sm
          ${isLeft ? 'translate-x-0' : 'translate-x-[100%] ml-1'}
        `}
      />

      <button
        type="button"
        onClick={() => onChange('expense')}
        className={`relative z-10 flex-1 py-2 text-center text-xs font-semibold focus:outline-none transition-colors duration-200
          ${isLeft 
            ? 'text-white' 
            : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-200'
          }
        `}
      >
        {leftLabel}
      </button>

      <button
        type="button"
        onClick={() => onChange('income')}
        className={`relative z-10 flex-1 py-2 text-center text-xs font-semibold focus:outline-none transition-colors duration-200
          ${!isLeft 
            ? 'text-white' 
            : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-200'
          }
        `}
      >
        {rightLabel}
      </button>
    </div>
  );
}
