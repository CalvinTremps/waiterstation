export type PipelineStage = 'new' | 'reviewed' | 'shortlisted' | 'interview' | 'offered' | 'hired' | 'rejected'

export interface Applicant {
  id: string
  name: string
  email: string
  phone: string
  location: string
  role_applied: string
  job_id: string
  job_title: string
  experience_years: number
  experience_summary: string
  skills: string[]
  languages: string[]
  availability: string
  stage: PipelineStage
  applied_at: string
  notes: string
  saved: boolean
  rating: number | null
  resume_url?: string
  avatar_initials: string
  avatar_color: string
}

export interface Interview {
  id: string
  applicant_id: string
  applicant_name: string
  job_title: string
  date: string
  time: string
  type: 'in-person' | 'phone' | 'video'
  location?: string
  notes: string
  outcome: 'pending' | 'offered' | 'rejected' | 'no-show'
}

export interface EmployerJob {
  id: string
  title: string
  role_category: string
  location: string
  employment_type: 'permanent' | 'seasonal' | 'event'
  pay?: string
  status: 'live' | 'under_review' | 'paused' | 'expired' | 'draft'
  posted_at: string
  expires_at: string
  applicants: number
  views: number
  daily_views: number[]
}

export interface AnalyticsSeries {
  date: string
  views: number
  applies: number
}

const now = Date.now()
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString()

export const EMPLOYER_JOBS: EmployerJob[] = [
  {
    id: 'ej-1',
    title: 'Senior Waiter / Floor Captain',
    role_category: 'waiter',
    location: 'Cape Town, V&A Waterfront',
    employment_type: 'permanent',
    pay: 'R8 500/month + tips',
    status: 'live',
    posted_at: daysAgo(14),
    expires_at: daysAgo(-16),
    applicants: 24,
    views: 312,
    daily_views: [18, 24, 31, 27, 22, 19, 15, 21, 28, 25, 20, 14, 13, 16],
  },
  {
    id: 'ej-2',
    title: 'Bartender – Cocktail Bar',
    role_category: 'bartender',
    location: 'Cape Town, De Waterkant',
    employment_type: 'permanent',
    pay: 'R7 500/month + tips',
    status: 'live',
    posted_at: daysAgo(7),
    expires_at: daysAgo(-23),
    applicants: 11,
    views: 187,
    daily_views: [22, 35, 28, 19, 24, 31, 28],
  },
  {
    id: 'ej-3',
    title: 'Head Chef – Mediterranean Kitchen',
    role_category: 'chef',
    location: 'Cape Town, Camps Bay',
    employment_type: 'permanent',
    pay: 'R22 000/month',
    status: 'under_review',
    posted_at: daysAgo(1),
    expires_at: daysAgo(-29),
    applicants: 3,
    views: 44,
    daily_views: [12, 32],
  },
  {
    id: 'ej-4',
    title: 'Event Waiters x8 - New Year Function',
    role_category: 'waiter',
    location: 'Cape Town, Century City',
    employment_type: 'event',
    pay: 'R850/day',
    status: 'expired',
    posted_at: daysAgo(60),
    expires_at: daysAgo(30),
    applicants: 41,
    views: 589,
    daily_views: [45, 62, 78, 55, 43, 38, 29, 22, 18, 14, 10, 8, 6, 5, 4, 3, 2, 2, 1, 1],
  },
  {
    id: 'ej-5',
    title: 'Front Desk Agent',
    role_category: 'front_desk',
    location: 'Cape Town, City Bowl',
    employment_type: 'permanent',
    pay: 'R9 500/month',
    status: 'paused',
    posted_at: daysAgo(21),
    expires_at: daysAgo(-9),
    applicants: 8,
    views: 103,
    daily_views: [12, 18, 14, 9, 8, 7, 6, 5, 4, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1],
  },
  {
    id: 'ej-6',
    title: 'Barista – Specialty Coffee',
    role_category: 'barista',
    location: 'Cape Town, Woodstock',
    employment_type: 'permanent',
    pay: 'R7 000/month',
    status: 'draft',
    posted_at: daysAgo(0),
    expires_at: daysAgo(-30),
    applicants: 0,
    views: 0,
    daily_views: [],
  },
]

export const MOCK_APPLICANTS: Applicant[] = [
  {
    id: 'ap-1',
    name: 'Thabo Nkosi',
    email: 'thabo.nkosi@gmail.com',
    phone: '+27 82 441 3320',
    location: 'Cape Town, Mitchells Plain',
    role_applied: 'waiter',
    job_id: 'ej-1',
    job_title: 'Senior Waiter / Floor Captain',
    experience_years: 5,
    experience_summary: '5 years in fine dining at Norval Foundation and Shortmarket Club. Strong wine knowledge and WSET Level 2 certified. Experienced in training junior staff.',
    skills: ['Fine dining', 'Wine service', 'POS systems', 'Team leadership', 'Upselling'],
    languages: ['English', 'Afrikaans', 'Xhosa'],
    availability: 'Available immediately',
    stage: 'shortlisted',
    applied_at: daysAgo(10),
    notes: 'Strong CV, great references from Shortmarket Club. Schedule interview for next week.',
    saved: true,
    rating: 4,
    avatar_initials: 'TN',
    avatar_color: 'bg-emerald-600',
  },
  {
    id: 'ap-2',
    name: 'Amahle Khumalo',
    email: 'amahle.k@outlook.com',
    phone: '+27 71 885 6612',
    location: 'Cape Town, Bellville',
    role_applied: 'waiter',
    job_id: 'ej-1',
    job_title: 'Senior Waiter / Floor Captain',
    experience_years: 3,
    experience_summary: '3 years at The Test Kitchen pop-up and Planet Restaurant (Mount Nelson). Excellent guest scores, consistent upselling performance.',
    skills: ['Guest relations', 'Upselling', 'Allergen knowledge', 'MICROS POS'],
    languages: ['English', 'Zulu'],
    availability: '2 weeks notice',
    stage: 'interview',
    applied_at: daysAgo(9),
    notes: 'Interview booked 28 June at 10am. Very enthusiastic on call.',
    saved: true,
    rating: 5,
    avatar_initials: 'AK',
    avatar_color: 'bg-purple-600',
  },
  {
    id: 'ap-3',
    name: 'Lerato Molefe',
    email: 'lerato.molefe@yahoo.com',
    phone: '+27 63 774 0921',
    location: 'Cape Town, Claremont',
    role_applied: 'waiter',
    job_id: 'ej-1',
    job_title: 'Senior Waiter / Floor Captain',
    experience_years: 7,
    experience_summary: 'Senior waiter at La Colombe (7 years). Currently head of floor team. Looking for a change closer to the waterfront. Impeccable fine-dining standards.',
    skills: ['Floor management', 'Fine dining', 'Wine pairing', 'Staff training', 'Sommelier'],
    languages: ['English', 'French (basic)', 'Sotho'],
    availability: '1 month notice',
    stage: 'offered',
    applied_at: daysAgo(13),
    notes: 'Offer extended. Waiting on response by Friday.',
    saved: true,
    rating: 5,
    avatar_initials: 'LM',
    avatar_color: 'bg-blue-600',
  },
  {
    id: 'ap-4',
    name: 'Sipho Dlamini',
    email: 'siphodlamini88@gmail.com',
    phone: '+27 84 332 1109',
    location: 'Cape Town, Gugulethu',
    role_applied: 'waiter',
    job_id: 'ej-1',
    job_title: 'Senior Waiter / Floor Captain',
    experience_years: 2,
    experience_summary: 'Waiter at Belmond Mount Nelson for 2 years. Good attitude, learning fast but still developing senior service skills.',
    skills: ['Guest service', 'Food knowledge', 'Teamwork'],
    languages: ['English', 'Zulu', 'Xhosa'],
    availability: 'Available immediately',
    stage: 'reviewed',
    applied_at: daysAgo(8),
    notes: '',
    saved: false,
    rating: 3,
    avatar_initials: 'SD',
    avatar_color: 'bg-amber-600',
  },
  {
    id: 'ap-5',
    name: 'Nomsa Vilakazi',
    email: 'nomsa.v@proton.me',
    phone: '+27 76 990 4455',
    location: 'Cape Town, Khayelitsha',
    role_applied: 'waiter',
    job_id: 'ej-1',
    job_title: 'Senior Waiter / Floor Captain',
    experience_years: 4,
    experience_summary: 'Four years split between Pier restaurant and Quay Four on the Waterfront. Knows the area well. Strong in high-volume service.',
    skills: ['High-volume service', 'Outdoor events', 'POS systems', 'Cash handling'],
    languages: ['English', 'Xhosa'],
    availability: 'Available immediately',
    stage: 'new',
    applied_at: daysAgo(1),
    notes: '',
    saved: false,
    rating: null,
    avatar_initials: 'NV',
    avatar_color: 'bg-rose-600',
  },
  {
    id: 'ap-6',
    name: 'Riaan Botha',
    email: 'riaan.botha@icloud.com',
    phone: '+27 82 115 7823',
    location: 'Cape Town, Parow',
    role_applied: 'waiter',
    job_id: 'ej-1',
    job_title: 'Senior Waiter / Floor Captain',
    experience_years: 6,
    experience_summary: '6 years as head waiter at Delaire Graff, Stellenbosch. Deep wine education, exceptional wine list knowledge. Fluent in German (useful with European tourists).',
    skills: ['Fine dining', 'German-speaking', 'Wine service', 'Leadership', 'Estate experience'],
    languages: ['English', 'Afrikaans', 'German'],
    availability: '3 weeks notice',
    stage: 'shortlisted',
    applied_at: daysAgo(6),
    notes: 'Excellent wine credentials. Strong candidate for floor captain role.',
    saved: true,
    rating: 4,
    avatar_initials: 'RB',
    avatar_color: 'bg-indigo-600',
  },
  {
    id: 'ap-7',
    name: 'Zanele Sithole',
    email: 'zanele.s@gmail.com',
    phone: '+27 71 643 8801',
    location: 'Cape Town, Mowbray',
    role_applied: 'waiter',
    job_id: 'ej-1',
    job_title: 'Senior Waiter / Floor Captain',
    experience_years: 1,
    experience_summary: 'Graduate from capsicum culinary studio (front of house). 1 year experience at Café Caprice. Very eager.',
    skills: ['Food knowledge', 'Mixology basics', 'English'],
    languages: ['English', 'Zulu'],
    availability: 'Available immediately',
    stage: 'rejected',
    applied_at: daysAgo(11),
    notes: 'Too junior for senior role. Encouraged to reapply in 2 years.',
    saved: false,
    rating: 2,
    avatar_initials: 'ZS',
    avatar_color: 'bg-gray-500',
  },
  {
    id: 'ap-8',
    name: 'Dylan Meyer',
    email: 'dylan.meyer@outlook.com',
    phone: '+27 84 556 2290',
    location: 'Cape Town, Sea Point',
    role_applied: 'bartender',
    job_id: 'ej-2',
    job_title: 'Bartender – Cocktail Bar',
    experience_years: 4,
    experience_summary: '4 years at The Gin Bar and Cause & Effect Cocktail Kitchen. Specialises in classic cocktails and rotational menus. Won Cape Town bartender competition 2024.',
    skills: ['Classic cocktails', 'Spirits knowledge', 'Bar management', 'Customer banter', 'Stock control'],
    languages: ['English', 'Afrikaans'],
    availability: 'Available immediately',
    stage: 'interview',
    applied_at: daysAgo(5),
    notes: 'Impressive cocktail credentials. Interview scheduled for Friday 4pm.',
    saved: true,
    rating: 5,
    avatar_initials: 'DM',
    avatar_color: 'bg-emerald-700',
  },
  {
    id: 'ap-9',
    name: 'Priya Pillay',
    email: 'priya.pillay@gmail.com',
    phone: '+27 63 889 3341',
    location: 'Cape Town, Woodstock',
    role_applied: 'bartender',
    job_id: 'ej-2',
    job_title: 'Bartender – Cocktail Bar',
    experience_years: 3,
    experience_summary: 'Bartender at Orphanage Cocktail Emporium (3 years). Excellent with guests, natural upseller. Studies spirits education in her own time.',
    skills: ['Cocktail crafting', 'Upselling', 'Customer service', 'Inventory'],
    languages: ['English', 'Tamil (basic)'],
    availability: '1 week notice',
    stage: 'shortlisted',
    applied_at: daysAgo(4),
    notes: '',
    saved: false,
    rating: 4,
    avatar_initials: 'PP',
    avatar_color: 'bg-pink-600',
  },
  {
    id: 'ap-10',
    name: 'Keanu Adams',
    email: 'keanu.a@gmail.com',
    phone: '+27 82 774 5510',
    location: 'Cape Town, Athlone',
    role_applied: 'bartender',
    job_id: 'ej-2',
    job_title: 'Bartender – Cocktail Bar',
    experience_years: 2,
    experience_summary: '2 years bartending at Loading Bay and Truth Coffee. Strong espresso martini game. Keen to grow into a senior bartender role.',
    skills: ['Coffee cocktails', 'Speed service', 'POS systems'],
    languages: ['English', 'Afrikaans'],
    availability: 'Available immediately',
    stage: 'new',
    applied_at: daysAgo(2),
    notes: '',
    saved: false,
    rating: null,
    avatar_initials: 'KA',
    avatar_color: 'bg-teal-600',
  },
  {
    id: 'ap-11',
    name: 'Chantelle du Plessis',
    email: 'chantelle.dp@icloud.com',
    phone: '+27 71 002 8834',
    location: 'Cape Town, Hout Bay',
    role_applied: 'chef',
    job_id: 'ej-3',
    job_title: 'Head Chef – Mediterranean Kitchen',
    experience_years: 12,
    experience_summary: 'Trained at Le Cordon Bleu London. Sous chef at Pierneef à La Motte (4 years), head chef at Kitima (5 years). Specialises in Mediterranean and North African cuisines.',
    skills: ['Menu development', 'Kitchen management', 'Staff training', 'Cost control', 'Mediterranean cuisine'],
    languages: ['English', 'Afrikaans', 'French (intermediate)'],
    availability: '1 month notice',
    stage: 'shortlisted',
    applied_at: daysAgo(0),
    notes: 'Outstanding CV. Arrange tasting session.',
    saved: true,
    rating: 5,
    avatar_initials: 'CD',
    avatar_color: 'bg-orange-600',
  },
  {
    id: 'ap-12',
    name: 'Marco Ferreira',
    email: 'marco.ferreira@gmail.com',
    phone: '+27 84 113 6670',
    location: 'Cape Town, Green Point',
    role_applied: 'chef',
    job_id: 'ej-3',
    job_title: 'Head Chef – Mediterranean Kitchen',
    experience_years: 8,
    experience_summary: 'Head chef at Bukhara (Indian) and chef de partie at Azure (Twelve Apostles). Mediterranean exposure through personal travel and private dining pop-ups.',
    skills: ['Spice profiling', 'Menu development', 'Private dining', 'Team leadership'],
    languages: ['English', 'Portuguese', 'Afrikaans'],
    availability: '2 weeks notice',
    stage: 'new',
    applied_at: daysAgo(0),
    notes: '',
    saved: false,
    rating: null,
    avatar_initials: 'MF',
    avatar_color: 'bg-red-600',
  },
]

export const MOCK_INTERVIEWS: Interview[] = [
  {
    id: 'int-1',
    applicant_id: 'ap-2',
    applicant_name: 'Amahle Khumalo',
    job_title: 'Senior Waiter / Floor Captain',
    date: new Date(now + 7 * 86400000).toISOString().split('T')[0],
    time: '10:00',
    type: 'in-person',
    location: 'V&A Waterfront, 3rd floor office',
    notes: 'Ask about her experience at Planet Restaurant. Discuss shift flexibility.',
    outcome: 'pending',
  },
  {
    id: 'int-2',
    applicant_id: 'ap-8',
    applicant_name: 'Dylan Meyer',
    job_title: 'Bartender – Cocktail Bar',
    date: new Date(now + 3 * 86400000).toISOString().split('T')[0],
    time: '16:00',
    type: 'in-person',
    location: 'De Waterkant bar – ask for Mia',
    notes: 'Practical cocktail assessment to follow the interview. Max 30 mins.',
    outcome: 'pending',
  },
  {
    id: 'int-3',
    applicant_id: 'ap-6',
    applicant_name: 'Riaan Botha',
    job_title: 'Senior Waiter / Floor Captain',
    date: new Date(now + 10 * 86400000).toISOString().split('T')[0],
    time: '14:00',
    type: 'video',
    notes: 'Google Meet. Will send link 1 hour before.',
    outcome: 'pending',
  },
  {
    id: 'int-4',
    applicant_id: 'ap-11',
    applicant_name: 'Chantelle du Plessis',
    job_title: 'Head Chef – Mediterranean Kitchen',
    date: new Date(now + 14 * 86400000).toISOString().split('T')[0],
    time: '11:00',
    type: 'in-person',
    location: 'Camps Bay kitchen – service entrance',
    notes: 'Tasting session: ask her to bring a sample of one dish.',
    outcome: 'pending',
  },
  {
    id: 'int-5',
    applicant_id: 'ap-4',
    applicant_name: 'Sipho Dlamini',
    job_title: 'Senior Waiter / Floor Captain',
    date: new Date(now - 5 * 86400000).toISOString().split('T')[0],
    time: '09:00',
    type: 'phone',
    notes: 'Brief call to assess communication skills.',
    outcome: 'rejected',
  },
  {
    id: 'int-6',
    applicant_id: 'ap-3',
    applicant_name: 'Lerato Molefe',
    job_title: 'Senior Waiter / Floor Captain',
    date: new Date(now - 3 * 86400000).toISOString().split('T')[0],
    time: '13:00',
    type: 'in-person',
    location: 'V&A Waterfront, 3rd floor office',
    notes: 'Exceptional candidate. Offer extended after this interview.',
    outcome: 'offered',
  },
]

export const MOCK_SAVED_CANDIDATES: Applicant[] = MOCK_APPLICANTS.filter(a => a.saved)

export const PIPELINE_STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: 'new',        label: 'New',         color: 'bg-gray-100 text-gray-600' },
  { key: 'reviewed',   label: 'Reviewed',    color: 'bg-blue-50 text-blue-700' },
  { key: 'shortlisted',label: 'Shortlisted', color: 'bg-amber-50 text-amber-700' },
  { key: 'interview',  label: 'Interview',   color: 'bg-purple-50 text-purple-700' },
  { key: 'offered',    label: 'Offered',     color: 'bg-emerald-50 text-emerald-700' },
  { key: 'hired',      label: 'Hired',       color: 'bg-emerald-600 text-white' },
  { key: 'rejected',   label: 'Rejected',    color: 'bg-red-50 text-red-600' },
]

export const MOCK_EMPLOYER_PROFILE = {
  name: 'One&Only Cape Town',
  venue_type: 'Five-star hotel',
  location: 'V&A Waterfront, Cape Town',
  website: 'https://www.oneandonlycapetown.com',
  description: 'One&Only Cape Town is a landmark five-star hotel on the V&A Waterfront with panoramic views of Table Mountain. Home to award-winning restaurants, a world-class spa, and an international guest base.',
  size: '200–500 employees',
  benefits: ['Medical aid', 'Staff meals', 'Provident fund', 'International travel', 'Training programmes'],
  social: {
    instagram: '@oneandonlycapetown',
    facebook: 'OnlyCT',
  },
}

const SEEDED_VIEWS =  [18, 24, 31, 27, 22, 19, 28, 33, 25, 21, 29, 35, 30, 26]
const SEEDED_APPLIES = [2,  3,  4,  3,  2,  2,  3,  4,  3,  2,  3,  4,  3,  2]

export const ANALYTICS_SERIES: AnalyticsSeries[] = Array.from({ length: 14 }, (_, i) => ({
  date: new Date(now - (13 - i) * 86400000).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }),
  views: SEEDED_VIEWS[i],
  applies: SEEDED_APPLIES[i],
}))
