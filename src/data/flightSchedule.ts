export interface FlightSchedule {
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  gate: string;
  terminal: string;
}

export const AVAILABLE_SCHEDULES: FlightSchedule[] = [
  {
    flightNumber: 'FL-1022',
    departureTime: '06:15 IST',
    arrivalTime: '08:30 IST',
    duration: '2h 15m',
    terminal: 'Terminal 3',
    gate: '08A',
  },
  {
    flightNumber: 'FL-2048',
    departureTime: '14:30 IST',
    arrivalTime: '16:45 IST',
    duration: '2h 15m',
    terminal: 'Terminal 3',
    gate: '14B',
  },
  {
    flightNumber: 'FL-3091',
    departureTime: '19:45 IST',
    arrivalTime: '22:00 IST',
    duration: '2h 15m',
    terminal: 'Terminal 3',
    gate: '22C',
  },
  {
    flightNumber: 'FL-4105',
    departureTime: '22:30 IST',
    arrivalTime: '00:45 IST',
    duration: '2h 15m',
    terminal: 'Terminal 3',
    gate: '19A',
  },
];
