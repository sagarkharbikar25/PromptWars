export interface Gate {
  id: string;
  name: string;
  occupancyRate: number; // 0 to 100
  capacity: number;
  accessibility: string[];
  nearestZones: string[];
  closestTransport: string[];
  status: 'Open' | 'Closed' | 'Warning' | 'Critical';
}

export interface Zone {
  id: string;
  name: string;
  crowdLevel: 'Low' | 'Medium' | 'High' | 'Overcrowded';
  securityStatus: 'Normal' | 'Alert' | 'Lockdown';
  amenities: string[];
  keyHighlights: string;
}

export interface TransportOption {
  id: string;
  name: string;
  type: 'Metro' | 'Shuttle' | 'Rideshare' | 'Parking';
  status: 'Smooth' | 'Delayed' | 'Suspended';
  waitTimeMinutes: number;
  details: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category: 'Logistics' | 'Safety' | 'Ticketing' | 'Food & Beverage';
}

export const STADIUM_NAME = "StadiumGenie Arena (Dallas/Arlington - FIFA World Cup 2026)";

export const GATES_DATA: Gate[] = [
  {
    id: "gate_1",
    name: "Gate 1 (North Main)",
    occupancyRate: 88,
    capacity: 12000,
    accessibility: ["Wheelchair Ramp", "Tactile Paving", "Braille Signage", "Low-level Counters"],
    nearestZones: ["Zone A", "Zone B"],
    closestTransport: ["Red Line Metro Station", "Parking Lot A"],
    status: "Warning"
  },
  {
    id: "gate_2",
    name: "Gate 2 (North East)",
    occupancyRate: 42,
    capacity: 8000,
    accessibility: ["Wheelchair Ramp", "Elevator Access"],
    nearestZones: ["Zone B"],
    closestTransport: ["Parking Lot B"],
    status: "Open"
  },
  {
    id: "gate_3",
    name: "Gate 3 (East Accessible)",
    occupancyRate: 95,
    capacity: 5000,
    accessibility: ["Zero-step Entrance", "Elevator to All Tiers", "Dedicated ADA Assistance Desk", "Visual Alarm Systems"],
    nearestZones: ["Zone C"],
    closestTransport: ["ADA Shuttle Drop-off", "Rideshare Zone C"],
    status: "Critical"
  },
  {
    id: "gate_4",
    name: "Gate 4 (South East)",
    occupancyRate: 50,
    capacity: 9000,
    accessibility: ["Wheelchair Ramp"],
    nearestZones: ["Zone C", "Zone D"],
    closestTransport: ["Rideshare Zone C", "Shuttle Hub East"],
    status: "Open"
  },
  {
    id: "gate_5",
    name: "Gate 5 (South Main)",
    occupancyRate: 65,
    capacity: 15000,
    accessibility: ["Wheelchair Ramp", "Tactile Paving", "Braille Signage"],
    nearestZones: ["Zone D", "Zone E"],
    closestTransport: ["Blue Line Metro Station", "Shuttle Hub South"],
    status: "Open"
  },
  {
    id: "gate_6",
    name: "Gate 6 (South West)",
    occupancyRate: 30,
    capacity: 8000,
    accessibility: ["Wheelchair Ramp"],
    nearestZones: ["Zone E"],
    closestTransport: ["Parking Lot D"],
    status: "Open"
  },
  {
    id: "gate_7",
    name: "Gate 7 (West Gate)",
    occupancyRate: 92,
    capacity: 10000,
    accessibility: ["Wheelchair Ramp", "Elevator Access", "Low-level Counters"],
    nearestZones: ["Zone A", "Zone E"],
    closestTransport: ["Rideshare Zone A", "Parking Lot C"],
    status: "Critical"
  },
  {
    id: "gate_8",
    name: "Gate 8 (VIP & Media)",
    occupancyRate: 25,
    capacity: 3000,
    accessibility: ["Full Accessibility Access", "Private Elevator"],
    nearestZones: ["Zone A", "Zone C"],
    closestTransport: ["VIP Parking Lot V"],
    status: "Open"
  }
];

export const ZONES_DATA: Zone[] = [
  {
    id: "zone_a",
    name: "Zone A (General Seating & Fan Zone)",
    crowdLevel: "High",
    securityStatus: "Normal",
    amenities: ["Food Court A (Halal/Vegan)", "Official Fan Shop", "Gender-Neutral Restrooms", "ATM"],
    keyHighlights: "Hosts the main pre-match Fan Stage and interactive gaming experiences."
  },
  {
    id: "zone_b",
    name: "Zone B (Family & Sensory Friendly Seating)",
    crowdLevel: "Medium",
    securityStatus: "Normal",
    amenities: ["Sensory Room", "Stroller Parking", "Family Restrooms", "First Aid Station 1", "Kid's Play Area"],
    keyHighlights: "Designed with low-decibel audio coverage and sensory-escape spaces for children."
  },
  {
    id: "zone_c",
    name: "Zone C (Premium Club Seating & Suites)",
    crowdLevel: "Low",
    securityStatus: "Normal",
    amenities: ["Executive Lounge", "Fine Dining Restaurants", "VIP Restrooms", "Concierge Desk"],
    keyHighlights: "Exclusive access. Panoramic views of the pitch with private balcony access."
  },
  {
    id: "zone_d",
    name: "Zone D (Active Fan Stand - Supporter Club)",
    crowdLevel: "Overcrowded",
    securityStatus: "Alert",
    amenities: ["Beverage Express Kiosks", "Restrooms", "Merchandise Stand 2"],
    keyHighlights: "Dynamic singing and flag-waving section. High volume, energetic atmosphere."
  },
  {
    id: "zone_e",
    name: "Zone E (South Deck Seating & Accessibility Hub)",
    crowdLevel: "Medium",
    securityStatus: "Normal",
    amenities: ["Wheelchair Platforms", "Audio-Descriptive Commentary Transmitter Booth", "First Aid Station 2", "Food Court B"],
    keyHighlights: "Equipped with wide walkways, dedicated companion seating, and direct access to elevators."
  }
];

export const TRANSPORT_DATA: TransportOption[] = [
  {
    id: "metro_red",
    name: "Red Line Metro (Stadium North)",
    type: "Metro",
    status: "Smooth",
    waitTimeMinutes: 8,
    details: "Trains running every 3 minutes post-match. Direct link to Downtown Transit Center."
  },
  {
    id: "metro_blue",
    name: "Blue Line Metro (Stadium South)",
    type: "Metro",
    status: "Delayed",
    waitTimeMinutes: 25,
    details: "Signal issue near Central Station. High crowd backlog. Expect delays; staff advising Red Line or Shuttle instead."
  },
  {
    id: "shuttle_east",
    name: "Express Shuttle Hub (East)",
    type: "Shuttle",
    status: "Smooth",
    waitTimeMinutes: 12,
    details: "Continuous shuttle loops running to Park-and-Ride Lots 1-5. Wheelchair accessible."
  },
  {
    id: "rideshare_c",
    name: "Rideshare Hub (Zone C/East)",
    type: "Rideshare",
    status: "Delayed",
    waitTimeMinutes: 20,
    details: "High demand. Surge pricing in effect. Traffic slow-down on Stadium Blvd outer loop."
  },
  {
    id: "parking_main",
    name: "Parking Lots A & B",
    type: "Parking",
    status: "Smooth",
    waitTimeMinutes: 15,
    details: "Exit lanes are open. Post-match outflow is moving steadily under traffic police control."
  }
];

export const FAQS_DATA: FAQ[] = [
  {
    question: "What time do the stadium gates open?",
    answer: "For FIFA World Cup 2026 matches, gates open 3 hours prior to kickoff. We recommend arriving at least 2 hours early to clear security.",
    category: "Logistics"
  },
  {
    question: "Where is the nearest wheelchair-accessible entry?",
    answer: "Gate 3 (East Accessible) is our primary zero-step entrance, featuring dedicated elevator access, lower service counters, and ADA assistance desks. Gates 1, 5, and 7 also support wheelchair access.",
    category: "Logistics"
  },
  {
    question: "What is the bag policy for the tournament?",
    answer: "Only clear bags smaller than 12x6x12 inches (30x15x30 cm) or small clutches/purses under 4.5x6.5 inches are allowed. Backpacks, camera bags, and large luggage are strictly prohibited.",
    category: "Safety"
  },
  {
    question: "Is there a sensory-friendly space for overstimulated fans?",
    answer: "Yes, a state-of-the-art Sensory Room is located in Zone B. It is noise-insulated, equipped with sensory toys, weighted blankets, and dimmable lighting. Ask any guest service member for access.",
    category: "Safety"
  },
  {
    question: "Can I bring my own food and water?",
    answer: "You cannot bring outside food or drinks, except for medical purposes or infant formula. An empty, clear plastic water bottle up to 20oz (which can be filled at water fountains inside) is permitted.",
    category: "Food & Beverage"
  },
  {
    question: "Are there Halal, Kosher, or Gluten-Free food options?",
    answer: "Yes, Food Court A in Zone A offers certified Halal and Vegan options. Food Court B in Zone E has certified Gluten-Free items. Gluten-free beers and vegetarian snacks are available at all beverage kiosks.",
    category: "Food & Beverage"
  },
  {
    question: "How do I get back to the city center using public transit?",
    answer: "You can take the Red Line Metro from the Stadium North station (closest to Gate 1) which has a wait time of under 10 minutes, or the Express Shuttle Hub from the East side. The Blue Line Metro at Stadium South is currently experiencing delays.",
    category: "Logistics"
  }
];
