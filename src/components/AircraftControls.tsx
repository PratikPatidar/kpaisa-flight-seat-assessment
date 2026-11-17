import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import type { AircraftType } from '../types/flight';
import { AIRCRAFT_CONFIGS } from '../data/flightData';

export const AircraftControls: React.FC = () => {
  const { state, dispatch } = useBooking();

  const handleLayoutChange = (type: AircraftType) => {
    dispatch({ type: 'SET_AIRCRAFT_TYPE', aircraftType: type });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Aircraft & Cabin Type</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {AIRCRAFT_CONFIGS[state.aircraftType].name} — {AIRCRAFT_CONFIGS[state.aircraftType].description}
        </p>
      </div>

      {/* Segmented layout switcher */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => handleLayoutChange('3-2')}
          aria-pressed={state.aircraftType === '3-2'}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            state.aircraftType === '3-2'
              ? 'bg-white dark:bg-sky-600 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Airbus A220 (3–2)
        </button>
        <button
          onClick={() => handleLayoutChange('2-3-2')}
          aria-pressed={state.aircraftType === '2-3-2'}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            state.aircraftType === '2-3-2'
              ? 'bg-white dark:bg-sky-600 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Boeing 767 (2–3–2)
        </button>
      </div>
    </div>
  );
};
