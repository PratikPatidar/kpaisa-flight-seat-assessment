export type SeatTier = 'standard' | 'premium' | 'extraLegroom';

export type SeatStatus = 'available' | 'occupied' | 'selected';

export type SeatPosition = 'window' | 'middle' | 'aisle';

export interface Seat {
  id: string;
  row: number;
  column: string;
  tier: SeatTier;
  price: number;
  position: SeatPosition;
  isOccupied: boolean;
  isExitRow?: boolean;
}

export type AircraftType = '3-2' | '2-3-2';

export interface AircraftConfig {
  type: AircraftType;
  name: string;
  aircraftModel: string;
  description: string;
  columnGroups: string[][];
  totalRows: number;
  exitRows: number[];
  wingsRows: number[];
}

export interface MealOption {
  id: string;
  name: string;
  category: 'vegetarian' | 'non-vegetarian' | 'beverage' | 'special';
  description: string;
  price: number;
  calories?: string;
  tag?: string;
}

export interface Passenger {
  id: string;
  name: string;
  seatId: string | null;
  mealId: string | null;
}
