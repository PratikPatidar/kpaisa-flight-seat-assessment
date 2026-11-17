import type { AircraftConfig, Seat, SeatPosition, SeatTier } from '../types/flight';

// Deterministic occupied seats seed for realistic demo
const PRE_OCCUPIED_SEATS_3_2 = new Set([
  '1B', '2D', '3A', '3E', '5B', '6C', '7A', '8E', '10C', '11D', '12B'
]);

const PRE_OCCUPIED_SEATS_2_3_2 = new Set([
  '1A', '2E', '3B', '3H', '4E', '5A', '6G', '7D', '8B', '9F', '11A', '12H', '13E'
]);

export function generateSeatingLayout(config: AircraftConfig): Seat[][] {
  const { totalRows, columnGroups, exitRows, type } = config;
  const occupiedSet = type === '3-2' ? PRE_OCCUPIED_SEATS_3_2 : PRE_OCCUPIED_SEATS_2_3_2;

  const rows: Seat[][] = [];

  for (let r = 1; r <= totalRows; r++) {
    const rowSeats: Seat[] = [];
    const isExit = exitRows.includes(r);

    for (const group of columnGroups) {
      const groupLen = group.length;

      group.forEach((col, idx) => {
        const id = `${r}${col}`;

        // Determine position (window / aisle / middle)
        let position: SeatPosition = 'middle';
        if (col === 'A' || col === 'E' && type === '3-2' || col === 'H' && type === '2-3-2') {
          position = 'window';
        } else if (idx === 0 || idx === groupLen - 1) {
          position = 'aisle';
        }

        // Determine tier & price matching assignment guidelines
        let tier: SeatTier = 'standard';
        let price = 0;

        if (isExit) {
          tier = 'extraLegroom';
          price = 350;
        } else if (r === 1 || r === 2) {
          // Row 1 & 2 premium / extra legroom as specified in PDF sample
          if (col === 'A' || col === 'C') {
            tier = 'extraLegroom';
            price = 350;
          } else if (col === 'E' || col === 'D') {
            tier = 'premium';
            price = 250;
          } else {
            tier = 'standard';
            price = 0;
          }
        } else if (r === 3 && (col === 'A' || col === 'E' || col === 'H')) {
          tier = 'premium';
          price = 250;
        }

        const seat: Seat = {
          id,
          row: r,
          column: col,
          tier,
          price,
          position,
          isOccupied: occupiedSet.has(id),
          isExitRow: isExit,
        };

        rowSeats.push(seat);
      });
    }

    rows.push(rowSeats);
  }

  return rows;
}
