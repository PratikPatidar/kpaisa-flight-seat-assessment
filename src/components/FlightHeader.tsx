import React, { useState } from 'react';
import { Plane, Calendar, Clock, MapPin, Sun, Moon, ChevronDown } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useTheme } from '../context/ThemeContext';
import { AIRCRAFT_CONFIGS } from '../data/flightData';
import { ScheduleModal } from './ScheduleModal';

export const FlightHeader: React.FC = () => {
  const { state } = useBooking();
  const { theme, toggleTheme } = useTheme();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const currentAircraft = AIRCRAFT_CONFIGS[state.aircraftType];

  return (
    <>
      <header className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 lg:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand and Flight info */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Plane className="h-5 w-5 text-white -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">K-Airlines</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-medium border border-sky-500/20 font-mono">
                  {state.schedule.flightNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>DEL (Delhi)</span>
                <span className="text-slate-400 dark:text-slate-600">→</span>
                <span>BOM (Mumbai)</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 mx-1"></span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{currentAircraft.name}</span>
              </p>
            </div>
          </div>

          {/* Departure Meta info & Theme Switcher */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Interactive Schedule Selector Pill */}
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              aria-label="Change flight date and time"
              className="hidden md:flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-6 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-sky-500" />
                <div className="text-left">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    {state.departureDate}
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Departure Date</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-sky-500" />
                <div className="text-left">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{state.schedule.departureTime}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Slot ({state.schedule.duration})</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky-500" />
                <div className="text-left">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{state.schedule.terminal}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Gate {state.schedule.gate}</p>
                </div>
              </div>
            </button>

            {/* Mobile Schedule button */}
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5 text-sky-500" />
              <span>{state.schedule.departureTime}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark and light mode"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-sky-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </>
  );
};

