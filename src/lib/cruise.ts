/**
 * Cruise-ship hospitality jobs, a real market for South African crew (MSC
 * sails from Durban & Cape Town; agencies recruit heavily here). Content-led
 * landing pages target the "cruise ship jobs" keyword cluster.
 */

export interface CruiseLine {
  slug: string
  name: string
  blurb: string
}

export const CRUISE_LINES: CruiseLine[] = [
  { slug: 'msc', name: 'MSC Cruises', blurb: 'MSC sails seasonally from Durban and Cape Town and is one of the biggest recruiters of South African hospitality crew.' },
  { slug: 'carnival', name: 'Carnival Cruise Line', blurb: 'Carnival hires waiters, bar staff and galley crew for its large fleet, often through approved South African recruitment partners.' },
  { slug: 'royal-caribbean', name: 'Royal Caribbean', blurb: 'Royal Caribbean recruits experienced restaurant, bar and housekeeping crew for its international fleet.' },
  { slug: 'norwegian', name: 'Norwegian Cruise Line', blurb: 'NCL hires food & beverage and hotel-operations crew across its ships worldwide.' },
  { slug: 'celebrity', name: 'Celebrity Cruises', blurb: 'Celebrity Cruises looks for polished fine-dining and bar service crew for its premium fleet.' },
  { slug: 'princess', name: 'Princess Cruises', blurb: 'Princess Cruises recruits restaurant, bar and housekeeping staff on fixed-term contracts.' },
]

const LINE_BY_SLUG = new Map(CRUISE_LINES.map(l => [l.slug, l]))
export const getCruiseLine = (slug: string) => LINE_BY_SLUG.get(slug) ?? null

export const CRUISE_ROLES = [
  { name: 'Assistant Waiter / Waiter', note: 'Entry point on most lines, restaurant service across multiple sittings.' },
  { name: 'Bartender / Bar Steward', note: 'High-tip roles on busy bars, lounges and pool decks.' },
  { name: 'Cabin Steward / Housekeeping', note: 'Servicing guest staterooms, strong demand, entry-level friendly.' },
  { name: 'Galley / Commis Chef', note: 'Kitchen crew supporting high-volume service.' },
  { name: 'Barista / Café Attendant', note: 'Specialty coffee and café outlets on board.' },
  { name: 'Host / Guest Services', note: 'Front-of-house and guest relations roles.' },
]

export const CRUISE_FAQS = [
  {
    q: 'Do I need experience to work on a cruise ship?',
    a: 'For entry roles like assistant waiter, cabin steward or galley assistant, many lines accept candidates with limited experience but strong restaurant or hospitality basics. Bar and fine-dining roles usually want 1–2 years of service experience.',
  },
  {
    q: 'How much do cruise ship hospitality workers earn?',
    a: 'Pay is in USD and tax-light, with food and accommodation covered on board. Entry roles typically earn around USD 1,200–1,800/month including tips; experienced waiters and bartenders can earn USD 2,500+ during busy itineraries.',
  },
  {
    q: 'Which cruise lines hire South Africans?',
    a: 'MSC Cruises recruits heavily in South Africa and sails locally from Durban and Cape Town in summer. Carnival, Royal Caribbean, Norwegian, Celebrity and Princess also hire South African crew, usually through approved recruitment agencies.',
  },
  {
    q: 'How do I apply for cruise ship jobs from South Africa?',
    a: 'Most placements go through accredited maritime recruitment agencies. You will need a valid passport, a seafarer medical certificate, and basic STCW safety training. Prepare a one-page hospitality CV and apply to several lines, contracts usually run 6–9 months.',
  },
]
