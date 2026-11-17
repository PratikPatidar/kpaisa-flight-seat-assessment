import type { AircraftType, Passenger, Seat } from '../types/flight';
import type { FlightSchedule } from '../data/flightSchedule';

export interface BookingState {
  aircraftType: AircraftType;
  passengerCount: number;
  passengers: Passenger[];
  activePassengerId: string;
  seatsByRow: Seat[][];
  departureDate: string;
  schedule: FlightSchedule;
  notification: { message: string; type: 'error' | 'success' | 'info' } | null;
}

export type BookingAction =
  | { type: 'SET_PASSENGER_COUNT'; count: number }
  | { type: 'SET_ACTIVE_PASSENGER'; passengerId: string }
  | { type: 'SET_AIRCRAFT_TYPE'; aircraftType: AircraftType }
  | { type: 'SET_FLIGHT_SCHEDULE'; date: string; schedule: FlightSchedule }
  | { type: 'ASSIGN_SEAT'; seatId: string }
  | { type: 'REMOVE_SEAT'; passengerId: string }
  | { type: 'ASSIGN_MEAL'; passengerId: string; mealId: string }
  | { type: 'SET_NOTIFICATION'; message: string; notificationType: 'error' | 'success' | 'info' }
  | { type: 'CLEAR_NOTIFICATION' };

