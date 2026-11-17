# Flight Seat Selection & Passenger Management System

A high-performance, responsive flight seat selection and passenger management interface built with **React**, **TypeScript**, and **Tailwind CSS**. Designed to handle real-world airline booking workflows including multi-passenger allocation, dynamic cabin layouts, seat tiers, and in-flight add-ons.

---

## 🚀 Live Demo & Repository
- **GitHub Repository**: [kpaisa-flight-seat-assessment](https://github.com/PratikPatidar/kpaisa-flight-seat-assessment)
- **Tech Stack**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite

---

## ✈️ Key Features

### 1. Passenger Selection & Active Management
- **Dynamic Passenger Count**: Supports 1 to 6 passengers with quick increment/decrement controls.
- **Active Passenger Switcher**: Visual tab pills showing current seat assignment status per passenger.
- **Context-Aware Allocation**: Any seat selected on the map is immediately mapped to the currently highlighted active passenger.
- **Seat Reassignment & Removal**: Easily unassign or reassign seats with single clicks or from the summary sidebar.

### 2. Dual Aircraft Cabin Layouts
Seamlessly toggle between two distinct commercial aircraft configurations:
- **3–2 Layout (Narrow-body / Airbus A220-300)**:
  - 3 seats on port side `[A, B, C]` and 2 seats on starboard side `[D, E]`.
  - Single central aisle with designated emergency exit rows.
- **2–3–2 Layout (Wide-body / Boeing 767-300ER)**:
  - Twin-aisle configuration: `[A, B]` (left window/aisle), `[D, E, F]` (center), and `[G, H]` (right aisle/window).
  - Exit row doors and realistic wing section markers.

### 3. Seat States & Dynamic Pricing Tiers
- **Visual Seat States**:
  - `Available`: Selectable with distinct tier accents.
  - `Selected (Active Passenger)`: Highlighted with emerald glow and ring border.
  - `Selected (Other Passenger)`: Highlighted in sky blue with passenger initials.
  - `Occupied`: Pre-booked seats rendered in muted tones with collision prevention.
- **Pricing Tiers**:
  - **Standard**: ₹0 (Free)
  - **Premium**: ₹250 (Front rows & quick deplane)
  - **Extra Legroom**: ₹350 (Emergency exit rows with maximum comfort)

### 4. Real-time Fare Engine & Breakdown
- Instant recalculation of seat charges, meal charges, and taxes.
- Itemized passenger billing card with one-click seat removal.
- Validation gate preventing checkout until all passengers have assigned seats.

### 5. Bonus Features & UX Polish
- **In-Flight Meal Customization**: Modal-based meal selection for each passenger (Free snacks & hot gourmet meals).
- **Dark / Light Mode**: Seamless theme switching with localStorage persistence.
- **Full Unit Test Suite**: Automated Vitest coverage for state transitions, pricing invariant, and edge cases.

---

## 🏗️ System Architecture & State Management

The application adheres to clean architecture principles:

```text
src/
├── components/          # Reusable UI components
│   ├── AircraftCabin    # Plane body, cockpit, wings, and row renderer
│   ├── AircraftControls # Layout switcher (3-2 vs 2-3-2)
│   ├── BookingSummary   # Live fare breakdown and checkout CTA
│   ├── FlightHeader     # Flight route, schedule, and metadata
│   ├── MealSelection    # Bonus meal customizer modal
│   ├── PassengerSelector# Passenger count and active selector
│   ├── SeatItem         # Individual seat button with cushion styling
│   ├── SeatLegend       # Status & pricing tier guide
│   └── ToastNotification# Action feedback & validation alerts
├── context/             # Global state management
│   ├── BookingContext   # React Context provider & consumer hook
│   ├── bookingReducer   # Pure reducer enforcing business rules
│   └── bookingTypes     # Action and state TypeScript contracts
├── data/                # Mock flight and meal specifications
├── types/               # Core domain models
└── utils/               # Pure calculation & layout generators
```

### State Management Decision:
- **Centralized Reducer (`useReducer` + `Context API`)**: Guarantees predictable state transitions for complex concurrent actions (e.g. switching passenger count while retaining valid assignments, re-rendering cabin grids on aircraft model change, and preventing race conditions during collision checks).
- **Zero Double-Booking Invariant**: Enforced at the reducer level. A seat cannot be claimed if already assigned to another passenger or flagged as occupied.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/PratikPatidar/kpaisa-flight-seat-assessment.git

# Navigate to project directory
cd kpaisa-flight-seat-assessment

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Automated Test Suite
```bash
# Run unit test suite (Vitest)
npm test
```

### Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 📋 Evaluation Checklist Covered
- [x] Passenger selection & switching (1–6 passengers)
- [x] Dual aircraft seating (3–2 and 2–3–2 configurations)
- [x] Strict 1-to-1 seat assignment (no double bookings)
- [x] Distinct seat states (Available, Occupied, Selected, Free)
- [x] Real-time total cost calculation and breakdown
- [x] Bonus: Full in-flight meal selection
- [x] Fully responsive across desktop, tablet, and mobile
- [x] Zero runtime or TypeScript compilation errors
