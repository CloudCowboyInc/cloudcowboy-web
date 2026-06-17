/**
 * Per-event detail for the GTM Events page: exact dates, location, signup link,
 * description, and travel-day allowance. Keyed by the event id (slug) from
 * src/lib/model/data.ts (EVENT_SHOWS). The cost + tier live there; this adds
 * scheduling and sign-up detail.
 *
 * Dates for the 2026–2027 circuit: those marked `dateConfirmed: true` were
 * verified against the organizer's published schedule; the rest are scheduled
 * to the spec month from the most recent prior-year dates and should be
 * confirmed (shown as "est." in the UI).
 */

export interface EventDetail {
  /** First show day, ISO yyyy-mm-dd. */
  start: string;
  /** Last show day, ISO yyyy-mm-dd. */
  end: string;
  location: string;
  signupUrl?: string;
  dateConfirmed: boolean;
  /** Travel days allowed on each side of the show. */
  travelDays: number;
  description: string;
}

export const EVENT_DETAILS: Record<string, EventDetail> = {
  "nebraska-ag-spray-drone-conference": {
    start: "2026-08-20",
    end: "2026-08-21",
    location: "Norfolk, NE",
    signupUrl: "https://events.unl.edu/AgDroneConference/",
    dateConfirmed: false,
    travelDays: 1,
    description:
      "UNL's Nebraska Ag & Spray Drone Conference — two days of education, demos and networking on drones in agriculture, from crop scouting to spray technology. A high-fit audience of exactly the drone operators in our beachhead.",
  },
  "farm-progress-show": {
    start: "2026-09-01",
    end: "2026-09-03",
    location: "Boone, IA",
    signupUrl: "https://www.farmprogressshow.com/",
    dateConfirmed: true,
    travelDays: 1,
    description:
      "The nation's largest outdoor farm show, biennially in Boone, IA. Massive grower and service-provider attendance — a top-tier presence for reaching scale operators across the Corn Belt.",
  },
  "commercial-uav-expo-americas": {
    start: "2026-09-01",
    end: "2026-09-03",
    location: "Las Vegas, NV",
    signupUrl: "https://www.expouav.com/",
    dateConfirmed: true,
    travelDays: 2,
    description:
      "The leading commercial drone trade show (Caesars Forum, Las Vegas). Strong for the drone-application side of the beachhead and for partnerships across the UAV ecosystem.",
  },
  "husker-harvest-days": {
    start: "2026-09-15",
    end: "2026-09-17",
    location: "Grand Island, NE",
    signupUrl: "https://www.huskerharvestdays.com/",
    dateConfirmed: true,
    travelDays: 1,
    description:
      "The world's largest totally-irrigated working farm show. Heavy hands-on demo attendance from row-crop operators — strong fit for custom application and service discovery.",
  },
  "farm-science-review": {
    start: "2026-09-22",
    end: "2026-09-24",
    location: "London, OH",
    signupUrl: "https://fsr.osu.edu/",
    dateConfirmed: true,
    travelDays: 2,
    description:
      "Ohio State's Farm Science Review at the Molly Caren Ag Center — a premier Midwest education + demo event reaching tens of thousands of growers and agribusiness professionals.",
  },
  "ozark-fall-farmfest": {
    start: "2026-10-02",
    end: "2026-10-04",
    location: "Springfield, MO",
    signupUrl: "https://ozarkfallfarmfest.com/",
    dateConfirmed: true,
    travelDays: 1,
    description:
      "Ozark Empire Fairgrounds farm show spanning livestock and row-crop operators across the Ozarks — an optional regional add to broaden the funnel.",
  },
  "sunbelt-ag-expo": {
    start: "2026-10-20",
    end: "2026-10-22",
    location: "Moultrie, GA",
    signupUrl: "https://sunbeltexpo.com/",
    dateConfirmed: true,
    travelDays: 2,
    description:
      "North America's premier farm show for the Southeast. Strong reach into cotton, peanut and specialty operations — diversifies the pipeline beyond the Plains.",
  },
  "colorado-aaa-convention-coaaa": {
    start: "2026-11-18",
    end: "2026-11-19",
    location: "Colorado",
    signupUrl: "https://www.coagav.org/",
    dateConfirmed: false,
    travelDays: 1,
    description:
      "Colorado Agricultural Aviation Association convention & trade show — applicator CEUs and the core aerial-application community in our home region. Top relationship-building value.",
  },
  "naaa-ag-aviation-expo": {
    start: "2026-12-07",
    end: "2026-12-10",
    location: "Savannah, GA (TBC)",
    signupUrl: "https://www.agaviation.org/ag-aviation-expo/",
    dateConfirmed: false,
    travelDays: 2,
    description:
      "The National Agricultural Aviation Association's annual expo — the largest gathering of ag-aviation operators in the US. Top-tier for the aerial-application beachhead.",
  },
  "national-western-stock-show": {
    start: "2027-01-09",
    end: "2027-01-24",
    location: "Denver, CO",
    signupUrl: "https://nationalwestern.com/",
    dateConfirmed: true,
    travelDays: 1,
    description:
      "The 16-day National Western Stock Show in Denver — a Colorado institution serving the livestock and ranching community. Optional, local, high-foot-traffic presence.",
  },
  "colorado-farm-show": {
    start: "2027-01-26",
    end: "2027-01-28",
    location: "Greeley, CO",
    signupUrl: "https://www.coloradofarmshow.com/",
    dateConfirmed: true,
    travelDays: 1,
    description:
      "Greeley's Colorado Farm Show at Island Grove — a strong, free, home-region show reaching Front Range growers and service operators.",
  },
  "spray-drone-end-user-conf-sdeuc": {
    start: "2027-02-02",
    end: "2027-02-04",
    location: "Kansas City, MO",
    signupUrl: "https://www.sdeuc.com/",
    dateConfirmed: false,
    travelDays: 1,
    description:
      "The Spray Drone End User Conference — the single most concentrated audience of spray-drone operators in the country. Top fit for the beachhead; 2027 dates to confirm.",
  },
  "ag-conference-of-the-southern-rockies": {
    start: "2027-02-10",
    end: "2027-02-11",
    location: "Colorado",
    dateConfirmed: false,
    travelDays: 1,
    description:
      "Regional Southern Rockies ag conference — a strong, low-cost touchpoint with Front Range and mountain-region operators. Dates to confirm.",
  },
  "western-co-farm-ranch-innovation": {
    start: "2027-02-17",
    end: "2027-02-18",
    location: "Western Colorado",
    dateConfirmed: false,
    travelDays: 1,
    description:
      "Western Colorado farm & ranch innovation event — a top home-region relationship builder on the Western Slope. Dates to confirm.",
  },
  "commodity-classic": {
    start: "2027-03-03",
    end: "2027-03-05",
    location: "New Orleans, LA",
    signupUrl: "https://commodityclassic.com/",
    dateConfirmed: true,
    travelDays: 2,
    description:
      "America's largest farmer-led, farmer-focused convention & trade show. Strong reach into the largest, most progressive row-crop operations in the country.",
  },
  "four-states-ag-expo": {
    start: "2027-03-12",
    end: "2027-03-13",
    location: "Cortez, CO",
    signupUrl: "https://fourstatesagexpo.com/",
    dateConfirmed: false,
    travelDays: 1,
    description:
      "Four Corners regional ag expo at the Montezuma County Fairgrounds — an optional, low-cost touchpoint for the Four-States region. Dates to confirm.",
  },
  "xponential-auvsi": {
    start: "2027-05-17",
    end: "2027-05-20",
    location: "Miami, FL",
    signupUrl: "https://www.xponential.org/",
    dateConfirmed: true,
    travelDays: 2,
    description:
      "AUVSI XPONENTIAL — the largest uncrewed-systems and robotics exhibition. Optional but high-visibility for the autonomy/partnership narrative.",
  },
  "csu-wheat-field-days": {
    start: "2027-06-23",
    end: "2027-06-24",
    location: "Colorado (CSU)",
    signupUrl: "https://wheat.colostate.edu/",
    dateConfirmed: false,
    travelDays: 1,
    description:
      "Colorado State University wheat field days — a low-cost, hands-on, home-region touchpoint with wheat growers. Dates to confirm.",
  },
};

/** Sum of eventYearFactor over the 6 model years (0.5+1+1.1+1.21+1.331+1.4641). */
export const SIX_YEAR_EVENT_MULTIPLIER = 6.6051;

/** Estimated cost allocation for an event total (sums exactly to total). */
export function priceBreakdown(total: number): { label: string; amount: number }[] {
  const booth = Math.round(total * 0.55);
  const travel = Math.round(total * 0.2);
  const lodging = Math.round(total * 0.15);
  const meals = total - booth - travel - lodging;
  return [
    { label: "Booth & registration", amount: booth },
    { label: "Travel (airfare / fuel)", amount: travel },
    { label: "Lodging", amount: lodging },
    { label: "Meals & incidentals", amount: meals },
  ];
}

/** Month-name short labels. */
export const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Parse an ISO yyyy-mm-dd into a local Date (no TZ surprises). */
export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Format an ISO date range like "Sep 1–3, 2026" or "Mar 3, 2027". */
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
