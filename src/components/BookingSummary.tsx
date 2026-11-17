import React from 'react';
import { Receipt, Trash2, Utensils, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { calculateBookingTotals } from '../utils/pricingCalculator';

interface BookingSummaryProps {
  onOpenMealModal: () => void;
  onOpenPaymentModal: () => void;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({ onOpenMealModal, onOpenPaymentModal }) => {
  const { state, dispatch } = useBooking();
  const totals = calculateBookingTotals(state);

  const handleRemoveSeat = (passengerId: string) => {
    dispatch({ type: 'REMOVE_SEAT', passengerId });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-5 sticky top-24 transition-colors">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Fare Summary</h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
          {totals.assignedSeatsCount} / {state.passengerCount} Seats Picked
        </span>
      </div>

      {/* Passengers Breakdown List */}
      <div className="space-y-3">
        {totals.passengersBreakdown.map((item) => (
          <div
            key={item.passengerId}
            className={`p-3 rounded-2xl border transition-all ${
              item.passengerId === state.activePassengerId
                ? 'bg-sky-50 dark:bg-sky-950/20 border-sky-300 dark:border-sky-500/40'
                : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                {item.passengerName}
                {item.passengerId === state.activePassengerId && (
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">(Active)</span>
                )}
              </span>

              {item.seatId && (
                <button
                  onClick={() => handleRemoveSeat(item.passengerId)}
                  className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                  title="Remove assigned seat"
                  aria-label={`Remove seat ${item.seatId} for ${item.passengerName}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Seat info */}
            <div className="flex items-center justify-between text-xs mt-2 text-slate-600 dark:text-slate-300">
              <span className="text-slate-500 dark:text-slate-400">
                Seat:{' '}
                {item.seatId ? (
                  <span className="font-semibold text-slate-800 dark:text-white bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                    {item.seatId} ({item.seatTier})
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400/80 italic text-[11px]">Not Selected</span>
                )}
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {item.seatId ? (item.seatPrice === 0 ? 'Free' : `₹${item.seatPrice}`) : '—'}
              </span>
            </div>

            {/* Meal info */}
            <div className="flex items-center justify-between text-xs mt-1 text-slate-600 dark:text-slate-300">
              <span className="text-slate-500 dark:text-slate-400 truncate max-w-[160px]" title={item.mealName || 'None'}>
                Meal: <span className="text-slate-700 dark:text-slate-300">{item.mealName || 'None'}</span>
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {item.mealPrice === 0 ? (item.mealId === 'meal-none' ? '—' : 'Free') : `₹${item.mealPrice}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Meal Selection CTA button */}
      <button
        onClick={onOpenMealModal}
        className="w-full py-2.5 px-4 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <Utensils className="h-4 w-4" />
        Customize Meals (In-flight Addon)
      </button>

      {/* Bill Totals calculation */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span>Seats Total</span>
          <span className="font-medium text-slate-800 dark:text-slate-200">₹{totals.totalSeatPrice}</span>
        </div>
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span>Meals Total</span>
          <span className="font-medium text-slate-800 dark:text-slate-200">₹{totals.totalMealPrice}</span>
        </div>
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span>Taxes & Airport Surcharges</span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">Included</span>
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-sm">
          <span className="font-bold text-slate-800 dark:text-white">Grand Total</span>
          <span className="font-extrabold text-lg text-sky-700 dark:text-sky-400">₹{totals.grandTotal}</span>
        </div>
      </div>

      {/* Confirmation State Feedback */}
      {totals.allSeatsAssigned ? (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>All passengers have seats assigned! Ready for checkout.</span>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>
            Please assign seats for {state.passengerCount - totals.assignedSeatsCount} more passenger(s).
          </span>
        </div>
      )}

      {/* Proceed Button */}
      <button
        disabled={!totals.allSeatsAssigned}
        onClick={onOpenPaymentModal}
        className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        Confirm Seats & Proceed
      </button>
    </div>
  );
};
