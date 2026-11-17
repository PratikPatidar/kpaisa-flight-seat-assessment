import React from 'react';
import { Utensils, X, Check, Coffee, Sparkles } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { MEAL_OPTIONS } from '../data/flightData';

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MealSelectionModal: React.FC<MealModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useBooking();
  const { activePassengerId, passengers } = state;

  if (!isOpen) return null;

  const activePassenger = passengers.find((p) => p.id === activePassengerId);
  const currentMealId = activePassenger?.mealId || 'meal-none';

  const handleSelectMeal = (mealId: string) => {
    dispatch({
      type: 'ASSIGN_MEAL',
      passengerId: activePassengerId,
      mealId,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="meal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-xl relative transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <h3 id="meal-modal-title" className="text-base font-semibold text-slate-900 dark:text-white">
                Select In-Flight Meal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customizing for <span className="text-sky-600 dark:text-sky-400 font-semibold">{activePassenger?.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close meal selection dialog"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Meal Options List */}
        <div className="py-4 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {MEAL_OPTIONS.map((meal) => {
            const isSelected = currentMealId === meal.id;

            return (
              <button
                key={meal.id}
                onClick={() => handleSelectMeal(meal.id)}
                aria-pressed={isSelected}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-500 dark:border-sky-500 ring-1 ring-sky-500/30'
                    : 'bg-slate-50/50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl mt-0.5 ${
                      isSelected
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {meal.id === 'meal-none' ? (
                      <X className="h-4 w-4" />
                    ) : meal.category === 'vegetarian' ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      <Coffee className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{meal.name}</span>
                      {meal.tag && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {meal.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{meal.description}</p>
                    {meal.calories && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 inline-block">
                        {meal.calories}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-sm font-bold ${meal.price === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {meal.price === 0 ? 'Free' : `₹${meal.price}`}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                      <Check className="h-3 w-3" /> Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

