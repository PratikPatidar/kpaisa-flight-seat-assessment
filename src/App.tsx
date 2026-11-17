import React, { useState } from 'react';
import { BookingProvider } from './context/BookingContext';
import { ThemeProvider } from './context/ThemeContext';
import { FlightHeader } from './components/FlightHeader';
import { PassengerSelector } from './components/PassengerSelector';
import { AircraftControls } from './components/AircraftControls';
import { SeatLegend } from './components/SeatLegend';
import { AircraftCabin } from './components/AircraftCabin';
import { BookingSummary } from './components/BookingSummary';
import { MealSelectionModal } from './components/MealSelectionModal';
import { PaymentModal } from './components/PaymentModal';
import { ToastNotification } from './components/ToastNotification';

const FlightBookingApp: React.FC = () => {
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white pb-12 transition-colors duration-200">
      <FlightHeader />

      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 pt-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Cabin & Interactive Area (7 cols on lg) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <PassengerSelector />
            <AircraftControls />
            <SeatLegend />
            <AircraftCabin />
          </div>

          {/* Right Sidebar - Sticky Summary & Checkout (5 cols on lg) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <BookingSummary
              onOpenMealModal={() => setIsMealModalOpen(true)}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            />
          </div>
        </div>
      </main>

      <MealSelectionModal
        isOpen={isMealModalOpen}
        onClose={() => setIsMealModalOpen(false)}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <BookingProvider>
        <FlightBookingApp />
      </BookingProvider>
    </ThemeProvider>
  );
}

