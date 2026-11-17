import React, { type HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'sky' | 'emerald' | 'amber' | 'muted';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md';

  const variantClasses = {
    default:
      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    sky:
      'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800',
    emerald:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
    amber:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
    muted:
      'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
