export type RoleCategory =
  | 'waiter'
  | 'chef'
  | 'kitchen'
  | 'housekeeping'
  | 'front_desk'
  | 'bartender'
  | 'barista'
  | 'host'
  | 'manager'
  | 'other'

export type EmploymentType = 'permanent' | 'seasonal' | 'event'

export type JobStatus = 'pending' | 'approved' | 'expired'

export interface Job {
  id: string
  title: string
  role_category: RoleCategory
  location: string
  employment_type: EmploymentType
  pay?: string
  description: string
  employer_name: string
  contact_method: string
  status: JobStatus
  created_at: string
}

export const ROLE_LABELS: Record<RoleCategory, string> = {
  waiter: 'Waiter / Waitress',
  chef: 'Chef',
  kitchen: 'Kitchen Staff',
  housekeeping: 'Housekeeping',
  front_desk: 'Front Desk',
  bartender: 'Bartender',
  barista: 'Barista',
  host: 'Host / Hostess',
  manager: 'Manager',
  other: 'Other',
}


export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  permanent: 'Permanent',
  seasonal: 'Seasonal',
  event: 'Event / Once-off',
}

export const ROLE_CATEGORIES: RoleCategory[] = [
  'waiter', 'chef', 'kitchen', 'housekeeping', 'front_desk',
  'bartender', 'barista', 'host', 'manager', 'other',
]
