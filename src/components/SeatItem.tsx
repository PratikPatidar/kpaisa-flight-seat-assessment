import React from 'react';
import type { Seat } from '../types/flight';
import { useBooking } from '../context/BookingContext';

interface SeatItemProps {
  seat: Seat;
}

export const SeatItem: React.FC<SeatItemProps> = ({ seat }) => {
  const { state, dispatch } = useBooking();
  const { activePassengerId, passengers } = state;

  const activePassenger = passengers.find((p) => p.id === activePassengerId);
  const isSelectedByActive = activePassenger?.seatId === seat.id;

  const assignedPassenger = passengers.find((p) => p.seatId === seat.id);
  const isSelectedByOther = Boolean(assignedPassenger && assignedPassenger.id !== activePassengerId);

  const handleClick = () => {
    dispatch({ type: 'ASSIGN_SEAT', seatId: seat.id });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Clean, realistic, production airline styling (IndiGo / Lufthansa aesthetic)
  let seatClasses = 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 shadow-xs';
  let labelText = seat.price === 0 ? 'Free' : `₹${seat.price}`;

  if (seat.isOccupied) {
    seatClasses = 'bg-slate-100 dark:bg-slate-900/60 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800/80 cursor-not-allowed opacity-60';
  } else if (isSelectedByActive) {
    seatClasses = 'bg-sky-600 dark:bg-sky-600 text-white border-sky-600 dark:border-sky-500 font-semibold shadow-sm ring-2 ring-sky-500/40';
  } else if (isSelectedByOther) {
    seatClasses = 'bg-slate-700 dark:bg-slate-700 text-white border-slate-700 font-semibold';
  } else if (seat.tier === 'extraLegroom') {
    seatClasses = 'bg-sky-50/50 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border-sky-300 dark:border-sky-800/60 hover:border-sky-400';
  } else if (seat.tier === 'premium') {
    seatClasses = 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:border-slate-400';
  }

  const ariaDescription = `Seat ${seat.id}, ${seat.tier} category, ${seat.position} position, ${
    seat.price === 0 ? 'Free' : `${seat.price} Rupees`
  }, ${
    seat.isOccupied
      ? 'Occupied'
      : isSelectedByActive
      ? 'Selected by you'
      : isSelectedByOther
      ? `Selected by ${assignedPassenger?.name}`
      : 'Available'
  }`;

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={seat.isOccupied}
        aria-label={ariaDescription}
        aria-pressed={isSelectedByActive}
        aria-disabled={seat.isOccupied}
        tabIndex={seat.isOccupied ? -1 : 0}
        className={`w-9 h-10 sm:w-10 sm:h-11 rounded-md border flex flex-col items-center justify-between p-1 transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900 ${seatClasses}`}
      >
        {/* Subtle headrest notch */}
        <div
          className={`w-3.5 h-0.5 rounded-full ${
            isSelectedByActive || isSelectedByOther
              ? 'bg-white/40'
              : 'bg-slate-300 dark:bg-slate-600'
          }`}
        />

        {/* Seat letter */}
        <span className="text-[11px] font-semibold leading-tight">
          {seat.column}
        </span>

        {/* Sub-label */}
        <span className="text-[8px] font-medium leading-none">
          {seat.isOccupied ? (
            '✕'
          ) : isSelectedByActive ? (
            'You'
          ) : isSelectedByOther ? (
            assignedPassenger?.name.split(' ')[1] || 'P'
          ) : (
            labelText
          )}
        </span>
      </button>

      {/* Accessible Tooltip */}
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50 whitespace-nowrap"
      >
        <div className="bg-slate-900 dark:bg-slate-950 text-slate-100 text-[11px] px-2.5 py-1.5 rounded-md border border-slate-700 shadow-lg flex flex-col gap-0.5">
          <div className="flex items-center gap-2 font-semibold">
            <span>Seat {seat.id}</span>
            <span className="text-[9px] uppercase px-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {seat.tier === 'extraLegroom' ? 'Extra Legroom' : seat.tier}
            </span>
          </div>

          <div className="text-[10px] text-slate-300 flex items-center justify-between gap-3">
            <span>Price:</span>
            <span className="font-semibold text-emerald-400">
              {seat.price === 0 ? 'Free' : `₹${seat.price}`}
            </span>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between gap-3">
            <span>Position:</span>
            <span className="capitalize">{seat.position}</span>
          </div>

          {seat.isOccupied && (
            <div className="text-[10px] text-rose-400 font-medium border-t border-slate-800 pt-0.5 mt-0.5">
              Unavailable (Occupied)
            </div>
          )}

          {isSelectedByOther && (
            <div className="text-[10px] text-sky-400 font-medium border-t border-slate-800 pt-0.5 mt-0.5">
              Assigned to {assignedPassenger?.name}
            </div>
          )}
        </div>
        <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-slate-950 border-r border-b border-slate-700 rotate-45 -mt-1"></div>
      </div>
    </div>
  );
};

