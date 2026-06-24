import { RoleCategory } from './types'

/**
 * Programmatic SEO config: every {role} × {location} combination becomes a
 * landing page at /jobs/[role]/[city] targeting "{role} jobs in {city}".
 *
 * Roles include keyword synonyms (waiter/waitress, cook, receptionist) that map
 * to the same underlying role_category, plus broad categories (hotel,
 * hospitality, restaurant) that don't filter by a single role.
 */

export interface SeoRole {
  slug: string                 // URL segment, e.g. "waiter"
  label: string                // "Waiter", "Waitress", "Hotel"
  roleCategory?: RoleCategory  // undefined = broad (no single-role filter)
  query?: string               // optional keyword filter for broad slugs
}

export const SEO_ROLES: SeoRole[] = [
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
  // Broad categories (high-volume head terms)
  { slug: 'hotel', label: 'Hotel', query: 'hotel' },
  { slug: 'hospitality', label: 'Hospitality' },
  { slug: 'restaurant', label: 'Restaurant', query: 'restaurant' },
  { slug: 'waitering', label: 'Waitering', roleCategory: 'waiter' },
]

export interface SeoLocation {
  slug: string      // "cape-town"
  name: string      // "Cape Town"
  province: string
}

/** Comprehensive SA cities + hospitality/tourism towns. */
export const SEO_LOCATIONS: SeoLocation[] = [
  // Western Cape
  { slug: 'cape-town', name: 'Cape Town', province: 'Western Cape' },
  { slug: 'stellenbosch', name: 'Stellenbosch', province: 'Western Cape' },
  { slug: 'franschhoek', name: 'Franschhoek', province: 'Western Cape' },
  { slug: 'paarl', name: 'Paarl', province: 'Western Cape' },
  { slug: 'hermanus', name: 'Hermanus', province: 'Western Cape' },
  { slug: 'knysna', name: 'Knysna', province: 'Western Cape' },
  { slug: 'plettenberg-bay', name: 'Plettenberg Bay', province: 'Western Cape' },
  { slug: 'george', name: 'George', province: 'Western Cape' },
  { slug: 'mossel-bay', name: 'Mossel Bay', province: 'Western Cape' },
  { slug: 'oudtshoorn', name: 'Oudtshoorn', province: 'Western Cape' },
  { slug: 'wilderness', name: 'Wilderness', province: 'Western Cape' },
  { slug: 'somerset-west', name: 'Somerset West', province: 'Western Cape' },
  // Gauteng
  { slug: 'johannesburg', name: 'Johannesburg', province: 'Gauteng' },
  { slug: 'sandton', name: 'Sandton', province: 'Gauteng' },
  { slug: 'pretoria', name: 'Pretoria', province: 'Gauteng' },
  { slug: 'centurion', name: 'Centurion', province: 'Gauteng' },
  { slug: 'midrand', name: 'Midrand', province: 'Gauteng' },
  { slug: 'roodepoort', name: 'Roodepoort', province: 'Gauteng' },
  { slug: 'soweto', name: 'Soweto', province: 'Gauteng' },
  // KwaZulu-Natal
  { slug: 'durban', name: 'Durban', province: 'KwaZulu-Natal' },
  { slug: 'umhlanga', name: 'Umhlanga', province: 'KwaZulu-Natal' },
  { slug: 'ballito', name: 'Ballito', province: 'KwaZulu-Natal' },
  { slug: 'pietermaritzburg', name: 'Pietermaritzburg', province: 'KwaZulu-Natal' },
  { slug: 'richards-bay', name: 'Richards Bay', province: 'KwaZulu-Natal' },
  // Eastern Cape
  { slug: 'gqeberha', name: 'Gqeberha', province: 'Eastern Cape' },
  { slug: 'port-elizabeth', name: 'Port Elizabeth', province: 'Eastern Cape' },
  { slug: 'east-london', name: 'East London', province: 'Eastern Cape' },
  { slug: 'jeffreys-bay', name: 'Jeffreys Bay', province: 'Eastern Cape' },
  // Mpumalanga (safari / Kruger gateway)
  { slug: 'nelspruit', name: 'Nelspruit', province: 'Mpumalanga' },
  { slug: 'mbombela', name: 'Mbombela', province: 'Mpumalanga' },
  { slug: 'hazyview', name: 'Hazyview', province: 'Mpumalanga' },
  { slug: 'hoedspruit', name: 'Hoedspruit', province: 'Limpopo' },
  { slug: 'sabie', name: 'Sabie', province: 'Mpumalanga' },
  // Free State, North West, Northern Cape, Limpopo
  { slug: 'bloemfontein', name: 'Bloemfontein', province: 'Free State' },
  { slug: 'clarens', name: 'Clarens', province: 'Free State' },
  { slug: 'rustenburg', name: 'Rustenburg', province: 'North West' },
  { slug: 'sun-city', name: 'Sun City', province: 'North West' },
  { slug: 'hartbeespoort', name: 'Hartbeespoort', province: 'North West' },
  { slug: 'kimberley', name: 'Kimberley', province: 'Northern Cape' },
  { slug: 'polokwane', name: 'Polokwane', province: 'Limpopo' },
]

const ROLE_BY_SLUG = new Map(SEO_ROLES.map(r => [r.slug, r]))
const LOCATION_BY_SLUG = new Map(SEO_LOCATIONS.map(l => [l.slug, l]))

export const getSeoRole = (slug: string) => ROLE_BY_SLUG.get(slug) ?? null
export const getSeoLocation = (slug: string) => LOCATION_BY_SLUG.get(slug) ?? null

/** Every role × location pair — used for the sitemap and static params. */
export function allSeoJobParams(): { role: string; city: string }[] {
  const out: { role: string; city: string }[] = []
  for (const r of SEO_ROLES) {
    for (const l of SEO_LOCATIONS) {
      out.push({ role: r.slug, city: l.slug })
    }
  }
  return out
}
