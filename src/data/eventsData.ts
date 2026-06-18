/**
 * Per-event detail for the GTM Events page — sourced from CloudCowboy_Proforma
 * tabs "1. Events Plan" (dates, locations, application links) and "3. Event
 * Budget" (the real cost build-up: booth/registration + mileage + lodging +
 * per-diem). Keyed by the event id (slug) from src/lib/model/data.ts.
 *
 * Cost build-up uses the proforma's "Full-Send" assumptions (3 people, 2 per
 * room, $160/room/night, $40/person/day, $0.70/mile, 2 rooms). Each event's
 * total here equals its cost in EVENT_SHOWS / the spec.
 */

export interface EventDetail {
  start: string; // ISO yyyy-mm-dd
  end: string; // ISO yyyy-mm-dd
  location: string;
  signupUrl?: string;
  dateConfirmed: boolean;
  travelDays: number;
  description: string;
  // Real cost build-up inputs (proforma "3. Event Budget")
  booth: number; // booth / registration $
  miles: number; // round-trip miles
  days: number; // trip days (drives per-diem)
  nights: number; // lodging nights
}

/** Full-Send budget assumptions from the proforma. */
export const EVENT_BUDGET = {
  people: 3,
  perRoom: 2,
  roomNight: 160,
  perDiem: 40,
  mileRate: 0.7,
  rooms: 2,
} as const;

export const EVENT_DETAILS: Record<string, EventDetail> = {
  "nebraska-ag-spray-drone-conference": {
    start: "2026-08-21", end: "2026-08-22", location: "Norfolk, NE",
    signupUrl: "https://cropwatch.unl.edu", dateConfirmed: true, travelDays: 1,
    booth: 500, miles: 940, days: 3, nights: 2,
    description: "UNL's Nebraska Ag & Spray Drone Conference — two days on drones in agriculture, from crop scouting to spray technology. Exactly the drone operators in our beachhead.",
  },
  "farm-progress-show": {
    start: "2026-09-01", end: "2026-09-03", location: "Boone, IA",
    signupUrl: "https://www.farmprogressshow.com", dateConfirmed: true, travelDays: 1,
    booth: 4500, miles: 1300, days: 5, nights: 4,
    description: "The nation's largest outdoor farm show (biennial). A 'Drone Zone' with live spray demos and ~100,000+ attendance — top-tier reach across the Corn Belt.",
  },
  "commercial-uav-expo-americas": {
    start: "2026-09-01", end: "2026-09-03", location: "Las Vegas, NV",
    signupUrl: "https://www.expouav.com", dateConfirmed: true, travelDays: 2,
    booth: 6000, miles: 1500, days: 5, nights: 4,
    description: "The leading commercial-drone trade show (~4,000 attendees, 225+ exhibitors). Strong for the drone-application side of the beachhead and ecosystem partnerships.",
  },
  "husker-harvest-days": {
    start: "2026-09-15", end: "2026-09-17", location: "Grand Island, NE",
    signupUrl: "https://www.huskerharvestdays.com", dateConfirmed: true, travelDays: 1,
    booth: 4000, miles: 800, days: 4, nights: 3,
    description: "The world's largest totally-irrigated working farm show (~100,000). Heavy hands-on demo attendance from row-crop operators.",
  },
  "farm-science-review": {
    start: "2026-09-22", end: "2026-09-24", location: "London, OH",
    signupUrl: "https://fsr.osu.edu/exhibitors", dateConfirmed: true, travelDays: 2,
    booth: 4000, miles: 2600, days: 6, nights: 5,
    description: "Ohio State's premier Midwest education + demo event (~140,000 growers and agribusiness professionals).",
  },
  "ozark-fall-farmfest": {
    start: "2026-10-02", end: "2026-10-04", location: "Springfield, MO",
    signupUrl: "https://ozarkfallfarmfest.com", dateConfirmed: true, travelDays: 1,
    booth: 2000, miles: 1600, days: 5, nights: 4,
    description: "General-ag farm show across the Ozarks (~50,000) — an optional regional add to broaden the funnel.",
  },
  "sunbelt-ag-expo": {
    start: "2026-10-20", end: "2026-10-22", location: "Moultrie, GA",
    signupUrl: "https://sunbeltexpo.com/exhibitors", dateConfirmed: true, travelDays: 2,
    booth: 4000, miles: 3000, days: 7, nights: 6,
    description: "North America's premier Southeast farm show (~100,000). Diversifies the pipeline into cotton, peanut and specialty operations.",
  },
  "colorado-aaa-convention-coaaa": {
    start: "2026-11-03", end: "2026-11-05", location: "Lamar, CO",
    signupUrl: "https://coagav.org/events", dateConfirmed: false, travelDays: 1,
    booth: 750, miles: 420, days: 3, nights: 2,
    description: "Colorado Agricultural Aviation Association convention & trade show (Fly-In) — the core aerial-application community in our home region. Top relationship value. (2025 was Nov 3–5; 2026 TBA.)",
  },
  "western-co-farm-ranch-innovation": {
    start: "2026-11-13", end: "2026-11-15", location: "Montrose, CO",
    signupUrl: "https://shavanocd.org", dateConfirmed: true, travelDays: 1,
    booth: 300, miles: 640, days: 4, nights: 3,
    description: "Western Slope farm & ranch innovation expo with indoor + outdoor demos — a top home-region relationship builder.",
  },
  "naaa-ag-aviation-expo": {
    start: "2026-11-16", end: "2026-11-18", location: "Savannah, GA",
    signupUrl: "https://www.agaviation.org", dateConfirmed: true, travelDays: 2,
    booth: 2500, miles: 3300, days: 7, nights: 6,
    description: "The National Agricultural Aviation Association's annual expo — the largest gathering of US ag-aviation operators. Top-tier for the aerial beachhead.",
  },
  "national-western-stock-show": {
    start: "2027-01-09", end: "2027-01-24", location: "Denver, CO",
    signupUrl: "https://nationalwestern.com", dateConfirmed: true, travelDays: 1,
    booth: 2500, miles: 30, days: 1, nights: 0,
    description: "The 16-day National Western Stock Show (~700,000) — a Colorado institution. Optional, local, high-foot-traffic presence (single-day staffing modeled).",
  },
  "colorado-farm-show": {
    start: "2027-01-26", end: "2027-01-28", location: "Greeley, CO",
    signupUrl: "https://www.coloradofarmshow.com", dateConfirmed: true, travelDays: 1,
    booth: 700, miles: 330, days: 3, nights: 0,
    description: "Greeley's Colorado Farm Show (~30,000; 300+ exhibitors) — a strong, low-cost home-region show reaching Front Range operators.",
  },
  "spray-drone-end-user-conf-sdeuc": {
    start: "2027-01-27", end: "2027-01-29", location: "Kansas City, MO",
    signupUrl: "https://www.sdeuc.com", dateConfirmed: false, travelDays: 1,
    booth: 3000, miles: 1200, days: 7, nights: 6,
    description: "The Spray Drone End User Conference — the largest spray-drone event in North America. Top fit for the beachhead. (Late-Jan 2027, exact dates TBA.)",
  },
  "ag-conference-of-the-southern-rockies": {
    start: "2027-02-03", end: "2027-02-05", location: "Monte Vista, CO",
    signupUrl: "https://agconferencesrm.com", dateConfirmed: false, travelDays: 1,
    booth: 400, miles: 440, days: 3, nights: 2,
    description: "San Luis Valley ag conference (potatoes/specialty crops, water, ag tech) — a strong, low-cost regional touchpoint. (2026 was Feb 3–5.)",
  },
  "commodity-classic": {
    start: "2027-03-03", end: "2027-03-05", location: "New Orleans, LA",
    signupUrl: "https://commodityclassic.com", dateConfirmed: true, travelDays: 2,
    booth: 4500, miles: 2600, days: 6, nights: 5,
    description: "America's largest farmer-led convention & trade show. Strong reach into the largest, most progressive row-crop operations.",
  },
  "four-states-ag-expo": {
    start: "2027-03-27", end: "2027-03-28", location: "Cortez, CO",
    signupUrl: "https://fourstatesagexpo.com", dateConfirmed: false, travelDays: 1,
    booth: 400, miles: 660, days: 3, nights: 2,
    description: "Four Corners regional ag expo (~200 exhibitors) — an optional, low-cost touchpoint. (2026 was Mar 27–28.)",
  },
  "xponential-auvsi": {
    start: "2027-05-17", end: "2027-05-20", location: "Miami, FL",
    signupUrl: "https://www.xponential.org", dateConfirmed: true, travelDays: 2,
    booth: 6000, miles: 4000, days: 8, nights: 7,
    description: "AUVSI XPONENTIAL — the largest uncrewed-systems and robotics exhibition. Optional but high-visibility for the autonomy/partnership narrative.",
  },
  "csu-wheat-field-days": {
    start: "2027-06-23", end: "2027-06-24", location: "Eastern CO trial sites",
    signupUrl: "https://agsci.colostate.edu/wheat", dateConfirmed: false, travelDays: 1,
    booth: 500, miles: 300, days: 1, nights: 0,
    description: "CSU wheat variety field days — a low-cost, hands-on, home-region touchpoint with wheat growers and agronomists. (Annual; June 2027.)",
  },
};

/** Sum of eventYearFactor over the 6 model years (0.5+1+1.1+1.21+1.331+1.4641). */
export const SIX_YEAR_EVENT_MULTIPLIER = 6.6051;

/** Real cost breakdown for an event (proforma "3. Event Budget" formulas). */
export function priceBreakdown(d: EventDetail): { label: string; amount: number }[] {
  const mileage = Math.round(d.miles * EVENT_BUDGET.mileRate);
  const lodging = d.nights * EVENT_BUDGET.rooms * EVENT_BUDGET.roomNight;
  const perDiem = d.days * EVENT_BUDGET.people * EVENT_BUDGET.perDiem;
  return [
    { label: "Booth / registration", amount: d.booth },
    { label: `Mileage (${d.miles.toLocaleString()} mi @ $${EVENT_BUDGET.mileRate}/mi)`, amount: mileage },
    { label: `Lodging (${d.nights} nights × ${EVENT_BUDGET.rooms} rooms @ $${EVENT_BUDGET.roomNight})`, amount: lodging },
    { label: `Per diem (${d.days} days × ${EVENT_BUDGET.people} @ $${EVENT_BUDGET.perDiem})`, amount: perDiem },
  ];
}

export const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatRange(startIso: string, endIso: string): string {
  const s = parseISO(startIso);
  const e = parseISO(endIso);
  const sM = MONTHS_SHORT[s.getMonth()];
  const eM = MONTHS_SHORT[e.getMonth()];
  if (startIso === endIso) return `${sM} ${s.getDate()}, ${s.getFullYear()}`;
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${sM} ${s.getDate()}–${e.getDate()}, ${e.getFullYear()}`;
  }
  if (s.getFullYear() === e.getFullYear()) {
    return `${sM} ${s.getDate()} – ${eM} ${e.getDate()}, ${e.getFullYear()}`;
  }
  return `${sM} ${s.getDate()}, ${s.getFullYear()} – ${eM} ${e.getDate()}, ${e.getFullYear()}`;
}
