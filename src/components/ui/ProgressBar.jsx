import React from 'react';

/**
 * Reusable layout-aligned progress bar
 * @param {number} value - percentage progress (0 to 100)
 * @param {string} type - 'savings' | 'budget' | 'default'
 * @param {string} colorClass - custom tailwind bg color (optional override)
 */
export default function ProgressBar({ value = 0, type = 'default', colorClass = '' }) {
  const percent = Math.min(100, Math.max(0, Number(value || 0)));

  // Define color based on guidelines and percentage
  let barColorClass = 'bg-[#534AB7]'; // Default brand color (purple)

  if (colorClass) {
    barColorClass = colorClass;
  } else if (type === 'savings') {
    // Savings: green >= 50%, amber 25-50%, red < 25%
    if (percent >= 50) {
      barColorClass = 'bg-[#1D9E75]'; // Teal (success/income)
    } else if (percent >= 25) {
      barColorClass = 'bg-[#D97706]'; // Amber
    } else {
      barColorClass = 'bg-[#D85A30]'; // Coral (danger/expense)
    }
  } else if (type === 'budget') {
    // Budget: green < 70%, amber 70-90%, red > 90%
    if (percent < 70) {
      barColorClass = 'bg-[#1D9E75]'; // Teal (good)
    } else if (percent <= 90) {
      barColorClass = 'bg-[#D97706]'; // Amber (warning)
    } else {
      barColorClass = 'bg-[#D85A30]'; // Coral (over or near budget limit)
    }
  }

  return (
    <div className={`w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden ${type === 'budget' ? 'h-1.5' : 'h-3.5'}`}>
      <div 
        className={`h-full rounded-full transition-all duration-300 ease-out ${barColorClass}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
