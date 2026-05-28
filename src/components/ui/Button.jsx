import React from 'react';

/**
 * Reusable layout-aligned custom Button
 */
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  type = 'button',
  disabled = false,
  onClick,
  ...props 
}) {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[#534AB7] hover:bg-[#433b9b] text-white",
    secondary: "bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200",
    success: "bg-[#1D9E75] hover:bg-[#167d5c] text-white",
    danger: "bg-[#D85A30] hover:bg-[#be4f29] text-white",
    outline: "border border-slate-200 hover:bg-slate-100 dark:border-zinc-700 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
