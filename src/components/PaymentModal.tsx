import React, { useState } from 'react';
import { X, CheckCircle2, QrCode, CreditCard, Building2, ShieldCheck, Loader2, Download, Plane } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { useBooking } from '../context/BookingContext';
import { calculateBookingTotals } from '../utils/pricingCalculator';
import { printBoardingPass } from '../utils/boardingPassPrinter';
import { AIRCRAFT_CONFIGS } from '../data/flightData';
import { Button } from './ui/Button';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking';

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const { state } = useBooking();
  const totals = calculateBookingTotals(state);

  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pnr] = useState(() => `KP-${Math.floor(100000 + Math.random() * 900000)}`);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // gracefully handle in test environments
      }
    }, 1500);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative transition-colors overflow-hidden">
        {/* Close Button */}
        {!isProcessing && (
          <button
            onClick={handleReset}
            aria-label="Close checkout modal"
            className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {isSuccess ? (
          /* Success Screen / Boarding Confirmation */
          <div className="flex flex-col items-center text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-8 ring-emerald-50 dark:ring-emerald-950/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Payment Successful
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                Seats Confirmed!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your e-tickets have been issued. Booking Reference: <strong className="text-slate-800 dark:text-slate-200">{pnr}</strong>
              </p>
            </div>

            {/* Boarding Pass Summary Card */}
            <div className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Flight FL-2048</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                  DEL → BOM
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {totals.passengersBreakdown.map((p) => (
                  <div key={p.passengerId} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400">{p.passengerName}</p>
                    <p className="font-bold text-slate-800 dark:text-white mt-0.5">
                      Seat: <span className="text-sky-600 dark:text-sky-400">{p.seatId}</span>
                    </p>
                    {p.mealName && p.mealName !== 'None' && (
                      <p className="text-[9px] text-slate-500 truncate mt-0.5">Meal: {p.mealName}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Total Paid:</span>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  ₹{totals.grandTotal}
                </span>
              </div>
            </div>

            <div className="flex gap-2 w-full pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const aircraft = AIRCRAFT_CONFIGS[state.aircraftType];
                  printBoardingPass(pnr, totals, state.schedule, state.departureDate, aircraft.name);
                }}
              >
                <Download className="h-4 w-4 mr-1.5" />
                Print / Save Pass
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleReset}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* Payment Selection Screen */
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
                <ShieldCheck className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                <h3 id="checkout-modal-title">Complete Checkout</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Review fare and choose your preferred payment option
              </p>
            </div>

            {/* Price Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Amount Payable</p>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                  ₹{totals.grandTotal}
                </p>
              </div>
              <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
                <p>{totals.assignedSeatsCount} Seats • {totals.passengersBreakdown.filter(p => p.mealPrice > 0).length} Addon Meals</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">All taxes inclusive</p>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('upi')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors ${
                  method === 'upi'
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-600 text-sky-700 dark:text-sky-300'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <QrCode className="h-4 w-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors ${
                  method === 'card'
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-600 text-sky-700 dark:text-sky-300'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('netbanking')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors ${
                  method === 'netbanking'
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-600 text-sky-700 dark:text-sky-300'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span>Net Banking</span>
              </button>
            </div>

            {/* Tab Specific Content */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
              {method === 'upi' && (
                <div className="flex flex-col items-center text-center space-y-2.5 py-1">
                  {/* Real Scannable UPI QR Code */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs inline-block">
                    <QRCodeSVG
                      value={`upi://pay?pa=kpaisa.airlines@axisbank&pn=K-Airlines&am=${totals.grandTotal}&cu=INR&tn=Flight-FL2048`}
                      size={110}
                      level="M"
                    />
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                    Scan with any UPI app (GPay, PhonePe, Paytm)
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    VPA: kpaisa.airlines@axisbank • Amount: ₹{totals.grandTotal}
                  </p>
                </div>
              )}

              {method === 'card' && (
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-500 dark:text-slate-400">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8821"
                      className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                      defaultValue="4532 8920 1102 8821"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-500 dark:text-slate-400">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                        defaultValue="08/29"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 dark:text-slate-400">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={3}
                        className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                        defaultValue="842"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === 'netbanking' && (
                <div className="space-y-1.5 text-xs">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">Popular Banks</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((b, i) => (
                      <label
                        key={b}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer"
                      >
                        <input type="radio" name="bank" defaultChecked={i === 0} className="text-sky-600" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{b}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pay CTA Button */}
            <Button
              variant="primary"
              className="w-full py-3"
              disabled={isProcessing}
              onClick={handlePay}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting with Payment Gateway...
                </span>
              ) : (
                `Pay ₹${totals.grandTotal} & Issue Tickets`
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
