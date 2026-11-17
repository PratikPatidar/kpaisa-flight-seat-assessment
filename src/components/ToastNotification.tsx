import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const ToastNotification: React.FC = () => {
  const { state, dispatch } = useBooking();
  const { notification } = state;

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' });
    }, 3500);

    return () => clearTimeout(timer);
  }, [notification, dispatch]);

  if (!notification) return null;

  const isError = notification.type === 'error';
  const isSuccess = notification.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-slide-up">
      <div
        className={`p-3.5 rounded-2xl border shadow-xl flex items-center justify-between gap-3 ${
          isError
            ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
            : isSuccess
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
            : 'bg-sky-950/90 border-sky-500/50 text-sky-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isError ? (
            <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
          ) : isSuccess ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <Info className="h-5 w-5 text-sky-400 flex-shrink-0" />
          )}
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>

        <button
          onClick={() => dispatch({ type: 'CLEAR_NOTIFICATION' })}
          className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
