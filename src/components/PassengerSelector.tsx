import React from 'react';
import { Users, Plus, Minus, UserCheck } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const PassengerSelector: React.FC = () => {
  const { state, dispatch } = useBooking();
  const { passengerCount, passengers, activePassengerId } = state;

  const handleCountChange = (newCount: number) => {
    dispatch({ type: 'SET_PASSENGER_COUNT', count: newCount });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <span>Select Passengers</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Choose passenger count and pick seats individually
          </p>
        </div>

        {/* Passenger Counter stepper */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400 pl-2 font-medium">Count:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleCountChange(passengerCount - 1)}
              disabled={passengerCount <= 1}
              aria-label="Decrease passenger count"
              className="h-7 w-7 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center font-bold text-sm text-slate-800 dark:text-white">
              {passengerCount}
            </span>
            <button
              onClick={() => handleCountChange(passengerCount + 1)}
              disabled={passengerCount >= 6}
              aria-label="Increase passenger count"
              className="h-7 w-7 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Passenger Pill tabs */}
      <div className="pt-3">
        <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-2">
          Click passenger to assign seat:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {passengers.map((p, index) => {
            const isActive = p.id === activePassengerId;
            const hasSeat = Boolean(p.seatId);

            return (
              <button
                key={p.id}
                onClick={() => dispatch({ type: 'SET_ACTIVE_PASSENGER', passengerId: p.id })}
                aria-pressed={isActive}
                aria-label={`Select ${p.name}, currently ${hasSeat ? `assigned to seat ${p.seatId}` : 'no seat assigned'}`}
                className={`flex flex-col items-start p-2.5 rounded-xl border transition-all text-left relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  isActive
                    ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-500 dark:border-sky-500 shadow-xs'
                    : 'bg-slate-50/50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-sky-500 rounded-bl-md" />
                )}
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-xs font-semibold ${isActive ? 'text-sky-700 dark:text-sky-300' : 'text-slate-700 dark:text-slate-200'}`}>
                    P{index + 1}
                  </span>
                  {isActive && <UserCheck className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />}
                </div>

                <div className="mt-1 flex items-center gap-1.5 w-full">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Seat:</span>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      hasSeat
                        ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {p.seatId ? p.seatId : 'None'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
