import type { BookingTotalCalculation } from './pricingCalculator';
import type { FlightSchedule } from '../data/flightSchedule';

export function printBoardingPass(
  pnr: string,
  totals: BookingTotalCalculation,
  schedule: FlightSchedule,
  date: string,
  aircraftName: string
) {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    alert('Please allow popups to print your boarding pass.');
    return;
  }

  const passengersHtml = totals.passengersBreakdown
    .map(
      (p) => `
    <div style="border: 2px dashed #0284c7; border-radius: 12px; margin-bottom: 24px; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fafafa; page-break-inside: avoid;">
      <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
        <div>
          <h2 style="margin: 0; color: #0369a1; font-size: 20px;">K-AIRLINES BOARDING PASS</h2>
          <span style="font-size: 12px; color: #64748b;">DEL (Indira Gandhi Int'l) &rarr; BOM (Chhatrapati Shivaji Maharaj Int'l)</span>
        </div>
        <div style="text-align: right;">
          <strong style="font-size: 18px; color: #0f172a;">${schedule.flightNumber}</strong>
          <div style="font-size: 12px; color: #64748b;">PNR: <b style="color: #0369a1;">${pnr}</b></div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <div>
          <span style="font-size: 11px; text-transform: uppercase; color: #64748b;">Passenger Name</span>
          <div style="font-size: 15px; font-weight: bold; color: #0f172a;">${p.passengerName}</div>
        </div>
        <div>
          <span style="font-size: 11px; text-transform: uppercase; color: #64748b;">Seat</span>
          <div style="font-size: 18px; font-weight: 900; color: #0284c7;">${p.seatId || 'N/A'}</div>
        </div>
        <div>
          <span style="font-size: 11px; text-transform: uppercase; color: #64748b;">Gate</span>
          <div style="font-size: 15px; font-weight: bold; color: #0f172a;">${schedule.gate}</div>
        </div>
        <div>
          <span style="font-size: 11px; text-transform: uppercase; color: #64748b;">Boarding Time</span>
          <div style="font-size: 15px; font-weight: bold; color: #0f172a;">${schedule.departureTime}</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 16px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
        <div>
          <span style="font-size: 11px; text-transform: uppercase; color: #64748b;">Date & Aircraft</span>
          <div style="font-size: 13px; color: #334155;">${date} • ${aircraftName}</div>
        </div>
        <div>
          <span style="font-size: 11px; text-transform: uppercase; color: #64748b;">Meal Selected</span>
          <div style="font-size: 13px; color: #334155;">${p.mealName || 'Complimentary'}</div>
        </div>
        <div>
          <span style="font-size: 11px; text-transform: uppercase; color: #64748b;">Class / Tier</span>
          <div style="font-size: 13px; text-transform: capitalize; color: #334155;">${p.seatTier || 'Standard'}</div>
        </div>
        <div>
          <span style="font-size: 11px; text-transform: uppercase; color: #64748b;">Status</span>
          <div style="font-size: 13px; color: #16a34a; font-weight: bold;">CONFIRMED</div>
        </div>
      </div>

      <div style="margin-top: 16px; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
        <span style="font-family: monospace; letter-spacing: 4px; font-size: 13px; color: #475569;">|||| | |||||| || |||||||| |||| ||| |||||| |||||</span>
      </div>
    </div>
  `
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Boarding Pass - ${pnr}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1e293b; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div style="max-width: 700px; margin: 0 auto;">
          <div style="text-align: right; margin-bottom: 12px;">
            <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold;">
              Print / Save as PDF
            </button>
          </div>
          ${passengersHtml}
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
}
