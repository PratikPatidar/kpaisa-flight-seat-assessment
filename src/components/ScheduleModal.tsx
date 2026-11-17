import React, { useState } from 'react';
import { Calendar, Clock, X, Check } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { AVAILABLE_SCHEDULES, type FlightSchedule } from '../data/flightSchedule';
import { Button } from './ui/Button';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useBooking();
  const [selectedDate, setSelectedDate] = useState(state.departureDate);
  const [selectedSchedule, setSelectedSchedule] = useState<FlightSchedule>(state.schedule);

  if (!isOpen) return null;

  const handleApply = () => {
    dispatch({
      type: 'SET_FLIGHT_SCHEDULE',
      date: selectedDate,
      schedule: selectedSchedule,
    });
    onClose();
  };

  const dates = [
    { label: 'Today', date: '2026-11-18', display: '18 Nov (Wed)' },
    { label: 'Tomorrow', date: '2026-11-19', display: '19 Nov (Thu)' },
    { label: 'Upcoming', date: '2026-11-20', display: '20 Nov (Fri)' },
    { label: 'Weekend', date: '2026-11-21', display: '21 Nov (Sat)' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Change Flight Schedule
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Route: <span className="font-semibold text-slate-800 dark:text-slate-200">DEL → BOM</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close schedule modal"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Departure Date Selection */}
        <div className="py-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              1. Select Departure Date
            </label>
            <div className="grid grid-cols-2 gap-2">
              {dates.map((d) => {
                const isSelected = selectedDate === d.date;
                return (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setSelectedDate(d.date)}
                    className={`p-2.5 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-600 text-sky-700 dark:text-sky-300 font-semibold ring-1 ring-sky-500/30'
                        : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-[10px] text-slate-400">{d.label}</p>
                    <p className="text-xs font-bold mt-0.5">{d.display}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="pt-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              2. Select Available Flight Slot
            </label>
            <div className="space-y-2">
              {AVAILABLE_SCHEDULES.map((slot) => {
                const isSelected = selectedSchedule.flightNumber === slot.flightNumber;
                return (
                  <button
                    key={slot.flightNumber}
                    type="button"
                    onClick={() => setSelectedSchedule(slot)}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-colors text-left ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-600 ring-1 ring-sky-500/30'
                        : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {slot.departureTime}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                            {slot.flightNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {slot.terminal} • Gate {slot.gate} • {slot.duration}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleApply}>
            Update Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};
