import type { BookingState } from '../context/bookingTypes';
import { MEAL_OPTIONS } from '../data/flightData';
import type { Seat } from '../types/flight';

export interface PassengerPricingBreakdown {
  passengerId: string;
  passengerName: string;
  seatId: string | null;
  seatPrice: number;
  seatTier: string | null;
  mealId: string | null;
  mealName: string | null;
  mealPrice: number;
  total: number;
}

export interface BookingTotalCalculation {
  passengersBreakdown: PassengerPricingBreakdown[];
  totalSeatPrice: number;
  totalMealPrice: number;
  grandTotal: number;
  assignedSeatsCount: number;
  allSeatsAssigned: boolean;
}

export function calculateBookingTotals(state: BookingState): BookingTotalCalculation {
  const { passengers, seatsByRow } = state;

  // Build seat lookup map
  const seatMap = new Map<string, Seat>();
  for (const row of seatsByRow) {
    for (const seat of row) {
      seatMap.set(seat.id, seat);
    }
  }

  // Build meal lookup map
  const mealMap = new Map(MEAL_OPTIONS.map((m) => [m.id, m]));

  let totalSeatPrice = 0;
  let totalMealPrice = 0;
  let assignedSeatsCount = 0;

  const passengersBreakdown: PassengerPricingBreakdown[] = passengers.map((p) => {
    let seatPrice = 0;
    let seatTier = null;

    if (p.seatId) {
      const s = seatMap.get(p.seatId);
      if (s) {
        seatPrice = s.price;
        seatTier = s.tier;
        assignedSeatsCount++;
      }
    }

    const meal = p.mealId ? mealMap.get(p.mealId) : null;
    const mealPrice = meal ? meal.price : 0;
    const mealName = meal ? meal.name : null;

    const passengerTotal = seatPrice + mealPrice;
    totalSeatPrice += seatPrice;
    totalMealPrice += mealPrice;

    return {
      passengerId: p.id,
      passengerName: p.name,
      seatId: p.seatId,
      seatPrice,
      seatTier,
      mealId: p.mealId,
      mealName,
      mealPrice,
      total: passengerTotal,
    };
  });

  return {
    passengersBreakdown,
    totalSeatPrice,
    totalMealPrice,
    grandTotal: totalSeatPrice + totalMealPrice,
    assignedSeatsCount,
    allSeatsAssigned: assignedSeatsCount === passengers.length,
  };
}
