import React from 'react';
import { useBooking } from '../context/BookingContext';
import { SeatItem } from './SeatItem';
import { AIRCRAFT_CONFIGS } from '../data/flightData';

export const AircraftCabin: React.FC = () => {
  const { state } = useBooking();
  const { seatsByRow, aircraftType } = state;
  const config = AIRCRAFT_CONFIGS[aircraftType];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-xs relative overflow-hidden transition-colors">
      {/* Plane Nose / Cockpit shape */}
      <div className="w-48 sm:w-64 h-16 border-t border-x border-slate-300 dark:border-slate-700/80 rounded-t-[100px] bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center relative mb-4">
        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-1 flex items-center justify-center">
        </div>
        <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Front of Aircraft</span>
      </div>

      {/* Main Cabin Fuselage */}
      <div className="w-full max-w-xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 relative overflow-x-auto">
        <div className="min-w-[320px]">
          {/* Column Headers */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 mb-4 border-b border-slate-200 dark:border-slate-800/60 pb-3">
            <span className="w-6 text-center text-xs text-slate-400 font-bold">#</span>
            {config.columnGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="flex items-center gap-1.5 sm:gap-2">
                {group.map((col) => (
                  <div
                    key={col}
                    className="w-9 sm:w-10 text-center text-xs font-bold text-slate-500 dark:text-slate-400"
                  >
                    {col}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="space-y-2.5">
            {seatsByRow.map((rowSeats, rowIdx) => {
              const rowNumber = rowIdx + 1;
              const isExitRow = config.exitRows.includes(rowNumber);
              const isWingRow = config.wingsRows.includes(rowNumber);

              let pointer = 0;
              const seatGroups = config.columnGroups.map((group) => {
                const slice = rowSeats.slice(pointer, pointer + group.length);
                pointer += group.length;
                return slice;
              });

              return (
                <div key={rowNumber} className="relative">
                  {/* Exit Row Indicator */}
                  {isExitRow && (
                    <div className="flex items-center justify-between text-[10px] text-sky-700 dark:text-sky-300 font-semibold px-2 py-0.5 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40 rounded-md mb-2">
                      <span>⬅ Exit</span>
                      <span className="uppercase text-[9px] tracking-wide">Emergency Exit Row</span>
                      <span>Exit ➡</span>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-6 sm:gap-8 relative">
                    {/* Wing Visuals indicator */}
                    {isWingRow && (
                      <div className="absolute -left-6 text-[8px] text-slate-400 uppercase tracking-tighter -rotate-90 hidden sm:block">
                        Wing
                      </div>
                    )}

                    {/* Row Number */}
                    <span className="w-6 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                      {rowNumber}
                    </span>

                    {/* Seat groups separated by aisle */}
                    {seatGroups.map((groupSeats, groupIdx) => (
                      <div key={groupIdx} className="flex items-center gap-1.5 sm:gap-2">
                        {groupSeats.map((seat) => (
                          <SeatItem key={seat.id} seat={seat} />
                        ))}
                      </div>
                    ))}

                    {/* Row Number right */}
                    <span className="w-6 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 hidden sm:inline-block">
                      {rowNumber}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tail / Back of Aircraft */}
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <div className="inline-block px-4 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Rear of Aircraft • Galley
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
