import { RoleCategory } from './types'

/**
 * Programmatic SEO config: every {role} × {location} combination becomes a
 * landing page at /jobs/[role]/[city] targeting "{role} jobs in {location}".
 *
 * Scope control keeps combinations sensible:
 *  - Locations have a tier ('metro' for cities/suburbs/regions, 'town' for
 *    smaller tourism towns).
 *  - Core roles generate against every location; modifier roles
 *    ("no-experience", "part-time") only target metros (long-tail there is
 *    too thin in small towns).
 */

export interface SeoRole {
  slug: string                 // URL segment, e.g. "waiter"
  label: string                // "Waiter", "Waitress", "Hotel"
  roleCategory?: RoleCategory  // undefined = broad (no single-role filter)
  query?: string               // optional keyword filter for broad slugs
  metroOnly?: boolean          // only pair with metro-tier locations
  intro?: string               // optional custom intro (e.g. modifier roles)
}

export const SEO_ROLES: SeoRole[] = [
  // ── Core roles ──
  { slug: 'waiter', label: 'Waiter', roleCategory: 'waiter' },
  { slug: 'waitress', label: 'Waitress', roleCategory: 'waiter' },
  { slug: 'chef', label: 'Chef', roleCategory: 'chef' },
  { slug: 'cook', label: 'Cook', roleCategory: 'kitchen' },
  { slug: 'kitchen-staff', label: 'Kitchen Staff', roleCategory: 'kitchen' },
  { slug: 'bartender', label: 'Bartender', roleCategory: 'bartender' },
  { slug: 'barista', label: 'Barista', roleCategory: 'barista' },
  { slug: 'housekeeping', label: 'Housekeeping', roleCategory: 'housekeeping' },
  { slug: 'front-desk', label: 'Front Desk', roleCategory: 'front_desk' },
  { slug: 'receptionist', label: 'Hotel Receptionist', roleCategory: 'front_desk' },
  { slug: 'host', label: 'Host / Hostess', roleCategory: 'host' },
  { slug: 'manager', label: 'Restaurant Manager', roleCategory: 'manager' },
  { slug: 'waitering', label: 'Waitering', roleCategory: 'waiter' },
  // ── Broad head terms ──
  { slug: 'hotel', label: 'Hotel', query: 'hotel' },
  { slug: 'hospitality', label: 'Hospitality' },
  { slug: 'restaurant', label: 'Restaurant', query: 'restaurant' },
  // ── Modifier roles (high-intent long-tail, metros only) ──
  { slug: 'no-experience-waiter', label: 'No Experience Waiter', roleCategory: 'waiter', metroOnly: true,
    intro: 'Entry-level waiter jobs that need no prior experience' },
  { slug: 'no-experience-waitress', label: 'No Experience Waitress', roleCategory: 'waiter', metroOnly: true,
    intro: 'Entry-level waitress jobs that need no prior experience' },
  { slug: 'no-experience-hospitality', label: 'No Experience Hospitality', metroOnly: true,
    intro: 'Entry-level hospitality jobs that need no prior experience' },
  { slug: 'part-time-waiter', label: 'Part-Time Waiter', roleCategory: 'waiter', metroOnly: true,
    intro: 'Part-time and shift-based waiter jobs' },
  { slug: 'part-time-waitress', label: 'Part-Time Waitress', roleCategory: 'waiter', metroOnly: true,
    intro: 'Part-time and shift-based waitress jobs' },
  { slug: 'part-time-barista', label: 'Part-Time Barista', roleCategory: 'barista', metroOnly: true,
    intro: 'Part-time and weekend barista jobs' },
]

export type LocationTier = 'metro' | 'town'

export interface SeoLocation {
  slug: string      // "cape-town"
  name: string      // "Cape Town"
  region: string    // shown after the comma; "" to omit (e.g. national)
  tier: LocationTier
}

/** SA cities, suburbs, regions, and tourism towns. */
export const SEO_LOCATIONS: SeoLocation[] = [
  // National + provinces
  { slug: 'south-africa', name: 'South Africa', region: '', tier: 'metro' },
  { slug: 'gauteng', name: 'Gauteng', region: 'South Africa', tier: 'metro' },
  { slug: 'western-cape', name: 'Western Cape', region: 'South Africa', tier: 'metro' },
  { slug: 'kwazulu-natal', name: 'KwaZulu-Natal', region: 'South Africa', tier: 'metro' },
  { slug: 'eastern-cape', name: 'Eastern Cape', region: 'South Africa', tier: 'metro' },
  { slug: 'mpumalanga', name: 'Mpumalanga', region: 'South Africa', tier: 'metro' },
  { slug: 'limpopo', name: 'Limpopo', region: 'South Africa', tier: 'metro' },
  { slug: 'free-state', name: 'Free State', region: 'South Africa', tier: 'town' },
  { slug: 'north-west', name: 'North West', region: 'South Africa', tier: 'town' },
  { slug: 'northern-cape', name: 'Northern Cape', region: 'South Africa', tier: 'town' },

  // Western Cape — Cape Town metro + suburbs
  { slug: 'cape-town', name: 'Cape Town', region: 'Western Cape', tier: 'metro' },
  { slug: 'bellville', name: 'Bellville', region: 'Cape Town', tier: 'metro' },
  { slug: 'durbanville', name: 'Durbanville', region: 'Cape Town', tier: 'metro' },
  { slug: 'claremont', name: 'Claremont', region: 'Cape Town', tier: 'metro' },
  { slug: 'sea-point', name: 'Sea Point', region: 'Cape Town', tier: 'metro' },
  { slug: 'century-city', name: 'Century City', region: 'Cape Town', tier: 'metro' },
  { slug: 'v-and-a-waterfront', name: 'V&A Waterfront', region: 'Cape Town', tier: 'metro' },
  { slug: 'somerset-west', name: 'Somerset West', region: 'Western Cape', tier: 'metro' },
  // Western Cape — winelands & Garden Route towns
  { slug: 'stellenbosch', name: 'Stellenbosch', region: 'Western Cape', tier: 'town' },
  { slug: 'franschhoek', name: 'Franschhoek', region: 'Western Cape', tier: 'town' },
  { slug: 'paarl', name: 'Paarl', region: 'Western Cape', tier: 'town' },
  { slug: 'hermanus', name: 'Hermanus', region: 'Western Cape', tier: 'town' },
  { slug: 'knysna', name: 'Knysna', region: 'Western Cape', tier: 'town' },
  { slug: 'plettenberg-bay', name: 'Plettenberg Bay', region: 'Western Cape', tier: 'town' },
  { slug: 'george', name: 'George', region: 'Western Cape', tier: 'town' },
  { slug: 'mossel-bay', name: 'Mossel Bay', region: 'Western Cape', tier: 'town' },
  { slug: 'oudtshoorn', name: 'Oudtshoorn', region: 'Western Cape', tier: 'town' },
  { slug: 'wilderness', name: 'Wilderness', region: 'Western Cape', tier: 'town' },

  // Gauteng — Johannesburg + suburbs
  { slug: 'johannesburg', name: 'Johannesburg', region: 'Gauteng', tier: 'metro' },
  { slug: 'jhb', name: 'JHB', region: 'Gauteng', tier: 'metro' },
  { slug: 'sandton', name: 'Sandton', region: 'Johannesburg', tier: 'metro' },
  { slug: 'rosebank', name: 'Rosebank', region: 'Johannesburg', tier: 'metro' },
  { slug: 'fourways', name: 'Fourways', region: 'Johannesburg', tier: 'metro' },
  { slug: 'randburg', name: 'Randburg', region: 'Johannesburg', tier: 'metro' },
  { slug: 'roodepoort', name: 'Roodepoort', region: 'Johannesburg', tier: 'metro' },
  { slug: 'bryanston', name: 'Bryanston', region: 'Johannesburg', tier: 'metro' },
  { slug: 'soweto', name: 'Soweto', region: 'Johannesburg', tier: 'metro' },
  // Gauteng — East Rand & Pretoria
  { slug: 'kempton-park', name: 'Kempton Park', region: 'Gauteng', tier: 'metro' },
  { slug: 'alberton', name: 'Alberton', region: 'Gauteng', tier: 'metro' },
  { slug: 'benoni', name: 'Benoni', region: 'Gauteng', tier: 'metro' },
  { slug: 'boksburg', name: 'Boksburg', region: 'Gauteng', tier: 'metro' },
  { slug: 'germiston', name: 'Germiston', region: 'Gauteng', tier: 'metro' },
  { slug: 'pretoria', name: 'Pretoria', region: 'Gauteng', tier: 'metro' },
  { slug: 'centurion', name: 'Centurion', region: 'Gauteng', tier: 'metro' },
  { slug: 'midrand', name: 'Midrand', region: 'Gauteng', tier: 'metro' },
  { slug: 'menlyn', name: 'Menlyn', region: 'Pretoria', tier: 'metro' },

  // KwaZulu-Natal
  { slug: 'durban', name: 'Durban', region: 'KwaZulu-Natal', tier: 'metro' },
  { slug: 'umhlanga', name: 'Umhlanga', region: 'KwaZulu-Natal', tier: 'metro' },
  { slug: 'ballito', name: 'Ballito', region: 'KwaZulu-Natal', tier: 'metro' },
  { slug: 'pinetown', name: 'Pinetown', region: 'Durban', tier: 'metro' },
  { slug: 'pietermaritzburg', name: 'Pietermaritzburg', region: 'KwaZulu-Natal', tier: 'metro' },
  { slug: 'pmb', name: 'PMB', region: 'KwaZulu-Natal', tier: 'town' },
  { slug: 'richards-bay', name: 'Richards Bay', region: 'KwaZulu-Natal', tier: 'town' },

  // Eastern Cape
  { slug: 'gqeberha', name: 'Gqeberha', region: 'Eastern Cape', tier: 'metro' },
  { slug: 'port-elizabeth', name: 'Port Elizabeth', region: 'Eastern Cape', tier: 'metro' },
  { slug: 'east-london', name: 'East London', region: 'Eastern Cape', tier: 'metro' },
  { slug: 'jeffreys-bay', name: 'Jeffreys Bay', region: 'Eastern Cape', tier: 'town' },

  // Mpumalanga / Limpopo (safari & Kruger gateway)
  { slug: 'nelspruit', name: 'Nelspruit', region: 'Mpumalanga', tier: 'metro' },
  { slug: 'mbombela', name: 'Mbombela', region: 'Mpumalanga', tier: 'town' },
  { slug: 'hazyview', name: 'Hazyview', region: 'Mpumalanga', tier: 'town' },
  { slug: 'sabie', name: 'Sabie', region: 'Mpumalanga', tier: 'town' },
  { slug: 'hoedspruit', name: 'Hoedspruit', region: 'Limpopo', tier: 'town' },
  { slug: 'polokwane', name: 'Polokwane', region: 'Limpopo', tier: 'metro' },

  // Free State / North West / Northern Cape
  { slug: 'bloemfontein', name: 'Bloemfontein', region: 'Free State', tier: 'metro' },
  { slug: 'clarens', name: 'Clarens', region: 'Free State', tier: 'town' },
  { slug: 'rustenburg', name: 'Rustenburg', region: 'North West', tier: 'town' },
  { slug: 'sun-city', name: 'Sun City', region: 'North West', tier: 'town' },
  { slug: 'hartbeespoort', name: 'Hartbeespoort', region: 'North West', tier: 'town' },
  { slug: 'kimberley', name: 'Kimberley', region: 'Northern Cape', tier: 'town' },
]

const ROLE_BY_SLUG = new Map(SEO_ROLES.map(r => [r.slug, r]))
const LOCATION_BY_SLUG = new Map(SEO_LOCATIONS.map(l => [l.slug, l]))

export const getSeoRole = (slug: string) => ROLE_BY_SLUG.get(slug) ?? null
export const getSeoLocation = (slug: string) => LOCATION_BY_SLUG.get(slug) ?? null

/** Role × location pairs, respecting metro-only roles. */
export function allSeoJobParams(): { role: string; city: string }[] {
  const out: { role: string; city: string }[] = []
  for (const r of SEO_ROLES) {
    for (const l of SEO_LOCATIONS) {
      if (r.metroOnly && l.tier !== 'metro') continue
      out.push({ role: r.slug, city: l.slug })
    }
  }
  return out
}
