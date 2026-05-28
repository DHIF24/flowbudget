import React from 'react';

/**
 * Reusable layout-aligned form Input fields
 */
export default function Input({
  label,
  type = 'text',
  id,
  error,
  suffix,
  className = '',
  placeholder,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="text-xs font-medium text-slate-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          className={`
            w-full px-3.5 py-2.5 rounded-lg border text-sm font-sans transition-colors focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-slate-200 dark:border-zinc-800'
            }
          `}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3.5 text-xs text-slate-500 font-medium font-mono pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 font-sans mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}
