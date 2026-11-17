import React from 'react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs transition-colors">
      {/* Standard / Free */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"></div>
        <span className="text-slate-600 dark:text-slate-300 font-medium">Standard (₹0)</span>
      </div>

      {/* Premium */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-sm border border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-700"></div>
        <span className="text-slate-600 dark:text-slate-300 font-medium">Premium (₹250)</span>
      </div>

      {/* Extra Legroom */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-sm border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-slate-800"></div>
        <span className="text-slate-600 dark:text-slate-300 font-medium">Extra Legroom (₹350)</span>
      </div>

      {/* Selected */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-sm border border-sky-600 bg-sky-600 shadow-xs"></div>
        <span className="text-slate-600 dark:text-slate-300 font-medium">Selected</span>
      </div>

      {/* Occupied */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center text-slate-400 dark:text-slate-600 text-[10px] font-bold">
          ✕
        </div>
        <span className="text-slate-400 dark:text-slate-500 font-medium">Occupied</span>
      </div>
    </div>
  );
};

