import type { AircraftConfig, MealOption } from '../types/flight';

export const AIRCRAFT_CONFIGS: Record<string, AircraftConfig> = {
  '3-2': {
    type: '3-2',
    name: 'Airbus A220-300',
    aircraftModel: 'Regional Jet (Single Aisle)',
    description: '3 seats on left, 2 seats on right',
    columnGroups: [
      ['A', 'B', 'C'],
      ['D', 'E'],
    ],
    totalRows: 12,
    exitRows: [6],
    wingsRows: [5, 6, 7, 8],
  },
  '2-3-2': {
    type: '2-3-2',
    name: 'Boeing 767-300ER',
    aircraftModel: 'Wide-body (Twin Aisle)',
    description: '2 seats left, 3 seats middle, 2 seats right',
    columnGroups: [
      ['A', 'B'],
      ['D', 'E', 'F'],
      ['G', 'H'],
    ],
    totalRows: 14,
    exitRows: [7],
    wingsRows: [6, 7, 8, 9],
  },
};

export const MEAL_OPTIONS: MealOption[] = [
  {
    id: 'meal-none',
    name: 'No Meal',
    category: 'special',
    description: 'Opt out of in-flight meal service',
    price: 0,
  },
  {
    id: 'meal-snack-free',
    name: 'Complimentary Tea & Biscuit Combo',
    category: 'vegetarian',
    description: 'Warm beverage served with gourmet butter cookies',
    price: 0,
    calories: '180 kcal',
    tag: 'Free',
  },
  {
    id: 'meal-paneer-wrap',
    name: 'Smoked Paneer Tikka Kathi Roll',
    category: 'vegetarian',
    description: 'Char-grilled cottage cheese tossed with peppers in a flaky paratha wrap',
    price: 250,
    calories: '420 kcal',
    tag: 'Chef Choice',
  },
  {
    id: 'meal-chicken-biryani',
    name: 'Awadhi Murgh Dum Biryani',
    category: 'non-vegetarian',
    description: 'Aromatic basmati rice cooked with succulent chicken chunks and royal spices',
    price: 350,
    calories: '580 kcal',
    tag: 'Popular',
  },
  {
    id: 'meal-fruit-platter',
    name: 'Seasonal Fresh Fruit & Nut Salad',
    category: 'special',
    description: 'Freshly cut seasonal fruits paired with toasted almonds and honey drizzle',
    price: 200,
    calories: '220 kcal',
    tag: 'Healthy',
  },
];
