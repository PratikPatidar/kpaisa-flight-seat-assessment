import type { BookingAction, BookingState } from './bookingTypes';
import { AIRCRAFT_CONFIGS } from '../data/flightData';
import { AVAILABLE_SCHEDULES } from '../data/flightSchedule';
import { generateSeatingLayout } from '../utils/seatGenerator';
import type { Passenger } from '../types/flight';

export function createInitialPassengers(count: number): Passenger[] {
  return Array.from({ length: count }, (_, idx) => ({
    id: `p${idx + 1}`,
    name: `Passenger ${idx + 1}`,
    seatId: null,
    mealId: 'meal-none',
  }));
}

export const initialBookingState: BookingState = {
  aircraftType: '3-2',
  passengerCount: 2,
  passengers: createInitialPassengers(2),
  activePassengerId: 'p1',
  seatsByRow: generateSeatingLayout(AIRCRAFT_CONFIGS['3-2']),
  departureDate: '2026-11-18',
  schedule: AVAILABLE_SCHEDULES[1],
  notification: null,
};

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_PASSENGER_COUNT': {
      const newCount = Math.max(1, Math.min(6, action.count));
      let updatedPassengers = [...state.passengers];

      if (newCount > state.passengers.length) {
        const currentLen = state.passengers.length;
        const additional: Passenger[] = Array.from(
          { length: newCount - currentLen },
          (_, i) => ({
            id: `p${currentLen + i + 1}`,
            name: `Passenger ${currentLen + i + 1}`,
            seatId: null,
            mealId: 'meal-none',
          })
        );
        updatedPassengers = [...updatedPassengers, ...additional];
      } else if (newCount < state.passengers.length) {
        updatedPassengers = updatedPassengers.slice(0, newCount);
      }

      const activeStillExists = updatedPassengers.some(
        (p) => p.id === state.activePassengerId
      );
      const activePassengerId = activeStillExists
        ? state.activePassengerId
        : updatedPassengers[0]?.id || 'p1';

      return {
        ...state,
        passengerCount: newCount,
        passengers: updatedPassengers,
        activePassengerId,
      };
    }

    case 'SET_ACTIVE_PASSENGER': {
      return {
        ...state,
        activePassengerId: action.passengerId,
      };
    }

    case 'SET_AIRCRAFT_TYPE': {
      if (state.aircraftType === action.aircraftType) return state;

      const newConfig = AIRCRAFT_CONFIGS[action.aircraftType];
      const newSeats = generateSeatingLayout(newConfig);

      const resetPassengers = state.passengers.map((p) => ({
        ...p,
        seatId: null,
      }));

      return {
        ...state,
        aircraftType: action.aircraftType,
        seatsByRow: newSeats,
        passengers: resetPassengers,
        notification: {
          message: `Switched to ${newConfig.name} (${action.aircraftType}). Seats reset.`,
          type: 'info',
        },
      };
    }

    case 'SET_FLIGHT_SCHEDULE': {
      const resetPassengers = state.passengers.map((p) => ({
        ...p,
        seatId: null,
      }));
      return {
        ...state,
        departureDate: action.date,
        schedule: action.schedule,
        passengers: resetPassengers,
        notification: {
          message: `Updated to ${action.date} (${action.schedule.flightNumber} at ${action.schedule.departureTime}). Seats reset.`,
          type: 'info',
        },
      };
    }

    case 'ASSIGN_SEAT': {
      const { seatId } = action;

      let targetSeat = null;
      for (const row of state.seatsByRow) {
        const found = row.find((s) => s.id === seatId);
        if (found) {
          targetSeat = found;
          break;
        }
      }

      if (!targetSeat) return state;

      if (targetSeat.isOccupied) {
        return {
          ...state,
          notification: {
            message: `Seat ${seatId} is already occupied.`,
            type: 'error',
          },
        };
      }

      const otherPassenger = state.passengers.find(
        (p) => p.seatId === seatId && p.id !== state.activePassengerId
      );

      if (otherPassenger) {
        return {
          ...state,
          notification: {
            message: `Seat ${seatId} is already assigned to ${otherPassenger.name}.`,
            type: 'error',
          },
        };
      }

      const currentPassenger = state.passengers.find(
        (p) => p.id === state.activePassengerId
      );

      if (currentPassenger?.seatId === seatId) {
        return {
          ...state,
          passengers: state.passengers.map((p) =>
            p.id === state.activePassengerId ? { ...p, seatId: null } : p
          ),
          notification: {
            message: `Removed seat ${seatId} for ${currentPassenger.name}.`,
            type: 'info',
          },
        };
      }

      return {
        ...state,
        passengers: state.passengers.map((p) =>
          p.id === state.activePassengerId ? { ...p, seatId } : p
        ),
        notification: {
          message: `Seat ${seatId} assigned to ${currentPassenger?.name}.`,
          type: 'success',
        },
      };
    }

    case 'REMOVE_SEAT': {
      const targetPassenger = state.passengers.find((p) => p.id === action.passengerId);
      if (!targetPassenger || !targetPassenger.seatId) return state;

      return {
        ...state,
        passengers: state.passengers.map((p) =>
          p.id === action.passengerId ? { ...p, seatId: null } : p
        ),
        notification: {
          message: `Cleared seat assignment for ${targetPassenger.name}.`,
          type: 'info',
        },
      };
    }

    case 'ASSIGN_MEAL': {
      return {
        ...state,
        passengers: state.passengers.map((p) =>
          p.id === action.passengerId ? { ...p, mealId: action.mealId } : p
        ),
      };
    }

    case 'SET_NOTIFICATION': {
      return {
        ...state,
        notification: {
          message: action.message,
          type: action.notificationType,
        },
      };
    }

    case 'CLEAR_NOTIFICATION': {
      return {
        ...state,
        notification: null,
      };
    }

    default:
      return state;
  }
}
