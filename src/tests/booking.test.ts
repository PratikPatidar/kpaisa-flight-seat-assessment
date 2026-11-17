import { describe, it, expect } from 'vitest';
import { bookingReducer, initialBookingState } from '../context/bookingReducer';
import { calculateBookingTotals } from '../utils/pricingCalculator';


describe('Flight Booking Reducer & Seat Assignment Logic', () => {
  it('should increase and decrease passenger count correctly within bounds (1-6)', () => {
    let state = bookingReducer(initialBookingState, { type: 'SET_PASSENGER_COUNT', count: 4 });
    expect(state.passengers.length).toBe(4);
    expect(state.passengerCount).toBe(4);

    // Bound test: max 6
    state = bookingReducer(state, { type: 'SET_PASSENGER_COUNT', count: 10 });
    expect(state.passengers.length).toBe(6);

    // Bound test: min 1
    state = bookingReducer(state, { type: 'SET_PASSENGER_COUNT', count: 0 });
    expect(state.passengers.length).toBe(1);
  });

  it('should switch active passenger properly', () => {
    let state = bookingReducer(initialBookingState, { type: 'SET_PASSENGER_COUNT', count: 3 });
    state = bookingReducer(state, { type: 'SET_ACTIVE_PASSENGER', passengerId: 'p2' });
    expect(state.activePassengerId).toBe('p2');
  });

  it('should assign an available seat to the active passenger', () => {
    // 4A is available in 3-2 layout
    const state = bookingReducer(initialBookingState, { type: 'ASSIGN_SEAT', seatId: '4A' });
    const p1 = state.passengers.find((p) => p.id === 'p1');
    expect(p1?.seatId).toBe('4A');
    expect(state.notification?.type).toBe('success');
  });

  it('should prevent assigning an occupied seat', () => {
    // 1B is pre-occupied in mock data
    const state = bookingReducer(initialBookingState, { type: 'ASSIGN_SEAT', seatId: '1B' });
    const p1 = state.passengers.find((p) => p.id === 'p1');
    expect(p1?.seatId).toBeNull();
    expect(state.notification?.type).toBe('error');
    expect(state.notification?.message).toContain('already occupied');
  });

  it('should prevent two passengers from claiming the same seat', () => {
    // 1. Assign 4A to Passenger 1
    let state = bookingReducer(initialBookingState, { type: 'ASSIGN_SEAT', seatId: '4A' });

    // 2. Switch to Passenger 2
    state = bookingReducer(state, { type: 'SET_ACTIVE_PASSENGER', passengerId: 'p2' });

    // 3. Passenger 2 tries to pick 4A
    state = bookingReducer(state, { type: 'ASSIGN_SEAT', seatId: '4A' });

    const p2 = state.passengers.find((p) => p.id === 'p2');
    expect(p2?.seatId).toBeNull();
    expect(state.notification?.type).toBe('error');
    expect(state.notification?.message).toContain('already assigned to Passenger 1');
  });

  it('should toggle seat assignment off when clicking the same seat again', () => {
    let state = bookingReducer(initialBookingState, { type: 'ASSIGN_SEAT', seatId: '4A' });
    expect(state.passengers[0].seatId).toBe('4A');

    // Click again to deselect
    state = bookingReducer(state, { type: 'ASSIGN_SEAT', seatId: '4A' });
    expect(state.passengers[0].seatId).toBeNull();
  });

  it('should reset seat assignments when switching aircraft layout', () => {
    let state = bookingReducer(initialBookingState, { type: 'ASSIGN_SEAT', seatId: '4A' });
    expect(state.passengers[0].seatId).toBe('4A');

    // Switch to 2-3-2 layout
    state = bookingReducer(state, { type: 'SET_AIRCRAFT_TYPE', aircraftType: '2-3-2' });
    expect(state.aircraftType).toBe('2-3-2');
    expect(state.passengers[0].seatId).toBeNull();
  });
});

describe('Pricing and Calculation Engine', () => {
  it('should calculate grand total with standard, premium and extra legroom seats', () => {
    // 4A is Standard (₹0), 1E is Premium (₹250)
    let state = bookingReducer(initialBookingState, { type: 'ASSIGN_SEAT', seatId: '4A' });
    state = bookingReducer(state, { type: 'SET_ACTIVE_PASSENGER', passengerId: 'p2' });
    state = bookingReducer(state, { type: 'ASSIGN_SEAT', seatId: '1E' });

    const totals = calculateBookingTotals(state);
    expect(totals.totalSeatPrice).toBe(250);
    expect(totals.assignedSeatsCount).toBe(2);
    expect(totals.allSeatsAssigned).toBe(true);
    expect(totals.grandTotal).toBe(250);
  });

  it('should include meal charges in the final total calculation', () => {
    let state = bookingReducer(initialBookingState, { type: 'ASSIGN_SEAT', seatId: '4A' }); // ₹0
    state = bookingReducer(state, {
      type: 'ASSIGN_MEAL',
      passengerId: 'p1',
      mealId: 'meal-chicken-biryani', // ₹350
    });

    const totals = calculateBookingTotals(state);
    expect(totals.totalMealPrice).toBe(350);
    expect(totals.grandTotal).toBe(350);
  });
});
